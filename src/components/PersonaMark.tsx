import type { ReactNode } from "react";
import type { ArticleFrontmatter } from "@/lib/schemas";

type Persona = ArticleFrontmatter["authorPersona"];

const titles: Record<Persona, string> = {
  marcus: "Terminal and heartbeat motif for the Operator voice",
  maya: "Grid motif for the Architect voice",
  elias: "Radar motif for the Scout voice",
  nia: "Path and nodes motif for the Field Engineer voice",
  founder: "Editorial mark for the founder and editor",
};

function Svg({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="40"
      height="40"
      aria-hidden="false"
      role="img"
      className="text-[var(--accent)]"
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

export function PersonaMark({ persona }: { persona: Persona }) {
  const title = titles[persona];

  if (persona === "marcus") {
    return (
      <Svg title={title}>
        <path
          d="M8 14h32M8 20h18M8 26h24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 36h8l3-8 4 12 3-8h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </Svg>
    );
  }

  if (persona === "maya") {
    return (
      <Svg title={title}>
        <path
          d="M12 12h24v24H12zM12 20h24M12 28h24M20 12v24M28 12v24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </Svg>
    );
  }

  if (persona === "elias") {
    return (
      <Svg title={title}>
        <circle cx="24" cy="28" r="3" fill="currentColor" />
        <path
          d="M24 28a10 10 0 0 1 10-10M24 28a16 16 0 0 1 16-16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M24 12v4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </Svg>
    );
  }

  if (persona === "nia") {
    return (
      <Svg title={title}>
        <circle cx="10" cy="34" r="2.5" fill="currentColor" />
        <circle cx="22" cy="22" r="2.5" fill="currentColor" />
        <circle cx="38" cy="14" r="2.5" fill="currentColor" />
        <path
          d="M10 34l12-12 16-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </Svg>
    );
  }

  return (
    <Svg title={title}>
      <path
        d="M10 24h28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </Svg>
  );
}
