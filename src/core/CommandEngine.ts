import type { CommandResult, Portfolio } from "../types";
import { FileSystem } from "./FileSystem";
import { HistoryManager } from "./HistoryManager";

// ---------------------------------------------------------------------------
// CommandEngine: the single place that turns a typed string into a renderable
// CommandResult. It is data-driven — every non-builtin command's behaviour is
// described by its output_type in portfolio.json.
// ---------------------------------------------------------------------------

const BUILTINS = new Set([
  "pwd",
  "ls",
  "cd",
  "cat",
  "echo",
  "history",
  "clear",
  "help",
]);

export class CommandEngine {
  readonly fs: FileSystem;
  readonly history: HistoryManager;
  private data: Portfolio;

  constructor(data: Portfolio, fs: FileSystem, history: HistoryManager) {
    this.data = data;
    this.fs = fs;
    this.history = history;
  }

  // Names used for tab-completion: visible commands + builtins.
  commandNames(): string[] {
    return Object.keys(this.data.commands);
  }

  isPathCommand(cmd: string): boolean {
    return cmd === "cd" || cmd === "ls" || cmd === "cat";
  }

  pathCompletions(): string[] {
    return this.fs.completionsAt();
  }

  // Resolve a raw input line to a result. `depth` guards against alias loops.
  resolve(input: string, depth = 0): CommandResult {
    const raw = input.trim();
    if (raw === "") return { type: "empty" };

    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // 1) The flag command — the CTF endpoint. Matched on the verb so it can
    //    carry a submission (flag CTF{...} / flag submit <handle> CTF{...}).
    if (cmd === "flag") {
      const flagDef = this.data.easter_eggs["flag"];
      if (flagDef) return { type: "flag_submit", def: flagDef, args };
    }

    // 2) Easter eggs are matched on the exact (normalised) full input BEFORE
    //    builtins, so gimmicks like "cat /etc/passwd" or "ls -la /" win over
    //    the builtin they would otherwise trigger. Exact-match keeps normal
    //    usage ("cat README.md", "ls -la") untouched.
    const egg = this.matchEasterEgg(raw);
    if (egg) {
      return { type: egg.output_type, def: egg };
    }

    // 3) Builtins are handled in code.
    if (BUILTINS.has(cmd)) {
      return this.runBuiltin(cmd, args, raw);
    }

    // 4) Declared commands (data-driven via output_type).
    const def = this.data.commands[cmd];
    if (def) {
      switch (def.output_type) {
        case "alias": {
          const target = def.target;
          if (!target || depth > 5) return this.notFound(cmd);
          return this.resolve(target, depth + 1);
        }
        case "themes":
          return this.runThemes(args, def);
        case "gui": {
          // Print the configured message, then jump to the visual HUD route.
          const lines =
            (def.text as string[] | undefined) ??
            (def.lines as string[] | undefined) ??
            ["Opening HUD interface...", "→ /hud"];
          return { type: "text", def, lines, effect: { kind: "navigate", to: "/hud" } };
        }
        case "email":
          return {
            type: "email",
            def,
            effect: { kind: "open-url", url: `mailto:${def.address ?? ""}` },
          };
        default:
          // text, table, projects, list, timeline, certs, socials, welcome, ...
          return { type: def.output_type, def };
      }
    }

    // 5) Nothing matched.
    return this.notFound(cmd);
  }

  // -------------------------------------------------------------------------
  // Builtins
  // -------------------------------------------------------------------------

  private runBuiltin(cmd: string, args: string[], raw: string): CommandResult {
    switch (cmd) {
      case "pwd":
        return { type: "text", lines: [this.fs.path] };

      case "cd": {
        const err = this.fs.cd(args[0] ?? "~");
        return err ? { type: "text", lines: [err], isError: true } : { type: "empty" };
      }

      case "ls": {
        const { lines, error } = this.fs.ls(args);
        return { type: "text", lines, isError: error };
      }

      case "cat": {
        const { lines, error } = this.fs.cat(args[0] ?? "");
        return { type: "text", lines, isError: error };
      }

      case "echo": {
        // Preserve everything after the command verbatim.
        const text = raw.slice(raw.indexOf("echo") + 4).trim();
        return { type: "text", lines: [text] };
      }

      case "history": {
        const all = this.history.all();
        const lines = all.map((c, i) => `${String(i + 1).padStart(4)}  ${c}`);
        return { type: "text", lines: lines.length ? lines : ["(no history yet)"] };
      }

      case "clear":
        return { type: "empty", effect: { kind: "clear" } };

      case "help":
        return { type: "help", lines: this.buildHelp() };

      default:
        return this.notFound(cmd);
    }
  }

  private buildHelp(): string[] {
    const entries = Object.entries(this.data.commands).filter(
      ([, def]) => !def.hidden
    );
    const width = entries.reduce((m, [name]) => Math.max(m, name.length), 0);

    const lines = ["Available commands:", ""];
    for (const [name, def] of entries) {
      lines.push(`  ${name.padEnd(width + 4)}${def.description ?? ""}`);
    }
    lines.push("");
    lines.push("Tip: use Tab to autocomplete, arrows for history.");
    lines.push("Some commands are hidden. Explore the filesystem with ls / cat.");
    return lines;
  }

  // -------------------------------------------------------------------------
  // themes command
  // -------------------------------------------------------------------------

  private runThemes(args: string[], def: CommandResult["def"]): CommandResult {
    // "themes set <name>" (or the shorthand "themes <name>").
    let name: string | undefined;
    if (args[0] === "set") name = args[1];
    else if (args.length === 1) name = args[0];

    if (name) {
      if (this.data.themes[name]) {
        return {
          type: "text",
          lines: [`Theme switched to '${name}'.`],
          effect: { kind: "set-theme", theme: name },
        };
      }
      return {
        type: "text",
        lines: [
          `themes: unknown theme '${name}'`,
          `available: ${Object.keys(this.data.themes).join(", ")}`,
        ],
        isError: true,
      };
    }

    // No argument: list themes with swatches (handled by the themes renderer).
    return { type: "themes", def };
  }

  // -------------------------------------------------------------------------
  // Easter eggs
  // -------------------------------------------------------------------------

  private matchEasterEgg(raw: string) {
    // Normalise: lowercase and collapse internal whitespace so "sudo  hire me"
    // still matches "sudo hire me".
    const key = raw.toLowerCase().replace(/\s+/g, " ");
    const eggs = this.data.easter_eggs;
    return eggs[key] ?? eggs[raw] ?? null;
  }

  private notFound(cmd: string): CommandResult {
    return {
      type: "text",
      lines: [`command not found: ${cmd} — type 'help' for available commands`],
      isError: true,
    };
  }
}
