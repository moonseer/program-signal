import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import {
  formatSequentialId,
  formatSourceId,
  nextSequence,
  nextSourceSequence,
  parseSequentialId,
  parseSourceId,
  SEQUENTIAL_KINDS,
  type SequentialKind,
} from "./ids";
import { idRegistrySchema, type IdRegistry } from "./schemas";

export const REGISTRY_RELATIVE = "editorial/registry.yml";

export type UsedIdIndex = Record<string, string[]>;

export type ScannedIds = {
  articles: UsedIdIndex;
  briefs: UsedIdIndex;
  opportunities: UsedIdIndex;
  diagrams: UsedIdIndex;
  labs: UsedIdIndex;
  sources: UsedIdIndex;
  opportunityRefs: UsedIdIndex;
  diagramRefs: UsedIdIndex;
};

function add(index: UsedIdIndex, id: string, file: string) {
  const list = index[id] ?? [];
  list.push(file);
  index[id] = list;
}

function walkFiles(dir: string, match: (name: string) => boolean): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full, match));
    } else if (match(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function rel(root: string, file: string): string {
  return path.relative(root, file);
}

function readYaml(file: string): unknown {
  return yaml.load(fs.readFileSync(file, "utf8"));
}

function uniqueFiles(files: string[]): string[] {
  return [...new Set(files)];
}

function duplicateErrors(kind: string, index: UsedIdIndex): string[] {
  const errors: string[] = [];
  for (const [id, files] of Object.entries(index)) {
    const listed = uniqueFiles(files);
    if (listed.length > 1) {
      errors.push(`${kind} id ${id} is claimed by ${listed.join(", ")}`);
    }
  }
  return errors;
}

function keys(index: UsedIdIndex): string[] {
  return Object.keys(index);
}

function sequencesFrom(
  kind: SequentialKind,
  ...indexes: UsedIdIndex[]
): number[] {
  const seen = new Set<string>();
  const out: number[] = [];
  for (const index of indexes) {
    for (const id of keys(index)) {
      if (seen.has(id)) continue;
      seen.add(id);
      const n = parseSequentialId(kind, id);
      if (n !== null) out.push(n);
    }
  }
  return out;
}

export function emptyScannedIds(): ScannedIds {
  return {
    articles: {},
    briefs: {},
    opportunities: {},
    diagrams: {},
    labs: {},
    sources: {},
    opportunityRefs: {},
    diagramRefs: {},
  };
}

export function loadRegistry(root: string): IdRegistry {
  const file = path.join(root, REGISTRY_RELATIVE);
  if (!fs.existsSync(file)) {
    throw new Error(`missing ${REGISTRY_RELATIVE}`);
  }
  const result = idRegistrySchema.safeParse(readYaml(file));
  if (!result.success) {
    throw new Error(`${REGISTRY_RELATIVE}: ${result.error.message}`);
  }
  return result.data;
}

export function writeRegistry(root: string, registry: IdRegistry) {
  const file = path.join(root, REGISTRY_RELATIVE);
  const body = yaml.dump(registry, { lineWidth: 80, noRefs: true, sortKeys: true });
  fs.writeFileSync(
    file,
    `# Next unused IDs. Allocate with: npm run allocate-id -- <kind>\n${body}`,
  );
}

export function scanUsedIds(root: string): ScannedIds {
  const used = emptyScannedIds();

  for (const file of walkFiles(
    path.join(root, "content/articles"),
    (name) => name === "index.mdx",
  )) {
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const location = rel(root, file);
    if (typeof parsed.data.id === "string") {
      add(used.articles, parsed.data.id, location);
    }
    if (typeof parsed.data.opportunityId === "string") {
      add(used.opportunityRefs, parsed.data.opportunityId, location);
    }
    const diagrams = parsed.data.relationships?.diagrams;
    if (Array.isArray(diagrams)) {
      for (const diagramId of diagrams) {
        if (typeof diagramId === "string") {
          add(used.diagramRefs, diagramId, location);
        }
      }
    }
  }

  for (const file of walkFiles(path.join(root, "content"), (name) =>
    /^PS-D-\d{4}\.yml$/.test(name),
  )) {
    const data = readYaml(file) as { id?: unknown };
    const id = typeof data?.id === "string" ? data.id : path.basename(file, ".yml");
    add(used.diagrams, id, rel(root, file));
  }

  for (const file of walkFiles(
    path.join(root, "content/labs"),
    (name) => name === "index.mdx",
  )) {
    const parsed = matter(fs.readFileSync(file, "utf8"));
    if (typeof parsed.data.id === "string") {
      add(used.labs, parsed.data.id, rel(root, file));
    }
  }

  for (const file of walkFiles(
    path.join(root, "editorial/opportunities"),
    (name) => name.endsWith(".yml") || name.endsWith(".yaml"),
  )) {
    const data = readYaml(file) as { opportunity_id?: unknown };
    const id =
      typeof data?.opportunity_id === "string"
        ? data.opportunity_id
        : path.basename(file).replace(/\.ya?ml$/, "");
    add(used.opportunities, id, rel(root, file));
  }

  for (const file of walkFiles(
    path.join(root, "editorial/briefs"),
    (name) => name.endsWith(".yml") || name.endsWith(".yaml"),
  )) {
    const data = readYaml(file) as {
      article_id?: unknown;
      opportunity_id?: unknown;
    };
    const location = rel(root, file);
    if (typeof data?.article_id === "string") {
      add(used.briefs, data.article_id, location);
    }
    if (typeof data?.opportunity_id === "string") {
      add(used.opportunityRefs, data.opportunity_id, location);
    }
  }

  const sourcesFile = path.join(root, "editorial/sources.yml");
  if (fs.existsSync(sourcesFile)) {
    const data = readYaml(sourcesFile) as {
      sources?: { source_id?: unknown }[];
    };
    for (const source of data?.sources ?? []) {
      if (typeof source?.source_id === "string") {
        add(used.sources, source.source_id, rel(root, sourcesFile));
      }
    }
  }

  return used;
}

export function usedSequences(used: ScannedIds): Record<SequentialKind, number[]> {
  return {
    article: sequencesFrom("article", used.articles, used.briefs),
    opportunity: sequencesFrom("opportunity", used.opportunities, used.opportunityRefs),
    diagram: sequencesFrom("diagram", used.diagrams, used.diagramRefs),
    lab: sequencesFrom("lab", used.labs),
  };
}

export function validateIdUniqueness(used: ScannedIds): string[] {
  return [
    ...duplicateErrors("article", used.articles),
    ...duplicateErrors("brief", used.briefs),
    ...duplicateErrors("opportunity", used.opportunities),
    ...duplicateErrors("diagram", used.diagrams),
    ...duplicateErrors("lab", used.labs),
    ...duplicateErrors("source", used.sources),
  ];
}

export function validateIdFormats(used: ScannedIds): string[] {
  const errors: string[] = [];
  const checks: Array<[string, UsedIdIndex, SequentialKind]> = [
    ["article", used.articles, "article"],
    ["brief", used.briefs, "article"],
    ["opportunity", used.opportunities, "opportunity"],
    ["diagram", used.diagrams, "diagram"],
    ["lab", used.labs, "lab"],
  ];
  for (const [label, index, kind] of checks) {
    for (const id of keys(index)) {
      if (!SEQUENTIAL_KINDS[kind].pattern.test(id)) {
        errors.push(`${label} id ${id} does not match ${SEQUENTIAL_KINDS[kind].pattern}`);
      }
    }
  }
  for (const id of keys(used.sources)) {
    if (!id.startsWith("SRC-")) {
      errors.push(`source id ${id} must start with SRC-`);
    }
  }
  return errors;
}

export function validateIdReferences(used: ScannedIds): string[] {
  const errors: string[] = [];
  for (const [id, files] of Object.entries(used.opportunityRefs)) {
    if (!used.opportunities[id]) {
      errors.push(
        `opportunity ${id} is referenced by ${uniqueFiles(files).join(", ")} but has no opportunity card`,
      );
    }
  }
  for (const [id, files] of Object.entries(used.diagramRefs)) {
    if (!used.diagrams[id]) {
      errors.push(
        `diagram ${id} is referenced by ${uniqueFiles(files).join(", ")} but has no diagram metadata file`,
      );
    }
  }
  return errors;
}

export function validateRegistryCursor(
  registry: IdRegistry,
  used: ScannedIds,
): string[] {
  const errors: string[] = [];
  const seq = usedSequences(used);
  for (const kind of Object.keys(SEQUENTIAL_KINDS) as SequentialKind[]) {
    const maxUsed = seq[kind].reduce((max, n) => Math.max(max, n), 0);
    if (registry.next[kind] <= maxUsed) {
      errors.push(
        `${REGISTRY_RELATIVE}: next.${kind} is ${registry.next[kind]} but ${formatSequentialId(kind, maxUsed)} is already used`,
      );
    }
  }
  const byFamily = new Map<string, number>();
  for (const id of keys(used.sources)) {
    const parsed = parseSourceId(id);
    if (!parsed) continue;
    byFamily.set(parsed.family, Math.max(byFamily.get(parsed.family) ?? 0, parsed.n));
  }
  for (const [family, reserved] of Object.entries(registry.source_families)) {
    const maxUsed = byFamily.get(family) ?? 0;
    if (reserved <= maxUsed) {
      errors.push(
        `${REGISTRY_RELATIVE}: source_families.${family} is ${reserved} but ${formatSourceId(family, maxUsed)} is already used`,
      );
    }
  }
  return errors;
}

export function validateIdRegistry(root: string): string[] {
  const registry = loadRegistry(root);
  const used = scanUsedIds(root);
  return [
    ...validateIdFormats(used),
    ...validateIdUniqueness(used),
    ...validateIdReferences(used),
    ...validateRegistryCursor(registry, used),
  ];
}

export function allocateSequentialId(
  root: string,
  kind: SequentialKind,
  options: { dryRun?: boolean } = {},
): string {
  const registry = loadRegistry(root);
  const used = scanUsedIds(root);
  const n = nextSequence(usedSequences(used)[kind], registry.next[kind]);
  const id = formatSequentialId(kind, n);
  const owners =
    kind === "article"
      ? { ...used.articles, ...used.briefs }
      : kind === "opportunity"
        ? used.opportunities
        : kind === "diagram"
          ? used.diagrams
          : used.labs;
  if (owners[id]) {
    throw new Error(`${kind} id ${id} already exists`);
  }
  registry.next[kind] = n + 1;
  if (!options.dryRun) writeRegistry(root, registry);
  return id;
}

export function allocateSourceId(
  root: string,
  family: string,
  options: { dryRun?: boolean } = {},
): string {
  const registry = loadRegistry(root);
  const used = scanUsedIds(root);
  const familyUsed: number[] = [];
  for (const id of keys(used.sources)) {
    const parsed = parseSourceId(id);
    if (parsed?.family === family) familyUsed.push(parsed.n);
  }
  const n = nextSourceSequence(
    family,
    familyUsed,
    registry.source_families[family] ?? 1,
  );
  const id = formatSourceId(family, n);
  if (used.sources[id]) {
    throw new Error(`source id ${id} already exists`);
  }
  registry.source_families[family] = n + 1;
  if (!options.dryRun) writeRegistry(root, registry);
  return id;
}
