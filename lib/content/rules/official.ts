/**
 * The official Rules of Golf as the R&A publishes them, for navigation and
 * link checks only: rule titles (verbatim, as navigation references) and the
 * subrule anchors each rule page carries. Nothing here is rule text.
 *
 * Snapshot of https://www.randa.org/en/rog/the-rules-of-golf and the 25 rule
 * pages, fetched November 6, 2026 (docs/rules/source-map.md, #231).
 * scripts/check-rules-sources.mjs (#245) compares it with the live pages.
 *
 * A subrule "2b" of Rule 18 is "18.2b" in copy and `#18_2b` on the page.
 */

export const RULES_INDEX_URL = "https://www.randa.org/en/rog/the-rules-of-golf";
export const RULES_DEFINITIONS_URL = "https://www.randa.org/en/rog/definitions";
export const RULES_CLARIFICATIONS_URL = "https://www.randa.org/en/rog/clarifications";
/** Committee Procedures Section 8: the Model Local Rules. No stable anchors. */
export const MODEL_LOCAL_RULES_URL =
  "https://www.randa.org/en/rog/committee-procedures/sections/8";
export const USGA_RULES_HUB_URL =
  "https://www.usga.org/content/usga/home-page/rules-hub.html";
export const USGA_CLARIFICATIONS_URL =
  "https://www.usga.org/rules-hub/clarifications-of-the-rules-of-golf.html";

export type OfficialRule = {
  /** The R&A's title, verbatim. */
  title: string;
  /** Subrule ids as they follow "N_" in the page's anchors: "2", "2b". */
  subrules: readonly string[];
};

export const RULE_NUMBERS = Array.from({ length: 25 }, (_, i) => i + 1);

