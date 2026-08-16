import type { CommandResult } from "../types";

// Renders a flat list of lines, one <p> each. Used by:
//  - builtin output (pwd, ls, cat, echo, history, errors)
//  - the "text" output_type (whoami, gui, and several easter eggs)
//  - the "help" output_type (already pre-formatted into lines)
//
// Blank lines are preserved so spacing in the JSON survives verbatim.
export default function TextRenderer({ result }: { result: CommandResult }) {
  const lines = result.lines ?? (result.def?.lines as string[] | undefined) ?? [];
  const cls = result.isError
    ? "term-line term-error"
    : result.dim
      ? "term-line term-dim"
      : "term-line";

  return (
    <div className="renderer-text">
      {lines.map((line, i) => (
        <p key={i} className={cls}>
          {line === "" ? " " : line}
        </p>
      ))}
    </div>
  );
}
