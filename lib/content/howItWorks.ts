/**
 * /how-it-works — one Saturday foursome, parking lot to settled up. Copy is
 * verbatim from reference/Golo Golf - How It Works.dc.html.
 *
 * The worked example is internally consistent and checked: course handicaps
 * come off Pinehurst No. 8 Whites (72.6 / 137, par 72), strokes land by the
 * stroke index below, and the bet table nets to zero. /features uses a
 * different tee (slope 128) for its StrokeGrid, which is why Tom gets 24 there
 * and 27 here — both are right for their own tees.
 */

import type { GameSlug } from "./games";

export const hiwHero = {
  kicker: "HOW IT WORKS",
  title: "One round, from the parking lot to settled up.",
  lead: "Follow a Saturday foursome through eighteen holes. You'll see exactly where GoLo does the work — setup, strokes, scores, presses, and the one number everyone wants at the end.",
  walkLabel: "Walk the round",
  watchLabel: "Watch it in 90 seconds",
} as const;

export const hiwRoundHeader = {
  kicker: "THE ROUND, IN ORDER",
  title: "Six moments. One phone. Zero arithmetic.",
  lead: "Mike, Jess, Sarah and Tom. Team Nassau at $5 a man, $2 skins, a little junk. Tom's a guest. Here's their round.",
} as const;

/**
 * The coded screen (components/mockups/HiwScreen) each step shows until a
 * real screenshot is dropped in at public/images/how-it-works/step-0N.
 */
export type TimelineFallback =
  | "setup"
  | "strokes"
  | "scoring"
  | "turn"
  | "final"
  | "settle";

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
  screen: {
    /** 1170×2532 screenshot, served through next/image. Absent → fallback. */
    src?: string;
    fallback: TimelineFallback;
  };
};

export const roundSteps: RoundStep[] = [
  {
    id: "step-01",
    n: "01",
    short: "Parking lot",
    place: "THE PARKING LOT",
    time: "7:48 AM",
    title: "Set the round before anyone's done stretching.",
    body: "Course, tees, players, games, stakes. About ninety seconds on one phone — and it's the last time anyone thinks about setup. Save the Saturday crew as a preset and next week it's four taps.",
    bullets: [
      "Different tees per player — the bet still works",
      "Guests added by name and index, no account",
      "Stack Nassau, skins and junk on one card",
    ],
    screen: { fallback: "setup" },
  },
  {
    id: "step-02",
    n: "02",
    short: "First tee",
    place: "THE FIRST TEE",
    time: "8:10 AM",
    title: "Strokes get handed out — correctly.",
    body: "Each index becomes a course handicap for the tees that player is on. GoLo plays everyone off the low man and drops strokes on the right holes by stroke index. Nobody argues about who gets one on 7.",
    bullets: [
      "Full handicap, 90%, or straight up",
      "No GHIN? Use the number your group agreed on",
      "Stroke dots show on the card, hole by hole",
    ],
    link: { label: "How strokes work ↓", href: "#strokes" },
    screen: { fallback: "strokes" },
  },
  {
    id: "step-03",
    n: "03",
    short: "Front nine",
    place: "HOLES 1–9",
    time: "8:14 AM",
    title: "Tap a number. Walk to the next tee.",
    body: "One phone scores the group. Enter gross scores and GoLo applies the strokes, decides the skin, carries the pot on ties and moves the match — before the flag's back in.",
    bullets: [
      "Net and gross side by side",
      "Skins carry automatically on tied holes",
      "Live standings for every game on the card",
    ],
    screen: { fallback: "scoring" },
  },
  {
    id: "step-04",
    n: "04",
    short: "The turn",
    place: "THE TURN",
    time: "10:21 AM",
    title: "Front nine's in the books. The press is waiting.",
    body: "The front-nine bet closes itself out. Down two on the back? The press prompt is already on screen — accept it and it runs as its own bet to the 18th.",
    bullets: [
      "Auto-press at 2 down, or press on request",
      "Every press tracked as a separate bet",
      "Greenies, sandies and birdies tallied as you go",
    ],
    screen: { fallback: "turn" },
  },
  {
    id: "step-05",
    n: "05",
    short: "18th green",
    place: "THE 18TH GREEN",
    time: "12:36 PM",
    title: "Last putt drops. The math is already done.",
    body: "Back nine, total, the press, the last skin — all closed the second the final score goes in. No calculator, no recount, no “wait, who had the seventh?”",
    bullets: [
      "Every bet closed out hole by hole",
      "Full hole-by-hole history if anyone asks",
      "Round saved to your history",
    ],
    screen: { fallback: "final" },
  },
  {
    id: "step-06",
    n: "06",
    short: "Settle up",
    place: "BACK AT THE CARS",
    time: "12:41 PM",
    title: "One number per player. Fewest payments possible.",
    body: "GoLo nets every bet against every other and boils it down to the shortest list of who pays who. Then you settle the way your group already does — the money never touches GoLo.",
    bullets: [
      "Netted across every game on the card",
      "Fewest payments, not a pile of IOUs",
      "Cash, Venmo, Zelle — outside the app",
    ],
    link: { label: "See the math on a real round ↓", href: "#math" },
    screen: { fallback: "settle" },
  },
];

