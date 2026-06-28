import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMonitor,
  FiTerminal,
  FiCode,
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiExternalLink,
  FiStar,
  FiGitCommit,
  FiUsers,
  FiBook,
  FiZap,
  FiTarget,
  FiTool,
  FiAward,
  FiClock,
  FiWifi,
  FiMail,
  FiActivity,
  FiLayers,
  FiCpu,
} from "react-icons/fi";
import { SiGithub, SiHackthebox, SiTryhackme, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { usePortfolio } from "../hooks/usePortfolio";
import "./HUD.css";

// ===========================================================================
// /hud — bento-grid SOC dashboard. Every value comes from portfolio.json.
// ===========================================================================

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
interface Writeup {
  name: string;
  desc?: string;
  link?: string;
  severity?: string;
  platform?: string;
  date?: string;
}
interface Social {
  platform: string;
  handle: string;
  link: string;
}
interface GithubInfo {
  repos: number;
  followers: number;
  since?: number;
  lastActive?: string;
  push?: { repo: string; message?: string; ago: string };
}

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// ---- utilities ------------------------------------------------------------
function splitName(name: string) {
  const u = name.toUpperCase();
  if (u.length < 3) return { before: u, mid: "", after: "" };
  const s = Math.min(Math.floor((u.length - 1) / 2), u.length - 2);
  return {
    before: u.slice(0, s),
    mid: u.slice(s, s + 2),
    after: u.slice(s + 2),
  };
}
function seededRand(s: number): number {
  const x = Math.sin(s) * 10000;
  return x - Math.floor(x);
}
function ghEventLabel(type: string): string {
  return (type || "ACTIVITY").replace(/Event$/, "").toUpperCase();
}
function daysAgoLabel(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) {
    const hours = Math.floor((Date.now() - then) / 3_600_000);
    return hours <= 0 ? "just now" : `${hours}h ago`;
  }
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

// Average proficiency of a category (first skill strongest), 0-100.
function categoryProficiency(skills: string[]): number {
  if (skills.length === 0) return 0;
  const total = skills.reduce(
    (sum, _s, i) => sum + Math.max(55, 90 - i * 5),
    0,
  );
  return Math.round(total / skills.length);
}

// Brand/icon + optional brand colour for a social platform.
const SOCIAL_MAP: Record<string, { Icon: IconType; color?: string }> = {
  github: { Icon: SiGithub },
  linkedin: { Icon: FaLinkedin, color: "rgba(0, 119, 181, 0.8)" },
  tryhackme: { Icon: SiTryhackme },
  hackthebox: { Icon: SiHackthebox, color: "rgba(159, 239, 0, 0.8)" },
  twitter: { Icon: SiX },
  x: { Icon: SiX },
};
function socialMeta(platform: string) {
  return SOCIAL_MAP[platform.toLowerCase()] ?? { Icon: FiActivity };
}

// ---- reveal-on-scroll -----------------------------------------------------
function useReveal<T extends HTMLElement>(
  threshold = 0.1,
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
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref as RefObject<T>, visible];
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return mobile;
}

// ---- panel wrapper with 4 corner brackets ---------------------------------
function Panel({
  label,
  icon: LabelIcon,
  id,
  index = 0,
  className,
  children,
  onVisible,
}: {
  label?: string;
  icon?: IconType;
  id?: string;
  index?: number;
  className?: string;
  children: ReactNode;
  onVisible?: () => void;
}) {
  const [ref, visible] = useReveal<HTMLElement>();
  useEffect(() => {
    if (visible) onVisible?.();
  }, [visible, onVisible]);
  const aria = label
    ? label
        .replace(/^\/\/\s*/, "")
        .replace(/\./g, " ")
        .toLowerCase()
    : undefined;
  return (
    <section
      id={id}
      ref={ref}
      role="region"
      aria-label={aria}
      className={`hud-panel ${visible ? "is-visible" : ""} ${className ?? ""}`}
      style={{ "--d": `${index * 60}ms` } as CSSProperties}
    >
      <span className="corner corner-tl" aria-hidden="true" />
      <span className="corner corner-tr" aria-hidden="true" />
      <span className="corner corner-bl" aria-hidden="true" />
      <span className="corner corner-br" aria-hidden="true" />
      {label && (
        <div className="panel-lbl">
          {LabelIcon && <LabelIcon size={11} aria-hidden="true" />}
          <span>{label}</span>
        </div>
      )}
      {children}
    </section>
  );
}

