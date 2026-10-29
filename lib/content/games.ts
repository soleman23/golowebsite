/**
 * The game roster behind /games and /games/[slug]. Copy is verbatim from
 * design_handoff/reference/Golo Golf - Games.dc.html, except `rule`, the
 * one-liners from the How It Works reference's game guide cards.
 *
 * Every roster entry has a long-form route. The tuple below is the canonical
 * inventory for cards, detail records, related links, navigation, and sitemap
 * generation, so a misspelled or missing game slug fails TypeScript.
 *
 * A game's name, icon and one-line rule are written here and nowhere else as
 * data: the guides (gameDetail.ts), the home page cards, the /how-it-works
 * guide cards and the mockups read them through rosterGame(). Prose that names
 * a game in a sentence (guide copy, the FAQ, the blog) still says it in words,
 * so a rename means a search through lib/content as well.
 */

import type { IconName } from "@/components/ui/Icon";

export type GameTag = "pots" | "match" | "points" | "teams" | "side";

export const GAME_SLUGS = [
  "skins",
  "nassau",
  "best-score",
  "wolf",
  "bingo-bango-bongo",
  "scramble",
  "closest-to-pin",
  "longest-drive",
  "birdies",
] as const;

export type GameSlug = (typeof GAME_SLUGS)[number];

export type Game = {
  slug: GameSlug;
  icon: IconName;
  name: string;
  /** The one-line rule: the /how-it-works guide cards and the game-library mockup. */
  rule: string;
  desc: string;
  how: string;
  players: string;
  format: string;
  tags: GameTag[];
  popular?: boolean;
};

/**
 * Keyed by slug, so a game missing from the roster (or one that isn't in
 * GAME_SLUGS) fails typecheck.
 */
const roster = {
  skins: {
    icon: "target",
    name: "Skins",
    rule: "Win the hole outright, win the skin. Ties carry.",
    desc: 'Low score wins the hole and the "skin." Tie it and the skin carries to the next — pressure builds fast.',
    how: "Each hole is worth a skin. Outright low score takes it; ties carry the value forward until someone wins clean.",
    players: "2–6 players",
    format: "Hole-by-hole",
    tags: ["pots"],
    popular: true,
  },
  nassau: {
    icon: "trophy",
    name: "Nassau",
    rule: "Front, back, total — three matches in one.",
    desc: "The classic. Three separate matches in one round — front nine, back nine, and the overall 18.",
    how: "Win the most holes on the front, back, and total. Three matches, settled as one number.",
    players: "2–4 players",
    format: "3 matches in 1",
    tags: ["match"],
    popular: true,
  },
  "best-score": {
    icon: "cash",
    name: "Best Score",
    rule: "Net or gross: the best score takes it.",
    desc: "Everyone puts in the same amount. The best net or gross score takes it, or the top two or three split it, as set at the first tee.",
    how: "Set the amount, play your round, and the best score takes it, or the top two or three split it evenly.",
    players: "2+ players",
    format: "One total",
    tags: ["pots"],
  },
  wolf: {
    icon: "wolf",
    name: "Wolf",
    rule: "Rotation, partners, lone-wolf multiplier.",
    desc: 'A rotating captain — the "Wolf" — picks a partner off the tee, or goes it alone for double the points.',
    how: "Each hole a new Wolf watches drives, then picks a teammate or declares Lone Wolf to take on the group solo.",
    players: "4 players",
    format: "Rotating captain",
    tags: ["match"],
  },
  "bingo-bango-bongo": {
    icon: "dice",
    name: "Bingo Bango Bongo",
    rule: "Three points a hole, no strokes needed.",
    desc: "Three points per hole that reward good golf at every stage, not just the lowest score.",
    how: "A point for first on the green (bingo), closest once all are on (bango), and first in the hole (bongo). Most points wins.",
    players: "2–4 players",
    format: "3 points / hole",
    tags: ["points"],
  },
  scramble: {
    icon: "team",
    name: "Scramble",
    rule: "Teams of up to four, one ball, one team handicap.",
    desc: "Everyone hits and the team plays its best shot. GoLo works out each team’s handicap and runs Skins, Nassau and Best Score team against team.",
    how: "Split up to 12 players into 2 to 6 teams. Everyone hits, the team picks the best ball, and all play the next shot from there.",
    players: "2–12 players",
    format: "Teams of 1–4",
    tags: ["teams"],
  },
  "closest-to-pin": {
    icon: "pin",
    name: "Closest to Pin",
    rule: "The par-3 side game, settled on the green.",
    desc: "Stick your tee shot tightest on the marked par 3s and win the hole.",
    how: "On each marked par 3, whoever lands closest to the flag wins the hole. Playing it as a greenie, with par or better to win, is the group’s call.",
    players: "Any group",
    format: "Par 3s only",
    tags: ["side"],
  },
  "longest-drive": {
    icon: "drive",
    name: "Longest Drive",
    rule: "One fairway, one bomb, one winner.",
    desc: "Rip it down the fairway on the marked hole. Longest ball in play takes it.",
    how: "Pick a hole up front. Longest drive that finishes in the short grass wins — miss the fairway and you’re out.",
    players: "Any group",
    format: "One marked hole",
    tags: ["side"],
  },
  birdies: {
    icon: "bird",
    name: "Birdies",
    rule: "Every birdie on the card counts.",
    desc: "A standing bounty on every birdie — owed by everyone who didn’t make one.",
    how: "Set a per-birdie amount. Card a birdie and every other player owes you. Eagles usually count double.",
    players: "Any group",
    format: "Per-birdie bounty",
    tags: ["side"],
  },
} satisfies Record<GameSlug, Omit<Game, "slug">>;

/** In GAME_SLUGS order. */
export const games: Game[] = GAME_SLUGS.map((slug) => ({ slug, ...roster[slug] }));

export type GameFilter = { id: "all" | GameTag; label: string };

export const gameFilters: GameFilter[] = [
  { id: "all", label: "All games" },
  { id: "pots", label: "Skins & Best Score" },
  { id: "match", label: "Match play" },
  { id: "points", label: "Points" },
  { id: "teams", label: "Team formats" },
  { id: "side", label: "Side games" },
];

/** The /games hero. The H1 names the topic; the lead keeps the voice. */
export const gamesHero = {
  kicker: "EVERY GAME, SCORED AUTOMATICALLY",
  title: "Golf side games:",
  titleAccentLine: "Rules, scoring, and settling up.",
  lead: "Skins, Nassau, Wolf, Best Score, the birdie skin your buddy always forgets to settle — GoLo runs every one, stacks them in a single round, and nets it all into one number per player. Browse the whole roster below.",
};

/**
 * The /games closing band. The band's own download row sits under it: Google
 * Play, and the web app for iPhone until the App Store app is out.
 */
export const gamesFinalCta = {
  title: "Stack 'em all. Settle in seconds.",
  lead: "Set up every game before the first tee and let GoLo keep score. Download it, and never do parking-lot math again.",
};

export function isGameSlug(slug: string): slug is GameSlug {
  return (GAME_SLUGS as readonly string[]).includes(slug);
}

export function findGame(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

/** The roster entry for a slug. Every slug has one; the roster's type sees to it. */
export function rosterGame(slug: GameSlug): Game {
  return games[GAME_SLUGS.indexOf(slug)];
}
