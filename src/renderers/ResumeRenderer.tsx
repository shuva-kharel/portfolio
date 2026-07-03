import type { CommandResult } from "../types";
import { usePortfolioData } from "../context";

// The `resume` command: the CV lives at /cv (a print-ready page generated from
// portfolio.json). This prints a short identity summary and a click-to-open
// link. No automatic window.open — a delayed open fires outside the user
// gesture and gets eaten by popup blockers; a real click never does.
export default function ResumeRenderer(_: { result: CommandResult }) {
  const data = usePortfolioData();

  const whoami = (data.commands.whoami?.lines as string[] | undefined) ?? [];
  const field = (key: string) =>
    whoami
      .map((l) => l.match(new RegExp(`^${key}\\s*:\\s*(.+)$`, "i"))?.[1])
      .find(Boolean);

  const lines = [
    "Generating CV from portfolio.json...",
    "",
    ...(["Name", "Role", "Status"] as const)
      .map((key) => {
        const value = field(key);
        return value ? `${key.padEnd(8)}: ${value}` : null;
      })
      .filter((l): l is string => l !== null),
    "",
  ];

  return (
    <div className="renderer-resume">
      {lines.map((line, i) => (
        <p key={i} className="term-line">
          {line === "" ? " " : line}
        </p>
      ))}
      <p className="term-line">
        →{" "}
        <a
          className="term-link"
          href="/cv"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open full CV: /cv
        </a>{" "}
        [opens in new tab]
      </p>
    </div>
  );
}
