import { useMemo } from "react";
import type { CommandDef, CommandResult } from "../types";
import { addHofEntry, xorDecodeHex } from "../hof";

// The "flag" command — the CTF endpoint. Three modes:
//   flag                          → show the challenge briefing
//   flag CTF{...}                 → verify a candidate flag
//   flag submit <handle> CTF{...} → verify and, if correct, claim a HOF spot
//
// The correct flag is never stored in plaintext: it is XOR-decoded at runtime
// from the same encrypted hex that lives in /secret/flag.txt.
export default function FlagRenderer({ result }: { result: CommandResult }) {
  const def: CommandDef | Record<string, unknown> = result.def ?? {};
  const args = result.args ?? [];
  const format = (def.format as string | undefined) ?? "CTF{...}";
  const hint = (def.hint as string | undefined) ?? "";
  const check = def.check as { hex: string; xor: number } | undefined;

  const expected = useMemo(
    () => (check ? xorDecodeHex(check.hex, check.xor) : ""),
    [check]
  );

  // Compute the outcome once. The submit branch has a side effect (writing to
  // localStorage), which is safe to run during this memo because it is
  // idempotent and de-duplicated.
  const lines = useMemo<{ text: string; ok?: boolean; err?: boolean }[]>(() => {
    const out: { text: string; ok?: boolean; err?: boolean }[] = [];

    if (args.length === 0) {
      out.push({ text: "CTF CHALLENGE — 5 layers, one flag." });
      out.push({ text: `format : ${format}` });
      if (hint) out.push({ text: `hint   : ${hint}` });
      out.push({ text: "" });
      out.push({ text: "verify : flag CTF{...}" });
      out.push({ text: "claim  : flag submit <handle> CTF{...}" });
      return out;
    }

    if (args[0].toLowerCase() === "submit") {
      const handle = args[1];
      const attempt = args.slice(2).join(" ").trim();
      if (!handle || !attempt) {
        out.push({ text: "usage: flag submit <handle> CTF{...}", err: true });
        return out;
      }
      if (attempt === expected) {
        addHofEntry(handle);
        out.push({ text: "Flag accepted.", ok: true });
        out.push({ text: `Welcome to the hall of fame, ${handle}.`, ok: true });
        out.push({ text: "Run 'hall-of-fame' to see all solvers." });
      } else {
        out.push({ text: "Incorrect flag. No spot claimed.", err: true });
      }
      return out;
    }

    // Plain verification.
    const attempt = args.join(" ").trim();
    if (attempt === expected) {
      out.push({ text: "Correct. That's the flag.", ok: true });
      out.push({ text: "Now claim your place:" });
      out.push({ text: `  flag submit <handle> ${attempt}` });
    } else {
      out.push({ text: "Nope. Keep digging.", err: true });
      if (hint) out.push({ text: hint });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.join(" "), expected, format, hint]);

  return (
    <div className="renderer-flag">
      {lines.map((l, i) => (
        <p
          key={i}
          className={`term-line${l.ok ? " flag-ok" : ""}${
            l.err ? " term-error" : ""
          }`}
        >
          {l.text === "" ? " " : l.text}
        </p>
      ))}
    </div>
  );
}
