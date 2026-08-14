/**
 * The game roster. Seeded here so /games and the footer's game links resolve;
 * prompt 02 fills in the category, format, player-count and long-form fields.
 *
 * `hasDetail` is what drives /games/[slug] — only Nassau is written today, so
 * only Nassau gets a route. The rest are sections on /games (`/games#wolf`)
 * until their detail content exists, at which point flipping the flag and
 * adding a gameDetail entry promotes one to its own page.
 */

export type GameSummary = {
  slug: string;
  name: string;
  hasDetail: boolean;
};

export const gameRoster: GameSummary[] = [
  { slug: "skins", name: "Skins", hasDetail: false },
  { slug: "nassau", name: "Nassau", hasDetail: true },
  { slug: "stroke-purse", name: "Stroke Purse", hasDetail: false },
  { slug: "wolf", name: "Wolf", hasDetail: false },
  { slug: "bingo-bango-bongo", name: "Bingo Bango Bongo", hasDetail: false },
  { slug: "closest-to-pin", name: "Closest to Pin", hasDetail: false },
  { slug: "longest-drive", name: "Longest Drive", hasDetail: false },
  { slug: "birdies", name: "Birdies", hasDetail: false },
];

/** Slugs with a real detail page — the source for generateStaticParams. */
export const gameDetailSlugs = gameRoster
  .filter((game) => game.hasDetail)
  .map((game) => game.slug);

export function findGame(slug: string): GameSummary | undefined {
  return gameRoster.find((game) => game.slug === slug);
}
