import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { pageMetadata } from "./page-metadata";
import { absoluteUrl } from "./site";

test("pageMetadata sets an absolute canonical for the route", () => {
  const meta = pageMetadata({
    title: "Topics",
    description: "Clusters",
    path: "/topics",
  });
  assert.equal(meta.alternates?.canonical, absoluteUrl("/topics"));
  assert.equal(meta.description, "Clusters");
});

test("sitemap and robots routes exist", () => {
  assert.ok(readFileSync("src/app/sitemap.ts", "utf8").includes("getPublishedArticles"));
  const robots = readFileSync("src/app/robots.ts", "utf8");
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /allow:\s*"\/"/);
});

test("layout keeps noindex and offers skip-to-content", () => {
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /index:\s*false/);
  assert.match(layout, /skip-to-content/);
  assert.match(layout, /id="main-content"/);
});
