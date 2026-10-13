/**
 * Photos behind the /faq, /blog, /games, /features, /how-it-works and /contact
 * heroes.
 * The files are built by scripts/generate-hero-images.mjs into
 * /public/images/heroes; this is what the pages need to know about them.
 *
 * Every photo comes as a 21:9 desktop frame with the subject on the right and
 * the left half dark, and a 4:5 phone frame with the subject in the bottom
 * half and the top dark. PageHero lays the copy over the dark part of each.
 */

export type HeroPhotoKey =
  | "faq"
  | "blog"
  | "games"
  | "features"
  | "how-it-works"
  | "contact";

export type HeroPhoto = {
  /**
   * How much of the 4:5 phone frame, measured up from the bottom, the subject
   * takes. On phones the hero leaves that much room under the copy, so the
   * copy ends where the subject starts instead of sitting on top of it.
   */
  mobileSubject: number;
  /** The share card is a crop of the desktop photo, so this describes it. */
  ogAlt: string;
};

export const heroPhotos: Record<HeroPhotoKey, HeroPhoto> = {
  faq: {
    mobileSubject: 0.55,
    ogAlt: "A pint of beer, golf ball and glove on a clubhouse patio table after the round.",
  },
  blog: {
    mobileSubject: 0.56,
    ogAlt: "A fairway winding through ponderosa pines toward a snow-capped peak at sunset.",
  },
  games: {
    mobileSubject: 0.45,
    ogAlt: "Two golf balls near the flagstick on a putting green at golden hour.",
  },
  features: {
    mobileSubject: 0.54,
    ogAlt: "Leather yardage book, pencil, tees and a phone on a golf cart dashboard at sunrise.",
  },
  "how-it-works": {
    mobileSubject: 0.6,
    ogAlt: "Golf bag and shoes at an open SUV hatch in a course parking lot at dawn.",
  },
  contact: {
    mobileSubject: 0.56,
    ogAlt: "A golf cart parked on a cart path at sunrise on a high-desert course in Central Oregon, a phone and coffee cup on the seat, ponderosa pines and a snow-capped peak behind.",
  },
};

/** The 1200x630 share card for a hero photo, in the shape metadata wants. */
export function heroOgImage(key: HeroPhotoKey) {
  return {
    url: `/images/heroes/${key}-og.jpg`,
    width: 1200,
    height: 630,
    alt: heroPhotos[key].ogAlt,
  };
}
