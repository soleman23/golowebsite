/**
 * The /rules hub's own copy: hero, edition notice, labels, the quick
 * situation cards, official sources, related links and the closing band
 * (docs/rules/ux.md). Rule overviews and situations are in ./overviews and
 * ./scenarios.
 *
 * Unlike those records, this file gets the full claim guard: it speaks for
 * GoLo, not about golf.
 *
 * No /rules#… link is written here as a string: lint:content rejects a
 * fragment that names an unpublished record. The hub builds its links from
 * the records it shows.
 */

import { findPost } from "../blog";
import { glossaryPathLink } from "../glossary/copy";
import {
  MODEL_LOCAL_RULES_URL,
  RULES_CLARIFICATIONS_URL,
  RULES_DEFINITIONS_URL,
  RULES_INDEX_URL,
  USGA_CLARIFICATIONS_URL,
  USGA_RULES_HUB_URL,
} from "./official";
import type { PublicRulesLink, RulesDocument } from "./types";

/** The CollectionPage's name (#243): the H1. Title and description are in
 * the page's pageMetadata call, where the content check reads them. */
export const rulesSchemaName = "Golf Rules Explained";

/** The H1 is spec §9's; the title tag is in the page's pageMetadata call. */
export const rulesHero = {
  kicker: "RULES OF GOLF",
  title: "Golf Rules Explained",
  lead: "Plain answers to what happens next when your ball is lost, out of bounds, in a penalty area or up against a cart path, with the official rule linked beside each one.",
};

export const rulesBreadcrumb = "Golf rules";

/** Under the hero (ux.md D6). Dates are filled in from ./edition. */
export const rulesEditionCopy = {
  /** {edition} is the edition's label. */
  basedOn: "Based on the {edition}, written jointly by The R&A and the USGA.",
  /** The R&A says "published on 1 January 2028" (source-map.md). */
  nextEdition: "The next edition is due on",
  checked: "Clarifications checked",
  officialText: "Official sources:",
  randa: "The Rules of Golf on randa.org",
  usga: "The rules hub on usga.org",
  independent:
    "GoLo is an independent site, not affiliated with or endorsed by The R&A or the USGA.",
};

/**
 * The eight cards under the edition notice, in display order (ux.md §5). A
 * card shows only while its situation is on the page.
 */
export const rulesQuickSituations = {
  label: "Jump to a situation",
  cards: [
    { id: "lost-ball", label: "Lost ball" },
    { id: "out-of-bounds", label: "Out of bounds" },
    { id: "red-vs-yellow-penalty-areas", label: "Penalty areas" },
    { id: "cart-path", label: "Cart path relief" },
    { id: "bunker-sand", label: "Bunkers" },
    { id: "provisional-ball", label: "Provisional ball" },
    { id: "unplayable-ball", label: "Unplayable ball" },
    { id: "conceded-putt", label: "Conceded putts" },
  ],
};

export const rulesSituationsCopy = {
  title: "Common situations",
  intro:
    "What the Rules say happens next. Each answer lists what has to be true for it to hold, and links the rule it comes from.",
  conditions: "Before you decide",
  options: "Your options",
  penalty: "Penalty",
  example: "Example",
  localRule: "Local Rule",
  matchVsStroke: "Match play and stroke play",
  handicap: "Handicap posting",
};

export const rulesDirectoryCopy = {
  /** While fewer than 25 overviews are on the page, the heading says so. */
  title: (shown: number) => (shown === 25 ? "All 25 rules" : `${shown} of the 25 rules`),
  intro:
    "What each rule covers and when to look it up, grouped by part of the game. The full text of each is on randa.org.",
  numbersLabel: "Rules 1 to 25",
  lookHereWhen: "Look here when",
  situations: "Situations",
};

/** "Rule 18": the number grid's accessible names, cards and pager. */
export function rulesRuleLabel(number: number): string {
  return `Rule ${number}`;
}

/** The overview's link to its own rule (ux.md § Entry anatomy). */
export function rulesReadRule(number: number): string {
  return `Read Rule ${number} on randa.org`;
}

