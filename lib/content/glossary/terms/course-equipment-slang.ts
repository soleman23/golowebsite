/**
 * Course and rules, equipment, slang (#162, GLS-006e). Thirteen MVP records
 * from docs/glossary/inventory.md § F, § G and § H.
 *
 * PUBLISHED by the launch PR (#166). Drafted and source-checked October 29,
 * 2026: every source with `accessedOn` was opened on that date
 * (docs/glossary/review-packet.md records what each says and the recomputed
 * examples). The review log is in ../review.ts: rules, product and SEO by an
 * agent under the owner's delegation, approval by the owner in writing.
 *
 * Course terms use the Rules of Golf's defined terms
 * (teeing area, general area, bunker, penalty area); fairway and rough are
 * explained as part of the general area. Slang is labelled informal, and
 * practices the Rules don't allow say so. Equipment: definitions, no brands.
 */

import { MVP_REVIEWED_ON, mvpReviewLogNone } from "../review";
import type { GlossaryTerm } from "../types";

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
      text: "The Rules of Golf define the teeing area. Rule 6.1b sets the penalty for playing from outside it, and Rule 6.2 covers playing from it.",
    },
    relatedTermIds: ["drive", "fairway"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "teeing-area" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/definitions",
        kind: "official-rules",
        ref: "Definitions: Teeing Area",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-6",
        kind: "official-rules",
        ref: "Rule 6.1b(2); Rules 6.1b, 6.2b",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/teeing%20ground",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "USGA: Golf's New Rules: Changing Terminology",
        url: "https://www.usga.org/content/usga/home-page/articles/2019/04/golf-s-new-rules--changing-terminology.html",
        kind: "official-rules",
        ref: "2019 renamings",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "fairway",
    slug: "fairway",
    term: "Fairway",
    aliases: [],
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
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/definitions",
        kind: "official-rules",
        ref: "Definitions: General Area",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/fairway",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golfshake",
        url: "https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
      "From thick rough 150 yards out, grass gets between the club and the ball, so it comes out with less spin and is harder to stop. Many players aim for the middle of the green or lay up.",
    relatedTermIds: ["fairway"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "rough" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/definitions",
        kind: "official-rules",
        ref: "Definitions: General Area",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/rough",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golfshake",
        url: "https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
      "A specially prepared area of sand, often a hollow where turf or soil was removed. Its lip, walls and faces, and any grass growing inside its edge, aren't part of it.",
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
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/definitions",
        kind: "official-rules",
        ref: "Definitions: Bunker",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-12",
        kind: "official-rules",
        ref: "Rule 12.2b(1)",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/sand%20trap",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golfshake",
        url: "https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
      "Your tee shot finds the pond on the 9th. You take one of the relief options for one penalty stroke, so your next shot is your third.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define a penalty area, and Rule 17 sets out the relief options.",
    },
    relatedTermIds: ["bunker"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "penalty-area" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-17",
        kind: "official-rules",
        ref: "Definitions: Penalty Area; Rule 17.1b, 17.1d",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/definitions",
        kind: "official-rules",
        ref: "Definitions: Penalty Area",
        accessedOn: "2026-10-29",
      },
      {
        title: "USGA: Golf's New Rules: Changing Terminology",
        url: "https://www.usga.org/content/usga/home-page/articles/2019/04/golf-s-new-rules--changing-terminology.html",
        kind: "official-rules",
        ref: "2019 renamings",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
      "Drivers range from about 7 to 13 degrees of loft. A 7-iron usually has around 34.",
    relatedTermIds: ["drive", "longest-drive"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "driver" },
    capabilityIds: [],
    sources: [
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/driver",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golfshake",
        url: "https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf Monthly: What Degree Loft Should Your Golf Clubs Be?",
        url: "https://www.golfmonthly.com/features/the-game/degree-golf-clubs-190027",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
    sources: [
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/putter",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/32-most-common-golf-expressions-and-how-to-use-them",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
      kind: "handicapping",
      text: "A mulligan ignores the Rules of Golf. Under Rule 2.1b of the Rules of Handicapping, a round where a player deliberately ignores a Rule generally isn't acceptable for posting.",
    },
    relatedTermIds: ["breakfast-ball"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "mulligan" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/2%201b%20Played%20by%20the%20Rules%20of%20Golf.htm",
        kind: "handicapping",
        ref: "Rule 2.1b(ii); 2.1b/3",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/mulligan",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf.com",
        url: "https://golf.com/instruction/golf-terms-guide-beginner-golfers/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
      text: "In match play an opponent can concede your next stroke (Rule 3.2b). In regular stroke play you must hole out on every hole (Rule 3.3c). For handicap posting, a ball left within five feet on the green counts as one more stroke (Rules of Handicapping 3.3).",
    },
    relatedTermIds: ["putt", "match-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "gimme" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-3",
        kind: "official-rules",
        ref: "Rule 3.2b(1); Rule 3.3c",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/3%203%20WhenHoleStartedbutPlayerDoesNotHoleOut.htm",
        kind: "handicapping",
        ref: "Rule 3.3",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/gimme",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/what-is-a-gimme-244054",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
    ruleNote: {
      kind: "handicapping",
      text: "It's a mulligan by another name, so the same posting rule applies: a round that deliberately ignores a Rule generally isn't acceptable for handicap (Rules of Handicapping 2.1b).",
    },
    relatedTermIds: ["mulligan"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "breakfast-ball" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/2%201b%20Played%20by%20the%20Rules%20of%20Golf.htm",
        kind: "handicapping",
        ref: "Rule 2.1b(ii)",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/what-is-a-breakfast-ball-in-golf",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf News Net",
        url: "https://thegolfnewsnet.com/ryan_ballengee/2026/03/13/what-is-a-breakfast-ball-in-golf-what-does-that-mean-for-a-golfer-123650/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
    sources: [
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/32-most-common-golf-expressions-and-how-to-use-them",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
    sources: [
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/nineteenth%20hole",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
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
      "A shot that barely gets off the ground and skims along the grass.",
    example:
      "A worm burner off the tee can still run 150 yards on a firm fairway. It just won't look good doing it.",
    relatedTermIds: ["drive"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "worm-burner" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Practical Golf",
        url: "https://practical-golf.com/golf-terms",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "MyGolfSpy",
        url: "https://mygolfspy.com/news-opinion/instruction/golf-shot-names-explained-from-hosel-rockets-to-worm-burners/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
];
