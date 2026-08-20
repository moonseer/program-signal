import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("analytics events and providers are wired", () => {
  const analytics = readFileSync("src/lib/analytics.ts", "utf8");
  for (const name of [
    "copy_code",
    "diagram_expand",
    "diagram_download",
    "source_click",
    "related_article_click",
    "search_used",
    "quick_read_selected",
    "deep_dive_selected",
  ]) {
    assert.match(analytics, new RegExp(`"${name}"`));
  }

  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /@vercel\/analytics\/next/);
  assert.match(layout, /@vercel\/speed-insights\/next/);
  assert.match(layout, /GoogleAnalytics/);
});
