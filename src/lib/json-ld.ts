import type { ArticleFrontmatter } from "@/lib/schemas";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    correctionsPolicy: absoluteUrl("/corrections"),
  };
}

export function articleJsonLd(frontmatter: ArticleFrontmatter) {
  const url = absoluteUrl(`/articles/${frontmatter.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.seo?.title ?? frontmatter.title,
    description: frontmatter.seo?.description ?? frontmatter.description,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt ?? frontmatter.publishedAt,
    mainEntityOfPage: url,
    url,
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: "Platform Signal Editorial",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}
