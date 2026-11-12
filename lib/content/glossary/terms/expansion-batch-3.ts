/**
 * Expansion batch 3 (#168, M8). Fourteen formats records from
 * docs/glossary/inventory.md § B, rows 35–48, drafted November 11, 2026,
 * including the revisions the owner accepted on 2026-10-29: merges M1
 * (Pinehurst into Chapman) and M2 (Round Robin into Sixes), substitutions
 * S2 (Par Competition), S3 (Greensomes) and S4 (Florida Scramble).
 *
 * IN REVIEW. Nothing here reaches a page, the search index, the sitemap,
 * llms.txt or structured data until each record is approved and a release PR
 * publishes it (../selectors). Expansion records go back to the owner's
 * review roles (editorial-review.md § Roles): an agent drafted these and
 * prepared the checks in docs/glossary/expansion-batch-3.md;
 * no stage is signed, so no record has a review log yet.
 *
 * Every source with `accessedOn` was opened on that date. Rules of Golf
 * pages are the 2023 edition on randa.org, including Committee Procedures
 * Section 9 (Modified Stableford, Greensomes, Scramble); the Rules of
 * Handicapping page is the 2024 edition under
 * usga.org/handicapping/roh/Content/rules/. Pages whose URL carries a word
 * the vocabulary check bans were left out.
 *
 * No record mentions GoLo, links a GoLo guide or post, or cites a
 * capability: the owner decided on 2026-11-11 that GoLo doesn't offer these
 * formats yet, so the batch is golf only, term and description. Related
 * links stay inside the glossary, plus the Rules Center's Rule 21 for Par
 * Competition and Three-Ball.
 */

import type { GlossaryTerm } from "../types";

const DRAFTED_ON = "2026-11-11";
const ROG = "Rules of Golf, 2023 edition (R&A)";
const ROG_BASE = "https://www.randa.org/en/rog/";
const ROH = "Rules of Handicapping, 2024 edition (USGA)";
const ROH_BASE = "https://www.usga.org/handicapping/roh/Content/rules/";

/** Committee Procedures Section 9, "Other Forms of Play" (9A–9D). */
const CP9 = {
  title: `${ROG}: Committee Procedures`,
  url: `${ROG_BASE}committee-procedures/sections/9`,
  kind: "official-rules",
} as const;

const APPENDIX_C = {
  title: ROH,
  url: `${ROH_BASE}Appendix%20C%20Handicap%20Allowances.htm`,
  kind: "handicapping",
} as const;

