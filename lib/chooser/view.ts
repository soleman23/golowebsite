/**
 * Turns the engine's result into what the chooser shows, using copy passed
 * in (lib/content/chooser.ts builds it on the server). Pure and React-free,
 * like the engine, so the live tool and the server-rendered worked example
 * build their cards the same way and scripts/test-chooser.mjs can check them.
 *
 * Copy is declarative: a line can carry a `when` condition on the answers,
 * and a line without one always applies. Nothing here writes a sentence.
 */

import {
  choose,
  evenTeams,
  formatRule,
  type Answers,
  type ExcludeReason,
  type FormatId,
  type FormatRule,
  type Handicaps,
  type Holes,
  type Partners,
  type RankReason,
  type Relaxation,
  type Scoring,
  type Style,
} from "./engine";

export type When = {
  players?: { min?: number; max?: number };
  handicaps?: readonly (Handicaps | "unanswered")[];
  holes?: readonly Holes[];
  /** Equal teams of two to four can't be made (five, seven, eleven). */
  unevenTeams?: true;
};

export type LineLink = { href: string; label: string };

export type Line = { text: string; links?: readonly LineLink[]; when?: When };

/** A registry status (lib/content/capabilities.ts), resolved on the server. */
export type GoloStatus = "live" | "testing" | "planned" | "not-offered";

export type GoloCopy = {
  /** The registry entry that covers the format; null when GoLo has no such game. */
  capability: string | null;
  /** That entry's status, copied from the registry when the copy is built. */
  status: GoloStatus | null;
  /** Group sizes GoLo scores as this one game, when narrower than the format's own. */
  scoredFor?: { min: number; max: number };
  /** Registry summaries and limits, each with the answers it applies under. */
  lines: readonly Line[];
};

export type FormatCopy = {
  name: string;
  /** Lines in order; the first that applies is the card's one-line summary. */
  summary: readonly Line[];
  /** Why it fits this group, whatever the ranking: the first lines under "Why it fits". */
  fit: readonly Line[];
  guide: { href: string; label: string };
  more?: { href: string; label: string };
  tradeoff: readonly Line[];
  /** What the group agrees before the first tee: house rules, not Rules of Golf. */
  agree: readonly Line[];
  /** The rank reasons this format can be given, in the words for this format. */
  reasons: Partial<Record<RankReason, readonly Line[]>>;
  /** Why it's ruled out, by rule. */
  ruledOut: Record<ExcludeReason, string>;
  golo: GoloCopy;
};

/** The "In GoLo" verdicts. Which one shows depends only on the registry status and scoredFor. */
export type GoloLabels = { scored: string; notOneGame: string; testing: string; notScored: string };

export type ChooserCopy = {
  formats: Record<FormatId, FormatCopy>;
  golo: GoloLabels;
  /** Shown when nothing fits, keyed by the rule every format failed on, or general. */
  empty: { teamsTooFew: string; general: string };
  relaxations: { partners: Record<Exclude<Partners, "either">, string>; scoring: Record<Exclude<Scoring, "simple">, string> };
};

function applies(when: When | undefined, answers: Answers): boolean {
  if (!when) return true;
  const players = answers.players ?? 0;
  if (when.players?.min !== undefined && players < when.players.min) return false;
  if (when.players?.max !== undefined && players > when.players.max) return false;
  if (when.handicaps && !when.handicaps.includes(answers.handicaps ?? "unanswered")) return false;
  // Unanswered holes are read as 18, the default round.
  if (when.holes && !when.holes.includes(answers.holes ?? "18")) return false;
  if (when.unevenTeams && evenTeams(players)) return false;
  return true;
}

export function linesFor(lines: readonly Line[] | undefined, answers: Answers): Line[] {
  return (lines ?? []).filter((line) => applies(line.when, answers));
}

export function firstLine(lines: readonly Line[], answers: Answers): Line | undefined {
  return lines.find((line) => applies(line.when, answers));
}

/**
 * What GoLo does with a format for this many players. Scored only when the
 * registry says live and the group is a size GoLo scores it at; a testing,
 * planned or missing entry is never shown as scored.
 */
export function goloVerdict(golo: GoloCopy, players: number | null, labels: GoloLabels): { scored: boolean; label: string } {
  if (golo.status === "live") {
    const range = golo.scoredFor;
    const fits = !range || players === null || (players >= range.min && players <= range.max);
    return fits ? { scored: true, label: labels.scored } : { scored: false, label: labels.notOneGame };
  }
  if (golo.status === "testing") return { scored: false, label: labels.testing };
  return { scored: false, label: labels.notScored };
}

