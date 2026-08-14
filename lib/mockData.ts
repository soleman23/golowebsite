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
