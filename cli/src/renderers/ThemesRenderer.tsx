import type { CommandResult } from "../types";
import { usePortfolioData } from "../context";

// The "themes" output: lists every theme defined in portfolio.json with a small
// colour swatch built from that theme's own palette, plus a usage hint.
export default function ThemesRenderer({ result }: { result: CommandResult }) {
  const portfolio = usePortfolioData();
  const themes = portfolio.themes;
  const active = portfolio.meta.theme;
  const usage = (result.def?.usage as string | undefined) ?? "themes set <name>";

  return (
    <div className="renderer-themes">
      {Object.entries(themes).map(([name, theme]) => (
        <div className="theme-row" key={name}>
          <span className="theme-swatches" aria-hidden="true">
            <span className="swatch" style={{ background: theme.background }} />
            <span className="swatch" style={{ background: theme.accent }} />
            <span className="swatch" style={{ background: theme.prompt_host }} />
            <span className="swatch" style={{ background: theme.output_text }} />
          </span>
          <span className="theme-name">{name}</span>
          {name === active && <span className="theme-active">← active</span>}
        </div>
      ))}
      <p className="term-line theme-usage">usage: {usage}</p>
    </div>
  );
}
