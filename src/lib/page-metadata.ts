import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

/** Per-route metadata with an absolute canonical (avoids inheriting `/`). */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Platform Signal",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
