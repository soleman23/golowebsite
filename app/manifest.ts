/**
 * Web app manifest, served at /manifest.webmanifest. Next.js links it from
 * every page automatically — there's no <link rel="manifest"> to add.
 *
 * Two icon purposes, because Android treats them differently: "any" is drawn
 * as-is and keeps the mark's rounded tile, while "maskable" is cropped to
 * whatever shape the launcher uses, so it ships full-bleed with the artwork
 * pulled inside the safe zone. Ship only one and Android either double-rounds
 * the tile or crops the flag off. Both come out of scripts/generate-icons.mjs.
 *
 * `display: "browser"` is deliberate while the app isn't out: this is a
 * marketing site, and a standalone window that hides the URL bar would dress
 * it up as the app it's advertising.
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    // Matches the themeColor in app/layout.tsx and --bg in globals.css.
    background_color: "#0a0d10",
    theme_color: "#0a0d10",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
