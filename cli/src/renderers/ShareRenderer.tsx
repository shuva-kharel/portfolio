import { useEffect, useState } from "react";
import type { CommandResult } from "../types";

// `share <command>` — builds a deep link that pre-runs the command on load
// (?run=<command>) and copies it to the clipboard.
export default function ShareRenderer({ result }: { result: CommandResult }) {
  const args = result.args ?? [];
  const cmd = args.join(" ").trim();
  const usage = (result.def?.usage as string | undefined) ?? "share <command>";
  const [copied, setCopied] = useState(false);

  const url = cmd
    ? `${window.location.origin}/?run=${encodeURIComponent(cmd)}`
    : "";

  useEffect(() => {
    if (!url) return;
    navigator.clipboard?.writeText(url).then(
      () => setCopied(true),
      () => setCopied(false)
    );
  }, [url]);

  if (!cmd) {
    return (
      <div className="renderer-text">
        <p className="term-line">usage: {usage}</p>
        <p className="term-line term-dim">e.g. share nmap</p>
      </div>
    );
  }

  return (
    <div className="renderer-share">
      <p className="term-line">Shareable link generated:</p>
      <p className="term-line">
        →{" "}
        <a
          className="term-link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
      </p>
      <p className="term-line">&nbsp;</p>
      <p className="term-line">
        Copy and send to anyone. Opens the terminal and runs the command.
      </p>
      {copied && <p className="term-line term-dim">✓ copied to clipboard</p>}
    </div>
  );
}
