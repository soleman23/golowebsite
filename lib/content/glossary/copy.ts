/**
 * The /glossary hub's own copy: hero, labels, the Start here list and the
 * related-guides cards (docs/glossary/ux.md). Term records are in ./terms.
 *
 * Unlike the term records, this file is checked by the full claim guard: it
 * speaks for GoLo, not about golf.
 */

import { findPost } from "../blog";
import { isGameSlug, rosterGame } from "../games";
import type { CtaIntent, NoteKind } from "./types";

/** The DefinedTermSet's name (#163). Title and description are in the page's
 * pageMetadata call, where the content check reads them. */
export const glossarySchemaName = "GoLo Golf Glossary";

/** The H1 is spec §5.2's: "Golf Glossary: Terms, Slang & Games Explained". */
export const glossaryHero = {
  kicker: "KNOW THE GAME. TALK THE TALK.",
  title: "Golf Glossary:",
  titleAccentLine: "Terms, Slang & Games Explained",
  lead: "From birdies and bogeys to skins, presses and sandbaggers. Golf's terminology explained without the clubhouse lecture.",
};

/**
 * Curated starting points, one or two per intent tier. Never labelled
 * popular or most searched: nothing has measured that. Ids that aren't in
 * the hub's selection are skipped.
 */
export const glossaryStartHere = {
  title: "Start here",
  ids: ["press", "skins", "net-score", "stroke-index", "handicap-index", "mulligan"],
};

export const glossaryDirectoryCopy = {
  title: "Browse A–Z",
  alphabetLabel: "Glossary, A to Z",
  backToTop: "Back to A–Z",
  related: "Related",
  example: "Example",
  golo: "In GoLo",
  reviewed: "Reviewed",
  /** Shown on an approved term in local review (`next dev`) only. */
  unpublished: "Not published",
  /** `next dev` with no approved or published terms. */
  empty: "No terms are approved yet. Drafts don't show here, even locally.",
  reviewBanner:
    "Local review. Terms marked Not published are approved but not live; production shows published terms only.",
};

/** The label a rule or house-rule note shows under. */
export const glossaryNoteLabels: Record<NoteKind, string> = {
  rules: "Rules of Golf",
  handicapping: "Handicapping",
  convention: "Common practice",
  "house-rules": "House rules",
};

export const glossaryRelatedGuides = {
  title: "KEEP READING",
  items: [
    {
      label: "The games",
      blurb: "Skins, Nassau, Wolf, Best Score and the rest: how each one is played and scored.",
      cta: "BROWSE THE GAMES",
      href: "/games",
    },
    {
      label: "Blog",
      blurb: "Pressing etiquette, carryover math, handicaps and settling up, worked through with real numbers.",
      cta: "READ THE BLOG",
      href: "/blog",
    },
    {
      label: "How it works",
      blurb: "A round in GoLo from first tee to settle-up, one screen at a time.",
      cta: "SEE A ROUND",
      href: "/how-it-works",
    },
  ],
};

/**
 * Link text for a guide, post or page a term points to: descriptive, never
 * "read more". A post's title up to its colon keeps it short.
 */
export function glossaryPathLink(path: string): string {
  const game = /^\/games\/([a-z0-9-]+)$/.exec(path)?.[1];
  if (game && isGameSlug(game)) return `Read the ${rosterGame(game).name} guide`;
  const slug = /^\/blog\/([a-z0-9-]+)$/.exec(path)?.[1];
  const post = slug ? findPost(slug) : undefined;
  if (post) return `Read “${post.title.split(":")[0].trim()}”`;
  return PAGE_LINKS[path] ?? `Open ${path}`;
}

/**
 * The product link a term's `ctaIntent` adds under its guide links (#164,
 * spec §9.2). Each label is a claim the registry backs: game-library,
 * handicap-strokes and settle-up are live. "download" and "none" add
 * nothing here; the closing band has the store buttons.
 */
export const glossaryIntentLinks: Record<
  Exclude<CtaIntent, "download" | "none">,
  { label: string; href: string }
> = {
  games: { label: "Browse the games GoLo scores", href: "/games" },
  handicaps: { label: "See how GoLo places handicap strokes", href: "/features" },
  "settle-up": { label: "See a round in GoLo, first tee to settle-up", href: "/how-it-works" },
};

/** The hub's closing band. The store buttons and fine print are FinalCTA's. */
export const glossaryFinalCta = {
  title: "Know the terms. Let GoLo keep the score.",
};

const PAGE_LINKS: Record<string, string> = {
  "/faq": "Read the FAQ",
  "/games": "Browse the games",
  "/how-it-works": "See how a round works",
  "/features": "See what GoLo does today",
};

/** Search, filter and copy-link wording (docs/glossary/ux.md § Flows). */
export const glossaryControlsCopy = {
  searchLabel: "Search the glossary",
  /** {n} is the number of terms shown. */
  searchPlaceholder: "Search {n} terms",
  chipsLabel: "Filter terms by category",
  allChip: "All terms",
  clear: "Clear",
  resultsLabel: "Search results",
  also: "also",
  noMatch: "No terms match",
  otherCategories: "in other categories",
  searchAll: "Search all terms",
  missing: { label: "Tell us what's missing", href: "/contact?topic=idea" },
  copy: "Copy link",
  copied: "Copied",
  copyFailed: "Copy failed",
};

/** "1 term", "4 terms". */
export function glossaryTermCount(n: number): string {
  return `${n} ${n === 1 ? "term" : "terms"}`;
}
