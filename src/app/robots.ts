import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Soft-launch posture: meta robots remain noindex (see root layout).
 * Allow fetching so Search Console can read the sitemap later; do not treat
 * this as permission to index until noindex is intentionally removed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
