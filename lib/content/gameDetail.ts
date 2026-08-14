/**
 * Long-form per-game content, keyed by slug. Populated by prompt 03 (Nassau).
 * A slug only earns an entry here once its copy is written — see games.ts.
 */

export type GameDetail = {
  slug: string;
  kicker: string;
  title: string;
  lead: string;
};

export const gameDetails: Record<string, GameDetail> = {};
