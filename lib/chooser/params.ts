/**
 * The chooser's query parameters and the values each accepts, with nothing
 * else in the module. lib/analyticsPreference.ts runs on every page and
 * imports isChooserParam from here; keeping the rules engine out of this file
 * keeps it out of every page's bundle. engine.ts and url.ts build on these.
 */

/** The one route that reads these parameters. */
export const CHOOSER_PATH = "/games/chooser";

export const PARTNER_VALUES = ["solo", "teams", "either"] as const;
export const HANDICAP_VALUES = ["close", "apart", "none"] as const;
export const SCORING_VALUES = ["simple", "more"] as const;
export const HOLE_VALUES = ["18", "9"] as const;

/** Query-string order, and the order questions are asked. */
export const QUESTIONS = ["players", "partners", "handicaps", "scoring", "holes"] as const;

/** 2 to 12, written plainly: no sign, no leading zero, no decimals. */
export const PLAYERS_PATTERN = /^(?:[2-9]|1[0-2])$/;

const VALUES: Record<(typeof QUESTIONS)[number], (value: string) => boolean> = {
  players: (v) => PLAYERS_PATTERN.test(v),
  partners: (v) => (PARTNER_VALUES as readonly string[]).includes(v),
  handicaps: (v) => (HANDICAP_VALUES as readonly string[]).includes(v),
  scoring: (v) => (SCORING_VALUES as readonly string[]).includes(v),
  holes: (v) => (HOLE_VALUES as readonly string[]).includes(v),
};

/**
 * Whether one query parameter is a chooser answer the chooser would accept.
 * lib/analyticsPreference.ts keeps exactly these on CHOOSER_PATH when it
 * cleans the URL before analytics loads, so a shared link survives it.
 */
export function isChooserParam(key: string, value: string): boolean {
  return Object.hasOwn(VALUES, key) && VALUES[key as (typeof QUESTIONS)[number]](value);
}
