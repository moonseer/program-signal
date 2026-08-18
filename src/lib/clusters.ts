import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import {
  clustersFileSchema,
} from "@/lib/schemas";
import { getPublishedArticles, type Article } from "@/lib/content";
import type { z } from "zod";

export type ClusterRecord = z.infer<typeof clustersFileSchema>["clusters"][number];

export type EditorialCluster = ClusterRecord & {
  publishedArticles: Article[];
  pillarArticle: Article | null;
};

export function loadClusterRecords(root: string = process.cwd()): ClusterRecord[] {
  const file = path.join(root, "editorial/clusters.yml");
  const parsed = clustersFileSchema.parse(
    yaml.load(fs.readFileSync(file, "utf8")),
  );
  return parsed.clusters;
}

export function getEditorialClusters(
  articles: Article[] = getPublishedArticles(),
  records: ClusterRecord[] = loadClusterRecords(),
): EditorialCluster[] {
  const byId = new Map(
    articles.map((article) => [article.frontmatter.id, article]),
  );
  const bySlug = new Map(
    articles.map((article) => [article.frontmatter.slug, article]),
  );
  return records.map((cluster) => {
    const publishedArticles = cluster.articles
      .map((id) => byId.get(id))
      .filter((article): article is Article => article !== undefined);
    const pillarArticle = cluster.pillar
      ? (bySlug.get(cluster.pillar) ?? null)
      : null;
    return { ...cluster, publishedArticles, pillarArticle };
  });
}

export function getClusterById(
  id: string,
  articles: Article[] = getPublishedArticles(),
  records: ClusterRecord[] = loadClusterRecords(),
): EditorialCluster | undefined {
  return getEditorialClusters(articles, records).find(
    (cluster) => cluster.id === id,
  );
}

export function clustersWithArticles(
  clusters: EditorialCluster[] = getEditorialClusters(),
): EditorialCluster[] {
  return clusters.filter((cluster) => cluster.publishedArticles.length > 0);
}
