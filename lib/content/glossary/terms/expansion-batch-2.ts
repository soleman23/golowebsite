/**
 * Expansion batch 2 (#168, M8). Fifteen records from
 * docs/glossary/inventory.md, drafted November 11, 2026: the five side-games
 * terms the owner kept on 2026-11-11 (§ C rows 67–70 and 72) and the ten
 * handicaps expansion terms (§ D rows 85–94).
 *
 * APPROVED, NOT PUBLISHED. Nothing here reaches a public page, the search
 * index, the sitemap, llms.txt or structured data until a release PR
 * publishes it; approved records show only in local review (../selectors). Expansion records go back to the owner's
 * review roles (editorial-review.md § Roles): an agent drafted these and
 * prepared the checks in docs/glossary/expansion-batch-2.md. On 2026-11-11
 * the owner delegated stages 2–4 for this batch to an agent and kept
 * approval (#283); each record logs those three stages below. The owner
 * approved all 15 in chat the same day ("Approve all 15").
 *
 * Every source with `accessedOn` was opened on that date. The Rules of
 * Handicapping pages are the 2024 edition under
 * usga.org/handicapping/roh/Content/rules/. Pages whose URL carries a word
 * the vocabulary check bans were left out.
 *
 * Barkie, Poley, Snake and Arnie are golf education with no GoLo note: the
 * registry's junk-board is not offered, and the game-library and
 * skins-greenie-sandie limits say barkies, poleys, snakes and arnies aren't
 * scored. They relate to the published Junk record but carry no `junk` tag
 * (the owner cut junk as a category on 2026-10-30). Double or Nothing has no
 * golf source that defines it as a game of its own, so it gets the general
 * meaning, with the golf use (a press on the 18th tee) as the example.
 *
 * The handicap records are WHS education. Only Plus Handicap has a GoLo
 * note, from the handicap-strokes limit the owner confirmed on 2026-11-11
 * (#283). The owner also confirmed that GoLo doesn't post scores or
 * calculate an Index, a Low Handicap Index, a PCC, the caps or an exceptional
 * score reduction, so those records say nothing about GoLo.
 */

import type { GlossaryTerm, ReviewEntry } from "../types";

const DRAFTED_ON = "2026-11-11";
const ROH = "Rules of Handicapping, 2024 edition (USGA)";
const ROH_BASE = "https://www.usga.org/handicapping/roh/Content/rules/";

/**
 * Stages 2–4, done by an agent on 2026-11-11 under the owner's delegation of
 * that date for this batch only (#283; editorial-review.md § Roles).
 * Approval is the owner's.
 */
const REVIEWED_ON = "2026-11-11";

/** The owner's approval, given in chat on 2026-11-11 ("Approve all 15"). */
const approval: ReviewEntry = {
  stage: "approval",
  by: "owner",
  on: REVIEWED_ON,
  note: "Approved in chat on 2026-11-11, all 15 records, on the agent's stage 2–4 checks.",
};

const rules: ReviewEntry = {
  stage: "rules",
  by: "agent",
  on: REVIEWED_ON,
  note: "Every source reopened 2026-11-11 and each sentence checked against it; examples recomputed (expansion-batch-2.md).",
};

const seo: ReviewEntry = {
  stage: "seo",
  by: "agent",
  on: REVIEWED_ON,
  note: "Canonical per canonical-map.md; related ids and paths pass lint:content.",
};

/** No GoLo note: checked that nothing in the record implies a GoLo feature. */
const reviewLogNone: ReviewEntry[] = [
  rules,
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "No GoLo note; capability ids checked against capabilities.ts and the owner's answers of 2026-11-11 (#283).",
  },
  seo,
  approval,
];

/** A GoLo note, checked against a live registry limit. */
const reviewLogGolo: ReviewEntry[] = [
  rules,
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "GoLo note checked against the handicap-strokes limit the owner confirmed on 2026-11-11 (#283); app code not read.",
  },
  seo,
  approval,
];

