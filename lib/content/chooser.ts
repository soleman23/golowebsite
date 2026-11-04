/**
 * Copy for the side-game chooser (/games/chooser, soleman23/golowebsite#224).
 * The rules live in lib/chooser/engine.ts and the card assembly in
 * lib/chooser/view.ts; this file is only words, links and the conditions
 * they apply under.
 *
 * Two kinds of statement, kept apart on the page:
 * - Golf. What a format is, who it suits, what to agree first. House rules
 *   are labelled as the group's call; the formal statements (scramble team
 *   handicaps, presses not being a Rule) follow the guides' sources.
 * - GoLo. Every "In GoLo" line is a registry string from capabilities.ts,
 *   quoted by registryLine() or a summary, never written here. A registry
 *   change moves the chooser with it, and a missing line fails the build.
 *
 * Built on the server and passed to the client chooser as props, so the
 * registry itself isn't shipped to the browser.
 */

import { capability, type CapabilityId } from "./capabilities";
import type { ChooserCopy, FormatCopy, Line } from "@/lib/chooser/view";
import type { Answers, FormatId } from "@/lib/chooser/engine";
import type { FaqReadNext } from "./faq";

/** A registry limit, found by how it starts. Throws at build time if it has gone. */
function registryLine(id: CapabilityId, startsWith: string): string {
  const line = capability(id).limits?.find((l) => l.startsWith(startsWith));
  if (!line) throw new Error(`capabilities.ts ${id}: no limit starting "${startsWith}" (lib/content/chooser.ts)`);
  return line;
}

const summary = (id: CapabilityId) => capability(id).summary;

const SOLO_MAX = { players: { max: 4 } } as const;
const SOLO_OVER = { players: { min: 5 } } as const;

const GOLO_YES = "Scored in GoLo";
const GOLO_NO = "Not scored in GoLo";
const GOLO_NOT_ONE_GAME = "Not as one game in GoLo";

/** Lines several formats share, by the handicap answer. */
const netOrGross: readonly Line[] = [
  {
    text: "Net or gross. Gross works when everyone is within a couple of shots; otherwise play net.",
    when: { handicaps: ["close"] },
  },
  {
    text: "Play it net, so handicap strokes are part of the score.",
    href: "/blog/net-vs-gross-scoring",
    linkLabel: "Net vs. gross",
    when: { handicaps: ["apart"] },
  },
  {
    text: "A number for anyone without a handicap, agreed before the round, not after the front nine.",
    href: "/blog/no-handicap-fair-game",
    linkLabel: "How to agree one",
    when: { handicaps: ["none"] },
  },
  {
    text: "Net or gross, settled before anyone tees off.",
    href: "/blog/net-vs-gross-scoring",
    linkLabel: "Net vs. gross",
    when: { handicaps: ["unanswered"] },
  },
];

/** GoLo lines for a game that uses handicap strokes, by the answers. */
const goloStrokes: readonly Line[] = [
  { text: summary("guests"), when: { handicaps: ["none"] } },
  { text: summary("nine-hole-rounds"), when: { holes: ["9"] } },
];

const twoToFour = registryLine("game-library", "Without teams, a round takes two to four players");

const bestScore: FormatCopy = {
  name: "Best Score",
  summary: [{ text: "Everyone puts in the same amount, and the best total takes it." }],
  fit: [{ text: "Each player for their own total, at any size from two to twelve." }],
  guide: { href: "/games/best-score", label: "Best Score guide" },
  more: { href: "/blog/side-games-for-beginners", label: "Starting with one game" },
  tradeoff: [{ text: "Nothing resets: one bad hole stays in the total all round." }],
  agree: [
    ...netOrGross,
    { text: "How many places get paid: one, or the top two or three." },
    { text: "What a tied total does." },
  ],
  reasons: {
    simplest: [{ text: "The easiest game to explain: one amount each, one total, nothing to track hole by hole." }],
  },
  ruledOut: {
    players: "Takes 2 to 12 players.",
    partners: "Each player plays for their own total.",
    scoring: "",
  },
  golo: {
    verdicts: [
      { scored: true, label: GOLO_YES, when: SOLO_MAX },
      { scored: false, label: GOLO_NOT_ONE_GAME, when: SOLO_OVER },
    ],
    lines: [
      { text: summary("game-library"), when: SOLO_MAX },
      { text: twoToFour, when: SOLO_OVER },
      ...goloStrokes,
    ],
  },
};

