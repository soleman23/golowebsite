/**
 * The chooser's answers in the query string, so a result can be shared:
 * /games/chooser?players=4&partners=teams&handicaps=apart&scoring=simple&holes=9
 *
 * The URL is whatever someone pasted, so nothing in it is trusted. Each
 * parameter is checked against its own allow-list and taken or dropped on its
 * own: one bad value doesn't cost the others. A parameter given twice with
 * different values is ambiguous and dropped. Parameters the chooser doesn't
 * own (utm_source, say) are left alone, both when reading and when the page
 * rewrites its own. Every value is a closed set or a small integer, so no
 * free text or personal data can travel in this URL.
 */

import { NO_ANSWERS, type Answers } from "./engine";
import { CHOOSER_PATH, QUESTIONS, isChooserParam } from "./params";

export { CHOOSER_PATH, QUESTIONS, isChooserParam };

export type Question = keyof Answers;

/** A raw value, already checked by isChooserParam, as its answer type. */
function parseValue(question: Question, raw: string): Answers[Question] | undefined {
  if (!isChooserParam(question, raw)) return undefined;
  return question === "players" ? Number(raw) : (raw as Answers[Question]);
}

/**
 * Only the chooser's own parameters, valid or not, in question order, as a
 * comparable string. Two URLs with the same chooserQuery say the same thing
 * to the chooser, whatever else they carry.
 */
export function chooserQuery(search: string | URLSearchParams): string {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const own = new URLSearchParams();
  for (const question of QUESTIONS) for (const value of params.getAll(question)) own.append(question, value);
  return own.toString();
}

export type ParsedAnswers = {
  answers: Answers;
  /**
   * Chooser parameters that were present but not used, in question order:
   * a bad or disputed value, or a misspelt key for a question left blank.
   */
  dropped: Question[];
};

/** A key folded for comparison: lower case, one trailing "s" dropped ("Player", "HOLE"). */
function folded(key: string): string {
  return key.toLowerCase().replace(/s$/, "");
}

/**
 * A parameter that isn't one of the chooser's but is plainly meant as one: a
 * different case or a singular/plural slip, carrying a value that question
 * accepts (`?player=4`, `?Holes=9`). It's reported like a bad value, so the
 * visitor is told, and left out when the page rewrites its URL. A third
 * party's own key that happens to look alike (`?partner=acme`) has a value
 * no question accepts, so it's left alone, as are campaign and click ids.
 */
function misspeltFor(key: string, value: string): Question | undefined {
  return QUESTIONS.find((question) => key !== question && folded(key) === folded(question) && isChooserParam(question, value));
}

function misspelt(params: URLSearchParams, question: Question): boolean {
  for (const [key, value] of params) if (misspeltFor(key, value) === question) return true;
  return false;
}

export function parseAnswers(search: string | URLSearchParams): ParsedAnswers {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const answers: Answers = { ...NO_ANSWERS };
  const dropped: Question[] = [];
  for (const question of QUESTIONS) {
    const raw = params.getAll(question);
    if (!raw.length) {
      if (misspelt(params, question)) dropped.push(question);
      continue;
    }
    const values = new Set(raw);
    const value = values.size === 1 ? parseValue(question, raw[0]) : undefined;
    if (value === undefined) dropped.push(question);
    else (answers as Record<Question, unknown>)[question] = value;
  }
  return { answers, dropped };
}

/**
 * The query string for these answers, unanswered questions left out, with
 * any parameters the chooser doesn't own kept after its own. "" when there's
 * nothing to write.
 */
export function serializeAnswers(answers: Answers, keep?: string | URLSearchParams): string {
  const params = new URLSearchParams();
  for (const question of QUESTIONS) {
    const value = answers[question];
    if (value !== null) params.set(question, String(value));
  }
  const others = typeof keep === "string" ? new URLSearchParams(keep) : keep;
  others?.forEach((value, key) => {
    if (!(QUESTIONS as readonly string[]).includes(key) && !misspeltFor(key, value)) params.append(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function sameAnswers(a: Answers, b: Answers): boolean {
  return QUESTIONS.every((question) => a[question] === b[question]);
}

/** A short, closed-set label for analytics: "4/teams/apart/simple/18", "-" where unanswered. */
export function answersKey(answers: Answers): string {
  return QUESTIONS.map((question) => (answers[question] === null ? "-" : String(answers[question]))).join("/");
}
