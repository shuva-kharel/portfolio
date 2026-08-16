import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiDownload,
  FiExternalLink,
  FiGithub,
  FiMail,
  FiMapPin,
  FiMoon,
  FiSun,
  FiTerminal,
} from "react-icons/fi";

import { usePortfolio } from "../hooks/usePortfolio";
import type { Portfolio } from "../types";

import "./gui.css";

/* =========================================================
   TYPES
========================================================= */

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
  type?: string;
  desc?: string;
  tags?: string[];
  links?: ProjectLinks;
  stars?: number;
}

interface SocialItem {
  platform?: string;
  handle?: string;
  link?: string;
  rank?: string;
  progress?: number;
}

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "portfolio-theme";

/* =========================================================
   HELPERS
========================================================= */

function isTodo(value: unknown): boolean {
  return (
    typeof value === "string" && value.trim().toUpperCase().startsWith("[TODO")
  );
}

function present(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && !isTodo(value);
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/* =========================================================
   THEME
   Purely CSS-var driven via `data-theme` on <html>, so the
   toggle can't be fought by any hardcoded color elsewhere.
========================================================= */

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "dark" || stored === "light") {
    return stored;
  }

  const prefersLight =
    window.matchMedia?.("(prefers-color-scheme: light)").matches ?? false;

  return prefersLight ? "light" : "dark";
}

/* =========================================================
   DATA EXTRACTION
========================================================= */

function extractGUIData(portfolio: Portfolio) {
  const whoamiLines =
    (portfolio.commands?.whoami?.lines as string[] | undefined) ?? [];

  const field = (key: string): string | undefined =>
    whoamiLines
      .map((line) =>
        line.match(new RegExp(`^${key}\\s*:\\s*(.+)$`, "i"))?.[1]?.trim(),
      )
      .find(Boolean);

  const fallbackName = portfolio.meta?.user
    ? portfolio.meta.user.charAt(0).toUpperCase() + portfolio.meta.user.slice(1)
    : "Shuva";

  const socials =
    (portfolio.commands?.socials?.items as SocialItem[] | undefined) ?? [];

  const social = (platform: string) =>
    socials.find(
      (item) =>
        item.platform?.toLowerCase() === platform.toLowerCase() &&
        present(item.link),
    );

  const projects = (
    (portfolio.commands?.projects?.items as ProjectItem[] | undefined) ?? []
  ).filter((project) => present(project.name));

  const education = (
    (portfolio.commands?.education?.items as EducationItem[] | undefined) ?? []
  ).filter(
    (item) =>
      present(item.title) || present(item.institution) || present(item.year),
  );

  const skills =
    (portfolio.commands?.skills?.categories as
      | Record<string, string[]>
      | undefined) ?? {};

  /*
   * Flatten every certification category.
   *
   * This is better than hardcoding:
   * professional / achievements
   *
   * because portfolio.json can gain new categories later.
   */
  const certificationCategories =
    (portfolio.commands?.certifications?.categories as
      | Record<string, CertCategory>
      | undefined) ?? {};

  const certifications: CertItem[] = [];

  for (const [categoryKey, category] of Object.entries(
    certificationCategories,
  )) {
    for (const item of category.items ?? []) {
      if (!present(item.name)) continue;

      certifications.push({
        ...item,
        category: categoryKey,
        categoryLabel: category.label ?? categoryKey,
      });
    }
  }

  return {
    name: present(field("Name")) ? field("Name")! : fallbackName,

    role: field("Role"),

    location: present(field("Based"))
      ? field("Based")!
      : portfolio.meta?.location_city
        ? `${portfolio.meta.location_city}, Nepal`
        : "Kathmandu, Nepal",

    status: field("Status"),

    projects,

    education,

    skills,

    certifications,

    socials,

    email: portfolio.commands?.email?.address ?? "hey.shuva@gmail.com",

    resumeUrl: portfolio.resume?.download_url ?? "/resume.pdf",

    github: social("GitHub"),

    linkedin: social("LinkedIn"),

    tryhackme: social("TryHackMe"),

    hackthebox: social("HackTheBox"),
  };
}

/* =========================================================
   MAIN GUI
========================================================= */

