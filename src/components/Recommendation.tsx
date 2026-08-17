import type { ReactNode } from "react";

export function Recommendation({ children }: { children: ReactNode }) {
  return (
    <section className="my-12 border-t border-[var(--border)] pt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
        Platform Signal recommendation
      </p>
      <div className="prose-signal mt-4">{children}</div>
    </section>
  );
}
