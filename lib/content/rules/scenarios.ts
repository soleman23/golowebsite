/**
 * The 12 common situations, in display order (docs/rules/inventory.md
 * § Common situations). Each is `planned` until its batch writes it: #240
 * (the seven P0) and #241 (the five P1). Questions are working titles; the
 * batches refine them. Sources are the citations docs/rules/source-map.md
 * expects; a writer may add subrules that exist there.
 */

import {
  definitionSource as def,
  handicapSource,
  localRuleSource,
  rogSource as rog,
} from "./sources";
import type { RulesScenario } from "./types";

/** Rules of Handicapping 3.3, for the conceded-putt posting caveat. */
const ROH_3_3 =
  "https://www.usga.org/handicapping/roh/Content/rules/3%203%20WhenHoleStartedbutPlayerDoesNotHoleOut.htm";

type Planned = Pick<RulesScenario, "id" | "question" | "aliases" | "primaryRule" | "sources"> &
  Partial<RulesScenario>;

function situation(fields: Planned): RulesScenario {
  return {
    slug: fields.id,
    answer: "",
    conditions: [],
    options: [],
    relatedGlossaryIds: [],
    relatedContentPaths: [],
    edition: "2023",
    status: "planned",
    ...fields,
  };
}

export const rulesScenarios: RulesScenario[] = [
  // P0 (#240)
  situation({
    id: "lost-ball",
    question: "Lost ball: what happens next?",
    aliases: ["lost ball", "can't find my ball", "ball not found", "three minutes", "search time"],
    primaryRule: 18,
    sources: [
      rog("18.2a"), rog("18.2b"), rog("7.1"), rog("7.2"),
      rog("17.1c"), rog("16.1e"), rog("9.6"),
      def("Lost"), def("Known or Virtually Certain"), localRuleSource("E-5"),
    ],
  }),
  situation({
    id: "provisional-ball",
    question: "When may I play a provisional ball?",
    aliases: ["provisional", "reload", "hit another one", "play a provisional"],
    primaryRule: 18,
    sources: [rog("18.3a"), rog("18.3b"), rog("18.3c"), def("Provisional Ball")],
  }),
  situation({
    id: "out-of-bounds",
    question: "Ball out of bounds: can I drop near the fairway?",
    aliases: [
      "OB", "out of bounds", "white stakes", "white line", "boundary",
      "E-5", "drop near the fairway", "two-stroke drop",
    ],
    primaryRule: 18,
    sources: [
      rog("18.2a"), rog("18.2b"),
      def("Out of Bounds"), def("Boundary Object"), localRuleSource("E-5"),
    ],
  }),
  situation({
    id: "red-vs-yellow-penalty-areas",
    question: "Red vs yellow penalty areas",
    aliases: [
      "water hazard", "lateral hazard", "red stakes", "yellow stakes",
      "red line", "yellow line", "pond", "creek", "lake",
    ],
    primaryRule: 17,
    sources: [rog("17.1a"), rog("17.1b"), rog("17.1c"), rog("17.1d"), def("Penalty Area")],
    relatedGlossaryIds: ["penalty-area"],
  }),
  situation({
    id: "unplayable-ball",
    question: "Unplayable ball in the rough or a bunker",
    aliases: ["unplayable", "unplayable lie", "declare it unplayable", "in a bush", "tree roots"],
    primaryRule: 19,
    sources: [rog("19.1"), rog("19.2"), rog("19.3a"), rog("19.3b")],
    relatedGlossaryIds: ["bunker"],
  }),
  situation({
    id: "bunker-sand",
    question: "Can I touch the sand in a bunker?",
    aliases: ["sand trap", "trap", "ground the club", "practice swing in a bunker", "rake"],
    primaryRule: 12,
    sources: [rog("12.2a"), rog("12.2b"), rog("12.3"), def("Bunker"), def("Loose Impediment")],
    relatedGlossaryIds: ["bunker"],
  }),
  situation({
    id: "cart-path",
    question: "Ball against a cart path",
    aliases: [
      "cart path", "path", "sprinkler head", "immovable obstruction",
      "free drop", "free relief", "nearest point of relief",
    ],
    primaryRule: 16,
    sources: [
      rog("16.1a"), rog("16.1b"), rog("14.3"),
      def("Immovable Obstruction"), def("Nearest Point of Complete Relief"), def("Relief Area"),
    ],
  }),

  // P1 (#241)
  situation({
    id: "temporary-water",
    question: "Temporary water or ground under repair",
    aliases: [
      "casual water", "puddle", "GUR", "ground under repair", "white circle",
      "standing water", "abnormal course condition",
    ],
    primaryRule: 16,
    sources: [
      rog("16.1a"), rog("16.1b"), rog("16.1c"), rog("16.1d"), rog("16.1e"),
      def("Abnormal Course Condition"), def("Temporary Water"), def("Ground Under Repair"),
    ],
  }),
  situation({
    id: "ball-moved",
    question: "My ball moved after it stopped",
    aliases: ["ball moved", "ball moved at address", "wind moved my ball", "accidentally moved my ball"],
    primaryRule: 9,
    sources: [rog("9.2"), rog("9.3"), rog("9.4"), rog("9.5"), rog("9.6"), def("Moved")],
  }),
  situation({
    id: "mark-lift-clean",
    question: "When can I mark, lift and clean my ball?",
    aliases: [
      "mark my ball", "clean my ball", "lift and clean", "preferred lies",
      "lift clean and place", "winter rules",
    ],
    primaryRule: 14,
    sources: [
      rog("14.1a"), rog("14.1b"), rog("14.1c"), rog("14.2"), rog("13.1b"),
      localRuleSource("E-3"),
    ],
  }),
  situation({
    id: "repairing-the-green",
    question: "Can I repair damage on the putting green?",
    aliases: ["ball mark", "pitch mark", "spike mark", "repair the green", "fix a ball mark"],
    primaryRule: 13,
    sources: [rog("13.1c"), def("Putting Green")],
    relatedGlossaryIds: ["putt"],
  }),
  situation({
    id: "conceded-putt",
    question: "Does a conceded putt count?",
    aliases: ["gimme", "concede", "conceded putt", "that's good", "inside the leather"],
    primaryRule: 3,
    sources: [rog("3.2b"), rog("3.3c"), handicapSource("3.3", ROH_3_3)],
    relatedGlossaryIds: ["gimme", "match-play", "stroke-play"],
  }),
];
