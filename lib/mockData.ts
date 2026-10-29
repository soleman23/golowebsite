/**
 * Illustrative in-phone mock data for the marketing device mockups. This is
 * decorative content shown inside the phone frames — not functional app data.
 * Values traced from the design handoff's logic block.
 */

import type { IconName } from "@/components/ui/Icon";
import { rosterGame, type GameSlug } from "@/lib/content/games";
import { andList } from "@/lib/format";

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

/** A row as written here: the game's name and icon come from the roster. */
type MoneyRowSpec = Omit<MoneyRow, "icon" | "title"> & {
  game: GameSlug;
  /** Which part of the game the row is about, after its name: "Nassau · Front". */
  segment?: string;
};

const moneyRowSpecs: MoneyRowSpec[] = [
  {
    game: "skins",
    iconColor: "var(--accent)",
    iconBg: "rgba(212,242,58,.14)",
    iconBorder: "rgba(212,242,58,.35)",
    who: "carried over two holes",
    val: "$120",
    valAccent: true,
    tag: "carried",
  },
  {
    game: "nassau",
    segment: "Front",
    iconColor: "#facc15",
    iconBg: "rgba(250,204,21,.14)",
    iconBorder: "rgba(250,204,21,.35)",
    who: "Tom 2 up",
    val: "closed",
    valAccent: false,
    tag: "match play",
  },
  {
    game: "best-score",
    iconColor: "#bef264",
    iconBg: "rgba(190,242,100,.14)",
    iconBorder: "rgba(190,242,100,.35)",
    who: "Tom leads at −4",
    val: "$80",
    valAccent: true,
    tag: "winner takes",
  },
  {
    game: "closest-to-pin",
    iconColor: "#60a5fa",
    iconBg: "rgba(96,165,250,.14)",
    iconBorder: "rgba(96,165,250,.35)",
    who: "Sarah · hole 7",
    val: "$20",
    valAccent: true,
    tag: "live hole",
  },
];

export const moneyRows: MoneyRow[] = moneyRowSpecs.map(
  ({ game, segment, ...row }) => {
    const { name, icon } = rosterGame(game);
    return { ...row, icon, title: segment ? `${name} · ${segment}` : name };
  },
);

/** The carried skins in the MoneyCard's players view footer. */
export const skinsPot = { carried: 4, value: "$32" };

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
  /** Full course handicap off the group's one set of tees (setupTees). */
  courseHandicap: string;
};

/**
 * The app plays one set of tees for the whole group, so the card names it once
 * and shows each player's course handicap from it. These are WHS numbers for
 * the card's 72.6 / 137, par 72: index × 137 ÷ 113 + 0.6, rounded.
 */
export const setupTees = "BLUE TEES";

export const setupPlayers: SetupPlayer[] = [
  { name: "Mike", initial: "M", color: "#2dd4bf", index: "8.2", courseHandicap: "11" },
  { name: "Sarah", initial: "S", color: "#60a5fa", index: "14.1", courseHandicap: "18" },
  {
    name: "Tom",
    guest: true,
    initial: "T",
    color: "#fb923c",
    index: "22",
    courseHandicap: "27",
  },
];

export type SetupGameChip = { label: string; tone: "accent" | "plain" | "add" };

export const setupGameChips: SetupGameChip[] = [
  { label: "Nassau $5", tone: "accent" },
  { label: "Skins $2", tone: "accent" },
  { label: "Birdie skins", tone: "plain" },
  { label: "+ add game", tone: "add" },
];

export type GameTile = { name: string; rule: string; highlight?: boolean };

/** A roster game as a tile: its name and one-line rule. */
function gameTile(slug: GameSlug): GameTile {
  const { name, rule } = rosterGame(slug);
  return { name, rule };
}

/*
 * Roster games only. A "Junk board" tile used to close this list; the app has
 * none (soleman23/golowebsite#172), so Scramble, the newest format, takes its
 * highlighted slot.
 */
export const gameTiles: GameTile[] = [
  gameTile("nassau"),
  gameTile("skins"),
  gameTile("wolf"),
  gameTile("best-score"),
  gameTile("bingo-bango-bongo"),
  { ...gameTile("scramble"), highlight: true },
];

/** The GameStackCard's accessible name. */
export const gameTilesLabel = `The GoLo game library: ${andList(
  gameTiles.map((tile) => tile.name),
)}, each with its scoring rule.`;

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
    reason: "1 skin · Best Score",
    value: "+$11",
    up: true,
    move: "▲ 2",
  },
  {
    name: "Tom",
    initial: "T",
    color: "#fb923c",
    reason: "Nassau back · 2 down",
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

/**
 * A $5 Overall Match, Tom vs Mike, through 13 — the only game the app takes
 * presses on, and only when called. Tom, 2 down after 6, pressed at 2× and
 * closed the original; 3 down after 13, he pressed again at 3×. That's the
 * app's limit of two live presses. Amounts are Mike's side of it.
 */
export const pressRungs: PressRung[] = [
  {
    holes: "1-6",
    title: "Base match",
    state: "Closed on 6 · Mike 2 up",
    amount: "+$5",
    live: false,
    amountTone: "positive",
  },
  {
    holes: "7-18",
    title: "Tom presses ×2 on 6",
    state: "Live · Mike 1 up · 5 to play",
    amount: "$10",
    live: true,
    amountTone: "plain",
  },
  {
    holes: "14-18",
    title: "Tom presses ×3 on 13",
    state: "Live · starts on 14",
    amount: "$15",
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
  { label: "Best Score +$9" },
];

export type LockerFormatRow = { format: string; record: string; net: string };

export const lockerFormats: LockerFormatRow[] = [
  { format: "Nassau", record: "14–6", net: "+$180" },
  { format: "Skins", record: "9–11", net: "−$45" },
  { format: "Best Score", record: "17–3", net: "+$96" },
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

/** The MoneyCard's accessible names, one per variant, from the rows it shows. */
export const moneyCardLabels = {
  games: `GoLo side games card showing ${andList([
    ...new Set(moneyRowSpecs.map((row) => rosterGame(row.game).name)),
  ])} standings.`,
  players: `GoLo live leaderboard through 12 holes: ${standingRows
    .map((row) => `${row.name} ${row.up ? "up" : "down"} ${row.value.replace(/^[+−]/, "")}`)
    .join(", ")}, with ${skinsPot.value} in carried skins.`,
};