export const expansionBatch3Terms: GlossaryTerm[] = [
  {
    id: "shamble",
    slug: "shamble",
    term: "Shamble",
    aliases: [],
    primaryCategory: "formats",
    tags: ["team", "scramble"],
    priority: "expansion",
    shortDefinition:
      "A team format where everyone tees off, the team picks the best drive, and then each player plays their own ball from that spot into the hole. The team counts one or more of its players' scores, as agreed.",
    explanation:
      "It starts like a scramble, then everyone plays their own ball: after the drive, nobody moves to a teammate's ball again.",
    example:
      "A four-player shamble, best two net scores count. On the 7th the team takes Dave's drive in the fairway, and from there the four of you make net 4, 5, 5 and 6. The team scores 4 + 5 = 9.",
    ruleNote: {
      kind: "house-rules",
      text: "Events set how many scores count on each hole, from one to all four, and some require a set number of each player's drives.",
    },
    relatedTermIds: ["scramble", "texas-scramble", "florida-scramble", "four-ball"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "shamble" },
    capabilityIds: [],
    sources: [
      {
        title: "The Golf News Net: Golf games, how to play a shamble",
        url: "https://thegolfnewsnet.com/ryan_ballengee/2026/03/13/golf-games-how-to-play-a-shamble-124053/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "GolfLink: Playing a shamble golf format as a fun alternative",
        url: "https://www.golflink.com/lifestyle/playing-shamble-golf-format-as-fun-alternative",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "chapman",
    slug: "chapman",
    term: "Chapman",
    aliases: ["chapman system", "pinehurst", "pinehurst foursomes", "american foursomes"],
    primaryCategory: "formats",
    tags: ["team"],
    priority: "expansion",
    shortDefinition:
      "A two-player team format where both partners drive, each plays a second shot with the other's ball, and the side then picks one ball and plays it by alternate shots until it's holed.",
    explanation:
      "The partner whose second shot wasn't picked plays the third.",
    example:
      "On the 3rd you both drive. You play your second with your partner's ball and finish 10 feet away; she plays hers with your ball to 40 feet. You keep the 10-footer, so she putts it.",
    ruleNote: {
      kind: "handicapping",
      text: "The R&A's Committee Procedures list it as Pinehurst Foursomes, a variation of greensomes. Appendix C of the Rules of Handicapping recommends 60% of the lower Course Handicap plus 40% of the higher, as for greensomes.",
    },
    relatedTermIds: ["foursomes", "greensomes", "handicap-allowance"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "chapman" },
    capabilityIds: [],
    sources: [
      {
        ...CP9,
        ref: "Section 9B (Greensomes: Pinehurst Foursomes)",
        accessedOn: DRAFTED_ON,
      },
      {
        ...APPENDIX_C,
        ref: "Appendix C (Pinehurst/Chapman)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Compendium: The Chapman System golf format explained",
        url: "https://www.golfcompendium.com/2022/08/chapman-system-golf-format.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "CaddieHQ: What is Chapman in golf?",
        url: "https://www.caddiehq.com/resources/what-is-chapman-in-golf",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "par-competition",
    slug: "par-competition",
    term: "Par Competition",
    aliases: ["bogey competition", "par/bogey"],
    primaryCategory: "formats",
    tags: ["stroke-play"],
    priority: "expansion",
    shortDefinition:
      "A form of stroke play scored like match play against the course: on each hole you win, halve or lose against a fixed score, usually par, and the result is holes won minus holes lost.",
    explanation:
      "Played against a bogey score for each hole instead, an older target about five or six strokes a round above par, it's a bogey competition. Once you've lost a hole you can pick up.",
    example:
      "Off 10 strokes you get one on stroke index 1 to 10. On the par-4 6th, stroke index 4, your 5 is a net 4 and halves the hole; a net 3 would win it. Win 5 holes and lose 8 and you finish 3 down.",
    ruleNote: {
      kind: "rules",
      text: "Rule 21.3 of the Rules of Golf (Par/Bogey). Appendix C of the Rules of Handicapping recommends a 95% allowance for individual Par/Bogey: a 12.4 Index off white tees rated 69.6, Slope 122, par 72, has an unrounded Course Handicap of 10.988; × 95% = 10.44, so 10 strokes.",
    },
    relatedTermIds: ["par", "stableford", "match-play", "stroke-play", "handicap-stroke"],
    relatedContentPaths: ["/rules#rule-21"],
    canonical: { kind: "hub", anchor: "par-competition" },
    capabilityIds: [],
    sources: [
      {
        title: ROG,
        url: `${ROG_BASE}the-rules-of-golf/rule-21`,
        kind: "official-rules",
        ref: "Rule 21.3",
        accessedOn: DRAFTED_ON,
      },
      {
        title: ROG,
        url: `${ROG_BASE}definitions`,
        kind: "official-rules",
        ref: "Definitions: Par/Bogey",
        accessedOn: DRAFTED_ON,
      },
      {
        ...APPENDIX_C,
        ref: "Appendix C (Individual Par/Bogey)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Monthly: What are bogey competitions in golf?",
        url: "https://www.golfmonthly.com/features/the-game/what-are-bogey-competitions-in-golf-78821",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "texas-scramble",
    slug: "texas-scramble",
    term: "Texas Scramble",
    aliases: [],
    primaryCategory: "formats",
    tags: ["team", "scramble"],
    priority: "expansion",
    shortDefinition:
      "A scramble, usually for teams of four, in which the team must use a minimum number of each player's drives over the round, so the longest hitter can't take every tee shot.",
    explanation:
      "In the UK the name often just means a scramble, with or without a drive count.",
    example:
      "With four drives each, 16 of the 18 tee shots are spoken for. If the team has used Jim's drive only twice by the 15th tee, two of the last four holes have to be his.",
    ruleNote: {
      kind: "house-rules",
      text: "The number of drives is the event's rule: three or four each in a four-player team is typical. Appendix C of the Rules of Handicapping recommends 25%, 20%, 15% and 10% of the four players' Course Handicaps, lowest to highest.",
    },
    relatedTermIds: ["scramble", "florida-scramble", "shamble", "handicap-allowance"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "texas-scramble" },
    capabilityIds: [],
    sources: [
      {
        ...CP9,
        ref: "Section 9C (Scramble: Texas Scramble)",
        accessedOn: DRAFTED_ON,
      },
      {
        ...APPENDIX_C,
        ref: "Appendix C (Scramble, 4 players)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Monthly: What is a Texas Scramble?",
        url: "https://www.golfmonthly.com/features/the-game/texas-scramble-64802",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "England iGolf: Golf scramble formats, the ultimate guide to team play",
        url: "https://englandigolf.co.uk/igolf-blog/blog-archive/golf-scramble-formats-the-ultimate-guide-to-team-play/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "modified-stableford",
    slug: "modified-stableford",
    term: "Modified Stableford",
    aliases: [],
    primaryCategory: "formats",
    tags: ["stroke-play"],
    priority: "expansion",
    shortDefinition:
      "A version of Stableford with its own points table that rewards good holes and takes points away for bad ones, so a blow-up hole costs you instead of scoring zero. The table varies by event.",
    explanation:
      "The R&A's example gives 4 points for a birdie, 2 for a par and minus 1 for a bogey or worse. The PGA Tour's table at the Barracuda Championship has been 8 for a double eagle, 5 for an eagle, 2 for a birdie, 0 for a par, minus 1 for a bogey and minus 3 for a double bogey or worse.",
    example:
      "On the PGA Tour's table, a round of one eagle, five birdies, ten pars, one bogey and one double bogey scores 5 + 10 + 0 − 1 − 3 = 11 points.",
    ruleNote: {
      kind: "rules",
      text: "Standard Stableford is Rule 21.1 of the Rules of Golf. Modified Stableford is one of the other forms of play in the R&A's Committee Procedures (Section 9A), which give its points only as an example.",
    },
    relatedTermIds: ["stableford", "eagle", "birdie", "bogey"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "modified-stableford" },
    capabilityIds: [],
    sources: [
      {
        ...CP9,
        ref: "Section 9A (Modified Stableford)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "PGA Tour: How it works, the Modified Stableford format at the Barracuda Championship",
        url: "https://www.pgatour.com/article/news/latest/2023/07/16/how-it-works-modified-stableford-format-barracuda-championship",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "ryder-cup-style",
    slug: "ryder-cup-style",
    term: "Ryder Cup-Style Competition",
    aliases: ["ryder cup format"],
    primaryCategory: "formats",
    tags: ["team", "match-play"],
    priority: "expansion",
    shortDefinition:
      "A team event built like the Ryder Cup: two teams play a series of foursomes, four-ball and singles matches, each worth one point, or half a point each if halved. The team with more points wins.",
    explanation:
      "Every match is match play. In foursomes each pair plays one ball, taking alternate shots; in four-ball each player plays their own ball and the pair's better score counts; singles is one against one. A halved hole carries nothing over.",
    example:
      "Twelve players on a trip, six a side. Day one has three foursomes and three four-ball matches, day two six singles: 12 points in all, so 6.5 wins outright.",
    ruleNote: {
      kind: "convention",
      text: "The Ryder Cup itself has 28 matches: eight foursomes, eight four-balls and 12 singles, so 14.5 points wins. For handicap play, Appendix C of the Rules of Handicapping recommends 100% for singles, 90% for four-ball and, in foursomes, 50% of the difference between the sides' combined Course Handicaps.",
    },
    relatedTermIds: ["four-ball", "foursomes", "match-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "ryder-cup-style" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Monthly: Ryder Cup format explained",
        url: "https://www.golfmonthly.com/news/ryder-cup-format-explained-how-foursomes-fourballs-and-singles-differ",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf.com: Ryder Cup 101, how it works, explained",
        url: "https://golf.com/news/ryder-cup-101-how-it-works-explained/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        ...APPENDIX_C,
        ref: "Appendix C (Match Play: Individual, Four-Ball; Foursomes)",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "vegas",
    slug: "vegas",
    term: "Vegas",
    aliases: ["las vegas"],
    primaryCategory: "formats",
    tags: ["team"],
    priority: "expansion",
    shortDefinition:
      "A two-against-two game where each side writes its two scores on a hole as one two-digit number, lower score first, so a 4 and a 5 make 45. The lower number wins the hole by the difference, in points.",
    explanation:
      "Partners usually stay together for the whole round. A birdie flip or a blow-up hole can swing a single hole by 20 points or more, so groups keep the value of a point small.",
    example:
      "You make 4 and your partner 5: 45. The other side makes 5 and 6: 56. You win the hole by 11 points, $1.10 at 10 cents a point.",
    ruleNote: {
      kind: "house-rules",
      text: "A common addition is the birdie flip: when one side makes a birdie, the other side's number is written high score first, so 56 becomes 65. If both sides make one, nothing flips. Agree how a 10 is written: one common way makes 4 and 10 into 104.",
    },
    relatedTermIds: ["point-value", "four-ball", "birdie"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "vegas" },
    capabilityIds: [],
    sources: [
      {
        title: "GolfLink: How to play Vegas",
        url: "https://www.golflink.com/lifestyle/play-vegas",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "The Fried Egg: Vegas golf game",
        url: "https://www.thefriedegg.com/articles/vegas-golf-game",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "quota",
    slug: "quota",
    term: "Quota",
    aliases: [],
    primaryCategory: "formats",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A points game where each player tries to beat a personal target, usually 36 minus their Course Handicap. Points come from each hole's gross score, commonly 1 for a bogey, 2 for a par, 4 for a birdie and 8 for an eagle.",
    explanation:
      "The result is points over or under the quota, so players of any handicap can win.",
    example:
      "A 12.4 Index off blue tees rated 71.8, Slope 131, par 72, plays off 14, so the quota is 36 − 14 = 22. Eight pars, six bogeys, a birdie and three double bogeys score 16 + 6 + 4 + 0 = 26: plus 4.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups set the point table and the target. Some start each player on their Course Handicap in points and play to 36, which comes to the same result.",
    },
    relatedTermIds: ["stableford", "course-handicap"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "quota" },
    capabilityIds: [],
    sources: [
      {
        title: "Beezer Golf: Quota tournament",
        url: "https://beezergolf.com/games-guide/quota-tournament",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "LiveTourney: A complete guide to the quota golf game format",
        url: "https://www.livetourney.com/blog/quota-golf-game",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "sixes",
    slug: "sixes",
    term: "Sixes",
    aliases: ["round robin", "hollywood"],
    primaryCategory: "formats",
    tags: ["team"],
    priority: "expansion",
    shortDefinition:
      "A game for four players in two-against-two matches, with partners changing every six holes so that over 18 holes each player partners each of the other three once.",
    explanation:
      "Each six-hole stretch is its own match, and any two-against-two scoring works; better ball is the most common.",
    example:
      "A and B play C and D on holes 1 to 6, A and C play B and D on 7 to 12, and A and D play B and C on 13 to 18. At $5 a match, win two and lose one and you're $5 up.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide the order of partners and the scoring for each match, and some change the scoring when partners change.",
    },
    relatedTermIds: ["four-ball", "match-play", "nines"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "sixes" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Compendium: How to play the Sixes golf format",
        url: "https://www.golfcompendium.com/2019/01/sixes-golf-format.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Compendium: How to play the Round Robin golf format",
        url: "https://www.golfcompendium.com/2023/08/round-robin.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Compendium: Explaining the Hollywood golf format",
        url: "https://www.golfcompendium.com/2024/09/hollywood-format.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf.com: How to play Sixes",
        url: "https://golf.com/news/money-games-explained-how-to-play-sixes/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "nines",
    slug: "nines",
    term: "Nines",
    aliases: ["5-3-1"],
    primaryCategory: "formats",
    tags: [],
    priority: "expansion",
    shortDefinition:
      "A points game, usually for three players, with nine points on every hole: 5 for the lowest score, 3 for the middle and 1 for the highest. Tied players share the points for the places they tie for.",
    explanation:
      "Two tied for low take 4 each; two tied for high take 2 each; three tied take 3 each. At the end, players settle the difference in points at an agreed amount a point.",
    example:
      "After 18 holes there are 162 points. You have 60, Jess 52 and Tom 50. At $1 a point, Jess owes you $8, and Tom owes you $10 and Jess $2: you're up $18, Jess down $6, Tom down $12.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups choose gross or net. It's also played by four, with 5, 3, 1 and 0.",
    },
    relatedTermIds: ["point-value", "sixes"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "nines" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Compendium: How to play the golf game named Nines",
        url: "https://www.golfcompendium.com/2022/12/nines-golf-game.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "CaddieHQ: How to play 9s in golf",
        url: "https://www.caddiehq.com/resources/how-to-play-9s-golf",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "GoLo: Golf games for 3 players",
        url: "https://www.golo.golf/blog/golf-games-for-3-players",
        kind: "first-party",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "greensomes",
    slug: "greensomes",
    term: "Greensomes",
    aliases: [],
    primaryCategory: "formats",
    tags: ["team"],
    priority: "expansion",
    shortDefinition:
      "A two-player team format where both partners tee off, the side picks one drive, and the partner whose drive wasn't picked plays the next shot. From there they alternate shots until the ball is holed.",
    explanation:
      "It's foursomes with a choice of drive. In Chapman, the partners also swap balls for the second shot before choosing.",
    example:
      "Course Handicaps of 11 and 23: 60% of 11 is 6.6 and 40% of 23 is 9.2, so the side plays off 15.8, rounded to 16.",
    ruleNote: {
      kind: "handicapping",
      text: "The R&A's Committee Procedures (Section 9B) describe it as a variation of foursomes. Appendix C of the Rules of Handicapping recommends 60% of the lower Course Handicap plus 40% of the higher.",
    },
    relatedTermIds: ["foursomes", "chapman", "handicap-allowance"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "greensomes" },
    capabilityIds: [],
    sources: [
      {
        ...CP9,
        ref: "Section 9B (Greensomes)",
        accessedOn: DRAFTED_ON,
      },
      {
        ...APPENDIX_C,
        ref: "Appendix C (Greensomes)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Monthly: What is greensomes?",
        url: "https://www.golfmonthly.com/features/what-is-greensomes",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "National Club Golfer: How to play greensomes",
        url: "https://www.nationalclubgolfer.com/club/glossary/greensomes-golf-format-explained/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "florida-scramble",
    slug: "florida-scramble",
    term: "Florida Scramble",
    aliases: ["step-aside scramble"],
    primaryCategory: "formats",
    tags: ["team", "scramble"],
    priority: "expansion",
    shortDefinition:
      "A scramble in which the player whose shot the team picks sits out the next shot, then rejoins. No one player can hit every shot that counts.",
    explanation:
      "In a Miami scramble, usually a different format, the player whose drive is picked sits out until the team reaches the green.",
    example:
      "Four players. Your drive on the 5th is picked, so the other three play the second shot from it. Tom's approach is picked, so he sits out the third and you're back in.",
    ruleNote: {
      kind: "house-rules",
      text: "The R&A's Committee Procedures (Section 9C) list it as a scramble variation, also called dropout scramble or stand aside. Handicaps are the organizer's call.",
    },
    relatedTermIds: ["scramble", "texas-scramble", "shamble"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "florida-scramble" },
    capabilityIds: [],
    sources: [
      {
        ...CP9,
        ref: "Section 9C (Scramble: Florida Scramble)",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Beezer Golf: Step Aside",
        url: "https://beezergolf.com/games-guide/step-aside",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "England iGolf: Golf scramble formats, the ultimate guide to team play",
        url: "https://englandigolf.co.uk/igolf-blog/blog-archive/golf-scramble-formats-the-ultimate-guide-to-team-play/",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Compendium: How to play a Miami scramble",
        url: "https://www.golfcompendium.com/2020/11/miami-scramble-golf-format.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "peoria-system",
    slug: "peoria-system",
    term: "Peoria System",
    aliases: ["peoria"],
    primaryCategory: "formats",
    tags: ["handicap"],
    priority: "expansion",
    shortDefinition:
      "A one-day handicap for an event where many players have no Handicap Index. Six holes are picked in secret, and after the round each player's score on them is scaled up to set their strokes for the day.",
    explanation:
      "The usual sum, with each hole capped at double par: the six-hole score times 3, minus the course's par, times 80%. It sets strokes for that event only.",
    example:
      "The hidden holes turn out to be the 3rd, 5th, 8th, 12th, 14th and 17th, and you played them in 31 on a par-72 course. 31 × 3 = 93; 93 − 72 = 21; 21 × 80% = 16.8, so 17 strokes. A gross 95 is a net 78.",
    ruleNote: {
      kind: "convention",
      text: "Versions differ: which holes are picked (traditionally a par 3, a par 4 and a par 5 on each nine), the 80%, and the cap on each hole (some events use double bogey instead of double par).",
    },
    relatedTermIds: ["handicap-index", "net-score", "sandbagging"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "peoria-system" },
    capabilityIds: [],
    sources: [
      {
        title: "Golf Compendium: How the Peoria System works in golf",
        url: "https://www.golfcompendium.com/2026/01/peoria-system-golf-handicap.html",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Beezer Golf: Peoria System",
        url: "https://beezergolf.com/games-guide/peoria-system",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "CaddieHQ: What is Peoria scoring in golf?",
        url: "https://www.caddiehq.com/resources/what-is-peoria-scoring-in-golf",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
  {
    id: "three-ball",
    slug: "three-ball",
    term: "Three-Ball",
    aliases: ["three-ball match play"],
    primaryCategory: "formats",
    tags: ["match-play"],
    priority: "expansion",
    shortDefinition:
      "A form of match play where three players each play an individual match against the other two at the same time, with one ball counting in both of their matches.",
    explanation:
      "Golfers also call any group of three a three-ball; that's a group, not this format.",
    example:
      "You, Jess and Tom play three matches at once. On the 1st you make 4 and both of them make 5: you win the hole in both your matches, and Jess and Tom halve theirs.",
    ruleNote: {
      kind: "rules",
      text: "Rule 21.4 of the Rules of Golf (Three-Ball Match Play). It covers the two cases where the matches conflict: a stroke played out of turn, and a ball or ball-marker lifted or moved by one opponent.",
    },
    relatedTermIds: ["match-play"],
    relatedContentPaths: ["/rules#rule-21"],
    canonical: { kind: "hub", anchor: "three-ball" },
    capabilityIds: [],
    sources: [
      {
        title: ROG,
        url: `${ROG_BASE}the-rules-of-golf/rule-21`,
        kind: "official-rules",
        ref: "Rule 21.4",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Beezer Golf: Three Ball",
        url: "https://beezergolf.com/games-guide/three-ball",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
      {
        title: "Golf Monthly: The best threeball formats for golf",
        url: "https://www.golfmonthly.com/features/the-game/the-best-threeball-formats-for-golf-74154",
        kind: "editorial",
        accessedOn: DRAFTED_ON,
      },
    ],
    status: "in-review",
  },
];
