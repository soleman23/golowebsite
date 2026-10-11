/**
 * /how-it-works — one Saturday foursome, parking lot to settled up.
 *
 * The round is real: it was played through GoLo 0.6.2's own UI (the offline
 * build, no account), Tetherow from the Tan tees, and every number below is
 * what the app showed — course handicaps, stroke holes, Nassau and skins
 * results, the settle-up. The six phone screens in
 * public/images/how-it-works/ are that round. Change the story and those
 * screens have to be shot again, or the phone and the copy beside it will
 * disagree.
 *
 * What the app does that the example leans on, as of 0.6.2: every player
 * gets their full course handicap (no playing off the low man), one set of
 * tees for the group, Net or Gross and no percentage allowance, fixed 2v2
 * teams playing best ball, and team skins when teams are on. Presses exist
 * only on the Overall Match game, so this round has none.
 */

import type { GameSlug } from "./games";

export const hiwHero = {
  kicker: "HOW IT WORKS",
  title: "One round, from the parking lot to settled up.",
  lead: "Follow a Saturday foursome through eighteen holes. You'll see exactly where GoLo does the work — setup, strokes, scores, the side bets, and the one number everyone wants at the end.",
  walkLabel: "Walk the round",
  watchLabel: "Watch it in 90 seconds",
} as const;

export const hiwRoundHeader = {
  kicker: "THE ROUND, IN ORDER",
  title: "Six moments. One phone. Zero arithmetic.",
  lead: "Mike, Jess, Sarah and Tom at Tetherow. Team Nassau at $5 a man, $2 skins, $2 closest to the pin on the par 3s. Tom's a guest. Here's their round, on the app's real screens.",
} as const;

export type RoundStep = {
  /** Fragment id — the hero chips and progress ticks link to #step-0N. */
  id: string;
  n: string;
  short: string;
  place: string;
  time: string;
  title: string;
  body: string;
  bullets: string[];
  link?: { label: string; href: string };
  /** A 1170×2532 screenshot of this moment, served through next/image. */
  screen: string;
};

export const roundSteps: RoundStep[] = [
  {
    id: "step-01",
    n: "01",
    short: "Parking lot",
    place: "THE PARKING LOT",
    time: "7:48 AM",
    title: "Set the round before anyone's done stretching.",
    body: "Course, tees, players, teams, games, stakes. A couple of minutes on one phone, and it's the last time anyone thinks about setup. Save your regulars as a group and next week they're in, teams and all, with one tap.",
    bullets: [
      "Guests go in with a name and a handicap, no account",
      "Fixed partners for the team games: Mike & Tom against Jess & Sarah",
      "Stack Nassau, skins and closest-to-pin on one card",
    ],
    screen: "/images/how-it-works/step-01.webp",
  },
  {
    id: "step-02",
    n: "02",
    short: "First tee",
    place: "THE FIRST TEE",
    time: "8:10 AM",
    title: "Strokes get handed out — correctly.",
    body: "Each index becomes a course handicap for the tees the group is playing, and GoLo drops the strokes on the right holes by stroke index. Tom's 26 is a stroke on every hole and a second on the eight hardest. Nobody argues about who gets one on 7.",
    bullets: [
      "Net or gross — your group picks at setup",
      "No GHIN? Use the number your group agreed on",
      "Stroke dots show on the card, hole by hole",
    ],
    link: { label: "How strokes work ↓", href: "#strokes" },
    screen: "/images/how-it-works/step-02.webp",
  },
  {
    id: "step-03",
    n: "03",
    short: "Front nine",
    place: "HOLES 1–9",
    time: "8:42 AM",
    title: "Tap a number. Walk to the next tee.",
    body: "One phone scores the group. Enter gross scores and GoLo applies the strokes, takes each team's better ball and decides the skin before the flag's back in. On the 3rd it's net 3 against net 3, so the skin rides to the 4th.",
    bullets: [
      "Gross and net on every player's line",
      "Skins carry automatically on tied holes",
      "Closest to the pin flagged with one tap",
    ],
    screen: "/images/how-it-works/step-03.webp",
  },
  {
    id: "step-04",
    n: "04",
    short: "The turn",
    place: "THE TURN",
    time: "10:21 AM",
    title: "Front nine's in the books. Two down with nine to play.",
    body: "Jess & Sarah closed out the front 3&2, and that bet settled itself at $5 a man. The back nine and the 18 keep running on their own, so Mike & Tom tee off on 10 knowing exactly what they need.",
    bullets: [
      "Front, back and the 18 tracked as three bets",
      "Live standings for every game on the card",
      "Presses run on the Overall Match game, not the Nassau — yet",
    ],
    screen: "/images/how-it-works/step-04.webp",
  },
  {
    id: "step-05",
    n: "05",
    short: "18th green",
    place: "THE 18TH GREEN",
    time: "12:36 PM",
    title: "Last putt drops. The math is already done.",
    body: "Mike & Tom won five holes on the back to take it 4&2 and the 18 3&1. Every bet closed the second the final score went in. No calculator, no recount, no “wait, who had the seventh?”",
    bullets: [
      "Every bet closed out hole by hole",
      "Full hole-by-hole history if anyone asks",
      "Round saved to your history",
    ],
    screen: "/images/how-it-works/step-05.webp",
  },
  {
    id: "step-06",
    n: "06",
    short: "Settle up",
    place: "BACK AT THE CARS",
    time: "12:41 PM",
    title: "One number per player. Then who pays who.",
    body: "GoLo nets every bet against every other and boils it down to a short list of payments — two, this time. Then you settle the way your group already does. The money never touches GoLo.",
    bullets: [
      "Netted across every game on the card",
      "A couple of payments, not a pile of IOUs",
      "Cash, Venmo, Zelle — outside the app",
    ],
    link: { label: "See the math on this round ↓", href: "#math" },
    screen: "/images/how-it-works/step-06.webp",
  },
];

