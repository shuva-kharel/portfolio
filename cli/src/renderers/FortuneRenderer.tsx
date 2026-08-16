import { useState } from "react";
import type { CommandResult } from "../types";

// The "fortune" easter egg: prints one random quote. The pick is made once,
// when the block mounts, so it stays stable but differs each invocation.
export default function FortuneRenderer({ result }: { result: CommandResult }) {
  const quotes = (result.def?.quotes as string[] | undefined) ?? [];
  const [quote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)] ?? ""
  );

  return (
    <div className="renderer-fortune">
      <p className="term-line fortune-quote">{quote}</p>
    </div>
  );
}
