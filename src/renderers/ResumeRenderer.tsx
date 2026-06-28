import type { CommandResult } from "../types";
import { usePortfolioData } from "../context";

interface EduItem {
  year: string;
  title: string;
  institution?: string;
}

// The `resume` command: a terminal-formatted one-page resume assembled from
// portfolio.json, plus a link to the downloadable PDF (resume.download_url).
export default function ResumeRenderer(_: { result: CommandResult }) {
  const data = usePortfolioData();
  const resume = data.resume ?? {};
  const sections = (resume.sections ?? {}) as {
    education?: EduItem[];
    skills_summary?: string;
    certifications_summary?: string;
  };
  const name = data.meta.user.toUpperCase();
  const role =
    (data.commands.whoami?.lines as string[] | undefined)
      ?.map((l) => l.match(/^Role\s*:\s*(.+)$/i)?.[1])
      .find(Boolean) ?? "Security Researcher";
  const email = (data.commands.email?.address as string | undefined) ?? "";
  const github =
    (data.commands.socials?.items as Array<{ platform: string; link: string }>)
      ?.find((s) => s.platform.toLowerCase() === "github")
      ?.link?.replace(/^https?:\/\//, "") ?? "";
  const projects =
    (data.commands.projects?.items as Array<{ name: string; desc: string }>) ??
    [];
  const downloadUrl = resume.download_url;

  const header = [
    "┌─────────────────────────────────────────┐",
    `│  ${name} — ${role.toUpperCase()}`,
    `│  ${[email, github].filter(Boolean).join(" · ")}`,
    "└─────────────────────────────────────────┘",
  ];

  const lines: string[] = [...header, ""];

  if (sections.education?.length) {
    lines.push("EDUCATION", "─────────");
    for (const e of sections.education) {
      lines.push(
        `${e.year.padEnd(14)}${e.title}${
          e.institution ? ` — ${e.institution}` : ""
        }`
      );
    }
    lines.push("");
  }

  if (sections.skills_summary) {
    lines.push("SKILLS", "──────", sections.skills_summary, "");
  }

  if (projects.length) {
    lines.push("PROJECTS", "────────");
    const w = projects.reduce((m, p) => Math.max(m, p.name.length), 0) + 2;
    for (const p of projects) {
      lines.push(`${p.name.padEnd(w)}${p.desc.split(".")[0]}`);
    }
    lines.push("");
  }

  if (sections.certifications_summary) {
    lines.push("CERTIFICATIONS", "──────────────", sections.certifications_summary, "");
  }

  return (
    <div className="renderer-resume">
      <pre className="resume-pre">{lines.join("\n")}</pre>
      {downloadUrl && (
        <p className="term-line">
          →{" "}
          <a
            className="term-link"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            download full resume
          </a>{" "}
          [opens in new tab]
        </p>
      )}
    </div>
  );
}
