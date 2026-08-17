import type { PublicReference, SourceRecord } from "@/lib/schemas";

const labels: Record<PublicReference["label"], string> = {
  PRIMARY_SOURCE: "Primary source",
  SPECIFICATION: "Specification",
  RESEARCH: "Research",
  VENDOR_DOCUMENTATION: "Vendor documentation",
  SECONDARY_ANALYSIS: "Secondary analysis",
};

export function SourceList({
  references,
}: {
  references: Array<{ entry: PublicReference; source: SourceRecord }>;
}) {
  if (references.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-[46rem] border-t border-[var(--border)] pt-8">
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.02em]">
        References
      </h2>
      <ol className="mt-6 space-y-5">
        {references.map(({ entry, source }, index) => (
          <li key={source.source_id} className="text-sm leading-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
              {index + 1} · {labels[entry.label]}
            </p>
            <p className="mt-1">
              {source.url ? (
                <a href={source.url} rel="noreferrer">
                  {source.title}
                </a>
              ) : (
                source.title
              )}
              {source.organization ? ` — ${source.organization}` : ""}
              {entry.version ? ` · ${entry.version}` : ""}
            </p>
            {entry.note ? (
              <p className="mt-1 text-[var(--muted)]">{entry.note}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
