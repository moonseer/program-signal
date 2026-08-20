import { TrackedLink } from "@/components/TrackedLink";
import { getArticleBySlug } from "@/lib/content";

export function RelatedArticles({ slugs }: { slugs: string[] }) {
  const articles = slugs
    .map((slug) => {
      try {
        return getArticleBySlug(slug);
      } catch {
        return null;
      }
    })
    .filter((article): article is NonNullable<typeof article> => article !== null);

  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-8">
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.02em]">
        Related reading
      </h2>
      <ul className="mt-4 divide-y divide-[var(--border)]">
        {articles.map((article) => (
          <li key={article.frontmatter.id} className="py-3">
            <TrackedLink
              href={`/articles/${article.frontmatter.slug}`}
              className="hover:text-[var(--accent)]"
              event="related_article_click"
              eventProps={{ slug: article.frontmatter.slug }}
            >
              {article.frontmatter.title}
            </TrackedLink>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {article.frontmatter.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
