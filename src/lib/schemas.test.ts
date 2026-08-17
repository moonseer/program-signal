import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clustersFileSchema,
  evidenceLedgerSchema,
  idRegistrySchema,
} from "./schemas";

test("accepts a verified claim with a tier-1 source", () => {
  const result = evidenceLedgerSchema.safeParse({
    article: "what-is-an-ai-agent-harness",
    reviewed: "2026-08-17",
    claims: [
      {
        id: "C001",
        claim: "MCP is a tool-access protocol, not an agent architecture.",
        type: "FACT",
        status: "VERIFIED",
        confidence: "HIGH",
        sources: [
          {
            title: "MCP specification",
            org: "Anthropic",
            url: "https://modelcontextprotocol.io",
            tier: 1,
          },
        ],
      },
    ],
  });
  assert.equal(result.success, true);
});

test("allows an empty claims list for a fixture still pending review", () => {
  const result = evidenceLedgerSchema.safeParse({
    article: "what-is-an-ai-agent-harness",
    claims: [],
  });
  assert.equal(result.success, true);
});

test("rejects an invalid claim id and status", () => {
  const result = evidenceLedgerSchema.safeParse({
    article: "bad",
    claims: [
      {
        id: "claim-1",
        claim: "unsupported",
        type: "FACT",
        status: "TRUE",
        confidence: "HIGH",
        sources: [],
      },
    ],
  });
  assert.equal(result.success, false);
});

test("accepts a launch cluster file with mixed published and planned ids", () => {
  const result = clustersFileSchema.safeParse({
    clusters: [
      {
        id: "agent-harness",
        name: "AI Agents & Harnesses",
        pillar: "what-is-an-ai-agent-harness",
        pillar_opportunity: "PS-O-0001",
        articles: ["PS-000001"],
        opportunities: ["PS-O-0001", "PS-O-0002"],
      },
    ],
  });
  assert.equal(result.success, true);
});

test("defaults missing article lists on a cluster", () => {
  const result = clustersFileSchema.safeParse({
    clusters: [{ id: "mcp", name: "MCP" }],
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.data.clusters[0].articles, []);
  }
});

test("rejects a cluster article id that is not PS-NNNNNN", () => {
  const result = clustersFileSchema.safeParse({
    clusters: [
      {
        id: "mcp",
        name: "MCP",
        articles: ["PS-O-0008"],
      },
    ],
  });
  assert.equal(result.success, false);
});

test("accepts a registry cursor and rejects a zero next value", () => {
  const ok = idRegistrySchema.safeParse({
    next: { article: 2, opportunity: 16, diagram: 1, lab: 1 },
    source_families: {},
  });
  assert.equal(ok.success, true);
  const bad = idRegistrySchema.safeParse({
    next: { article: 0, opportunity: 1, diagram: 1, lab: 1 },
  });
  assert.equal(bad.success, false);
});
