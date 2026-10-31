/**
 * Games and formats (#158, GLS-006a). Ten MVP records from
 * docs/glossary/inventory.md § B.
 *
 * PUBLISHED by the launch PR (#166). Drafted and source-checked October 29,
 * 2026: every source with `accessedOn` was opened on that date
 * (docs/glossary/review-packet.md records what each says and the recomputed
 * examples). The review log is in ../review.ts: rules, product and SEO by an
 * agent under the owner's delegation, approval by the owner in writing.
 *
 * GoLo notes come from live registry entries only (game-library,
 * live-skins, scramble, overall-match-presses); Four-Ball, Foursomes, Match
 * Play and Stableford get none, only the "games GoLo scores" link.
 *
 * Where a guide owns the intent (canonical-map.md), the entry is a short
 * definition and the guide link, and doesn't restate the guide's rules.
 */

import { MVP_REVIEWED_ON, mvpReviewLogApp, mvpReviewLogNone } from "../review";
import type { GlossaryTerm } from "../types";

export const formatsTerms: GlossaryTerm[] = [
  {
    id: "skins",
    slug: "skins",
    term: "Skins",
    aliases: ["skins game"],
    primaryCategory: "formats",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A game where every hole is worth a skin, won only by the player with the lowest score outright. If the low score is tied, nobody wins the hole, and in most groups the skin carries to the next one.",
    example:
      "Four players at $5 a skin tie holes 1 to 3. Your birdie on the 4th takes four skins: $60, $20 from each of the other three.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups set whether ties carry, whether skins are gross or net, and what happens to skins still carried after the 18th.",
    },
    goloNote:
      "GoLo builds skins and carries hole by hole on the scoring screen and the live leaderboard, and nets them into the settle-up with the round's other games.",
    relatedTermIds: ["carryover", "push", "nassau", "best-score"],
    relatedContentPaths: ["/blog/skins-carryover"],
    canonical: { kind: "existing", path: "/games/skins" },
    capabilityIds: ["game-library", "live-skins"],
    ctaIntent: "games",
    sources: [
      {
        title: "Golf.com",
        url: "https://golf.com/news/skins-game-2025-everything-to-know-format-money/",
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
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogApp,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "nassau",
    slug: "nassau",
    term: "Nassau",
    aliases: [],
    primaryCategory: "formats",
    tags: ["match-play"],
    priority: "mvp",
    shortDefinition:
      "Three matches in one round, each for the same amount: the front nine, the back nine and the full eighteen. Most groups play each as match play, counted in holes won rather than strokes.",
    example:
      "In a $5 Nassau you win the front 2 up, halve the back and win the eighteen 2 up: $10 for the day. Lose all three and you're down $15, the most a straight Nassau can cost.",
    ruleNote: {
      kind: "house-rules",
      text: "No governing body writes rules for the Nassau. Whether strokes count, whether presses are allowed and when the eighteen closes are up to the group.",
    },
    goloNote:
      "Over 18 holes GoLo plays the three matches and nets them into the settle-up; over nine it plays one. Its Nassau takes no presses; presses are on the Overall Match game.",
    relatedTermIds: ["match-play", "press"],
    relatedContentPaths: ["/blog/nassau"],
    canonical: { kind: "existing", path: "/games/nassau" },
    capabilityIds: ["game-library", "nassau-presses", "overall-match-presses"],
    ctaIntent: "games",
    sources: [
      {
        title: "Golf Monthly",
        url: "https://www.golfmonthly.com/features/the-game/what-is-a-nassau-in-golf",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "National Club Golfer",
        url: "https://www.nationalclubgolfer.com/club/glossary/nassau-golf-format-explained/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogApp,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "wolf",
    slug: "wolf",
    term: "Wolf",
    aliases: [],
    primaryCategory: "formats",
    tags: ["team"],
    priority: "mvp",
    shortDefinition:
      "A four-player game where one player, the wolf, rotates each hole and either picks a partner for that hole or plays alone against the other three for a bigger share of the points.",
    example:
      "On the 5th the wolf passes on all three drives and goes alone. A birdie that beats the other three's best score wins double the usual points.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups differ on whether the wolf tees off first or last, what going alone is worth, and who is wolf on the 17th and 18th.",
    },
    relatedTermIds: ["four-ball", "match-play"],
    relatedContentPaths: ["/blog/wolf"],
    canonical: { kind: "existing", path: "/games/wolf" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [
      {
        title: "Golf.com",
        url: "https://golf.com/travel/are-you-the-leader-of-your-foursome-try-this-golf-game/",
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
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogApp,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "bingo-bango-bongo",
    slug: "bingo-bango-bongo",
    term: "Bingo Bango Bongo",
    aliases: ["bbb"],
    primaryCategory: "formats",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A points game with three points on every hole: one for the first ball on the green (bingo), one for the closest to the pin once every ball is on (bango), and one for the first ball in the hole (bongo).",
    example:
      "Eighteen holes hold 54 points. The 22-handicapper who lays up short of the green on the 7th still plays first from there, so bingo is theirs to lose, which is why the game suits a group with a 6 and a 22 in it.",
    ruleNote: {
      kind: "house-rules",
      text: "Groups decide whether the fringe counts as on the green. Most keep strict order of play, farthest from the hole first, so the points go to the right player.",
    },
    relatedTermIds: ["skins"],
    relatedContentPaths: ["/blog/bingo-bango-bongo"],
    canonical: { kind: "existing", path: "/games/bingo-bango-bongo" },
    capabilityIds: ["game-library"],
    ctaIntent: "games",
    sources: [
      {
        title: "Golf Digest",
        url: "https://www.golfdigest.com/story/how-to-play-bingo-bango-bongo-golf-games-explained",
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
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogApp,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "best-score",
    slug: "best-score",
    term: "Best Score",
    aliases: [],
    primaryCategory: "formats",
    tags: [],
    priority: "mvp",
    shortDefinition:
      "A golf side game where players or teams compete for the best overall result for the round, net, gross or on Stableford points. Everyone plays for the same amount; the top finisher takes it, or the top two or three share it.",
    explanation:
      "It isn't best ball. Best ball, or Four-Ball, scores each hole: partners play their own balls and the side counts the better score. Best Score compares results for the whole round, whether they belong to players or to teams.",
    example:
      "Four players at $10 each, played net. The low net score, a 70, takes $10 from each of the other three and finishes $30 up. Split two ways, the top two each finish $10 up and the other two $10 down. Played as two teams of two, the team with the better total takes the $40, and each partner finishes $10 up.",
    // Owner's correction of 2026-10-31: Best Score isn't individual-only.
    // golo main 2237c1d src/engines/strokePurse.js: calculateStrokePurse
    // (each player's total: net, gross, or Stableford points),
    // calculateFixedTeamPurse (Team Play: each team's better net or gross on a
    // hole added up, or Stableford Best Of / Combined points) and
    // calculateScramblePurse (each scramble team's one score a hole).
    goloNote:
      "Depending on the round format, GoLo compares individual scores or team results under that round's scoring: each player's total without teams; in Team Play, the two teams' totals from each team's better score on each hole, or in Stableford its better player's points or both players' points added; in a scramble, each team's recorded score.",
    relatedTermIds: ["four-ball", "scramble", "skins"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/games/best-score" },
    capabilityIds: ["game-library", "team-play", "scramble", "round-formats"],
    ctaIntent: "games",
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/definitions",
        kind: "official-rules",
        ref: "Definitions: Four-Ball",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: [
      ...mvpReviewLogApp,
      {
        stage: "product",
        by: "agent",
        on: "2026-10-31",
        note: "Individual, Team Play and scramble Best Score checked against golo main 2237c1d (strokePurse.js).",
      },
      {
        stage: "approval",
        by: "owner",
        on: "2026-10-31",
        note: "Owner's written correction of 2026-10-31: describe both individual and team play.",
      },
    ],
    reviewedOn: "2026-10-31",
    publishedOn: "2026-10-29",
    updatedOn: "2026-10-31",
  },
  {
    id: "scramble",
    slug: "scramble",
    term: "Scramble",
    aliases: ["captain's choice"],
    primaryCategory: "formats",
    tags: ["team", "scramble"],
    priority: "mvp",
    shortDefinition:
      "A team format where everyone tees off, the team picks the best shot, and every player plays the next shot from there, until the ball is holed. Each team records one score per hole.",
    example:
      "Four players drive; the team takes the one in the middle of the fairway. All four hit approaches from that spot, the team picks the best again, and so on.",
    ruleNote: {
      kind: "handicapping",
      text: "A scramble team's handicap is usually a set percentage of each player's Course Handicap, and the percentages depend on the team's size.",
    },
    goloNote:
      "GoLo scores a scramble for up to 12 players in 2 to 6 teams, with team handicaps from the WHS percentages, played gross, or set by the organizer. It doesn't count Texas scramble drives and doesn't score a shamble.",
    relatedTermIds: ["four-ball", "foursomes"],
    relatedContentPaths: [],
    canonical: { kind: "existing", path: "/games/scramble" },
    capabilityIds: ["scramble"],
    ctaIntent: "games",
    sources: [
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm",
        kind: "handicapping",
        ref: "Appendix C",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/scramble",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf.com",
        url: "https://golf.com/news/game-set-and-match-six-fun-game-formats-for-your-weekend-round/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogApp,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "four-ball",
    slug: "four-ball",
    term: "Four-Ball",
    aliases: ["best ball", "better ball", "fourball"],
    primaryCategory: "formats",
    tags: ["team", "match-play", "stroke-play"],
    priority: "mvp",
    shortDefinition:
      "A partnership format where each player plays their own ball and the side counts the better of its two scores on each hole. It can be played as match play or stroke play.",
    explanation:
      "Usually called best ball, though golfers also use best ball loosely for other team games. In handicap play, a percentage allowance is common, so partners don't get their full strokes.",
    example:
      "On a par 4 you make a 5 and your partner makes a 4. Your side's score for the hole is 4.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define Four-Ball and cover it in Rule 23.",
    },
    relatedTermIds: ["best-score", "foursomes", "match-play", "scramble"],
    relatedContentPaths: ["/games/wolf"],
    canonical: { kind: "hub", anchor: "four-ball" },
    capabilityIds: [],
    ctaIntent: "games",
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/definitions",
        kind: "official-rules",
        ref: "Definitions: Four-Ball; Rule 23.2a",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm",
        kind: "handicapping",
        ref: "Appendix C",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-23",
        kind: "official-rules",
        ref: "Rule 23",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/best%20ball",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/four-ball",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "foursomes",
    slug: "foursomes",
    term: "Foursomes",
    aliases: ["alternate shot"],
    primaryCategory: "formats",
    tags: ["team"],
    priority: "mvp",
    shortDefinition:
      "A partnership format where two players play one ball, taking turns: one tees off on the odd-numbered holes, the other on the even, and they alternate strokes until the ball is holed.",
    explanation:
      "Also called alternate shot. It isn't the same as a foursome, which is just a group of four players. In greensomes and Chapman, both partners tee off before the alternating starts.",
    example:
      "You drive on the 1st, your partner plays the second shot and you play the third. On the 2nd your partner drives.",
    ruleNote: {
      kind: "rules",
      text: "The Rules of Golf define Foursomes and cover it in Rule 22.",
    },
    relatedTermIds: ["four-ball", "scramble", "match-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "foursomes" },
    capabilityIds: [],
    ctaIntent: "games",
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-22",
        kind: "official-rules",
        ref: "Definitions: Foursomes; Rule 22.3; Rule 22",
        accessedOn: "2026-10-29",
      },
      {
        title: "Rules of Handicapping, 2024 edition (USGA)",
        url: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm",
        kind: "handicapping",
        ref: "Appendix C",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/foursome",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "match-play",
    slug: "match-play",
    term: "Match Play",
    aliases: ["matchplay"],
    primaryCategory: "formats",
    tags: ["match-play"],
    priority: "mvp",
    shortDefinition:
      "A form of play where a player or side plays another hole by hole. The lower score wins the hole, and the match is won when one side is ahead by more holes than are left to play.",
    example:
      "A triple bogey loses you one hole, the same as losing it by one stroke. Three up with two to play, the match is over.",
    ruleNote: {
      kind: "rules",
      text: "Rule 3.2 of the Rules of Golf covers match play: how a hole and the match are won (3.2a) and conceding a stroke, a hole or the match (3.2b).",
    },
    relatedTermIds: ["nassau", "four-ball", "foursomes"],
    relatedContentPaths: ["/games/nassau"],
    canonical: { kind: "hub", anchor: "match-play" },
    capabilityIds: [],
    ctaIntent: "games",
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-3",
        kind: "official-rules",
        ref: "Definitions: Match Play; Rule 3.2a(1); Rule 3.2a(3); Rule 3.2b",
        accessedOn: "2026-10-29",
      },
      {
        title: "Merriam-Webster",
        url: "https://www.merriam-webster.com/dictionary/match%20play",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
  {
    id: "stableford",
    slug: "stableford",
    term: "Stableford",
    aliases: [],
    primaryCategory: "formats",
    tags: ["stroke-play"],
    priority: "mvp",
    shortDefinition:
      "A scoring format that awards points for each hole's score against par instead of counting strokes. In the standard version, a bogey earns 1, a par 2, a birdie 3 and an eagle 4. Most points wins.",
    example:
      "A par, a bogey and a double bogey on three holes is 2 + 1 + 0: three points. A blow-up hole costs zero points, never more.",
    ruleNote: {
      kind: "rules",
      text: "Rule 21.1 of the Rules of Golf sets out Stableford and its standard points.",
    },
    relatedTermIds: ["match-play"],
    relatedContentPaths: [],
    canonical: { kind: "hub", anchor: "stableford" },
    capabilityIds: [],
    ctaIntent: "games",
    sources: [
      {
        title: "Rules of Golf, 2023 edition (R&A)",
        url: "https://www.randa.org/en/rog/the-rules-of-golf/rule-21",
        kind: "official-rules",
        ref: "Definitions: Stableford; Rule 21.1b(1) table; Rule 21.1b, 21.1c",
        accessedOn: "2026-10-29",
      },
      {
        title: "Golf.com",
        url: "https://golf.com/news/game-set-and-match-six-fun-game-formats-for-your-weekend-round/",
        kind: "editorial",
        accessedOn: "2026-10-29",
      },
    ],
    status: "published",
    reviewedBy: "owner",
    reviewLog: mvpReviewLogNone,
    reviewedOn: MVP_REVIEWED_ON,
    publishedOn: "2026-10-29",
  },
];
