import { BrowserRouter, Routes, Route } from "react-router-dom";
import TerminalPage from "./pages/TerminalPage";
import GUI from "./pages/GUI";
import CV from "./pages/CV";
import NotFound from "./pages/NotFound";

// Routes share the same portfolio.json:
//   /     → the interactive terminal
//   /gui  → the visual SOC-style GUI dashboard
//   /cv   → the print-ready CV
//   *     → a segfault-styled 404
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TerminalPage />} />
        <Route path="/gui" element={<GUI />} />
        <Route path="/cv" element={<CV />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
