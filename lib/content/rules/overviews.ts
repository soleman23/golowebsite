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
      "Rule 12 covers playing from a bunker: when your ball is in one, and what you may touch before the stroke. It's in if any part touches sand inside the edge, or rests on something there, like a rake; on grass or soil inside the edge, not touching sand, it isn't. Before playing, you can't touch the sand to test it, with the club just in front of or behind the ball, or in a practice swing or backswing. Each costs the general penalty: two strokes in stroke play, loss of the hole in match play. Digging in your feet or moving a rake is fine. Once your ball is out, or you're taking relief outside, you can rake.",
    commonQuestions: [
      "Is my ball in the bunker if it's on grass inside the edge?",
      "Can my practice swing brush the sand?",
      "Can I move a rake, leaves or a stone before I play from the sand?",
      "When can I smooth the sand?",
    ],
    relatedGlossaryIds: ["bunker", "sandy"],
    sources: opened(OPENED_238, ["12", "12.1", "12.2a", "12.2b"], ["General Penalty"]),
    status: "in-review",
  }),
  rule(13, {
    aliases: ["flagstick", "wrong green"],
    summary:
      "Rule 13 covers the putting green, where you may do things not allowed elsewhere. You can mark, lift, clean and replace your ball, and repair ball marks, spike marks and old hole plugs, but not aeration holes or natural wear. Accidentally moving your ball or marker there costs nothing; replace it. Decide before each stroke whether the flagstick stays in; a putt that hits it is played as it lies, without penalty. If your ball hangs on the lip, you get time to reach the hole, then ten seconds; if it drops later, it counts but adds a penalty stroke. If your ball is on another hole's green, or one is in your stance or swing, take free relief.",
    commonQuestions: [
      "Can I fix a ball mark or spike mark on my putting line?",
      "Can I putt with the flagstick in?",
      "How long can I wait for a ball hanging on the lip?",
      "My ball is on the wrong green: can I putt it from there?",
    ],
    relatedGlossaryIds: ["putt"],
    sources: opened(
      OPENED_238,
      ["13", "13.1b", "13.1c", "13.1d", "13.1f", "13.2a", "13.2b", "13.3a"],
      ["Wrong Green"],
    ),
    status: "in-review",
  }),
  rule(14, {
    aliases: ["wrong place"],
    summary:
      "Rule 14 covers the procedures behind relief: marking, lifting, replacing and dropping a ball, and playing from a wrong place. Mark the spot before lifting a ball you'll replace; skipping that costs a penalty stroke. Drop from knee height, straight down, into the relief area, usually one or two club-lengths from a reference point, where it must stay; if it rolls out twice, place it where the second drop landed. A wrong drop, placement or replacement can be redone free before you play the ball. Playing from a wrong place costs the general penalty, two strokes or loss of the hole in match play; in stroke play, a serious breach must be corrected before the next tee, or you're disqualified.",
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
    status: "in-review",
  }),
  rule(15, {
    summary:
      "Rule 15 covers two kinds of things you can usually move out of the way without penalty. Loose impediments are unattached natural objects, such as leaves, twigs and stones. Movable obstructions are artificial objects you can move with reasonable effort and without damage, such as rakes, bottles and towels. Off the putting green and teeing area, if removing a loose impediment moves your ball, replace it and add a penalty stroke; if removing a movable obstruction moves it, just replace it. If your ball sits on a movable obstruction, lift it, remove the object and drop within one club-length of the spot beneath, no nearer the hole; on the green, place it there.",
    commonQuestions: [
      "Can I move a twig or a leaf that's touching my ball?",
      "My ball is resting against a rake: what do I do?",
      "My ball stopped on a towel or a headcover: how do I take relief?",
      "Another ball is near my line: can I ask for it to be marked and lifted?",
    ],
    sources: opened(
      OPENED_238,
      ["15", "15.1a", "15.1b", "15.2a", "15.3b"],
      ["Loose Impediment", "Movable Obstruction"],
    ),
    status: "in-review",
  }),
  rule(16, {
    aliases: ["plugged ball", "embedded ball", "casual water"],
    summary:
      "Rule 16 covers free relief from abnormal course conditions (ground under repair, temporary water, animal holes and immovable obstructions such as paved paths), from dangerous animals, and for a ball in the general area that plugs in its own pitch-mark. A condition has to interfere with your lie, stance or swing, or, on the green, your line; one that only distracts you doesn't count. In the general area, find the nearest point of complete relief: the closest spot, no nearer the hole, free of the condition for the shot you'd have played. Drop within one club-length of it, no nearer the hole and clear of the condition. None of this applies in a penalty area, except dangerous-animal relief.",
    commonQuestions: [
      "My ball is on a cart path: where do I drop?",
      "Does a soggy patch of fairway count as temporary water?",
      "My ball plugged in the rough: do I get a free drop?",
      "Can I move my ball away from a snake or a swarm of bees?",
    ],
    sources: opened(
      OPENED_238,
      ["16", "16.1a", "16.1b", "16.2a", "16.2b", "16.3a", "16.3b"],
      [
        "Abnormal Course Condition",
        "Ground Under Repair",
        "Obstruction",
        "Nearest Point of Complete Relief",
        "Club-Length",
        "Temporary Water",
        "Embedded",
      ],
    ),
    status: "in-review",
  }),

  // Relief and penalties
  rule(17, {
    aliases: ["water hazard"],
    summary:
      "Rule 17 covers penalty areas: any body of water on the course plus other areas the Committee defines, marked red or yellow (unmarked counts as red). You can play the ball as it lies, grounding the club and moving loose impediments as in the general area. Or, for one penalty stroke, replay from where you last played, or drop outside the area on a line back from the hole through where the ball last crossed into it. Red adds a drop outside it within two club-lengths of that point, no nearer the hole. Without finding the ball, you need it known or virtually certain (at least 95 percent likely) to be in the area; otherwise it's lost, under Rule 18.",
    commonQuestions: [
      "Red stakes or yellow stakes: what's the difference?",
      "Can I ground my club or move leaves in a penalty area?",
      "Nobody saw my ball go in the water: can I still drop by the pond?",
      "Can I declare my ball unplayable in a penalty area?",
    ],
    relatedGlossaryIds: ["penalty-area"],
    sources: opened(
      OPENED_238,
      ["17", "17.1b", "17.1c", "17.1d", "17.3"],
      ["Penalty Area", "Club-Length", "Known or Virtually Certain"],
    ),
    status: "in-review",
  }),
  rule(18, {
    aliases: ["OB"],
    summary:
      "Rule 18 covers stroke and distance: one penalty stroke, then replay from where you last played. It's always available, and required for a ball out of bounds, or for a lost ball unless Rule 18.2b allows other relief, as when it's known or virtually certain the ball is in a penalty area. A ball is lost if it isn't found within three minutes of you or your caddie starting to look; it's out of bounds only if all of it lies past the boundary's course-side edge, usually white stakes or lines. If your ball might be out of bounds, or lost somewhere other than a penalty area, you may hit a provisional ball, but call it a provisional first.",
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
      ["Stroke and Distance", "Lost", "Out of Bounds", "Known or Virtually Certain", "Provisional Ball"],
    ),
    status: "in-review",
  }),
  rule(19, {
    summary:
      "Rule 19 lets you treat your ball as unplayable anywhere except a penalty area, and only you can make that call. Each option costs one penalty stroke: play again from where you last played; drop on a line back from the hole through the ball's spot, as far back as you like; or drop within two club-lengths of the ball, no nearer the hole, measuring from the ground beneath it if it's up a tree. Only stroke and distance works if you can't find the ball. In a bunker, the two drops stay in the bunker, or you can drop back on the line outside it for two penalty strokes in total.",
    commonQuestions: [
      "My ball is under a bush: what are my options?",
      "Can I declare my ball unplayable in a bunker?",
      "Can I take unplayable relief if I can't find my ball?",
      "My ball is stuck in a tree: where do I drop?",
    ],
    relatedGlossaryIds: ["bunker"],
    sources: opened(
      OPENED_238,
      ["19", "19.1", "19.2", "19.2a", "19.2b", "19.2c", "19.3a", "19.3b"],
      ["Club-Length"],
    ),
    status: "in-review",
  }),

  // Rulings, formats and accessibility
  rule(20),
  rule(21, { relatedGlossaryIds: ["stableford", "scramble"] }),
  rule(22, { relatedGlossaryIds: ["foursomes"] }),
  rule(23, { relatedGlossaryIds: ["four-ball"] }),
  rule(24),
  rule(25),
];
