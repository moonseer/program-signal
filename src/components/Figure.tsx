import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import yaml from "js-yaml";
import { DiagramFrame } from "@/components/DiagramFrame";
import { diagramMetadataSchema } from "@/lib/schemas";

export function Figure({
  slug,
  id,
  caption,
}: {
  slug: string;
  id: string;
  caption: string;
}) {
  const dir = path.join(process.cwd(), "content/articles", slug, "diagrams");
  const svgPath = path.join(dir, `${id}.svg`);
  const metaPath = path.join(dir, `${id}.yml`);
  const svg = fs.readFileSync(svgPath, "utf8");
  const meta = diagramMetadataSchema.parse(
    yaml.load(fs.readFileSync(metaPath, "utf8")),
  );

  return (
    <figure className="figure-breakout my-10">
      <p className="sr-only">{meta.alt_text}</p>
      <DiagramFrame id={id} svg={svg} />
      <figcaption className="mt-3 font-mono text-[12px] leading-5 text-[var(--muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}

export function headingIdFromChildren(children: ReactNode): string {
  const text = flattenText(children).trim();
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function flattenText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return flattenText(props?.children);
  }
  return "";
}
