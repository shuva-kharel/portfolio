import { usePortfolioData } from "../context";

// The "now" command: a snapshot of current activity, read from the top-level
// `now` object in portfolio.json. Rendered as an aligned key/value block.
export default function NowRenderer() {
  const data = usePortfolioData();
  const now = (data.now as Record<string, string> | undefined) ?? {};
  const stamp = new Date().toISOString().slice(0, 10);

  const rows: Array<[string, string | undefined]> = [
    ["LEARNING", now.learning],
    ["BUILDING", now.building],
    ["READING", now.reading],
    ["PLAYING", now.playing],
  ];

  return (
    <div className="renderer-kv">
      <p className="kv-title">CURRENTLY — {stamp}</p>
      <p className="kv-rule">───────────────────────────────</p>
      {rows.map(([k, v]) =>
        v ? (
          <p className="kv-row" key={k}>
            <span className="kv-key">{k.padEnd(9)}</span>: {v}
          </p>
        ) : null
      )}
    </div>
  );
}
