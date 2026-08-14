/**
 * Static marketing content for the landing page. Copied verbatim from the
 * design handoff. Keeping it here (not inline in components) keeps copy edits
 * in one place and sections thin.
 */

import type { IconName } from "@/components/ui/Icon";

export type Stat = {
  value: string;
  accentValue?: boolean; // render the numeral in the lime accent
  label: string;
  sub: string;
};

export const stats: Stat[] = [
  {
    value: "8",
    accentValue: true,
    label: "games scored automatically",
    sub: "Skins, Nassau, Wolf & more",
  },
  {
    value: "<30s",
    label: "from last putt to settled",
    sub: "while you're still on the green",
  },
  {
    value: "0",
    label: "arguments about who won 14",
    sub: "the app keeps the receipts",
  },
  {
    value: "100%",
    label: "of debts, remembered",
    sub: "no more “I'll get you next time”",
  },
];

export type FeatureChecklistItem = { lead: string; rest: string };

export type Feature = {
  id: string;
  icon: IconName;
  kicker: string;
  title: string;
  /** Rich lead paragraph as HTML fragments; strong text uses <strong>. */
  bodyHtml: string;
  checklist: FeatureChecklistItem[];
  /** Which side the visual sits on at desktop width. */
  visualSide: "left" | "right";
  visual: "scoring" | "money" | "settle";
};

export const features: Feature[] = [
  {
    id: "immersive-scoring",
    icon: "card",
    kicker: "IMMERSIVE SCORING",
    title: "Tap in scores, not spreadsheets.",
    bodyHtml:
      "One thumb, hole by hole. GoLo applies every player's handicap strokes automatically and tracks net <em>and</em> gross — so the board is always right, even when the games aren't simple.",
    checklist: [
      {
        lead: "Handicap strokes, auto-applied",
        rest: "pop, push or carry, sorted per hole.",
      },
      { lead: "Net & gross at once", rest: "flip the view, the bets follow." },
      {
        lead: "Built for a foursome",
        rest: "everyone's scores in one tap-friendly card.",
      },
    ],
    visualSide: "right",
    visual: "scoring",
  },
  {
    id: "live-leaderboard",
    icon: "trophy",
    kicker: "LIVE LEADERBOARD",
    title: "Talk your trash — with receipts.",
    bodyHtml:
      "Everyone sees where they stand while the round's still alive. Flip between net, gross and the money on the line. Movement arrows show who's charging and who just dumped one in the water.",
    checklist: [
      { lead: "Net · Gross · Money", rest: "one tap to see every angle." },
      {
        lead: "Live skins & carries",
        rest: "watch the pot build hole to hole.",
      },
      { lead: "Movement arrows", rest: "proof you made the turn in first." },
    ],
    visualSide: "left",
    visual: "money",
  },
  {
    id: "auto-settle-up",
    icon: "swap",
    kicker: "AUTO SETTLE-UP",
    title: "The math is done before the handshake.",
    bodyHtml:
      "Skins, Nassau, the purse, closest-to-pin and long drive — all netted into the <strong>fewest possible transfers</strong>. No daisy-chain of Venmos. Just “you pay him, he pays her,” done.",
    checklist: [
      {
        lead: "One net number per person",
        rest: "every game rolled together.",
      },
      { lead: "Mark paid", rest: "check it off as the cash lands." },
      {
        lead: "Drop it in the group chat",
        rest: "receipts for the whole crew.",
      },
    ],
    visualSide: "right",
    visual: "settle",
  },
];

export type Game = { icon: IconName; name: string; desc: string };

