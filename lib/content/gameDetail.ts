/**
 * Long-form per-game content, keyed by slug. Copy is verbatim from
 * design_handoff/reference/Golo Golf - Game Nassau.dc.html.
 *
 * The detail page renders entirely from this shape, so adding the next game is
 * a data edit — never a new page file. A slug only earns an entry once its
 * copy is written; games.ts must mark the same slug `hasDetailPage`.
 */

import type { IconName } from "@/components/ui/Icon";

export type Bet = {
  /** Two-character ledger tag: F9, B9, 18, PR. */
  tag: string;
  title: string;
  detail: string;
  value: string;
  tone: "good" | "bad";
};

export type PhoneBet = {
  label: string;
  status: string;
  value: string;
  tone: "good" | "bad";
};

/** Hole-by-hole match momentum: won / lost / halved. */
export type HoleResult = "w" | "l" | "h";

export type GameDetail = {
  slug: string;
  name: string;
  icon: IconName;
  kicker: string;
  tagline: string;
  /** Meta description for this route (BUILD-SPEC §6). */
  metaDescription: string;
  traits: string[];
  howTitle: string;
  intro: string;
  steps: { n: string; title: string; body: string }[];
  example: {
    kicker: string;
    title: string;
    lead: string;
    bets: Bet[];
    net: { label: string; sub: string; value: string };
    phone: {
      opponent: string;
      through: string;
      of: string;
      state: string;
      stateSub: string;
      sequence: HoleResult[];
      bets: PhoneBet[];
      pressLabel: string;
      pressNote: string;
      settleTitle: string;
      settleSub: string;
      settleValue: string;
      /** What the mockup shows, for assistive tech. */
      label: string;
    };
  };
  /** Section headings. Here, not in the TSX — the next game words them differently. */
  headings: {
    variations: { title: string; lead: string };
    tips: { title: string; lead: string };
    glossary: { title: string };
    faq: { title: string };
    related: { title: string; lead: string };
    cta: { title: string; lead: string };
  };
  variations: { icon: IconName; title: string; body: string }[];
  tips: { tone: "good" | "bad"; title: string; body: string }[];
  glossary: { term: string; def: string }[];
  faqs: { id: string; q: string; a: string }[];
  /** Slugs from games.ts. */
  related: string[];
  prev?: string;
  next?: string;
};

