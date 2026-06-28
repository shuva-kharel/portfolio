import type { CommandResult } from "../types";

// Message of the day: one quote, chosen by the day so it's stable for 24h
// (not random per load). Rendered dim, no attribution.
export default function MotdRenderer({ result }: { result: CommandResult }) {
  const quotes = (result.def?.quotes as string[] | undefined) ?? [];
  if (quotes.length === 0) return null;
  const idx = Math.floor(Date.now() / 86_400_000) % quotes.length;

  return (
    <div className="renderer-motd">
      <p className="term-line">&nbsp;</p>
      <p className="term-line motd-line">── {quotes[idx]} ──</p>
      <p className="term-line">&nbsp;</p>
    </div>
  );
}
