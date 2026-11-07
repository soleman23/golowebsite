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

import type { ReviewEntry } from "../glossary/types";
import { definitionSource, rogSource } from "./sources";
import type { RuleOverview, RulesSource } from "./types";

type Written = Partial<Omit<RuleOverview, "id" | "number" | "edition">>;

/** #238 (Rules 12–19): the day its rule pages and Definitions were opened. */
const OPENED_238 = "2026-11-06";

/** #237 (Rules 1–11): as OPENED_238. */
const OPENED_237 = "2026-11-06";

/**
 * The review record of every approved overview (docs/rules/editorial-review.md
 * § Stages). Two independent reviewer agents ran the rules, product and seo
 * stages on the day each batch was drafted, and Codex's findings on each pull
 * request were fixed as well; docs/rules/review-packet-overviews.md has the
 * evidence. The approval is the owner's, given in chat. Internal: stripped by
 * every public selector.
 */
const AGENTS_REVIEWED_ON = "2026-11-06";
const OWNER_APPROVED_ON = "2026-11-06";

const REVIEW_LOG: ReviewEntry[] = [
  {
    stage: "rules",
    by: "agent",
    on: AGENTS_REVIEWED_ON,
    note: "Every sentence and question checked against the R&A rule pages and Definitions opened that day (review-packet-overviews.md).",
  },
  {
    stage: "product",
    by: "agent",
    on: AGENTS_REVIEWED_ON,
    note: "House voice, NEVER_WORDS, claim guard and copy distance: no run of eight words shared with the official text.",
  },
  {
    stage: "seo",
    by: "agent",
    on: AGENTS_REVIEWED_ON,
    note: "Fragment ids, glossary slugs, aliases and every source anchor resolve; lint:content passes.",
  },
  {
    stage: "approval",
    by: "owner",
    on: OWNER_APPROVED_ON,
    note: "Approved in chat (\"Approve all three\": #237, #238, #239).",
  },
];