/** Labels every entry shares. */
export const rulesEntryCopy = {
  official: "Official text",
  related: "Related",
  reviewed: "Reviewed",
  /** After a Model Local Rule's link (canonical-map.md rule 5). */
  ifAdopted: "if the Committee has adopted it",
  /** After a Rules of Handicapping link (canonical-map.md rule 6). */
  separateRulebook: "a separate rulebook",
  /** A glossary link's suffix: "Penalty area (glossary)". */
  glossary: "glossary",
  /** Shown on an approved record in local review (`next dev`) only. */
  unpublished: "Not published",
  copy: "Copy link",
  copied: "Copied",
  copyFailed: "Copy failed",
  /** Announced; {name} is the heading. */
  copiedMessage: "Link to {name} copied",
  failedMessage: "Couldn't copy. The heading is itself a link you can copy instead.",
};

/**
 * Search and topic filters (ux.md D4, D5, § Flows and states). The client
 * leaves get these as plain strings; {n}, {query} and {topic} are filled in
 * there.
 */
export const rulesControlsCopy = {
  searchLabel: "What happened to your ball?",
  searchPlaceholder: "Lost ball, white stakes, Rule 18.2…",
  chipsLabel: "Filter by topic",
  allChip: "All",
  clear: "Clear",
  situations: "Situations",
  rules: "Rules",
  /** A group shows eight results until this is pressed. */
  showAll: "Show all {n}",
  /** The result line when only near misses matched ("casul water"). */
  closest: "Closest matches",
  also: "also",
  /** Under a situation result: the rules it cites, the first three. */
  refs: "Rule {refs}",
  /** Singular and plural, for counts: "1 situation", "2 rules". */
  nouns: {
    result: ["result", "results"],
    situation: ["situation", "situations"],
    rule: ["rule", "rules"],
    entry: ["entry", "entries"],
  } satisfies Record<string, [string, string]>,
  inTopic: "in {topic}",
  noMatch: "No match for “{query}”.",
  noMatchShort: "No match",
  /** Never a made-up answer: a way back in instead. */
  noMatchHint: "Try a rule number, such as 18 or 18.2b, or pick a topic.",
  elsewhere: "{n} in other topics.",
  searchAll: "Search all topics",
  rulesIndex: { label: "Browse the Rules of Golf on randa.org", href: RULES_INDEX_URL },
  /** Hash reveal (ux.md § Flows and states). {name} is the entry's heading. */
  searchCleared: "Search cleared to show {name}",
  filterCleared: "Topic filter cleared to show {name}",
  bothCleared: "Search and topic filter cleared to show {name}",
  showing: "Showing {name}",
};

/** "1 entry", "37 entries": a count with the right form of its noun. */
export function rulesCount(n: number, [one, many]: readonly [string, string]): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Local review only (`next dev`). */
export const rulesReviewCopy = {
  banner:
    "Local review. Entries marked Not published are approved but not live; production shows published entries only, and only once the Rules Center launches.",
  empty:
    "No rules entries are approved yet. Planned and draft records don't show here, even locally.",
};

/** What an official link names, before the site. */
function sourceName({ document, ruleRef }: PublicRulesLink): string {
  switch (document) {
    case "rules":
      return `Rule ${ruleRef}`;
    case "definitions":
      return `Definition of “${ruleRef.replace(/^Definitions:\s*/, "")}”`;
    case "clarifications":
      return "Clarifications";
    case "local-rule":
      return `Model Local Rule ${ruleRef.replace(/^MLR\s*/, "")}`;
    case "handicapping":
      return `Rules of Handicapping ${ruleRef.replace(/^RoH\s*/, "")}`;
  }
}

/**
 * An official link's text, naming the source and the site it opens
 * (ux.md D7): "Rule 18.2b on randa.org".
 */
export function rulesLinkText(link: PublicRulesLink): string {
  return rulesOnSite(sourceName(link), link.authority === "USGA" ? "usga.org" : "randa.org");
}

/** "The Rules of Golf on randa.org". */
export function rulesOnSite(name: string, site: string): string {
  return `${name} on ${site}`;
}

/** A guide, post or page link's text; the glossary's wording. */
export const rulesPathLink = glossaryPathLink;

