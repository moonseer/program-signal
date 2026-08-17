import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatSequentialId,
  formatSourceId,
  nextSequence,
  nextSourceSequence,
  parseSequentialId,
  parseSourceId,
} from "./ids";

test("formats sequential ids with zero padding", () => {
  assert.equal(formatSequentialId("article", 1), "PS-000001");
  assert.equal(formatSequentialId("opportunity", 15), "PS-O-0015");
  assert.equal(formatSequentialId("diagram", 42), "PS-D-0042");
  assert.equal(formatSequentialId("lab", 1), "LAB-0001");
});

test("parses sequential ids and rejects the wrong prefix", () => {
  assert.equal(parseSequentialId("article", "PS-000001"), 1);
  assert.equal(parseSequentialId("opportunity", "PS-000001"), null);
  assert.equal(parseSequentialId("diagram", "PS-D-42"), null);
});

test("next sequence uses the higher of reserved and max used plus one", () => {
  assert.equal(nextSequence([], 1), 1);
  assert.equal(nextSequence([1], 1), 2);
  assert.equal(nextSequence([1], 16), 16);
  assert.equal(nextSequence([1, 15], 2), 16);
});

test("source ids use a family plus a three-digit suffix", () => {
  assert.equal(formatSourceId("K8S-DRA", 1), "SRC-K8S-DRA-001");
  assert.deepEqual(parseSourceId("SRC-K8S-DRA-001"), {
    family: "K8S-DRA",
    n: 1,
  });
  assert.equal(nextSourceSequence("MCP", [1, 2], 1), 3);
});

test("rejects invalid sequence numbers and source families", () => {
  assert.throws(() => formatSequentialId("article", 0));
  assert.throws(() => nextSequence([1], 0));
  assert.throws(() => formatSourceId("k8s-dra", 1));
  assert.throws(() => formatSourceId("MCP", 1000));
  assert.equal(parseSourceId("SRC-loose"), null);
});
