import { usePortfolioData } from "../context";

// The `help` command — commands grouped into columns by category. Grouping is
// driven by the top-level `help_categories` map in portfolio.json. Hidden
// commands and any not listed in a category (e.g. "secret") never appear.
const CATEGORY_ORDER = ["navigation", "information", "contact", "system"];

export default function HelpRenderer() {
  const data = usePortfolioData();
  const groups = (data.help_categories ?? {}) as Record<string, string[]>;

  const columns = CATEGORY_ORDER.filter((c) => groups[c]?.length).map((cat) => ({
    title: cat.toUpperCase(),
    commands: groups[cat].filter((name) => {
      const def = data.commands[name];
      return def && !def.hidden;
    }),
  }));

  return (
    <div className="renderer-help">
      <div className="help-columns">
        {columns.map((col) => (
          <div className="help-col" key={col.title}>
            <div className="help-cat">{col.title}</div>
            <div className="help-rule">{"─".repeat(col.title.length)}</div>
            {col.commands.map((name) => (
              <div className="help-cmd" key={name}>
                {name}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="term-line help-hint">
        hidden commands exist — not everything is in here.
      </p>
    </div>
  );
}
