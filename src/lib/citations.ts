export function citationNumber(
  sourceId: string,
  sourceIds: string[],
): number | null {
  const index = sourceIds.indexOf(sourceId);
  if (index === -1) return null;
  return index + 1;
}

export function referenceAnchorId(sourceId: string): string {
  return `ref-${sourceId}`;
}
