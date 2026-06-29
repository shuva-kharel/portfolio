import type { CommandResult } from "../types";

interface Solver {
  handle: string;
  date: string;
}

// The "hall-of-fame" command: lists CTF solvers, read straight from
// portfolio.json (commands.hall-of-fame.solvers). No localStorage — the list
// is curated, not self-serve.
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
          {solvers.map((s, i) => (
            <p className="term-line hof-row" key={s.handle}>
              <span className="hof-rank">{String(i + 1).padStart(2, "0")}.</span>{" "}
              <span className="hof-handle">{s.handle}</span>
              <span className="hof-date"> — {s.date}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
