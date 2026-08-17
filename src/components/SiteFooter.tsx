import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]">
          High signal. Low noise. Evidence always.
        </p>
        <p>
          Named editorial voices are personas, not real-world individuals.{" "}
          <Link href="/about" className="text-[var(--fg)] underline-offset-4 hover:underline">
            About the process
          </Link>
        </p>
      </div>
    </footer>
  );
}
