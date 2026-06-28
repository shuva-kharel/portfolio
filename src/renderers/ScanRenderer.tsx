import { useEffect, useRef, useState } from "react";
import type { CommandDef, CommandResult, Effect } from "../types";

interface Props {
  result: CommandResult;
  onEffect?: (effect: Effect) => void;
}

const LINE_DELAY = 60; // ms between scan lines — snappy but readable
const PASSWORD_PAUSE = 900; // dramatic pause after a "[sudo] password:" line

// Reveals lines one at a time, nmap/scan style. Shared by the "scan" and
// "sudo" output types. In sudo mode it pauses on the password-prompt line and,
// once finished, fires its redirect_command (e.g. sudo hire me -> email).
export default function ScanRenderer({ result, onEffect }: Props) {
  const def: CommandDef | Record<string, unknown> = result.def ?? {};
  const lines = (def.lines as string[] | undefined) ?? [];
  const isSudo = result.type === "sudo";
  const redirect = def.redirect_command as string | undefined;

  const [visible, setVisible] = useState(0);
  const firedRedirect = useRef(false);

  useEffect(() => {
    if (visible >= lines.length) {
      // Animation finished: trigger any redirect once.
      if (isSudo && redirect && !firedRedirect.current && onEffect) {
        firedRedirect.current = true;
        const t = setTimeout(
          () => onEffect({ kind: "run-command", input: redirect }),
          400
        );
        return () => clearTimeout(t);
      }
      return;
    }

    // Sudo pauses after the line that ends in a colon (the password prompt).
    const justRevealed = lines[visible - 1] ?? "";
    const pause =
      isSudo && justRevealed.trimEnd().endsWith(":") ? PASSWORD_PAUSE : LINE_DELAY;

    const t = setTimeout(() => setVisible((v) => v + 1), pause);
    return () => clearTimeout(t);
  }, [visible, lines, isSudo, redirect, onEffect]);

  return (
    <div className={`renderer-scan${isSudo ? " renderer-sudo" : ""}`}>
      {lines.slice(0, visible).map((line, i) => (
        <p key={i} className="term-line scan-line">
          {line === "" ? " " : line}
        </p>
      ))}
      {visible < lines.length && <span className="scan-cursor">▋</span>}
    </div>
  );
}