export default function GUI() {
  const { data, error, loading: portfolioLoading } = usePortfolio();

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  /* -------------------------------------------------------
     Boot
  ------------------------------------------------------- */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => window.clearTimeout(timer);
  }, []);

  /* -------------------------------------------------------
     Theme: apply + persist

     Everything else in the CSS reads from the `data-theme`
     attribute via custom properties — we never touch
     individual color variables from JS, so there's nothing
     here to fight a future palette tweak in the stylesheet.
  ------------------------------------------------------- */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  /* -------------------------------------------------------
     Keyboard scrolling

     Native browser scrolling stays untouched here — this only
     adds Page/Home/End/Arrow support on top of it.
  ------------------------------------------------------- */

  /* -------------------------------------------------------
     Loading
  ------------------------------------------------------- */

  if (loading || portfolioLoading) {
    return (
      <div className="gui-loading">
        <span className="loading-line" />
        <span>INITIALIZING GUI...</span>
      </div>
    );
  }

  /* -------------------------------------------------------
     Error
  ------------------------------------------------------- */

  if (error || !data) {
    return (
      <div className="gui-loading">
        <span>COULD NOT LOAD PORTFOLIO DATA.</span>
      </div>
    );
  }

  /* -------------------------------------------------------
     Extract JSON
  ------------------------------------------------------- */

  const gui = extractGUIData(data);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="gui">
      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="gui-nav">
        <div className="gui-logo">
          {gui.name.split(" ")[0].toLowerCase()}
          <i>@</i>
          blackarch
        </div>

        <nav>
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("home");
            }}
          >
            HOME
          </a>

          <a
            href="#projects"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("projects");
            }}
          >
            PROJECTS
          </a>

          <a
            href="#skills"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("skills");
            }}
          >
            SKILLS
          </a>

          <a
            href="#background"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("background");
            }}
          >
            BACKGROUND
          </a>
        </nav>

        <div className="gui-nav-right">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          <a className="nav-contact" href={`mailto:${gui.email}`}>
            <FiMail />
            CONTACT
          </a>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section id="home" className="hero gui-container">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            CYBERSECURITY · KATHMANDU · NEPAL
          </div>

          <h1>
            {gui.name.split(" ")[0]}
            <br />
            <span className="hero-accent">
              {gui.name.split(" ").slice(1).join(" ")}.
            </span>
          </h1>

          {present(gui.role) && <p className="hero-role">{gui.role}</p>}

          <p className="hero-description">
            Cybersecurity student focused on offensive security, vulnerability
            research, reverse engineering, exploit development, and CTFs.
          </p>

          <div className="hero-actions">
            <a
              className="button button-primary"
              href={gui.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiDownload />
              VIEW RESUME
            </a>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => scrollToId("projects")}
            >
              <FiTerminal />
              VIEW PROJECTS
            </button>
          </div>

          <div className="hero-meta">
            <span>
              <FiMapPin />
              {gui.location}
            </span>

            {present(gui.email) && (
              <a href={`mailto:${gui.email}`}>
                <FiMail />
                {gui.email}
              </a>
            )}
          </div>
        </div>

        <aside className="hero-side">
          <div className="hero-index">01 / ABOUT</div>

          <div className="hero-mark">
            <span>SEC</span>
            <span>URITY</span>
          </div>

          <div className="hero-side-bottom">
            <span>STATUS</span>

            <strong>
              {present(gui.status)
                ? gui.status
                : "Seeking security opportunities"}
            </strong>
          </div>
        </aside>
      </section>

      {/* =====================================================
          PROJECTS
      ===================================================== */}

      <section id="projects" className="section section-alt">
        <div className="gui-container">
          <div className="section-heading">
            <div>
              <span className="section-number">02</span>

              <h2>
                Selected
                <br />
                Projects
              </h2>
            </div>

            <p>
              Security research, AI systems, open-source software, and
              applications built through experimentation and hands-on
              development.
            </p>
          </div>

          {gui.projects.length > 0 ? (
            <div className="project-grid">
              {gui.projects.map((project, index) => {
                const github = project.links?.github;

                const live = project.links?.live;

                const writeup = project.links?.writeup;

                const docs = project.links?.docs;

                const primaryLink = github || live || writeup || docs;

                return (
                  <article
                    className="project-card"
                    key={`${project.name}-${index}`}
                  >
                    <span className="project-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="project-top">
                      <div>
                        <h3>{project.name}</h3>

                        {project.tags && project.tags.length > 0 && (
                          <div className="project-tags">
                            {project.tags.filter(present).map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {present(primaryLink) && (
                        <a
                          className="project-link"
                          href={primaryLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.name}`}
                        >
                          <FiArrowUpRight />
                        </a>
                      )}
                    </div>

                    {present(project.desc) && (
                      <p className="project-description">{project.desc}</p>
                    )}

                    <div className="project-bottom">
                      <span>
                        {present(project.type) ? project.type : "PROJECT"}
                      </span>

                      <div
                        style={{
                          display: "flex",
                          gap: "14px",
                        }}
                      >
                        {present(github) && (
                          <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} GitHub`}
                          >
                            <FiGithub />
                            GITHUB
                          </a>
                        )}

                        {present(live) && (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiExternalLink />
                            LIVE
                          </a>
                        )}

                        {present(writeup) && (
                          <a
                            href={writeup}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiExternalLink />
                            WRITEUP
                          </a>
                        )}

                        {present(docs) && (
                          <a
                            href={docs}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiExternalLink />
                            DOCS
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty">No projects available.</div>
          )}
        </div>
      </section>

      {/* =====================================================
          SKILLS
      ===================================================== */}

      <section id="skills" className="section">
        <div className="gui-container">
          <div className="section-heading">
            <div>
              <span className="section-number">03</span>

              <h2>
                Technical
                <br />
                Skills
              </h2>
            </div>

            <p>
              A growing security-focused toolkit spanning offensive security,
              vulnerability research, programming, systems, and security
              tooling.
            </p>
          </div>

          <div className="skills-layout">
            {Object.entries(gui.skills).map(([category, items]) => {
              const validItems = items.filter(present);

              if (validItems.length === 0) {
                return null;
              }

              return (
                <div className="skill-group" key={category}>
                  <h3>{category}</h3>

                  <div className="skill-list">
                    {validItems.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <section id="background" className="section section-alt">
        <div className="gui-container">
          <div className="section-heading">
            <div>
              <span className="section-number">04</span>

              <h2>Background</h2>
            </div>

            <p>
              Education, certifications, and the milestones behind the work.
            </p>
          </div>

          <div className="background-grid">
            {/* EDUCATION */}

            <div>
              <div className="small-label">EDUCATION</div>

              {gui.education.length > 0 ? (
                gui.education.map((item, index) => (
                  <div
                    className="timeline-item"
                    key={`${item.year}-${item.title}-${index}`}
                  >
                    <span className="timeline-year">
                      {present(item.year) ? item.year : "—"}
                    </span>

                    <div>
                      {present(item.title) && <h3>{item.title}</h3>}

                      {present(item.institution) && (
                        <p className="timeline-title">{item.institution}</p>
                      )}

                      {present(item.details) && (
                        <p className="timeline-details">{item.details}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="muted">No education listed.</p>
              )}
            </div>

            {/* CERTIFICATIONS */}

            <div>
              <div className="small-label">CERTIFICATIONS</div>

              {gui.certifications.length > 0 ? (
                gui.certifications.map((cert, index) => {
                  const certificateUrl = present(cert.link)
                    ? cert.link
                    : present(cert.image)
                      ? cert.image
                      : undefined;

                  return (
                    <div className="cert-item" key={`${cert.name}-${index}`}>
                      <div>
                        <h3>
                          {certificateUrl ? (
                            <a
                              href={certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {cert.name}
                            </a>
                          ) : (
                            cert.name
                          )}
                        </h3>

                        {present(cert.issuer) && <p>{cert.issuer}</p>}
                      </div>

                      {present(cert.year) ? (
                        <span>{cert.year}</span>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="muted">No certifications listed.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section id="contact" className="contact-section">
        <div className="gui-container">
          <div className="contact-inner">
            <div>
              <span className="section-number">05 / CONTACT</span>

              <h2>
                Let's build
                <br />
                <em>something.</em>
              </h2>
            </div>

            <div className="contact-right">
              <p>
                Interested in cybersecurity, security research, collaboration,
                internships, or just talking tech? Drop me a message.
              </p>

              {present(gui.email) && (
                <a className="email-link" href={`mailto:${gui.email}`}>
                  <FiMail />

                  {gui.email}

                  <FiArrowUpRight />
                </a>
              )}

              <div className="social-links">
                {gui.socials
                  .filter(
                    (social) =>
                      present(social.link) && present(social.platform),
                  )
                  .map((social) => (
                    <a
                      key={`${social.platform}-${social.link}`}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.platform}

                      <FiArrowUpRight />
                    </a>
                  ))}
              </div>
            </div>
          </div>

          <footer>
            <span>
              © {new Date().getFullYear()} {gui.name}
            </span>

            <span>BUILT WITH CURIOSITY · POWERED BY COFFEE</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
