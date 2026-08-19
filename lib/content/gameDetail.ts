/**
 * Long-form per-game content, keyed by slug. Copy is verbatim from
 * design_handoff/reference/Golo Golf - Game Nassau.dc.html.
 *
 * The detail page renders entirely from this shape, so adding the next game is
 * a data edit — never a new page file. A slug only earns an entry once its
 * copy is written; games.ts must mark the same slug `hasDetailPage`.
 */

import type { IconName } from "@/components/ui/Icon";
import type { GameSlug } from "./games";

export type GameTone = "good" | "bad" | "neutral";

export type GameExampleLedgerEntry = {
  tag: string;
  tagSub?: string;
  title: string;
  detail: string;
  value: string;
  tone: GameTone;
};

export type GameExampleStat = {
  label: string;
  status: string;
  value: string;
  tone: GameTone;
};

export type GameScoringSection = {
  kicker: string;
  title: string;
  lead: string;
  rows: {
    tag?: string;
    title: string;
    detail: string;
    value: string;
    tone?: GameTone;
  }[];
};

export type GameExampleStanding = {
  name: string;
  note: string;
  value: string;
  tone: GameTone;
};

/** Hole-by-hole match momentum: won / lost / halved. */
export type HoleResult = "w" | "l" | "h";

export type GameDetail = {
  slug: GameSlug;
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
  scoring?: GameScoringSection;
  example: {
    kicker: string;
    title: string;
    lead: string;
    bets: GameExampleLedgerEntry[];
    standings?: GameExampleStanding[];
    net: { label: string; sub: string; value: string };
    phone: {
      opponent: string;
      through: string;
      of: string;
      state: string;
      stateSub: string;
      sequence: HoleResult[];
      stats: GameExampleStat[];
      callout?: { label: string; note: string };
      settleTitle: string;
      settleSub: string;
      settleValue: string;
      /** What the mockup shows, for assistive tech. */
      label: string;
    };
  };
  /** Section headings. Here, not in the TSX — the next game words them differently. */
  headings: {
    variations: { kicker: string; title: string; lead: string };
    tips: { kicker: string; title: string; lead: string };
    glossary: { kicker: string; title: string };
    faq: { kicker: string; title: string };
    related: { kicker: string; title: string; lead: string };
    cta: { title: string; lead: string };
  };
  variations: { icon: IconName; title: string; body: string }[];
  tips: { tone: "good" | "bad"; title: string; body: string }[];
  glossary: { term: string; def: string }[];
  faqs: { id: string; q: string; a: string }[];
  /** Slugs from games.ts. */
  related: GameSlug[];
  prev?: GameSlug;
  next?: GameSlug;
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
      stats: [
        { label: "FRONT", status: "2↑", value: "+$20", tone: "good" },
        { label: "BACK", status: "1↓", value: "−$20", tone: "bad" },
        { label: "TOTAL", status: "1↑", value: "+$20", tone: "good" },
      ],
      callout: {
        label: "PRESS",
        note: "Back-nine press, hole 13 — you closed it +$10",
      },
      settleTitle: "Tom pays you",
      settleSub: "3 bets + 1 press, netted",
      settleValue: "$30",
      label:
        "The finished Nassau against Tom: front nine won for $20, back nine lost for $20, the overall match won for $20, plus a back-nine press worth $10 — Tom pays you $30.",
    },
  },
  headings: {
    variations: {
      kicker: "PRESSES & VARIATIONS",
      title: "The press is where Nassau gets dangerous.",
      lead: "Down bad on a nine? Open a new bet for the holes that are left. GoLo tracks every press as its own line so the stack never gets confusing.",
    },
    tips: {
      kicker: "PLAY SMART",
      title: "When to press — and when to shut up.",
      lead: "A Nassau rewards momentum. Read your own game before you throw more money at a nine you're spraying all over the lot.",
    },
    glossary: { kicker: "TALK THE TALK", title: "The terms you'll hear on the tee." },
    faq: { kicker: "NASSAU, ANSWERED", title: "Before you tee it up." },
    related: {
      kicker: "STACK IT WITH",
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

function gameFaqs(
  slug: GameSlug,
  entries: { q: string; a: string }[],
): GameDetail["faqs"] {
  return entries.map((entry, index) => ({
    id: `${slug}-${index + 1}`,
    ...entry,
  }));
}

const skins: GameDetail = {
  slug: "skins",
  name: "Skins",
  icon: "target",
  kicker: "POT PLAY · HOLE BY HOLE",
  tagline:
    "Every hole is its own little pot. Post the low score alone and the money is yours — tie it and nobody wins, so the pot rolls onto the next tee and gets heavier.",
  metaDescription:
    "Learn how golf skins work, how carryovers build the pot, and which validation rules keep every hole fair.",
  traits: ["2–6 players", "Hole-by-hole", "Carryovers", "18 pots"],
  howTitle: "Eighteen holes, eighteen separate paydays.",
  intro:
    'Skins throws out your total score entirely. Each hole is a standalone bet worth one "skin," and the only thing that matters is beating everyone else on that hole. Nobody wins it outright? The skin carries, and the next hole is suddenly worth double.',
  steps: [
    { n: "1", title: "Agree what a skin is worth", body: "Pick a number — $5 is standard. In a foursome, every clean win means each of the other three hands you $5, so a skin pays $15." },
    { n: "2", title: "Low score alone takes it", body: "Not the lowest tied for it — the lowest, alone. Two players at par and everyone else worse? Nobody wins that hole." },
    { n: "3", title: "Ties carry the pot forward", body: "A halved hole rolls its skin onto the next one. Four quiet holes in a row and the fifth is worth five skins." },
    { n: "4", title: "Decide on validation", body: "Some groups make you birdie to collect a carried pot, or require a par minimum. Set the rule before the first tee, not after the argument." },
    { n: "5", title: "Net it at the 18th", body: "GoLo counts every skin, resolves every carry, and reduces the whole thing to one number each player pays or collects." },
  ],
  example: {
    kicker: "WATCH IT PLAY OUT",
    title: "A $5 skin that turned into a $75 hole.",
    lead: "Four players, $5 a skin — so every clean win pays $15. Then four holes get halved in a row and the eighth tee gets very quiet.",
    bets: [
      { tag: "H3", title: "One skin", detail: "Only birdie on the par 5 — clean win", value: "+$15", tone: "good" },
      { tag: "H4–7", title: "Four straight halves", detail: "Nobody wins clean — pot builds to five skins", value: "carry", tone: "neutral" },
      { tag: "H8", title: "Tom chips in", detail: "Takes all five skins — a $75 hole", value: "−$25", tone: "bad" },
      { tag: "H14", title: "Three skins", detail: "Two carried in, your 30-footer clears it", value: "+$45", tone: "good" },
      { tag: "REST", title: "The other eleven holes", detail: "Your 2 skins against Mike and Dave’s 7", value: "−$5", tone: "bad" },
    ],
    net: { label: "NET · YOU COLLECT", sub: "Every skin rolled into one transfer", value: "+$30" },
    phone: {
      opponent: "Four-player skins",
      through: "18",
      of: "/ 18",
      state: "FINAL",
      stateSub: "6 skins won",
      sequence: ["l", "l", "w", "h", "h", "h", "h", "l", "l", "w", "l", "h", "h", "w", "l", "l", "l", "w"],
      stats: [
        { label: "YOUR SKINS", status: "6", value: "+$90", tone: "good" },
        { label: "CARRIED", status: "6", value: "2 pots", tone: "neutral" },
        { label: "BIGGEST", status: "5", value: "$75 pot", tone: "good" },
      ],
      callout: { label: "CARRY", note: "Four halves made hole 8 worth five skins" },
      settleTitle: "You collect",
      settleSub: "All 18 skins, netted",
      settleValue: "$30",
      label: "Final four-player skins ledger: you won six skins and collect thirty dollars after every carryover is netted.",
    },
  },
  headings: {
    variations: { kicker: "CARRYOVERS & VARIATIONS", title: "The carryover is what makes skins mean.", lead: "Tie a hole and nobody wins it — the money rolls forward. GoLo tracks the running pot so you always know what’s on the line." },
    tips: { kicker: "PLAY SMART", title: "Skins pays birdies, not steady golf.", lead: "Every hole resets, so the money goes to whoever is willing to make one great swing at the right moment." },
    glossary: { kicker: "TALK THE TALK", title: "The terms you'll hear on the tee." },
    faq: { kicker: "SKINS, ANSWERED", title: "Before you tee it up." },
    related: { kicker: "STACK IT WITH", title: "Crews that play skins also run…", lead: "Skins is the easiest game to stack — run any of these alongside it and GoLo nets the whole pile into one number." },
    cta: { title: "Never argue about a carryover again.", lead: "Set your skin value, add the group, and GoLo tracks every carry, every validation, and who owes what at the 18th." },
  },
  variations: [
    { icon: "stack", title: "The carryover", body: "Every halved hole rolls forward. GoLo shows the live pot on the scoring screen before anyone stands over the next putt." },
    { icon: "pin", title: "Validation rules", body: "Make players earn a fat pot with birdie-to-win or a par minimum on carried skins." },
    { icon: "shield", title: "Net skins", body: "Play off handicaps and GoLo allocates strokes by stroke index, hole by hole." },
    { icon: "dice", title: "Stack the side pots", body: "Run skins beside greenies, barkies, or a birdie bounty, then settle once." },
  ],
  tips: [
    { tone: "good", title: "Go at the pin when the pot is fat", body: "A carried pot rewards one aggressive swing. Safe golf wins nothing when two other players are also making par." },
    { tone: "bad", title: "Par rarely wins alone", body: "In a foursome, someone usually makes par. If you need the pot, you probably need a birdie." },
    { tone: "good", title: "Settle the halve rule first", body: "Decide before the first tee what happens to a pot still carrying after 18." },
  ],
  glossary: [
    { term: "Skin", def: "The prize for one hole. Won only by the player with the outright lowest score on that hole." },
    { term: "Carryover (carry)", def: "A skin nobody won. It rolls onto the next hole, stacking on top of that hole’s own skin." },
    { term: "Push / halve", def: "A tied low score. Nobody collects and the pot carries." },
    { term: "Validation", def: "A house rule that a carried pot only pays out on a birdie or better." },
    { term: "Net skins", def: "Skins played off handicaps, with strokes allocated hole by hole." },
    { term: "Barkie / sandy", def: "Bonus mini-skins for making par after hitting a tree or getting up and down from a bunker." },
  ],
  faqs: gameFaqs("skins", [
    { q: "How much is one skin actually worth?", a: "Multiply your skin value by the number of opponents. At $5 a skin in a foursome, a winner collects $15. A carried pot worth five skins pays $75." },
    { q: "What happens when two players tie for low?", a: "Nobody wins the hole. The skin carries to the next hole and gets added to it." },
    { q: "Do carryovers ever stop stacking?", a: "Only if your group caps them. Some cap at three skins, some reset at the turn, and some let it ride all 18." },
    { q: "Can we play skins with handicaps?", a: "Yes. GoLo allocates strokes by the course stroke index, or you can run it straight gross." },
    { q: "What if the last hole gets halved?", a: "Choose before the round: split the pot, chip off, or carry it to next week." },
  ]),
  related: ["nassau", "birdies", "stroke-purse"],
  prev: "birdies",
  next: "nassau",
};

const strokePurse: GameDetail = {
  slug: "stroke-purse",
  name: "Stroke Purse",
  icon: "cash",
  kicker: "POT · LOW NET TAKES IT",
  tagline: "Everybody puts the same money in the middle. Eighteen holes later the lowest net score picks it up. No per-hole math, no presses — one number decides it.",
  metaDescription: "Set up a stroke purse with a fair buy-in, net or gross scoring, payout places, and a clean settlement after 18 holes.",
  traits: ["2–8 players", "18 holes", "One buy-in", "Net or gross"],
  howTitle: "One pot, one number, one very long back nine.",
  intro: "The simplest bet in golf and the hardest to hide in. Everyone buys in for the same amount before the round, plays their own ball for 18, and the lowest score after handicaps takes the purse. Two decisions do all the work: whether you settle on net or gross, and whether the money pays one place or two.",
  steps: [
    { n: "1", title: "Agree the buy-in", body: "One number, same for everybody, settled on the first tee. Most groups land between $10 and $50 a man." },
    { n: "2", title: "Net or gross", body: "Net is the default: handicap strokes come off before cards are compared. Gross works when everybody is within a couple of shots." },
    { n: "3", title: "Decide how it pays", body: "Winner-takes-all is cleanest. Paying 70/30 to first and second keeps two players interested walking to 18." },
    { n: "4", title: "Cap the disasters", body: "Max double par, or net double bogey, so one lost ball on the third hole does not end somebody’s afternoon." },
    { n: "5", title: "GoLo settles the purse", body: "Enter scores as you play. GoLo allocates strokes, keeps a live net leaderboard, and splits the places at the end." },
  ],
  scoring: {
    kicker: "SETTLE THESE FIRST",
    title: "Four questions, asked at the buy-in — not on the 18th green.",
    lead: "A purse only goes sideways when nobody agreed how it pays out. Here is where most groups land.",
    rows: [
      { title: "Net or gross?", detail: "Whether handicap strokes come off before cards are compared", value: "NET" },
      { title: "How many places pay?", detail: "One winner takes everything, or 70/30 to first and second", value: "70 / 30" },
      { title: "Where do handicaps come from?", detail: "A posted index converted for the tees", value: "COURSE HANDICAP" },
      { title: "What happens on a blow-up hole?", detail: "One triple can decide a purse before the turn", value: "MAX DOUBLE PAR" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT",
    title: "$40 a man, a $160 purse, and one net shot between first and second.",
    lead: "Four players, net scoring off the course handicap, paying 70/30. Mike shot the low gross round of the day and still finished second.",
    bets: [
      { tag: "69", tagSub: "NET", title: "You — 78 gross, 9 strokes", detail: "Birdie on 17 to take the low card", value: "+$72", tone: "good" },
      { tag: "70", tagSub: "NET", title: "Mike — 74 gross, 4 strokes", detail: "Low round of the day, one net shot short", value: "+$8", tone: "neutral" },
      { tag: "72", tagSub: "NET", title: "Tom — 86 gross, 14 strokes", detail: "Double on 12 cost him a place", value: "−$40", tone: "bad" },
      { tag: "75", tagSub: "NET", title: "Dave — 95 gross, 20 strokes", detail: "Two blow-ups, both capped at double par", value: "−$40", tone: "bad" },
    ],
    standings: [
      { name: "You", note: "1st · net 69", value: "+$72", tone: "good" },
      { name: "Mike", note: "2nd · net 70", value: "+$8", tone: "good" },
      { name: "Tom", note: "3rd · net 72", value: "−$40", tone: "bad" },
      { name: "Dave", note: "4th · net 75", value: "−$40", tone: "bad" },
    ],
    net: { label: "PURSE · YOU COLLECT", sub: "First place at 70%", value: "+$72" },
    phone: {
      opponent: "Four-player purse", through: "18", of: "/ 18", state: "FINAL", stateSub: "net leaderboard",
      sequence: ["h", "h", "w", "h", "h", "w", "h", "h", "h", "w", "l", "h", "w", "l", "h", "w", "h", "h"],
      stats: [
        { label: "YOUR NET", status: "69", value: "low card", tone: "good" },
        { label: "PURSE", status: "$160", value: "4 buy-ins", tone: "neutral" },
        { label: "PLACE", status: "1st", value: "of 4", tone: "good" },
      ],
      callout: { label: "PAYOUT", note: "First $112 · second $48 before entry cost" },
      settleTitle: "You collect", settleSub: "Purse payout, netted", settleValue: "$72",
      label: "Final stroke purse leaderboard: your net 69 wins the 160 dollar purse and your net settlement is 72 dollars.",
    },
  },
  headings: {
    variations: { kicker: "WAYS TO SPLIT IT", title: "Winner-takes-all is one option, not the only one.", lead: "How the purse pays out changes how the whole round feels. Four structures groups actually use." },
    tips: { kicker: "PLAY SMART", title: "A purse is won on your worst holes, not your best.", lead: "Nobody wins with the round they planned. They win by turning the three holes that got away into bogeys instead of doubles." },
    glossary: { kicker: "TALK THE TALK", title: "The words that decide who gets paid." },
    faq: { kicker: "STROKE PURSE, ANSWERED", title: "Before you put money in the middle." },
    related: { kicker: "PLAYS WELL WITH", title: "A purse plus one side game is the standard Saturday.", lead: "The purse settles the round. Everything else keeps the holes in between interesting." },
    cta: { title: "One buy-in. One number. No spreadsheet.", lead: "Set the purse, choose the places, and let GoLo keep the live net leaderboard honest." },
  },
  variations: [
    { icon: "cash", title: "Winner takes all", body: "One payout, nothing to argue about, and last place funds it." },
    { icon: "stack", title: "Two places, 70/30", body: "Pays first and second, keeping two players live down the stretch." },
    { icon: "trophy", title: "Front, back, and total", body: "Split the purse into thirds by nine for three chances to win." },
    { icon: "dice", title: "Quota purse", body: "Score Stableford points against a quota when the handicap spread is wide." },
  ],
  tips: [
    { tone: "good", title: "Know your net par before you swing", body: "On stroke holes a bogey can be a net par. Hit the shot that protects it." },
    { tone: "bad", title: "Doubles cost more than birdies pay", body: "A purse is decided by your worst three holes. Take the punch-out while bogey is available." },
    { tone: "good", title: "Play all 18", body: "Cards come back to the field, and the app shows the gap in real time." },
  ],
  glossary: [
    { term: "Purse", def: "The pooled buy-in. Everybody contributes the same amount and the field plays for it." },
    { term: "Buy-in", def: "What it costs to be in, agreed before the first tee." },
    { term: "Net score", def: "Your gross score minus handicap strokes." },
    { term: "Course handicap", def: "Your index adjusted for the tees you played." },
    { term: "Places", def: "How many finishers get paid." },
    { term: "Quota", def: "A Stableford variant that scores points against a target." },
  ],
  faqs: gameFaqs("stroke-purse", [
    { q: "Net or gross?", a: "Net, unless everybody is within a shot or two. Gross otherwise turns the purse into a bet on who is already better." },
    { q: "How big should the buy-in be?", a: "Big enough to pay attention on the last three, small enough that fourth place still buys a round afterwards. Ten to fifty dollars covers most groups." },
    { q: "Does it have to be winner-takes-all?", a: "No. Paying 70/30 to first and second is the most common compromise." },
    { q: "What happens on a tie?", a: "Split it or use a card playoff: back nine, last six, then the 18th. Pick one before teeing off." },
    { q: "Can we cap a blow-up hole?", a: "Yes. Max double par keeps one disaster from deciding the purse on the third hole." },
    { q: "Can we run a purse alongside other bets?", a: "Yes. GoLo tracks the purse, skins, and side bounties from the same card and nets the result." },
  ]),
  related: ["skins", "nassau", "birdies"], prev: "nassau", next: "wolf",
};

const wolf: GameDetail = {
  slug: "wolf", name: "Wolf", icon: "wolf", kicker: "TEAMS · ROTATING CAPTAIN",
  tagline: "One player is the Wolf on every hole. They watch the other three drives and pick a partner on the spot — or turn everyone down and take on the whole group alone for double.",
  metaDescription: "Learn the Wolf rotation, partner-pick rule, Lone Wolf payouts, and how points turn into one final settlement.",
  traits: ["4 players", "Rotating captain", "Points", "18 holes"],
  howTitle: "Every hole, somebody has to choose.",
  intro: "Wolf is match play with the teams redrawn every hole. The Wolf hits last, watches three drives land, and has to commit to a partner the moment each ball stops rolling — or pass on all of them and go it alone against three players for double the points.",
  steps: [
    { n: "1", title: "Set the rotation", body: "Four players, and the Wolf order is fixed before the round." },
    { n: "2", title: "The Wolf tees off last", body: "That is the advantage: the Wolf watches three drives before deciding what kind of hole this will be." },
    { n: "3", title: "Pick immediately or pass", body: "The instant a ball stops, the Wolf either takes that player or loses them for the hole." },
    { n: "4", title: "Best ball decides the hole", body: "Wolf and partner play best ball against the other two. Lone Wolf plays against the best of all three." },
    { n: "5", title: "Points become money", body: "GoLo multiplies the final spread by your point value and nets it to one number each." },
  ],
  scoring: {
    kicker: "SCORING TABLE", title: "Four outcomes, four payouts.", lead: "This is the standard sheet most groups use. Change any number in setup and GoLo scores your house version instead.",
    rows: [
      { tag: "2 PTS", title: "Wolf and partner win", detail: "Two points each to the Wolf and the player they picked", value: "×2" },
      { tag: "3 PTS", title: "Wolf and partner lose", detail: "Three points each to the two players who beat them", value: "×2", tone: "bad" },
      { tag: "4 PTS", title: "Lone Wolf wins", detail: "Four points to the Wolf", value: "×1" },
      { tag: "1 PT", title: "Lone Wolf loses", detail: "One point each to all three opponents", value: "×3", tone: "neutral" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT", title: "Three trips alone, one of them blind.", lead: "Four players, $1 a point. You were Wolf five times and went it alone on three of them — including the 18th, before anyone had hit a shot.",
    bets: [
      { tag: "H2", title: "Took Dave off the tee", detail: "His birdie held up — two points each", value: "+2", tone: "good" },
      { tag: "H7", title: "Lone Wolf, cashed", detail: "Passed on all three, stuffed it to four feet", value: "+4", tone: "good" },
      { tag: "H11", title: "Lone Wolf, buried", detail: "Alone into the wind, made bogey", value: "0", tone: "bad" },
      { tag: "H18", title: "Blind Wolf", detail: "Declared before anyone hit — double or nothing", value: "+8", tone: "good" },
      { tag: "REST", title: "The other fourteen holes", detail: "Partner wins and two holes beating the other team", value: "+12", tone: "neutral" },
    ],
    standings: [
      { name: "You", note: "26 points", value: "+$23", tone: "good" },
      { name: "Tom", note: "21 points", value: "−$2", tone: "bad" },
      { name: "Mike", note: "19 points", value: "−$6", tone: "bad" },
      { name: "Dave", note: "15 points", value: "−$15", tone: "bad" },
    ],
    net: { label: "NET · YOU COLLECT", sub: "Point spreads at $1 each", value: "+$23" },
    phone: {
      opponent: "Four-player Wolf", through: "18", of: "/ 18", state: "FINAL", stateSub: "26 points",
      sequence: ["l", "w", "l", "w", "l", "l", "w", "l", "w", "l", "l", "w", "l", "w", "l", "w", "l", "w"],
      stats: [
        { label: "YOUR PTS", status: "26", value: "1st of 4", tone: "good" },
        { label: "LONE WOLF", status: "2/3", value: "+12 pts", tone: "good" },
        { label: "AS WOLF", status: "5", value: "holes", tone: "neutral" },
      ],
      callout: { label: "BLIND WOLF", note: "Hole 18 · won for eight points" },
      settleTitle: "You collect", settleSub: "Point grid, netted", settleValue: "$23",
      label: "Final Wolf standings: you lead with 26 points and collect 23 dollars after the four-player point grid is netted.",
    },
  },
  headings: {
    variations: { kicker: "LONE WOLF & VARIATIONS", title: "Going alone is the whole game.", lead: "Picking the best drive is the safe play and it pays like the safe play. Every memorable Wolf hole is somebody deciding they don't need help." },
    tips: { kicker: "PLAY SMART", title: "You get one second to decide.", lead: "Take a partner the instant their ball stops. Wait too long and you are alone whether you wanted to be or not." },
    glossary: { kicker: "TALK THE TALK", title: "The terms you'll hear on the tee." },
    faq: { kicker: "WOLF, ANSWERED", title: "Before you tee it up." },
    related: { kicker: "STACK IT WITH", title: "Crews that run Wolf also play…", lead: "Wolf needs exactly four, so it pairs well with games that do not care how many are playing." },
    cta: { title: "Let the app remember whose turn it is.", lead: "Set the rotation and point sheet once. GoLo handles every partner pick, Lone Wolf, and settlement." },
  },
  variations: [
    { icon: "wolf", title: "Lone Wolf", body: "Turn down all three drives and play against the best ball of the group for four points." },
    { icon: "shield", title: "Blind Wolf", body: "Call it before a ball is struck. Most groups pay eight points if you pull it off." },
    { icon: "auto", title: "Rotation and the last two", body: "GoLo handles holes 17 and 18 using the trailing players or a restarted order." },
    { icon: "cash", title: "Points to cash", body: "Settle the spread between every pair, then collapse the grid into one number per player." },
  ],
  tips: [
    { tone: "good", title: "Judge the drive, not the driver", body: "Take the ball that is playable, even if it belongs to the higher handicap." },
    { tone: "bad", title: "Go alone on short holes", body: "One good swing can beat three average ones. A long par 4 against three players usually cannot." },
    { tone: "good", title: "Save blind Wolf for a reason", body: "Use it late when you need a swing, not early because it sounded fun." },
  ],
  glossary: [
    { term: "Wolf", def: "The captain for that hole, teeing off last and choosing a partner or going alone." },
    { term: "Lone Wolf", def: "The Wolf declining all three partners and playing against the best opposing ball." },
    { term: "Blind Wolf", def: "Declaring alone before anyone hits, usually for double the Lone Wolf value." },
    { term: "The rotation", def: "The fixed order that determines the Wolf on each hole." },
    { term: "Best ball", def: "The team’s better score on the hole, not a total." },
    { term: "Point value", def: "What each point is worth at settlement." },
  ],
  faqs: gameFaqs("wolf", [
    { q: "Does Wolf need exactly four players?", a: "Four is the game. Five can work with a five-hole rotation; with three, play Nassau or skins instead." },
    { q: "Do I really have to pick right after each drive?", a: "Yes. If you wait to see all three, you have passed on the first two." },
    { q: "What is Lone Wolf worth?", a: "A standard Lone Wolf win pays four points. Blind Wolf commonly doubles that to eight." },
    { q: "Who is Wolf on 17 and 18?", a: "Usually the two players furthest behind, though some groups restart the rotation. Set it before the round." },
    { q: "Can we play Wolf with handicaps?", a: "Yes. GoLo allocates strokes by stroke index before deciding each best ball." },
  ]),
  related: ["skins", "nassau", "bingo-bango-bongo"], prev: "stroke-purse", next: "bingo-bango-bongo",
};

const bingoBangoBongo: GameDetail = {
  slug: "bingo-bango-bongo", name: "Bingo Bango Bongo", icon: "dice", kicker: "POINTS · 3 PER HOLE",
  tagline: "Three points on every hole: first ball on the green, closest once everyone is on, and first in the cup. Your total score never comes into it — which is why the shortest hitter in the group keeps winning.",
  metaDescription: "Learn Bingo Bango Bongo: three points per hole, strict order of play, no handicap required, and 54 points to settle.",
  traits: ["2–4 players", "3 points / hole", "54 points", "No handicaps needed"],
  howTitle: "Fifty-four points that ignore your scorecard.",
  intro: "Every hole hands out exactly three points, one for each stage of the hole. Nobody is playing for a total — they are playing for whichever point is still available. The result is a game where a 20-handicap and a scratch player have a real fight, no strokes required.",
  steps: [
    { n: "1", title: "Agree what a point is worth", body: "A dollar a point is standard, and 54 points get handed out over 18 holes." },
    { n: "2", title: "Bingo — first on the green", body: "The first ball to come to rest on the putting surface takes it, no matter how many shots it took." },
    { n: "3", title: "Bango — closest once all are on", body: "When every ball is on the green, whoever is nearest the flag takes the point." },
    { n: "4", title: "Bongo — first in the hole", body: "First ball to disappear. Play in proper order and the furthest away gets the first crack." },
    { n: "5", title: "Play in strict order", body: "Furthest from the hole plays first, every time, all the way in. Break that and the game falls apart." },
  ],
  scoring: {
    kicker: "SCORING TABLE", title: "One for the approach, one for the shot, one for the putt.", lead: "Three points per hole, 54 across a round, and they almost never all go to the same player. That’s the whole appeal.",
    rows: [
      { tag: "BINGO", title: "First ball on the green", detail: "Rewards the player who is away — not the one who hit it furthest", value: "1 pt" },
      { tag: "BANGO", title: "Closest to the pin, all on", detail: "Measured once the last ball reaches the putting surface", value: "1 pt" },
      { tag: "BONGO", title: "First ball in the hole", detail: "Play in order and the longest putt gets the first look", value: "1 pt" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT", title: "Three points, three different players, one guy with nothing.", lead: "Hole 7, a 385-yard par 4, four players at $1 a point. Tom hit it 310 down the middle and walked off with zero.",
    bets: [
      { tag: "BINGO", title: "Dave", detail: "40 yards short of everyone — played first, pitched on", value: "+1", tone: "good" },
      { tag: "BANGO", title: "You", detail: "8-iron to six feet, closest once all four were on", value: "+1", tone: "good" },
      { tag: "BONGO", title: "Mike", detail: "Drained a 20-footer before anyone else had a look", value: "+1", tone: "good" },
      { tag: "TOM", title: "Nothing", detail: "Hit it 310 down the middle, played last all hole", value: "0", tone: "bad" },
    ],
    standings: [
      { name: "You", note: "5 bingo · 7 bango · 4 bongo", value: "+$10", tone: "good" },
      { name: "Dave", note: "15 points", value: "+$6", tone: "good" },
      { name: "Mike", note: "13 points", value: "−$2", tone: "bad" },
      { name: "Tom", note: "10 points", value: "−$14", tone: "bad" },
    ],
    net: { label: "NET · YOU COLLECT", sub: "54 points at $1", value: "+$10" },
    phone: {
      opponent: "Four-player points", through: "18", of: "/ 18", state: "FINAL", stateSub: "54 points awarded",
      sequence: ["w", "l", "w", "w", "l", "l", "w", "w", "l", "w", "w", "l", "w", "l", "w", "w", "l", "w"],
      stats: [
        { label: "BINGO", status: "5", value: "first on", tone: "good" },
        { label: "BANGO", status: "7", value: "closest", tone: "good" },
        { label: "BONGO", status: "4", value: "first in", tone: "neutral" },
      ],
      callout: { label: "ORDER", note: "Furthest away plays first until every ball is holed" },
      settleTitle: "You collect", settleSub: "Point spreads, netted", settleValue: "$10",
      label: "Final Bingo Bango Bongo standings: you lead with 16 points and collect ten dollars.",
    },
  },
  headings: {
    variations: { kicker: "ORDER & VARIATIONS", title: "The etiquette rule is the rule.", lead: "Furthest from the hole always plays first. Here it decides who gets a crack at the bingo and why the shortest hitter is dangerous." },
    tips: { kicker: "PLAY SMART", title: "The great equalizer, if you know where the points are.", lead: "Length is worth almost nothing. Being furthest out means playing first, and playing first is how you get the bingo." },
    glossary: { kicker: "TALK THE TALK", title: "The terms you'll hear on the tee." },
    faq: { kicker: "BINGO BANGO BONGO, ANSWERED", title: "Before you tee it up." },
    related: { kicker: "STACK IT WITH", title: "Crews that run Bingo Bango Bongo also play…", lead: "It does not care about your total score, so it stacks cleanly under anything that does." },
    cta: { title: "Fifty-four points is a lot to remember.", lead: "Let GoLo keep the order, award every point, and settle the spread after 18." },
  },
  variations: [
    { icon: "clock", title: "Order of play", body: "Furthest from the hole plays first, tee to green. It is the rule the game depends on." },
    { icon: "pin", title: "Ties and half points", body: "Split the point or carry it when two balls are genuinely even." },
    { icon: "shield", title: "No handicaps required", body: "The game equalizes itself, though GoLo can still allocate strokes if your group wants them." },
    { icon: "stack", title: "Run it under another game", body: "It stacks beneath skins or a stroke purse without changing the card." },
  ],
  tips: [
    { tone: "good", title: "Being short is an advantage", body: "You play first from 100 yards while everyone else waits — a free look at bingo." },
    { tone: "good", title: "Aim at the flag", body: "Bango only pays the closest ball. The fat side is good golf and bad Bingo Bango Bongo." },
    { tone: "bad", title: "Stop conceding putts", body: "A given putt is a bongo handed away. Everything goes in the hole." },
  ],
  glossary: [
    { term: "Bingo", def: "The point for the first ball on the green." },
    { term: "Bango", def: "The point for closest to the pin once every ball is on." },
    { term: "Bongo", def: "The point for the first ball holed." },
    { term: "Furthest first", def: "Whoever is away plays next, no exceptions." },
    { term: "Sweep", def: "Taking all three points on one hole." },
    { term: "Point value", def: "What each point pays at settlement." },
  ],
  faqs: gameFaqs("bingo-bango-bongo", [
    { q: "Do we need handicaps for this?", a: "No. The point order gives higher handicaps a genuine chance without allocated strokes." },
    { q: "What if nobody hits the green?", a: "Bingo goes to the first ball that eventually reaches the putting surface." },
    { q: "What if two players are on after the same shot?", a: "The ball that came to rest first takes bingo; if you cannot tell, split or carry the point." },
    { q: "Does order of play really matter?", a: "It is the game. Playing out of turn can hand away bingo or bongo." },
    { q: "Can we play with three or five?", a: "Three works well. Five gets slow because every point waits for all five balls." },
  ]),
  related: ["wolf", "skins", "closest-to-pin"], prev: "wolf", next: "closest-to-pin",
};

const closestToPin: GameDetail = {
  slug: "closest-to-pin", name: "Closest to Pin", icon: "pin", kicker: "SIDE BET · PAR 3s",
  tagline: "One tee shot, one pot. Stick it tighter than everybody else on the par 3s and collect — as long as you can still make par from there.",
  metaDescription: "Settle closest-to-pin greenies with clear on-green, par-to-collect, measuring, and carryover rules.",
  traits: ["Any group size", "Par 3s only", "Greenies", "Per-hole pot"],
  howTitle: "The oldest side bet in golf, and the easiest to argue about.",
  intro: "Also known as a greenie. On every par 3, whoever hits their tee shot closest to the flag takes that hole’s pot. Two rules do all the work: the ball usually has to finish on the green, and most groups make you two-putt for par before the money is actually yours.",
  steps: [
    { n: "1", title: "Mark the holes and the pot", body: "Usually all four par 3s, at $5 a head. Some groups mark one signature hole." },
    { n: "2", title: "Tee shots only", body: "Only the ball you hit from the tee counts. Reload and you are out of the running." },
    { n: "3", title: "Closest to the flag wins", body: "Nearest ball takes the pot — on the green, in almost every house rule." },
    { n: "4", title: "Then make your par", body: "Three-putt and the pot goes to the next closest, or carries." },
    { n: "5", title: "GoLo holds the pot", body: "Log the distance, apply the par rule, and carry anything nobody claimed." },
  ],
  scoring: {
    kicker: "SETTLE THESE FIRST", title: "Four questions, asked on the first tee — not the fourth green.", lead: "Every argument about a greenie traces back to one of these going unasked. Here’s what most groups land on.",
    rows: [
      { title: "Does it have to be on the green?", detail: "Fringe at three feet against surface at twenty", value: "ON THE GREEN" },
      { title: "Do you have to make par?", detail: "Whether closest still collects after a three-putt", value: "PAR TO COLLECT" },
      { title: "How do you measure it?", detail: "Eyeball, pace it, or use a rangefinder", value: "LOG IT IN THE APP" },
      { title: "Nobody claimed it — now what?", detail: "The pot dies or rides to the next par 3", value: "CARRY IT" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT", title: "Four par 3s, $5 a greenie, one three-putt that handed over a $30 hole.", lead: "Four players, greenies on every par 3, par-to-collect turned on. On the seventh Tom was inside everybody — and walked off with nothing.",
    bets: [
      { tag: "H3", tagSub: "168 YDS", title: "You — 11 ft 4 in", detail: "Only ball on the green, two-putt par", value: "+$15", tone: "good" },
      { tag: "H7", tagSub: "205 YDS", title: "Nobody", detail: "Tom was inside everyone, then three-putted", value: "carry", tone: "neutral" },
      { tag: "H12", tagSub: "142 YDS", title: "You — 3 ft 2 in", detail: "Tap-in birdie, and hole 7’s pot came with it", value: "+$30", tone: "good" },
      { tag: "H16", tagSub: "190 YDS", title: "Mike — 6 ft 8 in", detail: "Beat you by four feet and made the putt", value: "−$5", tone: "bad" },
    ],
    standings: [
      { name: "You", note: "3 greenies", value: "+$40", tone: "good" },
      { name: "Mike", note: "1 greenie", value: "$0", tone: "neutral" },
      { name: "Tom", note: "closest once, no par", value: "−$20", tone: "bad" },
      { name: "Dave", note: "never on in one", value: "−$20", tone: "bad" },
    ],
    net: { label: "NET · YOU COLLECT", sub: "Four par-3 pots, netted", value: "+$40" },
    phone: {
      opponent: "Four-player greenies", through: "18", of: "/ 18", state: "FINAL", stateSub: "four par 3s",
      sequence: ["h", "h", "w", "h", "h", "h", "h", "h", "h", "h", "h", "w", "h", "h", "h", "l", "h", "h"],
      stats: [
        { label: "GREENIES", status: "3", value: "of 4", tone: "good" },
        { label: "CLOSEST", status: "3′2″", value: "hole 12", tone: "good" },
        { label: "CARRIED", status: "1", value: "hole 7", tone: "neutral" },
      ],
      callout: { label: "PAR TO COLLECT", note: "Tom’s three-putt carried the hole 7 pot" },
      settleTitle: "You collect", settleSub: "Greenies, netted", settleValue: "$40",
      label: "Final closest-to-pin results: you win three of four greenies and collect forty dollars.",
    },
  },
  headings: {
    variations: { kicker: "GREENIES & VARIATIONS", title: "You don't have to stop at the par 3s.", lead: "A greenie is the classic, but the same bet works anywhere there is a green and an argument about who is closest." },
    tips: { kicker: "PLAY SMART", title: "The greenie isn't yours until the putt drops.", lead: "Par-to-collect separates this from a target contest. Four feet means nothing if you three-putt." },
    glossary: { kicker: "TALK THE TALK", title: "The terms you'll hear on the tee." },
    faq: { kicker: "CLOSEST TO PIN, ANSWERED", title: "Before you tee it up." },
    related: { kicker: "STACK IT WITH", title: "Nobody plays this one on its own.", lead: "Greenies are a garnish. Put a real game underneath them and let GoLo settle the whole plate." },
    cta: { title: "Retire the pencil on the greenie stick.", lead: "Mark the par 3s, log the distance, and let GoLo enforce par-to-collect." },
  },
  variations: [
    { icon: "pin", title: "Greenies on every par 3", body: "Four separate pots over 18 holes, one on each par 3." },
    { icon: "target", title: "Closest in two", body: "Run it on a par 5 and measure after everyone’s second shot." },
    { icon: "drive", title: "Approach on a marked par 4", body: "Settle on approach shots instead of tee shots." },
    { icon: "cash", title: "One pot for the round", body: "Everybody antes once and the tightest single shot takes the lot." },
  ],
  tips: [
    { tone: "good", title: "Play to the middle when the pin is tucked", body: "Thirty feet on the green beats hole-high in the sand every time." },
    { tone: "bad", title: "Club up into the wind", body: "Short is where trouble lives on par 3s. Coming up light means no greenie and probably no par." },
    { tone: "good", title: "Treat the par putt like the bet", body: "Under par-to-collect, the four-footer is the money shot." },
  ],
  glossary: [
    { term: "Greenie", def: "Closest to the pin on a par 3, on in one, par or better to collect." },
    { term: "On in one", def: "Your tee shot finished on the putting surface." },
    { term: "Par to collect", def: "Closest gets nothing unless they finish in par or better." },
    { term: "Carry", def: "An unclaimed pot rolling to the next par 3." },
    { term: "Greenie stick", def: "The pencil-and-peg marker used to log the current best distance." },
    { term: "Inside the leather", def: "Old shorthand for a distance close enough to call even." },
  ],
  faqs: gameFaqs("closest-to-pin", [
    { q: "Does the ball have to be on the green?", a: "In most groups, yes. Set it either way, but decide before the first par 3." },
    { q: "Do you really have to make par?", a: "It is the standard validation rule and makes the whole hole count." },
    { q: "How do we measure it?", a: "Eyeball obvious gaps, pace close ones, or use a rangefinder. Log it when you reach the green." },
    { q: "What if two players are the same distance?", a: "Split the pot or carry it to the next par 3." },
    { q: "Can we play it on par 4s and 5s?", a: "Yes. Closest in two and marked approaches use the same rules." },
    { q: "Can it be one pot for the whole round?", a: "Yes. Everyone antes once and the tightest tee shot across all par 3s wins." },
  ]),
  related: ["longest-drive", "birdies", "bingo-bango-bongo"], prev: "bingo-bango-bongo", next: "longest-drive",
};

const longestDrive: GameDetail = {
  slug: "longest-drive", name: "Longest Drive", icon: "drive", kicker: "SIDE BET · ONE MARKED HOLE",
  tagline: "Pick a hole, swing out of your shoes, and the longest ball that finishes in the fairway takes the pot. Short grass or nothing.",
  metaDescription: "Set up a longest-drive side bet with a marked hole, fairway-only rule, measurement, carryovers, and a clean payout.",
  traits: ["Any group size", "One marked hole", "Fairway only", "Single pot"],
  howTitle: "One hole where you can stop playing golf and just hit it.",
  intro: "Mark a hole before the round — usually a wide par 5 with a fairway you can miss and survive. Everybody hits a tee shot, the longest ball that finishes in the fairway takes the pot, and the guy who bombed it into the trees gets nothing but the story.",
  steps: [
    { n: "1", title: "Mark the hole and the pot", body: "Pick it on the first tee, not on the tee box. A wide par 5 downwind is the classic choice." },
    { n: "2", title: "Tee shots only, one ball", body: "The ball you play from the tee is the ball that counts. Reload and you are out." },
    { n: "3", title: "It has to finish in the fairway", body: "A 320 in the rough loses to a 280 in the middle, every time." },
    { n: "4", title: "Mark it as you go", body: "Log the yardage in GoLo as you walk past your ball." },
    { n: "5", title: "GoLo settles the pot", body: "Longest in the fairway collects. Nobody in play and the pot carries." },
  ],
  scoring: {
    kicker: "SETTLE THESE FIRST", title: "Four questions, asked before anybody tees off.", lead: "Longest drive falls apart on definitions. These are the four to nail down.",
    rows: [
      { title: "Does it have to be in the fairway?", detail: "A bomb in rough against a shorter ball in the middle", value: "IN THE FAIRWAY" },
      { title: "One hole, or every par 5?", detail: "A marked hole or separate pot on each long one", value: "ONE MARKED HOLE" },
      { title: "How do you measure it?", detail: "Sprinkler heads, rangefinder, or GPS", value: "LOG IT IN THE APP" },
      { title: "Nobody found the fairway — now what?", detail: "The pot dies or rides to the next one", value: "CARRY IT" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT", title: "One par 5, $10 a man, and a 318-yarder that finished six feet into the rough.", lead: "Four players, longest drive on the 12th, fairway only. Dave hit the longest ball anybody had seen all year and collected nothing for it.",
    bets: [
      { tag: "318", tagSub: "YDS", title: "Dave — right rough", detail: "Six feet off the fairway, and six feet is six feet", value: "−$10", tone: "bad" },
      { tag: "296", tagSub: "YDS", title: "You — middle of the fairway", detail: "Longest ball in the short grass", value: "+$30", tone: "good" },
      { tag: "291", tagSub: "YDS", title: "Mike — fairway, right side", detail: "Five yards from a different afternoon", value: "−$10", tone: "bad" },
      { tag: "274", tagSub: "YDS", title: "Tom — fairway, laid up", detail: "Hit 3-wood to stay in play", value: "−$10", tone: "neutral" },
    ],
    standings: [
      { name: "You", note: "longest in play", value: "+$30", tone: "good" },
      { name: "Dave", note: "longest overall, rough", value: "−$10", tone: "bad" },
      { name: "Mike", note: "291, fairway", value: "−$10", tone: "bad" },
      { name: "Tom", note: "274, fairway", value: "−$10", tone: "bad" },
    ],
    net: { label: "POT · YOU COLLECT", sub: "Longest ball in play", value: "+$30" },
    phone: {
      opponent: "Hole 12 side pot", through: "12", of: "/ 18", state: "FINAL", stateSub: "marked hole",
      sequence: ["h", "h", "h", "h", "h", "h", "h", "h", "h", "h", "h", "w", "h", "h", "h", "h", "h", "h"],
      stats: [
        { label: "IN PLAY", status: "296", value: "you, fairway", tone: "good" },
        { label: "OVERALL", status: "318", value: "Dave, rough", tone: "neutral" },
        { label: "POT", status: "$30", value: "3 payers", tone: "good" },
      ],
      callout: { label: "FAIRWAY ONLY", note: "Dave’s 318 yards did not qualify" },
      settleTitle: "You collect", settleSub: "One marked-hole pot", settleValue: "$30",
      label: "Longest-drive result on hole 12: your 296-yard fairway drive wins thirty dollars; Dave's 318-yard rough drive does not qualify.",
    },
  },
  headings: {
    variations: { kicker: "FORMATS & VARIATIONS", title: "One hole is the tradition. It does not have to be the whole bet.", lead: "Same swing, four structures — ways groups stretch longest drive past a single tee box." },
    tips: { kicker: "PLAY SMART", title: "Nobody wins longest drive from the trees.", lead: "The fairway rule is the whole game. Your normal driver at a wider target beats chasing 15 yards you have never hit on command." },
    glossary: { kicker: "TALK THE TALK", title: "The words that settle the tee box." },
    faq: { kicker: "LONGEST DRIVE, ANSWERED", title: "Before you grip it any tighter." },
    related: { kicker: "STACK IT WITH", title: "A tee-box bet needs a real game underneath it.", lead: "One pot on one hole is not a round. Put a game beneath it and let GoLo settle the whole thing." },
    cta: { title: "Settle the tee box before the beer cart gets there.", lead: "Mark the hole, log the yardages, and let fairway-only decide it." },
  },
  variations: [
    { icon: "drive", title: "Every par 5", body: "A separate pot on each long hole gives four swings that matter." },
    { icon: "target", title: "Long and straight", body: "Pair longest in the fairway with closest approach into the green." },
    { icon: "stack", title: "Last man standing", body: "The shortest ball in play drops out, and survivors hit again." },
    { icon: "cash", title: "Distance handicap", body: "Give shorter hitters yards instead of strokes." },
  ],
  tips: [
    { tone: "good", title: "Tee it forward and higher", body: "Use the widest angle and launch the ball; carry with less spin is where free yards live." },
    { tone: "bad", title: "Hit last if the order allows it", body: "Once you know the number, you know whether you need driver or a fairway-finding 3-wood." },
    { tone: "good", title: "Aim at the fat side", body: "Center-cut and 12 yards short beats hero-long and out of play." },
  ],
  glossary: [
    { term: "Longest drive", def: "The pot for the longest tee shot on a marked hole." },
    { term: "In play", def: "Finished in the fairway — the usual price of admission." },
    { term: "Marker", def: "The peg or plate left beside the current leading ball." },
    { term: "Tee shot only", def: "The first ball from the tee. Reloads and mulligans are out." },
    { term: "Carry", def: "Nobody found the fairway, so the pot rides to the next hole." },
    { term: "Distance handicap", def: "Agreed yards given to shorter hitters." },
  ],
  faqs: gameFaqs("longest-drive", [
    { q: "Does the ball have to be in the fairway?", a: "In almost every group, yes. Fairway-only keeps it a golf shot." },
    { q: "Which hole should we mark?", a: "A wide par 5 with helping wind is traditional. Avoid forced carries and fairways that run out." },
    { q: "How do we measure the distance?", a: "Use sprinklers, a rangefinder, or GPS and log the number as you pass the ball." },
    { q: "What if nobody hits the fairway?", a: "The pot can die or carry. Carrying makes the next marked hole worth twice as much." },
    { q: "Can we play it on every hole?", a: "You can, but par 5s only is usually enough swings without slowing the round." },
    { q: "How do we keep mismatched hitters fair?", a: "Give yards, not strokes. A 20- to 30-yard allowance can create a real contest." },
  ]),
  related: ["closest-to-pin", "birdies", "skins"], prev: "closest-to-pin", next: "birdies",
};

const birdies: GameDetail = {
  slug: "birdies", name: "Birdies", icon: "bird", kicker: "BOUNTY · ALL 18 HOLES",
  tagline: "A standing price on every birdie. Card one and everybody who did not pays you. Eagles double it, and nobody has ever complained about paying.",
  metaDescription: "Set a birdie bounty with gross or net scoring, eagle multipliers, payer rules, and a sensible cap.",
  traits: ["Any group size", "All 18 holes", "Per-birdie bounty", "Eagles double"],
  howTitle: "The only bet that pays you for playing well instead of for beating somebody.",
  intro: "Put a price on a birdie before the round. Every time somebody makes one, each of the other players hands over that amount — so a $5 birdie is worth $15 in a foursome. Eagles usually pay double, and because it sits on top of whatever else you are playing, most groups leave it running all season.",
  steps: [
    { n: "1", title: "Set the price", body: "$5 a birdie is standard. Much more and one hot nine becomes a real number." },
    { n: "2", title: "Gross or net", body: "Gross is simple. Net lets a 20 handicap into the bet when par on a stroke hole counts." },
    { n: "3", title: "Everybody else pays the maker", body: "This is a transfer, not a pot. Every other player pays." },
    { n: "4", title: "Eagles double, aces clear the table", body: "The traditional multiplier, with optional bonuses for streaks or hard holes." },
    { n: "5", title: "GoLo tallies every bounty", body: "Each bounty posts automatically and nets against what you owe." },
  ],
  scoring: {
    kicker: "SETTLE THESE FIRST", title: "Four questions, asked before the first birdie.", lead: "A bounty is simple until somebody makes five of them. Here is where most groups land.",
    rows: [
      { title: "Gross or net birdies?", detail: "Whether a handicap stroke can turn par into birdie", value: "GROSS" },
      { title: "What does an eagle pay?", detail: "Flat rate, double, or a number of its own", value: "DOUBLE" },
      { title: "Who pays the maker?", detail: "Every other player or only those who lost the hole", value: "EVERYBODY ELSE" },
      { title: "Is there a cap?", detail: "What happens when one player makes five", value: "SET A CAP" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT", title: "$5 a birdie, four players, and one eagle worth two of them.", lead: "Gross birdies, eagles double, no cap. Seven bounties changed hands over 18 holes and two players finished dead level.",
    bets: [
      { tag: "H4", tagSub: "BIRDIE", title: "You — 12-footer", detail: "Three payers at $5 each", value: "+$15", tone: "good" },
      { tag: "H9", tagSub: "BIRDIE", title: "Mike — drove the green", detail: "Everybody else pays, including you", value: "−$5", tone: "neutral" },
      { tag: "H13", tagSub: "EAGLE", title: "Tom — par 5 in two", detail: "Double bounty, and the round turned here", value: "−$10", tone: "bad" },
      { tag: "H17", tagSub: "BIRDIE", title: "You — tap-in", detail: "Back level with Tom with one to play", value: "+$15", tone: "good" },
    ],
    standings: [
      { name: "You", note: "3 birdies", value: "+$20", tone: "good" },
      { name: "Tom", note: "a birdie and an eagle", value: "+$20", tone: "good" },
      { name: "Mike", note: "2 birdies", value: "$0", tone: "neutral" },
      { name: "Dave", note: "none, paid all seven", value: "−$40", tone: "bad" },
    ],
    net: { label: "NET · YOU COLLECT", sub: "Seven bounties, netted", value: "+$20" },
    phone: {
      opponent: "Four-player bounty", through: "18", of: "/ 18", state: "FINAL", stateSub: "seven bounties",
      sequence: ["h", "l", "h", "w", "h", "l", "h", "w", "l", "h", "h", "h", "l", "h", "h", "h", "w", "h"],
      stats: [
        { label: "YOURS", status: "3", value: "+$45", tone: "good" },
        { label: "PAID OUT", status: "4", value: "−$25", tone: "neutral" },
        { label: "EAGLES", status: "1", value: "Tom, H13", tone: "neutral" },
      ],
      callout: { label: "EAGLE", note: "Tom’s eagle on 13 paid double" },
      settleTitle: "You collect", settleSub: "All bounties, netted", settleValue: "$20",
      label: "Final birdie bounty: you made three birdies and collect twenty dollars after seven bounties are netted.",
    },
  },
  headings: {
    variations: { kicker: "BOUNTIES & VARIATIONS", title: "A bounty does not have to stop at birdies.", lead: "Same mechanic every time: a fixed price on one specific thing happening. Four versions worth adding." },
    tips: { kicker: "PLAY SMART", title: "Birdies pay for the cheap risk, not every risk.", lead: "Attack the short par 5 and drivable par 4. Do not take on a tucked pin over water for the same bounty." },
    glossary: { kicker: "TALK THE TALK", title: "The bounties your group already argues about." },
    faq: { kicker: "BIRDIES, ANSWERED", title: "Before you set the price." },
    related: { kicker: "STACK IT WITH", title: "Bounties are the seasoning, not the meal.", lead: "Birdies runs on top of whatever your group already plays. Pick the game underneath it." },
    cta: { title: "Put a price on the best shot you hit all day.", lead: "Choose the bounty and eagle multiplier. GoLo posts each one while you play." },
  },
  variations: [
    { icon: "bird", title: "Net birdies", body: "A par on a stroke hole counts, giving a high handicap a real chance." },
    { icon: "cash", title: "Escalating bounty", body: "Every birdie raises the price of the next one." },
    { icon: "dice", title: "Barkies, sandies, and Arnies", body: "Cheap bounties for recovery shots and rounds that never touch a fairway." },
    { icon: "stack", title: "Team birdies", body: "Play as partners and let either ball count." },
  ],
  tips: [
    { tone: "good", title: "Hunt them on reachable holes", body: "Two par 5s and a short par 4 are where most bounties are made." },
    { tone: "bad", title: "Do not let a bounty cost the main bet", body: "A $15 birdie chase can lose a $50 Nassau hole. Check what else is riding." },
    { tone: "good", title: "Long par 3s are worth nothing", body: "Take the middle, take par, and let somebody else pay for the hero shot." },
  ],
  glossary: [
    { term: "Birdie", def: "One under par on a hole." },
    { term: "Eagle", def: "Two under par, usually worth double the birdie bounty." },
    { term: "Bounty", def: "A fixed amount paid whenever a specific event happens." },
    { term: "Net birdie", def: "A par on a hole where your handicap gives you a stroke." },
    { term: "Cap", def: "An agreed ceiling on one player’s round total." },
    { term: "Barkie", def: "Par or better after hitting a tree." },
  ],
  faqs: gameFaqs("birdies", [
    { q: "How much should a birdie be worth?", a: "Five dollars is the default: enough that a hot nine matters without paying the best player a salary." },
    { q: "Should we count net birdies?", a: "Yes when the handicap spread is wide. A bet nobody can win is not much of a bet." },
    { q: "Do eagles really pay double?", a: "Almost always, and a hole-in-one commonly clears the table. Set it before the shot." },
    { q: "Who pays the maker?", a: "Everybody else pays. That is what makes it a bounty rather than a match." },
    { q: "What if somebody goes on a run?", a: "Use a cap so a great round stays a great story instead of an awkward bill." },
    { q: "Can we stack it on another game?", a: "Yes. Birdies runs underneath Nassau, a purse, or skins and GoLo nets it all." },
  ]),
  related: ["skins", "nassau", "closest-to-pin"], prev: "longest-drive", next: "skins",
};

export const gameDetails = {
  skins,
  nassau,
  "stroke-purse": strokePurse,
  wolf,
  "bingo-bango-bongo": bingoBangoBongo,
  "closest-to-pin": closestToPin,
  "longest-drive": longestDrive,
  birdies,
} satisfies Record<GameSlug, GameDetail>;

export const gameDetailSlugsWithContent = Object.keys(gameDetails) as GameSlug[];

export function findGameDetail(slug: string): GameDetail | undefined {
  return gameDetails[slug as GameSlug];
}
