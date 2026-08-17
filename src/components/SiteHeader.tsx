import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav = [
  { href: "/articles", label: "Articles" },
  { href: "/topics", label: "Topics" },
  { href: "/labs", label: "Labs" },
  { href: "/field-notes", label: "Field Notes" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-mono text-[13px] tracking-[0.18em] uppercase">
          Platform Signal
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--fg)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/#subscribe"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  );
}
