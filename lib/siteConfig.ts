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

const INSTAGRAM_URL = "https://www.instagram.com/gologolfapp/";

export const siteConfig = {
  name: "GoLo",
  /** The full brand, for structured data and anywhere "GoLo" alone is ambiguous. */
  brandName: "GoLo Golf",
  tagline: "Score it. Track it. Settle it.",
  description:
    // The app's own side-game vocabulary (golowebsite#117): GoLo shows who
    // owes whom; the group settles up outside the app.
    "GoLo is the golf scorekeeper for your group's side games: it runs every game, does the handicap math, and shows who owes whom in one short settle-up list.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.golo.golf",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID || "G-36182P0H4D",
  /**
   * Microsoft Clarity (session recordings and heatmaps) is off: its terms let
   * Microsoft use the data for any purpose in its privacy statement,
   * including advertising profiles, and no Clarity setting limits that. The
   * project ("GoLo Golf Website", z0fu5ddehq) still exists.
   *
   * Deliberately not read from NEXT_PUBLIC_CLARITY_ID: env files made from the
   * earlier .env.example set it to the project ID, and honoring that would
   * keep recording while the policies say Clarity is gone. Bringing Clarity
   * back is a code change here, made together with restored disclosures in
   * lib/content/legal.ts and the consent copy.
   */
  clarityProjectId: "",
  analyticsEnabled: boolFlag(
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
    false,
  ),

  /** The one public address. Also the contact of record in /privacy. */
  supportEmail: "info@golo.golf",

  instagramHandle: "@gologolfapp",
  instagramUrl: INSTAGRAM_URL,
  /** The footer's social row (socialLinks in lib/content/nav.ts) lists these. */
  facebookUrl: "https://www.facebook.com/gologolfapp",
  youtubeUrl: "https://www.youtube.com/@gologolfapp",
  tiktokUrl: "https://www.tiktok.com/@gologolfapp",

  /**
   * The company's own profiles, for the Organization's `sameAs`. Only live,
   * official profiles — docs/entity.md lists the candidates. Store listings
   * aren't company profiles; they describe the app, and its structured data
   * picks them up from the store URLs below at launch.
   */
  sameAs: [INSTAGRAM_URL],

  /**
   * Mailing address of record. /privacy §14 holds the authoritative copy —
   * that text is legal and stays verbatim, so this is a second rendering of
   * the same facts rather than its source. Change both together.
   */
  legalName: "GoLo Golf LLC",
  address: {
    street: "21196 Anne Lane",
    city: "Bend",
    region: "Oregon",
    postalCode: "97702",
    country: "United States",
  },
  /** Owner-confirmed 2026-10-15 (soleman23/golowebsite#71). */
  foundingYear: "2026",
  founder: { name: "Devin Sole", title: "Founder & developer" },

  /** One-line form for chips and cards: "GoLo Golf LLC · Bend, Oregon". */
  addressShort: "GoLo Golf LLC · Bend, Oregon",

  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL || "#get",
  googlePlayUrl: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "#get",

  showStats: boolFlag(process.env.NEXT_PUBLIC_SHOW_STATS, true),
  /**
   * Off unless real, consented quotes exist. The sections also stay hidden
   * while their quote lists (lib/content) are empty, whatever this says.
   */
  showTestimonials: boolFlag(process.env.NEXT_PUBLIC_SHOW_TESTIMONIALS, false),

  /**
   * Is the app actually downloadable? While false the site holds the honest
   * beta line: store buttons give way to the phone capture, the "in beta"
   * status shows, and "free while we're in beta" is true. Flip this (and set
   * the store URLs) on launch day and every page changes together.
   */
  appLive: boolFlag(process.env.NEXT_PUBLIC_APP_LIVE, false),

  /** Legal publication switches control indexing, navigation, and sitemap. */
  termsPublished: boolFlag(process.env.NEXT_PUBLIC_TERMS_PUBLISHED, false),
  acceptableUsePublished: boolFlag(
    process.env.NEXT_PUBLIC_ACCEPTABLE_USE_PUBLISHED,
    false,
  ),

  /**
   * The /how-it-works video: the #watch section and the hero's "Watch it"
   * CTA. Off until a real recording (and its captions) is in public/videos/.
   */
  showHowItWorksVideo: boolFlag(process.env.NEXT_PUBLIC_SHOW_HIW_VIDEO, false),

  heroBackdrop: heroBackdrop(process.env.NEXT_PUBLIC_HERO_BACKDROP),
} as const;

/**
 * The brand mark as an ImageObject, for `Organization.logo` and every blog
 * post's `publisher.logo`. Both sites of use want the identical object, so it
 * is built once here.
 *
 * It has to be a raster: Google's structured-data spec doesn't read SVG in a
 * logo field, so pointing this at /icon.svg (as it used to) left the logo
 * silently absent from rich results. The PNG comes out of
 * scripts/generate-icons.mjs — regenerate it there, don't hand-edit.
 */
export const organizationLogo = {
  "@type": "ImageObject",
  url: `${siteConfig.url}/images/brand/golo-logo-600.png`,
  width: 600,
  height: 600,
} as const;

/**
 * The default social share card, rendered from scripts/og-image.html.
 *
 * Deliberately a plain file in /public referenced from metadata, rather than
 * Next's app/opengraph-image.png convention. The convention emits the image but
 * silently drops og:image:alt — its sibling .alt.txt produces nothing on Next
 * 15.5 — and it also takes precedence over metadata, so the alt could not be
 * supplied any other way. Screen readers on X and Facebook read that attribute.
 *
 * Because it is ordinary metadata it is inherited, and a route that declares
 * its own `openGraph` replaces the inherited object wholesale, images included.
 * /blog/[slug] and /games/[slug] therefore name this explicitly, and any new
 * route that sets `openGraph` must do the same or it ships with no card.
 */
export const defaultOgImage = {
  url: "/images/brand/og-card.png",
  width: 1200,
  height: 630,
  alt: "GoLo — Score it. Track it. Settle it.",
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
