/**
 * The 12 common situations, in display order (docs/rules/inventory.md
 * § Common situations). Each is `planned` until its batch writes it: #240
 * (the seven P0) and #241 (the five P1). Sources are the citations
 * docs/rules/source-map.md expects; a writer may add subrules that exist
 * there. docs/rules/review-packet-situations.md maps every factual sentence
 * to its source.
 */

import {
  definitionSource as def,
  handicapSource,
  localRuleSource,
  rogSource as rog,
} from "./sources";
import type { RulesScenario } from "./types";

/** The day batch 1 (#240) opened each of its sources. */
const P0_CHECKED = "2026-11-06";

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
      rog("18.2a", P0_CHECKED), rog("18.2b", P0_CHECKED), rog("18.1", P0_CHECKED), rog("7.1", P0_CHECKED),
      rog("7.2", P0_CHECKED), rog("17.1c", P0_CHECKED), rog("16.1e", P0_CHECKED), rog("9.6", P0_CHECKED),
      def("Lost", P0_CHECKED), def("Known or Virtually Certain", P0_CHECKED),
      localRuleSource("E-5", P0_CHECKED),
    ],
    answer:
      "A ball you haven't found within three minutes of starting to look is lost: add one penalty stroke and play again from the spot of your last stroke. The exception is when it's known or virtually certain what happened to it, such as going into a penalty area or ground under repair, or being moved by an animal after it stopped; then you take the relief for that case instead.",
    conditions: [
      "The three minutes start when you or your caddie begin looking, or your partner or their caddie in a team format. Time paused for a good reason, such as standing aside while another player plays, doesn't count toward the three minutes.",
      "Saying it's lost doesn't make it lost. You don't have to search the full three minutes, though: you can go back under stroke and distance at any time, and the first ball is then out of play even if it turns up (Rule 18.1).",
      "If a ball turns up in time but you can't tell it's yours, you get a reasonable time to identify it, even after the three minutes. If you can't, it's lost.",
      "Known or virtually certain means there's conclusive evidence, such as someone seeing it happen, or everything you can reasonably find out puts it at 95 percent likely or more. Possible or probable isn't enough, and only what you learn during the three minutes counts.",
    ],
    options: [
      "Stroke and distance: add one penalty stroke and play again from where you made your last stroke (Rule 18.2b).",
      "Known or virtually certain it's in a penalty area: use the penalty area relief options instead (Rule 17.1c).",
      "Known or virtually certain it's in an abnormal course condition, such as ground under repair or temporary water: take free relief, treating the point where it last crossed into the condition as the ball's spot when you find the nearest point of complete relief (Rule 16.1e).",
      "An animal, a spectator or another outside influence moved it after it came to rest on the course, and that's known or virtually certain: no penalty, and a ball goes on the spot where yours was, estimated if need be (Rule 9.6).",
    ],
    penalty:
      "Stroke and distance: one penalty stroke, and you play again from the spot of the previous stroke (Rule 18.2b).",
    example:
      "On the 7th your drive goes into thick trees on the right and nobody sees where it stops. Three minutes after you start looking it still hasn't turned up, so you go back to the tee, count a penalty stroke and hit your third shot.",
    localRuleCaveat:
      "If the Committee has adopted Model Local Rule E-5, you have one more option instead of going back: for two penalty strokes, drop in the general area between where the ball was estimated to finish and the nearest point of fairway, no nearer the hole. It's meant for general play, not professional or elite amateur events, and a group agreeing to play it isn't the Committee adopting it. It can't be used once you've played a provisional for that ball (only for the provisional itself), or for a ball that's known or virtually certain to have finished in a penalty area.",
    status: "in-review",
  }),
  situation({
    id: "provisional-ball",
    question: "When can I play a provisional ball?",
    aliases: ["provisional", "reload", "hit another one", "play a provisional"],
    primaryRule: 18,
    sources: [
      rog("18.3a", P0_CHECKED), rog("18.3b", P0_CHECKED), rog("18.3c", P0_CHECKED),
      def("Provisional Ball", P0_CHECKED), def("Stroke and Distance", P0_CHECKED),
    ],
    answer:
      "When your ball might be out of bounds or lost somewhere other than a penalty area, you can play a provisional to save time, as long as you tell someone first that it's a provisional. If the only place the ball could be is a penalty area, a provisional isn't allowed, and the second ball becomes your ball in play under stroke and distance.",
    conditions: [
      "Say the word provisional, or something that plainly means it, before you hit. \"I'll hit another\" or \"reloading\" doesn't count, and the ball you hit is then your ball in play under stroke and distance.",
      "If nobody is close enough to hear, you can play it and tell someone as soon as you can.",
      "A ball that could be in a penalty area still qualifies, as long as it could also be lost somewhere else or be out of bounds.",
      "You can keep playing the provisional, and it stays provisional, as long as each stroke with it is from no nearer the hole than where the original is thought to be.",
    ],
    options: [
      "The original turns up on the course, outside a penalty area, within three minutes and before the provisional has become your ball in play: play the original. The provisional and all its strokes no longer count (Rule 18.3c).",
      "The original is out of bounds, or lost anywhere except a penalty area: the provisional becomes your ball in play, under stroke and distance (Rule 18.3c). If it's known or virtually certain the original stopped in an abnormal course condition or was moved by an outside influence, you can take that Rule's relief instead.",
      "You play the provisional from nearer the hole than where the original is estimated to be: it becomes your ball in play, even if the original is then found (Rule 18.3c).",
      "The original is found in a penalty area, or it's known or virtually certain to be in one, before the provisional is in play: abandon the provisional, then play the original as it lies if you've found it, or take penalty area relief (Rule 18.3c).",
    ],
    penalty:
      "Once the provisional is your ball in play, it's under stroke and distance: you count the stroke with the original, one penalty stroke and every stroke with the provisional (Rule 18.3c; Definitions: Stroke and Distance).",
    example:
      "On the 12th your 3-wood fades toward the white stakes on the right. Before leaving the tee you say you're hitting a provisional and put it in the fairway. The first ball isn't found in three minutes, so the provisional is in play and your next shot is your fourth.",
    status: "in-review",
  }),
  situation({
    id: "out-of-bounds",
    question: "Out of bounds: can I drop near the fairway?",
    aliases: [
      "OB", "out of bounds", "white stakes", "white line", "boundary",
      "E-5", "drop near the fairway", "two-stroke drop",
    ],
    primaryRule: 18,
    sources: [
      rog("18.2a", P0_CHECKED), rog("18.2b", P0_CHECKED),
      def("Out of Bounds", P0_CHECKED), def("Boundary Object", P0_CHECKED),
      localRuleSource("E-5", P0_CHECKED),
    ],
    answer:
      "Not under the standard Rules: a ball out of bounds costs one penalty stroke, and you play again from where you made your last stroke. A drop near the fairway for two penalty strokes exists only where the Committee has adopted Model Local Rule E-5.",
    conditions: [
      "The whole ball has to be beyond the boundary edge to be out. If any part of it touches or hangs over the course side, it's in.",
      "With white stakes or a fence, the edge is the line joining their course-side faces at ground level, so the white stakes and fence posts are themselves out. With a painted line, the line itself is out.",
      "White stakes and boundary fences are boundary objects: they're treated as fixed even if they'd come out of the ground, and there's no free relief from them.",
      "Your feet can be out of bounds when you play a ball that's in.",
    ],
    options: [
      "Stroke and distance: one penalty stroke, then play again from where you made your last stroke (Rule 18.2b).",
      "Only if the Committee has adopted Model Local Rule E-5: for two penalty strokes, drop in the general area between where the ball last crossed the boundary and the nearest point of fairway, no nearer the hole.",
    ],
    penalty:
      "One penalty stroke, and you play again from the spot of the previous stroke (Rule 18.2b). Where the Committee has adopted Model Local Rule E-5, its drop costs two penalty strokes.",
    example:
      "On the 3rd your drive finishes a yard past the white stakes on the left. You tee up again, and your second drive is your third stroke. If the Committee has adopted Model Local Rule E-5, you could instead drop near the fairway for two penalty strokes and play your fourth.",
    localRuleCaveat:
      "Model Local Rule E-5 is something a Committee may adopt for general play, meaning casual rounds and a club's own competitions. It isn't in force unless adopted, a group agreeing to play it isn't the Committee adopting it, and the R&A says it doesn't suit professional or elite amateur events. It can't be used for a ball after you've played a provisional for it (only for the provisional itself), or for a ball that's known or virtually certain to have finished in a penalty area.",
    status: "in-review",
  }),
  situation({
    id: "red-vs-yellow-penalty-areas",
    question: "Red or yellow penalty area: what are my options?",
    aliases: [
      "water hazard", "lateral hazard", "red stakes", "yellow stakes",
      "red line", "yellow line", "pond", "creek", "lake",
    ],
    primaryRule: 17,
    sources: [
      rog("17.1a", P0_CHECKED), rog("17.1b", P0_CHECKED), rog("17.1c", P0_CHECKED), rog("17.1d", P0_CHECKED),
      def("Penalty Area", P0_CHECKED),
    ],
    answer:
      "In either color you can play it as it lies for free, or take relief outside the area for one penalty stroke. Yellow gives you two ways to do that: stroke and distance, or back on the line. Red adds a third: a drop within two club-lengths of the spot where your ball last crossed the edge, no nearer the hole.",
    conditions: [
      "The ball is in the penalty area if any part of it touches the ground or anything else inside the edge, or sits above the area. Red and yellow stakes and painted lines are part of the area.",
      "Back-on-the-line and lateral relief are measured from where the ball last crossed the edge, which isn't always where it ended up.",
      "If the ball isn't found, it has to be known or virtually certain, meaning conclusive evidence or at least 95 percent likely, that it's in the penalty area. If it isn't, and the three minutes run out, it's lost: stroke and distance (Rule 17.1c).",
      "The color is the Committee's choice: it doesn't have to use yellow at all and can mark every penalty area red. An area whose color hasn't been marked or indicated counts as red, and the color that matters is the one where your ball last crossed the edge.",
    ],
    options: [
      "Play it as it lies, red or yellow: no penalty, and the same Rules apply as anywhere in the general area (Rule 17.1b).",
      "Stroke and distance, red or yellow: one penalty stroke, play again from where you made your last stroke (Rule 17.1d).",
      "Back on the line, red or yellow: one penalty stroke, drop outside the penalty area on a line from the hole through the crossing point, as far back as you like. The ball has to finish within one club-length of where it first lands, in that same area of the course, and no nearer the hole than the crossing point (Rule 17.1d).",
      "Lateral relief, red only: one penalty stroke, drop within two club-lengths of the crossing point, no nearer the hole and outside that penalty area (Rule 17.1d).",
    ],
    penalty:
      "One penalty stroke for any relief option (Rule 17.1d). Playing the ball as it lies is free (Rule 17.1b).",
    example:
      "On the 14th your second shot, a 7-iron, clears a pond marked with red stakes, lands on the bank beyond it and spins back into the water. It last crossed the edge on the green side, so a lateral drop goes within two club-lengths of that point, no nearer the hole, and you play your fourth from there.",
    relatedGlossaryIds: ["penalty-area"],
    status: "in-review",
  }),
  situation({
    id: "unplayable-ball",
    question: "Unplayable ball in the rough or a bunker: what are my options?",
    aliases: ["unplayable", "unplayable lie", "declare it unplayable", "in a bush", "tree roots"],
    primaryRule: 19,
    sources: [
      rog("19.1", P0_CHECKED), rog("19.2", P0_CHECKED), rog("19.3a", P0_CHECKED), rog("19.3b", P0_CHECKED),
    ],
    answer:
      "You can treat your ball as unplayable anywhere except a penalty area, and you're the only one who can make that call. Each option costs one penalty stroke: stroke and distance, a drop behind the ball on a line running back from the hole, or a drop within two club-lengths of it. In a bunker those two drops stay in the bunker, unless you take two penalty strokes in total to go back on the line outside it.",
    conditions: [
      "Not in a penalty area: there the only relief is under the penalty area Rule.",
      "To drop back on the line or within two club-lengths, you need to know where the original ball is. Stroke and distance works even if you can't find the ball.",
      "For a ball up in a tree, measure the two club-lengths from the spot on the ground directly beneath it.",
      "In a bunker, the one-stroke back-on-the-line and two-club-length drops have to come to rest in the bunker.",
    ],
    options: [
      "Stroke and distance: one penalty stroke, play again from where you made your last stroke (Rule 19.2).",
      "Back on the line: one penalty stroke, drop anywhere behind the ball on a line that runs from the hole through it, as far back as you like. The ball has to finish within one club-length of where it first lands, in that same area of the course, and no nearer the hole than the ball's original spot (Rule 19.2).",
      "Lateral: one penalty stroke, drop within two club-lengths of the ball, no nearer the hole (Rule 19.2).",
      "Bunker only: two penalty strokes in total, drop back on the line outside the bunker (Rule 19.3b).",
    ],
    penalty:
      "One penalty stroke for any option (Rules 19.2 and 19.3a), or two in total to go back on the line outside a bunker (Rule 19.3b).",
    example:
      "On the 9th your wedge finishes in the sand under the steep front lip of a greenside bunker. A lateral drop in the bunker costs one penalty stroke; going back on the line outside the bunker costs two.",
    relatedGlossaryIds: ["bunker", "rough"],
    status: "in-review",
  }),
  situation({
    id: "bunker-sand",
    question: "Can I touch the sand in a bunker?",
    aliases: ["sand trap", "trap", "ground the club", "practice swing in a bunker", "rake"],
    primaryRule: 12,
    sources: [
      rog("12.2a", P0_CHECKED), rog("12.2b", P0_CHECKED), rog("12.3", P0_CHECKED),
      def("Bunker", P0_CHECKED), def("Loose Impediment", P0_CHECKED),
    ],
    answer:
      "Before your stroke, your club can't touch the sand right in front of or behind the ball, and it can't touch the sand at all on a practice swing or your backswing. You also can't touch the sand on purpose, with anything, to test it. Most other contact is fine: digging your feet in, leaning on a club, laying clubs or a rake down, smoothing sand to care for the course, or touching it while searching for your ball or removing loose impediments or movable obstructions.",
    conditions: [
      "The limits apply only before a stroke at a ball that's in the bunker.",
      "The grass lip or face and sand that has spilled outside the edge aren't part of the bunker, and neither are natural sand or waste areas unless the Committee has defined one as a bunker.",
      "An allowed touch still costs the general penalty if it improves your lie, the area of your stance or swing, or your line of play beyond what the Rules allow. Digging your feet in to take your stance is fine.",
      "Once your ball is out, or you've taken or decided on relief outside the bunker, you can touch and smooth the sand freely. If the ball comes back in, the limits apply again.",
      "Taking relief from a bunker works differently from elsewhere: Rule 16.1c covers conditions such as temporary water in a bunker, and Rule 19.3 an unplayable ball there (Rule 12.3).",
    ],
    penalty:
      "General penalty: two strokes in stroke play, loss of the hole in match play (Rule 12.2).",
    example:
      "On the 5th your ball is in a fairway bunker. Setting the rake down and digging your feet in before you play is fine; a practice swing that brushes the sand costs two strokes in stroke play.",
    relatedGlossaryIds: ["bunker"],
    status: "in-review",
  }),
  situation({
    id: "cart-path",
    question: "Ball on or near a cart path: do I get free relief?",
    aliases: [
      "cart path", "path", "sprinkler head", "immovable obstruction",
      "free drop", "free relief", "nearest point of relief", "relief area",
    ],
    primaryRule: 16,
    sources: [
      rog("16.1a", P0_CHECKED), rog("16.1b", P0_CHECKED), rog("16.1c", P0_CHECKED), rog("16.1d", P0_CHECKED),
      rog("14.3", P0_CHECKED),
      def("Immovable Obstruction", P0_CHECKED), def("Nearest Point of Complete Relief", P0_CHECKED),
      def("Relief Area", P0_CHECKED), def("Obstruction", P0_CHECKED), def("Integral Object", P0_CHECKED),
    ],
    answer:
      "Usually yes: a cart path with an artificial surface is an immovable obstruction, and you get free relief when your ball is on it or the path is where you'd stand or swing. From the general area, find the nearest point of complete relief and drop within one club-length of it, no nearer the hole and still in the general area.",
    conditions: [
      "The path has an artificial surface; the same goes for other immovable obstructions, such as a sprinkler head. If the Committee has made the path an integral object, part of the course's challenge, there's no free relief.",
      "The path really interferes: your ball touches it or lies on it, or it's in the way of your stance or swing. A path that's only on your line of play counts only when your ball is on the putting green, one that's merely close enough to distract you doesn't count anywhere, and there's no relief when the shot would be clearly unreasonable anyway, such as a ball wedged in a bush beside the path.",
      "This procedure is for a ball in the general area. Relief from a bunker or the putting green works differently (Rules 16.1c and 16.1d), and a ball in a penalty area gets no free relief at all.",
      "Your nearest point of complete relief is the closest spot in the general area, no nearer the hole, where the path no longer affects the shot you'd have played with your chosen club, stance, swing and line of play. It only has to be clear of the path; if that spot is in a bush, that's where it is.",
      "The relief area is the ground within one club-length of that spot, no nearer the hole and in the general area. Drop from knee height inside it; afterwards your ball, stance and swing must be completely clear of the path. If two drops roll out, place the ball where the second one first landed.",
    ],
    options: [
      "Play it from where it is: relief is optional.",
      "Take free relief: find the nearest point of complete relief, then drop within one club-length of it, no nearer the hole and in the general area (Rule 16.1b).",
    ],
    penalty:
      "None for taking relief. Playing from outside the relief area is playing from a wrong place: the general penalty, two strokes in stroke play or loss of the hole in match play (Rule 16.1).",
    example:
      "On the 11th your drive stops on the cart path right of the fairway. You find the nearest spot off the path, no nearer the hole, where ball, stance and swing are all clear, measure one club-length from it with your longest club other than the putter, usually the driver, and drop from knee height inside that area.",
    status: "in-review",
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
