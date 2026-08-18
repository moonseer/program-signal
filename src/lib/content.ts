import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import {
  articleFrontmatterSchema,
  publicReferencesFileSchema,
  sourceLibrarySchema,
  type ArticleFrontmatter,
  type PublicReference,
  type SourceRecord,
} from "@/lib/schemas";
import {
  contentTypeLabels,
  personaNames,
  personaRoles,
  personaSlugs,
} from "@/lib/labels";

export type { ArticleFrontmatter };
export { contentTypeLabels, personaNames, personaRoles, personaSlugs };

const articlesRoot = path.join(process.cwd(), "content/articles");

export type Article = {
  frontmatter: ArticleFrontmatter;
  body: string;
  readingMinutes: number;
};

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesRoot)) return [];
  return fs
    .readdirSync(articlesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) =>
      fs.existsSync(path.join(articlesRoot, slug, "index.mdx")),
    );
}

export function getArticleBySlug(slug: string): Article {
  const file = fs.readFileSync(
    path.join(articlesRoot, slug, "index.mdx"),
    "utf8",
  );
  const parsed = matter(file);
  const frontmatter = articleFrontmatterSchema.parse({
    ...parsed.data,
    slug: parsed.data.slug ?? slug,
  });
  return {
    frontmatter,
    body: parsed.content,
    readingMinutes: readingMinutes(parsed.content),
  };
}

export function getSourceLibrary(): SourceRecord[] {
  const file = path.join(process.cwd(), "editorial/sources.yml");
  const parsed = sourceLibrarySchema.parse(
    yaml.load(fs.readFileSync(file, "utf8")),
  );
  return parsed.sources;
}

export function getArticleReferences(
  slug: string,
): Array<{ entry: PublicReference; source: SourceRecord }> {
  const file = path.join(articlesRoot, slug, "references.yml");
  if (!fs.existsSync(file)) return [];
  const parsed = publicReferencesFileSchema.parse(
    yaml.load(fs.readFileSync(file, "utf8")),
  );
  const library = new Map(
    getSourceLibrary().map((source) => [source.source_id, source]),
  );
  return parsed.references.map((entry) => {
    const source = library.get(entry.source_id);
    if (!source) {
      throw new Error(`${slug}: public reference ${entry.source_id} is not in editorial/sources.yml`);
    }
    return { entry, source };
  });
}

export function getPublishedArticles(): Article[] {
  return getArticleSlugs()
    .map(getArticleBySlug)
    .filter((article) => article.frontmatter.editorialStatus === "published")
    .sort((a, b) => {
      const aDate = a.frontmatter.publishedAt ?? "";
      const bDate = b.frontmatter.publishedAt ?? "";
      return bDate.localeCompare(aDate);
    });
}
