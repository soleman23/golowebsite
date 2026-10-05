import type { Metadata } from "next";
import { defaultOgImage, siteConfig } from "@/lib/siteConfig";

/** Keep search and social previews aligned for each marketing page. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const socialTitle = `${title} · ${siteConfig.name}`;
  return {
    title: path === "/" ? { absolute: socialTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: new URL(path, siteConfig.url).toString(),
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [defaultOgImage],
    },
  };
}
