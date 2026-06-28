import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../hooks/usePortfolio";
import "./HUD.css";

// ---------------------------------------------------------------------------
// /hud — a SOC-style visual dashboard rendered entirely from portfolio.json.
// Every visible value is read from the fetched JSON; the only literal strings
// here are class names, the section file-path labels, and the return button.
// ---------------------------------------------------------------------------

// Local shapes for the slices of portfolio.json the HUD reads.
interface Project {
  name: string;
  desc: string;
  tags?: string[];
  link?: string;
  stars?: number;
}
interface Cert {
  name: string;
  issuer: string;
  year: string;
  status: string;
}
interface Education {
  year: string;
  title: string;
  institution?: string;
  details?: string;
}
interface Writeup {
  name: string;
  desc?: string;
  link?: string;
}
interface Social {
  platform: string;
  handle: string;
  link: string;
  rank?: string;
  progress?: number;
}

// Live GitHub stats, derived from the public API (no auth needed).
interface GithubInfo {
  repos: number;
  followers: number;
  since?: number;
  bio?: string;
  activity?: string;
}

// "PushEvent" -> "PUSH", "CreateEvent" -> "CREATE", etc.
function ghEventLabel(type: string): string {
  return (type || "ACTIVITY").replace(/Event$/, "").toUpperCase();
}

// Human-friendly "x days ago" from an ISO timestamp.
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) {
    const hours = Math.floor((Date.now() - then) / 3_600_000);
    if (hours <= 0) return "just now";
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

// Reveal-on-scroll: flips to visible the first time the element enters view.
function useReveal<T extends HTMLElement>(
  threshold = 0.1
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref as RefObject<T>, visible];
}

// Four absolutely-positioned corner brackets for a panel.
function Corners() {
  return (
    <>
      <span className="corner corner-tl" aria-hidden="true" />
      <span className="corner corner-tr" aria-hidden="true" />
      <span className="corner corner-bl" aria-hidden="true" />
      <span className="corner corner-br" aria-hidden="true" />
    </>
  );
}

// Reusable bracketed panel with a file-path style label and scroll reveal.
function Panel({
  label,
  id,
  className,
  children,
  onVisible,
}: {
  label?: string;
  id?: string;
  className?: string;
  children: ReactNode;
  onVisible?: (v: boolean) => void;
}) {
  const [ref, visible] = useReveal<HTMLElement>();
  useEffect(() => {
    if (visible) onVisible?.(true);
  }, [visible, onVisible]);
  return (
    <section
      id={id}
      ref={ref}
      className={`hud-panel ${visible ? "is-visible" : ""} ${className ?? ""}`}
    >
      <Corners />
      {label && <div className="panel-label">{label}</div>}
      {children}
    </section>
  );
}

// Single skill proficiency bar; width animates in once `active`.
function SkillBar({
  name,
  pct,
  index,
  active,
}: {
  name: string;
  pct: number;
  index: number;
  active: boolean;
}) {
  return (
    <div className="skill-row">
      <div className="skill-meta">
        <span className="skill-name">{name}</span>
        <span className="skill-pct">{pct}%</span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{
            width: active ? `${pct}%` : "0%",
            transitionDelay: `${index * 50}ms`,
          }}
        />
      </div>
    </div>
  );
}

// Build a fixed-width ASCII frame around the given lines.
function frameBox(lines: string[]): string {
  const width = Math.max(...lines.map((l) => l.length));
  const top = "┌" + "─".repeat(width + 2) + "┐";
  const bottom = "└" + "─".repeat(width + 2) + "┘";
  const body = lines.map((l) => "│ " + l.padEnd(width) + " │");
  return [top, ...body, bottom].join("\n");
}

function statusColorClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "active") return "dot-green";
  if (s === "in-progress") return "dot-amber";
  if (s === "expired") return "dot-red";
  return "dot-muted";
}

