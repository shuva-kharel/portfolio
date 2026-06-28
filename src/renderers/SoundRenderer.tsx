import { useEffect } from "react";
import type { CommandResult } from "../types";

const SOUND_KEY = "sound_enabled";

// Handles the `sound on` / `sound off` easter eggs. Persists the preference to
// localStorage (read by the terminal's key-click synth) and prints a message.
export default function SoundRenderer({ result }: { result: CommandResult }) {
  const on = result.type === "sound_on";

  useEffect(() => {
    if (on) localStorage.setItem(SOUND_KEY, "1");
    else localStorage.removeItem(SOUND_KEY);
  }, [on]);

  return (
    <div className="renderer-text">
      <p className="term-line">
        {on ? "Sound effects enabled. Type away." : "Sound effects disabled."}
      </p>
    </div>
  );
}
