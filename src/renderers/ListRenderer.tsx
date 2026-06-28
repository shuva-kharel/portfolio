import type { CommandResult } from "../types";

interface ListItem {
  name: string;
  desc?: string;
  link?: string;
}

// The "writeups" output: a numbered list, each row showing a title, a short
// description, and a clickable link.
export default function ListRenderer({ result }: { result: CommandResult }) {
  const items = (result.def?.items as ListItem[] | undefined) ?? [];

  return (
    <ol className="renderer-list">
      {items.map((item, i) => (
        <li className="list-item" key={item.name}>
          <span className="list-index">{String(i + 1).padStart(2, "0")}.</span>
          <span className="list-body">
            <span className="list-name">{item.name}</span>
            {item.desc && <span className="list-desc"> — {item.desc}</span>}
            {item.link && (
              <a
                className="term-link list-link"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.link}
              </a>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
