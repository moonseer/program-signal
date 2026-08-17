import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import {
  REQUIRED_RESEARCH_TYPES,
  articleBriefSchema,
  articleFrontmatterSchema,
  evidenceLedgerSchema,
  opportunityCardSchema,
  sourceLibrarySchema,
} from "../src/lib/schemas";

const root = process.cwd();
let failed = 0;

function error(message: string) {
  failed += 1;
  console.error(`✖ ${message}`);
}

function ok(message: string) {
  console.log(`✔ ${message}`);
}

function readYaml(file: string): unknown {
  return yaml.load(fs.readFileSync(file, "utf8"));
}

function validateArticles() {
  const articlesDir = path.join(root, "content/articles");
  const slugs = fs
    .readdirSync(articlesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const slug of slugs) {
    const file = path.join(articlesDir, slug, "index.mdx");
    if (!fs.existsSync(file)) {
      error(`${slug}: missing index.mdx`);
      continue;
    }
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const result = articleFrontmatterSchema.safeParse({
      ...parsed.data,
      slug: parsed.data.slug ?? slug,
    });
    if (!result.success) {
      error(`${slug}: ${result.error.message}`);
      continue;
    }
    const article = result.data;
    if (
      REQUIRED_RESEARCH_TYPES.includes(article.contentType) &&
      !article.research?.editorStatus
    ) {
      error(`${slug}: ${article.contentType} requires research.editorStatus`);
    }
    if (article.sponsorship.sponsored && !article.sponsorship) {
      error(`${slug}: sponsored content missing disclosure fields`);
    }
    const evidenceFile = path.join(articlesDir, slug, "evidence.yml");
    if (fs.existsSync(evidenceFile)) {
      const ledger = evidenceLedgerSchema.safeParse(readYaml(evidenceFile));
      if (!ledger.success) {
        error(`${slug}/evidence.yml: ${ledger.error.message}`);
      } else {
        ok(`${slug}/evidence.yml`);
      }
    } else if (REQUIRED_RESEARCH_TYPES.includes(article.contentType)) {
      error(`${slug}: ${article.contentType} requires evidence.yml`);
    }
    ok(`${article.id} ${slug}`);
  }
}

function validateYamlDir(
  relativeDir: string,
  parse: (data: unknown, file: string) => void,
) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return;
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"));
  for (const name of files) {
    const file = path.join(dir, name);
    try {
      parse(readYaml(file), file);
      ok(path.relative(root, file));
    } catch (err) {
      error(`${path.relative(root, file)}: ${(err as Error).message}`);
    }
  }
}

validateArticles();

validateYamlDir("editorial/opportunities", (data, file) => {
  const result = opportunityCardSchema.safeParse(data);
  if (!result.success) throw new Error(result.error.message);
  if (path.basename(file) !== `${result.data.opportunity_id}.yml`) {
    throw new Error(`filename must match ${result.data.opportunity_id}.yml`);
  }
});

validateYamlDir("editorial/briefs", (data, file) => {
  const result = articleBriefSchema.safeParse(data);
  if (!result.success) throw new Error(result.error.message);
  if (path.basename(file) !== `${result.data.article_id}.yml`) {
    throw new Error(`filename must match ${result.data.article_id}.yml`);
  }
});

for (const relative of [
  "editorial/calendar.yml",
  "editorial/clusters.yml",
  "editorial/watchlist.yml",
]) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    error(`missing ${relative}`);
    continue;
  }
  try {
    readYaml(file);
    ok(relative);
  } catch (err) {
    error(`${relative}: ${(err as Error).message}`);
  }
}

{
  const relative = "editorial/sources.yml";
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    error(`missing ${relative}`);
  } else {
    const result = sourceLibrarySchema.safeParse(readYaml(file));
    if (!result.success) error(`${relative}: ${result.error.message}`);
    else ok(relative);
  }
}

if (failed > 0) {
  console.error(`\n${failed} validation error(s)`);
  process.exit(1);
}

console.log("\nContent validation passed.");