export const expansionBatch2Terms: GlossaryTerm[] = [
  /* ------------------------------------------------------ side games */
  {
    id: "barkie",
    slug: "barkie",
    term: "Barkie",
    aliases: ["barky", "woodie"],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A side point for making par or better on a hole where your ball hit a tree at least once. Each of the other players owes the agreed amount.",
    example:
      "At $1 each in a foursome, you clip a tree off the 4th tee, punch out, and still make 4 on the par 4. That's a barkie: $1 from each of the other three, $3 in all.",
    ruleNote: {
      kind: "house-rules",
      text: "Some groups pay double for two trees on one hole, or for a birdie after hitting one. Agree what counts as hitting a tree before the round.",
    },
    relatedTermIds: ["junk", "sandy", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "barkie" },
    capabilityIds: ["junk-board"],
    sources: [
      {
        title: "The Golf News Net: What is a barky or barkie in golf?",
        url: "https://thegolfnewsnet.com/ryan_ballengee/2022/08/30/golf-terms-what-is-a-barky-or-barkie-in-golf-and-what-does-it-mean-to-get-one-126970/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Compendium: How to play the Barkies golf game",
        url: "https://www.golfcompendium.com/2019/07/barkies-golf-game.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "poley",
    slug: "poley",
    term: "Poley",
    aliases: ["polie"],
    primaryCategory: "side-games",
    tags: ["putting"],
    priority: "expansion",
    shortDefinition:
      "A side point for holing a putt from farther away than the length of the flagstick, measured by laying the flagstick down if anyone asks. Each of the other players owes the agreed amount.",
    example:
      "At $1 each in a foursome, you hole a 30-foot putt on the 11th, well past a flagstick's length. That's a poley: $1 from each of the other three.",
    ruleNote: {
      kind: "house-rules",
      text: "Versions differ: some count only putts from off the green, some make you call the poley before you putt, and in those a three-putt costs you double.",
    },
    relatedTermIds: ["junk", "putt", "greenie"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "poley" },
    capabilityIds: ["junk-board"],
    sources: [
      {
        title: "CaddieHQ: What is a poley in golf?",
        url: "https://www.caddiehq.com/resources/what-is-a-poley-in-golf",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Compendium: How to play the Poley golf game",
        url: "https://www.golfcompendium.com/2021/02/poley-golf-game.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "snake",
    slug: "snake",
    term: "Snake",
    aliases: [],
    primaryCategory: "side-games",
    tags: ["putting"],
    priority: "expansion",
    shortDefinition:
      "A putting side game. Whoever three-putts holds the snake until someone else three-putts, and whoever holds it after the last hole owes each of the other players the agreed amount.",
    explanation:
      "In a common version the amount doubles every time the snake changes hands, so it starts small.",
    example:
      "A $5 snake in a foursome. You three-putt the 4th, Dave the 9th, and you again on the 16th. Nobody three-putts after that, so you owe $5 to each of the other three: $15.",
    ruleNote: {
      kind: "house-rules",
      text: "Agree before the round whether the amount is fixed or doubles: at $1 doubling, the third three-putt of the day makes it $4. If two players three-putt the same hole, one common rule gives it to the last one to hole out.",
    },
    relatedTermIds: ["putt", "junk"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "snake" },
    capabilityIds: ["junk-board"],
    sources: [
      {
        title: "Golf Compendium: How to play the Snake side game",
        url: "https://www.golfcompendium.com/2025/09/snake-putting-game.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "England iGolf: What is Snake in golf?",
        url: "https://englandigolf.co.uk/igolf-blog/blog-archive/what-is-snake-in-golf-how-to-play-this-ultimate-putting-test/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Monthly: Golf bits, what are they?",
        url: "https://www.golfmonthly.com/features/the-game/golf-bits-95132-95132",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "arnie",
    slug: "arnie",
    term: "Arnie",
    aliases: ["arnold"],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A side point for making par on a hole without your ball ever finishing in the fairway, named after Arnold Palmer. It's usually counted only on par 4s and par 5s.",
    example:
      "On the par-5 8th you drive into the left rough, lay up into the right rough, pitch on and two-putt for 5. Never in the fairway, and par: an Arnie, worth $1 from each of the other three at $1 each.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide whether a birdie counts and what it's worth, and whether par 3s count at all: some groups score a par after missing the green.",
    },
    relatedTermIds: ["junk", "fairway", "rough", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "arnie" },
    capabilityIds: ["junk-board"],
    sources: [
      {
        title: "Where2Golf: Golf dictionary",
        url: "https://www.where2golf.com/dictionary/",
        kind: "editorial",
        ref: "Arnies",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Swing Yard: Fun golf games to play on the course",
        url: "https://swingyard.com/fun-golf-games-for-the-course/",
        kind: "editorial",
        ref: "Arnie",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Parful: Arnies, golf game rules and scoring",
        url: "https://www.parful.io/games/arnies",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "double-or-nothing",
    slug: "double-or-nothing",
    term: "Double or Nothing",
    aliases: [],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "An offer to play one more contest for the amount already owed: if the side that's behind wins, the debt is cleared; if it loses, it owes twice as much.",
    explanation:
      "It isn't a golf game of its own. Golfers use the phrase for a press on the 18th tee, sometimes called an Aloha press, that plays the last hole for everything the trailing side is down.",
    example:
      "You're $10 down after 17 and offer double or nothing on the 18th. Win the hole and you're square; lose it and you owe $20.",
    ruleNote: {
      kind: "house-rules",
      text: "The side that's ahead doesn't have to accept. Agree what a halved hole means before it's played.",
    },
    relatedTermIds: ["press", "hammer", "nassau"],
    relatedContentPaths: ["/blog/pressing"],
    canonical: { kind: "hub", anchor: "double-or-nothing" },
    capabilityIds: [],
    sources: [
      {
        title: "Merriam-Webster: double or nothing",
        url: "https://www.merriam-webster.com/dictionary/double%20or%20nothing",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf.com: The Etiquetteist, denying an opponent's press",
        url: "https://golf.com/instruction/rules/the-etiquetteist-deny-opponents-press/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },

  /* ------------------------------------------------------- handicaps */
  {
    id: "world-handicap-system",
    slug: "world-handicap-system",
    term: "World Handicap System",
    aliases: ["whs"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "The handicapping system run jointly by the USGA and The R&A: the Rules of Handicapping and the Course Rating System. It gives a golfer one Handicap Index that works on any rated course.",
    explanation:
      "National associations authorised by the USGA and The R&A run it in their countries, and clubs look after their members' Indexes.",
    example:
      "The same 12.4 Index plays off 14 from blue tees rated 71.8 with a Slope of 131, and off 11 from white tees rated 69.6 with a Slope of 122, both par 72.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 1.1 of the Rules of Handicapping sets out what the system is for; Rules 1.2 and 1.3 cover who runs it.",
    },
    relatedTermIds: ["handicap-index", "course-handicap", "score-differential", "course-rating"],
    relatedContentPaths: ["/blog/index-vs-course-handicap"],
    canonical: { kind: "hub", anchor: "world-handicap-system" },
    capabilityIds: [],
    ctaIntent: "handicaps",
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}1%201%20Purpose%20of%20the%20World%20Handicap%20System.htm`,
        kind: "handicapping",
        ref: "Rule 1.1",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}1%202%20Authorization%20to%20Use%20the%20World%20Handicap.htm`,
        kind: "handicapping",
        ref: "Rule 1.2",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}1%203%20Responsibilities%20of%20PlayerHandicapCommittee.htm`,
        kind: "handicapping",
        ref: "Rule 1.3",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}6%201a%2018%20holes.htm`,
        kind: "handicapping",
        ref: "Rule 6.1a",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "scratch-golfer",
    slug: "scratch-golfer",
    term: "Scratch Golfer",
    aliases: ["scratch", "scratch player"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "A golfer with a Handicap Index of 0.0. A set of tees' Course Rating is the score a scratch golfer is expected to shoot from them in normal conditions.",
    example:
      "A 0.0 Index gets no strokes from tees rated 71.8 on a par 72: 0 + (71.8 − 72) = −0.2, which rounds to 0. From tees rated 73.4, the same golfer gets one stroke: 1.4 rounds to 1.",
    ruleNote: {
      kind: "handicapping",
      text: "The Rules of Handicapping call this a scratch player. In conversation, a scratch golfer is anyone who plays to par.",
    },
    relatedTermIds: ["course-rating", "slope-rating", "handicap-index", "plus-handicap"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "scratch-golfer" },
    capabilityIds: [],
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}Definitions.htm`,
        kind: "handicapping",
        ref: "Definitions: Scratch Player; Course Rating",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Appendix%20G%20Golf%20Course%20CourseRatingSlopeRating.htm`,
        kind: "handicapping",
        ref: "Appendix G (e)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}6%201a%2018%20holes.htm`,
        kind: "handicapping",
        ref: "Rule 6.1a",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Where2Golf: Golf dictionary",
        url: "https://www.where2golf.com/dictionary/",
        kind: "editorial",
        ref: "scratch (player)",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "bogey-golfer",
    slug: "bogey-golfer",
    term: "Bogey Golfer",
    aliases: ["bogey player"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "A golfer with a Handicap Index of about 20.0 for men or about 24.0 for women. Slope Rating measures how much harder a set of tees plays for a bogey golfer than for a scratch golfer.",
    explanation:
      "Course raters estimate a Bogey Rating, the bogey golfer's expected score from each set of tees. The gap between it and the Course Rating sets the Slope Rating.",
    example:
      "A 20.0 Index from blue tees rated 71.8 with a Slope of 131, par 72: 20.0 × 131 ÷ 113 = 23.186, minus 0.2 = 22.986, so 23 strokes. That's one on every hole and a second on stroke index 1 to 5.",
    ruleNote: {
      kind: "handicapping",
      text: "The Rules of Handicapping call this a bogey player and give the figures as approximate. Appendix G has the course rated for both the scratch player and the bogey player.",
    },
    relatedTermIds: ["bogey", "slope-rating", "course-rating", "scratch-golfer"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "bogey-golfer" },
    capabilityIds: [],
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}Definitions.htm`,
        kind: "handicapping",
        ref: "Definitions: Bogey Player; Slope Rating",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Appendix%20G%20Golf%20Course%20CourseRatingSlopeRating.htm`,
        kind: "handicapping",
        ref: "Appendix G (e)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}6%201a%2018%20holes.htm`,
        kind: "handicapping",
        ref: "Rule 6.1a",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Appendix%20E%20Stroke%20Index%20Allocation.htm`,
        kind: "handicapping",
        ref: "Appendix E",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "plus-handicap",
    slug: "plus-handicap",
    term: "Plus Handicap",
    aliases: ["plus handicapper"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "A Handicap Index better than scratch, written with a plus sign, such as +1.5. Instead of receiving strokes, the player gives them back: they're added to the gross score.",
    example:
      "A +1.5 Index from blue tees rated 71.8 with a Slope of 131, par 72: −1.5 × 131 ÷ 113 = −1.739, plus (71.8 − 72) = −1.939, so +2. The player adds a stroke on stroke index 18 and 17, and a gross 71 is a net 73.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 5.2c of the Rules of Handicapping asks players to write a plus Index with the + sign. Appendix C has a plus player give strokes back from stroke index 18; on nine holes they start at the highest stroke index on that nine (Appendix E). An allowance moves a plus handicap toward zero.",
    },
    // Owner, 2026-11-11 (#283), checked against production web build
    // 1.2.2 (35); recorded as a handicap-strokes limit.
    goloNote:
      "GoLo accepts a plus Index. In an 18-hole net round it adds the strokes back to the player's net score from stroke index 18, then 17, and so on.",
    relatedTermIds: ["scratch-golfer", "handicap-index", "course-handicap", "stroke-index"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "plus-handicap" },
    capabilityIds: ["handicap-strokes"],
    ctaIntent: "handicaps",
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}5%202c%20For%20Plus%20Handicap%20Index.htm`,
        kind: "handicapping",
        ref: "Rule 5.2c; 5.2c/1",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Appendix%20C%20Handicap%20Allowances.htm`,
        kind: "handicapping",
        ref: "Appendix C, Plus Playing Handicaps; C/3",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Appendix%20E%20Stroke%20Index%20Allocation.htm`,
        kind: "handicapping",
        ref: "Appendix E, Stroke Index Allocation for 9-Hole Play",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}6%201a%2018%20holes.htm`,
        kind: "handicapping",
        ref: "Rule 6.1a",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogGolo,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "sandbagging",
    slug: "sandbagging",
    term: "Sandbagging",
    aliases: ["sandbagger", "bandit"],
    primaryCategory: "handicaps",
    tags: ["handicap", "informal"],
    priority: "expansion",
    shortDefinition:
      "Keeping a Handicap Index higher than your real ability, usually by not posting good rounds or by dropping shots once a good score is going, to get more strokes than you should.",
    example:
      "Two players both play to about a 12. One posts every round and carries a 12.0; the other posts only the bad ones and carries an 18.0. Off tees with a Slope of 113 and a Course Rating equal to par, the second gets six strokes from the first, on stroke index 1 to 6.",
    ruleNote: {
      kind: "handicapping",
      text: "The Rules of Handicapping expect every acceptable score to be posted (Rule 1.3). A Handicap Committee can review an Index, adjust or freeze it, and post a penalty score for a round that wasn't submitted (Rules 7.1a and 7.1b).",
    },
    relatedTermIds: ["handicap-index", "exceptional-score-reduction", "score-differential"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/blog/sandbagging" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Monthly: The 4 most common tricks used by golf club bandits",
        url: "https://www.golfmonthly.com/features/the-game/the-4-most-common-tricks-used-by-golf-club-bandits",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}1%203%20Responsibilities%20of%20PlayerHandicapCommittee.htm`,
        kind: "handicapping",
        ref: "Rule 1.3 (i)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}7%201a%20Conducting%20a%20Handicap%20Review%20and%20Adjusting%20a%20Handicap%20Index.htm`,
        kind: "handicapping",
        ref: "Rule 7.1a",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}7%201b%20Applying%20a%20Penalty%20Score.htm`,
        kind: "handicapping",
        ref: "Rule 7.1b",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "GoLo: Sandbagging, how to spot it without starting a fight",
        url: "https://www.golo.golf/blog/sandbagging",
        kind: "first-party",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "playing-conditions-calculation",
    slug: "playing-conditions-calculation",
    term: "Playing Conditions Calculation",
    aliases: ["pcc"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "A daily statistical check that compares the scores posted at a course with what those players were expected to shoot. If the course played much harder or easier than normal, it adjusts that day's Score Differentials.",
    example:
      "An adjusted 88 from tees rated 71.8 with a Slope of 131 is a 14.0 on a normal day. With a PCC of +1 it's (88 − 71.8 − 1) × 113 ÷ 131 = 13.11, recorded as 13.1.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 5.6 of the Rules of Handicapping: it needs at least eight acceptable scores from players with an Index of 36.0 or below, and comes out at −1.0, 0.0, +1.0, +2.0 or +3.0. A plus figure means the course played harder.",
    },
    relatedTermIds: ["score-differential", "course-rating", "handicap-index"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "playing-conditions-calculation" },
    capabilityIds: [],
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}5%206%20Playing%20Conditions%20Calculation.htm`,
        kind: "handicapping",
        ref: "Rule 5.6; 5.6/1",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}5%201a%20Calculation%20of%20a%20Score%20Differential18Hole.htm`,
        kind: "handicapping",
        ref: "Rule 5.1a",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Definitions.htm`,
        kind: "handicapping",
        ref: "Definitions: Playing Conditions Calculation (PCC)",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "soft-cap",
    slug: "soft-cap",
    term: "Soft Cap",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "A brake on how fast a Handicap Index can rise: once a newly calculated Index is more than 3.0 above the player's Low Handicap Index, only half of the rise beyond 3.0 counts.",
    explanation:
      "The Low Handicap Index is the lowest Index the player had in the year before their most recent round.",
    example:
      "Low Handicap Index 10.0. A run of poor rounds calculates to 14.6, a rise of 4.6. The first 3.0 counts in full and half of the other 1.6 counts, so the new Index is 13.8.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 5.8 of the Rules of Handicapping. The caps start once a player has a Low Handicap Index, which takes 20 scores (Rule 5.7). There's no limit on how fast an Index can come down.",
    },
    relatedTermIds: ["hard-cap", "handicap-index", "score-differential"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "soft-cap" },
    capabilityIds: [],
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}5%208%20Limit%20on%20Upward%20Movement%20of%20a%20Handicap.htm`,
        kind: "handicapping",
        ref: "Rule 5.8 (i)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}5%207%20Low%20Handicap%20Index.htm`,
        kind: "handicapping",
        ref: "Rule 5.7",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Definitions.htm`,
        kind: "handicapping",
        ref: "Definitions: Cap; Low Handicap Index",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "hard-cap",
    slug: "hard-cap",
    term: "Hard Cap",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "The ceiling on a rising Handicap Index: after the soft cap is applied, the Index can't end up more than 5.0 above the player's Low Handicap Index.",
    example:
      "Low Handicap Index 10.0, and a bad spell calculates to 19.0. The soft cap makes it 10.0 + 3.0 + half of 6.0 = 16.0; the hard cap stops it at 15.0.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 5.8 of the Rules of Handicapping. A Handicap Committee can raise an Index past that limit only in exceptional circumstances, such as a long illness or injury (Rule 7.1a).",
    },
    relatedTermIds: ["soft-cap", "handicap-index"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "hard-cap" },
    capabilityIds: [],
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}5%208%20Limit%20on%20Upward%20Movement%20of%20a%20Handicap.htm`,
        kind: "handicapping",
        ref: "Rule 5.8 (ii)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}7%201a%20Conducting%20a%20Handicap%20Review%20and%20Adjusting%20a%20Handicap%20Index.htm`,
        kind: "handicapping",
        ref: "Rule 7.1a (ii)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Definitions.htm`,
        kind: "handicapping",
        ref: "Definitions: Cap",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "exceptional-score-reduction",
    slug: "exceptional-score-reduction",
    term: "Exceptional Score Reduction",
    aliases: ["esr"],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "An automatic cut to a Handicap Index after an unusually good round: a Score Differential at least 7.0 better than the player's Index that day takes 1.0 off, and one 10.0 or more better takes 2.0 off.",
    example:
      "A 15.0 Index posts a Score Differential of 6.6, which is 8.4 better. That's in the 7.0 to 9.9 band, so 1.0 comes off each of the last 20 differentials, and the new Index comes out 1.0 lower than the plain calculation.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 5.9 of the Rules of Handicapping. Reductions for more than one exceptional score add up. The cut fades as newer rounds replace the adjusted ones, and a Handicap Committee can override it.",
    },
    relatedTermIds: ["score-differential", "handicap-index", "sandbagging"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "exceptional-score-reduction" },
    capabilityIds: [],
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}5%209%20Submission%20of%20an%20Exceptional%20Score.htm`,
        kind: "handicapping",
        ref: "Rule 5.9",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Definitions.htm`,
        kind: "handicapping",
        ref: "Definitions: Exceptional Score",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "most-likely-score",
    slug: "most-likely-score",
    term: "Most Likely Score",
    aliases: [],
    primaryCategory: "handicaps",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "The score recorded for handicap purposes on a hole a player starts but doesn't finish for a valid reason: the strokes taken, plus the strokes they'd most likely need to hole out, plus any penalty strokes.",
    example:
      "In a four-ball, your partner makes 4 on the 7th and you can't beat it, so you pick up 15 yards from the hole after four shots. From there the guideline adds two or three strokes: you record 6 or 7, or net double bogey if that's lower.",
    ruleNote: {
      kind: "handicapping",
      text: "Rule 3.3 of the Rules of Handicapping. On the green within 5 feet, add one stroke; from 5 feet to 20 yards, two or three; beyond 20 yards, three or four. It can't exceed net double bogey, or par plus 5 for a player without an Index yet.",
    },
    relatedTermIds: ["net-double-bogey", "four-ball", "gimme"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "most-likely-score" },
    capabilityIds: [],
    sources: [
      {
        title: ROH,
        url: `${ROH_BASE}3%203%20WhenHoleStartedbutPlayerDoesNotHoleOut.htm`,
        kind: "handicapping",
        ref: "Rule 3.3; 3.3/1",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROH,
        url: `${ROH_BASE}Definitions.htm`,
        kind: "handicapping",
        ref: "Definitions: Most Likely Score",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
];
