import Link from "next/link";
import { ArticleTeaser } from "@/components/ArticleTeaser";
import { SubscribeCta } from "@/components/SubscribeCta";
import { clustersWithArticles, getEditorialClusters } from "@/lib/clusters";
import { getPublishedArticles } from "@/lib/content";
import { toArticleCard } from "@/lib/labels";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata = {
  ...pageMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
  title: { absolute: SITE_NAME },
};

export default function HomePage() {
  const articles = getPublishedArticles();
  const featured = articles[0];
  const signal = articles.slice(1, 4);
  const topicSections = clustersWithArticles(getEditorialClusters(articles));
  const labs = articles.filter((article) => article.frontmatter.contentType === "lab");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">
        Platform Signal
      </p>
      <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-[-0.03em] md:text-6xl">
        Engineering the platforms behind modern software and AI.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
        Evidence-led writing for platform engineers, SREs, and architects. High
        signal. Low noise. Evidence always.
      </p>

      {featured ? (
        <section className="mt-14 border-t border-[var(--border)] pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
            Featured
          </p>
          <div className="mt-4 max-w-4xl border-l-4 border-[var(--accent)] pl-6">
            <ArticleTeaser article={toArticleCard(featured)} heading="h2" />
          </div>
        </section>
      ) : null}

      {signal.length > 0 ? (
        <section className="mt-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--muted)]">
              The Signal
            </h2>
            <Link
              href="/articles"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
            >
              All articles
            </Link>
          </div>
          <ol className="mt-6 grid gap-8 md:grid-cols-3">
            {signal.map((article, index) => (
              <li key={article.frontmatter.id} className="border-t border-[var(--border)] pt-4">
                <p className="font-mono text-[11px] text-[var(--muted)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="mt-2">
                  <ArticleTeaser
                    article={toArticleCard(article)}
                    dek={false}
                    heading="h3"
                  />
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {topicSections.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--muted)]">
            Topic clusters
          </h2>
          <div className="mt-8 space-y-12">
            {topicSections.map((cluster) => (
              <div key={cluster.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em]">
                    {cluster.name}
                  </h3>
                  <Link
                    href={`/topics/${cluster.id}`}
                    className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
                  >
                    Cluster
                  </Link>
                </div>
                <ul className="mt-4 divide-y divide-[var(--border)]">
                  {cluster.publishedArticles.slice(0, 3).map((article) => (
                    <li key={article.frontmatter.id} className="py-4">
                      <ArticleTeaser
                        article={toArticleCard(article)}
                        dek={false}
                        heading="h4"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-20 border border-[var(--border)] bg-[var(--card)] px-6 py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
          Labs
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em]">
          Engineering reports, not blog posts
        </h2>
        {labs.length > 0 ? (
          <ul className="mt-6 divide-y divide-[var(--border)]">
            {labs.slice(0, 2).map((article) => (
              <li key={article.frontmatter.id} className="py-4">
                <ArticleTeaser article={toArticleCard(article)} heading="h3" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-xl text-[var(--muted)]">
            Original experiments with documented environments, versions, and
            limitations. The first Lab is planned after the current launch
            clusters.
          </p>
        )}
        <Link
          href="/labs"
          className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
        >
          Labs index
        </Link>
      </section>

      <SubscribeCta id="subscribe" />
    </div>
  );
}
