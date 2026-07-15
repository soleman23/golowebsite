import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

/** Generates /robots.txt. Allows all crawlers and points to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
