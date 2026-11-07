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

/**
 * Batch 1's review record (#240, PR #256). Every stage happened on November 6,
 * 2026:
 *
 * - rules, product and seo were done by two independent reviewer agents that
 *   opened the sources themselves (editorial-review.md § Stages). Their
 *   findings and resolutions are in docs/rules/review-packet-situations.md.
 * - approval is the owner's, given in chat on November 6, 2026, on that
 *   packet. It accepts the one off-record source (Committee Procedures 2C,
 *   for red-vs-yellow-penalty-areas) the packet flags, and the owner
 *   confirmed the two Codex fixes made after it.
 *
 * Internal: stripped by every public selector.
 */
const P0_REVIEWED_ON = "2026-11-06";
const P0_APPROVED: Pick<RulesScenario, "status" | "reviewedOn" | "reviewedBy" | "reviewLog"> = {
  status: "approved",
  reviewedOn: P0_REVIEWED_ON,
  reviewedBy: "owner",
  reviewLog: [
    {
      stage: "rules",
      by: "agent",
      on: P0_REVIEWED_ON,
      note: "Reviewer A: every sentence, penalty, stroke count and caveat against the R&A text and Definitions; findings fixed (review-packet-situations.md).",
    },
    {
      stage: "product",
      by: "agent",
      on: P0_REVIEWED_ON,
      note: "Reviewer B: voice, NEVER_WORDS, no GoLo claim, Model Local Rule wording; copy distance 0 runs of 8+ words.",
    },
    {
      stage: "seo",
      by: "agent",
      on: P0_REVIEWED_ON,
      note: "Reviewer B: fragments per canonical-map.md; glossary and content links published; aliases.",
    },
    {
      stage: "approval",
      by: "owner",
      on: P0_REVIEWED_ON,
      note: "Batch 1 approved in chat on 2026-11-06, and the two Codex fixes confirmed the same day (#240, PR #256).",
    },
  ],
};

/** The day batch 2 (#241) opened each of its sources. */
const P1_CHECKED = "2026-11-06";

/**
 * Batch 2's review record (#241, PR #261), as batch 1's: rules, product and
 * seo by two independent reviewer agents on November 6, 2026, findings and
 * resolutions in docs/rules/review-packet-situations.md, and the owner's
 * approval in chat the same day. Rules of Handicapping 3.3 was checked
 * against a browser capture of the page (usga.org blocks scripts).
 *
 * Internal: stripped by every public selector.
 */
