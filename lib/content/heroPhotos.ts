/**
 * Photos behind the /faq, /blog, /games and /features heroes. The files are
 * built by scripts/generate-hero-images.mjs into /public/images/heroes; this
 * is what the pages need to know about them.
 *
 * Every photo comes as a 21:9 desktop frame with the subject on the right and
 * the left half dark, and a 4:5 phone frame with the subject in the bottom
 * half and the top dark. PageHero lays the copy over the dark part of each.
 */

export type HeroPhotoKey = "faq" | "blog" | "games" | "features";

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
    ogAlt: "A pint, a golf ball, a glove and a pencilled scorecard on a dark bar top.",
  },
  blog: {
    mobileSubject: 0.56,
    ogAlt: "A golf cart parked beside a cart path at dusk, clubs in the back.",
  },
  games: {
    mobileSubject: 0.45,
    ogAlt: "Golf balls around the cup on a putting green at dusk, flagstick in the hole.",
  },
  features: {
    mobileSubject: 0.54,
    ogAlt: "A phone showing a scorecard on a golf cart dash, next to a paper card, a pencil, a ball and tees.",
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
