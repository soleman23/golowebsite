/**
 * Public site configuration, read from NEXT_PUBLIC_* env vars with safe
 * fallbacks so the site builds and renders even with nothing configured.
 * Everything here is safe to expose in the browser bundle.
 */

const HERO_BACKDROPS = ["sunset", "course", "turf"] as const;
export type HeroBackdrop = (typeof HERO_BACKDROPS)[number];

function boolFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() !== "false";
}

function heroBackdrop(value: string | undefined): HeroBackdrop {
  return (HERO_BACKDROPS as readonly string[]).includes(value ?? "")
    ? (value as HeroBackdrop)
    : "sunset";
}

export const siteConfig = {
  name: "GoLo",
  tagline: "Bet it. Track it. Settle it.",
  description:
    "GoLo is the golf-betting scorekeeper that runs every side-game, does the handicap math, and settles the group into the fewest payments before you leave the green.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.golo.golf",

  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL || "#get",
  googlePlayUrl: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "#get",

  showStats: boolFlag(process.env.NEXT_PUBLIC_SHOW_STATS, true),
  showTestimonials: boolFlag(process.env.NEXT_PUBLIC_SHOW_TESTIMONIALS, true),
  heroBackdrop: heroBackdrop(process.env.NEXT_PUBLIC_HERO_BACKDROP),
} as const;

/** Maps a hero backdrop key to its original PNG path in /public/images. */
export const heroBackdropSrc: Record<HeroBackdrop, string> = {
  sunset: "/images/sunset.png",
  course: "/images/course.png",
  turf: "/images/turf.png",
};

/**
 * Global class (see app/globals.css) that resolves a backdrop to its
 * AVIF/WebP/PNG image-set at the right size for the viewport. Used instead of
 * an inline background-image so the browser can pick a modern format.
 */
export const heroBackdropClass: Record<HeroBackdrop, string> = {
  sunset: "golo-bd-sunset",
  course: "golo-bd-course",
  turf: "golo-bd-turf",
};

/**
 * Preload descriptors for the hero backdrop — it's the LCP element, so it needs
 * an explicit high-priority preload (a CSS background can't carry fetchpriority
 * on its own).
 *
 * These MUST use the same `media` conditions as the .golo-bd-* rules in
 * globals.css. An imagesrcset/imagesizes preload does NOT work here: srcset
 * picks a candidate by DEVICE pixels (CSS px x DPR) while the stylesheet picks
 * by CSS pixels, so on a 412px @1.75x phone the preload fetched the 960 tier
 * while the page rendered the 640 tier — a wasted download, and the real LCP
 * image wasn't discoverable until the CSS parsed.
 *
 * If you change a breakpoint in globals.css, change it here too.
 */
export type HeroPreloadLink = { href: string; media: string };

const backdropPreload = (name: HeroBackdrop): HeroPreloadLink[] => [
  { href: `/images/${name}-640.avif`, media: "(max-width: 640px)" },
  {
    href: `/images/${name}-960.avif`,
    media: "(min-width: 641px) and (max-width: 960px)",
  },
  { href: `/images/${name}-1600.avif`, media: "(min-width: 961px)" },
];

export const heroBackdropPreload: Record<HeroBackdrop, HeroPreloadLink[]> = {
  sunset: backdropPreload("sunset"),
  course: backdropPreload("course"),
  turf: backdropPreload("turf"),
};
