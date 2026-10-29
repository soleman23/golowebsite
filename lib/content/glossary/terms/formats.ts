/**
 * Games and formats (#158, GLS-006a). Ten MVP records from
 * docs/glossary/inventory.md § B.
 *
 * DRAFTS. Written October 29, 2026; no review stage has happened. The rules
 * sources below are references to check, not checks: none was opened (the
 * session couldn't reach usga.org or randa.org), so none has `accessedOn`.
 * GoLo notes are left out until the owner answers #154; the product audit
 * stage adds them from the registry.
 *
 * Where a guide owns the intent (canonical-map.md), the entry is a short
 * definition and the guide link, and doesn't restate the guide's rules.
 */

import type { GlossarySource, GlossaryTerm } from "../types";

const RULES_OF_GOLF = "https://www.randa.org/en/rog/the-rules-of-golf";
const RULES_OF_HANDICAPPING = "https://www.usga.org/handicapping/roh/";

const rog = (ref: string): GlossarySource => ({
  title: "Rules of Golf (R&A and USGA)",
  url: RULES_OF_GOLF,
  kind: "official-rules",
  ref,
});

export const formatsTerms: GlossaryTerm[] = [
  {
    id: "skins",
    slug: "skins",
    term: "Skins",
    aliases: ["skins game"],
    primaryCategory: "formats",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A game where every hole is worth a skin, won only by the player with the lowest score outright. If the low score is tied, nobody wins the hole, and in most groups the skin carries to the next one.",
    example:
      "Four players at $5 a skin halve holes 1 to 3. Your birdie on the 4th takes four skins: $60, $20 from each of the other three.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups set whether ties carry, whether skins are gross or net, and what happens to skins still carried after the 18th.",
    },
    relatedTermIds: ["nassau", "best-score"],
    relatedContentPaths: ["/blog/skins-carryover"],
    canonical: { kind: "existing", path: "/games/skins" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [],
    status: "draft",
  },
  {
    id: "nassau",
    slug: "nassau",
    term: "Nassau",
    aliases: [],
    primaryCategory: "formats",
    tags: ["match-play"],
    priority: "mvp",
    shortDefinition:
      "Three matches in one round, each for the same amount: the front nine, the back nine and the full eighteen. Each is match play, counted in holes won rather than strokes.",
    example:
      "In a $5 Nassau you win the front 2 up, halve the back and win the eighteen 2 up: $10 for the day. Lose all three and you're down $15, the most a straight Nassau can cost.",
    ruleNote: {
      kind: "house-rules",
      text: "There is no governing body for the Nassau. Whether strokes count, whether presses are allowed and when the eighteen closes are up to the group.",
    },
    relatedTermIds: ["match-play", "press"],
    relatedContentPaths: ["/blog/nassau"],
    canonical: { kind: "existing", path: "/games/nassau" },
    capabilityIds: ["game-library", "nassau-presses"],
    ctaIntent: "games",
    sources: [],
    status: "draft",
  },
  {
    id: "wolf",
    slug: "wolf",
    term: "Wolf",
    aliases: [],
    primaryCategory: "formats",
    tags: ["team"],
    priority: "mvp",
    shortDefinition:
      "A four-player game where one player, the wolf, rotates each hole and either picks a partner for that hole or plays alone against the other three for a bigger share of the points.",
    example:
      "On the 5th the wolf passes on all three drives and goes alone. A birdie that beats the other three's best score wins double the usual points.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups differ on whether the wolf tees off first or last, what going alone is worth, and who is wolf on the 17th and 18th.",
    },
    relatedTermIds: ["four-ball", "match-play"],
    relatedContentPaths: ["/blog/wolf"],
    canonical: { kind: "existing", path: "/games/wolf" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [],
    status: "draft",
  },
  {
    id: "bingo-bango-bongo",
    slug: "bingo-bango-bongo",
    term: "Bingo Bango Bongo",
    aliases: ["bbb"],
    primaryCategory: "formats",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A points game with three points on every hole: one for the first ball on the green (bingo), one for the closest to the pin once every ball is on (bango), and one for the first ball in the hole (bongo).",
    example:
      "Eighteen holes is 54 points. A four-point lead at the end is a normal result, which is why the game suits a group with a 6 and a 22 in it.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide whether the fringe counts as on the green. Most keep strict order of play, farthest from the hole first, so the points go to the right player.",
    },
    relatedTermIds: ["skins"],
    relatedContentPaths: ["/blog/bingo-bango-bongo"],
    canonical: { kind: "existing", path: "/games/bingo-bango-bongo" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [],
    status: "draft",
  },
  {
    id: "best-score",
    slug: "best-score",
    term: "Best Score",
    aliases: [],
    primaryCategory: "formats",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "An individual game where everyone plays for the same amount and the best score for the round takes it, net or gross, or the top two or three finishers split it.",
    explanation:
      "It isn't best ball. Best ball, or Four-Ball, is a team format where a side counts its better score on each hole. Best Score compares each player's own total.",
    example:
      "Four players put in $10 each and play net. A net 70 takes the $40. With two places, the top two take $20 each.",
    relatedTermIds: ["four-ball", "skins"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/games/best-score" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [],
    status: "draft",
  },
  {
    id: "scramble",
    slug: "scramble",
    term: "Scramble",
    aliases: ["captain's choice"],
    primaryCategory: "formats",
    tags: ["team", "scramble"],
    priority: "mvp",
    shortDefinition:
      "A team format where everyone tees off, the team picks the best shot, and every player plays the next shot from there, until the ball is holed. Each team records one score per hole.",
    example:
      "Four players drive; the team takes the one in the middle of the fairway. All four hit approaches from that spot, the team picks the best again, and so on.",
    ruleNote: {
      kind: "handicapping",
      text: "A scramble team's handicap is usually a set percentage of each player's Course Handicap, and the percentages depend on the team's size.",
    },
    relatedTermIds: ["four-ball", "foursomes"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/games/scramble" },
    capabilityIds: ["scramble"],
    ctaIntent: "games",
    sources: [
      {
        title: "Rules of Handicapping (USGA)",
        url: RULES_OF_HANDICAPPING,
        kind: "handicapping",
        ref: "Appendix C, handicap allowances for scrambles",
      },
    ],
    status: "draft",
  },
  {
    id: "four-ball",
    slug: "four-ball",
    term: "Four-Ball",
    aliases: ["best ball", "better ball", "fourball"],
    primaryCategory: "formats",
    tags: ["team", "match-play", "stroke-play"],
    priority: "mvp",
    shortDefinition:
      "A partnership format where each player plays their own ball and the side counts the better of its two scores on each hole. It can be played as match play or stroke play.",
    explanation:
      "Usually called best ball, though golfers also use best ball loosely for other team games. In handicap play, a percentage allowance is common, so partners don't get their full strokes.",
    example:
      "On a par 4 you make a 5 and your partner makes a 4. Your side's score for the hole is 4.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define Four-Ball and cover it in Rule 23.",
    },
    relatedTermIds: ["best-score", "foursomes", "match-play", "scramble"],
    relatedContentPaths: ["/games/wolf"],
    canonical: { kind: "hub", anchor: "four-ball" },
    capabilityIds: [],
    sources: [rog("Definitions: Four-Ball; Rule 23")],
    status: "draft",
  },
  {
    id: "foursomes",
    slug: "foursomes",
    term: "Foursomes",
    aliases: ["alternate shot"],
    primaryCategory: "formats",
    tags: ["team"],
    priority: "mvp",
    shortDefinition:
      "A partnership format where two players play one ball, taking turns: one tees off on the odd-numbered holes, the other on the even, and they alternate strokes until the ball is holed.",
    explanation:
      "Also called alternate shot. It isn't the same as a foursome, which is just a group of four players. In greensomes and Chapman, both partners tee off before the alternating starts.",
    example:
      "You drive on the 1st, your partner plays the second shot and you play the third. On the 2nd your partner drives.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define Foursomes and cover it in Rule 22.",
    },
    relatedTermIds: ["four-ball", "scramble", "match-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "foursomes" },
    capabilityIds: [],
    sources: [rog("Definitions: Foursomes; Rule 22")],
    status: "draft",
  },
  {
    id: "match-play",
    slug: "match-play",
    term: "Match Play",
    aliases: ["matchplay"],
    primaryCategory: "formats",
    tags: ["match-play"],
    priority: "mvp",
    shortDefinition:
      "A form of play where a player or side plays against another hole by hole. The lower score wins the hole, and the match goes to whoever has won more holes.",
    example:
      "A triple bogey loses you one hole, the same as losing it by one stroke. Three up with two to play, the match is over.",
    ruleNote: {
      kind: "rules",
      text: "Rule 3.2 of the Rules of Golf covers match play, including conceding a stroke, a hole or the match.",
    },
    relatedTermIds: ["nassau", "four-ball", "foursomes"],
    relatedContentPaths: ["/games/nassau"],
    canonical: { kind: "hub", anchor: "match-play" },
    capabilityIds: [],
    sources: [rog("Definitions: Match Play; Rule 3.2")],
    status: "draft",
  },
  {
    id: "stableford",
    slug: "stableford",
    term: "Stableford",
    aliases: [],
    primaryCategory: "formats",
    tags: ["stroke-play"],
    priority: "mvp",
    shortDefinition:
      "A scoring format that awards points for each hole's score against par instead of counting strokes. In the standard version, a bogey earns 1, a par 2, a birdie 3 and an eagle 4. Most points wins.",
    example:
      "A par, a bogey and a double bogey on three holes is 2 + 1 + 0: three points. A blow-up hole costs zero points, never more.",
    ruleNote: {
      kind: "rules",
      text: "Rule 21.1 of the Rules of Golf sets out Stableford and its standard points.",
    },
    relatedTermIds: ["match-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "stableford" },
    capabilityIds: [],
    sources: [rog("Definitions: Stableford; Rule 21.1")],
    status: "draft",
  },
];
