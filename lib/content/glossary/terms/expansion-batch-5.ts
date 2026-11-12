/**
 * Expansion batch 5 (#168, #295, M8). Fifteen course, rules and etiquette
 * records from docs/glossary/inventory.md § F, rows 120–134, drafted
 * November 11, 2026, with merge M6 applied (Dance Floor is an alias of
 * Putting Green).
 *
 * IN REVIEW. Nothing here reaches a page, the search index, the sitemap,
 * llms.txt or structured data until each record is approved and a release PR
 * publishes it (../selectors). Expansion records go back to the owner's
 * review roles (editorial-review.md § Roles): an agent drafted these and
 * prepared the checks in docs/glossary/expansion-batch-5.md. On 2026-11-11
 * the owner delegated stages 2–4 for this batch to an agent and kept
 * approval (#295); each record logs those three stages below. They stay
 * `in-review` until the owner approves.
 *
 * Every source with `accessedOn` was opened on that date. Rules of Golf
 * pages are the 2023 edition on randa.org. The Committee Procedures page
 * for Model Local Rules renders only in a browser; it was opened in headless
 * Chrome for Model Local Rule E-3. Pages whose URL
 * carries a word the vocabulary check bans were left out.
 *
 * No record mentions GoLo or cites a capability: the batch is golf only.
 */

import type { GlossaryTerm, ReviewEntry } from "../types";

const DRAFTED_ON = "2026-11-11";
const ROG = "Rules of Golf, 2023 edition (R&A)";
const ROG_BASE = "https://www.randa.org/en/rog/";

/**
 * Stages 2–4, done by an agent on 2026-11-11 under the owner's delegation of
 * that date for this batch only (#295; editorial-review.md § Roles).
 * Approval is the owner's and isn't logged until they give it.
 */
const REVIEWED_ON = "2026-11-11";

const reviewLog: ReviewEntry[] = [
  {
    stage: "rules",
    by: "agent",
    on: REVIEWED_ON,
    note: "Every source reopened 2026-11-11 (R&A 2023 Definitions, Rules 1, 5, 6, 13, 14, 16, 18, 19; Committee Procedures 8E, Model Local Rule E-3, in headless Chrome; the R&A winter rules FAQ; 6 editorial pages) and each sentence checked against it; examples recomputed (expansion-batch-5.md).",
  },
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "Golf only: no GoLo note, link, CTA or capability id, and no field mentions GoLo or the app (#295).",
  },
  {
    stage: "seo",
    by: "agent",
    on: REVIEWED_ON,
    note: "Hub canonical at the slug, as inventory.md has every course and rules expansion term; related ids and the Rules Center paths pass lint:content.",
  },
];

const definitions = (ref: string) =>
  ({
    title: `${ROG}: Definitions`,
    url: `${ROG_BASE}definitions`,
    kind: "official-rules",
    ref,
    accessedOn: DRAFTED_ON,
  }) as const;

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

const NCG_JARGON = {
  title: "National Club Golfer: Get your head around the new Rules of Golf terms",
  url: "https://www.nationalclubgolfer.com/rules/rules-of-golf-jargon-explained/",
  kind: "editorial",
  accessedOn: DRAFTED_ON,
} as const;

/** Opened in a browser: the page renders its text with JavaScript. */
const CP8 = {
  title: `${ROG}: Committee Procedures`,
  url: `${ROG_BASE}committee-procedures/sections/8`,
  kind: "official-rules",
  ref: "Section 8E, Model Local Rule E-3 (preferred lies)",
  accessedOn: DRAFTED_ON,
} as const;

const RA_WINTER = {
  title: "The R&A: Winter rules FAQs (Model Local Rule E-3)",
  url: "https://www.randa.org/articles/the-r-a-2024-2025-winter-rules-faq-s",
  kind: "official-rules",
  ref: "Model Local Rule E-3 (preferred lies)",
  accessedOn: DRAFTED_ON,
} as const;

