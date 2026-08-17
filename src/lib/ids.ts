export type SequentialKind = "article" | "opportunity" | "diagram" | "lab";

export const SEQUENTIAL_KINDS: Record<
  SequentialKind,
  { prefix: string; width: number; pattern: RegExp }
> = {
  article: { prefix: "PS-", width: 6, pattern: /^PS-\d{6}$/ },
  opportunity: { prefix: "PS-O-", width: 4, pattern: /^PS-O-\d{4}$/ },
  diagram: { prefix: "PS-D-", width: 4, pattern: /^PS-D-\d{4}$/ },
  lab: { prefix: "LAB-", width: 4, pattern: /^LAB-\d{4}$/ },
};

const SOURCE_FAMILY = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const SOURCE_ID = /^SRC-([A-Z0-9]+(?:-[A-Z0-9]+)*)-(\d{3})$/;

export function formatSequentialId(kind: SequentialKind, n: number): string {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`${kind} sequence must be a positive integer`);
  }
  const spec = SEQUENTIAL_KINDS[kind];
  return `${spec.prefix}${String(n).padStart(spec.width, "0")}`;
}

export function parseSequentialId(
  kind: SequentialKind,
  id: string,
): number | null {
  const spec = SEQUENTIAL_KINDS[kind];
  if (!spec.pattern.test(id)) return null;
  const n = Number(id.slice(spec.prefix.length));
  return Number.isInteger(n) && n >= 1 ? n : null;
}

export function nextSequence(used: number[], reservedNext = 1): number {
  if (!Number.isInteger(reservedNext) || reservedNext < 1) {
    throw new Error("reservedNext must be a positive integer");
  }
  const maxUsed = used.length === 0 ? 0 : Math.max(...used);
  if (maxUsed < 0) {
    throw new Error("used sequence numbers must be non-negative");
  }
  return Math.max(reservedNext, maxUsed + 1);
}

export function formatSourceId(family: string, n: number): string {
  if (!SOURCE_FAMILY.test(family)) {
    throw new Error(
      `source family must be uppercase tokens separated by hyphens (got ${family})`,
    );
  }
  if (!Number.isInteger(n) || n < 1 || n > 999) {
    throw new Error("source sequence must be an integer from 1 to 999");
  }
  return `SRC-${family}-${String(n).padStart(3, "0")}`;
}

export function parseSourceId(
  id: string,
): { family: string; n: number } | null {
  const match = SOURCE_ID.exec(id);
  if (!match) return null;
  return { family: match[1], n: Number(match[2]) };
}

export function nextSourceSequence(
  family: string,
  used: number[],
  reservedNext = 1,
): number {
  if (!SOURCE_FAMILY.test(family)) {
    throw new Error(
      `source family must be uppercase tokens separated by hyphens (got ${family})`,
    );
  }
  return nextSequence(used, reservedNext);
}