export type PickView = {
  id: FormatId;
  rank: number;
  name: string;
  summary: string;
  guide: { href: string; label: string };
  more?: { href: string; label: string };
  why: Line[];
  tradeoff?: Line;
  agree: Line[];
  golo: { scored: boolean; label: string; lines: Line[] };
};

export function pickView(id: FormatId, rank: number, reasons: readonly RankReason[], answers: Answers, copy: ChooserCopy): PickView {
  const format = copy.formats[id];
  const verdict = goloVerdict(format.golo, answers.players, copy.golo);
  return {
    id,
    rank,
    name: format.name,
    summary: firstLine(format.summary, answers)?.text ?? "",
    guide: format.guide,
    more: format.more,
    why: [...linesFor(format.fit, answers), ...reasons.flatMap((reason) => linesFor(format.reasons[reason], answers))],
    tradeoff: firstLine(format.tradeoff, answers),
    agree: linesFor(format.agree, answers),
    golo: { scored: verdict.scored, label: verdict.label, lines: linesFor(format.golo.lines, answers) },
  };
}

export type ChooserView =
  | { status: "needs-players" }
  | {
      status: "ok";
      picks: PickView[];
      alsoFits: { id: FormatId; name: string; href: string }[];
      ruledOut: { id: FormatId; name: string; reasons: string[] }[];
    }
  | {
      status: "empty";
      message: string;
      relaxations: (Relaxation & { label: string })[];
      ruledOut: { id: FormatId; name: string; reasons: string[] }[];
    };

const TEAM_STYLES: readonly Style[] = ["teams", "rotating"];

export function chooserView(answers: Answers, copy: ChooserCopy): ChooserView {
  const result = choose(answers);
  if (result.status === "needs-players") return result;
  const ruledOut = result.ruledOut.map(({ id, reasons }) => ({
    id,
    name: copy.formats[id].name,
    reasons: reasons.map((reason) => copy.formats[id].ruledOut[reason]),
  }));
  if (result.status === "empty") {
    // Every team format fails on size: say that, rather than the general line.
    const teamsTooFew =
      answers.partners === "teams" &&
      result.ruledOut
        .filter(({ id }) => TEAM_STYLES.includes(formatRule(id).style))
        .every(({ reasons }) => reasons.includes("players"));
    return {
      status: "empty",
      message: teamsTooFew ? copy.empty.teamsTooFew : copy.empty.general,
      relaxations: result.relaxations.map((r) => ({
        ...r,
        label:
          r.question === "partners"
            ? copy.relaxations.partners[r.value as Exclude<Partners, "either">]
            : copy.relaxations.scoring[r.value as Exclude<Scoring, "simple">],
      })),
      ruledOut,
    };
  }
  return {
    status: "ok",
    picks: result.picks.map((p) => pickView(p.id, p.rank, p.reasons, answers, copy)),
    alsoFits: result.alsoFits.map((id) => ({ id, name: copy.formats[id].name, href: copy.formats[id].guide.href })),
    ruledOut,
  };
}

/* -------------------------------------------------------- the rules table */

/** Words for the table's derived cells. {n}, {min} and {max} are player counts. */
export type TableWords = {
  simple: { always: string; never: string; only: string; upTo: string };
  golo: { yes: string; yesFor: string; testing: string; no: string };
};

/** "Simple?", from the same rule "keep it simple" applies. */
export function simpleCell(rule: FormatRule, words: TableWords["simple"]): string {
  if (rule.simpleUpTo >= rule.players.max) return words.always;
  if (rule.simpleUpTo < rule.players.min) return words.never;
  return (rule.simpleUpTo === rule.players.min ? words.only : words.upTo).replace("{n}", String(rule.simpleUpTo));
}

/** "In GoLo", from the same registry status and sizes the cards' verdict uses. */
export function goloCell(rule: FormatRule, golo: GoloCopy, words: TableWords["golo"]): string {
  if (golo.status === "testing") return words.testing;
  if (golo.status !== "live") return words.no;
  const range = golo.scoredFor;
  if (!range || (range.min <= rule.players.min && range.max >= rule.players.max)) return words.yes;
  return words.yesFor.replace("{min}", String(range.min)).replace("{max}", String(range.max));
}
