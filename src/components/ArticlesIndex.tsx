"use client";

import { useMemo, useState } from "react";
import { ArticleTeaser } from "@/components/ArticleTeaser";
import {
  contentTypeLabels,
  personaNames,
  type ArticleCard,
} from "@/lib/labels";

type FilterValue = "all" | string;

type ClusterOption = {
  id: string;
  name: string;
  articleIds: string[];
};

export function ArticlesIndex({
  articles,
  clusters,
}: {
  articles: ArticleCard[];
  clusters: ClusterOption[];
}) {
  const [persona, setPersona] = useState<FilterValue>("all");
  const [contentType, setContentType] = useState<FilterValue>("all");
  const [difficulty, setDifficulty] = useState<FilterValue>("all");
  const [topic, setTopic] = useState<FilterValue>("all");

  const filtered = useMemo(
    () =>
      articles.filter((article) => {
        if (persona !== "all" && article.authorPersona !== persona) return false;
        if (contentType !== "all" && article.contentType !== contentType) return false;
        if (difficulty !== "all" && article.difficulty !== difficulty) return false;
        if (topic !== "all") {
          const cluster = clusters.find((item) => item.id === topic);
          if (!cluster?.articleIds.includes(article.id)) return false;
        }
        return true;
      }),
    [articles, clusters, persona, contentType, difficulty, topic],
  );

  const personas = [...new Set(articles.map((article) => article.authorPersona))];
  const types = [...new Set(articles.map((article) => article.contentType))];
  const difficulties = [...new Set(articles.map((article) => article.difficulty))];

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-4 font-mono text-[12px]">
        <label className="flex items-center gap-2">
          Topic
          <select
            className="min-h-11 border border-[var(--border)] bg-[var(--card)] px-2"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          >
            <option value="all">All</option>
            {clusters.map((cluster) => (
              <option key={cluster.id} value={cluster.id}>
                {cluster.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Persona
          <select
            className="min-h-11 border border-[var(--border)] bg-[var(--card)] px-2"
            value={persona}
            onChange={(event) => setPersona(event.target.value)}
          >
            <option value="all">All</option>
            {personas.map((value) => (
              <option key={value} value={value}>
                {personaNames[value]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Type
          <select
            className="min-h-11 border border-[var(--border)] bg-[var(--card)] px-2"
            value={contentType}
            onChange={(event) => setContentType(event.target.value)}
          >
            <option value="all">All</option>
            {types.map((value) => (
              <option key={value} value={value}>
                {contentTypeLabels[value]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Difficulty
          <select
            className="min-h-11 border border-[var(--border)] bg-[var(--card)] px-2"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          >
            <option value="all">All</option>
            {difficulties.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
      {filtered.length === 0 ? (
        <p className="mt-10 text-[var(--muted)]">No articles match those filters.</p>
      ) : (
        <ul className="mt-10 divide-y divide-[var(--border)]">
          {filtered.map((article) => (
            <li key={article.id} className="py-6">
              <ArticleTeaser article={article} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
