import type { CommandDef, CommandResult } from "../types";

// The "welcome" hero: ASCII name in the accent colour, a tagline, version, and
// a hint pointing newcomers at `help`.
export default function AsciiRenderer({ result }: { result: CommandResult }) {
  const def: CommandDef | Record<string, unknown> = result.def ?? {};
  const ascii = (def.ascii as string[] | undefined) ?? [];
  const tagline = def.tagline as string | undefined;
  const version = def.version as string | undefined;
  const hint = def.hint as string | undefined;

  return (
    <div className="renderer-welcome">
      <pre className="ascii-art" aria-label="logo">
        {ascii.join("\n")}
      </pre>
      {tagline && <p className="welcome-tagline">{tagline}</p>}
      {version && <p className="welcome-version">{version}</p>}
      {hint && <p className="welcome-hint">{hint}</p>}
    </div>
  );
}
