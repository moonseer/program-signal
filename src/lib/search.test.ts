import assert from "node:assert/strict";
import { test } from "node:test";
import { searchArticles, stripMarkdown, type SearchDocument } from "./search";

const corpus: SearchDocument[] = [
  {
    id: "PS-000008",
    slug: "mcp-for-platform-engineers",
    title: "MCP for Platform Engineers",
    description: "MCP is a tool-access protocol.",
    category: "AI Agents",
    contentType: "explainer",
    tags: "mcp platform-engineering",
    text: "Hosts, clients, and servers speak JSON-RPC. Blast radius follows server credentials.",
  },
  {
    id: "PS-000001",
    slug: "what-is-an-ai-agent-harness",
    title: "What Is an AI Agent Harness?",
    description: "The operable layer around a model.",
    category: "AI Agents",
    contentType: "explainer",
    tags: "agent-harness",
    text: "A harness starts runs, enforces policy, and emits traces.",
  },
];

test("MCP query returns the MCP article", () => {
  const hits = searchArticles(corpus, "MCP");
  assert.equal(hits[0]?.slug, "mcp-for-platform-engineers");
});

test("hyphenated query matches JSON-RPC in the body", () => {
  const hits = searchArticles(corpus, "JSON-RPC");
  assert.equal(hits[0]?.slug, "mcp-for-platform-engineers");
});

test("empty or whitespace query returns no hits", () => {
  assert.deepEqual(searchArticles(corpus, ""), []);
  assert.deepEqual(searchArticles(corpus, "   "), []);
});

test("unknown token returns no hits", () => {
  assert.deepEqual(searchArticles(corpus, "xyzzy-not-in-corpus"), []);
});

test("empty corpus returns no hits", () => {
  assert.deepEqual(searchArticles([], "MCP"), []);
});

test("stripMarkdown drops fences and keeps link labels", () => {
  const text = stripMarkdown(
    "## Title\n\nSee [the spec](https://example.com).\n\n```js\nsecret()\n```\n",
  );
  assert.match(text, /the spec/);
  assert.doesNotMatch(text, /secret/);
  assert.doesNotMatch(text, /example.com/);
});
