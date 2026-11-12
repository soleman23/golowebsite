/**
 * Expansion batch 6 (#168, #298, M8). Fifteen shots and ball-flight records
 * from docs/glossary/inventory.md § E, rows 100–114, drafted November 12,
 * 2026.
 *
 * PUBLISHED by the batch 6 release PR, which the owner asked for after
 * approving all 15 ("Merge as long as they are ready").
 * Expansion records go back to the owner's
 * review roles (editorial-review.md § Roles): an agent drafted these and
 * prepared the checks in docs/glossary/expansion-batch-6.md. On 2026-11-12
 * the owner delegated stages 2–4 for this batch to an agent and kept
 * approval (#298); each record logs those three stages below. The owner
 * approved all 15 in chat the same day ("Approve all 15").
 *
 * Every source with `accessedOn` was opened on that date. These are shot
 * names, not Rules terms: the Rules of Golf define none of them, so every
 * source is editorial. Pages whose URL carries a word the vocabulary check
 * bans were left out.
 *
 * No record mentions GoLo or cites a capability: the batch is golf only.
 */

import type { GlossaryTerm, ReviewEntry } from "../types";

const DRAFTED_ON = "2026-11-12";

/**
 * Stages 2–4, done by an agent on 2026-11-12 under the owner's delegation of
 * that date for this batch only (#298; editorial-review.md § Roles).
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
    note: "Every source reopened 2026-11-12 (16 editorial pages: Golfshake, Golf Compendium, Golf.com, National Club Golfer, American Golf, Hole19, Golf24) and each sentence checked against it; examples recomputed (expansion-batch-6.md). The Rules of Golf define none of these shots.",
  },
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "Golf only: no GoLo note, link, CTA or capability id, and no field mentions GoLo or the app; capabilities.ts records no putts or shot types (#298).",
  },
  {
    stage: "seo",
    by: "agent",
    on: REVIEWED_ON,
    note: "Hub canonical at the slug, as inventory.md has every shots expansion term; related ids pass lint:content.",
  },
  {
    stage: "approval",
    by: "owner",
    on: REVIEWED_ON,
    note: "Approved in chat on 2026-11-12, all 15 records, on the agent's stage 2–4 checks.",
  },
];

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

const DUCK_HOOK = compendium(
  "Explaining the dreaded 'duck hook'",
  "https://www.golfcompendium.com/2020/10/duck-hook-golf-shot.html",
);

const SKULL = compendium(
  "The skulled shot in golf: what it is, how to fix it",
  "https://www.golfcompendium.com/2021/12/skull-shot-golf.html",
);

const CHUNK = compendium("What is a chunk shot in golf?", "https://www.golfcompendium.com/2020/07/chunk-shot-golf.html");

export const expansionBatch6Terms: GlossaryTerm[] = [
  {
    id: "draw",
    slug: "draw",
    term: "Draw",
    aliases: [],
    primaryCategory: "shots",
    tags: ["ball-flight"],
    priority: "expansion",
    shortDefinition:
      "A shot that curves gently in the air: right to left for a right-handed golfer, left to right for a left-handed one.",
    explanation:
      "It's the mirror image of a fade. A hook is the same curve, bigger and usually a mishit.",
    example:
      "A right-hander aims at the right edge of the fairway and the ball curves gently back to the middle.",
    relatedTermIds: ["fade", "hook", "slice"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "draw" },
    capabilityIds: [],
    sources: [GOLFSHAKE, DUCK_HOOK],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "fade",
    slug: "fade",
    term: "Fade",
    aliases: [],
    primaryCategory: "shots",
    tags: ["ball-flight"],
    priority: "expansion",
    shortDefinition:
      "A shot that starts left of the target and curves gently back to the right, for a right-handed golfer. For a left-hander it's the other way round.",
    explanation:
      "It's the mirror image of a draw. A slice is the same curve, bigger and usually by accident.",
    example:
      "A right-hander aims at the left edge of the green and the ball drifts right toward a flag on the right side.",
    relatedTermIds: ["slice", "draw", "hook"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "fade" },
    capabilityIds: [],
    sources: [GOLFSHAKE],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "hook",
    slug: "hook",
    term: "Hook",
    aliases: [],
    primaryCategory: "shots",
    tags: ["ball-flight"],
    priority: "expansion",
    shortDefinition:
      "A shot that curves sharply in the air, usually by accident: right to left for a right-handed golfer, left to right for a left-handed one.",
    explanation:
      "It's the opposite of a slice. A small curve the same way is a draw. A snap hook or duck hook is a severe one that turns hard and dives to the ground.",
    example:
      "A right-hander's drive starts at the middle of the fairway and finishes in the trees on the left.",
    relatedTermIds: ["draw", "slice", "fade"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "hook" },
    capabilityIds: [],
    sources: [
      DUCK_HOOK,
      compendium("Defining the snap hook in golf", "https://www.golfcompendium.com/2021/10/snap-hook-golf-definition.html"),
      GOLFSHAKE,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "shank",
    slug: "shank",
    term: "Shank",
    aliases: ["hosel rocket", "socket"],
    primaryCategory: "shots",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A mishit off the hosel, where the clubhead joins the shaft, instead of the clubface. For a right-handed golfer the ball shoots off sharply to the right.",
    explanation:
      "Hosel rocket is the slang, and socket is another name for it. Many golfers won't say the word on the course and call it the s-word. It isn't a slice: a slice curves in the air, while a shank starts far off line.",
    example:
      "From 60 yards a right-hander catches the hosel and the ball flies off at a sharp angle, 30 yards right of the green.",
    relatedTermIds: ["slice", "thin-shot"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "shank" },
    capabilityIds: [],
    sources: [
      GOLFSHAKE,
      compendium("What is 'the s-word' in golf?", "https://www.golfcompendium.com/2024/04/the-s-word-in-golf.html"),
      {
        title: "Golf.com: Golf terms guide for beginner golfers",
        url: "https://golf.com/instruction/golf-terms-guide-beginner-golfers/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf24: Socket golf, the golf glossary from A to Z",
        url: "https://www.golf24.com/en/blogs/golfabc/socket",
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
    id: "flop-shot",
    slug: "flop-shot",
    term: "Flop Shot",
    aliases: ["flop"],
    primaryCategory: "shots",
    tags: ["short-game"],
    priority: "expansion",
    shortDefinition:
      "A short, very high shot that lands softly with little roll, usually played with a lob wedge and an open clubface. It's for when there's little green to land on or something to carry first.",
    explanation:
      "It's a pitch with extra loft. Opening the face adds loft but needs a bigger swing for the same distance, so a small mishit costs more.",
    example:
      "Your ball sits in light rough with a bunker between it and a flag 5 yards past the bunker. You open a 60-degree wedge, make a full swing and the ball goes almost straight up and stops 6 feet from the hole.",
    relatedTermIds: ["pitch", "chip", "bunker"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "flop-shot" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf.com: 5 keys for pulling off a flop shot on command",
        url: "https://golf.com/instruction/short-game/five-keys-pulling-off-flop-shot/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "American Golf: How to hit a flop shot",
        url: "https://blog.americangolf.co.uk/how-to-hit-a-flop-shot/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Hole19: Flop shot, golf glossary",
        url: "https://www.hole19golf.com/glossary/flop-shot",
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
    id: "punch-shot",
    slug: "punch-shot",
    term: "Punch Shot",
    aliases: ["punch"],
    primaryCategory: "shots",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A shot hit deliberately lower than normal, with the ball played farther back in the stance and a shorter follow-through. Players use it most in the wind.",
    explanation: "Players often grip down on the club as well. Near the green, the low running shot is a bump-and-run.",
    example:
      "Into a strong wind from 140 yards, a player who'd normally hit an 8-iron takes a 6-iron, grips down, plays the ball back and stops the follow-through at chest height.",
    relatedTermIds: ["bump-and-run", "approach-shot"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "punch-shot" },
    capabilityIds: [],
    sources: [GOLFSHAKE],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "bump-and-run",
    slug: "bump-and-run",
    term: "Bump-and-Run",
    aliases: [],
    primaryCategory: "shots",
    tags: ["short-game"],
    priority: "expansion",
    shortDefinition:
      "A low shot from near the green, played with a less-lofted club such as a 6-, 7- or 8-iron, that spends little time in the air and runs most of the way to the hole.",
    explanation:
      "It's a kind of chip played with less loft than a wedge, so it flies lower and rolls more. The ball is played back in the stance.",
    example:
      "Your ball is 15 yards short of the green on firm, closely mown grass. You play a 7-iron that lands short of the green and runs up to 4 feet.",
    relatedTermIds: ["chip", "pitch", "punch-shot"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "bump-and-run" },
    capabilityIds: [],
    sources: [GOLFSHAKE],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "lag-putt",
    slug: "lag-putt",
    term: "Lag Putt",
    aliases: ["lag"],
    primaryCategory: "shots",
    tags: ["putting"],
    priority: "expansion",
    shortDefinition:
      "A long putt you don't expect to hole, hit to stop close to the hole so the next putt is easy.",
    explanation:
      "Lag is also the verb: you lag it close. A poor lag leaves a long second putt and brings a three-putt into play.",
    example:
      "From 50 feet you try to stop the ball within 3 feet. It finishes 18 inches short and you tap in: two putts.",
    relatedTermIds: ["putt", "three-putt"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "lag-putt" },
    capabilityIds: [],
    sources: [GOLFSHAKE],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "approach-shot",
    slug: "approach-shot",
    term: "Approach Shot",
    aliases: ["approach"],
    primaryCategory: "shots",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A shot played onto the green, usually from the fairway: typically the second shot on a par 4 or the third on a par 5.",
    explanation:
      "Short shots from just off the green are usually called chips or pitches rather than approaches. A shot hit short of the green on purpose is a layup.",
    example:
      "After a 260-yard drive on a 410-yard par 4, you have 150 yards left and hit a 7-iron approach to 20 feet.",
    relatedTermIds: ["layup", "pitch", "putting-green"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "approach-shot" },
    capabilityIds: [],
    sources: [GOLFSHAKE],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "layup",
    slug: "layup",
    term: "Layup",
    aliases: ["lay up"],
    primaryCategory: "shots",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A shot hit shorter than you could hit it, on purpose, to stay out of trouble or to leave a better distance for the next shot.",
    explanation:
      "It's a noun or a verb: you lay up, and that shot is a layup. The classic case is a par 5 with water in front of the green.",
    example:
      "On a 520-yard par 5 with water in front of the green, your drive goes 250 yards. Rather than go for the green from 270, you hit a 170-yard layup and leave a 100-yard wedge.",
    relatedTermIds: ["approach-shot", "penalty-area"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "layup" },
    capabilityIds: [],
    sources: [GOLFSHAKE],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "fat-shot",
    slug: "fat-shot",
    term: "Fat Shot",
    aliases: ["chunk", "chunked", "heavy"],
    primaryCategory: "shots",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A shot where the club hits the ground before the ball, taking too much turf, so the ball comes up well short of the target.",
    explanation:
      "Also called a chunk, or hitting it heavy. A fat chip is a chili dip. The opposite mishit, catching the ball too high, is a thin shot.",
    example:
      "Colin Montgomerie came to the 72nd hole of the 2006 US Open where a 4 would have won. His approach was heavy, finished in rough beside the green, and he made 6.",
    relatedTermIds: ["thin-shot", "topped-shot", "chili-dip"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "fat-shot" },
    capabilityIds: [],
    sources: [
      GOLFSHAKE,
      CHUNK,
      {
        title: "National Club Golfer: NCG's golf glossary, what is a fat?",
        url: "https://www.nationalclubgolfer.com/club/glossary/ncgs-golf-glossary-fat/",
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
    id: "thin-shot",
    slug: "thin-shot",
    term: "Thin Shot",
    aliases: ["skull", "skulled", "bladed"],
    primaryCategory: "shots",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A shot where the club strikes the ball too high, near its middle, instead of below it. The ball comes off low and can run well past the target.",
    explanation:
      "A skulled or bladed shot is a bad one: the leading edge catches the ball above its middle. Around the green a thin chip or bunker shot often shoots across the green. Hitting the ground first is the opposite, a fat shot.",
    example:
      "From a greenside bunker the leading edge catches the ball's middle, and it flies low over the green into the rough behind.",
    relatedTermIds: ["fat-shot", "topped-shot"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "thin-shot" },
    capabilityIds: [],
    sources: [GOLFSHAKE, SKULL],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "topped-shot",
    slug: "topped-shot",
    term: "Topped Shot",
    aliases: ["topped"],
    primaryCategory: "shots",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A shot where the club catches only the top of the ball, so it rolls or bounces along the ground instead of flying.",
    explanation:
      "A thin shot catches the ball lower and still gets airborne. A worm burner describes the flight, low along the grass; topped names the contact. Nobble is a chiefly British word for it.",
    example: "A nervous drive off the first tee is topped and bounces 40 yards down the fairway.",
    relatedTermIds: ["thin-shot", "worm-burner", "fat-shot"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "topped-shot" },
    capabilityIds: [],
    sources: [
      compendium(
        "The 'nobble' (nobbler) golf shot definition",
        "https://www.golfcompendium.com/2023/02/nobble-golf-shot-definition.html",
      ),
      SKULL,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "up-and-down",
    slug: "up-and-down",
    term: "Up-and-Down",
    aliases: [],
    primaryCategory: "shots",
    tags: ["short-game"],
    priority: "expansion",
    shortDefinition:
      "Getting the ball into the hole in two strokes from off the green: one shot up onto the green, then one putt down into the hole.",
    explanation:
      "It's usually how a missed green still becomes a par. From a bunker it's a sand save, and in some side games it earns a sandy. Holing the chip is a chip-in: one stroke, not an up-and-down.",
    example:
      "Your approach on a par 4 finishes in the rough beside the green. You chip to 4 feet and hole the putt: up and down for a 4, par.",
    relatedTermIds: ["chip", "pitch", "sandy", "putt"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "up-and-down" },
    capabilityIds: [],
    sources: [
      GOLFSHAKE,
      {
        title: "National Club Golfer: NCG's golf glossary, what is up-and-down?",
        url: "https://www.nationalclubgolfer.com/club/glossary/golf-glossary-up-and-down/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      compendium("Defining the 'chip-in' in golf", "https://www.golfcompendium.com/2024/01/chip-in-golf-definition.html"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "three-putt",
    slug: "three-putt",
    term: "Three-Putt",
    aliases: ["three jack", "3-putt"],
    primaryCategory: "shots",
    tags: ["putting"],
    priority: "expansion",
    shortDefinition:
      "Taking three putts to hole out once your ball is on the green: miss the first, miss the second, make the third.",
    explanation:
      "Three jack is the slang. The PGA Tour keeps 3-putt avoidance as a statistic. In the side game Snake, a three-putt hands you the snake.",
    example:
      "On the green in 2 on a par 4, you leave a 40-foot first putt 8 feet short, miss that, and tap in: three putts, a 5, bogey.",
    relatedTermIds: ["lag-putt", "putt", "snake"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "three-putt" },
    capabilityIds: [],
    sources: [
      compendium("What a 'three jack' is in golf", "https://www.golfcompendium.com/2026/10/three-jack-golf-slang.html"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
];