const skins: FormatCopy = {
  name: "Skins",
  summary: [{ text: "Each hole is its own prize, won by the low score alone. With carryovers on, a tie sends it to the next hole." }],
  fit: [{ text: "Each player on their own, two to six players, and a bad hole costs only that hole." }],
  guide: { href: "/games/skins", label: "Skins guide" },
  more: { href: "/blog/skins-carryover", label: "How carryovers add up" },
  tradeoff: [{ text: "Steady golf can win nothing: a skin needs the low score on its own." }],
  agree: [
    ...netOrGross,
    {
      text: "Carryovers on or off, and what happens to a carry still alive after the 18th.",
      when: { holes: ["18"] },
    },
    {
      text: "Carryovers on or off, and what happens to a carry still alive after the 9th. Over nine holes a carry has fewer holes to be won on.",
      when: { holes: ["9"] },
    },
    { text: "Extra skins for birdies or greenies, or none." },
  ],
  reasons: {},
  ruledOut: {
    players: "Takes 2 to 6 players.",
    partners: "Each player plays for their own skins.",
    scoring: "",
  },
  golo: {
    verdicts: [
      { scored: true, label: GOLO_YES, when: SOLO_MAX },
      { scored: false, label: GOLO_NOT_ONE_GAME, when: SOLO_OVER },
    ],
    lines: [{ text: summary("live-skins"), when: SOLO_MAX }, { text: twoToFour, when: SOLO_OVER }, ...goloStrokes],
  },
};

const nassau: FormatCopy = {
  name: "Nassau",
  summary: [
    { text: "Over nine holes it’s one match, won by whoever wins more holes.", when: { holes: ["9"], players: { max: 2 } } },
    { text: "Over nine holes it’s one match per pair: every player plays each of the others once.", when: { holes: ["9"] } },
    { text: "Three matches against one opponent: the front nine, the back nine and the 18.", when: { players: { max: 2 } } },
    { text: "Head to head, every pair plays its own three matches: front nine, back nine and the 18." },
  ],
  fit: [
    { text: "Two players: one opponent all round.", when: { players: { max: 2 } } },
    { text: "Head to head among three or four: every pair has its own match.", when: { players: { min: 3 } } },
  ],
  guide: { href: "/games/nassau", label: "Nassau guide" },
  more: { href: "/blog/nassau", label: "Presses and house rules" },
  tradeoff: [
    { text: "Nine holes leave less time to come back from a bad start.", when: { holes: ["9"], players: { max: 2 } } },
    { text: "Three or six pairings at once, with nine holes to come back in.", when: { holes: ["9"] } },
    { text: "Three results to follow, and the back nine starts level whatever happened on the front.", when: { players: { max: 2 } } },
    { text: "Three players make three pairings and four make six, each with its own matches: more to follow than one total." },
  ],
  agree: [
    ...netOrGross,
    {
      text: "Presses: whether a side that’s 2 down can start a new match, and how many. A custom, not a Rule of Golf.",
      href: "/blog/pressing",
      linkLabel: "On pressing",
    },
    { text: "What a tied match does: it pushes, and nothing changes hands.", href: "/glossary#push", linkLabel: "Push" },
  ],
  reasons: {},
  ruledOut: {
    players: "Head to head it takes 2 to 4 players. Bigger groups play it between teams.",
    partners: "Played head to head, each player against each other player.",
    scoring: "With three or four players, every pair has its own Nassau: three or six pairings at once.",
  },
  golo: {
    verdicts: [{ scored: true, label: GOLO_YES }],
    lines: [
      {
        text: registryLine("game-library", "Without teams, Nassau and the Overall Match are played head to head"),
        when: { players: { min: 3 } },
      },
      { text: registryLine("overall-match-presses", "Nassau doesn") },
      { text: registryLine("nine-hole-rounds", "Over nine holes a Nassau is one match"), when: { holes: ["9"] } },
      { text: summary("guests"), when: { handicaps: ["none"] } },
    ],
  },
};

