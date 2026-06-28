import type { CommandResult } from "../types";

interface Cert {
  name: string;
  issuer: string;
  year: string;
  status: string;
}

// The "certifications" output: name, issuer and year per row plus a status
// badge — green for active, amber for in-progress.
export default function CertsRenderer({ result }: { result: CommandResult }) {
  const items = (result.def?.items as Cert[] | undefined) ?? [];

  return (
    <div className="renderer-certs">
      {items.map((c) => (
        <div className="cert-row" key={c.name}>
          <span className="cert-name">{c.name}</span>
          <span className="cert-issuer">{c.issuer}</span>
          <span className="cert-year">{c.year}</span>
          <span className={`cert-status status-${c.status.replace(/\s+/g, "-")}`}>
            {c.status}
          </span>
        </div>
      ))}
    </div>
  );
}
