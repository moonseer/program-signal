"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav = [
  { href: "/articles", label: "Articles" },
  { href: "/topics", label: "Topics" },
  { href: "/labs", label: "Labs" },
  { href: "/field-notes", label: "Field Notes" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

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
            className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] sm:inline"
          >
            Subscribe
          </Link>
          <button
            type="button"
            className="min-h-11 min-w-11 font-mono text-[11px] uppercase tracking-[0.16em] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-[var(--border)] px-6 py-3 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center text-base text-[var(--muted)] hover:text-[var(--fg)]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#subscribe"
            className="flex min-h-11 items-center font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--accent)]"
            onClick={() => setOpen(false)}
          >
            Subscribe
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
