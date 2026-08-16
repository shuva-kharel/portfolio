import type { CommandResult } from "../types";

type Solver = string | { handle?: string; date?: string };

// The "hall-of-fame" command: lists CTF solvers, read straight from
// portfolio.json (commands.hall-of-fame.solvers). No localStorage — the list
// is curated, not self-serve. Entries may be objects ({handle, date}) or a
// bare string (useful as a placeholder).
export default function HofRenderer({ result }: { result: CommandResult }) {
  const message = (result.def?.message as string | undefined) ?? "";
  const solvers = (result.def?.solvers as Solver[] | undefined) ?? [];

  return (
    <div className="renderer-hof">
      {message && <p className="term-line hof-message">{message}</p>}
      {solvers.length === 0 ? (
        <p className="term-line hof-empty">No solvers yet. Be the first.</p>
      ) : (
        <div className="hof-list">
          {solvers.map((s, i) => {
            const handle = typeof s === "string" ? s : s.handle ?? "";
            const date = typeof s === "string" ? "" : s.date ?? "";
            return (
              <p className="term-line hof-row" key={handle || i}>
                <span className="hof-rank">
                  {String(i + 1).padStart(2, "0")}.
                </span>{" "}
                <span className="hof-handle">{handle}</span>
                {date && <span className="hof-date"> — {date}</span>}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
