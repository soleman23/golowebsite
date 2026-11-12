/**
 * Expansion batch 7 (#168, #301, M8). Fourteen slang records from
 * docs/glossary/inventory.md § H, rows 153–166, plus Halve (§ A, row 20),
 * drafted November 12, 2026. The only mixed batch: Halve moved here because
 * it shares Rule 3.2 with Dormie and All Square (inventory.md § Expansion
 * batch plan). It keeps its scoring category.
 *
 * PUBLISHED by the batch 7 release PR, which the owner asked for after
 * approving all 15 ("Merge when they pass and are ready"). It took the count
 * past 150, so it also carries spec §7.4's "150+ Terms" title.
 * Expansion records go back to the owner's
 * review roles (editorial-review.md § Roles): an agent drafted these and
 * prepared the checks in docs/glossary/expansion-batch-7.md. On 2026-11-12
 * the owner delegated stages 2–4 for this batch to an agent and kept
 * approval (#301); each record logs those three stages below. The owner
 * approved all 15 in chat the same day ("Approve all 15").
 *
 * Every source with `accessedOn` was opened on that date. Rules of Golf
 * pages are the 2023 edition on randa.org. Pages whose URL carries a word
 * the vocabulary check bans were left out.
 *
 * No record makes a GoLo claim or cites a capability. Halve, Dormie and All
 * Square link the Nassau guide, as canonical-map.md has them.
 */

import type { GlossaryTerm, ReviewEntry } from "../types";

const DRAFTED_ON = "2026-11-12";

/**
 * Stages 2–4, done by an agent on 2026-11-12 under the owner's delegation of
 * that date for this batch only (#301; editorial-review.md § Roles).
 * Approval is the owner's.
 */
const REVIEWED_ON = "2026-11-12";

/** The day the release PR merged and deployed. */
const PUBLISHED_ON = "2026-11-12";

const reviewLog: ReviewEntry[] = [
  {
    stage: "rules",
    by: "agent",
    on: REVIEWED_ON,
    note: "Every source reopened 2026-11-12 (R&A 2023 Rules 3, 16 and 19; 22 editorial pages) and each sentence checked against it; examples recomputed (expansion-batch-7.md).",
  },
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "No GoLo claim, CTA or capability id; no field mentions GoLo or the app. Halve, Dormie and All Square link /games/nassau and agree with its glossary (#301).",
  },
  {
    stage: "seo",
    by: "agent",
    on: REVIEWED_ON,
    note: "Hub canonical at the slug, as inventory.md has every slang expansion term and Halve; related ids, the Nassau guide and the Rules Center paths pass lint:content.",
  },
  {
    stage: "approval",
    by: "owner",
    on: REVIEWED_ON,
    note: "Approved in chat on 2026-11-12, all 15 records, on the agent's stage 2–4 checks.",
  },
];
const ROG = "Rules of Golf, 2023 edition (R&A)";
const ROG_BASE = "https://www.randa.org/en/rog/";

const rule = (n: number, ref: string) =>
  ({
    title: `${ROG}: Rule ${n}`,
    url: `${ROG_BASE}the-rules-of-golf/rule-${n}`,
    kind: "official-rules",
    ref,
    accessedOn: DRAFTED_ON,
  }) as const;

const GOLFSHAKE = {
  title: "Golfshake: Golf terms explained, the complete A–Z golf glossary",
  url: "https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html",
  kind: "editorial",
  accessedOn: DRAFTED_ON,
} as const;

/** A Golf Compendium article, by its title and URL. */
const compendium = (title: string, url: string) =>
  ({
    title: `Golf Compendium: ${title}`,
    url,
    kind: "editorial",
    accessedOn: DRAFTED_ON,
  }) as const;

const GIMME_PUTTS = compendium("When are gimme putts allowed in golf?", "https://www.golfcompendium.com/2020/03/gimme-putts.html");

