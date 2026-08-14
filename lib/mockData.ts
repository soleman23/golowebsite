/**
 * Illustrative in-phone mock data for the marketing device mockups. This is
 * decorative content shown inside the phone frames — not functional app data.
 * Values traced from the design handoff's logic block.
 */

import type { IconName } from "@/components/ui/Icon";

/** 18-segment hole progress bar: 0–11 played (accent), 12 current, rest faint. */
export const heroDots = Array.from({ length: 18 }, (_, i) => {
  if (i < 12) return "played"; // accent
  if (i === 12) return "current"; // white
  return "remaining"; // faint
}) as ReadonlyArray<"played" | "current" | "remaining">;

export type HeroRow = {
  pos: string;
  name: string;
  initial: string;
  color: string;
  scoreAccent: boolean; // score rendered in accent vs colored
  scoreColor?: string;
  score: string;
  highlighted: boolean; // lime border
  isYou: boolean;
};

export const heroRows: HeroRow[] = [
  {
    pos: "2",
    name: "Mike",
    initial: "M",
    color: "#2dd4bf",
    scoreAccent: true,
    score: "−1",
    highlighted: true,
    isYou: true,
  },
  {
    pos: "3",
    name: "Sarah",
    initial: "S",
    color: "#60a5fa",
    scoreAccent: false,
    scoreColor: "#fff",
    score: "+3",
    highlighted: false,
    isYou: false,
  },
  {
    pos: "4",
    name: "Dave",
    initial: "D",
    color: "#c084fc",
    scoreAccent: false,
    scoreColor: "#fb7185",
    score: "+8",
    highlighted: false,
    isYou: false,
  },
];

export type ScoreRow = {
  name: string;
  initial: string;
  color: string;
  net: string;
  gross: string;
};

export const scoreRows: ScoreRow[] = [
  { name: "Sarah", initial: "S", color: "#60a5fa", net: "4", gross: "5" },
  { name: "Tom", initial: "T", color: "#fb923c", net: "3", gross: "3" },
  { name: "Dave", initial: "D", color: "#c084fc", net: "4", gross: "6" },
];

export type MoneyRow = {
  icon: IconName;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  title: string;
  who: string;
  val: string;
  valAccent: boolean;
  tag: string;
};

export const moneyRows: MoneyRow[] = [
  {
    icon: "target",
    iconColor: "var(--accent)",
    iconBg: "rgba(212,242,58,.14)",
    iconBorder: "rgba(212,242,58,.35)",
    title: "Skins",
    who: "2-hole carry on the pot",
    val: "$120",
    valAccent: true,
    tag: "in the pot",
  },
  {
    icon: "trophy",
    iconColor: "#facc15",
    iconBg: "rgba(250,204,21,.14)",
    iconBorder: "rgba(250,204,21,.35)",
    title: "Nassau · Front",
    who: "Tom 2 up",
    val: "closed",
    valAccent: false,
    tag: "match play",
  },
  {
    icon: "cash",
    iconColor: "#bef264",
    iconBg: "rgba(190,242,100,.14)",
    iconBorder: "rgba(190,242,100,.35)",
    title: "Stroke Purse",
    who: "Tom leads at −4",
    val: "$80",
    valAccent: true,
    tag: "winner takes",
  },
  {
    icon: "pin",
    iconColor: "#60a5fa",
    iconBg: "rgba(96,165,250,.14)",
    iconBorder: "rgba(96,165,250,.35)",
    title: "Closest to Pin",
    who: "Sarah · hole 7",
    val: "$20",
    valAccent: true,
    tag: "live pot",
  },
];

export type TransferRow = {
  fromColor: string;
  fromInitial: string;
  toColor: string;
  toInitial: string;
  amount: string;
  paid: boolean;
};

/* ------------------------------------------------------------------------
   /features mockups. The home page and the features page show the same app
   at different moments, so these are separate rows rather than edits to the
   ones above — changing those would change the home page.
   ------------------------------------------------------------------------ */

/** Hole 7 board on /features: net/gross differ from the home-page moment. */
export const featureScoreRows: ScoreRow[] = [
  { name: "Sarah", initial: "S", color: "#60a5fa", net: "3", gross: "4" },
  { name: "Tom", initial: "T", color: "#fb923c", net: "4", gross: "5" },
  { name: "Dave", initial: "D", color: "#c084fc", net: "3", gross: "3" },
];

export type SetupPlayer = {
  name: string;
  guest?: boolean;
  initial: string;
  color: string;
  index: string;
  tee: string;
};

export const setupPlayers: SetupPlayer[] = [
  { name: "Mike", initial: "M", color: "#2dd4bf", index: "8.2", tee: "BLUE" },
  { name: "Sarah", initial: "S", color: "#60a5fa", index: "14.1", tee: "WHITE" },
  {
    name: "Tom",
    guest: true,
    initial: "T",
    color: "#fb923c",
    index: "22",
    tee: "WHITE",
  },
];

export type SetupGameChip = { label: string; tone: "accent" | "plain" | "add" };