export const expansionBatch5Terms: GlossaryTerm[] = [
  {
    id: "putting-green",
    slug: "putting-green",
    term: "Putting Green",
    aliases: ["green", "dance floor"],
    primaryCategory: "course-rules",
    tags: ["rules", "putting"],
    priority: "expansion",
    shortDefinition:
      "The specially prepared area around the hole you're playing, made for putting. Its edge is where the specially prepared grass starts, unless the committee marks it another way.",
    explanation:
      "On the green you may mark, lift and clean your ball, and repair damage such as ball-marks. Other holes' greens are wrong greens: if your ball is on one, you must take free relief. Dance floor is the slang for it.",
    example:
      "Your approach stops 20 feet from the hole. You mark the ball with a coin, lift it, wipe it, repair your ball-mark and put the ball back on the same spot.",
    ruleNote: {
      kind: "rules",
      text: "Rule 13.1: a ball is on the putting green when any part of it touches the green.",
    },
    relatedTermIds: ["putt", "fringe", "putter", "general-area"],
    relatedContentPaths: ["/rules#rule-13"],
    canonical: { kind: "hub", anchor: "putting-green" },
    capabilityIds: [],
    sources: [
      definitions("Definitions: Putting Green"),
      rule(13, "Rules 13.1a–13.1c, 13.1f"),
      {
        title: "Golf Compendium: What is the dance floor in golf?",
        url: "https://golfcompendium.com/2019/01/golf-dance-floor.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "fringe",
    slug: "fringe",
    term: "Fringe",
    aliases: ["collar", "apron", "frog hair"],
    primaryCategory: "course-rules",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "The band of closely mown grass around a putting green, cut shorter than the fairway but longer than the green. Under the Rules of Golf it's part of the general area, not the green.",
    explanation:
      "Also called the collar or apron; frog hair is the slang. Because it isn't the green, the putting-green Rules, such as marking and cleaning your ball, don't apply there.",
    example:
      "Your chip stops on the fringe a foot short of the green. You play it as it lies, and many players would putt it.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf don't define a fringe. The putting green ends where its specially prepared grass ends, and everything around it is general area.",
    },
    relatedTermIds: ["putting-green", "general-area", "chip"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "fringe" },
    capabilityIds: [],
    sources: [
      definitions("Definitions: Putting Green; General Area"),
      GOLFSHAKE,
      {
        title: "Golf Compendium: Here's what the golf lingo frog hair means",
        url: "https://www.golfcompendium.com/2019/06/frog-hair-definition-golf.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "general-area",
    slug: "general-area",
    term: "General Area",
    aliases: ["through the green"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "Under the Rules of Golf, the whole course except four defined areas: the teeing area you start the hole from, penalty areas, bunkers, and the green you're playing to. Fairway, rough and trees are all general area.",
    explanation:
      "Other holes' tees and greens are general area too. Before 2019 the Rules called it through the green.",
    example:
      "Your drive finishes in thick rough under a tree. The rough is general area, so the same Rules apply as in the fairway: play it as it lies, or take unplayable ball relief for one penalty stroke.",
    relatedTermIds: ["fairway", "rough", "teeing-area", "bunker", "penalty-area"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "general-area" },
    capabilityIds: [],
    sources: [definitions("Definitions: General Area"), rule(19, "Rule 19.2"), NCG_JARGON],
    status: "in-review",
    reviewLog,
  },
  {
    id: "out-of-bounds",
    slug: "out-of-bounds",
    term: "Out of Bounds",
    aliases: ["ob"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "Everything outside the course's boundary edge, usually marked by white stakes, lines or a fence. A ball is out of bounds only when all of it is outside that edge, and playing again costs stroke and distance.",
    explanation:
      "The white stakes and fence posts that mark the boundary are themselves out of bounds, and you get no free relief from them.",
    example:
      "Your tee shot on the 4th sails over the white stakes. You add a penalty stroke and play again from the tee, so that drive is your third shot.",
    ruleNote: {
      kind: "rules",
      text: "Rule 18.2: for a ball out of bounds or lost, you must take stroke-and-distance relief.",
    },
    relatedTermIds: ["stroke-and-distance", "provisional-ball", "penalty-stroke", "penalty-area"],
    relatedContentPaths: ["/rules#rule-18"],
    canonical: { kind: "hub", anchor: "out-of-bounds" },
    capabilityIds: [],
    sources: [
      definitions("Definitions: Out of Bounds; Boundary Object"),
      rule(18, "Rule 18.2"),
      GOLFSHAKE,
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "provisional-ball",
    slug: "provisional-ball",
    term: "Provisional Ball",
    aliases: ["provisional"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "A second ball played in case the first is out of bounds or lost outside a penalty area. It saves walking back to play again, but you must say you're playing a provisional before you hit it.",
    explanation:
      "Until the provisional becomes your ball in play, it's abandoned if the original turns up: found on the course outside a penalty area within three minutes, you play the original; found in a penalty area, or known or virtually certain to be in one, you play it or take penalty-area relief. Otherwise the provisional becomes your ball in play under stroke and distance.",
    example:
      "Your drive on the 7th heads for the trees. You announce a provisional and hit it down the middle. The first ball isn't found, so the provisional is your ball, and you've played 3.",
    ruleNote: {
      kind: "rules",
      text: "Rule 18.3. Saying you're hitting another isn't enough: without the word provisional, or something as clear, the second ball is in play under stroke and distance.",
    },
    relatedTermIds: ["out-of-bounds", "stroke-and-distance", "penalty-area"],
    relatedContentPaths: ["/rules#rule-18"],
    canonical: { kind: "hub", anchor: "provisional-ball" },
    capabilityIds: [],
    sources: [
      definitions("Definitions: Provisional Ball"),
      rule(18, "Rules 18.2a, 18.3b, 18.3c"),
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "unplayable-ball",
    slug: "unplayable-ball",
    term: "Unplayable Ball",
    aliases: ["unplayable"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "A ball you decide not to play where it lies. You can declare it anywhere except in a penalty area and take relief for one penalty stroke: stroke and distance, back on a line from the hole, or within two club-lengths.",
    explanation:
      "Only the player decides a ball is unplayable. In a bunker, the back-on-the-line and two-club-length drops must stay in the bunker, or you can go back on the line outside it for two penalty strokes.",
    example:
      "Your second shot on the 12th ends up against a tree root. You declare it unplayable, drop within two club-lengths no nearer the hole, and your next shot is your fourth.",
    ruleNote: {
      kind: "rules",
      text: "Rule 19. In a penalty area the only relief is under Rule 17.",
    },
    relatedTermIds: ["penalty-stroke", "stroke-and-distance", "relief-area", "bunker"],
    relatedContentPaths: ["/rules#rule-19"],
    canonical: { kind: "hub", anchor: "unplayable-ball" },
    capabilityIds: [],
    sources: [rule(19, "Rules 19.1–19.3")],
    status: "in-review",
    reviewLog,
  },
  {
    id: "stroke-and-distance",
    slug: "stroke-and-distance",
    term: "Stroke and Distance",
    aliases: [],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "Playing again from where you made your previous stroke, with one penalty stroke added. You lose any distance that stroke gained. It's required for a ball lost or out of bounds.",
    explanation:
      "It's also always an option for a ball in a penalty area or an unplayable ball.",
    example:
      "Your tee shot on a par 4 goes out of bounds. The ball you tee up next is your third shot. Hit the fairway, reach the green with your fourth and two-putt for a 6, a double bogey.",
    ruleNote: {
      kind: "rules",
      text: "Rule 18.1: you may take stroke-and-distance relief at any time, for one penalty stroke.",
    },
    relatedTermIds: ["out-of-bounds", "provisional-ball", "penalty-stroke", "unplayable-ball"],
    relatedContentPaths: ["/rules#rule-18"],
    canonical: { kind: "hub", anchor: "stroke-and-distance" },
    capabilityIds: [],
    sources: [
      definitions("Definitions: Stroke and Distance"),
      rule(18, "Rules 18.1, 18.2b"),
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "relief-area",
    slug: "relief-area",
    term: "Relief Area",
    aliases: [],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "The area where you must drop a ball when taking relief under a Rule. It's measured from a reference point, is one or two club-lengths in size, and has limits, such as no nearer the hole.",
    explanation:
      "You drop the ball straight down from knee height, and it must come to rest inside the relief area.",
    example:
      "Your ball lies in a puddle in the fairway. You find the nearest point of complete relief, measure one club-length from it, no nearer the hole, and drop from knee height inside that area.",
    relatedTermIds: ["nearest-point-of-complete-relief", "temporary-water", "ground-under-repair", "unplayable-ball"],
    relatedContentPaths: ["/rules#rule-14"],
    canonical: { kind: "hub", anchor: "relief-area" },
    capabilityIds: [],
    sources: [
      definitions("Definitions: Relief Area"),
      rule(14, "Rules 14.3b, 14.3c"),
      rule(16, "Rule 16.1b"),
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "nearest-point-of-complete-relief",
    slug: "nearest-point-of-complete-relief",
    term: "Nearest Point of Complete Relief",
    aliases: ["nearest point of relief", "npcr"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "The reference point for free relief from conditions such as temporary water or ground under repair: the nearest spot, no nearer the hole and in the required area, where the condition no longer interferes.",
    explanation:
      "You find it for the shot you would have played, with the same club, stance and swing. It's the nearest point, not the best one. Before 2019 the Rules called it the nearest point of relief.",
    example:
      "Your ball rests on a cart path on the right of the 3rd fairway. For your stance, the nearest spot clear of the path is in the rough beyond it, not the fairway, so that's your reference point. You drop within one club-length of it.",
    ruleNote: {
      kind: "rules",
      text: "Rule 16.1b: in the general area, the relief area is one club-length from this point, no nearer the hole.",
    },
    relatedTermIds: ["relief-area", "ground-under-repair", "temporary-water"],
    relatedContentPaths: ["/rules#rule-16"],
    canonical: { kind: "hub", anchor: "nearest-point-of-complete-relief" },
    capabilityIds: [],
    sources: [
      definitions("Definitions: Nearest Point of Complete Relief; Abnormal Course Condition"),
      rule(16, "Rule 16.1b"),
      NCG_JARGON,
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "ground-under-repair",
    slug: "ground-under-repair",
    term: "Ground Under Repair",
    aliases: ["gur"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "Any part of the course the committee defines as under repair, usually marked out with rope or lines, plus holes made by maintenance staff and material piled for removal. If it interferes, you get free relief.",
    explanation:
      "In the general area, you drop within one club-length of the nearest point of complete relief, no nearer the hole. Aeration holes don't count as ground under repair.",
    example:
      "Your second shot on the 15th stops inside a roped-off patch of new turf. You take free relief with no penalty stroke, so your next shot is your third.",
    ruleNote: {
      kind: "rules",
      text: "Rule 16.1. It's one of the four abnormal course conditions, with animal holes, immovable obstructions and temporary water.",
    },
    relatedTermIds: ["temporary-water", "nearest-point-of-complete-relief", "relief-area"],
    relatedContentPaths: ["/rules#rule-16"],
    canonical: { kind: "hub", anchor: "ground-under-repair" },
    capabilityIds: [],
    sources: [
      definitions("Definitions: Ground Under Repair; Abnormal Course Condition"),
      rule(16, "Rule 16.1b"),
      GOLFSHAKE,
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "temporary-water",
    slug: "temporary-water",
    term: "Temporary Water",
    aliases: ["casual water"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "A temporary accumulation of water on the ground outside a penalty area, such as a puddle from rain or irrigation, that you can see before or after you take your stance. You get free relief from it.",
    explanation:
      "Wet, muddy or soft ground isn't enough, and neither is dew or frost. Before 2019 the Rules called it casual water.",
    example:
      "After a storm your ball sits in the fairway, and water rises around your shoes when you take your stance. That's temporary water: drop within one club-length of the nearest point of complete relief, no penalty.",
    ruleNote: {
      kind: "rules",
      text: "Rule 16.1. Snow and natural ice can be treated as temporary water or as loose impediments, at the player's option.",
    },
    relatedTermIds: ["ground-under-repair", "nearest-point-of-complete-relief", "penalty-area"],
    relatedContentPaths: ["/rules#rule-16"],
    canonical: { kind: "hub", anchor: "temporary-water" },
    capabilityIds: [],
    sources: [definitions("Definitions: Temporary Water"), rule(16, "Rule 16.1b"), NCG_JARGON],
    status: "in-review",
    reviewLog,
  },
  {
    id: "preferred-lies",
    slug: "preferred-lies",
    term: "Preferred Lies",
    aliases: ["lift clean and place", "winter rules"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "A local rule that lets you lift, clean and place a ball lying in the general area cut to fairway height or less, within a set distance of where it lay, no nearer the hole. Committees use it when bad weather has damaged the course.",
    explanation:
      "It's also called winter rules or lift, clean and place. The committee sets the distance, such as six inches, a scorecard length or one club-length. The relief is free and taken once, and the rule should be withdrawn as soon as conditions allow.",
    example:
      "Preferred lies are in effect, within a scorecard length. Your drive stops in a muddy patch of fairway. You mark the ball, lift it, clean it and place it within a scorecard length, no nearer the hole.",
    ruleNote: {
      kind: "rules",
      text: "Model Local Rule E-3, in the Committee Procedures of the Rules of Golf. Without it in effect, you play the ball as it lies.",
    },
    relatedTermIds: ["local-rule", "fairway", "general-area"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "preferred-lies" },
    capabilityIds: [],
    sources: [
      CP8,
      RA_WINTER,
      rule(1, "Rule 1.3a (Local Rules)"),
      GOLFSHAKE,
      {
        title: "Golf Monthly: What is meant by preferred lies?",
        url: "https://www.golfmonthly.com/golf-rules/what-is-meant-by-preferred-lies",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
    reviewLog,
  },
  {
    id: "ready-golf",
    slug: "ready-golf",
    term: "Ready Golf",
    aliases: [],
    primaryCategory: "course-rules",
    tags: ["etiquette"],
    priority: "expansion",
    shortDefinition:
      "Playing when you're ready instead of strictly in turn, safely and responsibly, to keep the round moving. The Rules of Golf allow and encourage it in stroke play.",
    explanation:
      "In match play the order matters: if you play out of turn, your opponent may cancel the stroke and make you play again.",
    example:
      "On the 2nd the player who's away is still deciding on a club, so the player who's ready hits first. In stroke play there's no penalty.",
    ruleNote: {
      kind: "rules",
      text: "Rule 6.4b(2) in stroke play; Rule 6.4a in match play.",
    },
    relatedTermIds: ["pace-of-play", "stroke-play", "match-play"],
    relatedContentPaths: ["/rules#rule-6"],
    canonical: { kind: "hub", anchor: "ready-golf" },
    capabilityIds: [],
    sources: [rule(6, "Rules 6.4a, 6.4b(2)"), rule(5, "Rule 5.6b")],
    status: "in-review",
    reviewLog,
  },
  {
    id: "local-rule",
    slug: "local-rule",
    term: "Local Rule",
    aliases: ["local rules"],
    primaryCategory: "course-rules",
    tags: ["rules"],
    priority: "expansion",
    shortDefinition:
      "A change to the Rules of Golf that a committee adopts for its course or competition, such as preferred lies. For that round, a local rule is part of the Rules you play by.",
    explanation:
      "Most are adapted from the Model Local Rules in the Committee Procedures that go with the Rules of Golf.",
    example:
      "The card says preferred lies are in effect through the general area cut to fairway height. For that round, you may lift, clean and place in those areas.",
    ruleNote: {
      kind: "rules",
      text: "Rule 1.3a: the Rules are Rules 1–25, the Definitions, and any local rules the committee adopts.",
    },
    relatedTermIds: ["preferred-lies", "penalty-area", "out-of-bounds"],
    relatedContentPaths: ["/rules#rule-1"],
    canonical: { kind: "hub", anchor: "local-rule" },
    capabilityIds: [],
    sources: [rule(1, "Rule 1.3a"), CP8, RA_WINTER],
    status: "in-review",
    reviewLog,
  },
  {
    id: "pace-of-play",
    slug: "pace-of-play",
    term: "Pace of Play",
    aliases: [],
    primaryCategory: "course-rules",
    tags: ["etiquette"],
    priority: "expansion",
    shortDefinition:
      "How quickly a group gets round the course. The Rules of Golf expect a prompt pace and recommend taking no more than 40 seconds for a stroke once it's your turn, usually less.",
    explanation:
      "A committee can adopt a pace-of-play policy as a local rule, with time limits and penalties for breaching it.",
    example:
      "Your group has fallen a hole behind by the 6th. You play ready golf, walk to your ball while others play, and read your putt while others are putting.",
    ruleNote: {
      kind: "rules",
      text: "Rule 5.6b covers prompt pace and the committee's policy.",
    },
    relatedTermIds: ["ready-golf", "round"],
    relatedContentPaths: ["/rules#rule-5"],
    canonical: { kind: "hub", anchor: "pace-of-play" },
    capabilityIds: [],
    sources: [rule(5, "Rule 5.6b"), rule(6, "Rule 6.4b(2)")],
    status: "in-review",
    reviewLog,
  },
];
