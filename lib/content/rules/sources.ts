/**
 * Builders for RulesSource, so a record names a source by its reference and
 * the URL and anchor come from one place (./official). validateRules reports
 * a reference that doesn't exist; a builder never throws.
 */

import {
  MODEL_LOCAL_RULES_URL,
  RULES_DEFINITIONS_URL,
  RULES_INDEX_URL,
  parseRuleRef,
  ruleUrl,
} from "./official";
import type { RulesSource } from "./types";

/** A rule or subrule on the R&A site: rogSource("18.2b"), rogSource("17"). */
export function rogSource(ref: string, checkedOn?: string): RulesSource {
  const parsed = parseRuleRef(ref);
  const source: RulesSource = {
    authority: "RANDA",
    document: "rules",
    ruleRef: ref,
    url: parsed ? ruleUrl(parsed.rule) : RULES_INDEX_URL,
  };
  if (parsed?.subrule) source.anchor = `${parsed.rule}_${parsed.subrule}`;
  if (checkedOn) source.checkedOn = checkedOn;
  return source;
}

/** A defined term, cited at page level (multi-word terms have no stable anchor). */
export function definitionSource(term: string, checkedOn?: string): RulesSource {
  const source: RulesSource = {
    authority: "RANDA",
    document: "definitions",
    ruleRef: `Definitions: ${term}`,
    url: RULES_DEFINITIONS_URL,
  };
  if (checkedOn) source.checkedOn = checkedOn;
  return source;
}

/** A Model Local Rule, in Committee Procedures Section 8: localRuleSource("E-5"). */
export function localRuleSource(code: string, checkedOn?: string): RulesSource {
  const source: RulesSource = {
    authority: "RANDA",
    document: "local-rule",
    ruleRef: `MLR ${code}`,
    url: MODEL_LOCAL_RULES_URL,
  };
  if (checkedOn) source.checkedOn = checkedOn;
  return source;
}

/** A Rules of Handicapping page on usga.org, which has no index to derive it from. */
export function handicapSource(ref: string, url: string, checkedOn?: string): RulesSource {
  const source: RulesSource = {
    authority: "USGA",
    document: "handicapping",
    ruleRef: `RoH ${ref}`,
    url,
  };
  if (checkedOn) source.checkedOn = checkedOn;
  return source;
}

/** The link a page shows for a source. */
export function rulesSourceHref(source: RulesSource): string {
  return source.anchor ? `${source.url}#${source.anchor}` : source.url;
}
