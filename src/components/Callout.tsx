import type { ReactNode } from "react";

const labels = {
  signal: "Signal",
  production: "Production Note",
  watch: "Watch Out",
  field: "Field Note",
} as const;

export function Callout({
  type,
  children,
}: {
  type: keyof typeof labels;
  children: ReactNode;
}) {
  return (
    <aside className={`callout callout-${type} my-8 border-l-2 py-2 pl-4`}>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em]">
        {labels[type]}
      </p>
      <div className="text-[0.97em] leading-7">{children}</div>
    </aside>
  );
}
