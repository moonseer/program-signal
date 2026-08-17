import Link from "next/link";
import {
  contentTypeLabels,
  getPublishedArticles,
  personaNames,
} from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Articles",
};

export default function ArticlesPage() {
  const articles = getPublishedArticles();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Articles
      </h1>
      <ul className="mt-10 divide-y divide-[var(--border)]">
        {articles.map((article) => (
          <li key={article.frontmatter.id} className="py-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {article.frontmatter.category} · {contentTypeLabels[article.frontmatter.contentType]}
            </p>
            <Link
              href={`/articles/${article.frontmatter.slug}`}
              className="mt-2 block text-2xl leading-snug hover:text-[var(--accent)]"
            >
              {article.frontmatter.title}
            </Link>
            <p className="mt-2 text-[var(--muted)]">{article.frontmatter.description}</p>
            <p className="mt-3 font-mono text-[12px] text-[var(--muted)]">
              {personaNames[article.frontmatter.authorPersona]}
              {article.frontmatter.publishedAt
                ? ` · ${formatDate(article.frontmatter.publishedAt)}`
                : ""}
              {` · ${article.readingMinutes} min`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
