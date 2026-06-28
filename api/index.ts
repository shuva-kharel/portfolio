// ---------------------------------------------------------------------------
// Vercel Edge Function: serves a plain-text ASCII portfolio to CLI clients
// (curl / wget / HTTPie) hitting the root URL. Browsers are routed to the
// React app by the rewrite in vercel.json and never reach this handler.
//
// All personal data is imported directly from portfolio.json (no runtime
// fetch). Output is plain text only — zero ANSI colour codes — so it renders
// the same in every terminal.
// ---------------------------------------------------------------------------
import portfolio from "../public/portfolio.json";

export const config = { runtime: "edge" };

// portfolio.json isn't part of the app's tsconfig, so treat it loosely here.
const P = portfolio as any;

const WIDTH = 58;
const SITE = "https://ghost.dev";

function center(text: string): string {
  const pad = Math.max(0, WIDTH - text.length);
  const left = Math.floor(pad / 2);
  return " ".repeat(left) + text + " ".repeat(pad - left);
}

function rule(): string {
  return "─".repeat(WIDTH);
}

function parseWhoami(): Record<string, string> {
  const info: Record<string, string> = {};
  const lines: string[] = P.commands?.whoami?.lines ?? [];
  for (const line of lines) {
    const m = line.match(/^([A-Za-z ]+?)\s*:\s*(.+)$/);
    if (m) info[m[1].trim().toLowerCase()] = m[2].trim();
  }
  return info;
}

function buildText(): string {
  const user: string = (P.meta?.user ?? "ghost").toUpperCase();
  const info = parseWhoami();
  const role = (info.role ?? "Security Researcher").toUpperCase();
  const tagline: string = P.commands?.welcome?.tagline ?? "";
  const focus = (info.focus ?? "").replace(/\s*,\s*/g, " · ");
  const status = info.status ?? "";

  const out: string[] = [];

  // Header box
  out.push("╔" + "═".repeat(WIDTH) + "╗");
  out.push("║" + center(`${user} // ${role}`) + "║");
  out.push("╚" + "═".repeat(WIDTH) + "╝");
  out.push("");

  if (tagline) out.push(`  whoami   ${tagline}`);
  if (focus) out.push(`  focus    ${focus}`);
  if (status) out.push(`  status   ${status}`);
  out.push("");
  out.push(rule());
  out.push("");

  // Projects
  const projects: Array<{ name: string; desc: string }> =
    P.commands?.projects?.items ?? [];
  if (projects.length) {
    out.push("  PROJECTS");
    out.push("  ─────────");
    const nameW = projects.reduce((m, p) => Math.max(m, p.name.length), 0);
    projects.forEach((p, i) => {
      const desc = p.desc.split(".")[0];
      out.push(`  [${i + 1}] ${p.name.padEnd(nameW + 2)}${desc}`);
    });
    out.push("");
    out.push(rule());
    out.push("");
  }

  // Skills
  const categories: Record<string, string[]> =
    P.commands?.skills?.categories ?? {};
  const catNames = Object.keys(categories);
  if (catNames.length) {
    out.push("  SKILLS");
    out.push("  ───────");
    const labelW = catNames.reduce((m, c) => Math.max(m, c.length), 0);
    for (const cat of catNames) {
      out.push(`  ${cat.padEnd(labelW + 3)}${categories[cat].join(" · ")}`);
    }
    out.push("");
    out.push(rule());
    out.push("");
  }

  // Contact
  const socials: Array<{ platform: string; handle?: string; link?: string }> =
    P.commands?.socials?.items ?? [];
  const email: string = P.commands?.email?.address ?? "";
  out.push("  CONTACT");
  out.push("  ────────");
  if (email) out.push(`  Email     ${email}`);
  for (const s of socials) {
    const value = (s.link ?? s.handle ?? "").replace(/^https?:\/\//, "");
    if (value) out.push(`  ${s.platform.padEnd(10)}${value}`);
  }
  out.push("");
  out.push(rule());
  out.push("");

  // Footer
  out.push("  Impressive. Most people just open a browser.");
  out.push(`  For the full experience: ${SITE}`);
  out.push(`  For the terminal experience: ssh ${P.meta?.user ?? "ghost"}@ghost.dev`);
  out.push("");

  return out.join("\n");
}

export default function handler(request: Request): Response {
  const ua = request.headers.get("user-agent") || "";
  const isCli = /curl|wget|httpie/i.test(ua);

  // Defensive fallback: if a browser somehow lands here, bounce to the app.
  if (!isCli) {
    return new Response(null, { status: 302, headers: { location: "/" } });
  }

  return new Response(buildText(), {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