export const expansionBatch7Terms: GlossaryTerm[] = [
  {
    id: "halve",
    slug: "halve",
    term: "Halve",
    aliases: ["halved hole"],
    primaryCategory: "scoring",
    tags: ["match-play"],
    priority: "expansion",
    shortDefinition:
      "In match play, a tied hole: both sides take the same number of strokes, so neither wins it. A match that ends level is halved too.",
    explanation:
      "A halved hole leaves the match standing where it was. Push is the side-game word for the same tie. Under the Rules a tied match goes to extra holes unless the competition lets matches end level, as the Ryder Cup does.",
    example:
      "You and your opponent both make 4 on the 7th. The hole is halved, and if you were 1 up before it, you're still 1 up.",
    ruleNote: {
      kind: "rules",
      text: "Rule 3.2a(2): a hole is tied, or halved, when both sides complete it in the same number of strokes, penalty strokes included. Players may also agree to halve a hole, but only once at least one of them has made a stroke on it.",
    },
    relatedTermIds: ["push", "all-square", "dormie", "match-play"],
    relatedContentPaths: ["/rules#rule-3", "/games/nassau"],
    canonical: { kind: "hub", anchor: "halve" },
    capabilityIds: [],
    sources: [
      rule(3, "Rules 3.2a(2), 3.2a(4)"),
      compendium("What is a 'halve' or 'halved match' in golf?", "https://www.golfcompendium.com/2021/09/halved-golf-definition.html"),
      GOLFSHAKE,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "knee-knocker",
    slug: "knee-knocker",
    term: "Knee-Knocker",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal", "putting"],
    priority: "expansion",
    shortDefinition:
      "A short putt you really should make but easily could miss, usually somewhere inside 6 feet, with enough riding on it to make your knees shake.",
    explanation:
      "If nobody concedes it, you have to hole it. A golfer who keeps missing them may have the yips.",
    example:
      "All square on the 18th, your par putt is 4 feet. Nobody concedes it: that's a knee-knocker.",
    relatedTermIds: ["gimme", "the-yips", "putt"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "knee-knocker" },
    capabilityIds: [],
    sources: [
      {
        title: "All Square Golf: Knee knocker, golf terms",
        url: "https://www.allsquaregolf.com/golf-terms/knee-knocker",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Monthly: Bored of golf practice? Here's how to make it fun",
        url: "https://www.golfmonthly.com/features/bored-of-golf-practice-here-are-3-drills-to-make-it-fun",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "fried-egg",
    slug: "fried-egg",
    term: "Fried Egg",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "expansion",
    shortDefinition:
      "A ball half buried in a bunker, sitting in its own small crater with only the top showing, like the yolk of a fried egg.",
    explanation:
      "It usually happens when a ball lands in soft or wet sand. One common way to play it is an open-faced wedge and a very steep swing that stabs into the sand just behind the ball, closer to it than a normal bunker shot.",
    example:
      "After rain, your approach drops into a greenside bunker and stays where it landed, half buried. You play it as it lies.",
    ruleNote: {
      kind: "rules",
      text: "There's no free relief. Rule 16.3 gives free relief for a ball embedded in its own pitch-mark only in the general area; in a bunker you play it as it lies or declare it unplayable (Rule 19.3).",
    },
    relatedTermIds: ["bunker", "unplayable-ball"],
    relatedContentPaths: ["/rules#rule-16"],
    canonical: { kind: "hub", anchor: "fried-egg" },
    capabilityIds: [],
    sources: [
      compendium(
        "Explaining the fried egg lie in golf and how to play it",
        "https://www.golfcompendium.com/2019/06/fried-egg-lie-golf.html",
      ),
      rule(16, "Rule 16.3 (embedded ball, general area only)"),
      rule(19, "Rule 19.3 (unplayable ball in a bunker)"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "chili-dip",
    slug: "chili-dip",
    term: "Chili Dip",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal", "short-game"],
    priority: "expansion",
    shortDefinition:
      "A chip or pitch hit fat: the club digs into the ground behind the ball and makes little or no contact, so the ball goes only a short way.",
    explanation: "It's a fat shot around the green. British golfers tend to just call it fat.",
    example:
      "Ten yards short of the green, you chili-dip your wedge. A clump of turf flies and the ball moves 3 yards, still short of the green.",
    relatedTermIds: ["fat-shot", "chip", "pitch"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "chili-dip" },
    capabilityIds: [],
    sources: [
      {
        title: "National Club Golfer: NCG's golf glossary, what is a chili dip?",
        url: "https://www.nationalclubgolfer.com/club/glossary/golf-glossary-chili-dip/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf.com: These are the 2 reasons you chili-dip your wedges",
        url: "https://golf.com/instruction/short-game/2-reason-you-chili-dip-wedges/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "lip-out",
    slug: "lip-out",
    term: "Lip-Out",
    aliases: ["lipped out"],
    primaryCategory: "slang",
    tags: ["informal", "putting"],
    priority: "expansion",
    shortDefinition:
      "A putt that catches the edge of the hole, looks like it's dropping, then spins around the rim and stays out.",
    explanation:
      "It's a noun and a verb: the putt lipped out. A putt hit too firmly is a common cause, since the ball has too much speed to fall.",
    example:
      "Your 5-foot par putt runs around the back of the cup and stops an inch away. You tap in for bogey.",
    relatedTermIds: ["putt", "knee-knocker"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "lip-out" },
    capabilityIds: [],
    sources: [
      compendium("The dreaded lip out in golf", "https://www.golfcompendium.com/2021/05/lip-out-golf-definition.html"),
      GOLFSHAKE,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "inside-the-leather",
    slug: "inside-the-leather",
    term: "Inside the Leather",
    aliases: ["in the leather"],
    primaryCategory: "slang",
    tags: ["informal", "putting"],
    priority: "expansion",
    shortDefinition:
      "A rule of thumb for gimmes: a putt is given if the ball is nearer the hole than the length of a putter from its head to the bottom of the grip, about two feet on a standard putter.",
    explanation:
      "To check, set the putter head in the hole and lay the shaft toward the ball. If the whole ball is short of the grip, it's inside the leather. With a long putter in the group, agree before the round whose putter measures.",
    example:
      "Your ball stops 20 inches from the hole. Your opponent lays a standard putter beside it, the ball is short of the grip, and the putt is given.",
    ruleNote: {
      kind: "rules",
      text: "Gimmes aren't part of the Rules. In match play an opponent can concede your next stroke (Rule 3.2b); in stroke play you must hole out (Rule 3.3c).",
    },
    relatedTermIds: ["gimme", "good-good", "putter"],
    relatedContentPaths: ["/rules#conceded-putt"],
    canonical: { kind: "hub", anchor: "inside-the-leather" },
    capabilityIds: [],
    sources: [
      compendium("Here's what 'inside the leather' means in golf", "https://www.golfcompendium.com/2020/04/inside-the-leather.html"),
      GIMME_PUTTS,
      rule(3, "Rules 3.2b(1), 3.3c"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "the-turn",
    slug: "the-turn",
    term: "The Turn",
    aliases: ["making the turn"],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "expansion",
    shortDefinition:
      "The halfway point of an 18-hole round, between finishing the 9th and starting the 10th. Making the turn means moving from the front nine to the back nine.",
    explanation:
      "Golfers use it as a checkpoint for the score, as in two over at the turn, and for the stop many groups make there for food or a drink.",
    example: "You finish the 9th at 43, grab a sandwich at the halfway house and tee off on the 10th: 43 at the turn.",
    relatedTermIds: ["front-nine", "back-nine"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "the-turn" },
    capabilityIds: [],
    sources: [
      compendium(
        "What is 'the turn' (and 'making the turn') on a golf course?",
        "https://www.golfcompendium.com/2020/07/the-turn-definition-golf-course.html",
      ),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "dormie",
    slug: "dormie",
    term: "Dormie",
    aliases: ["dormy"],
    primaryCategory: "slang",
    tags: ["match-play"],
    priority: "expansion",
    shortDefinition:
      "In match play, being up by exactly as many holes as are left: 2 up with 2 to play, for example. The side that's up can't lose over the remaining holes; at worst the match ends level.",
    explanation:
      "If the trailing side wins every hole left, the match finishes all square, and a match that must have a winner then goes to extra holes. The Rules of Golf don't use the word, but golfers do.",
    example:
      "You're 2 up on the 17th tee: dormie. Your opponent wins the 17th and 18th, and the match finishes all square.",
    relatedTermIds: ["all-square", "halve", "match-play"],
    relatedContentPaths: ["/games/nassau"],
    canonical: { kind: "hub", anchor: "dormie" },
    capabilityIds: [],
    sources: [
      compendium("Explaining the meaning of dormie in golf", "https://www.golfcompendium.com/2021/09/dormie-meaning-in-golf.html"),
      GOLFSHAKE,
      rule(3, "Rules 3.2a(3), 3.2a(4)"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "all-square",
    slug: "all-square",
    term: "All Square",
    aliases: [],
    primaryCategory: "slang",
    tags: ["match-play"],
    priority: "expansion",
    shortDefinition:
      "In match play, level: both sides have won the same number of holes, so nobody is up.",
    explanation:
      "Leaderboards shorten it to AS, and the Rules of Golf also call it tied. It's a match standing, not a score: a stroke-play round level with par is even par.",
    example:
      "You win the 3rd, lose the 5th and halve the other four holes through the 6th: the match is all square.",
    relatedTermIds: ["halve", "dormie", "even-par", "match-play"],
    relatedContentPaths: ["/rules#rule-3", "/games/nassau"],
    canonical: { kind: "hub", anchor: "all-square" },
    capabilityIds: [],
    sources: [
      rule(3, "Rule 3.2d(1) (match score)"),
      compendium("What 'all square' means in golf scoring", "https://www.golfcompendium.com/2021/08/all-square-golf-definition.html"),
      GOLFSHAKE,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "good-good",
    slug: "good-good",
    term: "Good-Good",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal", "putting"],
    priority: "expansion",
    shortDefinition:
      "An offer between two opponents on the same green to concede each other's next putt, so both pick up without putting.",
    explanation:
      "It's a double concession, asked as a question: good-good? Each player counts the conceded stroke. It works only in match play, and only on the hole being played.",
    example:
      "On a par 4 you're both 2 feet from the hole after three strokes. \"Good-good?\" \"Good-good.\" You both pick up, write 4s and halve the hole.",
    ruleNote: {
      kind: "rules",
      text: "Concessions exist only in match play (Rule 3.2b). In stroke play each player must hole out (Rule 3.3c).",
    },
    relatedTermIds: ["gimme", "inside-the-leather", "match-play"],
    relatedContentPaths: ["/rules#conceded-putt"],
    canonical: { kind: "hub", anchor: "good-good" },
    capabilityIds: [],
    sources: [
      compendium("What does 'good-good' mean in golf?", "https://www.golfcompendium.com/2019/10/definition-of-good-good-in-golf.html"),
      rule(3, "Rules 3.2b(1), 3.3c"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "the-yips",
    slug: "the-yips",
    term: "The Yips",
    aliases: ["yips"],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "expansion",
    shortDefinition:
      "An involuntary jerk or twitch in the hands or wrists that wrecks a simple stroke, most often a short putt.",
    explanation:
      "Putting is where most golfers get them, but they can affect chipping and other shots too. Tommy Armour is credited with naming them, and they're still not well understood.",
    example: "Over a 3-foot par putt, the putter jumps at impact and the ball misses the hole by 6 inches.",
    relatedTermIds: ["knee-knocker", "putt"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "the-yips" },
    capabilityIds: [],
    sources: [
      GOLFSHAKE,
      {
        title: "Golf Monthly: Golfing yips, what are they?",
        url: "https://www.golfmonthly.com/features/the-game/golfing-yips-what-are-they-94886",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Today's Golfer: A–Z putting (Y), the yips",
        url: "https://www.todays-golfer.com/features/instruction-features/january/june/the-a-z-of-putting-/a-z-putting-y-the-yips/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "army-golf",
    slug: "army-golf",
    term: "Army Golf",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "expansion",
    shortDefinition:
      "Spraying shots both ways: left on one, right on the next, then left again, like the left-right-left of a marching cadence.",
    explanation: "It's never a compliment: the round goes from the left rough to the right rough and back again.",
    example:
      "Your drive finds the left rough, your approach the right bunker, and your bunker shot runs off the left side of the green.",
    relatedTermIds: ["hook", "slice"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "army-golf" },
    capabilityIds: [],
    sources: [compendium("Explain the slang: what is 'army golf'?", "https://www.golfcompendium.com/2020/04/army-golf-definition.html")],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "members-bounce",
    slug: "members-bounce",
    term: "Member's Bounce",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "expansion",
    shortDefinition:
      "A lucky bounce: a ball that kicks the right way, off a slope, tree or path, instead of into trouble.",
    explanation:
      "The name comes from member-guest events. The joke is that the member knows the course's slopes, so the good bounces are by design. It's luck.",
    example:
      "Your pulled approach hits the bank left of the green and kicks onto the putting surface. \"Member's bounce,\" says your opponent.",
    relatedTermIds: [],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "members-bounce" },
    capabilityIds: [],
    sources: [compendium("Definition of member's bounce", "https://www.golfcompendium.com/2020/07/members-bounce-definition-golf.html")],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "grip-it-and-rip-it",
    slug: "grip-it-and-rip-it",
    term: "Grip It and Rip It",
    aliases: [],
    primaryCategory: "slang",
    tags: ["informal"],
    priority: "expansion",
    shortDefinition:
      "Stop thinking and swing freely and hard. Golfers say it before an all-out swing, and some use it as a swing thought to clear their head.",
    explanation: "John Daly made it famous with the long, all-out driving that won him the 1991 PGA Championship.",
    example: "A wide fairway, nothing left or right, no wind: grip it and rip it.",
    relatedTermIds: ["drive", "driver"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "grip-it-and-rip-it" },
    capabilityIds: [],
    sources: [
      {
        title: "SwingU Clubhouse: Golf lingo decoded, a handy guide to common terms and slang",
        url: "https://clubhouse.swingu.com/lifestyle/golf-lingo-decoded-handy-guide-to-common-terms-and-slang",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Backswing: Grip it and rip it!",
        url: "https://backswing.com/answers/grip-it-and-rip-it",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      compendium("1991 PGA Championship winner and scores", "https://www.golfcompendium.com/2018/10/1991-pga-championship.html"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "ham-and-egg",
    slug: "ham-and-egg",
    term: "Ham and Egg",
    aliases: ["ham-and-egging"],
    primaryCategory: "slang",
    tags: ["informal", "team"],
    priority: "expansion",
    shortDefinition:
      "Two partners taking turns playing well, so that on each hole one of them is good enough to keep the team in it.",
    explanation:
      "It isn't one player carrying the other: neither plays well all round, just never badly at the same time. Where the team counts its better score on each hole, as in four-ball, one good score per hole is enough.",
    example:
      "On two par 4s, you make 4 and your partner 5 on the first, then your partner makes 3 and you 6 on the second. The team's better scores are 4 and 3.",
    relatedTermIds: ["four-ball"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "ham-and-egg" },
    capabilityIds: [],
    sources: [compendium("The meaning of 'ham and egg' in golf", "https://www.golfcompendium.com/2019/10/ham-and-egg-definition-golf.html")],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
];