const P1_REVIEWED_ON = "2026-11-06";
const P1_APPROVED: Pick<RulesScenario, "status" | "reviewedOn" | "reviewedBy" | "reviewLog"> = {
  status: "approved",
  reviewedOn: P1_REVIEWED_ON,
  reviewedBy: "owner",
  reviewLog: [
    {
      stage: "rules",
      by: "agent",
      on: P1_REVIEWED_ON,
      note: "Reviewer A: every sentence, penalty, stroke count and caveat against the R&A text, Definitions and RoH 3.3; findings fixed (review-packet-situations.md).",
    },
    {
      stage: "product",
      by: "agent",
      on: P1_REVIEWED_ON,
      note: "Reviewer B: voice, NEVER_WORDS, no GoLo claim, E-3 and handicapping wording; copy distance 0 runs of 8+ words (check:rules-copy agrees).",
    },
    {
      stage: "seo",
      by: "agent",
      on: P1_REVIEWED_ON,
      note: "Reviewer B: fragments per canonical-map.md; glossary and content links published; aliases.",
    },
    {
      stage: "approval",
      by: "owner",
      on: P1_REVIEWED_ON,
      note: "Batch 2 approved in chat on 2026-11-06 (#241, PR #261).",
    },
  ],
};

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
    ...P0_APPROVED,
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
    ...P0_APPROVED,
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
    ...P0_APPROVED,
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
      rog("17.1e", P0_CHECKED), def("Penalty Area", P0_CHECKED),
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
      "Play it as it lies, red or yellow: no penalty, and the same Rules apply as anywhere in the general area (Rule 17.1b). Not allowed when your ball lies in a no play zone, or one gets in the way of your stance or swing: then you have to take relief (Rule 17.1e).",
      "Stroke and distance, red or yellow: one penalty stroke, play again from where you made your last stroke (Rule 17.1d).",
      "Back on the line, red or yellow: one penalty stroke, drop outside the penalty area on a line from the hole through the crossing point, as far back as you like. The ball has to finish within one club-length of where it first lands, in that same area of the course, and no nearer the hole than the crossing point (Rule 17.1d).",
      "Lateral relief, red only: one penalty stroke, drop within two club-lengths of the crossing point, no nearer the hole and outside that penalty area. If that space covers more than one area of the course, the ball has to finish in the area it first lands in (Rule 17.1d).",
    ],
    penalty:
      "One penalty stroke for any relief option (Rule 17.1d). Playing the ball as it lies is free (Rule 17.1b).",
    example:
      "On the 14th your second shot, a 7-iron, clears a pond marked with red stakes, lands on the bank beyond it and spins back into the water. It last crossed the edge on the green side, so a lateral drop goes within two club-lengths of that point, no nearer the hole, and you play your fourth from there.",
    relatedGlossaryIds: ["penalty-area"],
    ...P0_APPROVED,
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
      "Lateral: one penalty stroke, drop within two club-lengths of the ball, no nearer the hole. If that space covers more than one area of the course, the ball has to finish in the area it first lands in (Rule 19.2).",
      "Bunker only: two penalty strokes in total, drop back on the line outside the bunker (Rule 19.3b).",
    ],
    penalty:
      "One penalty stroke for any option (Rules 19.2 and 19.3a), or two in total to go back on the line outside a bunker (Rule 19.3b).",
    example:
      "On the 9th your wedge finishes in the sand under the steep front lip of a greenside bunker. A lateral drop in the bunker costs one penalty stroke; going back on the line outside the bunker costs two.",
    relatedGlossaryIds: ["bunker", "rough"],
    ...P0_APPROVED,
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
    ...P0_APPROVED,
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
    ...P0_APPROVED,
  }),

  // P1 (#241)
  situation({
    id: "temporary-water",
    question: "Puddle or ground under repair: do I get free relief?",
    aliases: [
      "casual water", "puddle", "GUR", "ground under repair", "white circle",
      "standing water", "abnormal course condition",
    ],
    primaryRule: 16,
    sources: [
      rog("16.1a", P1_CHECKED), rog("16.1b", P1_CHECKED), rog("16.1c", P1_CHECKED), rog("16.1d", P1_CHECKED),
      rog("16.1e", P1_CHECKED), rog("16.1f", P1_CHECKED),
      def("Abnormal Course Condition", P1_CHECKED), def("Temporary Water", P1_CHECKED),
      def("Ground Under Repair", P1_CHECKED), def("Known or Virtually Certain", P1_CHECKED),
      def("Nearest Point of Complete Relief", P1_CHECKED), def("Point of Maximum Available Relief", P1_CHECKED),
      def("No Play Zone", P1_CHECKED),
    ],
    answer:
      "Yes, when it really gets in the way: if your ball touches or lies in temporary water or ground under repair, or the condition is where you'd stand or swing, relief is free anywhere except a penalty area. In the general area you drop within one club-length of the nearest point of complete relief, no nearer the hole; a bunker and the putting green have their own procedures.",
    conditions: [
      "Temporary water has to be visible on the surface before or after you take your stance, without pressing down hard with your feet. Wet, soft or muddy ground isn't enough, dew and frost don't count, and water in a penalty area isn't temporary water.",
      "Ground under repair is whatever the Committee defines as such, normally by marking its edge with a painted line or markers on the ground. A few things count even unmarked: holes the maintenance staff made, other than aeration holes, and cuttings or other material piled up to be taken away.",
      "When your ball is on the putting green, a condition on your line of play also counts, whether it's on the green or off it. One that's merely close enough to distract you doesn't count anywhere.",
      "There's no free relief for a ball in a penalty area, when the shot is clearly unreasonable anyway, such as a ball you couldn't play out of a bush, or when the only interference comes from choosing a clearly unreasonable club, stance, swing or direction.",
      "If the ball isn't found, it has to be known or virtually certain, meaning conclusive evidence or at least 95 percent likely, that it's in the condition. Then the point where it last crossed into the condition counts as the ball's spot for finding the nearest point of complete relief. If it isn't, the ball is lost: stroke and distance (Rule 16.1e).",
    ],
    options: [
      "Play it as it lies: relief is optional, unless the Committee has defined the area as a no play zone and your ball is in it or it gets in the way of your stance or swing; then you have to take relief (Rule 16.1f).",
      "General area: find the nearest point of complete relief, the closest spot no nearer the hole where the condition no longer affects your ball, stance or swing, and drop within one club-length of it, no nearer the hole and in the general area (Rule 16.1b).",
      "Bunker: free relief that keeps the ball in the bunker, using a nearest point of complete relief inside it, or the spot of least interference if nowhere there is fully clear; or, for one penalty stroke, drop outside the bunker, behind the ball on a line running back from the hole (Rule 16.1c).",
      "Putting green: place the ball, for free, at the nearest point of complete relief, or the spot of least interference if there isn't one, on the green or in the general area (Rule 16.1d).",
    ],
    penalty:
      "No penalty for relief, except the one penalty stroke for going back on the line outside a bunker (Rule 16.1c). Playing from a wrong place, such as outside the relief area or from a no play zone, costs the general penalty: two strokes in stroke play or loss of the hole in match play (Rule 16.1).",
    example:
      "On the 2nd your drive finishes in a puddle on the fairway after overnight rain. You find the nearest spot, no nearer the hole, where ball, stance and swing are all clear of the water, and drop within one club-length of it.",
    ...P1_APPROVED,
  }),
  situation({
    id: "ball-moved",
    question: "My ball moved after it stopped",
    aliases: ["ball moved", "ball moved at address", "wind moved my ball", "accidentally moved my ball"],
    primaryRule: 9,
    sources: [
      rog("9.1b", P1_CHECKED), rog("9.2", P1_CHECKED), rog("9.3", P1_CHECKED), rog("9.4", P1_CHECKED),
      rog("9.5", P1_CHECKED), rog("9.6", P1_CHECKED), def("Moved", P1_CHECKED),
      def("Known or Virtually Certain", P1_CHECKED), def("Natural Forces", P1_CHECKED),
      def("Outside Influence", P1_CHECKED),
    ],
    answer:
      "It depends on what moved it. If wind, water or gravity did, play it from where it stopped, with no penalty. If you, your caddie, an opponent or anything else did, it goes back on its original spot, and you get one penalty stroke when you or your caddie caused it, unless an exception covers what you were doing.",
    conditions: [
      "A ball has moved only if it left its spot and came to rest somewhere else, visibly to the naked eye; a wobble that settles back isn't a move. It counts as moved only if that's known or virtually certain, meaning conclusive evidence or at least 95 percent likely. If it only might have moved, play it as it lies.",
      "You, an opponent or an outside influence caused it only if that's known or virtually certain. Otherwise the Rules treat it as natural forces, such as wind, water or gravity.",
      "Moving it by accident often carries no penalty: for example while searching for or identifying it, anywhere on the putting green, or while marking, lifting, replacing, measuring or taking relief under a Rule.",
      "If it starts moving after you've begun your backswing and you finish the stroke, you play it from wherever it ends up, whatever moved it. If you caused the movement, the one-stroke penalty and its exceptions still apply (Rules 9.1b and 9.4).",
      "If natural forces move a ball you've dropped, placed or replaced into a different area of the course, say from the general area into a bunker or penalty area, or out of bounds, it goes back. On the green, a ball you've already lifted and replaced goes back whatever moved it.",
    ],
    options: [
      "Natural forces, such as wind, water or gravity: no penalty, play it from its new spot (Rule 9.3).",
      "You or your caddie, or in a team format your partner or their caddie: replace it, with one penalty stroke unless an exception applies (Rules 9.2 and 9.4).",
      "Your opponent or their caddie, in match play: replace it; the opponent gets one penalty stroke unless an exception applies (Rule 9.5).",
      "Anyone or anything else, such as an animal, another ball or another player in stroke play who isn't your partner: replace it, no penalty (Rule 9.6).",
    ],
    penalty:
      "One penalty stroke when you or your caddie lift it, deliberately touch it or cause it to move, unless one of the exceptions above applies (Rule 9.4). If you play it from where it ended up rather than putting it back, the penalty becomes the general penalty: two strokes in stroke play, loss of the hole in match play (Rule 9.4).",
    example:
      "On the 4th you set your 7-iron down behind your ball on a slope in the rough and a gust rolls it a foot. Unless it's known or virtually certain your club caused it, that's natural forces: no penalty, and you play it from where it stopped.",
    matchVsStrokeCaveat:
      "Match play: if your opponent or their caddie moves your ball, it's replaced and they get one penalty stroke unless an exception applies (Rule 9.5). Stroke play: another player who isn't your partner is an outside influence, so the ball is replaced with no penalty (Rule 9.6).",
    ...P1_APPROVED,
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
      rog("14.1a", P1_CHECKED), rog("14.1b", P1_CHECKED), rog("14.1c", P1_CHECKED), rog("14.2", P1_CHECKED),
      rog("13.1b", P1_CHECKED), rog("9.4", P1_CHECKED),
      localRuleSource("E-3", P1_CHECKED),
    ],
    answer:
      "On the putting green, whenever you like: mark it, lift it, clean it and put it back on the same spot. Everywhere else you lift it only when a Rule lets you, such as to identify it, to take relief or because it's in another player's way, and why you lifted it decides whether you can clean it. Lift, clean and place in the fairway is Model Local Rule E-3, in force only if the Committee has adopted it.",
    conditions: [
      "Before lifting a ball that has to go back on the same spot, mark it with a ball-marker or a club held on the ground right behind or beside it. Lifting to take relief needs no mark.",
      "Only you can lift it, or someone you authorize each time. Your caddie can lift it without asking on the putting green, or when it's clear you're about to take relief.",
      "Off the green you can clean it unless you lifted it to check for a cut or crack, because it was in someone's way, or to see whether relief applies and then didn't take it. If you lifted it to identify it, clean only as much as you need to tell it's yours.",
      "You, or whoever lifted it, set it back down by hand on its original spot. Take the ball-marker away before you play.",
    ],
    penalty:
      "One penalty stroke for lifting without marking when a mark was needed, leaving the ball-marker down when you play, cleaning when cleaning isn't allowed, or playing a ball put back by someone who wasn't allowed to (Rules 14.1 and 14.2). Lifting it when no Rule allows it is also one penalty stroke (Rule 9.4). Play it without putting it back on its spot and it's the general penalty instead: two strokes in stroke play, loss of the hole in match play (Rules 9.4 and 14.2).",
    example:
      "On the 6th your ball reaches the green with mud on it. Put a marker right behind it, lift it, wipe it, set it back on the same spot and pick the marker up before you putt.",
    localRuleCaveat:
      "Preferred lies, also called lift, clean and place or winter rules, is Model Local Rule E-3, and it applies only if the Committee has adopted it. Then a ball touching grass in the general area that's mown to fairway height or shorter, or in an area the Committee names, can be placed once within the distance the Committee sets, such as one club-length or the length of a scorecard, no nearer the hole and still in the general area. A group that agrees to play it isn't the Committee adopting it; that's a house agreement.",
    ...P1_APPROVED,
  }),
  situation({
    id: "repairing-the-green",
    question: "Can I fix spike marks and other damage on the green?",
    aliases: ["ball mark", "pitch mark", "spike mark", "repair the green", "fix a ball mark"],
    primaryRule: 13,
    sources: [rog("13.1c", P1_CHECKED), def("Putting Green", P1_CHECKED)],
    answer:
      "Yes. During the round you can repair damage on the putting green, whether your ball is on the green or not, with your hand, foot, a ball-mark repair tool, a tee or a club, as long as you're restoring the green and not holding up play. Natural flaws, such as weeds or bare patches, and the marks of normal maintenance, such as aeration holes, aren't damage, so those stay as they are.",
    conditions: [
      "Damage means harm done by a person or an outside influence, such as ball marks, spike and shoe marks, scrapes from equipment or the flagstick, old hole plugs, seams of cut turf, animal tracks, and stones, acorns or tees pressed into the surface.",
      "Not damage: aeration holes, grooves from vertical mowing, marks left by rain or irrigation, weeds, bare or uneven patches, and natural wear around the hole.",
      "The repair has to be reasonable. Going further than restoring the surface, such as smoothing a channel to the hole, costs the general penalty.",
      "You can also brush sand and loose soil off the putting green.",
      "This covers only the green of the hole you're playing. Any other green is a wrong green, which counts as part of the general area.",
    ],
    penalty:
      "None for a reasonable repair. Improving the green beyond restoring it, or using something that isn't normal equipment for the job, costs the general penalty: two strokes in stroke play, loss of the hole in match play (Rule 13.1c).",
    example:
      "On the 8th there's a spike mark on your line four feet short of the hole. You can tap it down with your putter before you putt, but not a thin patch of grass or the rim of an aeration hole.",
    relatedGlossaryIds: ["putt"],
    ...P1_APPROVED,
  }),
  situation({
    id: "conceded-putt",
    question: "Does a conceded putt count?",
    aliases: ["gimme", "concede", "conceded putt", "that's good", "inside the leather"],
    primaryRule: 3,
    sources: [rog("3.2b", P1_CHECKED), rog("3.3c", P1_CHECKED), handicapSource("3.3", ROH_3_3, P1_CHECKED)],
    answer:
      "In match play, yes: your opponent can concede your next stroke, and your score for the hole includes it. In stroke play there's no such thing; you hole out on every hole. A gimme in a casual stroke-play round is your group's agreement, not a Rule.",
    conditions: [
      "Concessions are match play only. Your opponent can concede your next stroke any time before you play it, by saying so or by a gesture that makes it clear.",
      "A concession is final: you can't turn it down, and your opponent can't take it back.",
      "If you lift your ball because you reasonably took a remark as a concession, there's no penalty; the ball goes back.",
      "In stroke play, a hole you didn't finish has to be holed out before you tee off on the next hole, or before you return your scorecard after the last. Stableford, maximum score and par or bogey formats work differently.",
    ],
    penalty:
      "In stroke play, failing to hole out and not correcting it in time is disqualification (Rule 3.3c).",
    example:
      "In a match on the 18th, your 20-foot putt for a three stops a foot short and your opponent says that's good. You pick up and score four. In a stroke-play round you'd tap it in.",
    matchVsStrokeCaveat:
      "Match play: an opponent can concede your next stroke, a hole or the whole match (Rule 3.2b). Stroke play: no concessions, and every hole is holed out (Rule 3.3c).",
    handicapCaveat:
      "Posting a score for handicap follows a separate rulebook. Under Rules of Handicapping 3.3, when you start a hole but don't hole out for a valid reason (its examples include a hole conceded in match play), you record your most likely score, or net double bogey if that's lower. On the green within five feet that's one more stroke; from five feet to 20 yards, two or three.",
    relatedGlossaryIds: ["gimme", "match-play", "stroke-play", "net-double-bogey"],
    relatedContentPaths: ["/blog/gimmes"],
    ...P1_APPROVED,
  }),
];
