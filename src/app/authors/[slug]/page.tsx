import Link from "next/link";
import { notFound } from "next/navigation";
import { PersonaMark } from "@/components/PersonaMark";
import {
  getPublishedArticles,
  personaNames,
  personaRoles,
  personaSlugs,
  type ArticleFrontmatter,
} from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

const copy: Record<
  ArticleFrontmatter["authorPersona"],
  { slug: string; perspective: string }
> = {
  marcus: {
    slug: "marcus-reed",
    perspective:
      "Marcus writes about what happens after the architecture diagram ends: operating Kubernetes, AI infrastructure, and distributed systems in production.",
  },
  maya: {
    slug: "maya-chen",
    perspective:
      "Maya explains where things belong in a system: agent platforms, control planes, and the infrastructure around models.",
  },
  elias: {
    slug: "elias-voss",
    perspective:
      "Elias filters what changed and whether it actually matters for production engineers.",
  },
  nia: {
    slug: "nia-brooks",
    perspective:
      "Nia starts from the problem: discovery, implementation, adoption, and whether anyone actually needs the platform.",
  },
  founder: {
    slug: "curtis-wilson",
    perspective:
      "The human editor of record. Personal experience, editorial positions, and final publication accountability.",
  },
};

const bySlug: Record<string, ArticleFrontmatter["authorPersona"]> =
  Object.fromEntries(
    (Object.keys(copy) as ArticleFrontmatter["authorPersona"][]).map(
      (persona) => [copy[persona].slug, persona],
    ),
  );

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.values(personaSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const persona = bySlug[slug];
  if (!persona) return { title: "Author" };
  return pageMetadata({
    title: personaNames[persona],
    description: copy[persona].perspective,
    path: `/authors/${slug}`,
  });
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const persona = bySlug[slug];
  if (!persona) notFound();

  const articles = getPublishedArticles().filter(
    (article) => article.frontmatter.authorPersona === persona,
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start gap-4">
        <PersonaMark persona={persona} />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
            {personaRoles[persona]}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
            {personaNames[persona]}
          </h1>
        </div>
      </div>
      <p className="mt-4 text-lg text-[var(--muted)]">{copy[persona].perspective}</p>
      <p className="mt-6 text-sm text-[var(--muted)]">
        Platform Signal uses named editorial personas. They are not presented as
        real-world individuals, except the founder/editor.
      </p>
      <ul className="mt-10 divide-y divide-[var(--border)]">
        {articles.map((article) => (
          <li key={article.frontmatter.id} className="py-4">
            <Link href={`/articles/${article.frontmatter.slug}`} className="hover:text-[var(--accent)]">
              {article.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