const nassau: GameDetail = {
  slug: "nassau",
  name: "Nassau",
  icon: "trophy",
  kicker: "MATCH PLAY · 3 BETS IN 1",
  tagline:
    "The clubhouse classic: three separate bets riding at once — the front nine, the back nine, and the whole eighteen. Lose a nine and you can always press to win it back.",
  metaDescription:
    "Front, back and total, plus the press. How a Nassau works, what a press really costs, and the terms you'll hear on the tee.",
  traits: ["2–4 players", "Match play", "3 bets in 1", "18 holes"],
  howTitle: "One round. Three bets. Endless comebacks.",
  intro:
    'A Nassau is really three matches stacked on top of each other. You play match play — win a hole and you go one "up," lose one and you fall "down." Whoever’s ahead when a nine finishes wins that bet, and the overall 18 is its own separate prize.',
  steps: [
    {
      n: "1",
      title: "Set three equal bets",
      body: "Agree on a stake — say $20 — that rides on the front nine, the back nine, and the overall 18. Three bets, one round.",
    },
    {
      n: "2",
      title: "Play it as match play",
      body: "Forget stroke totals. Win a hole outright and you go 1 up; lose it and you’re 1 down. Halved holes leave the match where it is.",
    },
    {
      n: "3",
      title: "Close out each nine",
      body: "Whoever’s ahead when the 9th and 18th holes finish wins that nine’s bet. The overall bet is decided across all 18.",
    },
    {
      n: "4",
      title: "Press when you’re down",
      body: 'Fall two holes behind and you can "press" — start a brand-new bet for the remaining holes to claw the money back.',
    },
    {
      n: "5",
      title: "Net it at the 18th",
      body: "GoLo tallies all three bets plus any presses and reduces it to a single amount each player owes or collects.",
    },
  ],
  example: {
    kicker: "WATCH IT PLAY OUT",
    title: "A $20 Nassau, front to back.",
    lead: "You and Tom go $20 on each bet. Here's how a full round shakes out — three bets, one press, one net number at the end.",
    // +20 − 20 + 20 + 10 = +30. Keep these reconciled with net.value.
    bets: [
      {
        tag: "F9",
        title: "Front nine",
        detail: "You closed it 2 up through 9",
        value: "+$20",
        tone: "good",
      },
      {
        tag: "B9",
        title: "Back nine",
        detail: "Tom clawed it back, 1 up",
        value: "−$20",
        tone: "bad",
      },
      {
        tag: "18",
        title: "Overall match",
        detail: "You held on, 1 up on 18",
        value: "+$20",
        tone: "good",
      },
      {
        tag: "PR",
        title: "Back-nine press",
        detail: "Opened at 2 down, won it late",
        value: "+$10",
        tone: "good",
      },
    ],
    net: {
      label: "NET · YOU COLLECT",
      sub: "Every bet rolled into one transfer",
      value: "+$30",
    },
    phone: {
      opponent: "You vs Tom",
      through: "18",
      of: "/ 18",
      state: "FINAL",
      stateSub: "match complete",
      sequence: [
        "w", "w", "h", "l", "w", "h", "w", "l", "w",
        "l", "l", "h", "w", "w", "l", "h", "w", "w",
      ],
      bets: [
        { label: "FRONT", status: "2↑", value: "+$20", tone: "good" },
        { label: "BACK", status: "1↓", value: "−$20", tone: "bad" },
        { label: "TOTAL", status: "1↑", value: "+$20", tone: "good" },
      ],
      pressLabel: "PRESS",
      pressNote: "Back-nine press, hole 13 — you closed it +$10",
      settleTitle: "Tom pays you",
      settleSub: "3 bets + 1 press, netted",
      settleValue: "$30",
      label:
        "The finished Nassau against Tom: front nine won for $20, back nine lost for $20, the overall match won for $20, plus a back-nine press worth $10 — Tom pays you $30.",
    },
  },
  headings: {
    variations: {
      title: "The press is where Nassau gets dangerous.",
      lead: "Down bad on a nine? Open a new bet for the holes that are left. GoLo tracks every press as its own line so the stack never gets confusing.",
    },
    tips: {
      title: "When to press — and when to shut up.",
      lead: "A Nassau rewards momentum. Read your own game before you throw more money at a nine you're spraying all over the lot.",
    },
    glossary: { title: "The terms you'll hear on the tee." },
    faq: { title: "Before you tee it up." },
    related: {
      title: "Crews that run Nassau also play…",
      lead: "Run any of these alongside your Nassau in the same round — GoLo nets the whole stack into one number.",
    },
    cta: {
      title: "Set up your Nassau in ten seconds.",
      lead: "Pick the stake, tap the players, and let GoLo track every bet and press to the last putt.",
    },
  },
  variations: [
    {
      icon: "press",
      title: "The press",
      body: "Down two on a nine? Fire a new bet for the holes that remain. Win it and you cancel out the damage — lose it and you’re in deeper.",
    },
    {
      icon: "auto",
      title: "2-down auto-press",
      body: "Set it and forget it. A new press opens automatically the moment anyone falls two behind, so nobody has to remember to call it.",
    },
    {
      icon: "stack",
      title: "Presses stack",
      body: "Each press is its own mini-match. On a wild nine you can have two or three running at once — GoLo keeps every line straight.",
    },
    {
      icon: "dice",
      title: "Escalating stakes",
      body: 'Play a "2-2-2" that becomes a "4-4-4," or a team Nassau with best-ball. Set the stake and format up front and let the app score it.',
    },
  ],
  tips: [
    {
      tone: "good",
      title: "Press with the momentum",
      body: "If you’ve steadied your ball-striking and your opponent is leaking oil, a press turns a lost nine into found money.",
    },
    {
      tone: "bad",
      title: "Don’t chase a bad swing",
      body: "Pressing while you’re spraying it everywhere just doubles the bleeding. Sometimes the smart bet is no bet.",
    },
    {
      tone: "good",
      title: "Mind the overall",
      body: "The nines reward hot streaks, but the overall 18 rewards consistency. A steady round can lose both nines and still bank the total.",
    },
  ],
  glossary: [
    {
      term: "Nassau",
      def: "A three-part wager: separate bets on the front nine, back nine, and the total 18-hole match.",
    },
    {
      term: "1 up / 2 down",
      def: 'Your match standing. "2 up" means you’ve won two more holes than your opponent so far.',
    },
    {
      term: "Press",
      def: "A new side bet opened mid-nine by the player who’s behind, covering only the holes that remain.",
    },
    {
      term: "All square (AS)",
      def: "The match is dead even — nobody is up.",
    },
    {
      term: "Halve",
      def: "A tied hole. It counts for nothing and the match standing stays put.",
    },
    {
      term: "Dormie",
      def: "You’re up by exactly as many holes as are left — you can’t lose the bet, only win or tie it.",
    },
  ],
  faqs: [
    {
      id: "one-bet-or-three",
      q: "Is a Nassau one bet or three?",
      a: 'Three. A "$20 Nassau" means $20 on the front nine, $20 on the back nine, and $20 on the overall 18 — so the most you can win or lose (before presses) is $60.',
    },
    {
      id: "what-is-a-press",
      q: "What exactly is a press?",
      a: "When you fall two holes down, you can start a new bet — same stake — that only covers the holes still to play on that nine. It’s a fresh chance to win money back on a nine you’ve already lost. GoLo tracks each press as its own line.",
    },
    {
      id: "auto-press",
      q: "Can presses happen automatically?",
      a: 'Yes. Turn on auto-press (usually "2-down automatic") and GoLo opens a new press for you every time you fall two behind — no need to call it out on the tee.',
    },
    {
      id: "handicaps",
      q: "Do handicaps apply to a Nassau?",
      a: "They can. Enter each player’s index and GoLo allocates strokes hole by hole using the course stroke index, so a net Nassau plays fair between a 5 and a 20. You can also run it straight-up gross.",
    },
  ],
  related: ["skins", "wolf", "stroke-purse"],
  prev: "skins",
  next: "stroke-purse",
};

export const gameDetails: Record<string, GameDetail> = { nassau };

export const gameDetailSlugsWithContent = Object.keys(gameDetails);

export function findGameDetail(slug: string): GameDetail | undefined {
  return gameDetails[slug];
}
