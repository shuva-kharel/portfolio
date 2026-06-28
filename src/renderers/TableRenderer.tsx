import type { CommandResult } from "../types";

// The "skills" table: each category is a row with its label on the left and the
// skill list on the right, framed by a thin border in the theme's table colour.
export default function TableRenderer({ result }: { result: CommandResult }) {
  const categories =
    (result.def?.categories as Record<string, string[]> | undefined) ?? {};
  const entries = Object.entries(categories);

  return (
    <div className="renderer-table">
      {entries.map(([category, skills]) => (
        <div className="table-row" key={category}>
          <div className="table-cat">{category}</div>
          <div className="table-skills">
            {skills.map((s) => (
              <span className="skill-badge" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
