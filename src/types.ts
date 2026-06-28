// ---------------------------------------------------------------------------
// Shared types for the JSON-driven terminal portfolio.
// Everything the app renders is described by portfolio.json and typed here.
// ---------------------------------------------------------------------------

export interface Meta {
  user: string;
  host: string;
  prompt_symbol: string;
  version: string;
  title: string;
  theme: string;
}

export interface Theme {
  background: string;
  prompt_user: string;
  prompt_host: string;
  prompt_path: string;
  output_text: string;
  output_dim: string;
  accent: string;
  error: string;
  link: string;
  success: string;
  table_border: string;
  cursor: string;
}

export interface BootLine {
  text: string;
  delay: number;
}

export interface FsDir {
  type: "dir";
  children: string[];
}

export interface FileSystemData {
  // Directory nodes are keyed by absolute path (e.g. "/projects").
  // The special "files" key maps file paths (or bare names) to their contents.
  [key: string]: FsDir | Record<string, string>;
}

// A command's shape is open-ended because each output_type reads different
// fields. We keep a permissive index signature but capture the common ones.
export interface CommandDef {
  description?: string;
  output_type: string;
  hidden?: boolean;
  target?: string; // for alias
  redirect_command?: string; // for sudo
  [key: string]: unknown;
}

export interface Portfolio {
  meta: Meta;
  themes: Record<string, Theme>;
  boot_sequence: BootLine[];
  filesystem: FileSystemData;
  commands: Record<string, CommandDef>;
  easter_eggs: Record<string, CommandDef>;
  // Optional free-form content blocks surfaced by the now/pgp/uses commands.
  now?: Record<string, string>;
  pgp?: Record<string, string>;
  uses?: Record<string, string>;
  resume?: {
    download_url?: string;
    sections?: Record<string, unknown>;
  };
}

// ---------------------------------------------------------------------------
// Engine result types
// ---------------------------------------------------------------------------

// What the CommandEngine hands back for a single command invocation. The
// Terminal turns each of these into an OutputBlock.
export interface CommandResult {
  // The renderer to use. Mirrors output_type plus a few engine-only kinds.
  type: string;
  // The original definition (for data-driven renderers).
  def?: CommandDef;
  // Plain lines for builtin / error / echo style output.
  lines?: string[];
  // Marks this result as an error (renders in theme error color).
  isError?: boolean;
  // Side effects the Terminal must perform after rendering.
  effect?: Effect;
  // Tokens after the command verb (used by the flag command).
  args?: string[];
}

export type Effect =
  | { kind: "clear" }
  | { kind: "set-theme"; theme: string }
  | { kind: "open-url"; url: string }
  | { kind: "run-command"; input: string }
  | { kind: "navigate"; to: string };

// A rendered entry in the scrollback: either the echoed prompt+command line,
// or the output of a command.
export interface HistoryEntry {
  id: number;
  // The prompt path captured at the time the command was run.
  path: string;
  // The raw command the user typed (undefined for system output like boot).
  command?: string;
  // The result to render below the prompt line (undefined for a bare prompt).
  result?: CommandResult;
}
