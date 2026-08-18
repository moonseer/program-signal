import type { ArticleFrontmatter } from "@/lib/schemas";

export type ArticleCard = {
  id: string;
  title: string;
  slug: string;
  description: string;
  subtitle?: string;
  category: string;
  contentType: ArticleFrontmatter["contentType"];
  authorPersona: ArticleFrontmatter["authorPersona"];
  difficulty: ArticleFrontmatter["difficulty"];
  publishedAt?: string;
  readingMinutes: number;
};

export const personaNames: Record<ArticleFrontmatter["authorPersona"], string> =
  {
    marcus: "Marcus Reed",
    maya: "Dr. Maya Chen",
    elias: "Elias Voss",
    nia: "Nia Brooks",
    founder: "Curtis Wilson",
  };

export const personaRoles: Record<ArticleFrontmatter["authorPersona"], string> =
  {
    marcus: "The Operator",
    maya: "The Architect",
    elias: "The Scout",
    nia: "The Field Engineer",
    founder: "Editor",
  };

export const personaSlugs: Record<ArticleFrontmatter["authorPersona"], string> =
  {
    marcus: "marcus-reed",
    maya: "maya-chen",
    elias: "elias-voss",
    nia: "nia-brooks",
    founder: "curtis-wilson",
  };

export const contentTypeLabels: Record<
  ArticleFrontmatter["contentType"],
  string
> = {
  deep_dive: "Deep Dive",
  operator_guide: "Operator Guide",
  the_signal: "The Signal",
  field_note: "Field Note",
  lab: "Lab",
  explainer: "Explainer",
  decision_guide: "Decision Guide",
  roundtable: "Roundtable",
  reference_architecture: "Reference Architecture",
};

export function toArticleCard(article: {
  readingMinutes: number;
  frontmatter: ArticleFrontmatter;
}): ArticleCard {
  return {
    id: article.frontmatter.id,
    title: article.frontmatter.title,
    slug: article.frontmatter.slug,
    description: article.frontmatter.description,
    subtitle: article.frontmatter.subtitle,
    category: article.frontmatter.category,
    contentType: article.frontmatter.contentType,
    authorPersona: article.frontmatter.authorPersona,
    difficulty: article.frontmatter.difficulty,
    publishedAt: article.frontmatter.publishedAt,
    readingMinutes: article.readingMinutes,
  };
}
