import {
  allocateSequentialId,
  allocateSourceId,
} from "../src/lib/id-registry";
import { sequentialKindSchema } from "../src/lib/schemas";

const root = process.cwd();
const args = process.argv.slice(2).filter((arg) => arg !== "--");
const dryRun = args.includes("--dry-run");
const positional = args.filter((arg) => arg !== "--dry-run");
const kind = positional[0];

if (!kind) {
  console.error(
    "Usage: npm run allocate-id -- <article|opportunity|diagram|lab|source> [FAMILY] [--dry-run]",
  );
  process.exit(1);
}

try {
  if (kind === "source") {
    const family = positional[1];
    if (!family) {
      throw new Error("source allocation requires a FAMILY token, e.g. K8S-DRA");
    }
    const id = allocateSourceId(root, family.toUpperCase(), { dryRun });
    console.log(id);
  } else {
    const parsed = sequentialKindSchema.safeParse(kind);
    if (!parsed.success) {
      throw new Error(`unknown kind ${kind}`);
    }
    const id = allocateSequentialId(root, parsed.data, { dryRun });
    console.log(id);
  }
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