export const games: Game[] = [
  {
    icon: "target",
    name: "Skins",
    desc: "Low score wins the hole. Ties carry the pot to the next — and the next.",
  },
  {
    icon: "trophy",
    name: "Nassau",
    desc: "Three bets in one: front nine, back nine and the overall match.",
  },
  {
    icon: "cash",
    name: "Stroke Purse",
    desc: "Everyone buys in; lowest net total over 18 takes the whole pot.",
  },
  {
    icon: "wolf",
    name: "Wolf",
    desc: "Rotating captain picks a partner — or goes Lone Wolf for double.",
  },
  {
    icon: "dice",
    name: "Bingo Bango Bongo",
    desc: "Points for first on, closest once on, and first in the hole.",
  },
  {
    icon: "pin",
    name: "Closest to Pin",
    desc: "Stick it tight on the par 3s and take the side pot.",
  },
  {
    icon: "drive",
    name: "Longest Drive",
    desc: "Bomb it down the fairway on the marked hole to collect.",
  },
  {
    icon: "bird",
    name: "Birdies",
    desc: "A standing bounty on every birdie — paid by everyone who didn't.",
  },
];

export type Step = { n: string; icon: IconName; title: string; body: string };

export const steps: Step[] = [
  {
    n: "1",
    icon: "card",
    title: "Set the round",
    body: "Pick the course and tees, add your players, then stack every game your group wants to play.",
  },
  {
    n: "2",
    icon: "flame",
    // Corrected from the prototype's stray HTML entity "Play &amp; track".
    title: "Play & track",
    body: "Tap in scores hole by hole. The leaderboard updates live — strokes, skins, carries and all.",
  },
  {
    n: "3",
    icon: "swap",
    title: "Settle up",
    body: "GoLo nets every game into the fewest transfers. Everyone pays the right person before you leave the green.",
  },
];

export type Quote = {
  text: string;
  name: string;
  role: string;
  initial: string;
  color: string;
};

export const quotes: Quote[] = [
  {
    text: "I haven't done press-the-back-nine math in my head since I got this. And somehow I always get paid now.",
    name: "Marcus T.",
    role: "Plays 3× a week",
    initial: "M",
    color: "#2dd4bf",
  },
  {
    text: "Forty guys, every Saturday. Used to be a spreadsheet and a headache. Now the league just runs itself.",
    name: "Dave R.",
    role: "MGA commissioner",
    initial: "D",
    color: "#fb923c",
  },
  {
    text: "Four days in Scottsdale, six games a day. We settled the entire trip standing on the 18th green.",
    name: "Tyler K.",
    role: "Annual golf trip",
    initial: "T",
    color: "#60a5fa",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Does it handle handicaps?",
    a: "Yes — enter each player's index once and GoLo allocates strokes hole by hole using the course stroke index. Net and gross are both always live, so a 20-handicap and a 5 can play the same game fairly.",
  },
  {
    q: "Which games can I run at once?",
    a: "Stack as many as you want in one round: Skins, Nassau, Stroke Purse, Wolf, Bingo Bango Bongo, Closest to Pin, Longest Drive and Birdies. Each is scored on its own, then netted into a single number per player at the end.",
  },
  {
    q: "How does the settle-up work?",
    a: 'When the last putt drops, GoLo totals every game, figures out who\'s up and who\'s down, and reduces it to the fewest transfers that square the group. Nobody sends four separate payments — you get one clean "pay this person" instruction.',
  },
  {
    q: "Is this real-money gambling?",
    a: "GoLo is a scorekeeper for friendly wagers between playing partners — the kind you've always settled by hand. It doesn't process payments or hold money; it just does the math and tells you who owes who. Keep it friendly and play your local rules.",
  },
  {
    q: "Do all four of us need the app?",
    a: "No. One person can run the whole round and the rest just play. Share the live link or final summary to the group chat so everyone can follow along and check the receipts.",
  },
  {
    q: "What about multi-day trips?",
    a: "Trip mode keeps a running tally across every round so a four-day Scottsdale or Myrtle Beach trip settles once, on the 18th green of the last day — not in a confusing pile of daily Venmos.",
  },
];

export const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how" },
    { label: "Download", href: "/#get" },
  ],
  games: [
    { label: "Skins", href: "/#games" },
    { label: "Nassau", href: "/#games" },
    { label: "Wolf", href: "/#games" },
  ],
  company: [
    { label: "FAQ", href: "/#faq" },
    { label: "Privacy", href: "/privacy" },
    { label: "Contact", href: "/contact" },
  ],
};

export const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Games", href: "/#games" },
  { label: "How it works", href: "/#how" },
  { label: "FAQ", href: "/#faq" },
];
