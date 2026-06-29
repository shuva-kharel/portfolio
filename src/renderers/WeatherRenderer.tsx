import { useEffect, useState } from "react";
import type { CommandResult } from "../types";

// `curl wttr.in[/city]` — fetches real weather from wttr.in (which supports
// CORS). On failure, shows the authentic curl error. Output is capped so a
// verbose forecast can't flood the terminal.
export default function WeatherRenderer({ result }: { result: CommandResult }) {
  const city = (result.def?.city as string | undefined) ?? "";
  const [state, setState] = useState<{ lines?: string[]; error?: boolean }>({});

  useEffect(() => {
    let cancelled = false;
    // ?T disables ANSI colour codes so the output renders cleanly.
    fetch(`https://wttr.in/${encodeURIComponent(city)}?T`)
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const lines = text.replace(/\n+$/, "").split("\n").slice(0, 20);
        setState({ lines });
      })
      .catch(() => {
        if (!cancelled) setState({ error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (state.error) {
    return (
      <p className="term-line term-error">
        curl: (6) Could not resolve host: wttr.in
      </p>
    );
  }
  if (!state.lines) {
    return <p className="term-line term-dim">connecting to wttr.in...</p>;
  }
  return <pre className="weather-pre">{state.lines.join("\n")}</pre>;
}
