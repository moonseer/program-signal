import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clustersWithArticles,
  getClusterById,
  getEditorialClusters,
  loadClusterRecords,
  type ClusterRecord,
} from "./clusters";
import type { Article } from "./content";
import { articleFrontmatterSchema } from "./schemas";

function article(id: string, slug: string, title: string): Article {
  return {
    body: "body",
    readingMinutes: 4,
    frontmatter: articleFrontmatterSchema.parse({
      id,
      title,
      slug,
      description: title,
      contentType: "explainer",
      authorPersona: "maya",
      editorialStatus: "published",
      status: "CURRENT",
      editorialPriority: "high",
      category: "AI Agents",
      difficulty: "intermediate",
      research: { editorStatus: "pass", confidence: 80 },
      codeVerification: { status: "unverified" },
    }),
  };
}

const records: ClusterRecord[] = [
  {
    id: "agent-harness",
    name: "AI Agents & Harnesses",
    pillar: "what-is-an-ai-agent-harness",
    articles: ["PS-000001", "PS-000002"],
    opportunities: ["PS-O-0001"],
  },
  {
    id: "k8s-ai",
    name: "Kubernetes + AI Infrastructure",
    articles: [],
    opportunities: ["PS-O-0005"],
  },
];

test("joins published articles onto cluster records", () => {
  const clusters = getEditorialClusters(
    [
      article("PS-000001", "what-is-an-ai-agent-harness", "Harness"),
      article("PS-000002", "anatomy", "Anatomy"),
    ],
    records,
  );
  assert.equal(clusters[0].publishedArticles.length, 2);
  assert.equal(clusters[0].pillarArticle?.frontmatter.id, "PS-000001");
  assert.equal(clusters[1].publishedArticles.length, 0);
});

test("omits empty clusters from homepage sections", () => {
  const clusters = getEditorialClusters(
    [article("PS-000001", "what-is-an-ai-agent-harness", "Harness")],
    records,
  );
  const shown = clustersWithArticles(clusters);
  assert.deepEqual(
    shown.map((cluster) => cluster.id),
    ["agent-harness"],
  );
});

test("unknown cluster id returns undefined", () => {
  assert.equal(
    getClusterById("not-a-cluster", [], records),
    undefined,
  );
});

test("loads launch clusters from editorial/clusters.yml", () => {
  const loaded = loadClusterRecords();
  assert.ok(loaded.some((cluster) => cluster.id === "mcp"));
  assert.ok(loaded.some((cluster) => cluster.id === "agent-harness"));
  const platform = loaded.find((cluster) => cluster.id === "platform-sre");
  assert.ok(platform);
  assert.equal(platform?.pillar, "what-is-agentic-platform-engineering");
  assert.ok(platform?.articles.includes("PS-000010"));
  assert.ok(platform?.articles.includes("PS-000011"));
  const fde = loaded.find((cluster) => cluster.id === "fde");
  assert.ok(fde);
  assert.equal(fde?.pillar, "what-is-a-forward-deployed-engineer");
  assert.ok(fde?.articles.includes("PS-000012"));
});
