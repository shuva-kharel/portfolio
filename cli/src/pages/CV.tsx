import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../hooks/usePortfolio";
import type { Portfolio } from "../types";
import "./CV.css";

// ---------------------------------------------------------------------------
// /cv — a clean, professional, print-ready CV assembled entirely from
// portfolio.json. Same single source of truth as the terminal and the GUI,
// rendered as the visual opposite: light background, system fonts, A4 column.
// ---------------------------------------------------------------------------

// Any JSON value starting with "[TODO" is placeholder data — render it as
// intentionally missing (dimmed or hidden), never show the marker itself.
function isTodo(value: unknown): boolean {
  return typeof value === "string" && value.trim().startsWith("[TODO");
}

// True when a string field holds real, displayable content.
function present(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && !isTodo(value);
}

interface EducationItem {
  year?: string;
  title?: string;
  institution?: string;
  details?: string;
}

interface CertItem {
  name?: string;
  issuer?: string;
  year?: string;
  status?: string;
  link?: string;
  image?: string;
  category?: string;
  categoryLabel?: string;
}

interface CertCategory {
  label?: string;
  items?: CertItem[];
}

interface ProjectLinks {
  github?: string;
  live?: string;
  writeup?: string;
  docs?: string;
}

interface ProjectItem {
  name?: string;
  desc?: string;
  tags?: string[];
  links?: ProjectLinks;
  stars?: number;
}

interface WriteupItem {
  name?: string;
  desc?: string;
  platform?: string;
  date?: string;
  link?: string;
}

interface SocialItem {
  platform?: string;
  handle?: string;
  link?: string;
}

// The CV must stay a single printed A4 page. These caps keep it focused no
// matter how many items get added to portfolio.json — the terminal and GUI
// remain the exhaustive views; the CV shows the first (most important)
// entries. The print zoom auto-fit below is the hard guarantee.
const MAX_EDUCATION = 3;
const MAX_PROJECTS = 3;
const MAX_CERTIFICATIONS = 4;
const MAX_WRITEUPS = 2;

// Everything the sections need, extracted from portfolio.json in one place.
function extract(portfolio: Portfolio) {
  const whoamiLines = (portfolio.commands.whoami?.lines as string[]) ?? [];

  const field = (key: string): string | undefined =>
    whoamiLines
      .map((l) =>
        l.match(new RegExp(`^${key}\\s*:\\s*(.+)$`, "i"))?.[1]?.trim(),
      )
      .find(Boolean);

  const user = portfolio.meta.user ?? "";
  const fallbackName = user.charAt(0).toUpperCase() + user.slice(1);

  // Bio = whoami lines that are neither key-value pairs nor placeholders.
  const bio = whoamiLines.filter(
    (l) => l.trim() !== "" && !/^[A-Za-z][A-Za-z ]*\s*:/.test(l) && !isTodo(l),
  );

  const socials =
    (portfolio.commands.socials?.items as SocialItem[] | undefined) ?? [];
  const social = (platform: string) =>
    socials.find(
      (s) =>
        s.platform?.toLowerCase() === platform.toLowerCase() &&
        present(s.link) &&
        !isTodo(s.handle),
    );

  return {
    name: present(field("Name")) ? field("Name")! : fallbackName,
    role: field("Role"),
    location: present(field("Based"))
      ? field("Based")!
      : portfolio.meta.location_city
        ? `${portfolio.meta.location_city}, Nepal`
        : undefined,
    status: field("Status"),
    bio,
    email: portfolio.commands.email?.address as string | undefined,
    github: social("GitHub"),
    linkedin: social("LinkedIn"),
    tryhackme: social("TryHackMe"),
    hackthebox: social("HackTheBox"),
    education: (
      (portfolio.commands.education?.items as EducationItem[] | undefined) ?? []
    ).slice(0, MAX_EDUCATION),
    skills:
      (portfolio.commands.skills?.categories as
        | Record<string, string[]>
        | undefined) ?? {},
    projects: (
      (portfolio.commands.projects?.items as ProjectItem[] | undefined) ?? []
    )
      .filter((p) => present(p.name))
      .slice(0, MAX_PROJECTS),
    certifications: (() => {
      const categories =
        (portfolio.commands.certifications?.categories as
          | Record<string, CertCategory>
          | undefined) ?? {};

      const items: CertItem[] = [];

      for (const [categoryKey, category] of Object.entries(categories)) {
        for (const item of category.items ?? []) {
          if (!present(item.name)) continue;

          items.push({
            ...item,
            category: categoryKey,
            categoryLabel: category.label ?? categoryKey,
          });
        }
      }

      return items.slice(0, MAX_CERTIFICATIONS);
    })(),
    writeups: (
      (portfolio.commands.writeups?.items as WriteupItem[] | undefined) ?? []
    )
      .filter((w) => present(w.name))
      .slice(0, MAX_WRITEUPS),
    now: portfolio.now,
    uses: portfolio.uses,
  };
}

