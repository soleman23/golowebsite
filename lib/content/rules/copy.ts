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

/** The H1 is spec §9's; the title tag is in the page's pageMetadata call. */
export const rulesHero = {
  kicker: "RULES OF GOLF",
  title: "Golf Rules Explained",
  lead: "Plain answers to what happens next when your ball is lost, out of bounds, in a penalty area or up against a cart path, with the official rule linked beside each one.",
};

/** Under the hero (ux.md D6). Dates are filled in from ./edition. */
export const rulesEditionCopy = {
  label: "Edition and sources",
  /** {edition} is the edition's label. */
  basedOn: "Based on the {edition}, written jointly by The R&A and the USGA.",
  nextEdition: "The next edition takes effect on",
  checked: "Clarifications checked",
  officialText: "Official text:",
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
    "What the Rules say happens next. Each answer starts with what has to be true for it to hold, and links the rule it comes from.",
  conditions: "Before you decide",
  options: "Your options",
  penalty: "Penalty",
  example: "Example",
  localRule: "Local Rule",
  matchVsStroke: "Match play and stroke play",
  handicap: "Handicap posting",
};

export const rulesDirectoryCopy = {
  title: "All 25 rules",
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
  /** After a Model Local Rule's link. */
  ifAdopted: "if the Committee adopted it",
  /** A glossary link's suffix: "Penalty area (glossary)". */
  glossary: "glossary",
  /** Shown on an approved record in local review (`next dev`) only. */
  unpublished: "Not published",
  copy: "Copy link",
  copied: "Copied",
  copyFailed: "Copy failed",
};

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
 * The Rules of Handicapping's definitions page, the nearest the USGA has to
 * an index (usga.org/handicapping/roh/ itself is a 404).
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
    "The R&A and the USGA write the Rules of Golf together, and the R&A pages are the ones linked from each answer. These are the full documents.",
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
      note: "Official clarifications of the current edition, added each quarter.",
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
      note: "A separate rulebook. It decides what score you post, not how you play, and this page cites it only for posting notes.",
    },
  ],
  localRules:
    "A Committee's Local Rules can change any answer here. If the scorecard or the notice board says something different, the Local Rule applies.",
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
  title: "Know the ruling. Let GoLo keep the score.",
};
