import { createContext, useContext } from "react";
import type { Portfolio } from "./types";

// Gives every renderer read-only access to the loaded portfolio (themes for
// swatches, meta for prompt, etc.) without prop-drilling.
export const PortfolioContext = createContext<Portfolio | null>(null);

export function usePortfolioData(): Portfolio {
  const data = useContext(PortfolioContext);
  if (!data) throw new Error("PortfolioContext used outside of provider");
  return data;
}