/** Avatar colour per player; maps to the --avatar-* tokens. */
export type PlayerColor = "teal" | "purple" | "blue" | "orange";

export type HiwPlayerName = "Mike" | "Jess" | "Sarah" | "Tom";

export const hiwPlayerColor: Record<HiwPlayerName, PlayerColor> = {
  Mike: "teal",
  Jess: "purple",
  Sarah: "blue",
  Tom: "orange",
};

export type StrokePickerName = "Jess" | "Sarah" | "Tom";

export const strokeExample = {
  kicker: "HANDICAPS, WITHOUT THE ARGUMENT",
  title: "Everyone plays off the low man.",
  lead: "Each index becomes a course handicap for the tees being played. The best player gives up nothing; everyone else gets the difference, one stroke at a time, on the hardest holes first.",
  formulaLabel: "THE FORMULA",
  formula: "Index × (Slope ÷ 113) + (Rating − Par)",
  course: "Pinehurst No. 8 · White tees · 72.6 / 137 · Par 72",
  players: [
    { name: "Mike", index: "8.2", course: 11, strokes: null },
    { name: "Jess", index: "11.4", course: 14, strokes: 3 },
    { name: "Sarah", index: "14.1", course: 18, strokes: 7 },
    { name: "Tom", index: "22.0", course: 27, strokes: 16, guest: true },
  ] as {
    name: HiwPlayerName;
    index: string;
    course: number;
    /** null = the low man, who gives strokes rather than getting them. */
    strokes: number | null;
    guest?: boolean;
  }[],
  allowances: ["Full handicap", "90%", "Straight up"],
  allowanceNote: "Your group picks at the first tee.",
  pickerLabel: "WHERE THE STROKES LAND",
  /** Stroke index by hole, 1 → 18. */
  strokeIndex: [5, 13, 1, 17, 9, 3, 15, 11, 7, 4, 12, 2, 16, 8, 6, 18, 14, 10],
  pickerStrokes: { Jess: 3, Sarah: 7, Tom: 16 } as Record<
    StrokePickerName,
    number
  >,
  pickerDefault: "Sarah" as StrokePickerName,
  notes: {
    Jess: "Jess gets 3 strokes — on holes 3, 12 and 6, the three hardest on the card. Everywhere else she plays Mike straight up.",
    Sarah:
      "Sarah gets 7 strokes, one each on the seven lowest stroke indexes. Her 5 on the 3rd counts as a 4.",
    Tom: "Tom gets 16 — a stroke on every hole except the two easiest, the 4th and the 16th. Guest or not, the math is the same.",
  } as Record<StrokePickerName, string>,
  footnote:
    "SI = stroke index, the course's ranking of hole difficulty (1 is hardest). Strokes go to the lowest numbers first.",
} as const;

export type BetRow = {
  name: HiwPlayerName;
  skinsWon: number;
  nassau: string;
  skins: string;
  net: string;
};

/** Signed dollar strings carry a real minus sign (−), never a hyphen. */
export const betExample = {
  kicker: "HOW THE MATH LANDS",
  title: "Two games, four players, two payments.",
  lead: "Same foursome. Team Nassau — Mike & Tom against Sarah & Jess — at $5 a man with one press on the back, plus $2 skins with carryovers. Here's what GoLo shows on the 18th green.",
  results: [
    { label: "Front · Sarah & Jess" },
    { label: "Back · Mike & Tom" },
    { label: "Press (13–18) · Mike & Tom", highlight: true },
    { label: "18 · Mike & Tom" },
    { label: "6 skins won" },
  ] as { label: string; highlight?: boolean }[],
  rows: [
    { name: "Tom", skinsWon: 2, nassau: "+$10", skins: "+$4", net: "+$14" },
    { name: "Sarah", skinsWon: 3, nassau: "−$10", skins: "+$12", net: "+$2" },
    { name: "Mike", skinsWon: 0, nassau: "+$10", skins: "−$12", net: "−$2" },
    { name: "Jess", skinsWon: 1, nassau: "−$10", skins: "−$4", net: "−$14" },
  ] as BetRow[],
  noteNassau:
    "lost the front (−$5), won the back, the press and the 18 (+$15) = +$10 for Mike & Tom.",
  noteSkins:
    "each skin pays $2 from each of the other three — so a skin is worth $6, and every skin someone else wins costs you $2.",
  settleKicker: "SETTLE UP",
  settleCount: 2,
  settleCaption: "payments, before anyone leaves the lot.",
  payments: [
    { from: "Jess", to: "Tom", amount: "$14" },
    { from: "Mike", to: "Sarah", amount: "$2" },
  ] as { from: HiwPlayerName; to: HiwPlayerName; amount: string }[],
  settleBody:
    "Every bet netted against every other. Mike won the Nassau and still owes two bucks — GoLo doesn't make him pay out and collect separately.",
  settleFooter: "Cash, Venmo, Zelle — your call. Nothing runs through GoLo.",
} as const;

