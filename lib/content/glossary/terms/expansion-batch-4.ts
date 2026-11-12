/**
 * Expansion batch 4 (#168, #292, M8). Fifteen scoring records from
 * docs/glossary/inventory.md § A, rows 9–19 and 21–24, drafted November 11,
 * 2026. Halve (row 20) goes to batch 7 with Dormie and All Square
 * (inventory.md § Expansion batch plan).
 *
 * PUBLISHED by the batch 4 release PR, which the owner asked for after
 * approving all 15 ("Merge, then release"). Expansion records go back to the owner's
 * review roles (editorial-review.md § Roles): an agent drafted these and
 * prepared the checks in docs/glossary/expansion-batch-4.md. On 2026-11-11
 * the owner delegated stages 2–4 for this batch to an agent and kept
 * approval (#292); each record logs those three stages below. The owner
 * approved all 15 in chat the same day ("Approve all 15").
 *
 * Every source with `accessedOn` was opened on that date. Rules of Golf
 * pages are the 2023 edition on randa.org. Pages whose URL carries a word
 * the vocabulary check bans were left out.
 *
 * No record mentions GoLo or cites a capability: the drafts are golf only,
 * and the packet asks the owner whether Scorecard, Front Nine or Back Nine
 * should carry a GoLo note. Front Nine and Back Nine relate to the Nassau
 * record, a golf term the site already defines.
 */

import type { GlossaryTerm, ReviewEntry } from "../types";

const DRAFTED_ON = "2026-11-11";
const ROG = "Rules of Golf, 2023 edition (R&A)";
const ROG_BASE = "https://www.randa.org/en/rog/";

const ROG_DEFINITIONS = {
  title: `${ROG}: Definitions`,
  url: `${ROG_BASE}definitions`,
  kind: "official-rules",
} as const;

/**
 * Stages 2–4, done by an agent on 2026-11-11 under the owner's delegation of
 * that date for this batch only (#292; editorial-review.md § Roles).
 * Approval is the owner's.
 */
const REVIEWED_ON = "2026-11-11";

/** The day the release PR merged and deployed. */
const PUBLISHED_ON = "2026-11-11";

const reviewLog: ReviewEntry[] = [
  {
    stage: "rules",
    by: "agent",
    on: REVIEWED_ON,
    note: "Every source reopened 2026-11-11 (R&A 2023 Definitions and Rules 1, 3, 17 and 21; 16 editorial and first-party pages) and each sentence checked against it; examples recomputed (expansion-batch-4.md).",
  },
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "Golf only: no GoLo note, link, CTA or capability id, and no public field mentions GoLo or the app; the Nassau guide is an internal source only (#292).",
  },
  {
    stage: "seo",
    by: "agent",
    on: REVIEWED_ON,
    note: "Hub canonical at the slug, as canonical-map.md has every scoring expansion term; related ids and paths pass lint:content.",
  },
  {
    stage: "approval",
    by: "owner",
    on: REVIEWED_ON,
    note: "Approved in chat on 2026-11-11, all 15 records, on the agent's stage 2–4 checks.",
  },
];

const GOLFSHAKE = {
  title: "Golfshake: Golf terms explained, the complete A–Z golf glossary",
  url: "https://www.golfshake.com/news/view/1700/Golf_Terms_Explained_The_Complete_A_Z_Golf_Glossary_for_Every_Golfer.html",
  kind: "editorial",
  accessedOn: DRAFTED_ON,
} as const;

const GOLF_COM_TERMS = {
  title: "Golf.com: Golf terms guide for beginner golfers",
  url: "https://golf.com/instruction/golf-terms-guide-beginner-golfers/",
  kind: "editorial",
  accessedOn: DRAFTED_ON,
} as const;

