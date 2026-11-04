/**
 * The side-game chooser's rules (/games/chooser, soleman23/golowebsite#224).
 * Pure functions over plain data: no React, no copy, no registry. The page,
 * the worked example and scripts/test-chooser.mjs all run the same code, so
 * the tool can't recommend something the page's rules section doesn't say.
 *
 * How it decides, in the order it applies:
 *
 * 1. Eligibility is a set of hard rules. A format is in or out on the
 *    group's size, the partner style asked for, and (only when "keep it
 *    simple" is asked for) whether it's simple at that size. Handicaps and
 *    holes never rule a format out; they change its notes and its rank.
 * 2. Ranking sorts what's left by four keys in turn. There are no weights and
 *    no scores: a key either lifts a format or it doesn't, and each key that
 *    lifts one becomes a reason the page shows.
 *      a. Handicaps. "Someone has none" lifts the formats that need no
 *         handicap (Bingo Bango Bongo), then the one whose team numbers an
 *         organizer can set (a scramble). "Further apart" lifts both
 *         together: the site's three-player post and scramble guide both
 *         point mixed-ability groups at them.
 *      b. "Keep it simple" lifts Best Score, the easiest game to explain
 *         (the beginners post).
 *      c. A format made for exactly this many players: Nines at three, Wolf
 *         at four.
 *      d. A fixed editorial order, so equal formats always come out the same.
 * 3. The first three are the picks. The rest that fit are listed by name, and
 *    every format that doesn't fit is listed with each rule it fails.
 * 4. When nothing fits, each single answer that could be changed to produce a
 *    result is offered as a one-tap change. Player count is a fact about the
 *    group, so it's never one of them.
 */

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 12;
export const PLAYER_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const PARTNER_VALUES = ["solo", "teams", "either"] as const;
export const HANDICAP_VALUES = ["close", "apart", "none"] as const;
export const SCORING_VALUES = ["simple", "more"] as const;
export const HOLE_VALUES = ["18", "9"] as const;

export type Partners = (typeof PARTNER_VALUES)[number];
export type Handicaps = (typeof HANDICAP_VALUES)[number];
export type Scoring = (typeof SCORING_VALUES)[number];
export type Holes = (typeof HOLE_VALUES)[number];

/** A question left unanswered is null and constrains nothing. */
export type Answers = {
  players: number | null;
  partners: Partners | null;
  handicaps: Handicaps | null;
  scoring: Scoring | null;
  holes: Holes | null;
};

export const NO_ANSWERS: Answers = {
  players: null,
  partners: null,
  handicaps: null,
  scoring: null,
  holes: null,
};

export const FORMAT_IDS = [
  "best-score",
  "skins",
  "nassau",
  "best-ball",
  "scramble",
  "bingo-bango-bongo",
  "wolf",
  "nines",
] as const;

export type FormatId = (typeof FORMAT_IDS)[number];

/** How players line up: on their own, in fixed teams, or partners that change each hole. */
export type Style = "solo" | "teams" | "rotating";

export type FormatRule = {
  id: FormatId;
  style: Style;
  /** Group sizes the format works for as golf, whatever GoLo scores. */
  players: { min: number; max: number };
  /**
   * The largest group for which the format counts as simple: 12 means always,
   * 0 never. A Nassau is simple between two players and isn't head to head
   * among three or four, where every pair has its own Nassau.
   */
  simpleUpTo: number;
  /** Plays without handicap strokes at all. */
  noStrokes?: true;
  /** Its handicap can be a number the organizer sets (a scramble's Manual). */
  setNumbers?: true;
  /** Made for exactly this many players. */
  madeFor?: number;
};

/** In editorial order: the last ranking key, and the order of the rules table. */
export const FORMAT_RULES: readonly FormatRule[] = [
  { id: "best-score", style: "solo", players: { min: 2, max: 12 }, simpleUpTo: 12 },
  // The roster's "2–6 players".
  { id: "skins", style: "solo", players: { min: 2, max: 6 }, simpleUpTo: 12 },
  { id: "nassau", style: "solo", players: { min: 2, max: 4 }, simpleUpTo: 2 },
  { id: "best-ball", style: "teams", players: { min: 4, max: 4 }, simpleUpTo: 12 },
  // Two teams of two at the least: below four, a "team" is one player.
  { id: "scramble", style: "teams", players: { min: 4, max: 12 }, simpleUpTo: 12, setNumbers: true },
  { id: "bingo-bango-bongo", style: "solo", players: { min: 2, max: 4 }, simpleUpTo: 0, noStrokes: true },
  { id: "wolf", style: "rotating", players: { min: 4, max: 4 }, simpleUpTo: 0, madeFor: 4 },
  { id: "nines", style: "solo", players: { min: 3, max: 3 }, simpleUpTo: 0, madeFor: 3 },
];

export function formatRule(id: FormatId): FormatRule {
  // Every FormatId has a rule; test-chooser checks the two lists match.
  return FORMAT_RULES.find((rule) => rule.id === id) as FormatRule;
}

