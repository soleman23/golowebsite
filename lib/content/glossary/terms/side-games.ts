/**
 * Side games (#159, GLS-006b). Ten MVP records from
 * docs/glossary/inventory.md § C.
 *
 * IN REVIEW. Drafted October 29, 2026 and revised the same day against the
 * primary sources: every source with `accessedOn` was opened that day by
 * the agent preparing the rules fact-check (docs/glossary/review-packet.md
 * records what each says and the recomputed examples). No review stage is
 * signed: the owner signs the rules fact-check, the product audit and
 * approval (editorial-review.md), so no record has a review log yet.
 *
 * GoLo notes follow the registry as corrected by the owner on October 29,
 * 2026: presses on Overall Match only, called, never automatic, a press on
 * a press allowed with no more than two live (#179); settle-up never holds
 * or moves money; no measured distances. Closest to the Pin cites
 * closest-to-pin (#194): the scorer marks the winner, par-to-win is the
 * group's call. Whether an unwon hole carries is in open PR #195 and isn't
 * claimed here. There is no junk board (#172), so Junk, Greenie and Sandy
 * are golf education with no GoLo note.
 */

import type { GlossaryTerm } from "../types";

export const sideGamesTerms: GlossaryTerm[] = [
  {
    id: "press",
    slug: "press",
    term: "Press",
    aliases: [],
    primaryCategory: "side-games",
    tags: ["presses", "match-play"],
    priority: "mvp",
    shortDefinition:
      "A new match started while an existing one is still running, usually called by the side that is behind. It covers only the holes left, and the original match carries on underneath it.",
    example:
      "In a $10 back nine you're two down with four to play. You press on the 15th tee: holes 15 to 18 are a second $10 match, and the back nine carries on as a match of its own.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide whether presses are called or automatic, when they can be called, and whether a press can itself be pressed.",
    },
    goloNote:
      "On GoLo's Overall Match game, the side two or more down calls a press at two, three or four times the amount, with up to two live at once. GoLo doesn't open presses automatically, and its Nassau takes none.",
    relatedTermIds: ["re-press", "nassau", "match-play"],
    relatedContentPaths: ["/games/nassau"],
    canonical: { kind: "existing", path: "/blog/pressing" },
    capabilityIds: ["overall-match-presses", "auto-press", "nassau-presses"],
    ctaIntent: "settle-up",
    sources: [
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/what-is-a-nassau-in-golf",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "re-press",
    slug: "re-press",
    term: "Re-press",
    aliases: ["repress", "press the press"],
    primaryCategory: "side-games",
    tags: ["presses"],
    priority: "mvp",
    shortDefinition:
      "A press on a press: a new match started by the side that has fallen behind in a press that is already running.",
    example:
      "You press on the 14th tee, then lose the 14th and 16th and halve the 15th. Two down in the press, you press it on the 17th tee: a third match for the 17th and 18th, on top of the other two.",
    ruleNote: {
      kind: "house-rules",
      text: "Some groups allow it, some cap the number of presses, and some never allow a press on a press. Agree before the first tee.",
    },
    goloNote:
      "On GoLo's Overall Match game a side can press a press, with no more than two presses live at once.",
    relatedTermIds: ["press", "nassau"],
    relatedContentPaths: ["/blog/pressing"],
    canonical: { kind: "hub", anchor: "re-press" },
    capabilityIds: ["overall-match-presses"],
    ctaIntent: "settle-up",
    sources: [
      {
        title: "CaddieHQ",
        url: "https://www.caddiehq.com/resources/what-does-pressing-mean-in-golf",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "carryover",
    slug: "carryover",
    term: "Carryover",
    aliases: ["carry", "carry over"],
    primaryCategory: "side-games",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A prize nobody won outright on a hole, usually a skin, added to the next hole's value instead of disappearing.",
    example:
      "Holes 1 to 3 are tied, so the 4th is worth four skins. At $5 a skin among four players, winning it outright takes $60.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide whether ties carry at all and what happens to anything still carried after the 18th.",
    },
    goloNote: "GoLo shows skins and carries building hole by hole on the scoring screen and the live leaderboard.",
    relatedTermIds: ["skins", "push"],
    relatedContentPaths: ["/games/skins"],
    canonical: { kind: "existing", path: "/blog/skins-carryover" },
    capabilityIds: ["game-library", "live-skins"],
    ctaIntent: "settle-up",
    sources: [
      {
        title: "Golf.com",
        url: "https://golf.com/news/skins-game-2025-everything-to-know-format-money/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "push",
    slug: "push",
    term: "Push",
    aliases: [],
    primaryCategory: "side-games",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A tie that leaves things where they were: nobody wins and nobody owes. In a game that carries, the value rolls on to the next hole.",
    explanation:
      "Push is the side-game word. In match play the Rules of Golf say a hole is tied, or halved.",
    example:
      "In a $5 Nassau the eighteen-hole match finishes all square. That match is a push, and nobody pays for it.",
    relatedTermIds: ["carryover", "skins", "match-play"],
    relatedContentPaths: ["/games/skins"],
    canonical: { kind: "hub", anchor: "push" },
    capabilityIds: [],
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-3",
        kind: "official-rules",
        ref: "Rule 3.2a(2)",
        accessedOn: "2026-10-29",
      },
      {
        title: "National Club Golfer",
        url: "https://www.nationalclubgolfer.com/club/glossary/nassau-golf-format-explained/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "greenie",
    slug: "greenie",
    term: "Greenie",
    aliases: [],
    primaryCategory: "side-games",
    tags: ["junk"],
    priority: "mvp",
    shortDefinition:
      "A side point for the tee shot closest to the hole on a par 3. Most groups only pay it if the ball is on the green, and many also require a par or better.",
    example:
      "On the 7th your tee shot stops eight feet away and you two-putt for par: that's the greenie. Hit it closer and make bogey, and in most groups nobody gets it.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups differ on whether the par is required, whether the fringe counts and whether an unclaimed greenie carries to the next par 3.",
    },
    relatedTermIds: ["closest-to-the-pin", "junk", "sandy"],
    relatedContentPaths: ["/games/closest-to-pin"],
    canonical: { kind: "hub", anchor: "greenie" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf.com",
        url: "https://practical-golf.com/golf-terms",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "sandy",
    slug: "sandy",
    term: "Sandy",
    aliases: ["sandie"],
    primaryCategory: "side-games",
    tags: ["junk"],
    priority: "mvp",
    shortDefinition:
      "A side point for getting up and down from a bunker: out of the sand and into the hole in two strokes, usually for par or better.",
    example:
      "You find the greenside bunker on a par 4, splash out to four feet and hole the putt for 4. That's a sandy.",
    ruleNote: {
      kind: "house-rules",
      text: "Some groups pay a sandy for any up-and-down from sand, whatever the score.",
    },
    relatedTermIds: ["junk", "greenie"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "sandy" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf News Net",
        url: "https://thegolfnewsnet.com/ryan_ballengee/2022/08/30/golf-terms-what-is-a-sandy-in-golf-and-what-does-it-mean-to-get-one-126969/",
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
    status: "in-review",
  },
  {
    id: "junk",
    slug: "junk",
    term: "Junk",
    aliases: ["trash", "garbage", "dots"],
    primaryCategory: "side-games",
    tags: ["junk"],
    priority: "mvp",
    shortDefinition:
      "The small side points a group plays for on top of its main game, such as greenies, sandies and birdies, each worth an agreed amount.",
    example:
      "At $1 a point, a round with a greenie, a sandy and a birdie is $3 from each of the other players before the main game is counted.",
    ruleNote: {
      kind: "house-rules",
      text: "Every group keeps its own list of what counts. Agree it before the first tee, and total it with the main game at the end.",
    },
    relatedTermIds: ["greenie", "sandy", "settle-up"],
    relatedContentPaths: ["/blog/who-pays-first"],
    canonical: { kind: "hub", anchor: "junk" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/oi-hacker-stop-whiffing-and-find-the-dance-floor-or-youll-make-a-snowman-an-a-z-glossary-of-golf-slang",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "LINKS Magazine",
        url: "https://linksmagazine.com/6-common-golf-games-explained/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "settle-up",
    slug: "settle-up",
    term: "Settle-up",
    aliases: ["settling up"],
    primaryCategory: "side-games",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "Squaring up after the round: working out what each player is up or down across every game, then who owes whom.",
    example:
      "Four players, three games. Netted, Mike is $25 up, Tom $5 up, Jess $10 down and Sarah $20 down. Three payments square it: Sarah pays Mike $20, Jess pays Mike $5 and Tom $5.",
    goloNote:
      "GoLo nets every game into one number per player and lists who owes whom for the group. Each round settles on its own, and GoLo never holds, moves or processes money.",
    relatedTermIds: ["junk", "press"],
    relatedContentPaths: ["/blog/who-pays-first", "/blog/settle-up-screen"],
    canonical: { kind: "hub", anchor: "settle-up" },
    capabilityIds: ["settle-up"],
    ctaIntent: "settle-up",
    sources: [],
    status: "in-review",
  },
  {
    id: "closest-to-the-pin",
    slug: "closest-to-the-pin",
    term: "Closest to the Pin",
    aliases: ["closest to pin", "ctp", "kp"],
    primaryCategory: "side-games",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A side game on a chosen par 3: the tee shot that finishes nearest the hole wins.",
    example:
      "On the 12th, three of four tee shots are on the green. The one 11 feet away beats 14 and 30 feet.",
    ruleNote: {
      kind: "house-rules",
      text: "Some groups also require the ball to be on the green, or a par, which makes it a greenie.",
    },
    goloNote:
      "In GoLo the scorer marks the winner on the holes the group chose, and the amount goes into the settle-up. No distance is recorded, and whether a par is needed is the group's call.",
    relatedTermIds: ["greenie", "longest-drive"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/games/closest-to-pin" },
    capabilityIds: ["closest-to-pin", "distance-logging"],
    ctaIntent: "games",
    sources: [
      {
        title: "lasvegasnational.com",
        url: "https://lasvegasnational.com/contests/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "web.stanford.edu",
        url: "https://web.stanford.edu/group/Taekwondo/golfclassic2012/rules.html",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
  {
    id: "longest-drive",
    slug: "longest-drive",
    term: "Longest Drive",
    aliases: ["long drive"],
    primaryCategory: "side-games",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A side game on a chosen hole: the longest tee shot that finishes in the fairway wins.",
    example:
      "On the par-5 9th, a 260-yard drive in the rough loses to a 240-yard drive in the fairway.",
    ruleNote: {
      kind: "house-rules",
      text: "Most groups only count a drive that finishes in the fairway; some allow the first cut.",
    },
    goloNote:
      "GoLo scores Longest Drive as a game, but it doesn't record a measured distance.",
    relatedTermIds: ["closest-to-the-pin"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/games/longest-drive" },
    capabilityIds: ["game-library", "distance-logging"],
    ctaIntent: "games",
    sources: [
      {
        title: "lasvegasnational.com",
        url: "https://lasvegasnational.com/contests/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "web.stanford.edu",
        url: "https://web.stanford.edu/group/Taekwondo/golfclassic2012/rules.html",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "in-review",
  },
];
