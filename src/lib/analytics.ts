import { track } from "@vercel/analytics";

/** Named events from E24. Prefer these over ad-hoc strings. */
export type AnalyticsEvent =
  | "newsletter_signup"
  | "newsletter_cta_click"
  | "copy_code"
  | "diagram_expand"
  | "diagram_download"
  | "source_click"
  | "related_article_click"
  | "search_used"
  | "quick_read_selected"
  | "deep_dive_selected";

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Dual-write to Vercel Analytics (always when the package is loaded) and GA4
 * when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured and gtag is present.
 */
export function trackEvent(name: AnalyticsEvent, properties?: EventProps) {
  try {
    track(name, properties);
  } catch {
    // Analytics must never break the reading experience.
  }

  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  try {
    window.gtag("event", name, properties);
  } catch {
    // ignore
  }
}
