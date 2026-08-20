import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleTeaser } from "@/components/ArticleTeaser";
import { getClusterById, loadClusterRecords } from "@/lib/clusters";
import { getPublishedArticles } from "@/lib/content";
import { toArticleCard } from "@/lib/labels";
import { pageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ cluster: string }> };

export function generateStaticParams() {
  return loadClusterRecords().map((cluster) => ({ cluster: cluster.id }));
}

export const dynamic = "force-static";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cluster: id } = await params;
  const cluster = getClusterById(id);
  if (!cluster) return { title: "Topic" };
  return pageMetadata({
    title: cluster.name,
    description: `Platform Signal articles in the ${cluster.name} topic cluster.`,
    path: `/topics/${cluster.id}`,
  });
}

export default async function TopicClusterPage({ params }: Props) {
  const { cluster: id } = await params;
  const cluster = getClusterById(id, getPublishedArticles());
  if (!cluster) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
        Topic cluster
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        {cluster.name}
      </h1>
      {cluster.pillarArticle ? (
        <section className="mt-10 border-l-4 border-[var(--accent)] pl-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
            Pillar
          </p>
          <div className="mt-2">
            <ArticleTeaser article={toArticleCard(cluster.pillarArticle)} heading="h2" />
          </div>
        </section>
      ) : null}
      {cluster.publishedArticles.length > 0 ? (
        <ul className="mt-10 divide-y divide-[var(--border)]">
          {cluster.publishedArticles
            .filter(
              (article) =>
                article.frontmatter.id !== cluster.pillarArticle?.frontmatter.id,
            )
            .map((article) => (
              <li key={article.frontmatter.id} className="py-6">
                <ArticleTeaser article={toArticleCard(article)} heading="h2" />
              </li>
            ))}
        </ul>
      ) : (
        <p className="mt-8 text-[var(--muted)]">
          This cluster is in the inventory. Articles publish when the Desk
          assigns them — Kubernetes pieces stay deferred.
        </p>
      )}
    </div>
  );
}