type CVData = ReturnType<typeof extract>;

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function CVHeader({ cv }: { cv: CVData }) {
  const contacts: Array<{ label: string; href?: string }> = [];

  if (present(cv.email))
    contacts.push({
      label: cv.email,
      href: `mailto:${cv.email}`,
    });

  for (const s of [cv.github, cv.linkedin, cv.tryhackme, cv.hackthebox]) {
    if (s?.link)
      contacts.push({
        label: `${s.platform}: ${
          s.handle ?? s.link.replace(/^https?:\/\//, "")
        }`,
        href: s.link,
      });
  }

  return (
    <header className="cv-header cv-section">
      <div className="cv-header-row">
        <div className="cv-header-id">
          <h1 className="cv-name">{cv.name}</h1>

          {cv.role && <p className="cv-role">{cv.role}</p>}

          {cv.location && <p className="cv-location">{cv.location}</p>}
        </div>

        <div className="cv-contact">
          {contacts.map((c) => (
            <div key={c.label} className="cv-contact-item">
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  {c.label}
                </a>
              ) : (
                c.label
              )}
            </div>
          ))}

          {/* Always show the status when portfolio.json provides one */}
          {present(cv.status) && (
            <span className="cv-status-badge badge-active">{cv.status}</span>
          )}
        </div>
      </div>

      <div className="cv-header-divider" />
    </header>
  );
}

function CVSummary({ cv }: { cv: CVData }) {
  if (cv.bio.length === 0) return null;
  return (
    <section className="cv-section">
      <h2 className="cv-heading">Summary</h2>
      {cv.bio.map((line) => (
        <p key={line} className="cv-bio">
          {line}
        </p>
      ))}
    </section>
  );
}

// Shared cell for fields that may still be [TODO] placeholders.
function MaybeTodo({
  value,
  className,
}: {
  value?: string;
  className?: string;
}) {
  if (!value) return null;
  if (isTodo(value))
    return (
      <div className={`cv-todo ${className ?? ""}`}>— not provided yet —</div>
    );
  return <div className={className}>{value}</div>;
}

