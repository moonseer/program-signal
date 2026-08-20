import { TrackedLink } from "@/components/TrackedLink";

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
        One useful engineering brief every week. Email capture is deferred (E23);
        the CTA is wired for analytics while the provider is pending.
      </p>
      {compact ? (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em]">
          <TrackedLink
            href="/#subscribe"
            className="text-[var(--accent)]"
            event="newsletter_cta_click"
            eventProps={{ location: "article_end" }}
          >
            Homepage signup
          </TrackedLink>
        </p>
      ) : null}
    </section>
  );
}
