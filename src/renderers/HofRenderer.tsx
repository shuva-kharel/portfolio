import type { CommandResult } from "../types";
import { getHofEntries } from "../hof";

// The "hall-of-fame" command: lists everyone who solved the CTF, read from
// localStorage so it persists across sessions.
export default function HofRenderer({ result }: { result: CommandResult }) {
  const message = (result.def?.message as string | undefined) ?? "";
  const entries = getHofEntries();

  return (
    <div className="renderer-hof">
      {message && <p className="term-line hof-message">{message}</p>}
      {entries.length === 0 ? (
        <p className="term-line hof-empty">No solvers yet. Be the first.</p>
      ) : (
        <div className="hof-list">
          {entries.map((e, i) => (
            <p className="term-line hof-row" key={e.handle}>
              <span className="hof-rank">{String(i + 1).padStart(2, "0")}.</span>{" "}
              <span className="hof-handle">{e.handle}</span>
              <span className="hof-date"> — {e.ts.slice(0, 10)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
