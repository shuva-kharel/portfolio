import type { CommandResult } from "../types";

// The "email" output: shows the address as a mailto link plus the configured
// status message. The actual mail-client open is fired by the engine as an
// open-url effect, so this renderer is purely visual.
export default function EmailRenderer({ result }: { result: CommandResult }) {
  const address = (result.def?.address as string | undefined) ?? "";
  const message = (result.def?.message as string | undefined) ?? "";

  return (
    <div className="renderer-email">
      {message && <p className="term-line">{message}</p>}
      <p className="term-line">
        <span className="email-label">Email: </span>
        <a className="term-link" href={`mailto:${address}`}>
          {address}
        </a>
      </p>
    </div>
  );
}
