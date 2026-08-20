import { ArticlesIndex } from "@/components/ArticlesIndex";
import { getEditorialClusters } from "@/lib/clusters";
import { getPublishedArticles } from "@/lib/content";
import { toArticleCard } from "@/lib/labels";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Articles",
  description:
    "List-first index of Platform Signal articles. Filter by topic, persona, type, and difficulty.",
  path: "/articles",
});

export default function ArticlesPage() {
  const articles = getPublishedArticles();
  const clusters = getEditorialClusters(articles).map((cluster) => ({
    id: cluster.id,
    name: cluster.name,
    articleIds: cluster.articles,
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Articles
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        List-first index. Filter by topic, persona, type, and difficulty.
      </p>
      <ArticlesIndex
        articles={articles.map(toArticleCard)}
        clusters={clusters}
      />
    </div>
  );
}
