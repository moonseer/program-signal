import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]">
          High signal. Low noise. Evidence always.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/about" className="text-[var(--fg)] underline-offset-4 hover:underline">
            About
          </Link>
          <Link
            href="/editorial-standards"
            className="text-[var(--fg)] underline-offset-4 hover:underline"
          >
            Editorial standards
          </Link>
          <Link
            href="/ai-and-editorial-process"
            className="text-[var(--fg)] underline-offset-4 hover:underline"
          >
            AI and process
          </Link>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-6 pb-8 text-sm text-[var(--muted)]">
        Named editorial voices are personas, not real-world individuals. Research
        and drafting may use AI-assisted tools; a human editor retains publication
        accountability.
      </p>
    </footer>
  );
}