const bestBall: FormatCopy = {
  name: "Best ball, two against two",
  summary: [{ text: "Two fixed pairs. Everyone plays their own ball, and each side counts its better score on the hole." }],
  fit: [{ text: "Exactly four players, in two sides of two." }],
  guide: { href: "/blog/best-ball-vs-scramble", label: "Best ball vs. scramble" },
  more: { href: "/glossary#four-ball", label: "Four-ball, defined" },
  tradeoff: [{ text: "Partners are fixed for the round, so how the sides are picked matters." }],
  agree: [
    ...netOrGross,
    { text: "Who partners whom, and how the sides are picked." },
    { text: "Which games run between the two sides: a Nassau, skins or Best Score." },
  ],
  reasons: {},
  ruledOut: {
    players: "Takes exactly four players: two sides of two.",
    partners: "A team game: two sides of two.",
    scoring: "",
  },
  golo: {
    verdicts: [{ scored: true, label: GOLO_YES }],
    lines: [
      { text: summary("team-play") },
      { text: registryLine("handicap-strokes", "Everyone gets their full course handicap") },
      ...goloStrokes,
    ],
  },
};

const scramble: FormatCopy = {
  name: "Scramble",
  summary: [{ text: "Teams play one ball: everyone hits, the team picks the best shot, and all play the next one from there." }],
  fit: [{ text: "Two to six teams of up to four, so any group from four to twelve fits." }],
  guide: { href: "/games/scramble", label: "Scramble guide" },
  more: { href: "/blog/best-ball-vs-scramble", label: "Best ball vs. scramble" },
  tradeoff: [{ text: "One score a team, so nobody’s own round counts on its own." }],
  agree: [
    { text: "How the teams are drawn." },
    {
      text: "Team handicaps: the WHS percentages (35% and 15% for two players), gross, or numbers the organizer sets.",
      href: "/games/scramble",
      linkLabel: "The percentages",
    },
    { text: "Any drive rule, such as a minimum number of drives from each player." },
    { text: "Equal teams can’t be made from this many players, so agree how the bigger team is balanced.", when: { unevenTeams: true } },
  ],
  reasons: {
    "set-numbers": [
      {
        text: "A team handicap can be a number the organizer sets, so a player without one still plays.",
        when: { handicaps: ["none"] },
      },
      {
        text: "One ball a team, so a 25-handicap and a 5 can play together and both count.",
        when: { handicaps: ["apart"] },
      },
    ],
  },
  ruledOut: {
    players: "Needs at least four players, for two teams of two.",
    partners: "A team game: one ball a team.",
    scoring: "",
  },
  golo: {
    verdicts: [{ scored: true, label: GOLO_YES }],
    lines: [
      { text: summary("scramble") },
      { text: registryLine("scramble", "Team handicaps follow the WHS percentages") },
      { text: registryLine("scramble", "Teams of different sizes"), when: { unevenTeams: true } },
      { text: registryLine("scramble", "No Texas scramble drive count") },
      { text: summary("nine-hole-rounds"), when: { holes: ["9"] } },
    ],
  },
};

const bingoBangoBongo: FormatCopy = {
  name: "Bingo Bango Bongo",
  summary: [{ text: "Three points a hole: first on the green, closest once everyone is on, first in the hole." }],
  fit: [{ text: "Two to four players, each for their own points." }],
  guide: { href: "/games/bingo-bango-bongo", label: "Bingo Bango Bongo guide" },
  more: { href: "/blog/bingo-bango-bongo", label: "Why it suits mixed handicaps" },
  tradeoff: [{ text: "It needs a strict order of play, and someone watching who was on first." }],
  agree: [
    { text: "Strict order of play: the ball farthest from the hole goes first." },
    { text: "What happens when nobody can tell who was on first." },
    { text: "What a point is worth." },
  ],
  reasons: {
    "no-strokes": [
      {
        text: "No handicaps needed: the points reward order of play more than length.",
        when: { handicaps: ["none"] },
      },
      {
        text: "Uses no handicap strokes: the point order gives higher handicaps a real chance at points.",
        when: { handicaps: ["apart"] },
      },
    ],
  },
  ruledOut: {
    players: "Takes 2 to 4 players. With more, every point waits for every ball.",
    partners: "Each player plays for their own points.",
    scoring: "Three points to follow on every hole, in a strict order of play.",
  },
  golo: {
    verdicts: [{ scored: true, label: GOLO_YES }],
    lines: [{ text: registryLine("game-library", "Each Bingo Bango Bongo point has one winner") }],
  },
};

