/**
 * Scoring and shots (#161, GLS-006d). Thirteen MVP records from
 * docs/glossary/inventory.md § A and § E.
 *
 * DRAFTS. Written October 29, 2026; no review stage has happened, and no
 * source was opened. Scoring examples use one hole with par and strokes
 * shown; net examples match the handicaps batch (Course Handicap 14).
 */

import type { GlossaryTerm } from "../types";

const RULES_OF_GOLF = "https://www.randa.org/en/rog/the-rules-of-golf";

export const scoringShotsTerms: GlossaryTerm[] = [
  /* ---------------------------------------------------------- scoring */
  {
    id: "par",
    slug: "par",
    term: "Par",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "mvp",
    shortDefinition:
      "The number of strokes a skilled player is expected to need on a hole, usually 3, 4 or 5 and mostly set by its length. A course's par is the total of its holes, often 70 to 72.",
    example:
      "On a 168-yard par 3, three strokes is par. Two is a birdie and four is a bogey.",
    relatedTermIds: ["birdie", "bogey", "stroke-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "par" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "birdie",
    slug: "birdie",
    term: "Birdie",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "mvp",
    shortDefinition: "A score one stroke under par on a hole.",
    example:
      "A 3 on a par 4, or a 4 on a par 5. With a handicap stroke on the hole, a gross par can be a net birdie.",
    relatedTermIds: ["eagle", "par"],
    relatedContentPaths: ["/games/birdies"],
    canonical: { kind: "hub", anchor: "birdie" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "eagle",
    slug: "eagle",
    term: "Eagle",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "mvp",
    shortDefinition: "A score two strokes under par on a hole.",
    example:
      "A 3 on a par 5, or a hole-in-one on a par 3. Most golfers make a lot more birdies.",
    relatedTermIds: ["birdie", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "eagle" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "bogey",
    slug: "bogey",
    term: "Bogey",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "mvp",
    shortDefinition: "A score one stroke over par on a hole.",
    explanation:
      "In older British usage, bogey was the expected score for a hole, close to what par means now.",
    example: "A 5 on a par 4, or a 4 on a par 3.",
    relatedTermIds: ["double-bogey", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "bogey" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "double-bogey",
    slug: "double-bogey",
    term: "Double Bogey",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "mvp",
    shortDefinition: "A score two strokes over par on a hole.",
    explanation:
      "Not the same as net double bogey, the handicap system's maximum for a hole, which adds any handicap strokes the player receives.",
    example: "A 6 on a par 4, or a 5 on a par 3.",
    relatedTermIds: ["bogey", "net-double-bogey", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "double-bogey" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "gross-score",
    slug: "gross-score",
    term: "Gross Score",
    aliases: ["gross"],
    primaryCategory: "scoring",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "The actual number of strokes taken, penalty strokes included, before any handicap strokes are deducted.",
    example: "Eighty-eight strokes over eighteen holes is a gross 88.",
    relatedTermIds: ["net-score", "stroke-play"],
    relatedContentPaths: ["/games/best-score"],
    canonical: { kind: "hub", anchor: "gross-score" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "net-score",
    slug: "net-score",
    term: "Net Score",
    aliases: ["net"],
    primaryCategory: "scoring",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "A score after handicap strokes are deducted: the gross score minus the strokes the player receives.",
    example:
      "A gross 88 with a Course Handicap of 14 is a net 74. On a single hole, a 5 with one stroke is a net 4.",
    relatedTermIds: ["gross-score", "handicap-stroke", "course-handicap"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "net-score" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "stroke-play",
    slug: "stroke-play",
    term: "Stroke Play",
    aliases: ["medal play"],
    primaryCategory: "scoring",
    tags: ["stroke-play"],
    priority: "mvp",
    shortDefinition:
      "A form of play where every stroke counts, and the lowest total for the round wins.",
    example:
      "A triple bogey on the 6th costs three strokes against par in stroke play. In match play it would only lose one hole.",
    ruleNote: {
      kind: "rules",
      text: "Rule 3.3 of the Rules of Golf covers stroke play.",
    },
    relatedTermIds: ["match-play", "gross-score", "stableford"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "stroke-play" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Golf (R&A and USGA)",
        url: RULES_OF_GOLF,
        kind: "official-rules",
        ref: "Definitions: Stroke Play; Rule 3.3",
      },
    ],
    status: "draft",
  },

  /* ------------------------------------------------------------ shots */
  {
    id: "drive",
    slug: "drive",
    term: "Drive",
    aliases: [],
    primaryCategory: "shots",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "The first shot on a par 4 or par 5, hit from the teeing area for distance, usually with a driver.",
    explanation:
      "Not the same as the driver, which is the club. A tee shot with an iron on a par 3 is a tee shot, but rarely called a drive.",
    example: "A 240-yard drive leaves about 160 yards into a 400-yard par 4.",
    relatedTermIds: ["longest-drive"],
    relatedContentPaths: ["/games/longest-drive"],
    canonical: { kind: "hub", anchor: "drive" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "chip",
    slug: "chip",
    term: "Chip",
    aliases: ["chip shot"],
    primaryCategory: "shots",
    tags: ["short-game"],
    priority: "mvp",
    shortDefinition:
      "A short, low shot from just off the green that spends little time in the air and most of it rolling toward the hole.",
    explanation:
      "A chip rolls more than it flies; a pitch flies more than it rolls.",
    example:
      "From the fringe 30 feet away, a chip lands a few feet onto the green and rolls the rest of the way.",
    relatedTermIds: ["pitch", "putt"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "chip" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "pitch",
    slug: "pitch",
    term: "Pitch",
    aliases: ["pitch shot"],
    primaryCategory: "shots",
    tags: ["short-game"],
    priority: "mvp",
    shortDefinition:
      "A short, high shot that carries most of the way to its target and stops quickly, used when rough, sand or water is between the ball and the hole.",
    example:
      "Forty yards out with a bunker in front of the flag, a pitch flies the sand and stops near the hole.",
    relatedTermIds: ["chip"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "pitch" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "putt",
    slug: "putt",
    term: "Putt",
    aliases: [],
    primaryCategory: "shots",
    tags: ["putting"],
    priority: "mvp",
    shortDefinition:
      "A stroke on the putting green, usually with a putter, that rolls the ball along the ground toward the hole.",
    example:
      "On in two on a par 4, two putts make par. Three putts make bogey.",
    relatedTermIds: ["chip"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "putt" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "slice",
    slug: "slice",
    term: "Slice",
    aliases: ["banana ball"],
    primaryCategory: "shots",
    tags: ["ball-flight"],
    priority: "mvp",
    shortDefinition:
      "A shot that curves sharply away from the player's dominant side: left to right for a right-handed golfer, right to left for a left-handed one.",
    explanation:
      "A gentle, controlled curve the same way is a fade. A slice is the one that didn't mean to.",
    example:
      "A right-hander aims down the middle and the ball finishes in the trees on the right.",
    relatedTermIds: ["drive"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "slice" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
];
