import type { Heading } from "@/lib/headings";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;
  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
        Contents
      </p>
      <ol className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "pl-3 text-[var(--muted)]" : ""}
          >
            <a href={`#${heading.id}`} className="hover:text-[var(--accent)]">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