const wolf: FormatCopy = {
  name: "Wolf",
  summary: [{ text: "A new Wolf each hole picks a partner after watching the drives, or goes alone for double." }],
  fit: [{ text: "Partners change every hole, so nobody is stuck with one all round." }],
  guide: { href: "/games/wolf", label: "Wolf guide" },
  more: { href: "/blog/wolf", label: "Wolf for foursomes" },
  tradeoff: [{ text: "A decision on every tee, and points to follow for all four players." }],
  agree: [
    ...netOrGross,
    { text: "Who is Wolf on the 17th and 18th: 18 holes don’t share out evenly among four.", when: { holes: ["18"] } },
    { text: "Who is Wolf on the 9th: nine holes don’t share out evenly among four.", when: { holes: ["9"] } },
    { text: "What going alone is worth." },
  ],
  reasons: {
    "made-for": [{ text: "Made for exactly four players." }],
  },
  ruledOut: {
    players: "Takes exactly four players.",
    partners: "Partners change every hole, so nobody plays on their own.",
    scoring: "A partner decision on every tee, and points to follow for all four.",
  },
  golo: {
    verdicts: [{ scored: true, label: GOLO_YES }],
    lines: [{ text: registryLine("game-library", "Wolf takes exactly four players") }, ...goloStrokes],
  },
};

const nines: FormatCopy = {
  name: "Nines (5-3-1)",
  summary: [{ text: "Nine points a hole: five to the low score, three to the middle, one to the high." }],
  fit: [{ text: "Each player for their own points, with no partners to sort out." }],
  guide: { href: "/blog/golf-games-for-3-players#not-in-golo", label: "Nines, explained" },
  more: { href: "/blog/golf-games-for-3-players", label: "Games for three" },
  tradeoff: [{ text: "Tied holes split the points, so someone keeps a running count." }],
  agree: [
    ...netOrGross,
    { text: "What a point is worth." },
    { text: "How ties split: two tied for low take four each and the third gets one." },
  ],
  reasons: {
    "made-for": [{ text: "Made for exactly three players." }],
  },
  ruledOut: {
    players: "Takes exactly three players.",
    partners: "Each player plays for their own points.",
    scoring: "Points split on every tied hole, so it needs a running count.",
  },
  golo: {
    verdicts: [{ scored: false, label: GOLO_NO }],
    lines: [
      {
        text: `Not one of GoLo’s games, which are ${capability("game-library").label}, and ${capability("closest-to-pin").label}. Keep Nines on paper, or score another game beside it in GoLo.`,
      },
    ],
  },
};

export const chooserCopy: ChooserCopy = {
  formats: {
    "best-score": bestScore,
    skins,
    nassau,
    "best-ball": bestBall,
    scramble,
    "bingo-bango-bongo": bingoBangoBongo,
    wolf,
    nines,
  },
  empty: {
    teamsTooFew: "Team games need at least four players, and Wolf needs exactly four. With fewer, every game is each player on their own.",
    general: "Nothing fits all of those answers together.",
  },
  relaxations: {
    partners: {
      solo: "Show games where each player is on their own",
      teams: "Show team games",
    },
    scoring: { more: "Show games with more to follow" },
  },
};

/* --------------------------------------------------------------- the form */

export type ChooserOption<T extends string> = { value: T; label: string };

export const chooserQuestions = {
  players: {
    legend: "How many are playing?",
    hint: "More than 12? Split into groups and choose for each.",
  },
  partners: {
    legend: "Partners?",
    options: [
      { value: "solo", label: "Each on our own" },
      { value: "teams", label: "Partners or teams" },
      { value: "either", label: "Either" },
    ],
  },
  handicaps: {
    legend: "How close are the handicaps?",
    hint: "Course handicaps, or a fair idea of who shoots what.",
    options: [
      { value: "close", label: "Within a couple of shots" },
      { value: "apart", label: "Further apart" },
      { value: "none", label: "Someone doesn’t have one" },
    ],
  },
  scoring: {
    legend: "How much do you want to keep track of?",
    options: [
      { value: "simple", label: "Keep it simple" },
      { value: "more", label: "Happy to follow more" },
    ],
  },
  holes: {
    legend: "How many holes?",
    options: [
      { value: "18", label: "18" },
      { value: "9", label: "9" },
    ],
  },
} as const;

/** The short names used when a shared link's answer couldn't be read. */
export const chooserQuestionNames: Record<keyof Answers, string> = {
  players: "the player count",
  partners: "partners",
  handicaps: "handicaps",
  scoring: "how much to track",
  holes: "holes",
};