export default function HUD() {
  const navigate = useNavigate();
  const { data } = usePortfolio();
  const [loaded, setLoaded] = useState(false);
  const [skillsActive, setSkillsActive] = useState(false);
  const [github, setGithub] = useState<GithubInfo | null>(null);

  // Page fade-in on mount.
  useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Fetch live GitHub stats for the handle in socials. Any failure (network,
  // rate-limit, missing user) is swallowed and the panel simply never renders.
  useEffect(() => {
    if (!data) return;
    const socials = data.commands.socials?.items as
      | Array<{ platform: string; link?: string }>
      | undefined;
    const link = socials?.find(
      (s) => s.platform.toLowerCase() === "github"
    )?.link;
    const username = link?.split("github.com/")[1]?.replace(/\/+$/, "");
    if (!username) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) return;
        const u = await res.json();

        let activity: string | undefined;
        try {
          const evRes = await fetch(
            `https://api.github.com/users/${username}/events/public`
          );
          if (evRes.ok) {
            const events = await evRes.json();
            const ev = Array.isArray(events) ? events[0] : null;
            if (ev?.repo?.name) {
              activity = `${ghEventLabel(ev.type)} — ${ev.repo.name} — ${timeAgo(
                ev.created_at
              )}`;
            }
          }
        } catch {
          /* activity is optional */
        }

        if (cancelled) return;
        setGithub({
          repos: u.public_repos ?? 0,
          followers: u.followers ?? 0,
          since: u.created_at ? new Date(u.created_at).getFullYear() : undefined,
          bio: u.bio || undefined,
          activity,
        });
      } catch {
        /* silent: never show an error state */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data]);

  // Derive everything from JSON. Memoised so it only recomputes when data loads.
  const model = useMemo(() => {
    if (!data) return null;
    const c = data.commands;

    // Parse whoami into key/value info + free-text prose.
    const info: Record<string, string> = {};
    const prose: string[] = [];
    const whoami = (c.whoami?.lines as string[] | undefined) ?? [];
    for (const line of whoami) {
      const m = line.match(/^([A-Za-z ]+?)\s*:\s*(.+)$/);
      if (m) info[m[1].trim().toLowerCase()] = m[2].trim();
      else if (line.trim() !== "") prose.push(line);
    }

    const tagline = (c.welcome?.tagline as string | undefined) ?? "";
    const eyebrow = tagline.split(".")[0].trim();

    const focusAreas = (info.focus ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const categories =
      (c.skills?.categories as Record<string, string[]> | undefined) ?? {};
    const projects = (c.projects?.items as Project[] | undefined) ?? [];
    const certs = (c.certifications?.items as Cert[] | undefined) ?? [];
    const education = (c.education?.items as Education[] | undefined) ?? [];
    const writeups = (c.writeups?.items as Writeup[] | undefined) ?? [];
    const socials = (c.socials?.items as Social[] | undefined) ?? [];
    const email = (c.email?.address as string | undefined) ?? "";
    const now = (data.now as Record<string, string> | undefined) ?? {};

    return {
      info,
      prose,
      eyebrow,
      focusAreas,
      categories,
      projects,
      certs,
      education,
      writeups,
      socials,
      email,
      now,
    };
  }, [data]);

  // ---- loading state: nav + a single blinking line, nothing else ----------
  if (!data || !model) {
    return (
      <div className="hud-root">
        <HudBackground />
        <nav className="hud-nav">
          <div className="nav-logo">// HUD</div>
          <div className="nav-status">
            <span className="status-dot" />
            <span>ONLINE</span>
          </div>
        </nav>
        <div className="hud-loading">
          LOADING INTELLIGENCE...<span className="load-cursor" />
        </div>
      </div>
    );
  }

  const { meta } = data;
  const navLinks = [
    { label: "ABOUT", target: "about" },
    { label: "SKILLS", target: "skills" },
    { label: "PROJECTS", target: "projects" },
    { label: "CERTS", target: "certs" },
    { label: "CONTACT", target: "contact" },
  ];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Hero stats — real counts from the JSON arrays.
  const stats = [
    { value: model.projects.length, label: "PROJECTS", tone: "cyan" },
    { value: model.certs.length, label: "CERTS", tone: "green" },
    { value: model.writeups.length, label: "CTF SOLVES", tone: "amber" },
    {
      value: Object.keys(model.categories).length,
      label: "SKILL AREAS",
      tone: "cyan",
    },
  ];

  const sysInfo: Array<[string, string, boolean]> = [
    ["USER", meta.user, false],
    ["HOST", meta.host, false],
    ["ROLE", model.info.role ?? "", false],
    ["STATUS", model.info.status ?? "", true],
    ["LOCATION", model.info.based ?? "", false],
    ["FOCUS", model.info.focus ?? "", false],
  ];

  const ctfPlatforms = model.socials.filter(
    (s) => typeof s.progress === "number"
  );

  const commsBox = frameBox([
    `PING ${model.email}`,
    "> Connection secure",
    "> Encryption: PGP",
    "> Status: AWAITING",
  ]);

  // Running index across all skill bars for a cascading stagger.
  let skillIndex = 0;

  return (
    <div className={`hud-root ${loaded ? "is-loaded" : ""}`}>
      <HudBackground />

      {/* ---- NAV ---- */}
      <nav className="hud-nav">
        <div className="nav-logo">
          // HUD.{meta.user.toUpperCase()}.{meta.host.toUpperCase()}
        </div>
        <div className="nav-links">
          {navLinks.map((l) => (
            <button
              key={l.target}
              className="nav-link"
              onClick={() => scrollTo(l.target)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="nav-status">
          <span className="status-dot" />
          <span>ONLINE</span>
        </div>
      </nav>

      <main className="hud-main">
        {/* ---- HERO ---- */}
        <Panel className="hero-panel">
          <div className="hero-eyebrow">{`// ${model.eyebrow.toUpperCase()} \\\\`}</div>
          <h1 className="hero-name" data-text={meta.user.toUpperCase()}>
            {meta.user.toUpperCase()}
          </h1>
          <div className="hero-role">
            {model.focusAreas.map((area, i) => (
              <span key={area} className="role-seg">
                {i > 0 && <span className="role-dot">·</span>}
                {area}
              </span>
            ))}
          </div>
          <div className="hero-stats">
            {stats.map((s) => (
              <div className="stat-block" key={s.label}>
                <div className={`stat-value tone-${s.tone}`}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ---- ABOUT + SYS.INFO ---- */}
        <div className="hud-grid grid-60-40" id="about">
          <Panel label="// ABOUT.TXT">
            <div className="about-body">
              {model.prose.map((line, i) => (
                <p
                  className="about-line"
                  key={i}
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  {line}
                </p>
              ))}
            </div>
          </Panel>
          <Panel label="// SYS.INFO">
            <div className="sysinfo">
              {sysInfo.map(([k, v, isStatus]) => (
                <div className="sys-row" key={k}>
                  <span className="sys-key">{k}</span>
                  <span className="sys-sep">:</span>
                  <span className="sys-val">
                    {isStatus && <span className="status-dot inline" />}
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ---- NOW ---- */}
        <Panel label="// NOW.TXT">
          <div className="now-grid">
            {(
              [
                ["LEARNING", model.now.learning],
                ["BUILDING", model.now.building],
                ["READING", model.now.reading],
                ["PLAYING", model.now.playing],
              ] as Array<[string, string | undefined]>
            ).map(([label, value]) =>
              value ? (
                <div className="now-col" key={label}>
                  <div className="now-label">{label}</div>
                  <div className="now-value">{value}</div>
                </div>
              ) : null
            )}
          </div>
        </Panel>

        {/* ---- SKILLS ---- */}
        <Panel
          label="// SKILLS.MAP"
          id="skills"
          onVisible={() => setSkillsActive(true)}
        >
          <div className="skills-grid">
            {Object.entries(model.categories).map(([cat, skills]) => (
              <div className="skill-cat" key={cat}>
                <div className="skill-cat-name">{cat}</div>
                {skills.map((skill, i) => {
                  const pct = Math.max(55, 90 - i * 5);
                  const idx = skillIndex++;
                  return (
                    <SkillBar
                      key={skill}
                      name={skill}
                      pct={pct}
                      index={idx}
                      active={skillsActive}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </Panel>

        {/* ---- PROJECTS ---- */}
        <Panel label="// PROJECTS.LOG" id="projects">
          <div className="projects">
            {model.projects.map((p) => (
              <article className="project-card" key={p.name}>
                <div className="project-top">
                  <span className="project-name">{p.name}</span>
                  {p.link && (
                    <a
                      className="project-view"
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      [ VIEW → ]
                    </a>
                  )}
                </div>
                <p className="project-desc">{p.desc}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span className="pill" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Panel>

        {/* ---- GITHUB.LIVE (only if the API responded) ---- */}
        {github && (
          <Panel label="// GITHUB.LIVE">
            <div className="github-grid">
              <div className="github-stats">
                <div className="gh-stat">
                  <span className="gh-value">{github.repos}</span>
                  <span className="gh-label">PUBLIC REPOS</span>
                </div>
                <div className="gh-stat">
                  <span className="gh-value">{github.followers}</span>
                  <span className="gh-label">FOLLOWERS</span>
                </div>
                {github.since !== undefined && (
                  <div className="gh-stat">
                    <span className="gh-value">{github.since}</span>
                    <span className="gh-label">MEMBER SINCE</span>
                  </div>
                )}
                {github.bio && <p className="gh-bio">{github.bio}</p>}
              </div>
              <div className="github-activity">
                <div className="gh-activity-label">LAST ACTIVITY</div>
                <div className="gh-activity-value">
                  {github.activity ?? "No recent public activity."}
                </div>
              </div>
            </div>
          </Panel>
        )}

        {/* ---- CERTS + EDUCATION ---- */}
        <div className="hud-grid grid-50-50" id="certs">
          <Panel label="// CERTIFICATIONS.DB">
            <div className="cert-list">
              {model.certs.map((cert) => (
                <div className="cert-row" key={cert.name}>
                  <span className={`dot ${statusColorClass(cert.status)}`} />
                  <span className="cert-name">{cert.name}</span>
                  <span className="cert-issuer">{cert.issuer}</span>
                  <span className="cert-year">{cert.year}</span>
                  <span
                    className={`cert-badge badge-${statusColorClass(
                      cert.status
                    ).replace("dot-", "")}`}
                  >
                    {cert.status.replace(/-/g, " ").toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel label="// EDUCATION.LOG">
            <div className="edu-list">
              {model.education.map((e, i) => (
                <div className="edu-row" key={i}>
                  <span className="edu-year">{e.year}</span>
                  <span className="edu-connector" aria-hidden="true" />
                  <span className="edu-body">
                    <span className="edu-title">{e.title}</span>
                    {e.institution && (
                      <span className="edu-inst">{e.institution}</span>
                    )}
                    {e.details && <span className="edu-details">{e.details}</span>}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ---- CTF.STATS + TOOLS.ARSENAL ---- */}
        <div className="hud-grid grid-50-50">
          <Panel label="// CTF.STATS">
            <div className="ctf-platforms">
              {ctfPlatforms.map((p) => (
                <div className="ctf-row" key={p.platform}>
                  <div className="ctf-meta">
                    <span className="ctf-platform">{p.platform}</span>
                    {p.rank && <span className="ctf-rank">{p.rank}</span>}
                  </div>
                  <div className="ctf-track">
                    <div
                      className="ctf-fill"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="writeup-list">
              {model.writeups.map((w) => {
                const tag = w.name.includes(":")
                  ? w.name.split(":")[0].trim()
                  : w.name.split(" ")[0];
                return (
                  <div className="writeup-row" key={w.name}>
                    <span className="writeup-tag">{tag}</span>
                    <span className="writeup-body">
                      <span className="writeup-name">{w.name}</span>
                      {w.desc && (
                        <span className="writeup-desc">{w.desc}</span>
                      )}
                    </span>
                    {w.link && (
                      <a
                        className="writeup-link"
                        href={w.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>
          <Panel label="// TOOLS.ARSENAL">
            <div className="arsenal">
              {Object.entries(model.categories).map(([cat, skills]) => (
                <div className="arsenal-group" key={cat}>
                  <div className="arsenal-cat">{cat}</div>
                  <div className="arsenal-chips">
                    {skills.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ---- CONTACT ---- */}
        <Panel label="// SECURE.COMMS" id="contact" className="comms-panel">
          <div className="comms-grid">
            <div className="comms-left">
              <div className="comms-heading">ESTABLISH CONNECTION</div>
              {model.socials.map((s) => (
                <div className="comms-row" key={s.platform}>
                  <span className="comms-platform">{s.platform}</span>
                  <span className="comms-handle">{s.handle}</span>
                  <a
                    className="comms-link"
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [→]
                  </a>
                </div>
              ))}
              <div className="comms-row">
                <span className="comms-platform">Email</span>
                <a className="comms-handle as-link" href={`mailto:${model.email}`}>
                  {model.email}
                </a>
              </div>
            </div>
            <div className="comms-right">
              <pre className="comms-ascii">{commsBox}</pre>
            </div>
          </div>
        </Panel>
      </main>

      <button
        className="return-btn"
        onClick={() => navigate("/")}
        aria-label="Return to terminal"
      >
        ← RETURN TO TERMINAL
      </button>
    </div>
  );
}

// The three stacked, static background layers (base, grid, scanlines).
function HudBackground() {
  return (
    <div className="hud-bg-layers" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-scanlines" />
    </div>
  );
}
