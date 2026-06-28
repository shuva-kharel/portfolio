// Hall-of-fame storage: CTF solvers persisted in localStorage across sessions.

export interface HofEntry {
  handle: string;
  ts: string; // ISO timestamp of when they solved it
}

const KEY = "hof_entries";

export function getHofEntries(): HofEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HofEntry[]) : [];
  } catch {
    return [];
  }
}

// Records a solver, de-duplicating by handle (case-insensitive). Returns the
// updated list.
export function addHofEntry(handle: string): HofEntry[] {
  const entries = getHofEntries();
  const exists = entries.some(
    (e) => e.handle.toLowerCase() === handle.toLowerCase()
  );
  if (!exists) {
    entries.push({ handle, ts: new Date().toISOString() });
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }
  return entries;
}

// Decode a hex string XOR'd byte-by-byte with `xor` back to its UTF-8 string.
export function xorDecodeHex(hex: string, xor: number): string {
  const bytes = hex.match(/../g) ?? [];
  return bytes.map((h) => String.fromCharCode(parseInt(h, 16) ^ xor)).join("");
}
