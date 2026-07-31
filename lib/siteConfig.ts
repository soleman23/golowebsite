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
 * Preload descriptor for the hero backdrop — it's the LCP element, so it needs
 * an explicit high-priority preload (a CSS background can't carry
 * fetchpriority on its own). Widths mirror the image-set tiers in globals.css.
 */
export const heroBackdropPreload: Record<
  HeroBackdrop,
  { srcSet: string; sizes: string; type: string }
> = {
  sunset: {
    srcSet:
      "/images/sunset-640.avif 640w, /images/sunset-960.avif 960w, /images/sunset-1600.avif 1600w",
    sizes: "100vw",
    type: "image/avif",
  },
  course: {
    srcSet:
      "/images/course-640.avif 640w, /images/course-960.avif 960w, /images/course-1600.avif 1600w",
    sizes: "100vw",
    type: "image/avif",
  },
  turf: {
    srcSet:
      "/images/turf-640.avif 640w, /images/turf-960.avif 960w, /images/turf-1600.avif 1600w",
    sizes: "100vw",
    type: "image/avif",
  },
};
