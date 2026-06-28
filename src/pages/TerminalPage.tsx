import { useCallback, useEffect, useState } from "react";
import { usePortfolio } from "../hooks/usePortfolio";
import { PortfolioContext } from "../context";
import { applyTheme, loadSavedTheme, saveTheme } from "../theme";
import Terminal from "../components/Terminal";
import MobileReplay from "../components/MobileReplay";

const MOBILE_QUERY = "(max-width: 767px)";

// The "/" route: the interactive terminal (or a read-only replay on phones).
// This holds all of the theme/viewport state that used to live in App.
export default function TerminalPage() {
  const { data, error, loading } = usePortfolio();
  const [themeName, setThemeName] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  );

  // Track viewport so we can swap between interactive terminal and replay.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
      {isMobile ? (
        <MobileReplay data={data} />
      ) : (
        <Terminal data={data} onSetTheme={handleSetTheme} />
      )}
    </PortfolioContext.Provider>
  );
}
