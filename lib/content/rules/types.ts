/**
 * The Rules Center's content contract (spec §7, as amended in
 * docs/rules/product-spec.md). docs/rules/inventory.md is the editorial
 * source for every id, slug, category and alias; docs/rules/editorial-review.md
 * for the lifecycle and the review record.
 *
 * A record is internal until a selector in ./selectors turns it into a public
 * shape. Only that shape reaches a page, the client, llms.txt or structured
 * data, so the review record and source check dates never leave the server.
 *
 * The lifecycle and review record are the glossary's, so the two features
 * share one editorial process.
 */

import type { PublicationStatus, ReviewEntry } from "../glossary/types";

export type RulesCategoryId =
  | "foundations"
  | "playing"
  | "course-areas"
  | "relief"
  | "formats";

export type RulesEditionId = "2023";

/**
 * What a source is. `local-rule` is a Model Local Rule, in force only where a
 * Committee has adopted it; `handicapping` is the Rules of Handicapping, a
 * separate rulebook cited only for posting caveats.
 */
export type RulesDocument =
  | "rules"
  | "definitions"
  | "clarifications"
  | "local-rule"
  | "handicapping";

export type RulesSource = {
  authority: "RANDA" | "USGA";
  document: RulesDocument;
  /** "18.2b", "Definitions: Relief Area", "MLR E-5", "RoH 3.3". */
  ruleRef: string;
  /** The page, without a fragment. */
  url: string;
  /** The R&A subrule anchor on `url`, e.g. "18_2b". */
  anchor?: string;
  /** The date someone actually opened it for this record. */
  checkedOn?: string;
};

/** Fields every record carries for the editorial process. */
type Reviewed = {
  /** Every source is checked against this edition. */
  edition: RulesEditionId;
  /**
   * Every source the record relies on, in the order a page lists them. Its
   * `rules` sources are its citations ("18.2b"); there's no second list.
   */
  sources: RulesSource[];
  status: PublicationStatus;
  /** Internal: never rendered, never in the client or structured data. */
  reviewedBy?: string;
  /** Internal, as reviewedBy. */
  reviewLog?: ReviewEntry[];
  /** The latest approval date; shown as "Reviewed <date>" when published. */
  reviewedOn?: string;
  /** Set by the launch PR only. */
  publishedOn?: string;
  /** Only for a substantive editorial change. */
  updatedOn?: string;
};

/**
 * One of the 25 rules. Its title and category come from the number
 * (./official, ./categories), so a record can't disagree with either.
 */
export type RuleOverview = Reviewed & {
  /** `rule-N`: stable, internal and the public fragment. */
  id: string;
  number: number;
  /** What a player types for this rule: old names, slang ("casual water"). */
  aliases: string[];
  /** 60–120 words, original. Empty while planned. */
  summary: string;
  /** Two to four "Look here when…" questions. */
  commonQuestions: string[];
  /** Published glossary slugs only. */
  relatedGlossaryIds: string[];
  relatedContentPaths: string[];
};

/** A common situation: a question with a conditional, cited answer. */
export type RulesScenario = Reviewed & {
  /** Stable and internal; never changes once created. */
  id: string;
  /** The public fragment: /rules#<slug>. */
  slug: string;
  question: string;
  aliases: string[];
  /** The rule that governs it; also gives its category. */
  primaryRule: number;

  /** One to three sentences. Empty while planned. */
  answer: string;
  /** "Before you decide": what has to be true for the answer to hold. */
  conditions: string[];
  /** The choices, when there are several. */
  options: string[];
  /** Only when the cited subrule states the penalty. */
  penalty?: string;
  example?: string;
  /** Required when a source is a Model Local Rule. */
  localRuleCaveat?: string;
  matchVsStrokeCaveat?: string;
  /** Required when a source is the Rules of Handicapping. */
  handicapCaveat?: string;

  relatedGlossaryIds: string[];
  relatedContentPaths: string[];
};

/** A source as a page shows it: a link, no check dates. */
export type PublicRulesLink = {
  authority: RulesSource["authority"];
  document: RulesDocument;
  ruleRef: string;
  href: string;
  /** A Model Local Rule: in force only where a Committee adopted it. */
  localRule?: true;
};

type PublicReviewed = {
  links: PublicRulesLink[];
  reviewedOn?: string;
  publishedOn?: string;
  updatedOn?: string;
  /** An approved record shown in local review (`next dev`) only. */
  unpublished?: true;
};

export type PublicRuleOverview = PublicReviewed & {
  id: string;
  number: number;
  title: string;
  category: RulesCategoryId;
  aliases: string[];
  summary: string;
  commonQuestions: string[];
  /** Shown situations that cite this rule, in display order. */
  scenarioIds: string[];
  relatedGlossaryIds: string[];
  relatedContentPaths: string[];
};

export type PublicRulesScenario = PublicReviewed &
  Omit<
    RulesScenario,
    | "sources"
    | "status"
    | "edition"
    | "reviewedBy"
    | "reviewLog"
    | "reviewedOn"
    | "publishedOn"
    | "updatedOn"
  > & {
    category: RulesCategoryId;
    /** Its Rules of Golf citations, from its sources: "18.2b", "17". */
    ruleRefs: string[];
  };

/** The search index entry the client leaf gets: only what search reads and shows. */
export type RulesSearchEntry = {
  kind: "rule" | "scenario";
  id: string;
  /** The fragment on /rules. */
  anchor: string;
  /** "Rule 18 · Stroke-and-Distance Relief…" for a rule; the question for a situation. */
  title: string;
  /** The rule's number, or the situation's primary rule. */
  rule: number;
  category: RulesCategoryId;
  /** One line under the title: the summary's or answer's first sentence. */
  snippet: string;
  aliases: string[];
  /** For a rule, its own number; for a situation, every reference it cites. */
  ruleRefs: string[];
  /** Searchable text that isn't shown: common questions, conditions. */
  extra: string;
};
