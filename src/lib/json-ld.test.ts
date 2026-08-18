import assert from "node:assert/strict";
import { test } from "node:test";
import { citationNumber, referenceAnchorId } from "./citations";
import { articleJsonLd, organizationJsonLd } from "./json-ld";
import { articleFrontmatterSchema } from "./schemas";
import { absoluteUrl, SITE_URL } from "./site";

test("citation numbers are 1-based in reference order", () => {
  const ids = ["SRC-OTEL-001", "SRC-OTEL-002"];
  assert.equal(citationNumber("SRC-OTEL-001", ids), 1);
  assert.equal(citationNumber("SRC-OTEL-002", ids), 2);
  assert.equal(citationNumber("SRC-MCP-001", ids), null);
});

test("reference anchors are stable per source id", () => {
  assert.equal(referenceAnchorId("SRC-CNCF-001"), "ref-SRC-CNCF-001");
});

test("absolute URLs join the site origin", () => {
  assert.equal(
    absoluteUrl("/articles/observability-for-ai-agents"),
    `${SITE_URL}/articles/observability-for-ai-agents`,
  );
});

test("organization JSON-LD points at the public corrections policy", () => {
  const data = organizationJsonLd();
  assert.equal(data["@type"], "NewsMediaOrganization");
  assert.equal(data.correctionsPolicy, `${SITE_URL}/corrections`);
});

test("article JSON-LD uses an organization author, not a persona", () => {
  const frontmatter = articleFrontmatterSchema.parse({
    id: "PS-000011",
    title: "Observability for AI Agents",
    slug: "observability-for-ai-agents",
    description: "Trace the workflow.",
    contentType: "operator_guide",
    authorPersona: "marcus",
    editorialStatus: "published",
    status: "CURRENT",
    category: "Observability",
    difficulty: "advanced",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    research: { editorStatus: "pass", confidence: 85 },
    codeVerification: { status: "unverified" },
  });
  const data = articleJsonLd(frontmatter);
  assert.equal(data["@type"], "Article");
  assert.equal(data.author["@type"], "Organization");
  assert.equal(data.author.name, "Platform Signal Editorial");
  assert.equal(data.datePublished, "2026-08-18");
});
