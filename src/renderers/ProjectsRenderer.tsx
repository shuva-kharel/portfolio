import type { CommandResult } from "../types";

interface ProjectLinks {
  github?: string;
  live?: string;
  [key: string]: string | undefined;
}

interface Project {
  name: string;
  type?: string;
  desc: string;
  tags?: string[];
  links?: ProjectLinks;
  stars?: number;
}

function getLinkLabel(key: string): string {
  const labels: Record<string, string> = {
    github: "GitHub",
    live: "Live",
    demo: "Demo",
    docs: "Docs",
    website: "Website",
  };

  return labels[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

export default function ProjectsRenderer({
  result,
}: {
  result: CommandResult;
}) {
  const items = (result.def?.items as Project[] | undefined) ?? [];

  if (items.length === 0) {
    return (
      <div className="renderer-projects">
        <span className="project-empty">No projects found.</span>
      </div>
    );
  }

  return (
    <div className="renderer-projects">
      {items.map((project) => {
        const links = Object.entries(project.links ?? {}).filter(([, url]) =>
          Boolean(url),
        );

        return (
          <div className="project-block" key={project.name}>
            {/* Header */}
            <div className="project-head">
              <div className="project-title-group">
                <span className="project-name">{project.name}</span>

                {project.type && (
                  <span className="project-type">{project.type}</span>
                )}
              </div>

              {typeof project.stars === "number" && (
                <span className="project-stars">★ {project.stars}</span>
              )}
            </div>

            {/* Description */}
            <p className="project-desc">{project.desc}</p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="tag-badge" key={tag}>
                    [{tag}]
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            {/* Links */}
            {links.length > 0 && (
              <div className="project-links">
                {links.map(([key, url]) => (
                  <a
                    key={key}
                    className="project-link"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="project-link-label">
                      → {getLinkLabel(key)}:
                    </span>

                    <span className="project-link-url">{url}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
