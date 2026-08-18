import Link from "next/link";
import { getEditorialClusters } from "@/lib/clusters";
import { getPublishedArticles } from "@/lib/content";

export const metadata = { title: "Topics" };

export default function TopicsPage() {
  const clusters = getEditorialClusters(getPublishedArticles());

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Topics
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Launch clusters for platform engineers. Kubernetes pieces stay in the
        inventory until that workload is back in editorial scope.
      </p>
      <ul className="mt-10 divide-y divide-[var(--border)]">
        {clusters.map((cluster) => (
          <li key={cluster.id} className="py-6">
            <Link
              href={`/topics/${cluster.id}`}
              className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.03em] hover:text-[var(--accent)]"
            >
              {cluster.name}
            </Link>
            <p className="mt-2 font-mono text-[12px] text-[var(--muted)]">
              {cluster.publishedArticles.length === 0
                ? "No published articles yet"
                : `${cluster.publishedArticles.length} published`}
              {cluster.pillarArticle
                ? ` · pillar: ${cluster.pillarArticle.frontmatter.title}`
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