export const setupGameChips: SetupGameChip[] = [
  { label: "Nassau $5", tone: "accent" },
  { label: "Skins $2", tone: "accent" },
  { label: "Junk $1", tone: "plain" },
  { label: "+ add game", tone: "add" },
];

export type GameTile = { name: string; rule: string; highlight?: boolean };

export const gameTiles: GameTile[] = [
  { name: "Nassau", rule: "Front, back, total — plus presses." },
  { name: "Skins", rule: "Carryover on or off, pot tracked live." },
  { name: "Wolf", rule: "Rotation, partners, lone-wolf multiplier." },
  { name: "Stroke purse", rule: "Net or gross, winner takes the pot." },
  { name: "Bingo Bango Bongo", rule: "Three points a hole, no strokes needed." },
  {
    name: "Junk board",
    rule: "Greenies, sandies, closest-to-pin, long drive.",
    highlight: true,
  },
];

export type StandingRow = {
  name: string;
  initial: string;
  color: string;
  reason: string;
  value: string;
  up: boolean;
  move: string;
  leader?: boolean;
};

export const standingRows: StandingRow[] = [
  {
    name: "Mike",
    initial: "M",
    color: "#2dd4bf",
    reason: "Nassau front closed · 3 skins",
    value: "+$42",
    up: true,
    move: "▲ 1",
    leader: true,
  },
  {
    name: "Sarah",
    initial: "S",
    color: "#60a5fa",
    reason: "1 skin · greenie on 7",
    value: "+$11",
    up: true,
    move: "▲ 2",
  },
  {
    name: "Tom",
    initial: "T",
    color: "#fb923c",
    reason: "pressed the back · 2 down",
    value: "−$18",
    up: false,
    move: "▼ 1",
  },
  {
    name: "Dave",
    initial: "D",
    color: "#c084fc",
    reason: "no skins yet · 4 carries live",
    value: "−$35",
    up: false,
    move: "▼ 2",
  },
];

export type PressRung = {
  holes: string;
  title: string;
  state: string;
  amount: string;
  /** Live rungs get the lime treatment; closed ones stay neutral. */
  live: boolean;
  amountTone: "positive" | "negative" | "plain";
};

export const pressRungs: PressRung[] = [
  {
    holes: "1-9",
    title: "Front nine · base",
    state: "Closed · Mike 2 up",
    amount: "+$5",
    live: false,
    amountTone: "positive",
  },
  {
    holes: "6-9",
    title: "Press · called on 6",
    state: "Closed · Tom 1 up",
    amount: "−$5",
    live: false,
    amountTone: "negative",
  },
  {
    holes: "10-18",
    title: "Back nine · base",
    state: "Live · Mike 1 up · 6 to play",
    amount: "$5",
    live: true,
    amountTone: "plain",
  },
  {
    holes: "14-18",
    title: "Auto-press · 2 down on 13",
    state: "Live · all square",
    amount: "$5",
    live: true,
    amountTone: "plain",
  },
];

/**
 * 18 holes with their stroke index. A 24-handicap gets one stroke everywhere
 * and a second on the six lowest stroke indexes.
 */
export const strokeCells = [
  { hole: 1, si: 5 },
  { hole: 2, si: 13 },
  { hole: 3, si: 1 },
  { hole: 4, si: 17 },
  { hole: 5, si: 9 },
  { hole: 6, si: 3 },
  { hole: 7, si: 15 },
  { hole: 8, si: 11 },
  { hole: 9, si: 7 },
  { hole: 10, si: 4 },
  { hole: 11, si: 12 },
  { hole: 12, si: 2 },
  { hole: 13, si: 16 },
  { hole: 14, si: 8 },
  { hole: 15, si: 6 },
  { hole: 16, si: 18 },
  { hole: 17, si: 14 },
  { hole: 18, si: 10 },
].map((h) => ({ ...h, two: h.si <= 6 }));

export type SettleBreakdown = { label: string };

export const settleBreakdown: SettleBreakdown[] = [
  { label: "Nassau +$10" },
  { label: "Skins +$66" },
  { label: "Junk +$9" },
];

export type LockerFormatRow = { format: string; record: string; net: string };

export const lockerFormats: LockerFormatRow[] = [
  { format: "Nassau", record: "14–6", net: "+$180" },
  { format: "Skins", record: "9–11", net: "−$45" },
  { format: "Junk board", record: "17–3", net: "+$96" },
];

/** Handicap index trend, oldest → newest. Drives the sparkline bars. */
export const lockerTrend = [
  12.4, 12.1, 12.3, 11.9, 11.7, 11.8, 11.6, 11.4, 11.6,
];

export const transferRows: TransferRow[] = [
  {
    fromColor: "#c084fc",
    fromInitial: "D",
    toColor: "#2dd4bf",
    toInitial: "M",
    amount: "$55",
    paid: false,
  },
  {
    fromColor: "#60a5fa",
    fromInitial: "S",
    toColor: "#2dd4bf",
    toInitial: "M",
    amount: "$30",
    paid: true,
  },
  {
    fromColor: "#c084fc",
    fromInitial: "D",
    toColor: "#fb923c",
    toInitial: "T",
    amount: "$25",
    paid: false,
  },
];
