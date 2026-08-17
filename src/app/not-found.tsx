import type { Metadata } from "next";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
        404
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        This page is not in the corpus.
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        The URL may have changed. Article IDs do not.
      </p>
    </div>
  );
}
