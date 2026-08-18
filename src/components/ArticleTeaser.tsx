import Link from "next/link";
import {
  contentTypeLabels,
  personaNames,
  type ArticleCard,
} from "@/lib/labels";
import { formatDate } from "@/lib/format";

type ArticleTeaserProps = {
  article: ArticleCard;
  heading?: "h2" | "h3";
  dek?: boolean;
};

export function ArticleTeaser({
  article,
  heading = "h3",
  dek = true,
}: ArticleTeaserProps) {
  const Heading = heading;
  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
        {article.category} · {contentTypeLabels[article.contentType]}
      </p>
      <Heading className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-snug tracking-[-0.03em]">
        <Link
          href={`/articles/${article.slug}`}
          className="hover:text-[var(--accent)]"
        >
          {article.title}
        </Link>
      </Heading>
      {dek ? (
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          {article.subtitle ?? article.description}
        </p>
      ) : null}
      <p className="mt-3 font-mono text-[12px] text-[var(--muted)]">
        {personaNames[article.authorPersona]} · {article.readingMinutes} min
        {article.publishedAt ? ` · ${formatDate(article.publishedAt)}` : ""}
      </p>
    </article>
  );
}
