import { memo } from "react";
import type { Effect, HistoryEntry } from "../types";
import Prompt from "./Prompt";
import { renderResult } from "../renderers";

interface Props {
  entry: HistoryEntry;
  onEffect: (effect: Effect) => void;
}

// One discrete block in the scrollback: the echoed prompt + command on top, and
// the rendered output beneath. memo keeps already-printed blocks from
// re-rendering as new commands are added.
function OutputBlock({ entry, onEffect }: Props) {
  return (
    <div className="output-block">
      {entry.command !== undefined && (
        <div className="command-echo">
          <Prompt path={entry.path} />
          <span className="echo-command">{entry.command}</span>
        </div>
      )}
      {entry.result && (
        <div className="command-output">
          {renderResult(entry.result, onEffect)}
        </div>
      )}
    </div>
  );
}

export default memo(OutputBlock);
