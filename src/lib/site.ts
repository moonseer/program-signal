/**
 * Canonical public origin for Platform Signal.
 * Production domain: https://platformsignal.dev (www redirects to apex).
 * Override with NEXT_PUBLIC_SITE_URL when needed.
 */
export function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  // Production builds should use the custom domain even if VERCEL_URL is a *.vercel.app host.
  if (process.env.VERCEL_ENV === "production") {
    return "https://platformsignal.dev";
  }

  // Preview / local: prefer the deployment host so OG/canonical match the preview.
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  }

  return "https://platformsignal.dev";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Platform Signal";

export const SITE_DESCRIPTION =
  "A technical publication on production AI, Kubernetes, platform engineering, and agent infrastructure.";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}
