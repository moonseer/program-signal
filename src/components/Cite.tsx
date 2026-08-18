import { citationNumber, referenceAnchorId } from "@/lib/citations";

export function Cite({
  sourceId,
  sourceIds,
}: {
  sourceId: string;
  sourceIds: string[];
}) {
  const number = citationNumber(sourceId, sourceIds);
  if (number === null) {
    throw new Error(`Cite source ${sourceId} is not in this article's references.yml`);
  }
  return (
    <a
      className="cite"
      href={`#${referenceAnchorId(sourceId)}`}
      aria-label={`Source ${number}`}
    >
      [{number}]
    </a>
  );
}
