/**
 * Side games, expansion batch 1 (#168, M8). Eleven records from
 * docs/glossary/inventory.md § C, drafted November 11, 2026.
 *
 * APPROVED, NOT PUBLISHED. Nothing here reaches a public page, the search
 * index, the sitemap, llms.txt or structured data until a release PR
 * publishes it; approved records show only in local review (../selectors). Expansion records go back to the owner's
 * review roles (editorial-review.md § Roles): an agent drafted these and
 * prepared the checks in docs/glossary/expansion-batch-1.md. On 2026-11-11
 * the owner delegated stages 2–4 to an agent; each record logs them below.
 * The owner approved all 11 in chat the same day.
 *
 * Every source with `accessedOn` was opened on that date. Pages whose URL
 * carries a word the vocabulary check bans were left out, as for the MVP.
 *
 * The owner answered the batch's three product questions on 2026-11-11
 * (#278): Net Skins narrowed to the standard skins, Lone Wolf and Eagle
 * Bounty kept as drafted.
 *
 * GoLo notes come only from `live` registry entries and their limits:
 * birdie and eagle bounties are the Skins game's Birdie Skin and Eagle Skin
 * settings (game-library), net strokes follow handicap-strokes, netting
 * follows settle-up. Automatic Press, Validation, Hammer and Rabbit are golf
 * education with no GoLo note (auto-press is planned; skins-validation is
 * not offered, #176).
 *
 * Held back from this batch: Barkie, Poley, Snake and Arnie (the owner cut
 * "junk" as a category on 2026-10-30) and Double or Nothing (no established
 * golf meaning found to source). See expansion-batch-1.md § Scope.
 */

import type { GlossaryTerm, ReviewEntry } from "../types";

const DRAFTED_ON = "2026-11-11";

/**
 * Stages 2-4, done by an agent on 2026-11-11 under the owner's delegation of
 * that date (editorial-review.md § Roles). Approval is the owner's and isn't
 * logged until they give it.
 */
const REVIEWED_ON = "2026-11-11";

const rules: ReviewEntry = {
  stage: "rules",
  by: "agent",
  on: REVIEWED_ON,
  note: "Every source reopened 2026-11-11 and each sentence checked against it; examples recomputed (expansion-batch-1.md).",
};

const seo: ReviewEntry = {
  stage: "seo",
  by: "agent",
  on: REVIEWED_ON,
  note: "Canonical per canonical-map.md; related ids and paths pass lint:content.",
};

/** The owner's approval, given in chat on 2026-11-11 ("Approve all 11"). */
const approval: ReviewEntry = {
  stage: "approval",
  by: "owner",
  on: REVIEWED_ON,
  note: "Approved in chat on 2026-11-11, all 11 records, on the agent's stage 2–4 checks.",
};

/** A record with a GoLo note, checked against the registry and the owner's answers. */
const reviewLogGolo: ReviewEntry[] = [
  rules,
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "GoLo note and capability ids checked against capabilities.ts and the owner's answers of 2026-11-11; app code not read.",
  },
  seo,
  approval,
];

/** A record with no GoLo note: capability ids only back the absence of one. */
const reviewLogNone: ReviewEntry[] = [
  rules,
  {
    stage: "product",
    by: "agent",
    on: REVIEWED_ON,
    note: "No GoLo claim; any capability ids are planned or not offered, and the record implies neither.",
  },
  seo,
  approval,
];

