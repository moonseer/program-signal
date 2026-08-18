import assert from "node:assert/strict";
import { test } from "node:test";
import type { Nodes } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { articleMdxOptions } from "./mdx";

function parse(source: string) {
  return unified().use(remarkParse).use(articleMdxOptions.remarkPlugins).parse(source);
}

function containsType(node: Nodes, type: string): boolean {
  if (node.type === type) return true;
  if ("children" in node) {
    return node.children.some((child) => containsType(child, type));
  }
  return false;
}

test("GFM tables compile to table nodes", () => {
  const tree = parse("| Attribute | Value |\n|---|---|\n| Topic | MCP |\n");
  assert.equal(containsType(tree, "table"), true);
});

test("pipes inside a fenced code block do not become a table", () => {
  const tree = parse("```\n| Attribute | Value |\n```\n");
  assert.equal(containsType(tree, "table"), false);
  assert.equal(containsType(tree, "code"), true);
});

test("a pipe line without a delimiter row is not a table", () => {
  const tree = parse("| Attribute | Value |\n");
  assert.equal(containsType(tree, "table"), false);
});
