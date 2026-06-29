import { useMemo } from "react";
import type { CommandDef, CommandResult } from "../types";
import { xorDecodeHex } from "../hof";

// The "flag" command — the CTF endpoint. Two modes:
//   flag           → show the challenge briefing
//   flag CTF{...}   → verify a candidate flag
//
// The correct flag is never stored in plaintext: it's XOR-decoded at runtime
// from the same encrypted hex that lives in /secret/flag.txt. Getting listed in
// the hall of fame is intentionally manual (DM), so there's nothing to game.
export default function FlagRenderer({ result }: { result: CommandResult }) {
  const def: CommandDef | Record<string, unknown> = result.def ?? {};
  const args = result.args ?? [];
  const format = (def.format as string | undefined) ?? "CTF{...}";
  const hint = (def.hint as string | undefined) ?? "";
  const check = def.check as { hex: string; xor: number } | undefined;

  const expected = useMemo(
    () => (check ? xorDecodeHex(check.hex, check.xor) : ""),
    [check]
  );

  const lines = useMemo<{ text: string; ok?: boolean; err?: boolean }[]>(() => {
    const out: { text: string; ok?: boolean; err?: boolean }[] = [];

    if (args.length === 0) {
      out.push({ text: "CTF CHALLENGE — 5 layers, one flag." });
      out.push({ text: `format : ${format}` });
      if (hint) out.push({ text: `hint   : ${hint}` });
      out.push({ text: "" });
      out.push({ text: "verify : flag CTF{...}" });
      return out;
    }

    const attempt = args.join(" ").trim();
    if (attempt === expected) {
      out.push({ text: "Correct. That's the flag.", ok: true });
      out.push({
        text: "DM me on GitHub with your handle to be listed.",
        ok: true,
      });
    } else {
      out.push({ text: "Nope. Keep digging.", err: true });
      if (hint) out.push({ text: hint });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.join(" "), expected, format, hint]);

  return (
    <div className="renderer-flag">
      {lines.map((l, i) => (
        <p
          key={i}
          className={`term-line${l.ok ? " flag-ok" : ""}${
            l.err ? " term-error" : ""
          }`}
        >
          {l.text === "" ? " " : l.text}
        </p>
      ))}
    </div>
  );
}
