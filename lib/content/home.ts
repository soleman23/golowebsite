/**
 * Static marketing content for the home page. Copied verbatim from the design
 * handoff. Keeping it here (not inline in components) keeps copy edits in one
 * place and sections thin.
 *
 * These sections stay on the home page as teasers; the full-page versions live
 * in features.ts, games.ts and faq.ts.
 */

import type { IconName } from "@/components/ui/Icon";
import { mostAskedFaqs, type FaqItem } from "./faq";
import { games, rosterGame, type GameSlug } from "@/lib/content/games";

/**
 * The hero H1. It names what a searcher types — "golf scorecard app", "side
 * games" — and the accent carries the payoff. The brand line ("Score it. Track
 * it. Settle it.", siteConfig.tagline) sits in the pill above it.
 */
export const heroHeading = {
  text: "The golf scorecard app that tracks your side games and",
  accent: "shows who owes whom.",
};

export type Stat = {
  value: string;
  accentValue?: boolean; // render the numeral in the lime accent
  label: string;
  sub: string;
};

export const stats: Stat[] = [
  {
    value: String(games.length),
    accentValue: true,
    label: "games scored automatically",
    sub: "Skins, Nassau, Wolf & more",
  },
  {
    value: "$0",
    label: "of your money goes through GoLo",
    sub: "it does the math; you settle up",
  },
  {
    value: "0",
    label: "arguments about who won 14",
    sub: "the app keeps the receipts",
  },
  {
    value: "100%",
    label: "of debts, remembered",
    sub: "no more “I'll get you next time”",
  },
];

export type FeatureChecklistItem = { lead: string; rest: string };

export type Feature = {
  id: string;
  icon: IconName;
  kicker: string;
  title: string;
  /** Rich lead paragraph as HTML fragments; strong text uses <strong>. */
  bodyHtml: string;
  checklist: FeatureChecklistItem[];
  /** Which side the visual sits on at desktop width. */
  visualSide: "left" | "right";
  visual: "scoring" | "money" | "settle";
};

export const features: Feature[] = [
  {
    id: "immersive-scoring",
    icon: "card",
    kicker: "IMMERSIVE SCORING",
    title: "Tap in scores, not spreadsheets.",
    bodyHtml:
      "One thumb, hole by hole. GoLo applies every player's handicap strokes automatically and tracks net <em>and</em> gross — so the board is always right, even when the games aren't simple.",
    checklist: [
      {
        lead: "Handicap strokes, auto-applied",
        rest: "pop, push or carry, sorted per hole.",
      },
      { lead: "Net & gross at once", rest: "flip the view, the games follow." },
      {
        lead: "Built for a foursome",
        rest: "everyone's scores in one tap-friendly card.",
      },
    ],
    visualSide: "right",
    visual: "scoring",
  },
  {
    id: "live-leaderboard",
    icon: "trophy",
    kicker: "LIVE LEADERBOARD",
    title: "Talk your trash — with receipts.",
    bodyHtml:
      "Everyone sees where they stand while the round's still alive. Flip between Net, Gross and Results. Movement arrows show who's charging and who just dumped one in the water.",
    checklist: [
      { lead: "Net · Gross · Results", rest: "one tap to see every angle." },
      {
        // capabilities.ts live-skins
        lead: "Live skins & carries",
        rest: "watch each carried skin build hole to hole.",
      },
      { lead: "Movement arrows", rest: "proof you made the turn in first." },
    ],
    visualSide: "left",
    visual: "money",
  },
  {
    id: "auto-settle-up",
    icon: "swap",
    kicker: "AUTO SETTLE-UP",
    title: "The math is done before the handshake.",
    bodyHtml:
      "Skins, Nassau, Best Score, closest-to-pin and long drive — all netted into <strong>one short settle-up list</strong>. No daisy-chain of IOUs. Just “you owe him, he owes her,” done.",
    checklist: [
      {
        lead: "One net number per person",
        rest: "every game rolled together.",
      },
      { lead: "Mark settled", rest: "tick it off once your group has settled up outside the app." },
      {
        lead: "Drop it in the group chat",
        rest: "receipts for the whole crew.",
      },
    ],
    visualSide: "right",
    visual: "settle",
  },
];

export const homeGamesSection = {
  kicker: "EVERY GAME YOU ACTUALLY PLAY",
  title: "Stack as many games as your group can argue about.",
  lead: "Run them all in a single round. GoLo scores each one independently, then nets the whole stack into one number per player.",
  seeAll: `Browse all ${games.length} games →`,
};

/**
 * The home page's short game teaser. The descriptions are deliberately its
 * own — the two designs word them differently — but names and icons come
 * from the roster in games.ts.
 */
/** `slug` links each card to its guide, so all eight get a link from the home page. */
export type HomeGame = {
  slug: GameSlug;
  icon: IconName;
  name: string;
  desc: string;
};

/** Each card's own description; the name and icon come from the roster. */
const homeGameDescs: { slug: GameSlug; desc: string }[] = [
  {
    slug: "skins",
    desc: "Low score wins the hole. Ties carry the skin to the next — and the next.",
  },
  {
    slug: "nassau",
    desc: "Three matches in one: front nine, back nine and the overall match.",
  },
  {
    slug: "best-score",
    desc: "Same amount for everyone; the best score takes it, or the top two or three split it.",
  },
  {
    slug: "wolf",
    desc: "Rotating captain picks a partner — or goes Lone Wolf for double.",
  },
  {
    slug: "bingo-bango-bongo",
    desc: "Points for first on, closest once on, and first in the hole.",
  },
  {
    slug: "closest-to-pin",
    desc: "Stick it tight on the par 3s and win the hole.",
  },
  {
    slug: "longest-drive",
    desc: "Bomb it down the fairway on the marked hole to take it.",
  },
  {
    slug: "birdies",
    desc: "A standing bounty on every birdie — paid by everyone who didn't.",
  },
];

export const homeGames: HomeGame[] = homeGameDescs.map(({ slug, desc }) => {
  const { name, icon } = rosterGame(slug);
  return { slug, icon, name, desc };
});

export type Step = { n: string; icon: IconName; title: string; body: string };

export const steps: Step[] = [
  {
    n: "1",
    icon: "card",
    title: "Set the round",
    body: "Pick the course and tees, add your players, then stack every game your group wants to play.",
  },
  {
    n: "2",
    icon: "flame",
    // Corrected from the prototype's stray HTML entity "Play &amp; track".
    title: "Play & track",
    // capabilities.ts live-skins
    body: "Tap in scores hole by hole. The leaderboard updates live — strokes, skins, carries and all.",
  },
  {
    n: "3",
    icon: "swap",
    title: "Settle up",
    body: "GoLo nets every game into one short settle-up list. Everyone knows who to settle with before you leave the green.",
  },
];

export type Quote = {
  text: string;
  name: string;
  role: string;
  initial: string;
  color: string;
};

/**
 * Only real people who agreed in writing to be quoted. The placeholder quotes
 * that shipped here described using an app nobody outside the test group can
 * use yet, which is the kind of testimonial the FTC's review rule prohibits.
 * While this is empty the home page renders no testimonials section at all.
 */
export const quotes: Quote[] = [];

/**
 * The home page's short FAQ: the same six as the "most asked" panel on /faq,
 * pulled from faq.ts rather than restated here. Editing an answer in one place
 * now changes both, and the ids double as the deep-link targets on /faq — so
 * "Read the full FAQ →" lands somewhere the visitor recognises.
 */
export const faqs: FaqItem[] = mostAskedFaqs;
