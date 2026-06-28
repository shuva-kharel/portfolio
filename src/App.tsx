import { BrowserRouter, Routes, Route } from "react-router-dom";
import TerminalPage from "./pages/TerminalPage";
import HUD from "./pages/HUD";
import NotFound from "./pages/NotFound";

// Routes share the same portfolio.json:
//   /     → the interactive terminal
//   /hud  → the visual SOC-style HUD dashboard
//   *     → a segfault-styled 404
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TerminalPage />} />
        <Route path="/hud" element={<HUD />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
