import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { validateIdRegistry } from "../src/lib/id-registry";
import {
  REQUIRED_RESEARCH_TYPES,
  articleBriefSchema,
  articleFrontmatterSchema,
  calendarFileSchema,
  clustersFileSchema,
  diagramMetadataSchema,
  evidenceLedgerSchema,
  opportunityCardSchema,
  publicReferencesFileSchema,
  sourceLibrarySchema,
  sourceTaxonomySchema,
  watchlistFileSchema,
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
    for (const related of article.relationships.relatedArticles) {
      if (!fs.existsSync(path.join(articlesDir, related, "index.mdx"))) {
        error(`${slug}: related article ${related} does not exist`);
      }
    }
    for (const diagramId of article.relationships.diagrams) {
      if (
        !fs.existsSync(
          path.join(articlesDir, slug, "diagrams", `${diagramId}.yml`),
        )
      ) {
        error(`${slug}: diagram ${diagramId} is missing metadata`);
      }
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
    const referencesFile = path.join(articlesDir, slug, "references.yml");
    if (fs.existsSync(referencesFile)) {
      const refs = publicReferencesFileSchema.safeParse(readYaml(referencesFile));
      if (!refs.success) {
        error(`${slug}/references.yml: ${refs.error.message}`);
      } else {
        ok(`${slug}/references.yml`);
      }
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

function walk(dir: string, match: (name: string) => boolean): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, match));
    else if (match(entry.name)) out.push(full);
  }
  return out;
}

for (const file of walk(path.join(root, "content"), (name) => /^PS-D-\d{4}\.yml$/.test(name))) {
  let data: unknown;
  try {
    data = readYaml(file);
  } catch (err) {
    error(`${path.relative(root, file)}: ${(err as Error).message}`);
    continue;
  }
  const result = diagramMetadataSchema.safeParse(data);
  if (!result.success) {
    error(`${path.relative(root, file)}: ${result.error.message}`);
    continue;
  }
  if (path.basename(file) !== `${result.data.id}.yml`) {
    error(`${path.relative(root, file)}: filename must match ${result.data.id}.yml`);
    continue;
  }
  const svg = file.replace(/\.yml$/, ".svg");
  if (!fs.existsSync(svg)) {
    error(`${result.data.id}: missing ${path.relative(root, svg)}`);
    continue;
  }
  if (!result.data.alt_text.trim()) {
    error(`${result.data.id}: alt_text is required`);
    continue;
  }
  ok(path.relative(root, file));
}

{
  const checks: Array<[string, (data: unknown) => { success: boolean; error?: { message: string } }]> = [
    ["editorial/calendar.yml", (data) => calendarFileSchema.safeParse(data)],
    ["editorial/clusters.yml", (data) => clustersFileSchema.safeParse(data)],
    ["editorial/watchlist.yml", (data) => watchlistFileSchema.safeParse(data)],
  ];
  for (const [relative, parse] of checks) {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) {
      error(`missing ${relative}`);
      continue;
    }
    const result = parse(readYaml(file));
    if (!result.success) error(`${relative}: ${result.error?.message}`);
    else ok(relative);
  }
}

{
  const taxonomyFile = path.join(root, "editorial/sources/taxonomy.yml");
  const taxonomy = sourceTaxonomySchema.safeParse(readYaml(taxonomyFile));
  if (!fs.existsSync(taxonomyFile) || !taxonomy.success) {
    error(
      `editorial/sources/taxonomy.yml: ${taxonomy.success === false ? taxonomy.error.message : "missing"}`,
    );
  } else {
    ok("editorial/sources/taxonomy.yml");
  }

  const relative = "editorial/sources.yml";
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    error(`missing ${relative}`);
  } else {
    const result = sourceLibrarySchema.safeParse(readYaml(file));
    if (!result.success) {
      error(`${relative}: ${result.error.message}`);
    } else {
      const collectionIds = new Set(
        taxonomy.success ? taxonomy.data.collections.map((item) => item.id) : [],
      );
      const sourceIds = new Set<string>();
      for (const source of result.data.sources) {
        if (sourceIds.has(source.source_id)) {
          error(`${relative}: duplicate ${source.source_id}`);
        }
        sourceIds.add(source.source_id);
        for (const topic of source.topics) {
          if (taxonomy.success && !collectionIds.has(topic)) {
            error(`${source.source_id}: topic ${topic} is not in the source taxonomy`);
          }
        }
      }
      ok(relative);

      const articlesDir = path.join(root, "content/articles");
      if (fs.existsSync(articlesDir)) {
        for (const slug of fs.readdirSync(articlesDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)) {
          const referencesFile = path.join(articlesDir, slug, "references.yml");
          if (!fs.existsSync(referencesFile)) continue;
          const refs = publicReferencesFileSchema.safeParse(readYaml(referencesFile));
          if (!refs.success) continue;
          for (const entry of refs.data.references) {
            if (!sourceIds.has(entry.source_id)) {
              error(
                `${slug}/references.yml: ${entry.source_id} is not in editorial/sources.yml`,
              );
            }
          }
        }
      }
    }
  }
}

try {
  const idErrors = validateIdRegistry(root);
  if (idErrors.length === 0) {
    ok("editorial/registry.yml");
  } else {
    for (const message of idErrors) error(message);
  }
} catch (err) {
  error((err as Error).message);
}

if (failed > 0) {
  console.error(`\n${failed} validation error(s)`);
  process.exit(1);
}

console.log("\nContent validation passed.");
