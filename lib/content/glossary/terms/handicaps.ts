/**
 * Handicaps and course ratings (#160, GLS-006c). Ten MVP records from
 * docs/glossary/inventory.md § D.
 *
 * DRAFTS. Written October 29, 2026; no review stage has happened. Every
 * figure here comes from the World Handicap System as the writer understands
 * the current USGA Rules of Handicapping. None of it is checked: the session
 * couldn't open usga.org, so every source is a reference without
 * `accessedOn`, and the rules fact-check recomputes each example from the
 * inputs shown.
 *
 * Worked numbers agree with /blog/index-vs-course-handicap (12.4 Index; blue
 * tees Slope 131, Course Rating 71.8; white tees 122, 69.6; par 72).
 *
 * No GoLo notes yet: handicap-strokes (row 2 of
 * docs/glossary/capability-check.md) waits on the owner's recheck. When it's
 * added, it says GoLo gives everyone their full Course Handicap with one set
 * of tees, and explains allowances as golf, never as a GoLo setting.
 */

import type { GlossarySource, GlossaryTerm } from "../types";

const roh = (ref: string): GlossarySource => ({
  title: "Rules of Handicapping (USGA, World Handicap System)",
  url: "https://www.usga.org/handicapping/roh/",
  kind: "handicapping",
  ref,
});

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
      text: "The Rules of Handicapping set out the calculation. The index is revised after each new score is posted.",
    },
    relatedTermIds: ["course-handicap", "score-differential"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/blog/index-vs-course-handicap" },
    capabilityIds: [],
    ctaIntent: "handicaps",
    sources: [roh("Definitions: Handicap Index; Rule 5.2")],
    status: "draft",
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
      "Course Handicap = Handicap Index × (Slope Rating ÷ 113) + (Course Rating − par), rounded to a whole number.",
    example:
      "A 12.4 Index from blue tees rated 71.8 with a Slope of 131, par 72: 12.4 × 131 ÷ 113 = 14.4, plus (71.8 − 72) = 14.2, so 14. From the whites (69.6, 122) the same player gets 11.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 6.1 of the Rules of Handicapping sets out the formula.",
    },
    relatedTermIds: ["handicap-index", "playing-handicap", "slope-rating", "course-rating"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/blog/index-vs-course-handicap" },
    capabilityIds: [],
    ctaIntent: "handicaps",
    sources: [roh("Rule 6.1")],
    status: "draft",
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
      "In four-ball stroke play, with the recommended 85% allowance, a Course Handicap of 14 becomes a Playing Handicap of 12 (14 × 0.85 = 11.9, rounded).",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 6.2 and Appendix C of the Rules of Handicapping cover Playing Handicaps and the recommended allowances.",
    },
    relatedTermIds: ["course-handicap", "handicap-allowance", "four-ball"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "playing-handicap" },
    capabilityIds: [],
    ctaIntent: "handicaps",
    sources: [roh("Rule 6.2; Appendix C")],
    status: "draft",
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
      "Blue tees rated 71.8 on a par 72 play slightly easier than par for a scratch golfer, so they take 0.2 off a Course Handicap.",
    ruleNote: {
      kind: "handicapping",
      text: "Course Ratings come from the Course Rating System, set out in Appendix G of the Rules of Handicapping.",
    },
    relatedTermIds: ["slope-rating", "course-handicap"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "course-rating" },
    capabilityIds: [],
    sources: [roh("Definitions: Course Rating; Appendix G")],
    status: "draft",
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
    sources: [roh("Definitions: Slope Rating; Appendix G")],
    status: "draft",
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
    sources: [roh("Appendix E")],
    status: "draft",
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
      "With a stroke on the 3rd, a bogey 5 counts as a net 4: it halves the hole against an opponent's par 4 with no stroke.",
    ruleNote: {
      kind: "convention",
      text: "In a match, the lowest handicap usually plays off scratch and everyone else receives the difference.",
    },
    relatedTermIds: ["stroke-index", "course-handicap", "playing-handicap"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "handicap-stroke" },
    capabilityIds: [],
    ctaIntent: "handicaps",
    sources: [roh("Rule 6; Appendix E")],
    status: "draft",
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
      "A percentage applied to Course Handicaps in some formats to keep them fair, because some formats favor higher handicaps more than others.",
    example:
      "The recommended allowances include 95% for individual stroke play, 85% for four-ball stroke play, 100% for individual match play and 90% for four-ball match play.",
    ruleNote: {
      kind: "handicapping",
      text: "Appendix C of the Rules of Handicapping lists the recommended allowances; the Committee or the group can set others.",
    },
    relatedTermIds: ["playing-handicap", "course-handicap", "four-ball", "scramble"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "handicap-allowance" },
    capabilityIds: ["handicap-allowances"],
    sources: [roh("Appendix C")],
    status: "draft",
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
      "The most a player can count on a hole for handicap purposes: double bogey plus any handicap strokes they receive on that hole.",
    example:
      "On a par 4 where you receive one stroke, net double bogey is 4 + 2 + 1 = 7. Take a 9 and it goes on your handicap record as a 7.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 3.1 of the Rules of Handicapping sets the maximum hole score. Many groups also use it as the most anyone can take on a hole in their games.",
    },
    relatedTermIds: ["score-differential", "handicap-stroke"],
    relatedContentPaths: ["/faq"],
    canonical: { kind: "hub", anchor: "net-double-bogey" },
    capabilityIds: [],
    sources: [roh("Rule 3.1")],
    status: "draft",
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
    sources: [roh("Rule 5.1")],
    status: "draft",
  },
];