/** An overview the owner has approved; only the launch PR (#247) publishes it. */
const ownerApproved: Written = {
  status: "approved",
  reviewedBy: "owner",
  reviewedOn: OWNER_APPROVED_ON,
  reviewLog: REVIEW_LOG,
};

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
    summary:
      "Rule 1 sets out the principles: play the course as you find it, play the ball as it lies, and play in the spirit of the game, with integrity, consideration for others and care for the course. You apply your own penalties, at three main levels: one stroke, the general penalty (two strokes in stroke play, loss of the hole in match play) and disqualification. Players who agree to ignore a Rule or penalty they know applies are disqualified once any of them has started the round. Mulligans and breakfast balls are house rules, not Rules: hitting again puts a new ball in play under Rule 18, with a penalty stroke, and the first ball is out of play.",
    commonQuestions: [
      "Is a mulligan or a breakfast ball ever allowed under the Rules?",
      "Do I have to call a penalty on myself?",
      "What happens if our group agrees to skip a Rule?",
      "What's the difference between a one-stroke penalty and the general penalty?",
    ],
    relatedGlossaryIds: ["mulligan", "breakfast-ball"],
    sources: opened(OPENED_237, ["1", "1.1", "1.2a", "1.3b", "1.3c", "18.1"], ["General Penalty"]),
    ...ownerApproved,
  }),
  rule(2, {
    summary:
      "Rule 2 names the five areas of the course, because where your ball lies changes what you may do: the general area (fairway, rough, trees and everything else) and four specific areas: the teeing area you start from, penalty areas, bunkers, and the putting green on the hole you're playing. Every other tee and green is general area, though you must take free relief from a wrong green. A ball partly in a specific area counts as in it; one in two counts as in the penalty area over a bunker, and bunker over green. You can move loose impediments and movable obstructions without penalty, and abnormal course conditions can give free relief; boundary and integral objects give none.",
    commonQuestions: [
      "My ball is half on the grass and half in the bunker: which area is it in?",
      "Is another hole's green part of the general area?",
      "Which objects and conditions give free relief?",
    ],
    relatedGlossaryIds: ["teeing-area", "fairway", "rough", "bunker", "penalty-area"],
    sources: opened(
      OPENED_237,
      ["2", "2.2a", "2.2b", "2.2c", "2.3", "13.1f"],
      ["General Area", "Wrong Green"],
    ),
    ...ownerApproved,
  }),
  rule(3, {
    summary:
      "Rule 3 covers the three choices behind every competition: match play or stroke play, individual or partners, and gross or net scores. In match play you win, lose or tie holes, and you may concede your opponent's next stroke, a hole or the whole match; a concession can't be declined or withdrawn. In stroke play you must hole out on every hole, with no gimmes; finish an unfinished hole before the next tee or you're disqualified. You and your marker certify the scorecard: a hole score too high stands; one too low disqualifies you, unless it's short only by a penalty you had no reason to suspect. In a handicap match, the stroke index decides which holes get strokes.",
    commonQuestions: [
      "Can we give each other gimmes in stroke play?",
      "Can I take back a putt I've conceded?",
      "What if I sign for the wrong score on a hole?",
      "Where do handicap strokes fall in a match?",
    ],
    relatedGlossaryIds: ["match-play", "stroke-play", "gimme", "net-score", "handicap-stroke"],
    sources: opened(OPENED_237, ["3", "3.1a", "3.1b", "3.1c", "3.2a", "3.2b", "3.2c", "3.3b", "3.3c"]),
    ...ownerApproved,
  }),
  rule(4, {
    aliases: ["14 clubs", "club limit"],
    summary:
      "Rule 4 covers the clubs, balls and other equipment you may use. Start with no more than 14 clubs. Carry more and it's two penalty strokes per hole with the breach, up to four, in stroke play; in match play, a hole off the match score for each, up to two. Declare any extra club out of play before your next stroke. You can't borrow a club from anyone playing on the course, though partners may share 14. Clubs and balls must conform; hitting a club you adjusted mid-round, without resetting it, is disqualification. A rangefinder for distance is allowed unless the Committee, whoever runs the competition or course, bans it by Local Rule; measuring slope or wind is not.",
    commonQuestions: [
      "I found a 15th club in my bag: what now?",
      "Can I use a rangefinder with a slope setting?",
      "Can I borrow a club from someone in my group?",
      "My club broke during the round: can I replace it?",
    ],
    relatedGlossaryIds: ["driver", "putter"],
    sources: opened(OPENED_237, ["4", "4.1a", "4.1b", "4.1c", "4.2a", "4.3a", "22.5", "23.7"], ["Committee"]),
    ...ownerApproved,
  }),

  // Playing the round
  rule(5, {
    summary:
      "Rule 5 covers starting on time, practicing, keeping pace and stopping play. Up to five minutes late but ready to play, or up to five minutes early, is the general penalty on the first hole; beyond that is disqualification. By default you can't practice on the course before a stroke-play round that day, except on a practice area or by putting or chipping near the first tee; before a match you can. You can't hit practice shots during a hole, though between holes you may putt or chip near the green just finished or the next tee, not from a bunker. The Committee can change these limits by Local Rule. You may stop for lightning, but must tell the Committee.",
    commonQuestions: [
      "Can I hit a few putts on the green after we finish a hole?",
      "What happens if I'm late to the first tee?",
      "Can I practice on the course before a stroke-play round?",
      "Can I stop playing when there's lightning?",
    ],
    sources: opened(OPENED_237, ["5", "5.2a", "5.2b", "5.3a", "5.5a", "5.5b", "5.6b", "5.7a"]),
    ...ownerApproved,
  }),
  rule(6, {
    aliases: ["wrong ball"],
    summary:
      "Rule 6 covers playing a hole: teeing off, the ball you use and the order of play. Tee off inside the teeing area, two club-lengths deep behind the front of the tee markers. Outside it, stroke play costs two penalty strokes and a replay; match play has no penalty, but your opponent may make you replay. Hole out with the ball you started with unless it's lost or out of bounds or a Rule lets you change it, as when taking relief; a swap otherwise costs a stroke. Playing a wrong ball, one that isn't your ball in play or your provisional, costs the general penalty; in stroke play, return to your own before the next tee or be disqualified.",
    commonQuestions: [
      "I teed up in front of the markers: what's the penalty?",
      "Can I switch to a new ball in the middle of a hole?",
      "I played someone else's ball by mistake: what now?",
      "Who tees off first on the next hole?",
    ],
    relatedGlossaryIds: ["teeing-area"],
    sources: opened(
      OPENED_237,
      ["6", "6.1b", "6.2b", "6.3a", "6.3b", "6.3c", "6.4a", "6.4b"],
      ["Teeing Area", "Wrong Ball"],
    ),
    ...ownerApproved,
  }),
  rule(7, {
    summary:
      "Rule 7 covers finding and identifying your ball. You have three minutes from when you or your caddie start looking, then it's lost. You may move grass, bushes, sand and water while searching; it's a penalty only if that goes beyond a reasonable search and improves your next shot. If anyone accidentally moves your ball while looking, there's no penalty; put it back. If searching disturbed sand on it, re-create the lie before playing. If you can't identify a ball as it lies, mark and lift it, cleaning only enough to tell. It's yours if someone saw your ball come to rest, it carries your mark, or it matches yours where yours should be and no identical ball is nearby.",
    commonQuestions: [
      "How long can I search for my ball?",
      "I stepped on my ball while looking for it: is that a penalty?",
      "Can I pick up a ball to see if it's mine?",
      "Two balls of the same brand are in the rough: which is mine?",
    ],
    sources: opened(OPENED_237, ["7", "7.1a", "7.1b", "7.2", "7.3", "7.4"], ["Lost"]),
    ...ownerApproved,
  }),
  rule(8, {
    summary:
      "Rule 8 covers playing the course as you find it: you can't improve the conditions for your next stroke, meaning your lie, your stance and swing, your line of play and where you'll drop. Bending or breaking branches, pressing down the ground behind your ball, replacing a divot in a divot hole on your line, or removing dew or frost costs the general penalty if it improves those conditions. You may still ground the club lightly, take a fair stance and make your stroke, even if the swing breaks a branch; a practice swing gets no such pass. If you moved or bent a branch, putting it back before you play avoids the penalty; once it's broken, it doesn't.",
    commonQuestions: [
      "Can I press down the grass behind my ball?",
      "I broke a branch on my backswing: is that a penalty?",
      "Can I replace a divot in a divot hole on my line?",
      "I bent a branch out of the way: can I undo it?",
    ],
    sources: opened(OPENED_237, ["8", "8.1", "8.1a", "8.1b", "8.1c"]),
    ...ownerApproved,
  }),
  rule(9, {
    summary:
      "Rule 9 covers playing the ball as it lies, and a resting ball that moves. The cause decides; anything but natural forces counts only when that's known or virtually certain. Wind or water: no penalty; play it where it stopped, unless it was replaced on the green, or a dropped, placed or replaced ball rolled into another area or out of bounds; then replace it. You or your caddie: one penalty stroke and replace it, unless it moved by accident on the green, in a search, or while marking it, removing a movable obstruction or taking relief. An opponent in match play: the same, penalty theirs. Anything else, such as another player in stroke play: no penalty, replace it.",
    commonQuestions: [
      "The wind moved my ball after it stopped: do I replace it?",
      "I nudged my ball at address: what's the penalty?",
      "Another ball knocked mine: where do I play from?",
      "My opponent moved my ball in match play: what happens?",
    ],
    sources: opened(
      OPENED_237,
      ["9", "9.1a", "9.2a", "9.2b", "9.3", "9.4a", "9.4b", "9.5a", "9.5b", "9.6"],
      ["Known or Virtually Certain", "Outside Influence"],
    ),
    ...ownerApproved,
  }),
  rule(10, {
    aliases: ["advice"],
    summary:
      "Rule 10 covers making a stroke and the help you may get. Strike the ball fairly with the clubhead, and don't anchor the club against your body. During a round you can't ask anyone but your caddie for advice, or give it to anyone else in your competition, such as your group; partners are the exception. Advice is anything meant to influence your club, your stroke or how you play; distances, wind direction and the Rules aren't advice. Only your caddie may help with your line, and not from behind the ball once you begin your stance; others may point out a landmark or, off the green, stand as a target and move away. Any breach costs the general penalty.",
    commonQuestions: [
      "Can I ask someone in my group what club they just hit?",
      "Is telling someone the yardage to the flag advice?",
      "Can I lay a club on the ground to check my alignment?",
      "Can my caddie line me up from behind?",
    ],
    sources: opened(
      OPENED_237,
      ["10", "10.1a", "10.1b", "10.2a", "10.2b", "22.2", "23.5a"],
      ["Advice"],
    ),
    ...ownerApproved,
  }),
  rule(11, {
    summary:
      "Rule 11 covers a ball in motion that hits a person, an animal or an object. Accidental hits usually carry no penalty; play the ball as it lies. In stroke play, a putt that hits another ball at rest, with both on the green beforehand, costs two penalty strokes. A putt that accidentally hits, on the green, another person (not the flagstick attendant), an animal larger than an insect, or a movable obstruction must be replayed; a ball-marker doesn't count. Deliberately stopping or deflecting a moving ball, or removing loose impediments or altering the ground to affect where it stops, costs the general penalty; in match play you may stop an opponent's ball that can't go in, as a concession.",
    commonQuestions: [
      "My shot hit my own golf bag: is that a penalty?",
      "My putt hit another ball on the green: what happens?",
      "My putt hit someone standing near the hole: do I replay it?",
      "Can I stop a ball that's rolling toward the water?",
    ],
    sources: opened(OPENED_237, ["11", "11.1a", "11.1b", "11.2a", "11.2b", "11.3", "13.2b"]),
    ...ownerApproved,
  }),

  // Course areas and procedures
  rule(12, {
    summary:
      "Rule 12 covers when your ball is in a bunker and what you may touch there. It's in if any part touches sand inside the edge, sits where sand has washed or blown away, or rests on something there, like a rake; on grass inside the edge, not touching sand, it isn't. Before playing, you can't touch the sand to test it, with the club just in front of or behind the ball, or in a practice swing or backswing. Each costs the general penalty: two strokes in stroke play, loss of the hole in match play. Digging in your feet or moving a rake is fine. Once your ball is out, or you're taking relief outside, you can rake.",
    commonQuestions: [
      "Is my ball in the bunker if it's on grass inside the edge?",
      "Can my practice swing brush the sand?",
      "Can I move a rake, leaves or a stone before I play from the sand?",
      "When can I smooth the sand?",
    ],
    relatedGlossaryIds: ["bunker", "sandy"],
    sources: opened(OPENED_238, ["12", "12.1", "12.2a", "12.2b"], ["General Penalty"]),
    ...ownerApproved,
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
    ...ownerApproved,
  }),
  rule(14, {
    aliases: ["wrong place"],
    summary:
      "Rule 14 covers marking, lifting, replacing and dropping a ball, and playing from a wrong place. Mark the spot before lifting a ball you'll replace; skipping that costs a penalty stroke. Drop from knee height, straight down, into the relief area, where the ball must stay; if it rolls out twice, place it where the second drop landed. A wrong drop, placement or replacement can be redone free before you play. Playing from a wrong place costs the general penalty, two strokes or loss of the hole in match play; in stroke play, a serious breach must be corrected before the next tee, or on the last hole before you return your card, or you're disqualified.",
    commonQuestions: [
      "Do I have to mark my ball before lifting it?",
      "How do I drop, and what if the ball rolls out of the relief area?",
      "I dropped in the wrong spot: can I pick it up and drop again?",
      "I played from the wrong place in stroke play: what now?",
    ],
    sources: opened(
      OPENED_238,
      ["14", "14.1a", "14.3b", "14.3c", "14.5a", "14.7a", "14.7b"],
      ["Relief Area", "General Penalty"],
    ),
    ...ownerApproved,
  }),
  rule(15, {
    summary:
      "Rule 15 covers two kinds of things you can usually move out of the way without penalty. Loose impediments are unattached natural objects, such as leaves, twigs and stones. Movable obstructions are artificial objects you can move with reasonable effort and without damage, such as rakes, bottles and towels. Off the putting green and teeing area, if removing a loose impediment moves your ball, replace it and add a penalty stroke; if removing a movable obstruction moves it, just replace it. If your ball sits on a movable obstruction, lift it, remove the object and drop within one club-length of the spot beneath, no nearer the hole, without leaving that area of the course; on the green, place it there.",
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
    ...ownerApproved,
  }),
  rule(16, {
    aliases: ["plugged ball", "embedded ball", "casual water"],
    summary:
      "Rule 16 covers free relief from abnormal course conditions (ground under repair, temporary water, animal holes and immovable obstructions like paved paths), from dangerous animals, and for a ball in the general area that plugs in its own pitch-mark. A condition must interfere with your lie, stance or swing, or, on the green, your line. In the general area, find the nearest point of complete relief, the closest spot, no nearer the hole, clear of it for the shot you'd have played, and drop within one club-length, no nearer the hole and clear of it. For a plugged ball, the club-length is measured from the spot just behind it. None of this applies in a penalty area, except dangerous-animal relief.",
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
    ...ownerApproved,
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
    ...ownerApproved,
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
    ...ownerApproved,
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
    ...ownerApproved,
  }),

  // Rulings, formats and accessibility
  rule(20),
  rule(21, { relatedGlossaryIds: ["stableford", "scramble"] }),
  rule(22, { relatedGlossaryIds: ["foursomes"] }),
  rule(23, { relatedGlossaryIds: ["four-ball"] }),
  rule(24),
  rule(25),
];