/** Avatar colour per player, as the app colours them; maps to --avatar-*. */
export type PlayerColor = "teal" | "purple" | "blue" | "orange";

export type HiwPlayerName = "Mike" | "Jess" | "Sarah" | "Tom";

export const hiwPlayerColor: Record<HiwPlayerName, PlayerColor> = {
  Mike: "teal",
  Jess: "blue",
  Sarah: "orange",
  Tom: "purple",
};

export const strokeExample = {
  kicker: "HANDICAPS, WITHOUT THE ARGUMENT",
  title: "Everyone gets their full handicap.",
  lead: "Each index becomes a course handicap for the tees the group is playing. That's how many strokes the player gets: one a hole on the hardest holes first, and once a handicap passes 18, a second on the hardest holes again.",
  formulaLabel: "THE FORMULA",
  formula: "Index × (Slope ÷ 113) + (Rating − Par)",
  course: "Tetherow · Tan tees · 71.4 / 139 · Par 72",
  players: [
    { name: "Mike", index: "8.2", course: 9 },
    { name: "Jess", index: "11.0", course: 13 },
    { name: "Sarah", index: "14.0", course: 17 },
    { name: "Tom", index: "22.0", course: 26, guest: true },
  ] as {
    name: HiwPlayerName;
    index: string;
    /** Course handicap, which is also the strokes the player gets. */
    course: number;
    guest?: boolean;
  }[],
  allowances: ["Net", "Gross"],
  allowanceNote: "Your group picks at setup. Gross means nobody gets strokes.",
  pickerLabel: "WHERE THE STROKES LAND",
  /** Tetherow's stroke index by hole, 1 → 18. */
  strokeIndex: [11, 17, 15, 1, 9, 7, 13, 3, 5, 18, 6, 10, 8, 12, 2, 4, 14, 16],
  pickerDefault: "Sarah" as HiwPlayerName,
  notes: {
    Mike: "Mike gets 9 strokes — one on each of the nine hardest holes: 4, 5, 6, 8, 9, 11, 13, 15 and 16.",
    Jess: "Jess gets 13 — the same nine holes as Mike, plus the 1st, 7th, 12th and 14th.",
    Sarah:
      "Sarah gets 17, a stroke on every hole but the 10th, the easiest on the card. Her 4 on the 3rd counts as a 3.",
    Tom: "Tom gets 26 — one on every hole, and a second on the eight hardest: 4, 6, 8, 9, 11, 13, 15 and 16. Guest or not, the math is the same.",
  } as Record<HiwPlayerName, string>,
  footnote:
    "SI = stroke index, the course's ranking of hole difficulty (1 is hardest). Strokes go to the lowest numbers first; past 18 they start again at SI 1.",
} as const;

export type BetRow = {
  name: HiwPlayerName;
  /** The line under the name. */
  note: string;
  nassau: string;
  skins: string;
  ctp: string;
  net: string;
};

/**
 * The round's settle-up, as the app showed it. Signed dollar strings carry a
 * real minus sign (−), never a hyphen; "$0" is neither won nor lost.
 */
