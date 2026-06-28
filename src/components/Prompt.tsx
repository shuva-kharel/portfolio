import { usePortfolioData } from "../context";

// The shell prompt, rendered identically for the live input line and for every
// echoed command in the scrollback: [user@host][path]$
export default function Prompt({ path }: { path: string }) {
  const { meta } = usePortfolioData();
  return (
    <span className="prompt" aria-hidden="true">
      <span className="prompt-bracket">[</span>
      <span className="prompt-user">{meta.user}</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">{meta.host}</span>
      <span className="prompt-bracket">]</span>
      <span className="prompt-bracket">[</span>
      <span className="prompt-path">{path}</span>
      <span className="prompt-bracket">]</span>
      <span className="prompt-symbol">{meta.prompt_symbol}</span>{" "}
    </span>
  );
}
