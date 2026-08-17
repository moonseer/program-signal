import assert from "node:assert/strict";
import { test } from "node:test";
import { extractHeadings, slugifyHeading } from "./headings";

test("extracts h2 and h3 headings in order", () => {
  const headings = extractHeadings(
    "## Why This Matters\n\ntext\n\n### A nested point\n\n## Recommendation\n",
  );
  assert.deepEqual(headings, [
    { id: "why-this-matters", text: "Why This Matters", level: 2 },
    { id: "a-nested-point", text: "A nested point", level: 3 },
    { id: "recommendation", text: "Recommendation", level: 2 },
  ]);
});

test("ignores headings inside fenced code", () => {
  const headings = extractHeadings(
    "```text\n## Not a heading\n```\n\n## Real heading\n",
  );
  assert.equal(headings.length, 1);
  assert.equal(headings[0].id, "real-heading");
});

test("rejects heading text that cannot become an id", () => {
  assert.throws(() => slugifyHeading("***"));
});