export const expansionBatch4Terms: GlossaryTerm[] = [
  {
    id: "hole-in-one",
    slug: "hole-in-one",
    term: "Hole-in-One",
    aliases: ["ace"],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "A score of 1 on a hole: the tee shot goes in. Nearly every one is made on a par 3, where it's two under par; on a short par 4 it's three under.",
    explanation:
      "By the numbers an ace on a par 3 is also an eagle, and on a par 4 an albatross, but golfers call it an ace.",
    example:
      "On the 152-yard 8th, a par 3, your tee shot pitches short and rolls in. You write 1 on the card: two under par for the hole.",
    relatedTermIds: ["eagle", "albatross", "condor", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "hole-in-one" },
    capabilityIds: [],
    sources: [GOLF_COM_TERMS, GOLFSHAKE],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "albatross",
    slug: "albatross",
    term: "Albatross",
    aliases: ["double eagle"],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "A score three under par on a hole, also called a double eagle: a 2 on a par 5, or a hole-in-one on a par 4.",
    example:
      "On the par-5 15th you hole your second shot from 230 yards. That's a 2, three under par.",
    relatedTermIds: ["eagle", "hole-in-one", "condor", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "albatross" },
    capabilityIds: [],
    sources: [GOLF_COM_TERMS, GOLFSHAKE],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "condor",
    slug: "condor",
    term: "Condor",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "A score four under par on a hole. It's only possible on a par 5 or longer, so in practice it means a hole-in-one on a par 5, or a 2 on one of the few par 6s.",
    explanation:
      "Several of the few on record came on dogleg par 5s, where the drive cut the corner.",
    relatedTermIds: ["albatross", "hole-in-one", "eagle"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "condor" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Compendium: Explaining the condor golf score",
        url: "https://www.golfcompendium.com/2020/07/condor-golf-score.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "The Golf News Net: What is a condor in golf?",
        url: "https://thegolfnewsnet.com/ryan_ballengee/2025/01/05/what-is-a-condor-in-golf-4-under-par-on-a-hole-in-one-par-5-121666/",
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
    id: "triple-bogey",
    slug: "triple-bogey",
    term: "Triple Bogey",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "A score three over par on a hole: a 6 on a par 3, a 7 on a par 4 or an 8 on a par 5.",
    example:
      "On the par-4 9th: a drive into the trees, a chip back out, a third short of the green, a chip on and three putts. 1 + 1 + 1 + 1 + 3 = 7, a triple bogey.",
    relatedTermIds: ["double-bogey", "quadruple-bogey", "net-double-bogey"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "triple-bogey" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Compendium: Triple bogey golf meaning and example scores",
        url: "https://www.golfcompendium.com/2022/04/triple-bogey-meaning.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "American Golf: Golf scoring explained",
        url: "https://blog.americangolf.co.uk/golf-scoring-explained/",
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
    id: "quadruple-bogey",
    slug: "quadruple-bogey",
    term: "Quadruple Bogey",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "A score four over par on a hole: a 7 on a par 3, an 8 on a par 4 or a 9 on a par 5.",
    explanation: "An 8 on a par 4 is also a snowman, for the shape of the number.",
    relatedTermIds: ["triple-bogey", "snowman", "double-bogey"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "quadruple-bogey" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Compendium: The golf scores that result in a quadruple bogey",
        url: "https://golfcompendium.com/2022/02/quadruple-bogey-golf-score.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Compendium: Triple bogey, quadruple bogey, what scores come next?",
        url: "https://www.golfcompendium.com/2023/02/what-comes-after-quadruple-bogey.html",
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
    id: "even-par",
    slug: "even-par",
    term: "Even Par",
    aliases: ["level par"],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "A score equal to par, for a hole or for the holes played so far. A birdie and a bogey cancel out, so a player who makes one of each is back to even.",
    explanation:
      "Level par is the same thing; it's the usual phrase in Britain and other places that follow the R&A. On a leaderboard, even par is shown as E.",
    example:
      "Through four holes you've made par, birdie, bogey, par: even par. Finish with 72 on a par-72 course and the round is even par.",
    ruleNote: {
      kind: "convention",
      text: "Even par is a score against the course. A match that's tied is all square, not even par.",
    },
    relatedTermIds: ["par", "under-par", "over-par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "even-par" },
    capabilityIds: [],
    sources: [
      GOLF_COM_TERMS,
      GOLFSHAKE,
      {
        title: "Golf Compendium: What level par and even par mean in golf",
        url: "https://www.golfcompendium.com/2026/02/even-par-level-par.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Monthly: What does E mean in golf?",
        url: "https://www.golfmonthly.com/tour/what-does-e-mean-in-golf",
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
    id: "under-par",
    slug: "under-par",
    term: "Under Par",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "Fewer strokes than par, for a hole or for the holes played so far. Two under means two strokes below par.",
    example:
      "A 34 on a par-36 front nine is two under par. A birdie on the 10th makes it three under.",
    relatedTermIds: ["even-par", "over-par", "birdie", "par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "under-par" },
    capabilityIds: [],
    sources: [
      GOLF_COM_TERMS,
      {
        title: "Golf Compendium: What under par means in golf",
        url: "https://www.golfcompendium.com/2026/02/under-par-definition.html",
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
    id: "over-par",
    slug: "over-par",
    term: "Over Par",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "More strokes than par, for a hole or for the holes played so far. Three over means three strokes above par.",
    example:
      "An 85 on a par-72 course is 13 over par. One over on every hole of that course is 90: 18 over.",
    relatedTermIds: ["even-par", "under-par", "bogey"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "over-par" },
    capabilityIds: [],
    sources: [
      GOLFSHAKE,
      {
        title: "Golf Compendium: What over par means in golf",
        url: "https://www.golfcompendium.com/2026/02/over-par-definition.html",
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
    id: "scorecard",
    slug: "scorecard",
    term: "Scorecard",
    aliases: ["card"],
    primaryCategory: "scoring",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "The paper card or approved electronic form where each hole's score is entered. In stroke play your marker enters your score hole by hole, and you both certify it when the round ends.",
    explanation:
      "A printed card also lists each hole's par and stroke index. Match play doesn't need one, though players often keep one to track the match.",
    example:
      "Your marker writes 5 for you on the 3rd. After the round you check every hole, both of you certify the card, and you hand it in.",
    ruleNote: {
      kind: "rules",
      text: "Rule 3.3b: the player is responsible for the hole scores. Return a score higher than you made on a hole and the higher score stands; return one lower, or none, and you're disqualified.",
    },
    relatedTermIds: ["stroke-index", "gross-score", "stroke-play", "round"],
    relatedContentPaths: ["/rules#rule-3"],
    canonical: { kind: "hub", anchor: "scorecard" },
    capabilityIds: [],
    sources: [
      { ...ROG_DEFINITIONS, ref: "Definitions: Scorecard", accessedOn: DRAFTED_ON },
      {
        title: `${ROG}: Rule 3`,
        url: `${ROG_BASE}the-rules-of-golf/rule-3`,
        kind: "official-rules",
        ref: "Rule 3.3b (scoring in stroke play)",
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
    id: "front-nine",
    slug: "front-nine",
    term: "Front Nine",
    aliases: ["front 9", "outward nine", "front side"],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "Holes 1 to 9 of an 18-hole course: the first half of the round for most groups.",
    explanation:
      "It's also called the outward nine or front side. Some golfers say front nine for whichever nine they play first, so a group that starts on the 10th may call holes 10 to 18 its front nine.",
    example:
      "In a $5 Nassau, the front nine is its own $5 match. Win it by a hole and that part is yours, whatever happens on the back nine.",
    relatedTermIds: ["back-nine", "nassau", "round"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "front-nine" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Compendium: The front nine of a golf course",
        url: "https://golfcompendium.com/2022/10/front-nine-golf-course.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      GOLFSHAKE,
      {
        title: "GoLo: Nassau guide",
        url: "https://www.golo.golf/games/nassau",
        kind: "first-party",
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
    id: "back-nine",
    slug: "back-nine",
    term: "Back Nine",
    aliases: ["back 9", "inward nine", "back side"],
    primaryCategory: "scoring",
    tags: ["scoring-basics"],
    priority: "expansion",
    shortDefinition:
      "Holes 10 to 18 of an 18-hole course: the second half of the round for most groups.",
    example:
      "You make the turn at 38 on a par-36 front nine, two over. A 37 on the par-36 back nine is one over, so the round is 75, three over par 72.",
    relatedTermIds: ["front-nine", "nassau", "round"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "back-nine" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Compendium: The back nine of a golf course",
        url: "https://golfcompendium.com/2022/10/back-nine-golf-course.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      GOLFSHAKE,
      {
        title: "GoLo: Nassau guide",
        url: "https://www.golo.golf/games/nassau",
        kind: "first-party",
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
    id: "round",
    slug: "round",
    term: "Round",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "Eighteen or fewer holes played in the order the committee sets. A full round is usually 18 holes, but nine holes is a round too.",
    example:
      "On a shotgun start your group begins on the 12th. Your round is the 12th to the 18th, then the 1st to the 11th.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define a round as 18 or fewer holes played in the order set by the committee (Definitions; Rule 1.1).",
    },
    relatedTermIds: ["front-nine", "back-nine", "scorecard", "stroke-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "round" },
    capabilityIds: [],
    sources: [
      { ...ROG_DEFINITIONS, ref: "Definitions: Round", accessedOn: DRAFTED_ON },
      {
        title: `${ROG}: Rule 1`,
        url: `${ROG_BASE}the-rules-of-golf/rule-1`,
        kind: "official-rules",
        ref: "Rule 1.1 (the game of golf)",
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
    id: "penalty-stroke",
    slug: "penalty-stroke",
    term: "Penalty Stroke",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "A stroke added to your score under a Rule, not one you swing at. Most penalties are either one stroke or the general penalty: two strokes in stroke play, or loss of the hole in match play.",
    explanation:
      "A one-stroke penalty usually comes with taking relief, playing a ball from somewhere other than where it lies, or with a minor breach. Penalty strokes count in your gross score like any other.",
    example:
      "Your tee shot on a par 3 goes in the pond. You drop outside it for one penalty stroke, pitch your third onto the green and two-putt: 1 + 1 + 1 + 2 = 5, a double bogey.",
    ruleNote: {
      kind: "rules",
      text: "Rule 1.3c sets the levels: one penalty stroke, the general penalty, and disqualification. Relief from a penalty area costs one stroke (Rule 17.1).",
    },
    relatedTermIds: ["penalty-area", "gross-score", "double-bogey", "stroke-play"],
    relatedContentPaths: ["/rules#rule-17"],
    canonical: { kind: "hub", anchor: "penalty-stroke" },
    capabilityIds: [],
    sources: [
      {
        title: `${ROG}: Rule 1`,
        url: `${ROG_BASE}the-rules-of-golf/rule-1`,
        kind: "official-rules",
        ref: "Rule 1.3c (penalties)",
        accessedOn: DRAFTED_ON,
      },
      { ...ROG_DEFINITIONS, ref: "Definitions: General Penalty", accessedOn: DRAFTED_ON },
      {
        title: `${ROG}: Rule 17`,
        url: `${ROG_BASE}the-rules-of-golf/rule-17`,
        kind: "official-rules",
        ref: "Rule 17.1d (relief for ball in penalty area)",
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
    id: "maximum-score",
    slug: "maximum-score",
    term: "Maximum Score",
    aliases: [],
    primaryCategory: "scoring",
    tags: ["stroke-play", "rules"],
    priority: "expansion",
    shortDefinition:
      "A form of stroke play where each hole's score is capped at a maximum the committee sets, such as double par, a fixed number or net double bogey. Once you reach it, you can pick up.",
    explanation:
      "It keeps one bad hole from ending a round and speeds play. Net double bogey can be the cap, but Maximum Score is a competition format; the handicap system's net double bogey is a limit for posting a score.",
    example:
      "The cap is double par. On the par-4 11th you're lying 7 and still short of the green, so you pick up and score 8.",
    ruleNote: {
      kind: "rules",
      text: "Rule 21.2. A player who doesn't hole out gets the maximum for the hole, instead of being disqualified as in regular stroke play.",
    },
    relatedTermIds: ["stroke-play", "net-double-bogey", "stableford", "par-competition"],
    relatedContentPaths: ["/rules#rule-21"],
    canonical: { kind: "hub", anchor: "maximum-score" },
    capabilityIds: [],
    sources: [
      { ...ROG_DEFINITIONS, ref: "Definitions: Maximum Score", accessedOn: DRAFTED_ON },
      {
        title: `${ROG}: Rule 21`,
        url: `${ROG_BASE}the-rules-of-golf/rule-21`,
        kind: "official-rules",
        ref: "Rule 21.2 (Maximum Score)",
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
    id: "cut-line",
    slug: "cut-line",
    term: "Cut Line",
    aliases: ["the cut", "making the cut"],
    primaryCategory: "scoring",
    tags: ["stroke-play"],
    priority: "expansion",
    shortDefinition:
      "In a tournament, the score a player has to match or beat to keep playing after the field is cut, usually halfway through. Players outside it have missed the cut and go home.",
    example:
      "After two rounds, the 65th-best total is 142. Everyone on 142 or better plays the weekend; a 143 misses the cut.",
    ruleNote: {
      kind: "convention",
      text: "Each tour and event sets its own cut, and some events have none. The PGA Tour's usual rule is the top 65 and ties after 36 holes.",
    },
    relatedTermIds: ["stroke-play", "round", "over-par"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "cut-line" },
    capabilityIds: [],
    sources: [
      {
        title: "The Golf News Net: What is the PGA Tour cut rule, and how is the cut line determined?",
        url: "https://thegolfnewsnet.com/ryan_ballengee/2026/04/10/what-is-pga-tour-cut-rule-2025-how-cut-line-determined-102941/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      GOLFSHAKE,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
];
