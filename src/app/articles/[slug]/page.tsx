import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Callout } from "@/components/Callout";
import { Figure, headingIdFromChildren } from "@/components/Figure";
import { Recommendation } from "@/components/Recommendation";
import { RelatedArticles } from "@/components/RelatedArticles";
import { SourceList } from "@/components/SourceList";
import { TableOfContents } from "@/components/TableOfContents";
import {
  contentTypeLabels,
  getArticleBySlug,
  getArticleReferences,
  getArticleSlugs,
  personaNames,
} from "@/lib/content";
import { extractHeadings } from "@/lib/headings";
import { difficultyDots, formatDate } from "@/lib/format";
import { articleMdxOptions } from "@/lib/mdx";

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

function Heading({
  level,
  children,
}: {
  level: 2 | 3;
  children: ReactNode;
}) {
  const id = headingIdFromChildren(children);
  const Tag = level === 2 ? "h2" : "h3";
  return <Tag id={id}>{children}</Tag>;
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
  const references = getArticleReferences(slug);
  const headings = extractHeadings(body);

  const components = {
    Callout,
    Recommendation,
    Figure: (props: { id: string; caption: string }) => (
      <Figure slug={slug} {...props} />
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <Heading level={2}>{children}</Heading>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <Heading level={3}>{children}</Heading>
    ),
  };

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
          {frontmatter.authorPersona === "founder"
            ? personaNames.founder
            : `Written in the ${personaNames[frontmatter.authorPersona]} editorial voice`}
          {" · "}
          Reviewed by Platform Signal Editorial
        </p>
        <p className="mt-2 font-mono text-[12px] text-[var(--muted)]">
          {formatDate(frontmatter.publishedAt)}
          {frontmatter.updatedAt ? ` · Updated ${formatDate(frontmatter.updatedAt)}` : ""}
          {frontmatter.lastReviewedAt
            ? ` · Reviewed ${formatDate(frontmatter.lastReviewedAt)}`
            : ""}
          {` · ${readingMinutes} min · ${difficultyDots(frontmatter.difficulty)} ${frontmatter.difficulty}`}
        </p>
        {frontmatter.technologyVersions.kubernetes ? (
          <p className="mt-2 font-mono text-[12px] text-[var(--muted)]">
            Applies to Kubernetes {frontmatter.technologyVersions.kubernetes}
            {frontmatter.status ? ` · ${frontmatter.status.replace("_", " ")}` : ""}
          </p>
        ) : null}
      </header>

      <div className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-[14rem_minmax(0,46rem)]">
        <div className="hidden lg:block">
          <div className="sticky top-8">
            <TableOfContents headings={headings} />
          </div>
        </div>
        <div>
          <details className="mb-8 lg:hidden">
            <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Contents
            </summary>
            <div className="mt-4">
              <TableOfContents headings={headings} />
            </div>
          </details>
          <div className="prose-signal">
            <MDXRemote
              source={body}
              components={components}
              options={{ mdxOptions: articleMdxOptions }}
            />
          </div>
        </div>
      </div>
      <RelatedArticles slugs={frontmatter.relationships.relatedArticles} />
      <SourceList references={references} />
    </article>
  );
}
