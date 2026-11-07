/**
 * The Rules Center's analytics events (#244; docs/rules/ux.md § Analytics
 * hooks; reporting definitions in docs/analytics-data-notes.md).
 *
 * Every param comes from a closed set: a bucket, a match type, a topic id, a
 * rule number, a record id, a document type, a link type or a placement. The
 * hub's server-rendered links carry the ids as data-* attributes; the
 * parsers below accept only a value of the expected shape and otherwise send
 * nothing, so a stray attribute can never carry free text. The search text is
 * never a param, and nothing here can take it.
 *
 * Everything goes through track(), so the consent gate, GPC and redaction
 * apply as they do to every other event.
 */

import { track } from "@/lib/analytics";
import { isRulesCategoryId } from "@/lib/content/rules/categories";
import { RULE_NUMBERS } from "@/lib/content/rules/official";
import type { rulesMatchType, rulesResultBucket } from "@/lib/content/rules/search";
import type { RulesCategoryId, RulesDocument } from "@/lib/content/rules/types";

/**
 * How the reader reached an entry: a link in the page's own navigation
 * (quick cards, the number grid, previous/next, a heading's self-link, Back
 * and Forward), a search result, a related link inside another entry, or the
 * URL's fragment on arrival (a shared link, an inbound link from another
 * page or site).
 */
export type RulesOpenSource = "browse" | "search" | "related" | "deep_link";

/** The closed destination_type set for rules_related_click. */
export type RulesRelatedType = "rule" | "situation" | "glossary" | "guide" | "post" | "page";

/** Where a CTA sits. The closing band (FinalCTA, `#get`) is the only one today. */
export type RulesCtaPlacement = "final_cta";

/** Where a CTA goes: a store listing, or a page on this site. */
export type RulesCtaDestination = "google_play" | "app_store" | "page";

/** A rule number as text, "1" to "25". */
export type RulesRuleNumber = `${number}`;

/** Each event's params, so a caller can't send a value outside its set. */
export type RulesEventParams = {
  rules_search: {
    result_bucket: ReturnType<typeof rulesResultBucket>;
    match_type: ReturnType<typeof rulesMatchType>;
    category: RulesCategoryId | "all";
  };
  rules_filter: { category: RulesCategoryId | "all" };
  rules_rule_open: { rule_number: RulesRuleNumber; source: RulesOpenSource };
  rules_scenario_open: { scenario_id: string; source: RulesOpenSource };
  rules_official_click: { rule_number: RulesRuleNumber | "none"; document_type: RulesDocument };
  rules_related_click: { destination_type: RulesRelatedType; content_id: string };
  rules_cta_click: { placement: RulesCtaPlacement; destination_type: RulesCtaDestination };
};

export type RulesEvent = keyof RulesEventParams;

export function trackRules<E extends RulesEvent>(event: E, params: RulesEventParams[E]): void {
  track(event, params);
}

const DOCUMENTS: readonly RulesDocument[] = [
  "rules",
  "definitions",
  "clarifications",
  "local-rule",
  "handicapping",
];
const RELATED: readonly RulesRelatedType[] = ["rule", "situation", "glossary", "guide", "post", "page"];
/** A record id or glossary slug. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** A path on this site, as the hub's related links write them: "/games/skins". */
const SITE_PATH = /^(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)+$/;
/** GA4 drops longer values; ids and paths here are far shorter. */
const ID_MAX = 100;

/** "18" for a rule the Rules of Golf has (1–25); null for anything else. */
export function rulesRuleNumber(value: string | null | undefined): RulesRuleNumber | null {
  if (!value || !/^\d{1,2}$/.test(value)) return null;
  return RULE_NUMBERS.includes(Number(value)) ? (String(Number(value)) as RulesRuleNumber) : null;
}

/** A topic id or "all"; null for anything else. */
export function rulesCategoryParam(value: string | null | undefined): RulesCategoryId | "all" | null {
  if (value === "all") return "all";
  return value && isRulesCategoryId(value) ? value : null;
}

/** A situation id as the hub renders it (data-scenario-id); null for anything else. */
export function rulesScenarioId(value: string | null | undefined): string | null {
  return value && value.length <= ID_MAX && SLUG.test(value) ? value : null;
}

/**
 * rules_official_click's params from a link's data-rules-official (the
 * document) and data-official-rule (the rule an entry's link is about). A
 * hub-level link (the edition notice, the sources panel, the no-results
 * block) is about no one rule: rule_number "none".
 */
export function rulesOfficialParams(
  document: string | null | undefined,
  rule: string | null | undefined,
): RulesEventParams["rules_official_click"] | null {
  const type = DOCUMENTS.find((d) => d === document);
  if (!type) return null;
  return { rule_number: rulesRuleNumber(rule) ?? "none", document_type: type };
}

/**
 * rules_related_click's params from data-rules-related and data-content-id:
 * a rule's fragment id ("rule-18"), a situation id, a glossary slug or a
 * site path ("/games/skins", "/glossary").
 */
export function rulesRelatedParams(
  type: string | null | undefined,
  id: string | null | undefined,
): RulesEventParams["rules_related_click"] | null {
  const destination = RELATED.find((t) => t === type);
  if (!destination || !id || id.length > ID_MAX) return null;
  if (!SLUG.test(id) && !SITE_PATH.test(id)) return null;
  return { destination_type: destination, content_id: id };
}

/**
 * Where a CTA link goes, from its resolved URL: Google Play, the App Store,
 * or a page on this site. Anything else isn't a CTA destination this event
 * knows, and isn't reported.
 */
export function rulesCtaDestination(href: string, origin: string): RulesCtaDestination | null {
  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.origin !== origin) return null;
  if (url.hostname === "play.google.com") return "google_play";
  if (url.hostname === "apps.apple.com") return "app_store";
  return url.origin === origin ? "page" : null;
}
