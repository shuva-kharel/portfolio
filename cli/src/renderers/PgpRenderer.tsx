import { usePortfolioData } from "../context";

// The "pgp" command: public-key metadata from the top-level `pgp` object.
export default function PgpRenderer() {
  const data = usePortfolioData();
  const pgp = (data.pgp as Record<string, string> | undefined) ?? {};

  const rows: Array<[string, string | undefined]> = [
    ["Fingerprint", pgp.fingerprint],
    ["Key Server", pgp.key_server],
    ["Note", pgp.note],
  ];

  return (
    <div className="renderer-kv">
      <p className="kv-title">PGP PUBLIC KEY</p>
      <p className="kv-rule">──────────────────────────────────────────</p>
      {rows.map(([k, v]) =>
        v ? (
          <p className="kv-row" key={k}>
            <span className="kv-key">{k.padEnd(12)}</span>: {v}
          </p>
        ) : null
      )}
    </div>
  );
}
