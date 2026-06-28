import type { CommandResult } from "../types";

interface Project {
  name: string;
  desc: string;
  tags?: string[];
  link?: string;
  stars?: number;
}

// The "projects" output: one block per project with the name in the accent
// colour, a description, tag badges, a star count, and a clickable repo link.
export default function ProjectsRenderer({ result }: { result: CommandResult }) {
  const items = (result.def?.items as Project[] | undefined) ?? [];

  return (
    <div className="renderer-projects">
      {items.map((p) => (
        <div className="project-block" key={p.name}>
          <div className="project-head">
            <span className="project-name">{p.name}</span>
            {typeof p.stars === "number" && (
              <span className="project-stars">★ {p.stars}</span>
            )}
          </div>
          <p className="project-desc">{p.desc}</p>
          {p.tags && p.tags.length > 0 && (
            <div className="project-tags">
              {p.tags.map((t) => (
                <span className="tag-badge" key={t}>
                  [{t}]
                </span>
              ))}
            </div>
          )}
          {p.link && (
            <a
              className="term-link"
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.link}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