export const betExample = {
  kicker: "HOW THE MATH LANDS",
  title: "Three games, four players, two payments.",
  lead: "Same foursome, same round. Team Nassau — Mike & Tom against Jess & Sarah — at $5 a man, $2 team skins with carryovers, and $2 closest to the pin on Tetherow's four par 3s. Here's what GoLo shows at the end.",
  results: [
    { label: "Front · Jess & Sarah 3&2" },
    { label: "Back · Mike & Tom 4&2" },
    { label: "18 · Mike & Tom 3&1" },
    { label: "6th · 5 skins carried in", highlight: true },
    { label: "Skins · 10 to 7" },
  ] as { label: string; highlight?: boolean }[],
  rows: [
    { name: "Tom", note: "2 closest", nassau: "+$5", skins: "+$6", ctp: "+$8", net: "+$19" },
    { name: "Mike", note: "1 closest", nassau: "+$5", skins: "+$6", ctp: "$0", net: "+$11" },
    { name: "Jess", note: "1 closest", nassau: "−$5", skins: "−$6", ctp: "$0", net: "−$11" },
    { name: "Sarah", note: "0 closest", nassau: "−$5", skins: "−$6", ctp: "−$8", net: "−$19" },
  ] as BetRow[],
  noteNassau:
    "Jess & Sarah took the front; Mike & Tom took the back and the 18. Two out of three is +$5 a man.",
  noteSkins:
    "team skins, best ball net. Four tied holes rode into a 5-skin 6th for Jess & Sarah; Mike & Tom took the 9th and five holes on the back. Ten skins to seven at $2 is $6 a man.",
  noteCtp:
    "the winner of each par 3 collects $2 from each of the other three. Tom won two, Mike and Jess one each.",
  settleKicker: "SETTLE UP",
  settleCount: 2,
  settleCaption: "payments, before anyone leaves the lot.",
  payments: [
    { from: "Sarah", to: "Tom", amount: "$19" },
    { from: "Jess", to: "Mike", amount: "$11" },
  ] as { from: HiwPlayerName; to: HiwPlayerName; amount: string }[],
  settleBody:
    "Every bet netted against every other. Tom, the guest without the app, goes home $19 up, and Sarah pays him once instead of settling three games one by one.",
  settleFooter: "Cash, Venmo, Zelle — your call. Nothing runs through GoLo.",
} as const;

export const guestsSection = {
  kicker: "GUESTS WELCOME",
  title: "Tom doesn't have the app. Tom doesn't need it.",
  lead: "Add a guest with a name and a handicap. That's it — no download, no sign-up, no email. They get the same strokes, the same bets and the same line on the settle-up screen as everyone else.",
  points: [
    {
      lead: "One phone scores the group",
      rest: "the scorekeeper enters everyone's number.",
    },
    {
      lead: "Mix members and guests",
      rest: "in the same match, even on the same team.",
    },
    {
      lead: "Liked it?",
      rest: "They can grab the app later and start their own locker.",
    },
  ],
} as const;

/** The GuestCard mockup's roster — the same foursome, Tom as the guest. */
export const guestCardPlayers: {
  name: HiwPlayerName;
  index: string;
  you?: boolean;
  guest?: boolean;
}[] = [
  { name: "Mike", index: "8.2", you: true },
  { name: "Jess", index: "11.0" },
  { name: "Sarah", index: "14.0" },
  { name: "Tom", index: "22.0", guest: true },
];

export const doesntDo = {
  kicker: "WHAT GOLO DOESN'T DO",
  title: "A scorekeeper. Not a bookie.",
  items: [
    {
      title: "Hold or move money",
      body: "GoLo tracks who owes who. You pay each other however your group already does. We never see a payment.",
    },
    {
      title: "Play the house",
      body: "No odds, no lines, no rake. Just friendly wagers between the people in your group, at stakes you agreed on.",
    },
    {
      title: "Make everyone download it",
      body: "One phone scores the round. Anyone with the app can follow along live; all four entering their own scores isn't built yet.",
    },
    {
      title: "Require an official handicap",
      body: "No GHIN needed. Use a real index, the number your group settled on years ago, or play straight up.",
    },
  ],
} as const;

/**
 * Shown only while siteConfig.showHowItWorksVideo is on. The files live in
 * public/videos/; the recording is the same round as the timeline.
 */
export const hiwVideo = {
  kicker: "WATCH IT",
  title: "A full round in ninety seconds.",
  lead: "Setup, scoring, the turn and the settle-up — the same round as above, on the app's real screens, with the middle holes cut for time.",
  src: "/videos/how-it-works.mp4",
  poster: "/videos/how-it-works-poster.webp",
  captions: "/videos/how-it-works.en.vtt",
} as const;

export const gameGuidesSection = {
  kicker: "PICK YOUR GAMES",
  title: "Every format, scored the same way.",
  allLabel: "All games →",
  cardCta: "How to play →",
} as const;

/** Keyed by slug, so a missing or misspelled game fails typecheck. */
export const gameGuideLines: Record<GameSlug, string> = {
  nassau: "Front, back, total — plus presses.",
  skins: "Win the hole outright, win the skin. Ties carry.",
  wolf: "Rotation, partners, lone-wolf multiplier.",
  "stroke-purse": "Net or gross, winner takes the pot.",
  "bingo-bango-bongo": "Three points a hole, no strokes needed.",
  "closest-to-pin": "The par-3 side bet, settled on the green.",
  "longest-drive": "One fairway, one bomb, one winner.",
  birdies: "Every birdie on the card gets paid.",
};

/** Card order on the page — the reference's, not the roster's. */
export const gameGuideOrder: GameSlug[] = [
  "nassau",
  "skins",
  "wolf",
  "stroke-purse",
  "bingo-bango-bongo",
  "closest-to-pin",
  "longest-drive",
  "birdies",
];

export const hiwFinalCta = {
  kicker: "TRACK IT. BET IT. SETTLE IT.",
  title: "Bring it Saturday. Let the phone keep the tally.",
} as const;
