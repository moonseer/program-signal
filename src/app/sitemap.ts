import type { MetadataRoute } from "next";
import { getEditorialClusters } from "@/lib/clusters";
import { getPublishedArticles, personaSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const staticPaths = [
  "/",
  "/articles",
  "/topics",
  "/labs",
  "/field-notes",
  "/about",
  "/editorial-standards",
  "/ai-and-editorial-process",
  "/corrections",
  "/sponsorship-policy",
  "/vendor-interaction-policy",
  "/responsible-disclosure",
  "/content-rights-policy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const clusters = getEditorialClusters(articles);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/articles" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/articles" ? 0.9 : 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.frontmatter.slug}`,
    lastModified: new Date(
      article.frontmatter.updatedAt ??
        article.frontmatter.publishedAt ??
        now.toISOString(),
    ),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const topicEntries: MetadataRoute.Sitemap = clusters.map((cluster) => ({
    url: `${SITE_URL}/topics/${cluster.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const authorEntries: MetadataRoute.Sitemap = Object.values(personaSlugs).map(
    (slug) => ({
      url: `${SITE_URL}/authors/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }),
  );

  return [...staticEntries, ...articleEntries, ...topicEntries, ...authorEntries];
}
