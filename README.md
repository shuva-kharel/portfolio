# ghost@parrot — Terminal Portfolio

A terminal-based cybersecurity portfolio with a second visual "HUD" view.
All content is managed through a single JSON file.

- `/` — the interactive terminal (fully usable on desktop **and** mobile)
- `/hud` — a bento-grid SOC dashboard rendered from the same data
- Type `gui` in the terminal to jump to the HUD; `← RETURN TO TERMINAL` (or
  `g` then `h`) to come back.

## Quick Start

```bash
npm install
npm run dev
```

## Updating Content

Edit `public/portfolio.json` — everything on the site comes from this file.
No code changes needed.

## Adding a New Command

Add a key to the `commands` object in portfolio.json:

```json
{
  "mycommand": {
    "description": "shown in help",
    "output_type": "text",
    "lines": ["line 1", "line 2"]
  }
}
```

That's it. The command is live immediately and appears in `help`.

## Adding an Easter Egg

Same as above but in `easter_eggs` instead of `commands`. Easter eggs don't
appear in `help` output. They're matched on the exact typed string, so
multi-word eggs like `cat /etc/passwd` work.

## Changing Themes

Edit `meta.theme` in portfolio.json, or run `themes set <name>` live.
Available: amber · green · blue · red

## Extra Commands & Surfaces

- `now`, `pgp`, `uses` — read the matching top-level objects in portfolio.json
- `resume` — assembles a terminal resume from the `resume` object and links to
  `public/resume.pdf`
- `sound on` / `sound off` — toggle synthesised key-click sounds (off by default)
- `motd` — daily quote, auto-printed after the welcome banner
- `hall-of-fame` — CTF solvers (stored in localStorage)
- There is a hidden 5-layer CTF. Start at `/robots.txt`.

## HUD Notes

- The `// GITHUB.LIVE` panel fetches `api.github.com` for the handle in your
  socials. It loads lazily on scroll and is hidden silently if the API fails.
- Command palette: `⌘K` / `Ctrl+K`. Jump to sections with `1`–`5`.

## Deploy to Vercel

Push to GitHub → Import in Vercel → Deploy. No environment variables needed.

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` ships the SPA rewrite (so `/hud` doesn't 404 on refresh),
security headers, a CSP, and cache headers. Enable **Analytics** in the Vercel
project settings after the first deploy (it's off by default).

Once deployed, `curl <your-domain>` returns a plain-text version of the
portfolio (handled by the `api/index.ts` Edge Function); browsers get the app.

## Deployment Checklist

Before the first `git push`:

- [ ] `public/portfolio.json` — all placeholder data replaced
- [ ] `public/resume.pdf` — actual resume uploaded
- [ ] `public/og.png` — generated from `scripts/generate-og.html` (screenshot at 1200×630)
- [x] `public/icon-192.png` + `public/icon-512.png` + `public/apple-touch-icon.png` —
      generated from `public/favicon.svg` via `npm run icons` (re-run if you change the favicon)
- [ ] `index.html` — replace `ghost.dev` with the real domain in the meta tags
- [ ] `npm run build` — completes without errors
- [ ] `npm run preview` — confirm `/hud` doesn't 404 on refresh

After the first Vercel deploy:

- [ ] Enable Analytics: Vercel dashboard → project → Analytics
- [ ] Preview the social card at https://www.opengraph.xyz
- [ ] Check headers at https://securityheaders.com
- [ ] Verify `/hud` works when typed directly (not just linked)
- [ ] Test on a real mobile device
