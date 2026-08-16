import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Prompt from "./Prompt";

export interface InputLineHandle {
  focus: () => void;
  tab: () => void;
  prev: () => void;
  next: () => void;
  reverseSearch: () => void;
}

interface Props {
  path: string;
  onSubmit: (value: string) => void;
  onHistoryPrev: () => string | null;
  onHistoryNext: () => string | null;
  onTabComplete: (value: string) => string | null;
  onClear: () => void;
  onCancel: () => void;
  onFocusChange?: (focused: boolean) => void;
  getHistory: () => string[];
}

// The live prompt + editable input. A hidden real <input> captures keystrokes
// while a styled span mirrors the value with a blinking block cursor on top.
// Also implements Ctrl+R reverse-incremental history search.
const InputLine = forwardRef<InputLineHandle, Props>(function InputLine(
  {
    path,
    onSubmit,
    onHistoryPrev,
    onHistoryNext,
    onTabComplete,
    onClear,
    onCancel,
    onFocusChange,
    getHistory,
  },
  ref
) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // reverse-i-search state
  const [rsActive, setRsActive] = useState(false);
  const [rsQuery, setRsQuery] = useState("");
  const [rsIndex, setRsIndex] = useState(0);

  // Newest-first matches for the current query.
  const rsMatches = rsActive
    ? getHistory()
        .filter((h) => h.includes(rsQuery))
        .reverse()
    : [];
  const rsMatch = rsMatches[rsIndex] ?? "";

  const exitReverse = () => {
    setRsActive(false);
    setRsQuery("");
    setRsIndex(0);
  };

  const toggleReverse = () => {
    if (!rsActive) {
      setRsActive(true);
      setRsQuery("");
      setRsIndex(0);
    } else {
      // cycle to the next older match
      setRsIndex((i) => Math.min(i + 1, Math.max(0, rsMatches.length - 1)));
    }
    inputRef.current?.focus();
  };

  const doTab = () => {
    const completed = onTabComplete(value);
    if (completed !== null) setValue(completed);
    inputRef.current?.focus();
  };
  const doPrev = () => {
    const prev = onHistoryPrev();
    if (prev !== null) setValue(prev);
    inputRef.current?.focus();
  };
  const doNext = () => {
    const next = onHistoryNext();
    if (next !== null) setValue(next);
    inputRef.current?.focus();
  };

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      tab: doTab,
      prev: doPrev,
      next: doNext,
      reverseSearch: toggleReverse,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, rsActive, rsQuery, rsIndex]
  );

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // Ctrl+R — reverse history search (toggle / cycle).
    if (e.ctrlKey && (e.key === "r" || e.key === "R")) {
      e.preventDefault();
      toggleReverse();
      return;
    }

    if (rsActive) {
      if (e.key === "Escape") {
        e.preventDefault();
        exitReverse();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        setValue(rsMatch);
        exitReverse();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        setRsQuery((q) => q.slice(0, -1));
        setRsIndex(0);
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setRsQuery((q) => q + e.key);
        setRsIndex(0);
        return;
      }
      return; // swallow other keys while searching
    }

    // Ctrl+L — clear the screen.
    if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      onClear();
      return;
    }
    // Ctrl+C — cancel the current line.
    if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      onCancel();
      setValue("");
      return;
    }

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        onSubmit(value);
        setValue("");
        break;
      case "ArrowUp":
        e.preventDefault();
        doPrev();
        break;
      case "ArrowDown":
        e.preventDefault();
        doNext();
        break;
      case "Tab":
        e.preventDefault();
        doTab();
        break;
      default:
        break;
    }
  }

  return (
    <label className="input-line">
      {rsActive ? (
        <span className="reverse-search">
          <span className="rs-label">(reverse-i-search)`</span>
          <span className="rs-query">{rsQuery}</span>
          <span className="rs-label">': </span>
          <span className="rs-match">{rsMatch}</span>
          <span className="cursor-block" />
        </span>
      ) : (
        <>
          <Prompt path={path} />
          <span className="input-mirror">
            <span className="input-typed">{value}</span>
            <span className="cursor-block" />
          </span>
        </>
      )}
      <input
        ref={inputRef}
        className="real-input"
        type="text"
        inputMode="text"
        value={rsActive ? "" : value}
        onChange={(e) => {
          if (!rsActive) setValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Command input"
      />
    </label>
  );
});

export default InputLine;
