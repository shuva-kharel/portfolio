import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { HistoryEntry, Portfolio } from "../types";
import { CommandEngine } from "../core/CommandEngine";
import { FileSystem } from "../core/FileSystem";
import { HistoryManager } from "../core/HistoryManager";
import OutputBlock from "./OutputBlock";

// A curated, read-only demo for narrow screens. It auto-plays a fixed sequence
// of commands so phone visitors still get the gist without a keyboard.
const SCRIPT = ["welcome", "whoami", "skills", "projects", "nmap"];
const STEP_DELAY = 1400;

interface Props {
  data: Portfolio;
}

export default function MobileReplay({ data }: Props) {
  const navigate = useNavigate();
  const engine = useMemo(() => {
    const fs = new FileSystem(data.filesystem);
    return new CommandEngine(data, fs, new HistoryManager());
  }, [data]);

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    let step = 0;
    let timer: number;

    const runNext = () => {
      if (step >= SCRIPT.length) return;
      const input = SCRIPT[step++];
      const result = engine.resolve(input);
      setEntries((prev) => [
        ...prev,
        { id: idRef.current++, path: "~", command: input, result },
      ]);
      timer = window.setTimeout(runNext, STEP_DELAY);
    };

    timer = window.setTimeout(runNext, 600);
    return () => window.clearTimeout(timer);
  }, [engine]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  return (
    <div className="terminal mobile-replay" ref={scrollRef}>
      <div className="mobile-banner">
        <span className="mobile-banner-text">
          DEMO MODE — full terminal on desktop.
        </span>
        <button
          className="mobile-hud-btn"
          onClick={() => navigate("/hud")}
          aria-label="Open the visual HUD"
        >
          ENTER HUD →
        </button>
      </div>
      <div className="terminal-inner">
        {entries.map((entry) => (
          <OutputBlock key={entry.id} entry={entry} onEffect={() => {}} />
        ))}
      </div>
    </div>
  );
}
