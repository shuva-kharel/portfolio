import { useEffect, useState } from "react";
import type { Portfolio } from "../types";

interface PortfolioState {
  data: Portfolio | null;
  error: string | null;
  loading: boolean;
}

// Fetches and parses portfolio.json exactly once. The result is the single
// source of truth for the entire app; nothing else re-fetches it.
export function usePortfolio(): PortfolioState {
  const [state, setState] = useState<PortfolioState>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    // Respect Vite's base path so this works under sub-path deployments too.
    const url = `${import.meta.env.BASE_URL}portfolio.json`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} loading portfolio.json`);
        return res.json();
      })
      .then((data: Portfolio) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          setState({ data: null, error: message, loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