/**
 * The Rules of Handicapping's Definitions page. The USGA's reader has no
 * index (usga.org/handicapping/roh/ is a 404); this is its first page and
 * carries the navigation to every chapter (checked November 6, 2026).
 */
const ROH_URL = "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm";

export type RulesOfficialSource = {
  label: string;
  site: "randa.org" | "usga.org";
  href: string;
  /** For rules_official_click's document_type (#244). */
  document: RulesDocument;
  note: string;
};

export const rulesOfficialSources: {
  title: string;
  intro: string;
  items: RulesOfficialSource[];
  localRules: string;
  independent: string;
  report: { lead: string; label: string; href: string };
} = {
  title: "Official sources",
  intro:
    "The R&A and the USGA write the Rules of Golf together. Each answer links The R&A's pages for the rules it cites; these are the documents behind them, with the USGA's own pages beside them.",
  items: [
    {
      label: "The Rules of Golf",
      site: "randa.org",
      href: RULES_INDEX_URL,
      document: "rules",
      note: "All 25 rules, with every subrule this page cites.",
    },
    {
      label: "Definitions",
      site: "randa.org",
      href: RULES_DEFINITIONS_URL,
      document: "definitions",
      note: "The defined terms the Rules rely on, such as Lost, Relief Area and Penalty Area.",
    },
    {
      label: "Clarifications",
      site: "randa.org",
      href: RULES_CLARIFICATIONS_URL,
      document: "clarifications",
      note: "Official clarifications of the current edition. Updates are quarterly, and not every quarter brings a new one.",
    },
    {
      label: "Committee Procedures, Section 8: Model Local Rules",
      site: "randa.org",
      href: MODEL_LOCAL_RULES_URL,
      document: "local-rule",
      note: "Local Rules a Committee can choose to adopt, E-5 among them.",
    },
    {
      label: "The rules hub",
      site: "usga.org",
      href: USGA_RULES_HUB_URL,
      document: "rules",
      note: "The USGA's home for the same Rules.",
    },
    {
      label: "Clarifications",
      site: "usga.org",
      href: USGA_CLARIFICATIONS_URL,
      document: "clarifications",
      note: "The USGA's page for the same clarifications, with the date of the latest update.",
    },
    {
      label: "Rules of Handicapping",
      site: "usga.org",
      href: ROH_URL,
      document: "handicapping",
      note: "A separate rulebook. It covers handicaps and which scores you post, not how the game is played. This page cites it only in handicap-posting notes.",
    },
  ],
  localRules:
    "A Committee's Local Rules can change some of these answers. If the scorecard or notice board has a Local Rule that covers your situation, it applies.",
  independent:
    "These explanations are GoLo's own, not the official text. Neither The R&A nor the USGA has reviewed or endorsed them.",
  report: {
    lead: "Spot an error?",
    label: "Tell us what's wrong",
    href: "/contact?topic=bug",
  },
};

/** A published post as a related card, titled from the post. */
function postCard(slug: string, blurb: string) {
  const post = findPost(slug);
  return post
    ? [{ label: post.title.split(":")[0].trim(), blurb, cta: "Read the post", href: `/blog/${slug}` }]
    : [];
}

/** Below the official sources (docs/rules/canonical-map.md § Overlaps). */
export const rulesRelated = {
  title: "Related",
  items: [
    {
      label: "Golf glossary",
      blurb: "What a term means, from penalty area to gimme. This page covers what happens next.",
      cta: "Open the glossary",
      href: "/glossary",
    },
    {
      label: "The games",
      blurb: "Skins, Nassau, Wolf and the rest, with the house rules each one adds on top of the Rules of Golf.",
      cta: "Browse the games",
      href: "/games",
    },
    ...postCard(
      "gimmes",
      "A conceded putt is part of the Rules in a match. In every other game on the same hole, someone has to agree to it.",
    ),
    ...postCard(
      "match-play-vs-stroke-play",
      "Holes won against every stroke counted, and how one card can produce two different winners.",
    ),
  ],
};

/** The closing band. The store buttons and fine print are FinalCTA's. */
export const rulesFinalCta = {
  title: "Know the rule. Let GoLo keep the score.",
};
