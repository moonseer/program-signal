export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://project-kfwn2.vercel.app";

export const SITE_NAME = "Platform Signal";

export const SITE_DESCRIPTION =
  "A technical publication on production AI, Kubernetes, platform engineering, and agent infrastructure.";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}
