import Link from "next/link";

export function SubscribeCta({
  id,
  compact = false,
}: {
  id?: string;
  compact?: boolean;
}) {
  return (
    <section
      id={id}
      className={
        compact
          ? "mt-16 border border-[var(--border)] px-6 py-8"
          : "mt-12 border border-[var(--border)] px-6 py-8"
      }
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
        Newsletter
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em]">
        Get the Signal
      </h2>
      <p className="mt-2 max-w-xl text-[var(--muted)]">
        One useful engineering brief every week. Newsletter capture ships in a
        later phase.
      </p>
      {compact ? (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em]">
          <Link href="/#subscribe" className="text-[var(--accent)]">
            Homepage signup
          </Link>
        </p>
      ) : null}
    </section>
  );
}
