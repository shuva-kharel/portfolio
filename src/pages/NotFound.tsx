import { useNavigate, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";

// A deliberately bare 404: a fake segfault / kernel-panic dump on the same dark
// background as the terminal, JetBrains Mono, nothing else. No nav, no HUD.
const wrap: CSSProperties = {
  margin: 0,
  minHeight: "100vh",
  background: "var(--bg, #0d0d0d)",
  color: "var(--text, #c8c8b4)",
  fontFamily: '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
  fontSize: 14,
  lineHeight: 1.6,
  padding: "32px 22px",
  boxSizing: "border-box",
};

const promptStyle: CSSProperties = {
  background: "none",
  border: "none",
  font: "inherit",
  color: "var(--text, #c8c8b4)",
  cursor: "pointer",
  padding: 0,
  display: "block",
  textAlign: "left",
};

export default function NotFound() {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const dump = `Segmentation fault (core dumped)

  Process:  browser
  PID:      404
  Signal:   SIGSEGV (Address boundary error)

  Thread 0 crashed with SIGSEGV in __find_page__:
  #0  0x00000000 in __find_page__ ()
  #1  0x00404err in navigate_to_path ("${path}")
  #2  0x00000001 in main ()

  Page not found. This path does not exist.`;

  return (
    <div style={wrap}>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{dump}</pre>
      <div style={{ marginTop: 24 }}>
        <button style={promptStyle} onClick={() => navigate("/")}>
          <span style={{ color: "var(--prompt-user, #e8a838)" }}>
            [ghost@parrot]
          </span>
          <span style={{ color: "var(--prompt-path, #a0a0a0)" }}>[~]</span>$ cd /
        </button>
        <button style={promptStyle} onClick={() => navigate("/hud")}>
          <span style={{ color: "var(--prompt-user, #e8a838)" }}>
            [ghost@parrot]
          </span>
          <span style={{ color: "var(--prompt-path, #a0a0a0)" }}>[~]</span>$ cd
          /hud
        </button>
      </div>
    </div>
  );
}