export const chooserUi = {
  formTitle: "Your group",
  resultsTitle: "What to play",
  needsPlayers: "Pick how many are playing to see what fits. The other questions narrow it down; skip any you don’t care about.",
  fitsOne: "1 game fits these answers.",
  fitsMany: "{n} games fit these answers.",
  showingTop: "The first three, in order:",
  inOrder: "In order:",
  alsoFits: "Also fits:",
  ruledOut: "Ruled out, and why",
  emptyTitle: "Nothing fits yet",
  emptyHelp: "Change one answer:",
  why: "Why it fits",
  tradeoff: "Trade-off",
  agree: "Agree before the first tee",
  agreeNote: "House rules: your group’s call, not the Rules of Golf.",
  golo: "In GoLo",
  copy: "Copy link to these answers",
  copied: "Link copied",
  copyFailed: "Couldn’t copy. Here’s the link to copy yourself:",
  reset: "Start over",
  resetDone: "Answers cleared.",
  /** {questions} is a list of chooserQuestionNames. */
  droppedOne: "Part of that link couldn’t be read, so {questions} was left blank.",
  droppedMany: "Part of that link couldn’t be read, so {questions} were left blank.",
  /** Joins the last two items of a list: "Scramble, Best Score and Skins". */
  listAnd: "and",
  noscript: "The chooser needs JavaScript. Every format’s player count, partners and handicap rules are in the table below.",
  rankLabel: "Pick {n}",
};

/* --------------------------------------------------------------- the page */

export const chooserMeta = {
  title: "Golf Side-Game Chooser: What Should We Play Today?",
  description:
    "Five questions about your group: players, partners, handicaps, how much to track, 9 or 18 holes. Get the golf games that fit and the house rules to agree first.",
};

export const chooserHero = {
  kicker: "SIDE-GAME CHOOSER",
  title: "What should we play today?",
  lead: "Five questions about the group on the tee. You get up to three games that fit, why, and what to agree before anyone hits. The golf advice stands on its own; the In GoLo line on each card says what the app scores today.",
  crumb: "Side-game chooser",
};

export const chooserHow = {
  title: "How the chooser decides",
  lead: "Fixed rules, the same every time. Nothing is scored or weighted: a format fits the group or it doesn’t, and the ones that fit come out in an order these rules set.",
  rules: [
    {
      title: "Size and partners rule a game in or out",
      body: "Each format has a player range: Wolf and best ball need exactly four, Nines exactly three, a scramble at least four, Skins up to six, a head-to-head Nassau and Bingo Bango Bongo up to four. Asking for partners leaves the team games and Wolf; asking to play on your own leaves the rest.",
    },
    {
      title: "“Keep it simple” rules out the busy ones",
      body: "Wolf, Bingo Bango Bongo and Nines drop out, and so does a Nassau among three or four players, where every pair has its own three matches.",
    },
    {
      title: "Handicaps change the order, never the list",
      body: "If someone has no handicap, Bingo Bango Bongo comes first (it uses no strokes), then a scramble (the organizer can set team numbers). If the handicaps are far apart, both come first, and every other game’s card says to play it net.",
    },
    {
      title: "Then simplicity, then group size, then a fixed order",
      body: "“Keep it simple” puts Best Score first. A format made for exactly your number comes next: Nines for three, Wolf for four. Anything still level keeps a fixed order: Best Score, Skins, Nassau, best ball, scramble, Bingo Bango Bongo, Wolf, Nines.",
    },
    {
      title: "Nine holes changes the notes",
      body: "Over nine holes a Nassau is one match, a skins carry ends on the 9th, and Wolf needs a rule for the 9th tee. Each card says what to agree.",
    },
  ],
};

export const chooserTable = {
  title: "Every format at a glance",
  lead: "The rules the chooser applies, one row per format. GoLo’s column follows the app’s capability list, and a test checks the two agree.",
  head: ["Format", "Players", "Partners", "Simple?", "Handicap strokes", "In GoLo"],
};

