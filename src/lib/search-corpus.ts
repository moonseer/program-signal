import { getPublishedArticles, type Article } from "@/lib/content";
import { stripMarkdown, type SearchDocument } from "@/lib/search";

export function toSearchDocument(article: Article): SearchDocument {
  const meta = article.frontmatter;
  return {
    id: meta.id,
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    contentType: meta.contentType,
    tags: [...meta.tags, ...meta.concepts].join(" "),
    text: stripMarkdown(article.body).slice(0, 4000),
  };
}

export function getSearchCorpus(): SearchDocument[] {
  return getPublishedArticles().map(toSearchDocument);
}
