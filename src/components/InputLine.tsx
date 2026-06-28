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
}

interface Props {
  path: string;
  onSubmit: (value: string) => void;
  onHistoryPrev: () => string | null;
  onHistoryNext: () => string | null;
  onTabComplete: (value: string) => string | null;
  onClear: () => void;
  onCancel: () => void;
}

// The live prompt + editable input. A hidden real <input> captures keystrokes
// while a styled span mirrors the value with a blinking block cursor on top.
const InputLine = forwardRef<InputLineHandle, Props>(function InputLine(
  {
    path,
    onSubmit,
    onHistoryPrev,
    onHistoryNext,
    onTabComplete,
    onClear,
    onCancel,
  },
  ref
) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // Ctrl+L — clear the screen, like a real terminal.
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
      case "Enter": {
        e.preventDefault();
        onSubmit(value);
        setValue("");
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = onHistoryPrev();
        if (prev !== null) setValue(prev);
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        const next = onHistoryNext();
        if (next !== null) setValue(next);
        break;
      }
      case "Tab": {
        e.preventDefault();
        const completed = onTabComplete(value);
        if (completed !== null) setValue(completed);
        break;
      }
      default:
        break;
    }
  }

  return (
    <label className="input-line">
      <Prompt path={path} />
      <span className="input-mirror">
        <span className="input-typed">{value}</span>
        <span className="cursor-block" />
      </span>
      <input
        ref={inputRef}
        className="real-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="terminal input"
      />
    </label>
  );
});

export default InputLine;
