"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { searchArticles, type SearchDocument } from "@/lib/search";

export function SearchDialog({ corpus }: { corpus: SearchDocument[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const hits = useMemo(() => searchArticles(corpus, query), [corpus, query]);
  const lastTrackedQuery = useRef("");

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2 || hits.length === 0) return;
    if (lastTrackedQuery.current === trimmed) return;
    lastTrackedQuery.current = trimmed;
    trackEvent("search_used", {
      query_length: trimmed.length,
      hit_count: hits.length,
    });
  }, [query, hits.length]);

  function show() {
    dialogRef.current?.showModal();
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function hide() {
    dialogRef.current?.close();
    setOpen(false);
    setQuery("");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) hide();
        else show();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={show}
        className="min-h-11 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--accent)]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-search-dialog"
      >
        Search
        <span className="ml-2 hidden text-[10px] tracking-[0.08em] lg:inline">
          ⌘K
        </span>
      </button>
      <dialog
        id="site-search-dialog"
        ref={dialogRef}
        className="search-dialog w-[min(36rem,calc(100vw-2rem))] border border-[var(--border)] bg-[var(--card)] p-0 text-[var(--fg)] shadow-lg"
        aria-label="Search articles"
        onClose={() => {
          setOpen(false);
          setQuery("");
          window.setTimeout(() => triggerRef.current?.focus(), 0);
        }}
      >
        <form
          method="dialog"
          className="border-b border-[var(--border)] px-4 py-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="site-search">
            Search articles
          </label>
          <input
            id="site-search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, topics, and articles"
            className="w-full bg-transparent font-[family-name:var(--font-body)] text-lg outline-none placeholder:text-[var(--muted)]"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <div className="max-h-[min(24rem,60vh)] overflow-y-auto px-2 py-2">
          {query.trim() === "" ? (
            <p className="px-3 py-4 font-mono text-[12px] text-[var(--muted)]">
              Type to search published articles. This is not a chat box.
            </p>
          ) : hits.length === 0 ? (
            <p className="px-3 py-4 text-[var(--muted)]">No matching articles.</p>
          ) : (
            <ul>
              {hits.map((hit) => (
                <li key={hit.id}>
                  <Link
                    href={`/articles/${hit.slug}`}
                    className="block rounded px-3 py-3 hover:bg-[var(--code)]"
                    onClick={hide}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                      {hit.category}
                    </p>
                    <p className="mt-1 text-lg leading-snug">{hit.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{hit.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
          <span>Published articles</span>
          <button
            type="button"
            onClick={hide}
            className="min-h-11 text-[var(--accent)]"
            aria-label="Close search"
          >
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