// ---- live UTC clock -------------------------------------------------------
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, "0");
      const mm = String(now.getUTCMinutes()).padStart(2, "0");
      const ss = String(now.getUTCSeconds()).padStart(2, "0");
      const offset = -now.getTimezoneOffset() / 60;
      const sign = offset >= 0 ? "+" : "-";
      setTime(`${hh}:${mm}:${ss} UTC${sign}${Math.abs(offset)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="nav-clock">{time}</span>;
}

// ---- radar chart ----------------------------------------------------------
function Radar({ cats }: { cats: Array<{ name: string; value: number }> }) {
  const N = cats.length;
  const cx = 90;
  const cy = 92;
  const R = 58;
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const ring = (f: number) =>
    cats.map((_, i) => pt(i, R * f).join(",")).join(" ");
  const dataPts = cats
    .map((c, i) => pt(i, R * (c.value / 100)).join(","))
    .join(" ");

  return (
    <svg
      className="radar-svg"
      viewBox="0 0 180 190"
      role="img"
      aria-label="skills radar"
    >
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} className="radar-ring" points={ring(f)} />
      ))}
      {cats.map((_, i) => {
        const [x, y] = pt(i, R);
        return (
          <line key={i} className="radar-axis" x1={cx} y1={cy} x2={x} y2={y} />
        );
      })}
      <polygon className="radar-data" points={dataPts} />
      {cats.map((c, i) => {
        const [x, y] = pt(i, R * (c.value / 100));
        return <circle key={i} className="radar-dot" cx={x} cy={y} r={3.5} />;
      })}
      {cats.map((c, i) => {
        const [x, y] = pt(i, R + 13);
        const anchor =
          Math.abs(x - cx) < 6 ? "middle" : x > cx ? "start" : "end";
        return (
          <text
            key={i}
            className="radar-label"
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
          >
            {c.name.split(" ")[0]}
          </text>
        );
      })}
    </svg>
  );
}

// ---- activity heatmap -----------------------------------------------------
interface Cell {
  intensity: number;
  date: string;
  count: number;
  real: boolean;
}
type ContribMap = Map<string, { count: number; level: number }>;

// Local YYYY-MM-DD so grid dates line up with the API's calendar dates.
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

// Build the 7×weeks grid (ending today). When a real contributions map is
// provided, each cell uses GitHub's actual level/count; otherwise it falls
// back to the deterministic seeded value so the panel never looks empty.
function buildHeatmap(seed: number, weeks: number, map: ContribMap | null) {
  const cells: Cell[] = [];
  const today = new Date();
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const i = w * 7 + d;
      const daysAgo = (weeks - 1 - w) * 7 + (6 - d);
      const date = ymd(new Date(today.getTime() - daysAgo * 86_400_000));
      if (map) {
        const e = map.get(date);
        cells.push({
          intensity: e ? e.level : 0,
          date,
          count: e ? e.count : 0,
          real: true,
        });
      } else {
        const r = seededRand(seed + i + 1);
        const intensity =
          r < 0.45 ? 0 : r < 0.7 ? 1 : r < 0.88 ? 2 : r < 0.96 ? 3 : 4;
        cells.push({ intensity, date, count: 0, real: false });
      }
    }
  }
  const months: string[] = [];
  let prev = -1;
  for (let w = 0; w < weeks; w++) {
    const m = parseInt(cells[w * 7].date.slice(5, 7), 10) - 1;
    if (m !== prev) {
      months.push(MONTHS[m]);
      prev = m;
    } else months.push("");
  }
  return { cells, months };
}
const INTENSITY_LABEL = ["none", "low", "medium", "high", "max"];

function Heatmap({
  seed,
  weeks,
  contrib,
}: {
  seed: number;
  weeks: number;
  contrib: { map: ContribMap; total: number } | null;
}) {
  const { cells, months } = useMemo(
    () => buildHeatmap(seed, weeks, contrib?.map ?? null),
    [seed, weeks, contrib],
  );
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(
    null,
  );
  const hasData = !!contrib && contrib.total > 0;
  const cellTitle = (c: Cell) =>
    c.real
      ? `${c.date}: ${c.count} contribution${c.count !== 1 ? "s" : ""}`
      : `${c.date} · ${INTENSITY_LABEL[c.intensity]}`;
  return (
    <div className="heatmap-wrap">
      <div
        className="heatmap-months"
        style={{ gridTemplateColumns: `repeat(${weeks}, var(--cell))` }}
      >
        {months.map((m, i) => (
          <span className="heatmap-month" key={i}>
            {m}
          </span>
        ))}
      </div>
      <div className="heatmap-grid" onMouseLeave={() => setTip(null)}>
        {cells.map((c, i) => (
          <span
            key={i}
            className={`heat-cell heat-${c.intensity}`}
            title={cellTitle(c)}
            onMouseEnter={(e) =>
              setTip({ text: cellTitle(c), x: e.clientX, y: e.clientY })
            }
          />
        ))}
      </div>
      <div className="heatmap-legend">
        <span className="legend-text">LESS</span>
        {[0, 1, 2, 3, 4].map((n) => (
          <span key={n} className={`legend-cell heat-${n}`} />
        ))}
        <span className="legend-text">MORE</span>
      </div>
      <div className="heatmap-total">
        {hasData
          ? `${contrib!.total} days of contributions in the last 6 months`
          : "— contributions data unavailable"}
      </div>
      {tip &&
        createPortal(
          <div
            className="heat-tip"
            style={{ left: tip.x + 12, top: tip.y + 12 }}
          >
            {tip.text}
          </div>,
          document.body,
        )}
    </div>
  );
}

// ---- command palette ------------------------------------------------------
interface PaletteItem {
  cat: "COMMAND" | "SECTION" | "PROJECT" | "SOCIAL";
  name: string;
  action: () => void;
}
function CommandPalette({
  items,
  onClose,
}: {
  items: PaletteItem[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [hi, setHi] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      `${it.cat} ${it.name}`.toLowerCase().includes(q),
    );
  }, [query, items]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setHi(0);
  }, [query]);
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[hi];
      if (item) {
        item.action();
        onClose();
      }
    }
  }
  return createPortal(
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div
        className="palette-box"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="palette-input-row">
          <span className="palette-prompt">❯</span>
          <input
            ref={inputRef}
            className="palette-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search or jump to..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
        <div className="palette-divider" />
        <div className="palette-results">
          {filtered.length === 0 && (
            <div className="palette-empty">no matches</div>
          )}
          {filtered.map((it, i) => (
            <div
              key={`${it.cat}-${it.name}`}
              className={`palette-item ${i === hi ? "is-hi" : ""}`}
              onMouseEnter={() => setHi(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                it.action();
                onClose();
              }}
            >
              <span className={`palette-cat cat-${it.cat.toLowerCase()}`}>
                {it.cat}
              </span>
              <span className="palette-name">{it.name}</span>
            </div>
          ))}
        </div>
        <div className="palette-footer">↑↓ navigate · ↵ select · ESC close</div>
      </div>
    </div>,
    document.body,
  );
}

const SECTIONS: Array<[string, string]> = [
  ["ABOUT", "about"],
  ["SKILLS", "skills"],
  ["PROJECTS", "projects"],
  ["INTEL", "intel"],
  ["CONTACT", "contact"],
];

// ===========================================================================
export default function HUD() {
  const navigate = useNavigate();
  const { data } = usePortfolio();
  const isMobile = useIsMobile();

  const [github, setGithub] = useState<GithubInfo | null>(null);
  const [contrib, setContrib] = useState<{
    map: ContribMap;
    total: number;
  } | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [highlightProject, setHighlightProject] = useState("");
  const [activeId, setActiveId] = useState("about");
  const [progress, setProgress] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const lastKeyRef = useRef<{ key: string; t: number }>({ key: "", t: 0 });

  const [ghRef, ghVisible] = useReveal<HTMLDivElement>(0);
  const [ghArmed, setGhArmed] = useState(false);
  useEffect(() => {
    if (ghVisible) setGhArmed(true);
  }, [ghVisible]);

  // ---- derived model ------------------------------------------------------
  const model = useMemo(() => {
    if (!data) return null;
    const c = data.commands;
    const info: Record<string, string> = {};
    const prose: string[] = [];
    for (const line of (c.whoami?.lines as string[] | undefined) ?? []) {
      const m = line.match(/^([A-Za-z ]+?)\s*:\s*(.+)$/);
      if (m) info[m[1].trim().toLowerCase()] = m[2].trim();
      else if (line.trim() !== "") prose.push(line);
    }
    const categories =
      (c.skills?.categories as Record<string, string[]> | undefined) ?? {};
    return {
      info,
      prose,
      categories,
      radar: Object.entries(categories).map(([name, skills]) => ({
        name,
        value: categoryProficiency(skills),
      })),
      projects: (c.projects?.items as Project[] | undefined) ?? [],
      certs: (c.certifications?.items as Cert[] | undefined) ?? [],
      writeups: (c.writeups?.items as Writeup[] | undefined) ?? [],
      socials: (c.socials?.items as Social[] | undefined) ?? [],
      email: (c.email?.address as string | undefined) ?? "",
      now: (data.now as Record<string, string> | undefined) ?? {},
      uses: (data.uses as Record<string, string> | undefined) ?? {},
    };
  }, [data]);

  // GitHub handle, derived once from socials and shared by both the live-stats
  // panel and the contribution heatmap.
  const githubUsername = useMemo(() => {
    const item = (data?.commands.socials?.items as Social[] | undefined)?.find(
      (s) => s.platform.toLowerCase() === "github",
    );
    return item?.link?.split("github.com/")[1]?.replace(/\/+$/, "") || null;
  }, [data]);

  // ---- Real GitHub contribution heatmap (no auth; jogruber.de). On any
  // failure we leave `contrib` null and the heatmap falls back to seeded data.
  useEffect(() => {
    if (!githubUsername) return;
    let cancelled = false;
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then(
        (json: {
          contributions?: Array<{ date: string; count: number; level: number }>;
        }) => {
          if (cancelled) return;
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 26 * 7);
          const map: ContribMap = new Map();
          let total = 0;
          for (const d of json.contributions ?? []) {
            if (new Date(d.date) >= cutoff) {
              map.set(d.date, { count: d.count, level: d.level });
              if (d.count > 0) total++;
            }
          }
          setContrib({ map, total });
        },
      )
      .catch(() => {
        if (!cancelled) setContrib(null);
      });
    return () => {
      cancelled = true;
    };
  }, [githubUsername]);

  // ---- GitHub live stats (lazy, silent failure) --------------------------
  useEffect(() => {
    if (!ghArmed || !githubUsername) return;
    const username = githubUsername;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) return;
        const u = await res.json();
        let lastActive: string | undefined;
        let push: GithubInfo["push"] | undefined;
        try {
          const evRes = await fetch(
            `https://api.github.com/users/${username}/events/public`,
          );
          if (evRes.ok) {
            const events = await evRes.json();
            const ev = Array.isArray(events) ? events[0] : null;
            if (ev?.created_at) lastActive = daysAgoLabel(ev.created_at);
            if (ev?.repo?.name) {
              push = {
                repo: ev.repo.name,
                message:
                  ev.payload?.commits?.[0]?.message?.slice(0, 50) ||
                  ghEventLabel(ev.type),
                ago: ev.created_at ? daysAgoLabel(ev.created_at) : "",
              };
            }
          }
        } catch {
          /* optional */
        }
        if (cancelled) return;
        setGithub({
          repos: u.public_repos ?? 0,
          followers: u.followers ?? 0,
          since: u.created_at
            ? new Date(u.created_at).getFullYear()
            : undefined,
          lastActive,
          push,
        });
      } catch {
        /* silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [data, ghArmed]);

  // ---- scroll: progress bar + active section -----------------------------
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !model) return;
    const onScroll = () => {
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? root.scrollTop / max : 0);
    };
    onScroll();
    root.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { root, threshold: [0.25, 0.5], rootMargin: "-20% 0px -50% 0px" },
    );
    SECTIONS.forEach(([, id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      root.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [model]);

  // ---- palette items ------------------------------------------------------
  const scrollTo = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  const paletteItems = useMemo<PaletteItem[]>(() => {
    if (!data || !model) return [];
    const items: PaletteItem[] = [];
    for (const [name, def] of Object.entries(data.commands)) {
      if (def.hidden) continue;
      items.push({
        cat: "COMMAND",
        name,
        action: () => setToast(`Open terminal to run '${name}'`),
      });
    }
    for (const [label, id] of SECTIONS) {
      items.push({ cat: "SECTION", name: label, action: () => scrollTo(id) });
    }
    for (const p of model.projects) {
      items.push({
        cat: "PROJECT",
        name: p.name,
        action: () => {
          scrollTo("projects");
          setHighlightProject(p.name);
          window.setTimeout(() => setHighlightProject(""), 2000);
        },
      });
    }
    for (const s of model.socials) {
      items.push({
        cat: "SOCIAL",
        name: `${s.platform} ${s.handle}`,
        action: () => window.open(s.link, "_blank", "noopener,noreferrer"),
      });
    }
    return items;
  }, [data, model]);

  // ---- global keyboard shortcuts -----------------------------------------
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (paletteOpen) return;
      const target = e.target as HTMLElement;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      const map: Record<string, string> = {
        "1": "about",
        "2": "skills",
        "3": "projects",
        "4": "intel",
        "5": "contact",
      };
      if (map[k]) {
        scrollTo(map[k]);
        return;
      }
      const now = Date.now();
      if (
        k === "h" &&
        lastKeyRef.current.key === "g" &&
        now - lastKeyRef.current.t < 600
      ) {
        navigate("/");
      }
      lastKeyRef.current = { key: k, t: now };
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, navigate]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  // ---- nav (shared between loading + loaded) -----------------------------
  const nav = (
    <nav className="hud-nav">
      <div className="nav-logo">
        // HUD.{(data?.meta.user ?? "ghost").toUpperCase()}.
        {(data?.meta.host ?? "parrot").toUpperCase()}
      </div>
      <div className="nav-links">
        {SECTIONS.map(([label, id]) => (
          <button
            key={id}
            className={`nav-link ${activeId === id ? "is-active" : ""}`}
            onClick={() => scrollTo(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <LiveClock />
        <span className="nav-sep" />
        <span className="nav-status">
          <FiWifi size={11} aria-hidden="true" />
          <span>ONLINE</span>
        </span>
      </div>
      <div className="nav-progress" style={{ width: `${progress * 100}%` }} />
    </nav>
  );

  // ---- loading: nav + empty labelled panels ------------------------------
  if (!data || !model) {
    return (
      <div className="hud-root" ref={rootRef}>
        <HudBackground />
        {nav}
        <main className="hud-main">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="hud-panel is-visible loading-panel" key={i}>
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />
              <div className="panel-lbl">// LOADING...</div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  const { meta } = data;
  const name = splitName(meta.user);
  const role = model.info.role ?? "Security Researcher";
  const status = model.info.status ?? "";
  const statusOpen = /open/i.test(status);
  const bio = model.prose.slice(0, 2).join(" ");

  const stats = [
    {
      value: model.projects.length,
      label: "PROJECTS",
      tone: "cyan",
      Icon: FiLayers,
    },
    { value: model.certs.length, label: "CERTS", tone: "green", Icon: FiAward },
    {
      value: model.writeups.length,
      label: "WRITEUPS",
      tone: "amber",
      Icon: FiTarget,
    },
    {
      value: Object.keys(model.categories).length,
      label: "SKILL AREAS",
      tone: "muted",
      Icon: FiCpu,
    },
  ];

  const sysRows: Array<{
    Icon?: IconType;
    key: string;
    value: string;
    dot?: boolean;
  }> = [
    { Icon: FiUser, key: "USER", value: meta.user },
    { Icon: FiMonitor, key: "HOST", value: meta.host },
    { key: "ROLE", value: role },
    { key: "STATUS", value: status, dot: statusOpen },
    { Icon: FiMonitor, key: "OS", value: model.uses.os ?? "" },
    { Icon: FiCode, key: "EDITOR", value: model.uses.editor ?? "" },
    { Icon: FiTerminal, key: "SHELL", value: model.uses.shell ?? "" },
  ];

  const heatSeed = meta.user.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const nowRows: Array<[IconType, string, string | undefined]> = [
    [FiZap, "LEARNING", model.now.learning],
    [FiTool, "BUILDING", model.now.building],
    [FiBook, "READING", model.now.reading],
    [FiTarget, "PLAYING", model.now.playing],
  ];

  const feed = [
    "[ghost@parrot]$ ./recon --self",
    `  user ......... ${meta.user}`,
    `  role ......... ${role}`,
    `  projects ..... ${model.projects.length} active`,
    `  certs ........ ${model.certs.length} earned`,
    `  writeups ..... ${model.writeups.length} published`,
    `  status ....... ${status || "online"}`,
    "[ghost@parrot]$ _",
  ];

  const commsBox = [
    "┌─────────────────────────────┐",
    `│  PING ${model.email}`,
    "│  > Connecting...",
    "│  > Encryption: PGP",
    "│  > Latency: 0.31ms",
    "│  > Status: AWAITING INPUT",
    "└─────────────────────────────┘",
  ].join("\n");

  return (
    <div className="hud-root" ref={rootRef}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <HudBackground />
      {nav}

      <main className="hud-main" id="main">
        {/* ROW 1: IDENTITY (split) + SYS.INFO */}
        <div className="bento bento-2-1">
          <Panel
            label="// IDENTITY.DAT"
            icon={FiUser}
            id="about"
            index={0}
            className="identity"
          >
            <div className="identity-split">
              <div className="identity-left">
                <div className="hero-eyebrow">// SECURITY RESEARCHER \\</div>
                <h1 className="hero-name">
                  {name.before}
                  <span className="hero-mid">{name.mid}</span>
                  {name.after}
                </h1>
                <div className="hero-role">
                  {role.split(/\s*[·,&]\s*/).map((seg, i) => (
                    <span key={seg} className="role-seg">
                      {i > 0 && <span className="role-dot">·</span>}
                      {seg}
                    </span>
                  ))}
                </div>
                {bio && <p className="hero-bio">{bio}</p>}
                <div className="hero-stats">
                  {stats.map((s) => (
                    <div className="stat-block" key={s.label}>
                      <s.Icon
                        className={`stat-icon tone-${s.tone}`}
                        size={12}
                        aria-hidden="true"
                      />
                      <div className={`stat-value tone-${s.tone}`}>
                        {s.value}
                      </div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel label="// SYS.INFO" icon={FiMonitor} index={1}>
            <div className="sysinfo">
              {sysRows.map((r) => (
                <div className="sys-row" key={r.key}>
                  <span className="sys-key">
                    {r.Icon && (
                      <r.Icon
                        className="sys-icon"
                        size={12}
                        aria-hidden="true"
                      />
                    )}
                    {r.key}
                  </span>
                  <span className="sys-val">
                    {r.dot && <span className="status-dot inline" />}
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ROW 2: SKILLS RADAR + PROJECTS + NOW */}
        <div className="bento bento-1-16-1">
          <Panel
            label="// SKILLS.RADAR"
            icon={FiActivity}
            id="skills"
            index={2}
          >
            <Radar cats={model.radar} />
            <div className="radar-legend">
              {model.radar.map((c) => (
                <div className="rl-row" key={c.name}>
                  <span className="rl-name">{c.name}</span>
                  <span className="rl-dots" />
                  <span className="rl-pct">{c.value}%</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            label="// PROJECTS.LOG"
            icon={FiLayers}
            id="projects"
            index={3}
          >
            <div className="projects">
              {model.projects.map((p, i) => (
                <article
                  className={`adv-card ${highlightProject === p.name ? "is-hl" : ""}`}
                  key={p.name}
                >
                  <div className="adv-top">
                    <span className="adv-id">
                      ADV-{String(i + 1).padStart(3, "0")}
                    </span>
                    <span className="adv-status">ACTIVE</span>
                  </div>
                  <div className="adv-name-row">
                    <span className="adv-name">{p.name}</span>
                    {p.link && (
                      <a
                        className="adv-link"
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on GitHub"
                        aria-label={`View ${p.name} on GitHub`}
                      >
                        <FiExternalLink size={13} />
                      </a>
                    )}
                  </div>
                  <p className="adv-desc">{p.desc}</p>
                  <div className="adv-tags">
                    {p.tags?.map((t) => (
                      <span className="pill" key={t}>
                        {t}
                      </span>
                    ))}
                    {typeof p.stars === "number" && (
                      <span className="pill pill-star">
                        <FiStar size={10} aria-hidden="true" /> {p.stars}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel label="// NOW.TXT" icon={FiClock} index={4}>
            <div className="now-list">
              {nowRows.map(([Icon, k, v]) =>
                v ? (
                  <div className="now-row" key={k}>
                    <Icon className="now-icon" size={11} aria-hidden="true" />
                    <div className="now-body">
                      <div className="now-key">{k}</div>
                      <div className="now-val">{v}</div>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </Panel>
        </div>

        {/* ROW 3: HEATMAP */}
        <div className="bento-full">
          <Panel label="// ACTIVITY.HEATMAP" icon={FiZap} index={5}>
            <Heatmap
              seed={heatSeed}
              weeks={isMobile ? 16 : 26}
              contrib={contrib}
            />
          </Panel>
        </div>

        {/* ROW 4: INTEL + (GITHUB stacked CERTS) */}
        <div className="bento bento-14-1">
          <Panel label="// INTEL.FEED" icon={FiShield} id="intel" index={6}>
            <div className="intel-list">
              {model.writeups.map((w, i) => {
                const sev =
                  w.severity ?? (i === 0 ? "HIGH" : i === 1 ? "MED" : "LOW");
                const tone =
                  sev === "HIGH" ? "red" : sev === "MED" ? "amber" : "green";
                const SevIcon =
                  sev === "HIGH"
                    ? FiAlertTriangle
                    : sev === "MED"
                      ? FiShield
                      : FiCheckCircle;
                return (
                  <div className={`intel-item intel-${tone}`} key={w.name}>
                    <span className="intel-bar" />
                    <div className="intel-body">
                      <div className="intel-head">
                        <SevIcon
                          className={`intel-sev tone-${tone}`}
                          size={12}
                          aria-hidden="true"
                        />
                        <span className="intel-title">{w.name}</span>
                      </div>
                      {w.desc && <p className="intel-desc">{w.desc}</p>}
                      <div className="intel-meta">
                        {[w.platform, w.date].filter(Boolean).join(" · ")}
                        {w.link && (
                          <>
                            {" · "}
                            <a
                              className="intel-read"
                              href={w.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Read ${w.name}`}
                            >
                              <FiExternalLink size={11} />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <div className="bento-stack" ref={ghRef}>
            {github && (
              <Panel label="// GITHUB.LIVE" icon={SiGithub} index={7}>
                <div className="gh-stats">
                  <GhStat
                    Icon={FiLayers}
                    value={github.repos}
                    label="REPOS"
                    tone="cyan"
                  />
                  <GhStat
                    Icon={FiUsers}
                    value={github.followers}
                    label="FOLLOWERS"
                    tone="green"
                  />
                  {github.since !== undefined && (
                    <GhStat
                      Icon={FiClock}
                      value={github.since}
                      label="MEMBER SINCE"
                      tone="amber"
                    />
                  )}
                  {github.lastActive && (
                    <GhStat
                      Icon={FiActivity}
                      value={github.lastActive}
                      label="LAST ACTIVE"
                      tone="muted"
                    />
                  )}
                </div>
                {github.push && (
                  <div className="gh-push">
                    <div className="gh-push-head">
                      <FiGitCommit size={12} aria-hidden="true" /> LAST PUSH
                    </div>
                    <div className="gh-push-repo">{github.push.repo}</div>
                    <div className="gh-push-msg">"{github.push.message}"</div>
                    <div className="gh-push-ago">{github.push.ago}</div>
                  </div>
                )}
              </Panel>
            )}

            <Panel label="// CERTS.DB" icon={FiAward} index={8}>
              <div className="cert-timeline">
                {model.certs.map((cert) => {
                  const inProg = cert.status === "in-progress";
                  const CertIcon = inProg ? FiClock : FiAward;
                  return (
                    <div className="cert-node" key={cert.name}>
                      <span
                        className={`cert-dot ${cert.status === "active" ? "dot-active" : inProg ? "dot-progress" : ""}`}
                      />
                      <div className="cert-body">
                        <div className="cert-year">{cert.year}</div>
                        <div className="cert-name">
                          <CertIcon
                            className={inProg ? "tone-amber" : "tone-cyan"}
                            size={12}
                            aria-hidden="true"
                          />
                          {cert.name}
                        </div>
                        <div className="cert-issuer">
                          {cert.issuer}
                          {inProg && (
                            <span className="cert-prog"> — IN PROGRESS</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        </div>

        {/* ROW 5: SECURE.COMMS */}
        <div className="bento-full">
          <Panel label="// SECURE.COMMS" icon={FiMail} id="contact" index={9}>
            <div className="comms-grid">
              <div className="comms-left">
                {model.socials.map((s) => {
                  const { Icon, color } = socialMeta(s.platform);
                  return (
                    <div className="comms-row" key={s.platform}>
                      <Icon
                        className="comms-icon"
                        size={14}
                        style={color ? { color } : undefined}
                        aria-hidden="true"
                      />
                      <span className="comms-platform">{s.platform}</span>
                      <span className="comms-spacer" />
                      <a
                        className="comms-handle"
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.handle}
                      </a>
                    </div>
                  );
                })}
                <div className="comms-row">
                  <FiMail className="comms-icon" size={14} aria-hidden="true" />
                  <span className="comms-platform">Email</span>
                  <span className="comms-spacer" />
                  <a className="comms-handle" href={`mailto:${model.email}`}>
                    {model.email}
                  </a>
                </div>
              </div>
              <div className="comms-right">
                <pre className="comms-ascii">{commsBox}</pre>
              </div>
            </div>
          </Panel>
        </div>
      </main>

      <button className="return-btn" onClick={() => navigate("/")}>
        <FiTerminal size={13} aria-hidden="true" /> RETURN TO TERMINAL
      </button>

      <div className="kbd-hint">⌘K PALETTE · 1-5 JUMP · GH TERMINAL</div>

      {toast && <div className="hud-toast">{toast}</div>}
      {paletteOpen && (
        <CommandPalette
          items={paletteItems}
          onClose={() => setPaletteOpen(false)}
        />
      )}
    </div>
  );
}

function GhStat({
  Icon,
  value,
  label,
  tone,
}: {
  Icon: IconType;
  value: number | string;
  label: string;
  tone: string;
}) {
  return (
    <div className="gh-stat">
      <Icon className={`gh-icon tone-${tone}`} size={12} aria-hidden="true" />
      <div className={`gh-value tone-${tone}`}>{value}</div>
      <div className="gh-label">{label}</div>
    </div>
  );
}

function HudBackground() {
  return (
    <div className="hud-bg-layers" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-scanlines" />
    </div>
  );
}
