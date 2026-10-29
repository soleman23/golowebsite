/**
 * Handicaps and course ratings (#160, GLS-006c). Ten MVP records from
 * docs/glossary/inventory.md § D.
 *
 * IN REVIEW. Drafted October 29, 2026 and revised the same day against the
 * primary sources: every source with `accessedOn` was opened that day by
 * the agent preparing the rules fact-check (docs/glossary/review-packet.md
 * records what each says and the recomputed examples). No review stage is
 * signed: the owner signs the rules fact-check, the product audit and
 * approval (editorial-review.md), so no record has a review log yet.
 *
 * Worked numbers agree with /blog/index-vs-course-handicap (12.4 Index; blue
 * tees Slope 131, Course Rating 71.8; white tees 122, 69.6; par 72).
 *
 * GoLo notes come from handicap-strokes (live; app-check 0.6.2, not yet
 * re-confirmed under row 2 of docs/glossary/capability-check.md): full
 * Course Handicap, one set of tees per group, no allowance except a
 * scramble's team handicap, nobody off the low man. Allowances, low-man play
 * and mixed tees are explained as golf, never as a GoLo setting.
 */

import type { GlossaryTerm } from "../types";

export const handicapsTerms: GlossaryTerm[] = [
  {
    id: "handicap-index",
    slug: "handicap-index",
    term: "Handicap Index",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "A number, to one decimal, that measures a golfer's demonstrated ability on a course of standard difficulty. It's worked out from the best 8 of the player's most recent 20 score differentials, and it travels with them from course to course.",
    example:
      "A golfer whose best eight differentials out of their last twenty average 12.4 carries a 12.4 Handicap Index. Nobody receives 12.4 strokes: the Course Handicap turns it into strokes.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 5.2 of the Rules of Handicapping sets out the calculation. The index is updated the day after each new score is posted (Rule 5.4).",
    },
    relatedTermIds: ["course-handicap", "score-differential"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/blog/index-vs-course-handicap" },
    capabilityIds: [],
    ctaIntent: "handicaps",
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm",
        kind: "handicapping",
        ref: "Definitions: Handicap Index",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/5%202b%20For%2020%20Scores.htm",
        kind: "handicapping",
        ref: "Rule 5.2b",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/5%204%20Frequency%20of%20Revision%20of%20a%20Handicap%20Index.htm",
        kind: "handicapping",
        ref: "Rule 5.4",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/6%201a%2018%20holes.htm",
        kind: "handicapping",
        ref: "Rule 6.1a",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "course-handicap",
    slug: "course-handicap",
    term: "Course Handicap",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "The number of strokes a player receives from a particular set of tees, worked out from their Handicap Index, those tees' Slope Rating and Course Rating, and par.",
    explanation:
      "Course Handicap = Handicap Index × (Slope Rating ÷ 113) + (Course Rating − par), rounded to the nearest whole number, .5 up, for the strokes a player receives. A format's allowance is applied to the unrounded figure.",
    example:
      "A 12.4 Index from blue tees rated 71.8 with a Slope of 131, par 72: 12.4 × 131 ÷ 113 = 14.375, plus (71.8 − 72) = 14.175, so 14. From the whites (69.6, 122): 12.4 × 122 ÷ 113 = 13.388, minus 2.4 = 10.988, so 11.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 6.1a of the Rules of Handicapping sets out the formula.",
    },
    goloNote:
      "GoLo takes each player's Index and works out their Course Handicap for the group's tees. Everyone in a GoLo round plays one set of tees.",
    relatedTermIds: ["handicap-index", "playing-handicap", "slope-rating", "course-rating"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/blog/index-vs-course-handicap" },
    capabilityIds: ["handicap-strokes", "mixed-tees"],
    ctaIntent: "handicaps",
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm",
        kind: "handicapping",
        ref: "Definitions: Course Handicap",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/6%201a%2018%20holes.htm",
        kind: "handicapping",
        ref: "Rule 6.1a; Rule 6.1a, Note",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "playing-handicap",
    slug: "playing-handicap",
    term: "Playing Handicap",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "The strokes a player actually receives in a particular format: their Course Handicap with that format's handicap allowance applied.",
    example:
      "In four-ball stroke play, with the recommended 85% allowance, the 12.4 Index from the blue tees plays off 12: the unrounded Course Handicap is 14.175, and 14.175 × 0.85 = 12.05, rounded to 12.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 6.2a of the Rules of Handicapping applies the allowance to the unrounded Course Handicap, then rounds. Appendix C lists the recommended allowances.",
    },
    relatedTermIds: ["course-handicap", "handicap-allowance", "four-ball"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "playing-handicap" },
    capabilityIds: [],
    ctaIntent: "handicaps",
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm",
        kind: "handicapping",
        ref: "Definitions: Playing Handicap",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm",
        kind: "handicapping",
        ref: "Appendix C",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/6%202a%20Standard%20Calculation.htm",
        kind: "handicapping",
        ref: "Rule 6.2a and 6.2a/1",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "course-rating",
    slug: "course-rating",
    term: "Course Rating",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "The score a scratch golfer is expected to shoot from a particular set of tees in normal conditions, given to one decimal.",
    example:
      "Blue tees rated 71.8 on a par 72 play slightly easier than par for a scratch golfer, so they take 0.2 of a stroke off a Course Handicap before it's rounded.",
    ruleNote: {
      kind: "handicapping",
      text: "Course Ratings come from the Course Rating System, set out in Appendix G of the Rules of Handicapping.",
    },
    relatedTermIds: ["slope-rating", "course-handicap"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "course-rating" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm",
        kind: "handicapping",
        ref: "Definitions: Course Rating; Appendix G",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20G%20Golf%20Course%20CourseRatingSlopeRating.htm",
        kind: "handicapping",
        ref: "Appendix G",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/6%201a%2018%20holes.htm",
        kind: "handicapping",
        ref: "Rule 6.1a",
        accessedOn: "2026-10-29",
      },
      {
        title: "USGA",
        url: "https://www.usga.org/content/usga/home-page/articles/2024/10/course-rating-vs-slope-rating.html",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "slope-rating",
    slug: "slope-rating",
    term: "Slope Rating",
    aliases: ["slope"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "A number from 55 to 155 that shows how much harder a set of tees plays for a bogey golfer than for a scratch golfer. 113 is the standard.",
    example:
      "From tees with a Slope of 131, a 12.4 Index is worth 14.4 strokes before the Course Rating adjustment; from tees rated 113, it would be worth 12.4.",
    ruleNote: {
      kind: "handicapping",
      text: "Slope Rating is defined in the Rules of Handicapping and set through the Course Rating System (Appendix G).",
    },
    relatedTermIds: ["course-rating", "course-handicap"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "slope-rating" },
    capabilityIds: [],
    sources: [
      {
        title: "USGA: What Exactly are Course Rating and Slope Rating?",
        url: "https://www.usga.org/content/usga/home-page/articles/2025/11/what-exactly-are-course-rating-slope-rating.html",
        kind: "editorial",
        ref: "USGA article, Nov 2025",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm",
        kind: "handicapping",
        ref: "Definitions: Slope Rating; Appendix G",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf.com",
        url: "https://golf.com/instruction/golf-terms-guide-beginner-golfers/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "USGA",
        url: "https://www.usga.org/content/usga/home-page/articles/2024/10/course-rating-vs-slope-rating.html",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "stroke-index",
    slug: "stroke-index",
    term: "Stroke Index",
    aliases: ["handicap hole", "hole handicap"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "The ranking printed on the scorecard that orders a course's holes from 1 to 18 by where handicap strokes are received first.",
    example:
      "A Course Handicap of 14 gets one stroke on the holes indexed 1 to 14. A 22 gets two strokes on 1 to 4 and one on the other fourteen.",
    ruleNote: {
      kind: "handicapping",
      text: "Appendix E of the Rules of Handicapping sets out how clubs allocate the stroke index.",
    },
    relatedTermIds: ["handicap-stroke", "course-handicap"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "stroke-index" },
    capabilityIds: [],
    ctaIntent: "handicaps",
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm",
        kind: "handicapping",
        ref: "Definitions: Stroke Index; Appendix E",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20E%20Stroke%20Index%20Allocation.htm",
        kind: "handicapping",
        ref: "Appendix E",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "handicap-stroke",
    slug: "handicap-stroke",
    term: "Handicap Stroke",
    aliases: ["pop"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "A stroke taken off a player's score on a particular hole because of their handicap, placed by the scorecard's stroke index.",
    example:
      "With a stroke on stroke index 3, a bogey 5 counts as a net 4: it halves the hole against an opponent's par 4 with no stroke.",
    ruleNote: {
      kind: "handicapping",
      text: "In match play, the Rules of Handicapping have the lowest Playing Handicap play off zero and everyone else receive the difference (Appendix C).",
    },
    goloNote:
      "GoLo places strokes by the card's stroke index and gives every player their full Course Handicap; it doesn't play anyone off the low man.",
    relatedTermIds: ["stroke-index", "course-handicap", "playing-handicap"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "handicap-stroke" },
    capabilityIds: ["handicap-strokes", "handicap-allowances"],
    ctaIntent: "handicaps",
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20E%20Stroke%20Index%20Allocation.htm",
        kind: "handicapping",
        ref: "Appendix E",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm",
        kind: "handicapping",
        ref: "Appendix C, Handicap Competitions",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "handicap-allowance",
    slug: "handicap-allowance",
    term: "Handicap Allowance",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "The percentage of a Course Handicap a player gets in a particular format, set so players of different handicaps have a fair chance. The Rules of Handicapping recommend one for every format; some, like singles match play, are 100%.",
    example:
      "The recommended allowances include 95% for individual stroke play, 85% for four-ball stroke play, 100% for individual match play and 90% for four-ball match play.",
    ruleNote: {
      kind: "handicapping",
      text: "Appendix C of the Rules of Handicapping lists the recommended allowances; the Committee or the group can set others.",
    },
    goloNote:
      "GoLo gives every player their full Course Handicap. It applies no percentage, except a scramble's team handicap.",
    relatedTermIds: ["playing-handicap", "course-handicap", "four-ball", "scramble"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "handicap-allowance" },
    capabilityIds: ["handicap-strokes", "handicap-allowances", "scramble"],
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm",
        kind: "handicapping",
        ref: "Definitions: Handicap Allowance; Appendix C",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm",
        kind: "handicapping",
        ref: "Appendix C table; Appendix C; C/1",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "net-double-bogey",
    slug: "net-double-bogey",
    term: "Net Double Bogey",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "The most a player with a Handicap Index can count on a hole for handicap purposes: par plus two, plus any strokes their full Course Handicap gives them on that hole.",
    example:
      "On a par 4 where you receive one stroke, net double bogey is 4 + 2 + 1 = 7. Take a 9 and it goes on your handicap record as a 7.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 3.1b of the Rules of Handicapping sets it. A player without an Index yet is capped at par plus 5 (Rule 3.1a). Many groups also use net double bogey as the most anyone can take on a hole in their games.",
    },
    relatedTermIds: ["score-differential", "handicap-stroke"],
    relatedContentPaths: ["/faq"],
    canonical: { kind: "hub", anchor: "net-double-bogey" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/3%201b%20After%20a%20Handicap%20Index%20Has%20Been%20Established.htm",
        kind: "handicapping",
        ref: "Rule 3.1b; Definitions: Net Double Bogey",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/definitions",
        kind: "official-rules",
        ref: "Definitions: Maximum Score",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "score-differential",
    slug: "score-differential",
    term: "Score Differential",
    aliases: ["differential"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "mvp",
    shortDefinition:
      "The value one round contributes to a Handicap Index: how far the adjusted gross score was above the Course Rating, scaled to standard difficulty by the Slope Rating.",
    explanation:
      "Score Differential = (adjusted gross score − Course Rating) × 113 ÷ Slope Rating, with any playing conditions adjustment applied, to one decimal.",
    example:
      "An adjusted 88 from tees rated 71.8 with a Slope of 131: (88 − 71.8) × 113 ÷ 131 = 13.97, recorded as 14.0.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 5.1 of the Rules of Handicapping sets out the calculation.",
    },
    relatedTermIds: ["handicap-index", "course-rating", "slope-rating", "net-double-bogey"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "score-differential" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/5%201a%20Calculation%20of%20a%20Score%20Differential18Hole.htm",
        kind: "handicapping",
        ref: "Rule 5.1a; 5.1c",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm",
        kind: "handicapping",
        ref: "Definitions: Score Differential",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
];
