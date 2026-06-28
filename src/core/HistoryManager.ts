// ---------------------------------------------------------------------------
// Command history with up/down arrow navigation, bash-style.
//
// - push() records a command (skipping blanks and immediate duplicates).
// - prev()/next() walk the history; the cursor sits "past the end" when not
//   navigating, so the first ArrowUp returns the most recent command.
// ---------------------------------------------------------------------------

export class HistoryManager {
  private entries: string[] = [];
  private cursor = 0; // points at entries.length when not navigating

  push(command: string): void {
    const trimmed = command.trim();
    if (trimmed === "") {
      this.cursor = this.entries.length;
      return;
    }
    if (this.entries[this.entries.length - 1] !== trimmed) {
      this.entries.push(trimmed);
    }
    this.cursor = this.entries.length;
  }

  // ArrowUp: move toward older commands. Returns null if already at the oldest
  // (so the caller can leave the input unchanged).
  prev(): string | null {
    if (this.entries.length === 0) return null;
    if (this.cursor > 0) this.cursor--;
    return this.entries[this.cursor] ?? null;
  }

  // ArrowDown: move toward newer commands. Returns "" when stepping past the
  // newest entry, which clears the input like a real shell.
  next(): string | null {
    if (this.entries.length === 0) return null;
    if (this.cursor < this.entries.length) this.cursor++;
    if (this.cursor >= this.entries.length) return "";
    return this.entries[this.cursor] ?? null;
  }

  reset(): void {
    this.cursor = this.entries.length;
  }

  all(): string[] {
    return [...this.entries];
  }
}
