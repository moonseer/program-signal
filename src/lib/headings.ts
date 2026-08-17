export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function slugifyHeading(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) {
    throw new Error("heading text produced an empty id");
  }
  return slug;
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+)$/.exec(trimmed);
    if (!match) continue;
    const text = match[2].replace(/[*_`]/g, "").trim();
    headings.push({
      level: match[1].length === 3 ? 3 : 2,
      text,
      id: slugifyHeading(text),
    });
  }
  return headings;
}
