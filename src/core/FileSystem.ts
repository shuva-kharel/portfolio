import type { FileSystemData, FsDir } from "../types";

// ---------------------------------------------------------------------------
// Virtual filesystem driven entirely by portfolio.json -> "filesystem".
//
// Directory nodes are keyed by absolute path ("/", "/projects", ...).
// File contents live under the "files" key, keyed by either the full absolute
// path ("/projects/nmapper/README.md") or a bare filename ("skills.txt") for
// files that sit at the root. We resolve both.
// ---------------------------------------------------------------------------

export class FileSystem {
  private fs: FileSystemData;
  private files: Record<string, string>;
  private cwd = "/";

  constructor(fs: FileSystemData) {
    this.fs = fs;
    this.files = (fs.files as Record<string, string>) ?? {};
  }

  get path(): string {
    return this.cwd;
  }

  // The prompt shows "~" for home (root) and the absolute path otherwise.
  get displayPath(): string {
    return this.cwd === "/" ? "~" : this.cwd;
  }

  private getDir(path: string): FsDir | null {
    const node = this.fs[path];
    if (node && (node as FsDir).type === "dir") return node as FsDir;
    return null;
  }

  // Normalise a path: resolve ".", "..", "~", absolute and relative forms.
  private resolve(input: string): string {
    let target = input.trim();
    if (target === "" || target === "~") return "/";

    // Expand a leading ~ ("~/projects").
    if (target.startsWith("~/")) target = target.slice(1); // -> "/projects"

    const isAbsolute = target.startsWith("/");
    const base = isAbsolute ? [] : this.cwd.split("/").filter(Boolean);
    const parts = target.split("/").filter(Boolean);

    const stack = [...base];
    for (const part of parts) {
      if (part === ".") continue;
      if (part === "..") {
        stack.pop();
        continue;
      }
      stack.push(part);
    }
    return "/" + stack.join("/");
  }

  // cd: returns an error message string, or null on success.
  cd(arg: string): string | null {
    const target = this.resolve(arg || "~");
    if (this.getDir(target)) {
      this.cwd = target;
      return null;
    }
    return `cd: no such directory: ${arg}`;
  }

  // ls: list children of the cwd (or a given path). `-la` toggles long format.
  ls(args: string[]): { lines: string[]; error?: boolean } {
    const flags = args.filter((a) => a.startsWith("-")).join("");
    const long = flags.includes("l") || flags.includes("a");
    const pathArg = args.find((a) => !a.startsWith("-"));
    const target = pathArg ? this.resolve(pathArg) : this.cwd;

    const dir = this.getDir(target);
    if (!dir) return { lines: [`ls: cannot access '${pathArg}': No such directory`], error: true };

    if (!long) return { lines: [dir.children.join("   ")] };

    // Fake but plausible long-listing metadata.
    const lines = [`total ${dir.children.length * 4}`];
    for (const child of dir.children) {
      const isDir = child.endsWith("/");
      const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
      const size = isDir ? "4096" : String(512 + child.length * 37);
      const date = "Jun 28 13:37";
      lines.push(
        `${perms}  1 ghost ghost  ${size.padStart(5)} ${date} ${child}`
      );
    }
    return { lines };
  }

  // cat: read a file relative to cwd or by absolute path.
  cat(arg: string): { lines: string[]; error?: boolean } {
    if (!arg) return { lines: ["cat: missing file operand"], error: true };

    const resolved = this.resolve(arg);
    const basename = resolved.split("/").pop() ?? arg;

    // Try, in order: full resolved path, bare basename, the raw arg.
    const content =
      this.files[resolved] ??
      this.files[basename] ??
      this.files[arg] ??
      null;

    if (content === null) {
      // Distinguish "it's a directory" from "no such file".
      if (this.getDir(resolved)) {
        return { lines: [`cat: ${arg}: Is a directory`], error: true };
      }
      return { lines: [`cat: ${arg}: No such file or directory`], error: true };
    }
    return { lines: content.split("\n") };
  }

  // Names available at the cwd, used by tab-completion (no trailing slash flag).
  completionsAt(): string[] {
    const dir = this.getDir(this.cwd);
    return dir ? dir.children : [];
  }
}
