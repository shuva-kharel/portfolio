"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import {
  extractGUIData,
  fallbackData,
  type PortfolioData,
} from "@/lib/portfolio";

const SOURCE = "https://www.shuvakharel.com.np/portfolio.json";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function PortfolioSite() {
  const [data, setData] = useState<PortfolioData>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "projects", "skills", "background", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme") as
      | "dark"
      | "light"
      | null;
    const system = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    setTheme(saved || system);
    fetch(SOURCE, { cache: "force-cache" })
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((json) => setData(extractGUIData(json)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const initials = useMemo(
    () => `${data.firstName[0] || "S"}${data.lastName[0] || "K"}`,
    [data],
  );
  if (loading)
    return (
      <div className="boot-screen">
        <div className="loader">
          <i />
          <i />
          <i />
        </div>
        <p>INITIALIZING PORTFOLIO DATA</p>
        <span>shuvakharel.com.np</span>
      </div>
    );

  return (
    <main>
      <header className="nav">
        <button
          className="logo"
          onClick={() => scrollToId("home")}
          aria-label="Go home"
        >
          <span className="brand-name">{data.firstName.toLowerCase()}</span>
          <span className="brand-at">@</span>
          <span className="brand-handle">blackarch</span>
        </button>
        <nav aria-label="Primary navigation">
          {[
            ["HOME", "home"],
            ["PROJECTS", "projects"],
            ["SKILLS", "skills"],
            ["BACKGROUND", "background"],
            ["CONNECT", "contact"],
          ].map(([label, id]) => (
            <button
              className={activeSection === id ? "active" : ""}
              key={id}
              onClick={() => scrollToId(id)}
              aria-current={activeSection === id ? "page" : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            className="contact-btn"
            href="https://shuvakharel.com.np/cv"
            target="_blank"
            rel="noreferrer"
          >
            VIEW CV <ExternalLink size={14} />
          </a>
        </div>
      </header>
      {error && (
        <div className="data-note">
          LIVE DATA UNAVAILABLE — SHOWING CACHED PORTFOLIO CONTENT
        </div>
      )}
      <section id="home" className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <b /> CYBERSECURITY · KATHMANDU · NEPAL
          </p>
          <h1>
            {data.firstName}
            <br />
            <em>{data.lastName}.</em>
          </h1>
          <p className="role">{data.role}</p>
          <p className="lede">
            Cybersecurity student focused on offensive security, vulnerability
            research, reverse engineering, exploit development, and CTFs.
          </p>
          <div className="hero-actions">
            <a
              className="button primary"
              href="https://shuvakharel.com.np/cv"
              target="_blank"
              rel="noreferrer"
            >
              VIEW CV <ExternalLink size={16} />
            </a>
            <button className="button" onClick={() => scrollToId("projects")}>
              VIEW PROJECTS <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="hero-meta">
            <span>
              <MapPin size={14} /> {data.location}
            </span>
            <a href={`mailto:${data.email}`}>
              <Mail size={14} /> {data.email}
            </a>
          </div>
        </div>
        <aside className="hero-aside">
          <span className="section-index">01 / ABOUT</span>
          <div className="mark">
            SEC
            <br />
            <em>URITY</em>
          </div>
          <div className="status">
            <span>STATUS</span>
            <strong>{data.status}</strong>
          </div>
          <div className="monogram">{initials}</div>
        </aside>
      </section>
      <section id="projects" className="section alt">
        <div className="wrap">
          <SectionHeading
            number="02"
            title="Selected Projects"
            text="A selection of security, AI, and web projects built with intent."
          />
          <div className="project-grid">
            {data.projects.map((project, i) => (
              <article className="project-card" key={project.name}>
                <div className="card-top">
                  <span className="number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={project.links?.live || project.links?.github || "#"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.name}`}
                  >
                    <ExternalLink size={17} />
                  </a>
                </div>
                <h3>{project.name}</h3>
                <div className="tags">
                  {(project.tags || []).map((tag: string) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <p>{project.desc}</p>
                <footer>
                  <span>{project.type}</span>
                  <div>
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Code2 size={14} /> GITHUB <ArrowUpRight size={13} />
                      </a>
                    )}
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Globe2 size={14} /> LIVE <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="skills" className="section wrap">
        <SectionHeading
          number="03"
          title="Technical Skills"
          text="Tools and disciplines I use to investigate, build, and break systems."
        />
        <div className="skills-grid">
          {Object.entries(data.skills).map(([category, skills]) => (
            <div className="skill-group" key={category}>
              <h3>{category}</h3>
              <div className="skill-list">
                {skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="background" className="section alt">
        <div className="wrap">
          <SectionHeading
            number="04"
            title="Background"
            text="The path behind the work, and the credentials still in motion."
          />
          <div className="background-grid">
            <div>
              <p className="label">EDUCATION</p>
              {data.education.map((item) => (
                <div className="timeline" key={`${item.year}-${item.title}`}>
                  <span>{item.year}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.institution}</p>
                    <small>{item.details}</small>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="label">CERTIFICATIONS & ACHIEVEMENTS</p>
              {data.certifications.map((cert) => (
                <div className="cert" key={cert.name}>
                  <div>
                    <h3>{cert.name}</h3>
                    <p>{cert.issuer}</p>
                  </div>
                  <span>{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="contact wrap">
        <div>
          <p className="section-index">05 / CONTACT</p>
          <h2>
            Let&apos;s build
            <br />
            <em>something.</em>
          </h2>
        </div>
        <div className="contact-panel">
          <p>
            Interested in cybersecurity, security research, collaboration,
            internships, or just talking tech? Drop me a message.
          </p>
          <a className="email-link" href={`mailto:${data.email}`}>
            <Mail size={19} /> {data.email} <ArrowUpRight size={18} />
          </a>
          <div className="socials">
            {data.socials.map((social) => (
              <a
                href={social.link}
                target="_blank"
                rel="noreferrer"
                key={social.platform}
              >
                <span>{social.platform}</span>
                <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        </div>
      </section>
      <footer className="site-footer wrap">
        <span>
          © {new Date().getFullYear()} {data.name}
        </span>
        <span>BUILT WITH CURIOSITY · POWERED BY COFFEE</span>
      </footer>
    </main>
  );
}

function SectionHeading({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="section-heading">
      <span className="section-index">{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}