export const sideGamesBatch1Terms: GlossaryTerm[] = [
  {
    id: "automatic-press",
    slug: "automatic-press",
    term: "Automatic Press",
    aliases: ["auto press"],
    primaryCategory: "side-games",
    tags: ["presses"],
    priority: "expansion",
    shortDefinition:
      "A press that starts on its own as soon as a side falls a set number of holes behind, usually two, rather than waiting for the trailing side to call it.",
    example:
      "Your group plays a $5 front nine with automatic presses at two down. You lose the 1st and 2nd, so a $5 press starts on the 3rd tee for holes 3 to 9, and the front nine carries on underneath it.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups set the trigger (two down is the usual one; some use one down), whether a press can be turned down, and whether a press that falls two down starts one of its own.",
    },
    relatedTermIds: ["press", "re-press", "nassau"],
    relatedContentPaths: ["/blog/pressing"],
    canonical: { kind: "hub", anchor: "automatic-press" },
    capabilityIds: ["auto-press"],
    sources: [
      {
        title: "The Left Rough: Golf Press",
        url: "https://theleftrough.com/golf-press/",
        kind: "editorial",
        ref: "Auto press",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "CaddieHQ: What does pressing mean in golf?",
        url: "https://www.caddiehq.com/resources/what-does-pressing-mean-in-golf",
        kind: "editorial",
        ref: "Common pressing variations",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "point-value",
    slug: "point-value",
    term: "Point Value",
    aliases: [],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "What one point is worth in a points game such as Wolf or Bingo Bango Bongo. It's agreed before the round, and at the end the gap in points is multiplied by it.",
    example:
      "Bingo Bango Bongo at $2 a point. You finish with 22 points and Dave with 16: six points apart, so Dave owes you $12.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups settle points in different ways: the gap between each pair of players, or everyone in for the same amount with the most points taking it.",
    },
    relatedTermIds: ["wolf", "bingo-bango-bongo", "buy-in"],
    relatedContentPaths: ["/games/wolf", "/games/bingo-bango-bongo"],
    canonical: { kind: "hub", anchor: "point-value" },
    capabilityIds: [],
    sources: [
      {
        title: "CaddieHQ: How to play Bingo Bango Bongo",
        url: "https://www.caddiehq.com/resources/how-to-play-bingo-bango-bongo-golf",
        kind: "editorial",
        ref: "Settling up",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "buy-in",
    slug: "buy-in",
    term: "Buy-in",
    aliases: [],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "The amount each player puts in before the round to enter a game, usually the same for everyone. The total then goes to the winner or is split among the top finishers.",
    example:
      "Twelve players each put in $10 for skins, $120 in all. Six skins are won outright, so each one is worth $20.",
    ruleNote: {
      kind: "convention",
      text: "Not every game has one. In many groups each hole or point has a set value instead, and players settle the differences after the round.",
    },
    relatedTermIds: ["point-value", "skins", "settle-up"],
    relatedContentPaths: ["/games/skins"],
    canonical: { kind: "hub", anchor: "buy-in" },
    capabilityIds: [],
    sources: [
      {
        title: "GolfLink: Golf Skins Game, Everything You Need to Know",
        url: "https://golflink.com/lifestyle/golf-skins-game-everything-you-need-to-know",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "National Club Golfer: Skins golf format explained",
        url: "https://www.nationalclubgolfer.com/club/glossary/skins-golf-format-explained/",
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
    id: "validation",
    slug: "validation",
    term: "Validation",
    aliases: [],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A skins house rule that adds a condition before a skin counts. Common versions: the winner must tie or beat the low score on the next hole, or must make a set score there, such as a par or a birdie.",
    example:
      "Your group validates on the next hole. You win the 6th outright with a 4, then make 5 on the 7th, where the low score is 4. The 6th's skin isn't yours.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups differ on what validates, what happens to a skin that isn't validated (usually it goes back into play), and whether the 18th needs validating at all.",
    },
    relatedTermIds: ["skins", "carryover", "push"],
    relatedContentPaths: ["/games/skins"],
    canonical: { kind: "hub", anchor: "validation" },
    capabilityIds: ["skins-validation"],
    sources: [
      {
        title: "LiveTourney: Skins game rules",
        url: "https://www.livetourney.com/blog/skins-game-rules-golf",
        kind: "editorial",
        ref: "Variations",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "What does it mean to validate a skin?",
        url: "https://intercom.help/tournament-management/en/articles/10778684-what-does-it-mean-to-validate-a-skin",
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
    id: "net-skins",
    slug: "net-skins",
    term: "Net Skins",
    aliases: [],
    primaryCategory: "side-games",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "Skins played off handicaps: each player's strokes come off on the holes the stroke index gives them, and the lowest net score on a hole wins the skin.",
    explanation:
      "Gross skins compare the scores as played. Net skins let a higher handicap win a hole where a stroke turns a par into a net birdie.",
    example:
      "You play off 12 and Sam off 2. The 7th is stroke index 4, so you get a stroke there and Sam doesn't. You make 5, a net 4; Sam makes 4. Tied on net, so the skin carries.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide whether skins are gross or net before the round, and whether everyone takes full strokes or a percentage of them.",
    },
    // Owner, 2026-11-11 (#278), from the app's skins engine: Net applies
    // strokes to the standard skins, ties and carries included; the Birdie
    // Skin, Eagle Skin, Greenie and Sandie options stay gross.
    goloNote:
      "GoLo's Skins game can be set to net: strokes go on by the card's stroke index and decide each hole's low score, so ties and carries are net too. Its Birdie Skin, Eagle Skin, Greenie and Sandie options still use gross scores.",
    relatedTermIds: ["skins", "net-score", "handicap-stroke", "stroke-index"],
    relatedContentPaths: ["/games/skins"],
    canonical: { kind: "hub", anchor: "net-skins" },
    capabilityIds: ["game-library", "handicap-strokes", "skins-greenie-sandie"],
    ctaIntent: "handicaps",
    sources: [
      {
        title: "LiveTourney: Skins game rules",
        url: "https://www.livetourney.com/blog/skins-game-rules-golf",
        kind: "editorial",
        ref: "Net skins",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "GolfLink: Golf Skins Game, Everything You Need to Know",
        url: "https://golflink.com/lifestyle/golf-skins-game-everything-you-need-to-know",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogGolo,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "debt-netting",
    slug: "debt-netting",
    term: "Debt Netting",
    aliases: ["netting"],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "Cancelling what players owe each other against what they're owed, across every game in the round, so each player ends up with one number up or down instead of an amount for each game.",
    example:
      "You owe Tom $15 for the Nassau and $5 in Wolf, and he owes you $10 in skins. Netted, you pay Tom $10 once instead of settling three amounts.",
    goloNote:
      "GoLo nets every game in a round into one number per player, then lists who owes whom. Each round settles on its own.",
    relatedTermIds: ["settle-up", "carryover"],
    relatedContentPaths: ["/blog/settle-up-screen"],
    canonical: { kind: "hub", anchor: "debt-netting" },
    capabilityIds: ["settle-up"],
    ctaIntent: "settle-up",
    sources: [
      {
        title: "GoLo: How GoLo settles up",
        url: "https://www.golo.golf/blog/settle-up-screen",
        kind: "first-party",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogGolo,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "birdie-bounty",
    slug: "birdie-bounty",
    term: "Birdie Bounty",
    aliases: ["birdies game"],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A side game with a set price on every birdie: whoever makes one is owed that amount by each of the other players. Eagles usually count double.",
    example:
      "At $5 a birdie in a foursome, your birdie on the 12th is worth $15: $5 from each of the other three players.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide whether net birdies count or only gross ones, what an eagle is worth, and whether there's a cap.",
    },
    goloNote:
      "In GoLo a birdie bounty is the Skins game's Birdie Skin setting: gross birdies only, with no cap.",
    relatedTermIds: ["birdie", "eagle-bounty", "skins"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/games/birdies" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [
      {
        title: "Golf Monthly: Golf bits, what are they?",
        url: "https://www.golfmonthly.com/features/the-game/golf-bits-95132-95132",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "GoLo: Birdie bounty guide",
        url: "https://www.golo.golf/games/birdies",
        kind: "first-party",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogGolo,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "eagle-bounty",
    slug: "eagle-bounty",
    term: "Eagle Bounty",
    aliases: [],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A set amount owed to a player who makes an eagle, two under par on a hole, by each of the other players. Most groups make it double the birdie bounty.",
    example:
      "With birdies at $5 and eagles double, your eagle on the par-5 13th is worth $10 from each of the other three: $30.",
    ruleNote: {
      kind: "house-rules",
      text: "Some groups count an eagle as two birdies, some give it an amount of its own, and some don't count eagles separately at all.",
    },
    goloNote: "In GoLo an eagle bounty is the Skins game's Eagle Skin setting.",
    relatedTermIds: ["birdie-bounty", "eagle", "skins"],
    relatedContentPaths: ["/games/birdies"],
    canonical: { kind: "hub", anchor: "eagle-bounty" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [
      {
        title: "Golf Monthly: Golf bits, what are they?",
        url: "https://www.golfmonthly.com/features/the-game/golf-bits-95132-95132",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogGolo,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "hammer",
    slug: "hammer",
    term: "Hammer",
    aliases: [],
    primaryCategory: "side-games",
    tags: ["match-play"],
    priority: "expansion",
    shortDefinition:
      "A side game in which either side can double a hole's value partway through it. The other side either accepts and plays on at double, or concedes the hole at its value before the hammer.",
    explanation:
      "Usually played two against two, each side counting its better score, though it works in any match.",
    example:
      "The 5th is worth $2. Your opponents drive into the trees, so you hammer: the hole is now worth $4. They can concede and owe $2, or accept, play on, and hammer back to make it $8.",
    ruleNote: {
      kind: "house-rules",
      text: "Versions differ on who holds the hammer next, how many hammers a hole allows, and whether a hammer can be refused at all. Settle it before the first tee.",
    },
    relatedTermIds: ["press", "match-play", "four-ball"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "hammer" },
    capabilityIds: [],
    sources: [
      {
        title: "CaddieHQ: What is a hammer in golf?",
        url: "https://www.caddiehq.com/resources/what-is-a-hammer-in-golf",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Australian Golf Digest: How to play Hammer",
        url: "https://australiangolfdigest.com.au/how-to-play-hammer-golf-game-explained",
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
    id: "lone-wolf",
    slug: "lone-wolf",
    term: "Lone Wolf",
    aliases: [],
    primaryCategory: "side-games",
    tags: ["team"],
    priority: "expansion",
    shortDefinition:
      "In Wolf, the wolf's choice to play a hole alone against the other three instead of picking a partner. It's worth more points than a hole won with a partner.",
    explanation:
      "A Lone Wolf is declared after seeing the tee shots. Going alone before anyone tees off is a Blind Wolf, usually worth double.",
    example:
      "On a common points sheet, a Lone Wolf who wins the hole takes 4 points. One who loses it gives 1 point to each of the other three.",
    ruleNote: {
      kind: "house-rules",
      text: "Lone Wolf and Blind Wolf values vary between groups. Agree them with the rest of the points sheet before the round.",
    },
    goloNote:
      "GoLo's Wolf game scores Lone Wolf holes. It takes exactly four players, and the wolf rotates in player order.",
    relatedTermIds: ["wolf", "four-ball", "point-value"],
    relatedContentPaths: ["/games/wolf"],
    canonical: { kind: "hub", anchor: "lone-wolf" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [
      {
        title: "National Club Golfer: Wolf golf game rules",
        url: "https://www.nationalclubgolfer.com/club/wolf-golf-game-rules",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogGolo,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
  {
    id: "rabbit",
    slug: "rabbit",
    term: "Rabbit",
    aliases: [],
    primaryCategory: "side-games",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A side game for three or four players in which the first player to win a hole outright catches the rabbit. Whoever holds it walking off the 9th and 18th greens wins that nine.",
    explanation:
      "In one version, the next outright winner only sets the rabbit free, and it has to be caught again. In another, the next outright winner takes it straight away.",
    example:
      "Playing for $5 a nine, you win the 3rd outright and catch the rabbit. Dave wins the 6th outright and sets it free, then you win the 8th outright and catch it again. Holding it after the 9th, you take $5 from each of the others.",
    ruleNote: {
      kind: "house-rules",
      text: "If nobody holds the rabbit after the 9th, most versions play on, and whoever holds it after the 18th takes both nines.",
    },
    relatedTermIds: ["skins"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "rabbit" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Monthly: What is the Rabbit golf game?",
        url: "https://www.golfmonthly.com/features/the-game/what-is-the-rabbit-golf-game-67302",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Australian Golf Digest: How to play Rabbit",
        url: "https://www.australiangolfdigest.com.au/how-to-play-rabbit-golf-games-explained",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    reviewLog: reviewLogNone,
    reviewedBy: "owner",
    reviewedOn: REVIEWED_ON,
    status: "approved",
  },
];
