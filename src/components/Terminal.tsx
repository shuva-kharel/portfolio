import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import type { Effect, HistoryEntry, Portfolio } from "../types";
import { CommandEngine } from "../core/CommandEngine";
import { FileSystem } from "../core/FileSystem";
import { HistoryManager } from "../core/HistoryManager";
import OutputBlock from "./OutputBlock";
import InputLine, { type InputLineHandle } from "./InputLine";
import BootSequence from "./BootSequence";

const VISITED_KEY = "terminal_portfolio_visited";

interface Props {
  data: Portfolio;
  onSetTheme: (name: string) => void;
}

// Returns the longest common prefix of a set of strings (for tab-completion).
function commonPrefix(items: string[]): string {
  if (items.length === 0) return "";
  let prefix = items[0];
  for (const item of items.slice(1)) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

export default function Terminal({ data, onSetTheme }: Props) {
  const navigate = useNavigate();

  // Engine + filesystem + history are created once and persist for the session.
  const engine = useMemo(() => {
    const fs = new FileSystem(data.filesystem);
    const history = new HistoryManager();
    return new CommandEngine(data, fs, history);
  }, [data]);

  // The engine owns the history manager; alias it for arrow navigation.
  const history = engine.history;

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [path, setPath] = useState(engine.fs.displayPath);
  const [booting, setBooting] = useState(
    () => !localStorage.getItem(VISITED_KEY)
  );

  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputLineHandle>(null);

  // ---- effect handling -----------------------------------------------------
  const handleEffect = useCallback(
    (effect: Effect) => {
      switch (effect.kind) {
        case "clear":
          setEntries([]);
          break;
        case "set-theme":
          onSetTheme(effect.theme);
          break;
        case "open-url":
          window.open(effect.url, "_blank", "noopener,noreferrer");
          break;
        case "run-command":
          // Programmatic run (alias redirect, sudo redirect, welcome auto-run).
          execute(effect.input, false);
          break;
        case "navigate":
          // `gui` jumps to the visual HUD route in the same tab.
          navigate(effect.to);
          break;
      }
    },
    // execute is defined below and stable via useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSetTheme, navigate]
  );

  // ---- run a command -------------------------------------------------------
  const execute = useCallback(
    (input: string, echo: boolean) => {
      const pathBefore = engine.fs.displayPath;
      const result = engine.resolve(input);

      // `clear` wipes the scrollback and adds nothing.
      if (result.effect?.kind === "clear") {
        setEntries([]);
        setPath(engine.fs.displayPath);
        return;
      }

      const entry: HistoryEntry = {
        id: idRef.current++,
        path: pathBefore,
        command: echo ? input : undefined,
        result,
      };

      // Don't add a totally empty echo-less entry (e.g. blank programmatic run).
      const isNoise =
        !echo && result.type === "empty" && !result.lines?.length;
      if (!isNoise) setEntries((prev) => [...prev, entry]);

      // cd (and others) may have changed the working directory.
      setPath(engine.fs.displayPath);

      // Apply any immediate side effect attached to the result.
      if (result.effect) handleEffect(result.effect);
    },
    [engine, handleEffect]
  );

  // ---- input handlers ------------------------------------------------------
  const handleSubmit = useCallback(
    (value: string) => {
      history.push(value);
      execute(value, true);
    },
    [execute, history]
  );

  const handleHistoryPrev = useCallback(() => history.prev(), [history]);
  const handleHistoryNext = useCallback(() => history.next(), [history]);

  const handleTabComplete = useCallback(
    (value: string): string | null => {
      const tokens = value.split(/\s+/);
      // Completing the command name itself.
      if (tokens.length <= 1) {
        const frag = tokens[0] ?? "";
        if (frag === "") return null;
        const matches = engine
          .commandNames()
          .filter((c) => c.startsWith(frag));
        if (matches.length === 0) return null;
        if (matches.length === 1) return matches[0] + " ";
        return commonPrefix(matches);
      }

      // Completing a filesystem path argument for cd / ls / cat.
      const cmd = tokens[0].toLowerCase();
      if (engine.isPathCommand(cmd)) {
        const frag = tokens[tokens.length - 1];
        const matches = engine
          .pathCompletions()
          .filter((c) => c.startsWith(frag));
        if (matches.length === 0) return null;
        const completion =
          matches.length === 1 ? matches[0] : commonPrefix(matches);
        const head = tokens.slice(0, -1).join(" ");
        return `${head} ${completion}`;
      }

      return null;
    },
    [engine]
  );

  const handleClear = useCallback(() => setEntries([]), []);
  const handleCancel = useCallback(() => {
    history.reset();
  }, [history]);

  // ---- boot + welcome ------------------------------------------------------
  const finishBoot = useCallback(() => {
    localStorage.setItem(VISITED_KEY, "1");
    setBooting(false);
    execute("welcome", false);
    // focus once the input mounts
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [execute]);

  // If the user has visited before, skip boot and run welcome immediately.
  // The ref guards against StrictMode's double-mount in development.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (!booting) {
      execute("welcome", false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    // run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- auto-scroll ---------------------------------------------------------
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, booting]);

  // Clicking anywhere (that isn't a link / text selection) refocuses input.
  function handleContainerClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === "A") return;
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  }

  return (
    <div className="terminal" ref={scrollRef} onClick={handleContainerClick}>
      <div className="terminal-inner">
        {booting ? (
          <BootSequence lines={data.boot_sequence} onDone={finishBoot} />
        ) : (
          <>
            {entries.map((entry) => (
              <OutputBlock key={entry.id} entry={entry} onEffect={handleEffect} />
            ))}
            <InputLine
              ref={inputRef}
              path={path}
              onSubmit={handleSubmit}
              onHistoryPrev={handleHistoryPrev}
              onHistoryNext={handleHistoryNext}
              onTabComplete={handleTabComplete}
              onClear={handleClear}
              onCancel={handleCancel}
            />
          </>
        )}
      </div>
    </div>
  );
}