export const officialRules: Readonly<Record<number, OfficialRule>> = {
  1: {
    title: "The Game, Player Conduct and the Rules",
    subrules: ["1", "2", "2a", "2b", "3", "3a", "3b", "3c"],
  },
  2: {
    title: "The Course",
    subrules: ["1", "2", "2a", "2b", "2c", "3", "4"],
  },
  3: {
    title: "The Competition",
    subrules: ["1", "1a", "1b", "1c", "2", "2a", "2b", "2c", "2d", "3", "3a", "3b", "3c"],
  },
  4: {
    title: "The Player’s Equipment",
    subrules: ["1", "1a", "1b", "1c", "2", "2a", "2b", "2c", "3", "3a", "3b"],
  },
  5: {
    title: "Playing the Round",
    subrules: ["1", "2", "2a", "2b", "3", "3a", "3b", "4", "4a", "4b", "5", "5a", "5b", "5c", "6", "6a", "6b", "7", "7a", "7b", "7c", "7d"],
  },
  6: {
    title: "Playing a Hole",
    subrules: ["1", "1a", "1b", "2", "2a", "2b", "3", "3a", "3b", "3c", "3d", "4", "4a", "4b", "4c", "4d", "5"],
  },
  7: {
    title: "Ball Search: Finding and Identifying Ball",
    subrules: ["1", "1a", "1b", "2", "3", "4"],
  },
  8: {
    title: "Course Played as It Is Found",
    subrules: ["1", "1a", "1b", "1c", "1d", "2", "2a", "2b", "3", "3a", "3b"],
  },
  9: {
    title: "Ball Played as It Lies; Ball at Rest Lifted or Moved",
    subrules: ["1", "1a", "1b", "2", "2a", "2b", "3", "4", "4a", "4b", "5", "5a", "5b", "6", "7", "7a", "7b"],
  },
  10: {
    title: "Preparing for and Making a Stroke; Advice and Help; Caddies",
    subrules: ["1", "1a", "1b", "1c", "1d", "2", "2a", "2b", "3", "3a", "3b", "3c"],
  },
  11: {
    title: "Ball in Motion Accidentally Hits Person, Animal or Object; Deliberate Actions to Affect Ball in Motion",
    subrules: ["1", "1a", "1b", "2", "2a", "2b", "2c", "3"],
  },
  12: {
    title: "Bunkers",
    subrules: ["1", "2", "2a", "2b", "3"],
  },
  13: {
    title: "Putting Greens",
    subrules: ["1", "1a", "1b", "1c", "1d", "1e", "1f", "2", "2a", "2b", "2c", "3", "3a", "3b"],
  },
  14: {
    title: "Procedures for Ball: Marking, Lifting and Cleaning; Replacing on Spot; Dropping in Relief Area; Playing from Wrong Place",
    subrules: ["1", "1a", "1b", "1c", "2", "2a", "2b", "2c", "2d", "2e", "3", "3a", "3b", "3c", "3d", "4", "5", "5a", "5b", "5c", "6", "6a", "6b", "6c", "7", "7a", "7b"],
  },
  15: {
    title: "Relief from Loose Impediments and Movable Obstructions (Including Ball or Ball-Marker Helping or Interfering with Play)",
    subrules: ["1", "1a", "1b", "2", "2a", "2b", "3", "3a", "3b", "3c"],
  },
  16: {
    title: "Relief from Abnormal Course Conditions (Including Immovable Obstructions), Dangerous Animal Condition, Embedded Ball",
    subrules: ["1", "1a", "1b", "1c", "1d", "1e", "1f", "2", "2a", "2b", "3", "3a", "3b", "4"],
  },
  17: {
    title: "Penalty Areas",
    subrules: ["1", "1a", "1b", "1c", "1d", "1e", "2", "2a", "2b", "3"],
  },
  18: {
    title: "Stroke-and-Distance Relief, Ball Lost or Out of Bounds, Provisional Ball",
    subrules: ["1", "2", "2a", "2b", "3", "3a", "3b", "3c"],
  },
  19: {
    title: "Unplayable Ball",
    subrules: ["1", "2", "2a", "2b", "2c", "3", "3a", "3b"],
  },
  20: {
    title: "Resolving Rules Issues During Round; Rulings by Referee and Committee",
    subrules: ["1", "1a", "1b", "1c", "2", "2a", "2b", "2c", "2d", "2e", "2f", "3"],
  },
  21: {
    title: "Other Forms of Individual Stroke Play and Match Play",
    subrules: ["1", "1a", "1b", "1c", "1d", "1e", "2", "2a", "2b", "2c", "2d", "2e", "3", "3a", "3b", "3c", "3d", "3e", "4", "4a", "4b", "4c", "5"],
  },
  22: {
    title: "Foursomes (Also Known as Alternate Shot)",
    subrules: ["1", "2", "3", "4", "4a", "4b", "5", "6"],
  },
  23: {
    title: "Four-Ball",
    subrules: ["1", "2", "2a", "2b", "2c", "3", "3a", "3b", "3c", "4", "5", "5a", "5b", "6", "7", "8", "9", "9a", "9b"],
  },
  24: {
    title: "Team Competitions",
    subrules: ["1", "2", "3", "4", "4a", "4b", "4c"],
  },
  25: {
    title: "Modifications for Players with Disabilities",
    subrules: ["1", "2", "2a", "2b", "2c", "2d", "2e", "2f", "2g", "2h", "3", "3a", "3b", "3c", "3d", "4", "4a", "4b", "4c", "4d", "4e", "4f", "4g", "4h", "4i", "4j", "4k", "4l", "4m", "4n", "5", "5a", "5b", "5c", "5d", "5e", "6", "6a", "6b"],
  },
};

/** The R&A page for a rule. */
export function ruleUrl(number: number): string {
  return `${RULES_INDEX_URL}/rule-${number}`;
}

export type ParsedRuleRef = {
  rule: number;
  /** "2b" for 18.2b; absent for a whole rule. */
  subrule?: string;
};

/**
 * "18", "18.2", "18.2b" (also "18-2b", "18 2b", "18_2b") as a rule and
 * subrule, or null if it isn't one. A subrule needs a separator, so "182"
 * isn't read as 18.2. Doesn't check the rule exists; see knownRuleRef.
 */
export function parseRuleRef(ref: string): ParsedRuleRef | null {
  const m = /^(\d{1,2})(?:[.\-_ ](\d{1,2}[a-z]?))?$/i.exec(ref.trim());
  if (!m) return null;
  const rule = Number(m[1]);
  return m[2] ? { rule, subrule: m[2].toLowerCase() } : { rule };
}

/** Whether a parsed reference names a rule, and subrule, that exists. */
export function knownRuleRef(ref: ParsedRuleRef): boolean {
  const official = officialRules[ref.rule];
  if (!official) return false;
  return ref.subrule === undefined || official.subrules.includes(ref.subrule);
}

/** The R&A link for "18.2b": the rule page with its subrule anchor. */
export function ruleRefUrl(ref: string): string | null {
  const parsed = parseRuleRef(ref);
  if (!parsed || !knownRuleRef(parsed)) return null;
  const page = ruleUrl(parsed.rule);
  return parsed.subrule ? `${page}#${parsed.rule}_${parsed.subrule}` : page;
}
