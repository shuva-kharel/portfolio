import type { CommandResult } from "../types";

interface Social {
  platform: string;
  handle: string;
  link: string;
}

// The "socials" output: platform, handle and a clickable link aligned in
// columns.
export default function SocialsRenderer({ result }: { result: CommandResult }) {
  const items = (result.def?.items as Social[] | undefined) ?? [];

  return (
    <div className="renderer-socials">
      {items.map((s) => (
        <div className="social-row" key={s.platform}>
          <span className="social-platform">{s.platform}</span>
          <span className="social-handle">{s.handle}</span>
          <a
            className="term-link"
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.link}
          </a>
        </div>
      ))}
    </div>
  );
}
