/**
 * Course and rules, equipment, slang (#162, GLS-006e). Thirteen MVP records
 * from docs/glossary/inventory.md § F, § G and § H.
 *
 * DRAFTS. Written October 29, 2026; no review stage has happened and no
 * source was opened. Course terms use the Rules of Golf's defined terms
 * (teeing area, general area, bunker, penalty area); fairway and rough are
 * explained as part of the general area. Slang is labelled informal, and
 * practices the Rules don't allow say so. Equipment: definitions, no brands.
 */

import type { GlossarySource, GlossaryTerm } from "../types";

const rog = (ref: string): GlossarySource => ({
  title: "Rules of Golf (R&A and USGA)",
  url: "https://www.randa.org/en/rog/the-rules-of-golf",
  kind: "official-rules",
  ref,
});

const roh = (ref: string): GlossarySource => ({
  title: "Rules of Handicapping (USGA, World Handicap System)",
  url: "https://www.usga.org/handicapping/roh/",
  kind: "handicapping",
  ref,
});

export const courseEquipmentSlangTerms: GlossaryTerm[] = [
  /* ------------------------------------------------- course and rules */
  {
    id: "teeing-area",
    slug: "teeing-area",
    term: "Teeing Area",
    aliases: ["tee box", "tee ground"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "mvp",
    shortDefinition:
      "The area a hole is played from: between the two tee markers and up to two club-lengths behind them.",
    explanation:
      "Most golfers call it the tee box. The Rules called it the teeing ground until 2019.",
    example:
      "Teeing up six inches ahead of the markers is outside the teeing area. In stroke play that's a two-stroke penalty and the shot is replayed.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define the teeing area, and Rule 6.2 covers playing from it.",
    },
    relatedTermIds: ["drive", "fairway"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "teeing-area" },
    capabilityIds: [],
    sources: [rog("Definitions: Teeing Area; Rule 6.2")],
    status: "draft",
  },
  {
    id: "fairway",
    slug: "fairway",
    term: "Fairway",
    aliases: ["short grass"],
    primaryCategory: "course-rules",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "The closely mown strip between the teeing area and the green, where the ball sits up best for the next shot.",
    explanation:
      "The Rules don't treat it separately: the fairway and the rough are both part of the general area.",
    example:
      "A drive that finishes in the fairway on a 400-yard par 4 usually leaves a clean lie for the approach.",
    relatedTermIds: ["rough", "teeing-area", "longest-drive"],
    relatedContentPaths: ["/games/longest-drive"],
    canonical: { kind: "hub", anchor: "fairway" },
    capabilityIds: [],
    sources: [rog("Definitions: General Area")],
    status: "draft",
  },
  {
    id: "rough",
    slug: "rough",
    term: "Rough",
    aliases: [],
    primaryCategory: "course-rules",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "The longer grass beside the fairway, where the ball can sit down and the next shot is harder to control.",
    explanation:
      "Like the fairway, it's part of the general area under the Rules, so no special rules apply there.",
    example:
      "From thick rough 150 yards out, many players take one club less loft than usual or play short of the green.",
    relatedTermIds: ["fairway"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "rough" },
    capabilityIds: [],
    sources: [rog("Definitions: General Area")],
    status: "draft",
  },
  {
    id: "bunker",
    slug: "bunker",
    term: "Bunker",
    aliases: ["sand trap", "trap"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "mvp",
    shortDefinition:
      "A specially prepared area of sand, often a hollow, where turf or soil has been removed. Grass-covered edges and walls aren't part of it.",
    example:
      "In a greenside bunker you can't rest your club on the sand right behind the ball before you play.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define a bunker, and Rule 12 covers playing from one, including when the club may touch the sand.",
    },
    relatedTermIds: ["sandy", "penalty-area"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "bunker" },
    capabilityIds: [],
    sources: [rog("Definitions: Bunker; Rule 12")],
    status: "draft",
  },
  {
    id: "penalty-area",
    slug: "penalty-area",
    term: "Penalty Area",
    aliases: ["water hazard", "lateral hazard"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "mvp",
    shortDefinition:
      "Water, or another area the course marks with red or yellow stakes or lines, where a player can play the ball as it lies or take relief for one penalty stroke.",
    explanation:
      "Before 2019 the Rules called these water hazards and lateral water hazards. Red marks allow more relief options than yellow.",
    example:
      "Your tee shot finds the pond on the 9th. You drop under the penalty area relief options and your next shot is your third.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define a penalty area, and Rule 17 sets out the relief options.",
    },
    relatedTermIds: ["bunker"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "penalty-area" },
    capabilityIds: [],
    sources: [rog("Definitions: Penalty Area; Rule 17")],
    status: "draft",
  },

  /* -------------------------------------------------------- equipment */
  {
    id: "driver",
    slug: "driver",
    term: "Driver",
    aliases: ["big dog", "1-wood"],
    primaryCategory: "equipment",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "The longest club in the bag, with the biggest head and the least loft apart from the putter, used for tee shots on most par 4s and par 5s.",
    explanation: "The driver is the club; the drive is the shot.",
    example:
      "Most drivers have between 8 and 12 degrees of loft. A 7-iron has more than 30.",
    relatedTermIds: ["drive", "longest-drive"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "driver" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "putter",
    slug: "putter",
    term: "Putter",
    aliases: ["flatstick"],
    primaryCategory: "equipment",
    tags: ["putting"],
    priority: "mvp",
    shortDefinition:
      "The club used to roll the ball on the green, with a flat face and very little loft.",
    example:
      "From the fringe a few feet off the green, many players putt rather than chip: a putter is the easiest club to control.",
    relatedTermIds: ["putt"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "putter" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },

  /* ------------------------------------------------------------ slang */
  {
    id: "mulligan",
    slug: "mulligan",
    term: "Mulligan",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "mvp",
    shortDefinition:
      "Replaying a bad shot without counting it, by agreement within a group. Informal, and not allowed under the Rules of Golf.",
    example:
      "Your opening drive goes out of bounds, your group allows one mulligan a side, and you hit again as if the first never happened.",
    ruleNote: {
      kind: "rules",
      text: "A round with mulligans in it isn't played under the Rules of Golf, so it shouldn't be posted for handicap as if it were.",
    },
    relatedTermIds: ["breakfast-ball"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "mulligan" },
    capabilityIds: [],
    sources: [roh("Rule 2.1 (acceptable scores)")],
    status: "draft",
  },
  {
    id: "gimme",
    slug: "gimme",
    term: "Gimme",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal", "putting"],
    priority: "mvp",
    shortDefinition:
      "A short putt the other players agree to count as holed without it being played.",
    example:
      "Your ball stops eighteen inches from the hole and your opponent says to pick it up: you count one more stroke and move on.",
    ruleNote: {
      kind: "rules",
      text: "In match play the Rules allow an opponent to concede a stroke (Rule 3.2b). In stroke play every ball has to be holed out.",
    },
    relatedTermIds: ["putt", "match-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "gimme" },
    capabilityIds: [],
    sources: [rog("Rule 3.2b; Rule 3.3c")],
    status: "draft",
  },
  {
    id: "breakfast-ball",
    slug: "breakfast-ball",
    term: "Breakfast Ball",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "mvp",
    shortDefinition:
      "A mulligan on the first tee only, by group agreement, for the player who arrived with no time to warm up.",
    example:
      "Your first drive of the day hits a tree twenty yards out. Your group allows a breakfast ball, so you hit another.",
    relatedTermIds: ["mulligan"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "breakfast-ball" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "snowman",
    slug: "snowman",
    term: "Snowman",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "mvp",
    shortDefinition: "A score of 8 on a hole, named for the shape of the number.",
    example:
      "An 8 on a par 4 is a quadruple bogey; on a par 5 it's a triple. Either way, it's a snowman.",
    relatedTermIds: ["double-bogey", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "snowman" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "19th-hole",
    slug: "19th-hole",
    term: "19th Hole",
    aliases: ["nineteenth hole"],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "mvp",
    shortDefinition:
      "The clubhouse bar, or wherever the group goes after the round.",
    example:
      "Scores get compared, the settle-up gets done and the 14th gets replayed at the 19th hole.",
    relatedTermIds: ["settle-up"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "19th-hole" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
  {
    id: "worm-burner",
    slug: "worm-burner",
    term: "Worm Burner",
    aliases: ["worm killer"],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "mvp",
    shortDefinition:
      "A shot that never gets off the ground and skims along the grass, usually from catching the top of the ball.",
    example:
      "A worm burner off the tee can still run 150 yards on a firm fairway. It just won't look good doing it.",
    relatedTermIds: ["drive"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "worm-burner" },
    capabilityIds: [],
    sources: [],
    status: "draft",
  },
];
