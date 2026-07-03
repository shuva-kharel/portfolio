import { BrowserRouter, Routes, Route } from "react-router-dom";
import TerminalPage from "./pages/TerminalPage";
import HUD from "./pages/HUD";
import CV from "./pages/CV";
import NotFound from "./pages/NotFound";

// Routes share the same portfolio.json:
//   /     → the interactive terminal
//   /hud  → the visual SOC-style HUD dashboard
//   /cv   → the print-ready CV
//   *     → a segfault-styled 404
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TerminalPage />} />
        <Route path="/hud" element={<HUD />} />
        <Route path="/cv" element={<CV />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
