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
 * Custom engagement events go to GA4 only.
 *
 * Vercel Web Analytics on Hobby includes page views (via `<Analytics />`) but
 * custom events are a Pro feature. Do not call Vercel `track()` on Hobby.
 * Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to capture named events.
 */
export function trackEvent(name: AnalyticsEvent, properties?: EventProps) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  try {
    window.gtag("event", name, properties);
  } catch {
    // Analytics must never break the reading experience.
  }
}
