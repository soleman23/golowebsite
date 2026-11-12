/**
 * Expansion batch 8 (#168, #304, M8). Ten equipment and technology records
 * from docs/glossary/inventory.md § G, rows 137–146, drafted November 12,
 * 2026. The last expansion batch: with it the glossary reaches 166 records.
 *
 * PUBLISHED by the batch 8 release PR, which the owner asked for after
 * approving all 10 ("Merge, then release"). It took the glossary to 166.
 * Expansion records go back to the owner's
 * review roles (editorial-review.md § Roles): an agent drafted these and
 * prepared the checks in docs/glossary/expansion-batch-8.md. On 2026-11-12
 * the owner delegated stages 2–4 for this batch to an agent and kept
 * approval (#304); each record logs those three stages below. The owner
 * approved all 10 in chat the same day ("Approve all 10"), with Rangefinder
 * as a hub entry and the "lob shot" alias for Flop Shot in the release PR.
 *
 * Every source with `accessedOn` was opened on that date. Rules of Golf
 * pages are the 2023 edition on randa.org. Definitions, not buying advice:
 * no brands (inventory.md § G). Pages whose URL carries a word the
 * vocabulary check bans were left out.
 *
 * No record mentions GoLo or cites a capability: the batch is golf only.
 * Rangefinder is a hub entry because /blog/rangefinder is unpublished.
 */

import type { GlossaryTerm, ReviewEntry } from "../types";

const DRAFTED_ON = "2026-11-12";

