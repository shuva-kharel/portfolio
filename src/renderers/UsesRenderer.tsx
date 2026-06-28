import { usePortfolioData } from "../context";

// The "uses" command: daily-driver setup from the top-level `uses` object.
// Keys are upper-cased and column-aligned with their values.
export default function UsesRenderer() {
  const data = usePortfolioData();
  const uses = (data.uses as Record<string, string> | undefined) ?? {};
  const entries = Object.entries(uses);
  const keyWidth = entries.reduce((m, [k]) => Math.max(m, k.length), 0) + 2;

  return (
    <div className="renderer-kv">
      <p className="kv-title">MY SETUP</p>
      <p className="kv-rule">──────────────────────</p>
      {entries.map(([k, v]) => (
        <p className="kv-row" key={k}>
          <span className="kv-key">{k.toUpperCase().padEnd(keyWidth)}</span>
          {v}
        </p>
      ))}
    </div>
  );
}
