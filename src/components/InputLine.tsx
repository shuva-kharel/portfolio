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
  onType?: () => void;
}

// The live prompt + editable input. A hidden real <input> captures keystrokes
// while a styled span mirrors the value with a blinking block cursor on top.
// The input is hidden but kept in the DOM (focusable) so mobile keyboards work.
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
    onType,
  },
  ref
) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    }),
    // recreated when value changes so the toolbar acts on the latest input
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  );

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

    // Typing sound for any character/backspace key.
    if (onType && (e.key.length === 1 || e.key === "Backspace")) onType();

    switch (e.key) {
      case "Enter": {
        e.preventDefault();
        onSubmit(value);
        setValue("");
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        doPrev();
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        doNext();
        break;
      }
      case "Tab": {
        e.preventDefault();
        doTab();
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
        type="text"
        inputMode="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
