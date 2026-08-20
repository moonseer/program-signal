import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.join(import.meta.dirname, "..");

function read(relative: string) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

test("article header and body share one grid column", () => {
  const page = read("app/articles/[slug]/page.tsx");
  const headerIndex = page.indexOf("<header>");
  const proseIndex = page.indexOf('className="prose-signal mt-12"');
  const gridIndex = page.indexOf("lg:grid-cols-[12rem_minmax(0,46rem)]");
  assert.ok(gridIndex !== -1, "article uses a TOC + 46rem content grid");
  assert.ok(headerIndex !== -1 && proseIndex !== -1);
  assert.ok(
    headerIndex > gridIndex && proseIndex > headerIndex,
    "title must sit in the same column as At a Glance, not in a separate centered shell",
  );
  assert.equal(page.includes('header className="mx-auto max-w-[46rem]"'), false);
});

test("article tables are real tables, not display:block", () => {
  const css = read("app/globals.css");
  const match = css.match(/\.prose-signal table \{[^}]+\}/);
  assert.ok(match, "expected .prose-signal table rule");
  assert.equal(
    /display:\s*block/.test(match[0]),
    false,
    "display:block on table shrinks At a Glance away from the heading",
  );
  assert.match(css, /\.prose-signal \.table-scroll \{/);
});

test("GFM tables render through a horizontal scroll wrapper", () => {
  const page = read("app/articles/[slug]/page.tsx");
  assert.match(page, /table:\s*\(\{ children \}/);
  assert.match(page, /className="table-scroll"/);
});

test("articles include reading progress, citations, code copy, and the Signal CTA", () => {
  const page = read("app/articles/[slug]/page.tsx");
  assert.match(page, /ReadingProgress/);
  assert.match(page, /Cite:/);
  assert.match(page, /pre: CodeBlock/);
  assert.match(page, /SubscribeCta compact/);
  assert.match(page, /articleJsonLd/);
  assert.match(page, /alternates:\s*\{\s*canonical:/);
});

test("diagram CSS defines a theme-safe node language", () => {
  const css = read("app/globals.css");
  assert.match(css, /\.diagram-frame \.node-focus/);
  assert.match(css, /\.reading-progress/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.prose-signal \.code-block-bar/);
});

test("figures offer expand and SVG download", () => {
  const frame = read("components/DiagramFrame.tsx");
  assert.match(frame, /Expand/);
  assert.match(frame, /Download SVG/);
  assert.match(frame, /showModal/);
});

test("figures surface diagram alt_text for accessibility", () => {
  const figure = read("components/Figure.tsx");
  assert.match(figure, /alt_text/);
  assert.match(figure, /sr-only/);
  assert.match(figure, /diagramMetadataSchema/);
});

test("launch diagram SVGs are UTF-8 and use theme-safe CSS classes", () => {
  const articlesRoot = path.join(root, "..", "content", "articles");
  const svgs = fs
    .readdirSync(articlesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const diagrams = path.join(articlesRoot, entry.name, "diagrams");
      if (!fs.existsSync(diagrams)) return [];
      return fs
        .readdirSync(diagrams)
        .filter((name) => name.endsWith(".svg"))
        .map((name) => path.join(diagrams, name));
    });
  assert.ok(svgs.length >= 6, "expected published diagram SVGs");
  for (const file of svgs) {
    const buf = fs.readFileSync(file);
    assert.doesNotThrow(() => buf.toString("utf8"));
    // No lone Latin-1 middot (0xB7) without UTF-8 lead byte.
    for (let i = 0; i < buf.length; i += 1) {
      if (buf[i] === 0xb7) {
        assert.equal(buf[i - 1], 0xc2, `${file} has a non-UTF-8 middot`);
      }
    }
    const text = buf.toString("utf8");
    assert.match(text, /class="node/, `${file} should use theme-safe node classes`);
    assert.match(text, /aria-labelledby=/, `${file} should expose title/desc`);
  }
});
