import type { CommandResult } from "../types";

interface CertItem {
  name: string;
  issuer: string;
  year: string;
  status?: string;
  link?: string;
  image?: string;
}

interface CertCategory {
  label: string;
  items: CertItem[];
}

interface CertificationsDefinition {
  categories?: Record<string, CertCategory>;
}

function getStatusClass(status?: string): string {
  if (!status) return "";

  return `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
}

export default function CertsRenderer({ result }: { result: CommandResult }) {
  const def = result.def as CertificationsDefinition | undefined;
  const categories = def?.categories ?? {};

  const categoryEntries = Object.entries(categories);

  if (categoryEntries.length === 0) {
    return (
      <div className="renderer-certs">
        <span className="cert-empty">
          No certifications or achievements found.
        </span>
      </div>
    );
  }

  return (
    <div className="renderer-certs">
      {categoryEntries.map(([key, category]) => (
        <section className="cert-category" key={key}>
          <div className="cert-category-title">{category.label}</div>

          <div className="cert-category-line">
            {"─".repeat(Math.max(category.label.length, 24))}
          </div>

          <div className="cert-items">
            {category.items.map((cert) => (
              <div className="cert-item" key={`${cert.name}-${cert.year}`}>
                {/* Name + Status */}
                <div className="cert-main">
                  <span className="cert-name">{cert.name}</span>

                  {cert.status && (
                    <span
                      className={`cert-status ${getStatusClass(cert.status)}`}
                    >
                      [{cert.status}]
                    </span>
                  )}
                </div>

                {/* Issuer + Year */}
                <div className="cert-meta">
                  <span className="cert-issuer">{cert.issuer}</span>

                  <span className="cert-separator">·</span>

                  <span className="cert-year">{cert.year}</span>
                </div>

                {/* Verification Link */}
                {cert.link && (
                  <a
                    className="cert-link"
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    → {cert.link}
                  </a>
                )}

                {/* Certificate Image */}
                {cert.image && (
                  <a
                    className="cert-view-image"
                    href={cert.image}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    → [view certificate]
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
