/**
 * Side games (#159, GLS-006b). Ten MVP records from
 * docs/glossary/inventory.md § C.
 *
 * DRAFTS. Written October 29, 2026; no review stage has happened.
 *
 * GoLo notes follow the registry as corrected by the owner on October 29,
 * 2026: presses on Overall Match only, called, never automatic, a press on
 * a press allowed with no more than two live (#179); settle-up never holds
 * or moves money; no measured distances. There is no junk board (#172), so
 * Junk, Greenie and Sandy are golf education with no GoLo note.
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
      "Two down after six holes of a $5 front nine, you press on the 7th tee. Holes 7 to 9 are now a second $5 match, and the front nine is still a match of its own.",
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
    ctaIntent: "games",
    sources: [],
    status: "draft",
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
      "You press at two down on the 14th, then go two down in that press by the 16th. Pressing again starts a third match for the 17th and 18th, on top of the other two.",
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
    ctaIntent: "games",
    sources: [],
    status: "draft",
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
    relatedTermIds: ["skins", "push"],
    relatedContentPaths: ["/games/skins"],
    canonical: { kind: "existing", path: "/blog/skins-carryover" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [],
    status: "draft",
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
      "Push is the side-game word. In match play the Rules of Golf call a tied hole halved.",
    example:
      "In a $5 Nassau the eighteen-hole match finishes all square. That match is a push, and nobody pays for it.",
    relatedTermIds: ["carryover", "skins", "match-play"],
    relatedContentPaths: ["/games/skins"],
    canonical: { kind: "hub", anchor: "push" },
    capabilityIds: [],
    sources: [],
    status: "draft",
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
      "A side point for the tee shot closest to the hole on a par 3, usually only if the ball finishes on the green and its player makes par or better.",
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
    sources: [],
    status: "draft",
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
    sources: [],
    status: "draft",
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
    sources: [],
    status: "draft",
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
      "Four players, three games. Net each player's results into one number, then settle with a few transfers instead of paying game by game.",
    goloNote:
      "GoLo nets every game into one number per player and lists who owes whom for the group. Each round settles on its own, and GoLo never holds, moves or processes money.",
    relatedTermIds: ["junk", "press"],
    relatedContentPaths: ["/blog/who-pays-first", "/blog/settle-up-screen"],
    canonical: { kind: "hub", anchor: "settle-up" },
    capabilityIds: ["settle-up"],
    ctaIntent: "settle-up",
    sources: [],
    status: "draft",
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
      "GoLo scores Closest to the Pin as a game, but it doesn't record a measured distance.",
    relatedTermIds: ["greenie", "longest-drive"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/games/closest-to-pin" },
    capabilityIds: ["game-library", "distance-logging"],
    ctaIntent: "games",
    sources: [],
    status: "draft",
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
    sources: [],
    status: "draft",
  },
];
