import { useEffect, useRef, useState } from "react";
import type { BootLine } from "../types";

interface Props {
  lines: BootLine[];
  onDone: () => void;
}

// Plays the boot_sequence line by line using each line's own delay. Any key (or
// a click) skips straight to the end. Calls onDone exactly once when finished
// or skipped.
export default function BootSequence({ lines, onDone }: Props) {
  const [shown, setShown] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(false);
  const indexRef = useRef(0);
  const doneRef = useRef(false);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }

  // Skip handler — wired to any keypress / pointer while booting.
  useEffect(() => {
    function skip() {
      if (doneRef.current) return;
      setSkipped(true);
      setShown(lines.map((l) => l.text));
      finish();
    }
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  // Reveal lines on their individual delays.
  useEffect(() => {
    if (skipped) return;
    if (indexRef.current >= lines.length) {
      const t = setTimeout(finish, 350);
      return () => clearTimeout(t);
    }
    const current = lines[indexRef.current];
    const t = setTimeout(() => {
      setShown((s) => [...s, current.text]);
      indexRef.current += 1;
    }, current.delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, skipped]);

  return (
    <div className="boot-sequence">
      {shown.map((line, i) => (
        <p key={i} className="boot-line">
          {line === "" ? " " : line}
        </p>
      ))}
      {!skipped && <p className="boot-skip-hint">Press any key to skip…</p>}
    </div>
  );
}
