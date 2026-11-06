/**
 * The 25 rule overviews (docs/rules/inventory.md § Rule overviews). Each is
 * `planned` until its content batch writes it: #237 (Rules 1–11), #238
 * (12–19), #239 (20–25). Titles and categories come from the number, so a
 * record only carries what an editor writes.
 *
 * docs/rules/review-packet-overviews.md maps every factual sentence to the
 * subrule it rests on, with the reviewers' findings and the copy-distance
 * result for each batch.
 */

import { definitionSource, rogSource } from "./sources";
import type { RuleOverview, RulesSource } from "./types";

type Written = Partial<Omit<RuleOverview, "id" | "number" | "edition">>;

/** #238 (Rules 12–19): the day its rule pages and Definitions were opened. */
const OPENED_238 = "2026-11-06";

/** Rule pages and Definitions a record rests on, each opened on `on`. */
function opened(on: string, refs: string[], terms: string[] = []): RulesSource[] {
  return [
    ...refs.map((ref) => rogSource(ref, on)),
    ...terms.map((term) => definitionSource(term, on)),
  ];
}

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
  rule(12, {
    summary:
      "Rule 12 covers playing from a bunker: when your ball counts as in one, and what you may touch before the stroke. A ball is in the bunker when any part of it touches sand inside the edge; one sitting on grass inside the edge without touching sand is not. Before you play, you can't touch the sand to test it, or with the club just in front of or behind the ball, in a practice swing or on the backswing. That is the general penalty: two strokes in stroke play, loss of the hole in match play. Digging in your feet and moving leaves or a rake are fine. Once the ball is played out, rake away.",
    commonQuestions: [
      "Is my ball in the bunker if it's on grass inside the edge?",
      "Can my practice swing brush the sand?",
      "Can I move a rake, leaves or a stone before I play from the sand?",
      "My ball is unplayable in a bunker: what are my options?",
    ],
    relatedGlossaryIds: ["bunker", "sandy"],
    sources: opened(OPENED_238, ["12", "12.1", "12.2a", "12.2b", "12.3"], ["General Penalty"]),
    status: "draft",
  }),
  rule(13, {
    aliases: ["flagstick", "wrong green"],
    summary:
      "Rule 13 covers the putting green, where several things not allowed elsewhere are fine. You can mark, lift and clean your ball, then replace it on its spot. You can repair ball marks, spike marks and old hole plugs, but not aeration holes, bare patches or natural wear of the hole. Accidentally moving your ball or marker on the green carries no penalty; put it back. Decide before each stroke whether the flagstick stays in or comes out. If your ball hits a flagstick left in the hole, there's no penalty and you play it as it lies. A ball hanging over the lip gets the time to reach the hole plus ten seconds to fall in.",
    commonQuestions: [
      "Can I fix a ball mark or spike mark on my putting line?",
      "Should I leave the flagstick in or take it out?",
      "How long can I wait for a ball hanging on the lip?",
      "My ball is on another hole's green: can I putt it from there?",
    ],
    relatedGlossaryIds: ["putt"],
    sources: opened(
      OPENED_238,
      ["13", "13.1b", "13.1c", "13.1d", "13.1f", "13.2a", "13.2b", "13.3a"],
      ["Wrong Green"],
    ),
    status: "draft",
  }),
  rule(14, {
    aliases: ["wrong place"],
    summary:
      "Rule 14 is the procedure behind most relief: marking and lifting a ball, putting it back, dropping it, and playing from the wrong spot. Before lifting a ball you'll replace, mark the spot just behind or beside it with a ball-marker or a club held on the ground; lifting it unmarked costs one penalty stroke. Drop from knee height so the ball falls straight down; it must land in and stay in the relief area, usually one or two club-lengths from a reference point. If it rolls out twice, place it where the second drop first hit the ground. Mistakes can be fixed without penalty before you play the ball. Playing from a wrong place is the general penalty.",
    commonQuestions: [
      "Do I have to mark my ball before lifting it?",
      "How do I drop, and what if the ball rolls out of the relief area?",
      "I dropped in the wrong spot: can I pick it up and drop again?",
      "I played from the wrong place in stroke play: what now?",
    ],
    sources: opened(
      OPENED_238,
      ["14", "14.1a", "14.3b", "14.3c", "14.5a", "14.7a", "14.7b"],
      ["Relief Area", "Club-Length", "General Penalty"],
    ),
    status: "draft",
  }),
  rule(15, {
    summary:
      "Rule 15 covers things you may move out of the way for free: loose impediments, meaning unattached natural objects such as leaves, twigs and stones, and movable obstructions, artificial objects such as rakes, bottles and towels that shift without much effort or damage. You can usually remove either without penalty. The catch is a loose impediment near your ball: away from the putting green and the teeing area, if removing one moves your ball, replace it and add one penalty stroke. If moving an obstruction shifts your ball, there's no penalty; replace it. Sand, loose soil and dew aren't loose impediments. You can also have another player mark and lift a ball that could interfere with your play.",
    commonQuestions: [
      "Can I move a twig or a leaf that's touching my ball?",
      "My ball is resting against a rake: what do I do?",
      "My ball stopped on a towel or a headcover: how do I take relief?",
      "Another ball is near my line: can I ask for it to be marked and lifted?",
    ],
    sources: opened(
      OPENED_238,
      ["15", "15.1a", "15.1b", "15.2a", "15.3a", "15.3b"],
      ["Loose Impediment", "Movable Obstruction"],
    ),
    status: "draft",
  }),
  rule(16, {
    aliases: ["plugged ball", "embedded ball", "casual water"],
    summary:
      "Rule 16 covers free relief from abnormal course conditions (animal holes, ground under repair, temporary water and immovable obstructions such as cart paths), from dangerous animals, and for a ball in the general area that plugs in its own pitch-mark. You need real interference with your ball, stance or swing, or on the green your line; one that only distracts you doesn't count. In the general area, find the nearest point of complete relief, the closest spot no nearer the hole where the condition no longer affects the shot you'd have played, and drop within one club-length of it, no nearer the hole. A ball in a penalty area gets none of this, except from a dangerous animal.",
    commonQuestions: [
      "My ball is on a cart path: where do I drop?",
      "Does a soggy patch of fairway count as temporary water?",
      "My ball plugged in the rough: do I get a free drop?",
      "Can I move my ball away from a snake or a swarm of bees?",
    ],
    sources: opened(
      OPENED_238,
      ["16", "16.1a", "16.1b", "16.1c", "16.1d", "16.2a", "16.2b", "16.3a", "16.3b"],
      ["Abnormal Course Condition", "Nearest Point of Complete Relief", "Club-Length", "Temporary Water", "Embedded"],
    ),
    status: "draft",
  }),

  // Relief and penalties
  rule(17, {
    aliases: ["water hazard"],
    summary:
      "Rule 17 covers penalty areas: any body of water on the course plus other areas the Committee defines, marked red or yellow (unmarked counts as red). You can play the ball as it lies, grounding the club and moving loose impediments as in the general area. Or, for one penalty stroke, replay from where you last played, or drop back on a line from the hole through where the ball last crossed into the area. Red adds a drop within two club-lengths of that point, no nearer the hole and outside the area. To take relief without finding the ball, it must be known or virtually certain, at least 95 percent likely, that it's in there.",
    commonQuestions: [
      "Red stakes or yellow stakes: what's the difference?",
      "Can I ground my club or move leaves in a penalty area?",
      "Nobody saw it go in the water: can I still drop by the pond?",
      "Can I declare my ball unplayable in a penalty area?",
    ],
    relatedGlossaryIds: ["penalty-area"],
    sources: opened(
      OPENED_238,
      ["17", "17.1b", "17.1c", "17.1d", "17.3"],
      ["Penalty Area", "Known or Virtually Certain"],
    ),
    status: "draft",
  }),
  rule(18, {
    aliases: ["OB"],
    summary:
      "Rule 18 covers stroke and distance: one penalty stroke, then replay from where you last played. It's always available, and required when a ball is out of bounds or lost, unless it's known or virtually certain that the ball is in a penalty area or another case Rule 18.2b lists. A ball not found three minutes after the search starts is lost; one is out of bounds only if all of it is past the boundary, usually white stakes or lines. If a shot might be out of bounds, or lost somewhere other than a penalty area, you may hit a provisional ball, but announce it first. Re-tee after an out-of-bounds drive and that shot is your third.",
    commonQuestions: [
      "How long can I look for my ball?",
      "Is a ball sitting on the white line in or out of bounds?",
      "When can I hit a provisional, and what do I have to say?",
      "I found my first ball after hitting a provisional: which do I play?",
    ],
    relatedGlossaryIds: ["mulligan"],
    sources: opened(
      OPENED_238,
      ["18", "18.1", "18.2a", "18.2b", "18.3a", "18.3b", "18.3c"],
      ["Lost", "Out of Bounds", "Known or Virtually Certain", "Provisional Ball"],
    ),
    status: "draft",
  }),
  rule(19, {
    summary:
      "Rule 19 lets you treat your ball as unplayable anywhere on the course except a penalty area, and only you can make that call. Each option costs one penalty stroke: play again from where you made your last stroke; drop on a line back from the hole through the ball's spot, as far back as you like; or drop within two club-lengths of the ball, no nearer the hole. The last two need you to know where the ball is. In a bunker, those two drops have to stay in the bunker, or you can drop back on the line outside it for two penalty strokes in total. For a ball in a penalty area, use Rule 17 instead.",
    commonQuestions: [
      "My ball is under a bush: what are my options?",
      "Can I declare my ball unplayable in a bunker?",
      "Can I take unplayable relief if I can't find my ball?",
      "My ball is stuck in a tree: where do I drop?",
    ],
    relatedGlossaryIds: ["bunker"],
    sources: opened(OPENED_238, ["19", "19.1", "19.2", "19.2a", "19.2b", "19.2c", "19.3a", "19.3b"]),
    status: "draft",
  }),

  // Rulings, formats and accessibility
  rule(20),
  rule(21, { relatedGlossaryIds: ["stableford", "scramble"] }),
  rule(22, { relatedGlossaryIds: ["foursomes"] }),
  rule(23, { relatedGlossaryIds: ["four-ball"] }),
  rule(24),
  rule(25),
];
