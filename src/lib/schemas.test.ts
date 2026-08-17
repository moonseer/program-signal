import assert from "node:assert/strict";
import { test } from "node:test";
import { evidenceLedgerSchema } from "./schemas";

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
