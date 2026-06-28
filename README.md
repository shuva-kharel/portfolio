# Terminal Portfolio

A terminal-style cybersecurity portfolio built with **React + Vite + TypeScript**
and plain CSS. The entire site — every command, project, write-up, theme, and
even the boot animation — is driven by a single file: **`public/portfolio.json`**.

> Want to change something? Edit the JSON. No code changes, no rebuild of the
> engine. The terminal re-reads `portfolio.json` on every page load.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Deploy `dist/` to **Vercel**, **Netlify**, GitHub Pages, or any static host.
On Vercel/Netlify the defaults just work: build command `npm run build`,
output directory `dist`.

---

## How it works

```
public/portfolio.json   ← the single source of truth for ALL content
src/
  core/
    CommandEngine.ts     reads the JSON, maps a typed command → output
    FileSystem.ts        virtual filesystem (pwd, ls, cd, cat)
    HistoryManager.ts    up/down arrow command history
  components/
    Terminal.tsx         the shell: input, scrollback, effects, boot
    InputLine.tsx        prompt + hidden input + blinking cursor
    OutputBlock.tsx      one command + its rendered output
    BootSequence.tsx     startup animation (first visit only)
    MobileReplay.tsx     read-only auto-demo for phones
  renderers/             one renderer per output_type
  hooks/usePortfolio.ts  fetches & caches portfolio.json once
```

When you type a command, `CommandEngine` looks it up in `portfolio.json` and
returns a result tagged with an `output_type`. The matching renderer in
`src/renderers/` draws it. That's the whole loop.

---

## Editing `portfolio.json`

### Change who you are

Edit `meta` and the `whoami` command:

```jsonc
"meta": {
  "user": "ghost",          // shows in the prompt: [ghost@parrot]
  "host": "parrot",
  "prompt_symbol": "$",
  "theme": "amber"          // default theme on first load
}
```

### Add a new command

Add an entry under `commands`. The `output_type` decides how it renders:

```jsonc
"commands": {
  "blog": {
    "description": "read my latest posts",   // shown in `help`
    "output_type": "list",
    "items": [
      { "name": "Why I love nmap", "desc": "A love letter", "link": "https://..." }
    ]
  }
}
```

It appears in `help` automatically and is tab-completable. **Zero code.**

#### Available `output_type` values

| output_type | What it renders                                            |
|-------------|------------------------------------------------------------|
| `welcome`   | ASCII-art hero + tagline + hint                            |
| `text`      | a list of `lines[]`, printed verbatim                      |
| `table`     | `categories` map → bordered category/skill table           |
| `projects`  | project blocks with tags, stars, and a link                |
| `list`      | numbered list of `{ name, desc, link }`                    |
| `timeline`  | `items[]` with `year / title / institution / details`      |
| `certs`     | `items[]` with a coloured `status` badge                   |
| `socials`   | platform / handle / link rows                              |
| `email`     | prints an address and opens the mail client                |
| `themes`    | lists themes with colour swatches                          |
| `scan`      | types `lines[]` out one by one (nmap-style)                |
| `sudo`      | like `scan`, pauses on the password line, then `redirect_command` |
| `alias`     | silently re-runs another command (`"target": "whoami"`)    |
| `builtin`   | handled in code: `pwd ls cd cat echo history clear help`   |

### Add a project

Append to the `projects` command's `items` array:

```jsonc
{
  "name": "my-tool",
  "desc": "What it does.",
  "tags": ["python", "security"],
  "link": "https://github.com/you/my-tool",
  "stars": 0
}
```

### Add a hidden easter egg

Anything under `easter_eggs` works as a command but never appears in `help`.
Match is on the full typed string (case-insensitive, whitespace-collapsed):

```jsonc
"easter_eggs": {
  "matrix": {
    "hidden": true,
    "output_type": "text",
    "lines": ["Wake up, Neo..."]
  }
}
```

### Add or edit a theme

Add a palette under `themes`. Every key maps to a CSS variable applied live:

```jsonc
"themes": {
  "purple": {
    "background": "#0d0a14",
    "prompt_user": "#b388ff",
    "prompt_host": "#80d8ff",
    "prompt_path": "#6a6a8a",
    "output_text": "#d0c8e0",
    "output_dim": "#5a4a6a",
    "accent": "#b388ff",
    "error": "#ff6b6b",
    "link": "#80d8ff",
    "success": "#69f0ae",
    "table_border": "#2a1a3a",
    "cursor": "#b388ff"
  }
}
```

Switch at runtime with `themes set purple`. The choice is saved to
`localStorage` and restored on the next visit.

### The virtual filesystem

`ls`, `cd`, and `cat` read from `filesystem`:

- **Directories** are keyed by absolute path (`"/projects"`) with a `children`
  array. Directory names end in `/`.
- **File contents** live under `filesystem.files`, keyed by the full path
  (`"/writeups/htb-lame.md"`) or a bare name for root files (`"skills.txt"`).
- Use `\n` inside a string for line breaks.

### The boot sequence

`boot_sequence` is an array of `{ text, delay }`. Lines print on their own
delays on the **first** visit only (tracked in `localStorage`). Visitors can
press any key to skip.

---

## Built-in commands & shortcuts

| Command / key      | Action                                              |
|--------------------|-----------------------------------------------------|
| `help`             | list all visible commands                           |
| `pwd / ls / cd / cat` | navigate the virtual filesystem                  |
| `ls -la`           | long listing with (fake) permissions and sizes      |
| `echo`, `history`  | as in a real shell                                  |
| `clear` / `Ctrl+L` | clear the screen                                    |
| `themes`           | list themes; `themes set <name>` to switch          |
| `↑ / ↓`            | cycle command history                               |
| `Tab`              | autocomplete commands and filesystem paths          |
| `Ctrl+C`           | cancel the current input line                       |

Plus a handful of hidden easter eggs — go find them.

---

## Notes

- **No CSS frameworks, no UI libraries.** All colour flows through CSS variables
  set from the active theme, so theming is instant and reload-free.
- On screens under 768px the site switches to a read-only auto-playing demo.
- `portfolio.json` is fetched once and cached for the session.
