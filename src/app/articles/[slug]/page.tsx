import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Callout } from "@/components/Callout";
import {
  contentTypeLabels,
  getArticleBySlug,
  getArticleSlugs,
  personaNames,
  personaRoles,
  personaSlugs,
} from "@/lib/content";
import { difficultyDots, formatDate } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export const dynamic = "force-static";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = getArticleBySlug(slug);
    return {
      title: article.frontmatter.seo?.title ?? article.frontmatter.title,
      description:
        article.frontmatter.seo?.description ?? article.frontmatter.description,
    };
  } catch {
    return { title: "Article" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article;
  try {
    article = getArticleBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, body, readingMinutes } = article;

  return (
    <article className="px-6 py-12">
      <header className="mx-auto max-w-[46rem]">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
          {frontmatter.category} · {contentTypeLabels[frontmatter.contentType]}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-[-0.03em] md:text-5xl">
          {frontmatter.title}
        </h1>
        {frontmatter.subtitle ? (
          <p className="mt-4 text-xl text-[var(--muted)]">{frontmatter.subtitle}</p>
        ) : null}
        <p className="mt-6 font-mono text-[12px] text-[var(--muted)]">
          Written in the {personaNames[frontmatter.authorPersona]} editorial voice
          {" · "}
          <a href={`/authors/${personaSlugs[frontmatter.authorPersona]}`}>
            {personaRoles[frontmatter.authorPersona]}
          </a>
        </p>
        <p className="mt-2 font-mono text-[12px] text-[var(--muted)]">
          {formatDate(frontmatter.publishedAt)}
          {frontmatter.updatedAt ? ` · Updated ${formatDate(frontmatter.updatedAt)}` : ""}
          {` · ${readingMinutes} min · ${difficultyDots(frontmatter.difficulty)} ${frontmatter.difficulty}`}
        </p>
        {frontmatter.technologyVersions.kubernetes ? (
          <p className="mt-2 font-mono text-[12px] text-[var(--muted)]">
            Applies to Kubernetes {frontmatter.technologyVersions.kubernetes}
            {frontmatter.status ? ` · ${frontmatter.status.replace("_", " ")}` : ""}
          </p>
        ) : null}
      </header>

      <div className="prose-signal mx-auto mt-12 max-w-[46rem]">
        <MDXRemote source={body} components={{ Callout }} />
      </div>
    </article>
  );
}