/** Per-format cells for the table, in FORMAT_RULES order. Players come from the rules. */
export const chooserTableCells: Record<FormatId, { partners: string; simple: string; strokes: string; golo: string }> = {
  "best-score": { partners: "On your own", simple: "Yes", strokes: "Net or gross", golo: "Yes, 2–4 players" },
  skins: { partners: "On your own", simple: "Yes", strokes: "Net or gross", golo: "Yes, 2–4 players" },
  nassau: { partners: "Head to head", simple: "With two players", strokes: "Net or gross", golo: "Yes, 2–4 players; no presses" },
  "best-ball": { partners: "Two sides of two", simple: "Yes", strokes: "Net or gross", golo: "Yes, as Team Play" },
  scramble: { partners: "Teams, one ball", simple: "Yes", strokes: "Team handicap", golo: "Yes, up to 12 players" },
  "bingo-bango-bongo": { partners: "On your own", simple: "No", strokes: "None", golo: "Yes, 2–4 players" },
  wolf: { partners: "Changes every hole", simple: "No", strokes: "Net or gross", golo: "Yes, exactly 4" },
  nines: { partners: "On your own", simple: "No", strokes: "Net or gross", golo: "No" },
};

/**
 * The worked example. The page runs these answers through the engine at
 * build time and renders whatever it returns; test-chooser checks that the
 * result is still `expected`, so the prose below can't fall out of step.
 */
export const chooserExample = {
  title: "One foursome, worked through",
  answers: { players: 4, partners: "either", handicaps: "apart", scoring: "simple", holes: "18" } as Answers,
  expected: ["scramble", "best-score", "skins"] as FormatId[],
  intro:
    "Four players with course handicaps of 6, 12, 18 and 24, 18 holes, nobody fussed about partners, and two of them would rather not count anything complicated. The answers: 4 players, either, further apart, keep it simple, 18 holes.",
  steps: [
    "Size and partners rule out Nines, which needs three. “Keep it simple” rules out Wolf, Bingo Bango Bongo and the head-to-head Nassau, which among four players means six pairings.",
    "That leaves Best Score, Skins, best ball and a scramble. Far-apart handicaps put the scramble first: one ball a team, so the 6 and the 24 can play together and both count.",
    "Best Score comes next as the simplest game to explain, played net. Skins and best ball keep the fixed order, so Skins is third and best ball is listed as also fitting.",
  ],
  math: "Drawn as 6 and 24 against 12 and 18, the WHS two-player scramble percentages, 35% of the lower course handicap and 15% of the higher, give 0.35 × 6 + 0.15 × 24 = 5.7, which plays as 6, and 0.35 × 12 + 0.15 × 18 = 6.9, which plays as 7. The second team gets one stroke more for the round.",
  sourcePrefix: "Source:",
  source: {
    label: "USGA Rules of Handicapping, Appendix C",
    href: "https://www.usga.org/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm",
  },
  open: "Open this example in the chooser",
};

export const chooserSideGames = {
  title: "Side games that sit on top",
  lead: "These run beside any of the games above, on the holes they name. With new players, leave them off until everyone can explain the main game.",
  items: [
    { href: "/games/closest-to-pin", label: "Closest to Pin", body: "The par 3s: closest tee shot wins, with or without par to win." },
    { href: "/games/longest-drive", label: "Longest Drive", body: "One marked hole, longest ball in the fairway." },
    { href: "/games/birdies", label: "Birdies", body: "A set amount for every birdie, owed by everyone who didn’t make one." },
  ],
};

export const chooserKeepReading: { title: string; items: FaqReadNext[] } = {
  title: "KEEP READING",
  items: [
    {
      href: "/blog/first-tee-checklist",
      label: "The first-tee checklist",
      blurb: "Amounts, handicaps, presses, ties and how the round ends: everything worth saying before the first shot.",
      cta: "Read the checklist",
    },
    {
      href: "/blog/side-games-for-beginners",
      label: "Side games for beginners",
      blurb: "Why a new player’s first game should be one game, and which one.",
      cta: "Read the post",
    },
    {
      href: "/games",
      label: "Every game guide",
      blurb: "Rules, scoring, a worked example and the house rules for each format GoLo scores.",
      cta: "Browse the guides",
    },
  ],
};

export const chooserFinalCta = {
  title: "Pick the game. GoLo keeps the card.",
  lead: "Set up the game you chose before the first tee. GoLo keeps score hole by hole and nets every game into one number per player.",
};

/** The /games hub's pointer to the chooser. */
export const chooserTeaser = {
  title: "Not sure which to play?",
  body: "Five questions about your group, and the games that fit it, with the house rules to agree first.",
  cta: "Open the side-game chooser",
  href: "/games/chooser",
};
