/**
 * The 25 rule overviews (docs/rules/inventory.md § Rule overviews). Each is
 * `planned` until its content batch writes it: #237 (Rules 1–11), #238
 * (12–19), #239 (20–25). Titles and categories come from the number, so a
 * record only carries what an editor writes.
 */

import { rogSource } from "./sources";
import type { RuleOverview } from "./types";

type Written = Partial<Omit<RuleOverview, "id" | "number" | "edition">>;

function rule(number: number, fields: Written = {}): RuleOverview {
  return {
    id: `rule-${number}`,
    number,
    aliases: [],
    summary: "",
    commonQuestions: [],
    relatedGlossaryIds: [],
    relatedContentPaths: [],
    edition: "2023",
    sources: [rogSource(String(number))],
    status: "planned",
    ...fields,
  };
}

export const ruleOverviews: RuleOverview[] = [
  // Foundations and equipment
  rule(1, {
    aliases: ["mulligan", "breakfast ball"],
    relatedGlossaryIds: ["mulligan", "breakfast-ball"],
  }),
  rule(2, { relatedGlossaryIds: ["teeing-area", "fairway", "rough", "bunker", "penalty-area"] }),
  rule(3, { relatedGlossaryIds: ["match-play", "stroke-play", "gimme", "net-score", "handicap-stroke"] }),
  rule(4, { aliases: ["14 clubs", "club limit"], relatedGlossaryIds: ["driver", "putter"] }),

  // Playing the round
  rule(5),
  rule(6, { aliases: ["wrong ball"], relatedGlossaryIds: ["teeing-area"] }),
  rule(7),
  rule(8),
  rule(9),
  rule(10, { aliases: ["advice"] }),
  rule(11),

  // Course areas and procedures
  rule(12, { relatedGlossaryIds: ["bunker", "sandy"] }),
  rule(13, { aliases: ["flagstick", "wrong green"], relatedGlossaryIds: ["putt"] }),
  rule(14, { aliases: ["wrong place"] }),
  rule(15),
  rule(16, { aliases: ["plugged ball", "embedded ball", "casual water"] }),

  // Relief and penalties
  rule(17, { aliases: ["water hazard"], relatedGlossaryIds: ["penalty-area"] }),
  rule(18, { aliases: ["OB"], relatedGlossaryIds: ["mulligan"] }),
  rule(19, { relatedGlossaryIds: ["bunker"] }),

  // Rulings, formats and accessibility
  rule(20),
  rule(21, { relatedGlossaryIds: ["stableford", "scramble"] }),
  rule(22, { relatedGlossaryIds: ["foursomes"] }),
  rule(23, { relatedGlossaryIds: ["four-ball"] }),
  rule(24),
  rule(25),
];
