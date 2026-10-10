import type { Metadata } from "next";
import { defaultOgImage, siteConfig } from "@/lib/siteConfig";

/**
 * Site-wide social defaults, and only those. The root layout spreads these, so
 * they reach every route — which is why nothing page-specific (a URL, a title,
 * a description) belongs here: a route that doesn't override a field inherits
 * the layout's, and /faq used to share as the home page that way.
 *
 * twitter carries just the card type. With no twitter title, description or
 * image of its own, Next fills them from the page's openGraph, so every page
 * that sets openGraph gets a matching X card without repeating itself.
 */
export const socialDefaults = {
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    images: [defaultOgImage],
  },
  twitter: { card: "summary_large_image" },
} satisfies Pick<Metadata, "openGraph" | "twitter">;

type PageMetadataInput = {
  /** Route path, e.g. "/games". Resolved against metadataBase. */
  path: string;
  /** Search title, without the "· GoLo" suffix. */
  title: string;
  description: string;
  /** Share card for this page. Defaults to the site-wide card. */
  image?: { url: string; width: number; height: number; alt: string };
};

/** Keep search and social previews aligned for each marketing page. */
export function pageMetadata({
  path,
  title,
  description,
  image,
}: PageMetadataInput): Metadata {
  const socialTitle = `${title} · ${siteConfig.name}`;
  return {
    // The root layout's title template only applies to child segments, so
    // "/" — the layout's own segment — spells its suffix out.
    title: path === "/" ? { absolute: socialTitle } : title,
    description,
    alternates: { canonical: path },
    // Declaring openGraph replaces the layout's object rather than merging
    // into it, so the site-wide defaults are spread back in.
    openGraph: {
      ...socialDefaults.openGraph,
      ...(image ? { images: [image] } : null),
      url: path,
      title: socialTitle,
      description,
    },
  };
}
