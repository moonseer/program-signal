import { Charset, Document } from "flexsearch";

export type SearchDocument = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  contentType: string;
  tags: string;
  text: string;
};

export type SearchHit = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
};

export function stripMarkdown(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSearchText(value: string): string {
  return value.replace(/[-_/]+/g, " ").replace(/\s+/g, " ").trim();
}

export function searchArticles(
  corpus: SearchDocument[],
  query: string,
): SearchHit[] {
  const q = normalizeSearchText(query);
  if (!q || corpus.length === 0) return [];

  const index = new Document<SearchDocument>({
    tokenize: "forward",
    encoder: Charset.LatinBalance,
    document: {
      id: "id",
      store: true,
      index: ["title", "description", "category", "tags", "text"],
    },
  });
  for (const doc of corpus) {
    index.add({
      ...doc,
      title: normalizeSearchText(doc.title),
      description: normalizeSearchText(doc.description),
      category: normalizeSearchText(doc.category),
      tags: normalizeSearchText(doc.tags),
      text: normalizeSearchText(doc.text),
    });
  }

  const raw = index.search(q, {
    enrich: true,
    merge: true,
    limit: 8,
  });
  const byId = new Map(corpus.map((doc) => [doc.id, doc]));
  const rows = Array.isArray(raw) ? raw : [];
  const hits: SearchHit[] = [];
  for (const row of rows) {
    const id = "id" in row ? String(row.id) : "";
    const original = byId.get(id);
    if (!original) continue;
    hits.push({
      id: original.id,
      slug: original.slug,
      title: original.title,
      description: original.description,
      category: original.category,
    });
  }
  return hits;
}