function CVEducation({ cv }: { cv: CVData }) {
  if (cv.education.length === 0) return null;
  return (
    <section className="cv-section">
      <h2 className="cv-heading">Education</h2>
      {cv.education.map((e, i) => (
        <div key={i} className="cv-grid-row cv-edu-item">
          <div className="cv-year">{isTodo(e.year) ? "—" : e.year}</div>
          <div>
            <MaybeTodo value={e.institution} className="cv-edu-institution" />
            <MaybeTodo value={e.title} className="cv-edu-title" />
            {present(e.details) && (
              <div className="cv-edu-details">{e.details}</div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

function CVSkills({ cv }: { cv: CVData }) {
  const categories = Object.entries(cv.skills);
  if (categories.length === 0) return null;
  return (
    <section className="cv-section">
      <h2 className="cv-heading">Skills</h2>
      <div className="cv-skills-grid">
        {categories.map(([category, skills]) => (
          <div key={category} className="cv-skill-category">
            <div className="cv-skill-category-name">{category}</div>
            <div>
              {skills.filter(present).map((s) => (
                <span key={s} className="cv-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CVProjects({ cv }: { cv: CVData }) {
  if (cv.projects.length === 0) return null;

  return (
    <section className="cv-section">
      <h2 className="cv-heading">Projects</h2>

      {cv.projects.map((p) => (
        <div key={p.name} className="cv-project">
          <div className="cv-project-top">
            <span className="cv-project-name">{p.name}</span>

            {typeof p.stars === "number" && p.stars > 0 && (
              <span className="cv-project-stars">★ {p.stars}</span>
            )}

            <div className="cv-project-links">
              {present(p.links?.github) && (
                <a
                  href={p.links!.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}

              {present(p.links?.live) && (
                <a
                  href={p.links!.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live
                </a>
              )}

              {present(p.links?.writeup) && (
                <a
                  href={p.links!.writeup}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Writeup
                </a>
              )}

              {present(p.links?.docs) && (
                <a
                  href={p.links!.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </a>
              )}
            </div>
          </div>

          {present(p.desc) && <p className="cv-project-desc">{p.desc}</p>}

          {p.tags && p.tags.length > 0 && (
            <div className="cv-project-tags">
              {p.tags.filter(present).map((tag) => (
                <span key={tag} className="cv-chip cv-chip-small">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function CVCertifications({ cv }: { cv: CVData }) {
  if (cv.certifications.length === 0) return null;

  const categories = new Map<string, CertItem[]>();

  for (const cert of cv.certifications) {
    const key = cert.categoryLabel ?? "CERTIFICATIONS";

    if (!categories.has(key)) {
      categories.set(key, []);
    }

    categories.get(key)!.push(cert);
  }

  return (
    <section className="cv-section">
      <h2 className="cv-heading">Certifications & Achievements</h2>

      {Array.from(categories.entries()).map(([category, items]) => (
        <div className="cv-cert-category" key={category}>
          <div className="cv-cert-category-title">{category}</div>

          {items.map((c) => {
            const status = c.status?.toLowerCase() ?? "";

            let statusLabel = "";

            if (
              status.includes("winner") ||
              status.includes("place") ||
              status.includes("award")
            ) {
              statusLabel = c.status?.toUpperCase() ?? "";
            } else if (status.includes("earned") || status.includes("active")) {
              statusLabel = "EARNED";
            } else if (
              status.includes("progress") ||
              status.includes("pending")
            ) {
              statusLabel = "IN PROGRESS";
            } else if (present(c.status)) {
              statusLabel = c.status!.toUpperCase();
            }

            /*
             * Priority:
             *
             * 1. link  -> use link
             * 2. image -> use image
             * 3. neither -> no certificate link
             */
            const certificateUrl = present(c.link)
              ? c.link
              : present(c.image)
                ? c.image
                : undefined;

            return (
              <div className="cv-cert-row" key={c.name}>
                <div className="cv-year">{present(c.year) ? c.year : "—"}</div>

                <div className="cv-cert-main">
                  <div className="cv-cert-name">
                    {certificateUrl ? (
                      <a
                        href={certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open credential"
                      >
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </div>

                  {present(c.issuer) && (
                    <div className="cv-cert-issuer">{c.issuer}</div>
                  )}
                </div>

                <div className="cv-cert-meta">
                  {statusLabel && (
                    <span className="cv-badge badge-active">{statusLabel}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}

const PLATFORM_BADGES: Record<string, { background: string; color: string }> = {
  hackthebox: { background: "#1a1a2e", color: "#9fef00" },
  tryhackme: { background: "#1a2a1a", color: "#00ff7f" },
  picoctf: { background: "#1a1a3a", color: "#7090ff" },
};

function CVWriteups({ cv }: { cv: CVData }) {
  if (cv.writeups.length === 0) return null;
  return (
    <section className="cv-section">
      <h2 className="cv-heading">CTF Writeups</h2>
      {cv.writeups.map((w) => {
        const badge = PLATFORM_BADGES[
          (w.platform ?? "").toLowerCase().replace(/\s+/g, "")
        ] ?? { background: "#f0f0f0", color: "#333" };
        return (
          <div key={w.name} className="cv-grid-row cv-writeup">
            <div className="cv-year">{present(w.date) ? w.date : "—"}</div>
            <div>
              <div>
                {present(w.platform) && (
                  <span className="cv-platform-badge" style={badge}>
                    {w.platform}
                  </span>
                )}
                <span className="cv-writeup-name">{w.name}</span>
              </div>
              {present(w.desc) && (
                <div className="cv-writeup-desc">{w.desc}</div>
              )}
              {present(w.link) && (
                <a
                  className="cv-writeup-link"
                  href={w.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {w.link.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function CVCurrently({ cv }: { cv: CVData }) {
  const rows = (["learning", "building", "reading"] as const)
    .map((key) => ({ key, value: cv.now?.[key] }))
    .filter((r) => present(r.value));
  const tools = (["os", "editor", "terminal", "shell"] as const)
    .map((key) => cv.uses?.[key])
    .filter(present);

  if (rows.length === 0 && tools.length === 0) return null;
  return (
    <section className="cv-section">
      <h2 className="cv-heading">Currently</h2>
      {rows.map((r) => (
        <div key={r.key} className="cv-now-row">
          <span className="cv-now-key">{r.key}</span>
          <span className="cv-now-value">{r.value}</span>
        </div>
      ))}
      {tools.length > 0 && (
        <div className="cv-now-row">
          <span className="cv-now-key">Tools</span>
          <span className="cv-now-value">{tools.join(" · ")}</span>
        </div>
      )}
    </section>
  );
}

function CVFooter() {
  return (
    <footer className="cv-footer cv-footer-web">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CV() {
  const { data, error, loading } = usePortfolio();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Scope the light theme + print rules to this route only: all CV CSS keys
  // off body.cv-mode so the terminal/GUI print styles stay untouched.
  useEffect(() => {
    document.body.classList.add("cv-mode");
    return () => document.body.classList.remove("cv-mode");
  }, []);

  // Single-page guarantee: before printing, switch to the compact layout
  // (body.cv-printing mirrors the @media print spacing variables), measure
  // the real content height, and zoom the wrapper down so it always fits one
  // A4 page — however much content portfolio.json accumulates. beforeprint
  // fires for both the Download PDF button and the browser's own print menu.
  useEffect(() => {
    const PAGE_HEIGHT_PX = 975;
    const PAGE_WIDTH_PX = 673;

    const before = () => {
      const el = wrapperRef.current;
      if (!el) return;

      document.body.classList.add("cv-printing");

      // Reset any previous print adjustments.
      el.style.removeProperty("zoom");
      el.style.removeProperty("max-width");

      // Force layout using the compact print styles before measuring.
      void el.offsetHeight;

      const contentHeight = el.scrollHeight;

      /*
       * Leave a tiny safety margin so browser rounding does not create
       * an unexpected second page.
       */
      const targetHeight = PAGE_HEIGHT_PX - 8;

      /*
       * Calculate the scale needed to fit the complete CV.
       *
       * We also account for the fact that zoom changes text wrapping,
       * which changes the final height.
       */
      let zoom = Math.min(1, Math.sqrt(targetHeight / contentHeight));

      for (let i = 0; i < 8; i++) {
        el.style.zoom = String(zoom);

        /*
         * Widen the layout proportionally so zoom doesn't create
         * unnecessary whitespace on the right side of the page.
         */
        el.style.maxWidth = `${PAGE_WIDTH_PX / zoom}px`;

        // Force the browser to recalculate layout.
        void el.offsetHeight;

        const actualHeight = el.scrollHeight * zoom;

        if (actualHeight <= targetHeight) {
          break;
        }

        zoom *= (targetHeight / actualHeight) * 0.995;
      }

      /*
       * Final width adjustment.
       */
      el.style.maxWidth = `${PAGE_WIDTH_PX / zoom}px`;
    };

    const after = () => {
      const el = wrapperRef.current;

      if (el) {
        el.style.removeProperty("zoom");
        el.style.removeProperty("max-width");
      }

      document.body.classList.remove("cv-printing");
    };

    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);

    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const previous = document.title;
    document.title = `${extract(data).name} - CV`;
    return () => {
      document.title = previous;
    };
  }, [data]);

  if (loading) {
    return (
      <div className="cv-page">
        <div className="cv-message">Loading CV...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="cv-page">
        <div className="cv-message">
          Could not load CV data. Check portfolio.json exists in /public.
        </div>
      </div>
    );
  }

  const cv = extract(data);

  // Screen-only nudge while portfolio.json is still mostly placeholders:
  // if fewer than 2 of the content-bearing sections have real data, say so.

  return (
    <div className="cv-page">
      <div className="cv-wrapper" ref={wrapperRef}>
        <CVHeader cv={cv} />
        <CVSummary cv={cv} />
        <CVEducation cv={cv} />
        <CVSkills cv={cv} />
        <CVProjects cv={cv} />
        <CVCertifications cv={cv} />
        <CVWriteups cv={cv} />
        <CVCurrently cv={cv} />
        <CVFooter />
      </div>

      <div className="cv-actions">
        <button className="cv-btn cv-btn-back" onClick={() => navigate("/")}>
          ← Back
        </button>
        <button className="cv-btn cv-btn-print" onClick={() => window.print()}>
          ↓ Download PDF
        </button>
      </div>
    </div>
  );
}
