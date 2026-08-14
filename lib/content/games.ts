/**
 * The game roster behind /games and /games/[slug]. Copy is verbatim from
 * design_handoff/reference/Golo Golf - Games.dc.html.
 *
 * `hasDetailPage` is what gives a game its own route — only Nassau is written
 * today, so only Nassau gets one. The rest are full cards on /games, each
 * deep-linkable at /games#<slug>, and get promoted to a route when their
 * long-form copy exists.
 */

import type { IconName } from "@/components/ui/Icon";

export type GameTag = "pots" | "match" | "points" | "side";

export type Game = {
  slug: string;
  icon: IconName;
  name: string;
  desc: string;
  how: string;
  players: string;
  format: string;
  tags: GameTag[];
  popular?: boolean;
  hasDetailPage?: boolean;
};

export const games: Game[] = [
  {
    slug: "skins",
    icon: "target",
    name: "Skins",
    desc: 'Low score wins the hole and the "skin." Tie it and the pot carries to the next — pressure builds fast.',
    how: "Each hole is worth a skin. Outright low score takes it; ties carry the value forward until someone wins clean.",
    players: "2–6 players",
    format: "Hole-by-hole",
    tags: ["pots"],
    popular: true,
  },
  {
    slug: "nassau",
    icon: "trophy",
    name: "Nassau",
    desc: "The classic. Three separate bets in one round — front nine, back nine, and the overall 18.",
    how: "Win the most holes on the front, back, and total. Press a losing bet to double it and claw back on the closing holes.",
    players: "2–4 players",
    format: "3 bets in 1",
    tags: ["match"],
    popular: true,
    hasDetailPage: true,
  },
  {
    slug: "stroke-purse",
    icon: "cash",
    name: "Stroke Purse",
    desc: "Everyone buys into one pot. Lowest net total over 18 walks away with the whole thing.",
    how: "Set the buy-in, play your round, and the lowest net score after handicaps takes the purse. Winner takes all.",
    players: "2+ players",
    format: "Winner takes all",
    tags: ["pots"],
  },
  {
    slug: "wolf",
    icon: "wolf",
    name: "Wolf",
    desc: 'A rotating captain — the "Wolf" — picks a partner off the tee, or goes it alone for double the points.',
    how: "Each hole a new Wolf watches drives, then picks a teammate or declares Lone Wolf to take on the group solo.",
    players: "4 players",
    format: "Rotating captain",
    tags: ["match"],
  },
  {
    slug: "bingo-bango-bongo",
    icon: "dice",
    name: "Bingo Bango Bongo",
    desc: "Three points per hole that reward good golf at every stage, not just the lowest score.",
    how: "A point for first on the green (bingo), closest once all are on (bango), and first in the hole (bongo). Most points wins.",
    players: "2–4 players",
    format: "3 points / hole",
    tags: ["points"],
  },
  {
    slug: "closest-to-pin",
    icon: "pin",
    name: "Closest to Pin",
    desc: "Stick your tee shot tightest on the par 3s and collect the side pot.",
    how: "On each designated par 3, whoever lands closest to the flag and makes par or better takes that hole’s pot.",
    players: "Any group",
    format: "Par 3s only",
    tags: ["side"],
  },
  {
    slug: "longest-drive",
    icon: "drive",
    name: "Longest Drive",
    desc: "Rip it down the fairway on the marked hole. Longest ball in play collects.",
    how: "Pick a hole up front. Longest drive that finishes in the short grass wins — miss the fairway and you’re out.",
    players: "Any group",
    format: "One marked hole",
    tags: ["side"],
  },
  {
    slug: "birdies",
    icon: "bird",
    name: "Birdies",
    desc: "A standing bounty on every birdie — paid out by everyone who didn’t make one.",
    how: "Set a per-birdie amount. Card a birdie and every other player pays you. Eagles usually count double.",
    players: "Any group",
    format: "Per-birdie bounty",
    tags: ["side"],
  },
];

export type GameFilter = { id: "all" | GameTag; label: string };

export const gameFilters: GameFilter[] = [
  { id: "all", label: "All games" },
  { id: "pots", label: "Skins & pots" },
  { id: "match", label: "Match play" },
  { id: "points", label: "Points" },
  { id: "side", label: "Side bets" },
];

/** Slugs with a written detail page — the source for generateStaticParams. */
export const gameDetailSlugs = games
  .filter((game) => game.hasDetailPage)
  .map((game) => game.slug);

export function findGame(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}
