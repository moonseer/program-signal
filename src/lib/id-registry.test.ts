import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import yaml from "js-yaml";
import {
  allocateSequentialId,
  allocateSourceId,
  scanUsedIds,
  validateIdReferences,
  validateIdRegistry,
  validateIdUniqueness,
} from "./id-registry";

function fixture(tree: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ps-ids-"));
  for (const [relative, contents] of Object.entries(tree)) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
  }
  return root;
}

const registry = yaml.dump({
  next: { article: 2, opportunity: 2, diagram: 1, lab: 1 },
  source_families: {},
});

test("scans article, brief, and opportunity owners without treating refs as collisions", () => {
  const root = fixture({
    "editorial/registry.yml": registry,
    "editorial/opportunities/PS-O-0001.yml": "opportunity_id: PS-O-0001\n",
    "editorial/briefs/PS-000001.yml":
      "article_id: PS-000001\nopportunity_id: PS-O-0001\n",
    "content/articles/harness/index.mdx": `---
id: PS-000001
opportunityId: PS-O-0001
---
`,
  });
  const used = scanUsedIds(root);
  assert.equal(validateIdUniqueness(used).length, 0);
  assert.equal(validateIdReferences(used).length, 0);
  assert.deepEqual(Object.keys(used.articles), ["PS-000001"]);
  assert.deepEqual(Object.keys(used.opportunities), ["PS-O-0001"]);
});

test("allocates the next unused opportunity id and advances the registry", () => {
  const root = fixture({
    "editorial/registry.yml": registry,
    "editorial/opportunities/PS-O-0001.yml": "opportunity_id: PS-O-0001\n",
  });
  const id = allocateSequentialId(root, "opportunity");
  assert.equal(id, "PS-O-0002");
  const updated = yaml.load(
    fs.readFileSync(path.join(root, "editorial/registry.yml"), "utf8"),
  ) as { next: { opportunity: number } };
  assert.equal(updated.next.opportunity, 3);
});

test("skips ahead when the registry has reserved a later id", () => {
  const root = fixture({
    "editorial/registry.yml": yaml.dump({
      next: { article: 2, opportunity: 16, diagram: 1, lab: 1 },
      source_families: {},
    }),
    "editorial/opportunities/PS-O-0001.yml": "opportunity_id: PS-O-0001\n",
  });
  assert.equal(allocateSequentialId(root, "opportunity", { dryRun: true }), "PS-O-0016");
});

test("fails when two opportunity cards share an id", () => {
  const root = fixture({
    "editorial/registry.yml": registry,
    "editorial/opportunities/PS-O-0001.yml": "opportunity_id: PS-O-0001\n",
    "editorial/opportunities/dup.yml": "opportunity_id: PS-O-0001\n",
  });
  const errors = validateIdUniqueness(scanUsedIds(root));
  assert.equal(errors.length, 1);
  assert.match(errors[0], /PS-O-0001/);
});

test("fails when a brief points at a missing opportunity card", () => {
  const root = fixture({
    "editorial/registry.yml": registry,
    "editorial/briefs/PS-000001.yml":
      "article_id: PS-000001\nopportunity_id: PS-O-0009\n",
  });
  const errors = validateIdReferences(scanUsedIds(root));
  assert.equal(errors.length, 1);
  assert.match(errors[0], /PS-O-0009/);
});

test("fails when the registry cursor is behind a used id", () => {
  const root = fixture({
    "editorial/registry.yml": yaml.dump({
      next: { article: 1, opportunity: 1, diagram: 1, lab: 1 },
      source_families: {},
    }),
    "content/articles/harness/index.mdx": `---
id: PS-000001
---
`,
  });
  const errors = validateIdRegistry(root);
  assert.equal(
    errors.some((error) => error.includes("next.article")),
    true,
  );
});

test("allocates source ids per family", () => {
  const root = fixture({
    "editorial/registry.yml": yaml.dump({
      next: { article: 1, opportunity: 1, diagram: 1, lab: 1 },
      source_families: { MCP: 2 },
    }),
    "editorial/sources.yml": yaml.dump({
      sources: [{ source_id: "SRC-MCP-001", title: "MCP spec", tier: 1 }],
    }),
  });
  assert.equal(allocateSourceId(root, "MCP"), "SRC-MCP-002");
  assert.equal(allocateSourceId(root, "K8S-DRA"), "SRC-K8S-DRA-001");
});
