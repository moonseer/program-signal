import Link from "next/link";
import {
  contentTypeLabels,
  getPublishedArticles,
  personaNames,
} from "@/lib/content";
import { formatDate } from "@/lib/format";

export default function HomePage() {
  const articles = getPublishedArticles();
  const featured = articles[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">
        Platform Signal
      </p>
      <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-[-0.03em] md:text-6xl">
        Engineering the platforms behind modern software and AI.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
        Evidence-led writing on Kubernetes, agent infrastructure, and production
        operations.
      </p>

      {featured ? (
        <section className="mt-14 border-t border-[var(--border)] pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
            Featured Signal
          </p>
          <Link href={`/articles/${featured.frontmatter.slug}`} className="group mt-4 block">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {featured.frontmatter.category} · {contentTypeLabels[featured.frontmatter.contentType]}
            </p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-tight tracking-[-0.03em] group-hover:text-[var(--accent)] md:text-5xl">
              {featured.frontmatter.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              {featured.frontmatter.subtitle ?? featured.frontmatter.description}
            </p>
            <p className="mt-4 font-mono text-[12px] text-[var(--muted)]">
              {personaNames[featured.frontmatter.authorPersona]} · {featured.readingMinutes} min
              {featured.frontmatter.publishedAt
                ? ` · ${formatDate(featured.frontmatter.publishedAt)}`
                : ""}
            </p>
          </Link>
        </section>
      ) : null}

      {articles.length > 1 ? (
        <section className="mt-16">
          <h2 className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--muted)]">
            Latest
          </h2>
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {articles.slice(1).map((article) => (
              <li key={article.frontmatter.id} className="py-4">
                <Link href={`/articles/${article.frontmatter.slug}`} className="hover:text-[var(--accent)]">
                  {article.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        id="subscribe"
        className="mt-20 border border-[var(--border)] bg-[var(--card)] px-6 py-8"
      >
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em]">
          Get the Signal
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          One useful engineering brief every week. Newsletter capture ships in a later phase.
        </p>
      </section>
    </div>
  );
}