/** The partner styles each answer accepts. Wolf's rotating partners are a partner game. */
const STYLES_FOR: Record<Partners, readonly Style[]> = {
  solo: ["solo"],
  teams: ["teams", "rotating"],
  either: ["solo", "teams", "rotating"],
};

export type ExcludeReason = "players" | "partners" | "scoring";

/** Why a format moved up. Each one is shown as a reason on its card. */
export type RankReason =
  | "no-strokes" // a. no handicap needed, or far-apart handicaps
  | "set-numbers" // a. the organizer can set the team numbers
  | "simplest" // b. keep it simple
  | "made-for"; // c. made for exactly this many

export type Pick = { id: FormatId; rank: number; reasons: RankReason[] };
export type RuledOut = { id: FormatId; reasons: ExcludeReason[] };
export type Relaxation =
  | { question: "partners"; value: Partners }
  | { question: "scoring"; value: Scoring };

export type ChooserResult =
  | { status: "needs-players" }
  | {
      status: "ok" | "empty";
      picks: Pick[];
      /** Fit, ranked below the three picks. */
      alsoFits: FormatId[];
      ruledOut: RuledOut[];
      /** Only when empty: single-answer changes that would give a result. */
      relaxations: Relaxation[];
    };

export const MAX_PICKS = 3;

export function exclusionReasons(rule: FormatRule, answers: Answers & { players: number }): ExcludeReason[] {
  const reasons: ExcludeReason[] = [];
  const { players } = answers;
  if (players < rule.players.min || players > rule.players.max) reasons.push("players");
  if (answers.partners && !STYLES_FOR[answers.partners].includes(rule.style)) reasons.push("partners");
  if (answers.scoring === "simple" && players > rule.simpleUpTo) reasons.push("scoring");
  return reasons;
}

/** The ranking keys for one eligible format, smallest first, and the reasons they give. */
function rankKeys(rule: FormatRule, answers: Answers & { players: number }) {
  const reasons: RankReason[] = [];
  let handicap = 1;
  if (answers.handicaps === "none") {
    handicap = rule.noStrokes ? 0 : rule.setNumbers ? 1 : 2;
  } else if (answers.handicaps === "apart") {
    handicap = rule.noStrokes || rule.setNumbers ? 0 : 1;
  }
  const lifted = answers.handicaps === "none" ? handicap < 2 : answers.handicaps === "apart" && handicap === 0;
  if (lifted) reasons.push(rule.noStrokes ? "no-strokes" : "set-numbers");

  const simplest = answers.scoring === "simple" && rule.id === "best-score";
  if (simplest) reasons.push("simplest");

  const madeFor = rule.madeFor === answers.players;
  if (madeFor) reasons.push("made-for");

  return {
    keys: [handicap, simplest ? 0 : 1, madeFor ? 0 : 1, FORMAT_RULES.indexOf(rule)],
    reasons,
  };
}

function compareKeys(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

/** Eligible formats in rank order, and every other format with its reasons. */
function rank(answers: Answers & { players: number }) {
  const eligible: { rule: FormatRule; keys: number[]; reasons: RankReason[] }[] = [];
  const ruledOut: RuledOut[] = [];
  for (const rule of FORMAT_RULES) {
    const reasons = exclusionReasons(rule, answers);
    if (reasons.length) ruledOut.push({ id: rule.id, reasons });
    else eligible.push({ rule, ...rankKeys(rule, answers) });
  }
  eligible.sort((a, b) => compareKeys(a.keys, b.keys));
  return { eligible, ruledOut };
}

export function choose(answers: Answers): ChooserResult {
  const { players } = answers;
  if (players === null || !Number.isInteger(players) || players < MIN_PLAYERS || players > MAX_PLAYERS) {
    return { status: "needs-players" };
  }
  const known = { ...answers, players };
  const { eligible, ruledOut } = rank(known);
  const picks = eligible
    .slice(0, MAX_PICKS)
    .map((e, i) => ({ id: e.rule.id, rank: i + 1, reasons: e.reasons }));
  const alsoFits = eligible.slice(MAX_PICKS).map((e) => e.rule.id);
  return {
    status: picks.length ? "ok" : "empty",
    picks,
    alsoFits,
    ruledOut,
    relaxations: picks.length ? [] : relaxations(known),
  };
}

/** Each other value of one answered question that would produce a result. */
function relaxations(answers: Answers & { players: number }): Relaxation[] {
  const found: Relaxation[] = [];
  const fits = (changed: Answers & { players: number }) => rank(changed).eligible.length > 0;
  if (answers.partners) {
    for (const value of PARTNER_VALUES) {
      if (value !== answers.partners && value !== "either" && fits({ ...answers, partners: value })) {
        found.push({ question: "partners", value });
      }
    }
  }
  if (answers.scoring === "simple" && fits({ ...answers, scoring: "more" })) {
    found.push({ question: "scoring", value: "more" });
  }
  return found;
}

/**
 * Whether equal teams can be made: two or more teams of two to four, all the
 * same size. Five, seven and eleven can't, and GoLo's scramble then has teams
 * of different sizes.
 */
export function evenTeams(players: number): boolean {
  for (let size = 2; size <= 4; size++) {
    if (players % size === 0 && players / size >= 2) return true;
  }
  return false;
}