/**
 * Stages 2–4, done by an agent on 2026-11-12 under the owner's delegation of
 * that date for this batch only (#304; editorial-review.md § Roles).
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
    note: "Every source reopened 2026-11-12 (R&A 2023 Rule 4; 19 editorial pages) and each sentence checked against it; examples recomputed (expansion-batch-8.md).",
  },
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "Golf only: no GoLo note, link, CTA or capability id, and no field mentions GoLo or the app; no brands (#304).",
  },
  {
    stage: "seo",
    by: "agent",
    on: REVIEWED_ON,
    note: "Hub canonical at the slug; Rangefinder is a hub entry while /blog/rangefinder is unpublished. Related ids pass lint:content.",
  },
  {
    stage: "approval",
    by: "owner",
    on: REVIEWED_ON,
    note: "Approved in chat on 2026-11-12, all 10 records, on the agent's stage 2–4 checks, with Rangefinder as a hub entry while its post is unpublished.",
  },
];

const RULE_4 = (ref: string) =>
  ({
    title: "Rules of Golf, 2023 edition (R&A): Rule 4",
    url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-4",
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

/** Lofts by club: drivers, fairway woods, hybrids, irons and wedges. */
const GM_LOFTS = {
  title: "Golf Monthly: What degree loft should your golf clubs be?",
  url: "https://www.golfmonthly.com/features/the-game/degree-golf-clubs-190027",
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

const LONG_IRONS = compendium("What are the long irons in golf?", "https://www.golfcompendium.com/2020/08/what-are-long-irons-in-golf.html");

const editorial = (title: string, url: string) =>
  ({ title, url, kind: "editorial", accessedOn: DRAFTED_ON }) as const;

export const expansionBatch8Terms: GlossaryTerm[] = [
  {
    id: "iron",
    slug: "iron",
    term: "Iron",
    aliases: [],
    primaryCategory: "equipment",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "One of the numbered clubs, from about 3 to 9. The higher the number, the more loft, so the higher and shorter the shot.",
    explanation:
      "Golfers group them as long irons (3 and 4), mid irons (5 to 7) and short irons (8, 9 and the pitching wedge). Many now carry hybrids instead of the long irons. No standard sets each iron's loft; a 7-iron is usually around 34 degrees.",
    example:
      "A player who carries a 7-iron 150 yards takes the 7 from 150. From 160 they take one more club, the 6-iron.",
    relatedTermIds: ["wedge", "hybrid", "loft"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "iron" },
    capabilityIds: [],
    sources: [
      compendium("What are the mid-irons in golf?", "https://www.golfcompendium.com/2020/08/what-are-mid-irons-in-golf.html"),
      LONG_IRONS,
      GM_LOFTS,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "wedge",
    slug: "wedge",
    term: "Wedge",
    aliases: [],
    primaryCategory: "equipment",
    tags: ["short-game"],
    priority: "expansion",
    shortDefinition:
      "The most lofted clubs in the bag, for short approaches, pitches, chips and bunker shots. The four main types, from least loft to most, are the pitching, gap, sand and lob wedge.",
    explanation:
      "Typical lofts: pitching wedge 45–50 degrees, gap wedge 50–54, sand wedge 55–58, lob wedge 58–64. The pitching wedge traditionally comes with a set of irons, and the gap wedge fills the space between it and the sand wedge.",
    example: "From 90 yards a player hits a pitching wedge; from a greenside bunker, the sand wedge.",
    ruleNote: {
      kind: "rules",
      text: "You may carry at most 14 clubs (Rule 4.1b), so every wedge you add is a club you leave out somewhere else.",
    },
    relatedTermIds: ["iron", "bounce", "loft", "pitch", "flop-shot"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "wedge" },
    capabilityIds: [],
    sources: [
      editorial(
        "Golfshake: What are the different kinds of golf wedges",
        "https://www.golfshake.com/news/view/21721/What_Are_The_Different_Kinds_of_Golf_Wedges.html",
      ),
      GM_LOFTS,
      compendium("What is an 'attack wedge' in golf?", "https://www.golfcompendium.com/2022/06/attack-wedge-golf.html"),
      RULE_4("Rule 4.1b(1) (limit of 14 clubs)"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "hybrid",
    slug: "hybrid",
    term: "Hybrid",
    aliases: ["rescue club"],
    primaryCategory: "equipment",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A club that blends a long iron and a fairway wood: its head is bigger than an iron's but smaller than a fairway wood's, and most golfers find it easier to hit than a long iron.",
    explanation:
      "Hybrids are numbered like the irons they replace, so a 4-hybrid takes the place of a 4-iron. Some golfers use them instead of mid irons, or of a fairway wood. Rescue club is another name for them.",
    example: "A player who can't get a 4-iron airborne swaps it for a 4-hybrid that covers the same distance.",
    relatedTermIds: ["iron", "fairway-wood"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "hybrid" },
    capabilityIds: [],
    sources: [
      editorial(
        "Today's Golfer: Irons vs hybrids vs fairway woods",
        "https://www.todays-golfer.com/features/equipment-features/irons-vs-hybrids-vs-fairway-woods-how-to-choose-the-best-option-for-your-golf-game-and-course/",
      ),
      editorial("Golf.com: What is a hybrid?", "https://golf.com/gear/hybrids/what-is-a-hybrid-why-most-golfers-should-use-one/"),
      LONG_IRONS,
      GM_LOFTS,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "fairway-wood",
    slug: "fairway-wood",
    term: "Fairway Wood",
    aliases: [],
    primaryCategory: "equipment",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A wood with more loft than the driver, made to be hit off the fairway as well as the tee. They're numbered by loft: 3-wood, 5-wood, 7-wood.",
    explanation:
      "Most have 13 to 19 degrees of loft, and a 7-wood can have about 24. Brassie, an old name for one, still turns up now and then.",
    example: "On a long par 5, a player who has driven 240 yards hits a 3-wood from the fairway to leave a short pitch.",
    relatedTermIds: ["driver", "hybrid"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "fairway-wood" },
    capabilityIds: [],
    sources: [
      GM_LOFTS,
      compendium("The brassie (or 'brassy') golf club", "https://www.golfcompendium.com/2020/06/brassie-golf-club.html"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "loft",
    slug: "loft",
    term: "Loft",
    aliases: [],
    primaryCategory: "equipment",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "The angle of the clubface away from vertical, in degrees. More loft sends the ball higher and shorter; less loft sends it lower and farther.",
    explanation:
      "Drivers have about 7 to 13 degrees and lob wedges up to about 64. A stronger loft is a lower one.",
    example:
      "Bending a 7-iron from 34 degrees to 32 strengthens its loft by two degrees, for a little more distance and a slightly flatter flight.",
    relatedTermIds: ["lie-angle", "bounce", "driver", "wedge"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "loft" },
    capabilityIds: [],
    sources: [
      GOLFSHAKE,
      compendium(
        "What stronger lofts or strengthening lofts means in golf",
        "https://www.golfcompendium.com/2020/08/stronger-lofts-or-strengthening-loft-in-golf.html",
      ),
      GM_LOFTS,
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "lie-angle",
    slug: "lie-angle",
    term: "Lie Angle",
    aliases: [],
    primaryCategory: "equipment",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "The angle between a club's shaft and the ground when its sole sits flat. Not the same as the lie, which is where the ball rests.",
    explanation:
      "For a right-handed golfer, a club that's too upright lifts the toe, so the heel hits the turf first and the ball goes left; one that's too flat digs the toe in and sends it right. It's one of the main things a club fitting checks.",
    example:
      "A right-hander's iron divots are deeper at the heel and the shots start left: the lie angle may be too upright.",
    relatedTermIds: ["loft", "iron"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "lie-angle" },
    capabilityIds: [],
    sources: [
      editorial(
        "National Club Golfer: What is lie angle in golf and why is it so important?",
        "https://www.nationalclubgolfer.com/reviews/reviews/what-is-lie-angle-golf/",
      ),
      editorial(
        "Golf.com: Understanding lie angle and how it works",
        "https://golf.com/gear/fully-equipped-mailbag-understanding-lie-angle-and-how-it-works/",
      ),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "bounce",
    slug: "bounce",
    term: "Bounce",
    aliases: [],
    primaryCategory: "equipment",
    tags: ["short-game"],
    priority: "expansion",
    shortDefinition:
      "The angle between a club's leading edge and the lowest point of its sole, in degrees. More bounce holds the leading edge higher off the ground.",
    explanation:
      "Wedges usually show two numbers: the loft and the smaller one, the bounce, from about 4 to 14. More bounce helps the club move through soft turf and fluffy sand and suits a steep swing; less suits firm ground and harder sand.",
    example:
      "A player with a steep swing who plays soft courses picks a 56-degree sand wedge with 12 degrees of bounce.",
    relatedTermIds: ["wedge", "loft"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "bounce" },
    capabilityIds: [],
    sources: [
      GOLFSHAKE,
      editorial(
        "National Club Golfer: What is wedge bounce?",
        "https://www.nationalclubgolfer.com/equipment/wedges/golf-glossary-wedge-bounce-explained/",
      ),
      editorial("Golf Monthly: What is bounce on wedges?", "https://www.golfmonthly.com/reviews/wedges/what-is-bounce-on-wedges"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "shaft-flex",
    slug: "shaft-flex",
    term: "Shaft Flex",
    aliases: ["flex"],
    primaryCategory: "equipment",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "How much a club's shaft bends during the swing. Ratings run from extra stiff at the firm end to ladies at the soft end, with stiff and regular in between.",
    explanation:
      "A faster swing loads the shaft more and usually needs a stiffer one, but tempo matters too. Putters aren't rated: their shafts are short and the stroke is gentle.",
    example: "Two players hit the same driver head: the faster swinger plays a stiff shaft, the slower one a regular.",
    relatedTermIds: [],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "shaft-flex" },
    capabilityIds: [],
    sources: [
      editorial("Golf Monthly: What shaft flex should I use?", "https://www.golfmonthly.com/features/the-game/shaft-flex-use-2-189385"),
      compendium(
        "Does putter shaft flex have any effect on putting success?",
        "https://www.golfcompendium.com/2019/03/putter-shaft-flex.html",
      ),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "rangefinder",
    slug: "rangefinder",
    term: "Rangefinder",
    aliases: ["laser"],
    primaryCategory: "equipment",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A handheld laser you aim at a target, such as the flag, to get its exact distance. It's one kind of distance-measuring device; GPS watches and handhelds are the others.",
    explanation:
      "Many have a slope mode that adjusts the reading for uphill and downhill shots. It must be switched off in competition.",
    example:
      "You shoot the flag at 143 yards; with slope on, it reads 151 because the green is uphill. In a competition you'd play the 143.",
    ruleNote: {
      kind: "rules",
      text: "Rule 4.3a(1) allows getting distance information but not measuring elevation changes, which is what slope mode does. A committee can ban distance-measuring devices by local rule (Model Local Rule G-5).",
    },
    relatedTermIds: ["launch-monitor"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "rangefinder" },
    capabilityIds: [],
    sources: [
      RULE_4("Rule 4.3a(1) (distance and directional information); Model Local Rule G-5"),
      editorial("Golf Monthly: Watch v GPS v laser, which is best for you?", "https://www.golfmonthly.com/features/the-game/watch-v-gps-v-laser-189927"),
      editorial(
        "Today's Golfer: What is the slope function in a golf rangefinder?",
        "https://www.todays-golfer.com/news-and-events/equipment-news/what-is-slope-function-in-a-rangefinder/",
      ),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
  {
    id: "launch-monitor",
    slug: "launch-monitor",
    term: "Launch Monitor",
    aliases: [],
    primaryCategory: "equipment",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A device that measures each shot just after impact and reports numbers such as clubhead speed, ball speed, launch angle, spin rate and carry distance.",
    explanation:
      "Coaches and club fitters use them, and some driving ranges have them. Carry, the distance the ball flies before it lands, is the number most worth knowing for each club.",
    example:
      "On the range a player hits ten 7-irons and the monitor shows an average carry of 148 yards: that's their 7-iron number.",
    ruleNote: {
      kind: "rules",
      text: "During a round, Rule 4.3a(3) lets you record playing information for use after the round, but not process or interpret it, such as club recommendations based on that round's distances.",
    },
    relatedTermIds: ["rangefinder", "shaft-flex"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "launch-monitor" },
    capabilityIds: [],
    sources: [
      editorial(
        "Golf Monthly: Decoding the launch monitor data",
        "https://www.golfmonthly.com/features/decoding-the-launch-monitor-data-smash-factor-launch-angle-spin-rate-and-more-explained",
      ),
      editorial("Golf Monthly: What shaft flex should I use?", "https://www.golfmonthly.com/features/the-game/shaft-flex-use-2-189385"),
      RULE_4("Rule 4.3a(3) (information gathered before or during the round)"),
    ],
    reviewLog,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    publishedOn: PUBLISHED_ON,
    status: "published",
  },
];