/**
 * The coded phone screens the timeline shows until real screenshots land.
 * They reuse strokeExample and betExample wherever they can, so the phone
 * and the copy beside it can't disagree. The hole-3 scores are chosen to
 * match the stroke note ("Her 5 on the 3rd counts as a 4"): Mike, Jess and
 * Sarah all net 4, so the skin carries.
 */
export const hiwScreens = {
  setup: {
    kicker: "NEW ROUND",
    when: "Sat · 7:48 AM",
    course: "Pinehurst No. 8",
    courseMeta: "White · 72.6 / 137 · Par 72",
    teamsLabel: "TEAMS",
    teams: [
      ["Mike", "Tom"],
      ["Sarah", "Jess"],
    ] as HiwPlayerName[][],
    gamesLabel: "GAMES ON THE CARD",
    games: ["Team Nassau · $5", "Skins · $2"],
    addGame: "+ add game",
    start: "Start the round",
  },
  strokes: {
    kicker: "FIRST TEE",
    title: "Strokes",
    allowance: "Full handicap",
    /** First hole of the round; who gets a stroke there is computed. */
    hole: 1,
    holeLabel: "ON THE 1ST",
  },
  scoring: {
    kicker: "HOLE",
    hole: 3,
    par: 4,
    scores: { Mike: 4, Jess: 5, Sarah: 5, Tom: 6 } as Record<
      HiwPlayerName,
      number
    >,
    skin: "Tied at net 4 · skin carries to the 4th",
    match: "Front · all square thru 3",
  },
  turn: {
    kicker: "NASSAU · $5 · MIKE & TOM",
    rungs: [
      { holes: "1–9", title: "Front nine", state: "Final · Sarah & Jess 2 up", amount: "−$5", tone: "negative" },
      { holes: "10–18", title: "Back nine", state: "Live · all square", amount: "$5", tone: "live" },
      { holes: "1–18", title: "The 18", state: "Live · 2 down", amount: "$5", tone: "live" },
    ] as {
      holes: string;
      title: string;
      state: string;
      amount: string;
      tone: "negative" | "live";
    }[],
    pressLabel: "PRESS",
    press: "Auto-press when you go 2 down on the back",
  },
  final: {
    kicker: "FINAL · THRU 18",
    title: "Every bet closed",
    standingsLabel: "NET, ALL GAMES",
  },
  settle: {
    kicker: "SETTLE UP",
    title: "2 payments",
    share: "Share the card",
  },
} as const;

export const guestsSection = {
  kicker: "GUESTS WELCOME",
  title: "Tom doesn't have the app. Tom doesn't need it.",
  lead: "Add a guest with a name and an index. That's it — no download, no sign-up, no email. They get the same strokes, the same bets and the same line on the settle-up screen as everyone else.",
  points: [
    {
      lead: "One phone scores the group",
      rest: "the scorekeeper enters everyone's number.",
    },
    {
      lead: "Mix members and guests",
      rest: "in the same match, same tees or different.",
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
  { name: "Jess", index: "11.4" },
  { name: "Sarah", index: "14.1" },
  { name: "Tom", index: "22", guest: true },
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
      body: "One phone scores the round. Live sync so all four can enter their own scores is on the list, not built yet.",
    },
    {
      title: "Require an official handicap",
      body: "No GHIN needed. Use a real index, the number your group settled on years ago, or play straight up.",
    },
  ],
} as const;

/**
 * Shown only while siteConfig.showHowItWorksVideo is on. Drop the files in
 * public/videos/ before flipping it.
 */
export const hiwVideo = {
  kicker: "WATCH IT",
  title: "A full round in ninety seconds.",
  lead: "Setup, scoring, a press, and the settle-up screen — start to finish, real speed.",
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
