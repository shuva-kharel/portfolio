import { useCallback, useEffect, useState } from "react";
import { usePortfolio } from "../hooks/usePortfolio";
import { PortfolioContext } from "../context";
import { applyTheme, loadSavedTheme, saveTheme } from "../theme";
import Terminal from "../components/Terminal";

// The "/" route: the fully interactive terminal — identical on desktop and
// mobile. Holds the theme state that used to live in App.
export default function TerminalPage() {
  const { data, error, loading } = usePortfolio();
  const [themeName, setThemeName] = useState<string | null>(null);

  // Pick the initial theme once data loads: saved preference, else JSON default.
  useEffect(() => {
    if (!data) return;
    const saved = loadSavedTheme();
    const initial = saved && data.themes[saved] ? saved : data.meta.theme;
    setThemeName(initial);
  }, [data]);

  // Apply CSS variables whenever the active theme changes.
  useEffect(() => {
    if (!data || !themeName) return;
    const theme = data.themes[themeName] ?? Object.values(data.themes)[0];
    applyTheme(theme);
    // Keep meta in sync so the themes list can mark the active one.
    data.meta.theme = themeName;
  }, [data, themeName]);

  const handleSetTheme = useCallback((name: string) => {
    setThemeName(name);
    saveTheme(name);
  }, []);

  if (loading) {
    return <div className="app-status">booting…</div>;
  }
  if (error || !data) {
    return (
      <div className="app-status app-error">
        Failed to load portfolio.json — {error ?? "unknown error"}
      </div>
    );
  }

  return (
    <PortfolioContext.Provider value={data}>
      <div className="scanlines" aria-hidden="true" />
      <Terminal data={data} onSetTheme={handleSetTheme} />
    </PortfolioContext.Provider>
  );
}
