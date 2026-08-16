import type { Theme } from "./types";

const STORAGE_KEY = "terminal_portfolio_theme";

// Maps a Theme's keys to the CSS custom properties consumed by the stylesheet.
const VAR_MAP: Record<keyof Theme, string> = {
  background: "--bg",
  prompt_user: "--prompt-user",
  prompt_host: "--prompt-host",
  prompt_path: "--prompt-path",
  output_text: "--text",
  output_dim: "--dim",
  accent: "--accent",
  error: "--error",
  link: "--link",
  success: "--success",
  table_border: "--border",
  cursor: "--cursor",
};

// Pushes a theme's palette into :root as CSS variables. All colour in the app
// flows from these variables, so this is the only place colours are applied.
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  (Object.keys(VAR_MAP) as (keyof Theme)[]).forEach((key) => {
    root.style.setProperty(VAR_MAP[key], theme[key]);
  });
}

export function saveTheme(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    /* storage may be unavailable (private mode); non-fatal */
  }
}

export function loadSavedTheme(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
