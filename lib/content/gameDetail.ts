/**
 * Long-form per-game content, keyed by slug. Copy is verbatim from
 * design_handoff/reference/Golo Golf - Game Nassau.dc.html.
 *
 * The detail page renders entirely from this shape, so adding the next game is
 * a data edit — never a new page file. A slug only earns an entry once its
 * copy is written; games.ts must mark the same slug `hasDetailPage`.
 */

import type { IconName } from "@/components/ui/Icon";
import { rosterGame, type GameSlug } from "@/lib/content/games";

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
  /**
   * The <title>, without the "· GoLo" suffix. Written for the query
   * ("how to play skins golf"), where the H1 stays the game's name.
   */
  seoTitle: string;
  /**
   * The article that goes past the rules for this game, linked under the tips.
   * Guide and article own different searches; this link tells readers (and
   * crawlers) which one to read for what.
   */
  deeperReading?: { href: string; label: string };
  /**
   * ISO date of the last substantive change to the guide's rules, examples or
   * GoLo claims; never copy polish. Becomes the sitemap's lastmod. Guides
   * without one have no lastmod rather than a made-up one.
   */
  updated?: string;
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
      /** The GoLo game the phone shows, when it isn't the page's own game. */
      game?: string;
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
  /**
   * `href` links the term to its glossary entry (#164), for the few terms
   * the glossary explains past what the guide needs.
   */
  glossary: { term: string; def: string; href?: string }[];
  faqs: { id: string; q: string; a: string }[];
  /** Slugs from games.ts. */
  related: GameSlug[];
  prev?: GameSlug;
  next?: GameSlug;
};

/** A guide as written here. Its name and icon come from the roster in games.ts. */
type GameDetailCopy = Omit<GameDetail, "name" | "icon">;

function withRoster(copy: GameDetailCopy): GameDetail {
  const { name, icon } = rosterGame(copy.slug);
  return { ...copy, name, icon };
}

const nassau: GameDetailCopy = {
  slug: "nassau",
  updated: "2026-10-11",
  seoTitle: "How to Play a Nassau in Golf: Rules & Presses",
  deeperReading: { href: "/blog/nassau", label: "Deeper reading: the $2 Nassau, presses and house rules →" },
  kicker: "MATCH PLAY · 3 MATCHES IN 1",
  tagline:
    "The clubhouse classic: three separate matches running at once — the front nine, the back nine, and the whole eighteen. Lose a nine and you can always press to win it back.",
  metaDescription:
    "Front, back and total, plus the press. How a Nassau works, what a press really costs, and the terms you'll hear on the tee.",
  traits: ["2–4 players", "Match play", "3 matches in 1", "18 holes"],
  howTitle: "One round. Three matches. Endless comebacks.",
  intro:
    'A Nassau is really three matches stacked on top of each other. You play match play — win a hole and you go one "up," lose one and you fall "down." Whoever’s ahead when a nine finishes wins that match, and the overall 18 is its own separate prize.',
  steps: [
    {
      n: "1",
      title: "Set three equal amounts",
      body: "Agree on an amount — say $20 — that rides on the front nine, the back nine, and the overall 18. Three matches, one round.",
    },
    {
      n: "2",
      title: "Play it as match play",
      body: "Forget stroke totals. Win a hole outright and you go 1 up; lose it and you’re 1 down. Halved holes leave the match where it is.",
    },
    {
      n: "3",
      title: "Close out each nine",
      body: "Whoever’s ahead when the 9th and 18th holes finish wins that nine’s match. The overall match is decided across all 18.",
    },
    {
      n: "4",
      title: "Press when you’re down",
      body: 'Fall two holes behind and you can "press" — start a brand-new match for the remaining holes to claw it back.',
    },
    {
      n: "5",
      title: "Net it at the 18th",
      body: "GoLo tallies all three matches and reduces them to a single amount each player owes or is owed. It doesn’t take presses on a Nassau, so those still go on the card.",
    },
  ],
  example: {
    kicker: "WATCH IT PLAY OUT",
    title: "A $20 Nassau, front to back.",
    lead: "You and Tom play $20 on each match. Here's how a full round shakes out — three matches, one net number at the end.",
    // +20 − 20 + 20 = +20. Keep these reconciled with net.value, and the
    // phone's sequence with its stats: front 4–2, back 3–4, total 7–6, and no
    // match decided before its last hole (dormie on 17, a half on 18).
    // No press: GoLo's Nassau doesn't take them (presses are Overall Match only).
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
    ],
    net: {
      label: "NET · YOU’RE OWED",
      sub: "Every match rolled into one number",
      value: "+$20",
    },
    phone: {
      opponent: "You vs Tom",
      through: "18",
      of: "/ 18",
      state: "FINAL",
      stateSub: "match complete",
      sequence: [
        "w", "h", "l", "w", "h", "l", "w", "h", "w",
        "l", "w", "l", "h", "w", "l", "w", "l", "h",
      ],
      stats: [
        { label: "FRONT", status: "2↑", value: "+$20", tone: "good" },
        { label: "BACK", status: "1↓", value: "−$20", tone: "bad" },
        { label: "TOTAL", status: "1↑", value: "+$20", tone: "good" },
      ],
      callout: {
        label: "DORMIE",
        note: "2 up with two to play; a half on 18 won it",
      },
      settleTitle: "Tom owes you",
      settleSub: "3 matches, netted",
      settleValue: "$20",
      label:
        "The finished Nassau against Tom: front nine won for $20, back nine lost for $20, the overall match won for $20 — Tom owes you $20.",
    },
  },
  headings: {
    variations: {
      kicker: "PRESSES & VARIATIONS",
      title: "The press is where Nassau gets dangerous.",
      lead: "Down bad on a nine? Open a new match for the holes that are left. GoLo's Nassau doesn't take presses; in the app, presses are on the Overall Match game.",
    },
    tips: {
      kicker: "PLAY SMART",
      title: "When to press — and when to shut up.",
      lead: "A Nassau rewards momentum. Read your own game before you throw another match at a nine you're spraying all over the lot.",
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
      lead: "Pick the amount, tap the players, and let GoLo track all three matches to the last putt.",
    },
  },
  variations: [
    {
      icon: "press",
      title: "The press",
      body: "Down two on a nine? Fire a new match for the holes that remain. Win it and you cancel out the damage — lose it and you’re in deeper.",
    },
    {
      icon: "auto",
      title: "2-down auto-press",
      body: "A common house rule: a new press opens automatically the moment anyone falls two behind, so nobody has to remember to call it. GoLo doesn’t do automatic presses yet.",
    },
    {
      icon: "stack",
      title: "Presses stack",
      body: "Each press is its own mini-match. On a wild nine you can have two or three running at once, which is where the card usually stops adding up.",
    },
    {
      icon: "dice",
      title: "Escalating amounts",
      body: 'Play a "2-2-2" that becomes a "4-4-4," or a team Nassau with best-ball. Set the amount and format up front and let the app score it.',
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
      body: "Pressing while you’re spraying it everywhere just doubles the bleeding. Sometimes the smart press is no press.",
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
      def: "A three-part game: separate matches on the front nine, back nine, and the total 18 holes.",
    },
    {
      term: "1 up / 2 down",
      def: 'Your match standing. "2 up" means you’ve won two more holes than your opponent so far.',
    },
    {
      term: "Press",
      def: "A new side match opened mid-nine by the player who’s behind, covering only the holes that remain.",
      href: "/glossary#press",
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
      def: "You’re up by exactly as many holes as are left — you can’t lose the match, only win or tie it.",
    },
  ],
  faqs: [
    {
      id: "one-bet-or-three",
      q: "Is a Nassau one match or three?",
      a: 'Three. A "$20 Nassau" means $20 on the front nine, $20 on the back nine, and $20 on the overall 18 — so the most you can win or lose (before presses) is $60.',
    },
    {
      id: "what-is-a-press",
      q: "What exactly is a press?",
      a: "When you fall two holes down, you can start a new match — same amount — that only covers the holes still to play on that nine. It’s a fresh chance to get even on a nine you’ve already lost. GoLo doesn’t take presses on a Nassau; in the app they’re on the Overall Match game.",
    },
    {
      id: "auto-press",
      q: "Can presses happen automatically?",
      a: 'In a lot of groups, yes: "2-down automatic" opens a new press every time someone falls two behind, without anyone calling it. GoLo doesn’t do automatic presses yet. Its Nassau takes no presses at all, and on the Overall Match game the side that’s 2 down calls each one.',
    },
    {
      id: "handicaps",
      q: "Do handicaps apply to a Nassau?",
      a: "They can. Enter each player’s index and GoLo allocates strokes hole by hole using the course stroke index, so a net Nassau plays fair between a 5 and a 20. You can also run it straight-up gross.",
    },
  ],
  related: ["skins", "wolf", "best-score"],
  prev: "skins",
  next: "best-score",
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

const skins: GameDetailCopy = {
  slug: "skins",
  seoTitle: "How to Play Skins in Golf: Rules & Carryovers",
  deeperReading: { href: "/blog/skins-carryover", label: "Deeper reading: how skins carryovers stack up →" },
  kicker: "SKINS · HOLE BY HOLE",
  tagline:
    "Every hole is its own skin. Post the low score alone and the skin is yours — tie it and nobody wins, so the skin carries onto the next tee and gets heavier.",
  metaDescription:
    "Learn how golf skins work, how carried skins stack up, and which validation rules keep every hole fair.",
  traits: ["2–6 players", "Hole-by-hole", "Carryovers", "18 skins"],
  howTitle: "Eighteen holes, eighteen separate paydays.",
  intro:
    'Skins throws out your total score entirely. Each hole is a standalone game worth one "skin," and the only thing that matters is beating everyone else on that hole. Nobody wins it outright? The skin carries, and the next hole is suddenly worth double.',
  steps: [
    { n: "1", title: "Agree what a skin is worth", body: "Pick a number — $5 is standard. In a foursome, every clean win means each of the other three hands you $5, so a skin pays $15." },
    { n: "2", title: "Low score alone takes it", body: "Not the lowest tied for it — the lowest, alone. Two players at par and everyone else worse? Nobody wins that hole." },
    { n: "3", title: "Ties carry the skin forward", body: "A halved hole rolls its skin onto the next one. Four quiet holes in a row and the fifth is worth five skins." },
    { n: "4", title: "Decide on validation", body: "Some groups make you birdie to win carried skins, or require a par minimum. Set the rule before the first tee, not after the argument." },
    { n: "5", title: "Net it at the 18th", body: "GoLo counts every skin, resolves every carry, and reduces the whole thing to one number each player owes or is owed." },
  ],
  example: {
    kicker: "WATCH IT PLAY OUT",
    title: "A $5 skin that turned into a $75 hole.",
    lead: "Four players, $5 a skin — so every clean win pays $15. Then four holes get halved in a row and the eighth tee gets very quiet.",
    bets: [
      { tag: "H3", title: "One skin", detail: "Only birdie on the par 5 — clean win", value: "+$15", tone: "good" },
      { tag: "H4–7", title: "Four straight halves", detail: "Nobody wins clean — carry builds to five skins", value: "carry", tone: "neutral" },
      { tag: "H8", title: "Tom chips in", detail: "Takes all five skins — a $75 hole", value: "−$25", tone: "bad" },
      { tag: "H14", title: "Three skins", detail: "Two carried in, your 30-footer clears it", value: "+$45", tone: "good" },
      { tag: "REST", title: "The other eleven holes", detail: "Your 2 skins against Mike and Dave’s 7", value: "−$5", tone: "bad" },
    ],
    net: { label: "NET · YOU’RE OWED", sub: "Every skin rolled into one number", value: "+$30" },
    phone: {
      opponent: "Four-player skins",
      through: "18",
      of: "/ 18",
      state: "FINAL",
      stateSub: "6 skins won",
      sequence: ["l", "l", "w", "h", "h", "h", "h", "l", "l", "w", "l", "h", "h", "w", "l", "l", "l", "w"],
      stats: [
        { label: "YOUR SKINS", status: "6", value: "+$90", tone: "good" },
        { label: "CARRIED", status: "6", value: "2 carries", tone: "neutral" },
        { label: "BIGGEST", status: "5", value: "$75 hole", tone: "good" },
      ],
      callout: { label: "CARRY", note: "Four halves made hole 8 worth five skins" },
      settleTitle: "You’re owed",
      settleSub: "All 18 skins, netted",
      settleValue: "$30",
      label: "Final four-player skins ledger: you won six skins and are owed thirty dollars after every carryover is netted.",
    },
  },
  headings: {
    // "GoLo tracks every carried skin": capabilities.ts live-skins.
    variations: { kicker: "CARRYOVERS & VARIATIONS", title: "The carryover is what makes skins mean.", lead: "Tie a hole and nobody wins it — the skin carries forward. GoLo tracks every carried skin so you always know what the next hole is worth." },
    tips: { kicker: "PLAY SMART", title: "Skins pays birdies, not steady golf.", lead: "Every hole resets, so the money goes to whoever is willing to make one great swing at the right moment." },
    glossary: { kicker: "TALK THE TALK", title: "The terms you'll hear on the tee." },
    faq: { kicker: "SKINS, ANSWERED", title: "Before you tee it up." },
    related: { kicker: "STACK IT WITH", title: "Crews that play skins also run…", lead: "Skins is the easiest game to stack — run any of these alongside it and GoLo nets the whole pile into one number." },
    cta: { title: "Never argue about a carryover again.", lead: "Set your skin value, add the group, and GoLo tracks every carry and who owes what at the 18th." },
  },
  variations: [
    // "live skins on the scoring screen": capabilities.ts live-skins.
    { icon: "stack", title: "The carryover", body: "Every halved hole rolls forward. GoLo shows the live skins on the scoring screen before anyone stands over the next putt." },
    { icon: "pin", title: "Validation rules", body: "Make players earn a big carry with birdie-to-win or a par minimum on carried skins." },
    { icon: "shield", title: "Net skins", body: "Play off handicaps and GoLo allocates strokes by stroke index, hole by hole." },
    { icon: "dice", title: "Stack the side games", body: "Run skins beside a Nassau, Best Score or Wolf, then settle once." },
  ],
  tips: [
    { tone: "good", title: "Go at the pin when the carry is big", body: "A big carry rewards one aggressive swing. Safe golf wins nothing when two other players are also making par." },
    { tone: "bad", title: "Par rarely wins alone", body: "In a foursome, someone usually makes par. If you need the skin, you probably need a birdie." },
    { tone: "good", title: "Settle the halve rule first", body: "Decide before the first tee what happens to skins still carrying after 18." },
  ],
  glossary: [
    { term: "Skin", def: "The prize for one hole. Won only by the player with the outright lowest score on that hole." },
    { term: "Carryover (carry)", def: "A skin nobody won. It rolls onto the next hole, stacking on top of that hole’s own skin.", href: "/glossary#carryover" },
    { term: "Push", def: "A tied low score. Nobody wins the hole and the skin carries." },
    { term: "Halve", def: "The match-play word for a tied hole. In skins the same tie is a push, and the skin carries." },
    { term: "Validation", def: "A house rule that carried skins only count on a birdie or better." },
    { term: "Net skins", def: "Skins played off handicaps, with strokes allocated hole by hole." },
    { term: "Barkie / sandy", def: "Bonus mini-skins for making par after hitting a tree or getting up and down from a bunker." },
  ],
  faqs: gameFaqs("skins", [
    { q: "How much is one skin actually worth?", a: "Multiply your skin value by the number of opponents. At $5 a skin in a foursome, a winner is owed $15. A carry worth five skins pays $75." },
    { q: "What happens when two players tie for low?", a: "Nobody wins the hole. The skin carries to the next hole and gets added to it." },
    { q: "Do carryovers ever stop stacking?", a: "Only if your group caps them. Some cap at three skins, some reset at the turn, and some let it ride all 18." },
    { q: "Can we play skins with handicaps?", a: "Yes. GoLo allocates strokes by the course stroke index, or you can run it straight gross." },
    { q: "What if the last hole gets halved?", a: "Choose before the round: split the skins, chip off, or carry them to next week." },
  ]),
  related: ["nassau", "birdies", "best-score"],
  prev: "birdies",
  next: "nassau",
};

const bestScore: GameDetailCopy = {
  slug: "best-score",
  deeperReading: { href: "/blog/index-vs-course-handicap", label: "Deeper reading: index vs. course handicap, and the number Best Score is played off →" },
  updated: "2026-10-11",
  seoTitle: "Best Score Golf Game: Net or Gross, Places & Splits",
  kicker: "BEST SCORE · ONE NUMBER DECIDES IT",
  tagline: "Everybody plays for the same amount. Eighteen holes later the best score takes it. No per-hole math, no presses — one number decides it.",
  metaDescription: "Set up Best Score in GoLo with a fair amount, net or gross scoring, how many places split it, and a clean settle-up after 18 holes.",
  traits: ["2–8 players", "18 holes", "One amount", "Net or gross"],
  howTitle: "One amount, one number, one very long back nine.",
  intro: "Best Score is the simplest side game in golf and the hardest to hide in. Everyone puts in the same amount before the round, plays their own ball for 18, and the best score after handicaps takes it, or the top two or three split it. Two decisions do all the work: whether you settle on net or gross, and whether one place takes it or more.",
  steps: [
    { n: "1", title: "Agree the amount", body: "One number, same for everybody, settled on the first tee. Most groups land between $10 and $50 a man." },
    { n: "2", title: "Net or gross", body: "Net is the default: handicap strokes come off before cards are compared. Gross works when everybody is within a couple of shots." },
    { n: "3", title: "Decide how it pays", body: "Winner-takes-all is cleanest. Splitting 70/30 between first and second keeps two players interested walking to 18. GoLo gives it to one place, or splits the top two or three evenly." },
    { n: "4", title: "Cap the disasters", body: "Plenty of groups cap a hole at double par, so one lost ball on the third hole does not end somebody’s afternoon. GoLo scores what you enter, so put in the capped number." },
    { n: "5", title: "GoLo settles Best Score", body: "Enter scores as you play. GoLo allocates strokes, keeps a live net leaderboard, and splits the places at the end." },
  ],
  scoring: {
    kicker: "SETTLE THESE FIRST",
    title: "Four questions, asked on the first tee — not on the 18th green.",
    lead: "Best Score only goes sideways when nobody agreed how it splits. Here is where most groups land.",
    rows: [
      { title: "Net or gross?", detail: "Whether handicap strokes come off before cards are compared", value: "NET" },
      { title: "How many places pay?", detail: "One winner, or the top two or three in equal shares", value: "WINNER TAKES ALL" },
      { title: "Where do handicaps come from?", detail: "A posted index converted for the tees", value: "COURSE HANDICAP" },
      { title: "What happens on a blow-up hole?", detail: "One triple can decide Best Score before the turn. GoLo scores what you enter", value: "MAX DOUBLE PAR" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT",
    title: "$40 a player, four players, and one net shot between first and second.",
    lead: "Four players, net scoring off the course handicap, winner takes all. Mike shot the low gross round of the day and finished second, which pays the same as fourth.",
    bets: [
      { tag: "69", tagSub: "NET", title: "You — 78 gross, 9 strokes", detail: "Birdie on 17 to take the low card", value: "+$120", tone: "good" },
      { tag: "70", tagSub: "NET", title: "Mike — 74 gross, 4 strokes", detail: "Low round of the day, one net shot short", value: "−$40", tone: "bad" },
      { tag: "72", tagSub: "NET", title: "Tom — 86 gross, 14 strokes", detail: "A double on 12 left him three back", value: "−$40", tone: "bad" },
      { tag: "75", tagSub: "NET", title: "Dave — 95 gross, 20 strokes", detail: "Two blow-ups, both entered at double par", value: "−$40", tone: "bad" },
    ],
    standings: [
      { name: "You", note: "1st · net 69", value: "+$120", tone: "good" },
      { name: "Mike", note: "2nd · net 70", value: "−$40", tone: "bad" },
      { name: "Tom", note: "3rd · net 72", value: "−$40", tone: "bad" },
      { name: "Dave", note: "4th · net 75", value: "−$40", tone: "bad" },
    ],
    net: { label: "NET · YOU’RE OWED", sub: "$40 from each of the other three", value: "+$120" },
    phone: {
      opponent: "Four-player Best Score", through: "18", of: "/ 18", state: "FINAL", stateSub: "net leaderboard",
      sequence: ["h", "h", "w", "h", "h", "w", "h", "h", "h", "w", "l", "h", "w", "l", "h", "w", "h", "h"],
      stats: [
        { label: "YOUR NET", status: "69", value: "low card", tone: "good" },
        { label: "TOTAL", status: "$160", value: "4 × $40", tone: "neutral" },
        { label: "PLACE", status: "1st", value: "of 4", tone: "good" },
      ],
      callout: { label: "RESULT", note: "Winner takes all: $40 from each of the other three" },
      settleTitle: "You’re owed", settleSub: "Best Score, netted", settleValue: "$120",
      label: "Final Best Score leaderboard: your net 69 takes it, winner takes all, and you are owed 120 dollars.",
    },
  },
  headings: {
    variations: { kicker: "WAYS TO SPLIT IT", title: "Winner-takes-all is one option, not the only one.", lead: "How Best Score splits changes how the whole round feels. Four structures groups actually use. GoLo does winner-takes-all and even splits of the top two or three; 70/30, a split by nines and a quota version are house rules it does not track." },
    tips: { kicker: "PLAY SMART", title: "Best Score is won on your worst holes, not your best.", lead: "Nobody wins with the round they planned. They win by turning the three holes that got away into bogeys instead of doubles." },
    glossary: { kicker: "TALK THE TALK", title: "The words that decide who takes it." },
    faq: { kicker: "BEST SCORE, ANSWERED", title: "Before you agree the amount." },
    related: { kicker: "PLAYS WELL WITH", title: "Best Score plus one side game is the standard Saturday.", lead: "Best Score settles the round. Everything else keeps the holes in between interesting." },
    cta: { title: "One amount. One number. No spreadsheet.", lead: "Set the amount, choose the places, and let GoLo keep the live net leaderboard honest." },
  },
  variations: [
    { icon: "cash", title: "Winner takes all", body: "One winner, one number, nothing to argue about." },
    { icon: "stack", title: "Two places, 70/30", body: "First and second split it, keeping two players live down the stretch. GoLo splits two places evenly instead." },
    { icon: "trophy", title: "Front, back, and total", body: "Split it into thirds by nine for three chances to win." },
    { icon: "dice", title: "Quota scoring", body: "Score Stableford points against a quota when the handicap spread is wide." },
  ],
  tips: [
    { tone: "good", title: "Know your net par before you swing", body: "On stroke holes a bogey can be a net par. Hit the shot that protects it." },
    { tone: "bad", title: "Doubles cost more than birdies pay", body: "Best Score is decided by your worst three holes. Take the punch-out while bogey is available." },
    { tone: "good", title: "Play all 18", body: "Cards come back to the field, and the app shows the gap in real time." },
  ],
  glossary: [
    { term: "Best Score", def: "One amount, the same for everybody; the best score takes it, or the top two or three split it." },
    { term: "Amount", def: "What each player plays for, agreed before the first tee." },
    { term: "Net score", def: "Your gross score minus handicap strokes.", href: "/glossary#net-score" },
    { term: "Course handicap", def: "Your index adjusted for the tees you played." },
    { term: "Places", def: "How many finishers split it." },
    { term: "Quota", def: "A Stableford variant that scores points against a target." },
  ],
  faqs: gameFaqs("best-score", [
    { q: "Net or gross?", a: "Net, unless everybody is within a shot or two. Gross otherwise turns Best Score into a contest of who is already better." },
    { q: "How big should the amount be?", a: "Big enough to pay attention on the last three, small enough that fourth place still buys a round afterwards. Ten to fifty dollars covers most groups." },
    { q: "Does it have to be winner-takes-all?", a: "No. Splitting 70/30 between first and second is the most common compromise. GoLo gives it to one place, or splits the top two or three evenly; it does not do 70/30." },
    { q: "What happens on a tie?", a: "Split it or use a card playoff: back nine, last six, then the 18th. Pick one before teeing off. GoLo splits ties evenly and has no card playoff." },
    { q: "Can we cap a blow-up hole?", a: "Yes, as a house rule. GoLo does not cap scores, so enter the capped number — double par, say — when that is what your group agreed." },
    { q: "Can we run Best Score alongside other games?", a: "Yes. GoLo tracks Best Score, skins, and side bounties from the same card and nets the result." },
  ]),
  related: ["skins", "nassau", "birdies"], prev: "nassau", next: "wolf",
};

const wolf: GameDetailCopy = {
  slug: "wolf", kicker: "TEAMS · ROTATING CAPTAIN",
  seoTitle: "Wolf Golf Game Rules: Rotation, Lone Wolf & Scoring",
  deeperReading: { href: "/blog/wolf", label: "Deeper reading: playing Wolf with a foursome that can’t agree →" },
  tagline: "One player is the Wolf on every hole. They watch the other three drives and pick a partner on the spot — or turn everyone down and take on the whole group alone for double.",
  metaDescription: "Learn the Wolf rotation, partner-pick rule, Lone Wolf points, and how points turn into one final settlement.",
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
    kicker: "SCORING TABLE", title: "Four outcomes, four point values.", lead: "This is the standard sheet most groups use. Change any number in setup and GoLo scores your house version instead.",
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
      { tag: "H7", title: "Lone Wolf, won", detail: "Passed on all three, stuffed it to four feet", value: "+4", tone: "good" },
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
    net: { label: "NET · YOU’RE OWED", sub: "Point spreads at $1 each", value: "+$23" },
    phone: {
      opponent: "Four-player Wolf", through: "18", of: "/ 18", state: "FINAL", stateSub: "26 points",
      sequence: ["l", "w", "l", "w", "l", "l", "w", "l", "w", "l", "l", "w", "l", "w", "l", "w", "l", "w"],
      stats: [
        { label: "YOUR PTS", status: "26", value: "1st of 4", tone: "good" },
        { label: "LONE WOLF", status: "2/3", value: "+12 pts", tone: "good" },
        { label: "AS WOLF", status: "5", value: "holes", tone: "neutral" },
      ],
      callout: { label: "BLIND WOLF", note: "Hole 18 · won for eight points" },
      settleTitle: "You’re owed", settleSub: "Point grid, netted", settleValue: "$23",
      label: "Final Wolf standings: you lead with 26 points and are owed 23 dollars after the four-player point grid is netted.",
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
    { icon: "cash", title: "Points to the settle-up", body: "Settle the spread between every pair, then collapse the grid into one number per player." },
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
    { term: "Best ball", def: "The team’s better score on the hole, not a total.", href: "/glossary#four-ball" },
    { term: "Point value", def: "What each point is worth at settlement." },
  ],
  faqs: gameFaqs("wolf", [
    { q: "Does Wolf need exactly four players?", a: "Four is the game. Five can work with a five-hole rotation; with three, play Nassau or skins instead." },
    { q: "Do I really have to pick right after each drive?", a: "Yes. If you wait to see all three, you have passed on the first two." },
    { q: "What is Lone Wolf worth?", a: "A standard Lone Wolf win pays four points. Blind Wolf commonly doubles that to eight." },
    { q: "Who is Wolf on 17 and 18?", a: "Usually the two players furthest behind, though some groups restart the rotation. Set it before the round." },
    { q: "Can we play Wolf with handicaps?", a: "Yes. GoLo allocates strokes by stroke index before deciding each best ball." },
  ]),
  related: ["skins", "nassau", "bingo-bango-bongo"], prev: "best-score", next: "bingo-bango-bongo",
};

const bingoBangoBongo: GameDetailCopy = {
  slug: "bingo-bango-bongo", kicker: "POINTS · 3 PER HOLE",
  seoTitle: "Bingo Bango Bongo Golf Game: Rules & Scoring",
  deeperReading: { href: "/blog/bingo-bango-bongo", label: "Deeper reading: why Bingo Bango Bongo suits mixed handicaps →" },
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
    net: { label: "NET · YOU’RE OWED", sub: "54 points at $1", value: "+$10" },
    phone: {
      opponent: "Four-player points", through: "18", of: "/ 18", state: "FINAL", stateSub: "54 points awarded",
      sequence: ["w", "l", "w", "w", "l", "l", "w", "w", "l", "w", "w", "l", "w", "l", "w", "w", "l", "w"],
      stats: [
        { label: "BINGO", status: "5", value: "first on", tone: "good" },
        { label: "BANGO", status: "7", value: "closest", tone: "good" },
        { label: "BONGO", status: "4", value: "first in", tone: "neutral" },
      ],
      callout: { label: "ORDER", note: "Furthest away plays first until every ball is holed" },
      settleTitle: "You’re owed", settleSub: "Point spreads, netted", settleValue: "$10",
      label: "Final Bingo Bango Bongo standings: you lead with 16 points and are owed ten dollars.",
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
    { icon: "stack", title: "Run it under another game", body: "It stacks beneath Skins or Best Score without changing the card." },
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
  related: ["wolf", "skins", "closest-to-pin"], prev: "wolf", next: "scramble",
};

// Checked against golo `main` 2237c1d (GoLo 1.2.1): Scramble is a round
// format, not a bet. 2 to 6 teams of 1 to 4, up to 12 players; team handicap
// Net (default), Gross or Manual 0–99, from docs/GOLO-032-SCRAMBLE-HANDICAP.md;
// Skins, Nassau, Best Score and Overall Match play between teams, each team's
// result split evenly; Wolf and Bingo Bango Bongo are off. The example's team
// handicaps: 0.35 × 8 + 0.15 × 14 = 4.9 → 5, and 0.35 × 2 + 0.15 × 18 = 3.4 → 3.
// Keep the ledger, standings and phone reconciled: front 4–2 (2 up), back 2–3
// (1 down), total 6–5 (1 up), no match decided before its last hole.
const scramble: GameDetailCopy = {
  slug: "scramble",
  updated: "2026-10-28",
  seoTitle: "Golf Scramble Rules: Team Handicaps & Side Games",
  kicker: "TEAMS · ONE BALL",
  tagline: "Teams play one ball: everyone hits, the best shot gets played, and one score a hole goes on the card. GoLo works out each team’s handicap and settles your games team against team.",
  metaDescription: "How a golf scramble works, the WHS team handicap percentages for two, three and four players, and how GoLo runs Skins, Nassau and Best Score between teams.",
  traits: ["2–12 players", "2–6 teams", "Team handicap", "One ball a team"],
  howTitle: "Everyone hits. One ball goes on.",
  intro: "A scramble turns a group into teams that play one ball. Everyone hits, the team picks the best shot, and everyone plays the next one from there until it’s holed. One score per team goes on the card, so a 25-handicap and a 5 can play together and both count. The part groups argue about is the team handicap, so GoLo works it out the same way every time.",
  steps: [
    { n: "1", title: "Split into teams", body: "Two to six teams of one to four players, up to twelve in all. GoLo deals the group out evenly and you move players around before the first tee. In GoLo, any group of more than four plays as a scramble." },
    { n: "2", title: "Everyone hits, the best ball plays", body: "All of you tee off, the team picks the best drive, and everyone plays their next shot from that spot. Repeat until the ball is in the hole." },
    { n: "3", title: "Set the team handicaps", body: "Net is the default: GoLo works out a handicap for each team from its players’ Course Handicaps, using the percentages below. Gross plays it scratch. Manual lets the organizer set each team’s number." },
    { n: "4", title: "Put games on it", body: "Skins, Nassau, Best Score and the Overall Match play team against team. Wolf and Bingo Bango Bongo aren’t played in a scramble." },
    { n: "5", title: "One scorer per team", body: "Each team’s scorer enters one score a hole. GoLo nets it by the team’s strokes, settles every game, and splits each team’s result evenly between its players." },
  ],
  scoring: {
    kicker: "TEAM HANDICAPS",
    title: "Four team sizes, four sets of percentages.",
    lead: "GoLo takes each player’s Course Handicap before rounding, lowest first, multiplies it by the percentage for its place, adds them up and rounds once, half up. A team never goes below 0, so it never gives strokes back.",
    rows: [
      { tag: "1", title: "One-player team", detail: "No scramble advantage, so the full Course Handicap", value: "100%" },
      { tag: "2", title: "Two players", detail: "The WHS recommendation, lower handicap first", value: "35 / 15%" },
      { tag: "3", title: "Three players", detail: "The WHS recommendation, lowest handicap first", value: "30 / 20 / 10%" },
      { tag: "4", title: "Four players", detail: "The WHS recommendation, lowest handicap first", value: "25 / 20 / 15 / 10%" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT",
    title: "A $20 Nassau between two scramble teams.",
    lead: "You and Mike, Course Handicaps 8 and 14, against Tom and Dave, 2 and 18, playing Net. Your team handicap is 35% of 8 plus 15% of 14: 4.9, which plays as 5. Theirs is 0.7 plus 2.7: 3.4, which plays as 3. Each team’s result is split between its two players.",
    bets: [
      { tag: "F9", title: "Front nine", detail: "2 up through 9; the team’s $20, split two ways", value: "+$10", tone: "good" },
      { tag: "B9", title: "Back nine", detail: "Tom and Dave took it 1 up", value: "−$10", tone: "bad" },
      { tag: "18", title: "Overall match", detail: "1 up, held with a half on 18", value: "+$10", tone: "good" },
    ],
    standings: [
      { name: "You", note: "half of the team’s +$20", value: "+$10", tone: "good" },
      { name: "Mike", note: "half of the team’s +$20", value: "+$10", tone: "good" },
      { name: "Tom", note: "half of the team’s −$20", value: "−$10", tone: "bad" },
      { name: "Dave", note: "half of the team’s −$20", value: "−$10", tone: "bad" },
    ],
    net: { label: "NET · YOU’RE OWED", sub: "Your half of the team’s +$20", value: "+$10" },
    phone: {
      opponent: "vs Tom & Dave", through: "18", of: "/ 18", state: "FINAL", stateSub: "two-player teams",
      sequence: ["h", "w", "l", "w", "h", "w", "h", "l", "w", "l", "w", "h", "l", "w", "l", "h", "h", "h"],
      stats: [
        { label: "FRONT", status: "2↑", value: "+$10", tone: "good" },
        { label: "BACK", status: "1↓", value: "−$10", tone: "bad" },
        { label: "TOTAL", status: "1↑", value: "+$10", tone: "good" },
      ],
      callout: { label: "TEAM HCP", note: "Yours 5, theirs 3: your extra two fall on stroke index 4 and 5" },
      settleTitle: "You’re owed", settleSub: "your half, netted", settleValue: "$10",
      label: "The finished scramble Nassau against Tom and Dave: front nine won, back nine lost, overall match won 1 up. Your team is up 20 dollars and your half is 10.",
    },
  },
  headings: {
    variations: { kicker: "HOUSE FORMATS", title: "Same idea, different rules about whose ball you play.", lead: "GoLo runs the plain scramble. These are the versions groups and events add on top, and what GoLo does with each." },
    tips: { kicker: "PLAY SMART", title: "A scramble is won on the order you hit in.", lead: "Four players and one ball only help if the first shot makes the next three easier." },
    glossary: { kicker: "TALK THE TALK", title: "The terms on a scramble card." },
    faq: { kicker: "SCRAMBLE, ANSWERED", title: "Before you split the teams." },
    related: { kicker: "PUT IT ON THE TEAMS", title: "The games GoLo runs between scramble teams.", lead: "Skins, Nassau and Best Score all play team against team, and each team’s result is split between its players." },
    cta: { title: "Twelve players, one score a team.", lead: "Deal the teams, let GoLo work out the team handicaps, and settle every game when the last putt drops." },
  },
  variations: [
    { icon: "drive", title: "Texas scramble", body: "Each player’s drive has to be used a set number of times, often four each over 18. GoLo doesn’t track whose drive was used, so keep that count on paper." },
    { icon: "swap", title: "Shamble", body: "Everyone plays from the best drive, then plays their own ball into the hole. GoLo has no shamble setting." },
    { icon: "shield", title: "Uneven teams", body: "A 1+3 or 2+3 split plays, but each team uses the percentages for its own size, so it isn’t fully evened out. GoLo says so on the setup screen." },
    { icon: "grid", title: "Your own team numbers", body: "Events often use their own formula, such as a share of the team’s combined handicaps. Pick Manual and set each team’s handicap yourself, 0 to 99." },
  ],
  tips: [
    { tone: "good", title: "Safe ball first", body: "Get one ball in the fairway or on the green before anyone gets clever. Everyone after can swing at the flag." },
    { tone: "bad", title: "Don’t take the long drive by reflex", body: "Ten yards closer from the rough is worse than the fairway. Pick the ball with the easiest next shot." },
    { tone: "good", title: "Lag first, charge after", body: "The first putt should reach the hole. Once the team has the read and a tap-in to fall back on, the rest can go at it." },
  ],
  glossary: [
    { term: "Scramble", def: "A team format: everyone hits, the team picks the best shot, and all play the next one from there." },
    { term: "Team handicap", def: "The strokes a scramble team gets, worked out from its players’ Course Handicaps at a set percentage each." },
    { term: "Course handicap", def: "Your index adjusted for the tees you played." },
    { term: "Stroke index", def: "The card’s ranking of holes from hardest (1) to easiest. Strokes go on the hardest first.", href: "/glossary#stroke-index" },
    { term: "Texas scramble", def: "A scramble that requires each player’s drive to be used a minimum number of times." },
    { term: "Shamble", def: "Best drive, then everyone plays their own ball into the hole." },
  ],
  faqs: gameFaqs("scramble", [
    { q: "How is a scramble team handicap worked out?", a: "Each player’s Course Handicap, lowest first, times a percentage: 35% and 15% for two players, 30, 20 and 10% for three, 25, 20, 15 and 10% for four. Add the shares and round once, half up. A team of 5, 10, 15 and 20 comes to 7.5, which plays as 8." },
    { q: "How many players can play a scramble in GoLo?", a: "Up to twelve, in two to six teams of one to four. A group of more than four plays as a scramble; the other formats hold four." },
    { q: "Can teams of different sizes play each other?", a: "Yes. Each team uses the percentages for its own size, so a 1+3 split plays but isn’t fully evened out, and GoLo says so when you set it up." },
    { q: "Which games can we put on a scramble?", a: "Skins, Nassau, Best Score and the Overall Match, all team against team. With three or more teams, every pair of teams plays its own Nassau. Wolf and Bingo Bango Bongo aren’t played in a scramble." },
    { q: "Who pays what when a team wins?", a: "A team’s result is split evenly between its players. Win a $20 Nassau match as a two-player team and you each take $10. In Best Score everyone puts in the same amount, and whatever a team wins is split between its players." },
    { q: "Can we play it without handicaps?", a: "Yes. Pick Gross and every team plays scratch, or pick Manual and set each team’s number yourself, 0 to 99." },
    { q: "Who keeps score?", a: "One scorer per team. Anyone else in the round who is signed in can follow it live on their own phone." },
  ]),
  related: ["skins", "nassau", "best-score"], prev: "bingo-bango-bongo", next: "closest-to-pin",
};

const closestToPin: GameDetailCopy = {
  slug: "closest-to-pin", kicker: "SIDE GAME · PAR 3s",
  updated: "2026-10-29",
  seoTitle: "Closest to the Pin & Greenies: Golf Side Game Rules",
  tagline: "One tee shot, one hole. Stick it tighter than everybody else on the par 3s and win it. Play it as a greenie and you still have to make par from there.",
  metaDescription: "How closest to the pin and greenies work: who qualifies, par-to-win, measuring, carryovers, and how it settles up.",
  traits: ["Any group size", "Par 3s only", "Greenies", "Per-hole amount"],
  howTitle: "The oldest side game in golf, and the easiest to argue about.",
  intro: "On every marked par 3, whoever hits their tee shot closest to the flag wins the hole. Most groups play it as a greenie, which adds two conditions: the ball has to finish on the green, and you have to make par before it is actually yours. In GoLo’s Closest to Pin game those are the group’s rules to apply, and GoLo nets whoever the scorer marks as the winner. For greenies with par to win, its Skins game has a Greenie option.",
  steps: [
    { n: "1", title: "Mark the holes and the amount", body: "Usually all four par 3s, at $5 a head. Some groups mark one signature hole." },
    { n: "2", title: "Tee shots only", body: "Only the ball you hit from the tee counts. Reload and you are out of the running." },
    { n: "3", title: "Closest to the flag wins", body: "Nearest ball takes the hole. Greenie rules add that it has to be on the green." },
    { n: "4", title: "Then make your par", body: "Under greenie rules, a three-putt hands it to the next closest, or it carries. The group makes that call before the scorer marks a winner." },
    { n: "5", title: "GoLo settles the hole", body: "Record the winner on the hole and GoLo nets it into the settle-up with every other game. GoLo keeps the tally; it never holds money." },
  ],
  scoring: {
    kicker: "SETTLE THESE FIRST", title: "Four questions, asked on the first tee — not the fourth green.", lead: "Every argument about a greenie traces back to one of these going unasked. Here’s what most groups land on.",
    rows: [
      { title: "Does it have to be on the green?", detail: "Fringe at three feet against surface at twenty", value: "ON THE GREEN" },
      { title: "Do you have to make par?", detail: "Whether closest still wins after a three-putt", value: "PAR TO WIN" },
      { title: "How do you measure it?", detail: "Eyeball, pace it, or use a rangefinder", value: "PACE IT OFF" },
      { title: "Nobody claimed it — now what?", detail: "The hole dies or rides to the next par 3", value: "CARRY IT" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT", title: "Four par 3s, $5 a greenie, one three-putt that handed over a $30 hole.", lead: "Four players, greenies on every par 3, par to win, and an unclaimed greenie carries to the next par 3. That’s how GoLo’s Greenie skins play. On the seventh Tom was inside everybody — and walked off with nothing.",
    bets: [
      { tag: "H3", tagSub: "168 YDS", title: "You — 11 ft 4 in", detail: "Only ball on the green, two-putt par", value: "+$15", tone: "good" },
      { tag: "H7", tagSub: "205 YDS", title: "Nobody", detail: "Tom was inside everyone, then three-putted", value: "carry", tone: "neutral" },
      { tag: "H12", tagSub: "142 YDS", title: "You — 3 ft 2 in", detail: "Tap-in birdie, and hole 7’s carry came with it", value: "+$30", tone: "good" },
      { tag: "H16", tagSub: "190 YDS", title: "Mike — 6 ft 8 in", detail: "Beat you by four feet and made the putt", value: "−$5", tone: "bad" },
    ],
    standings: [
      { name: "You", note: "3 greenies", value: "+$40", tone: "good" },
      { name: "Mike", note: "1 greenie", value: "$0", tone: "neutral" },
      { name: "Tom", note: "closest once, no par", value: "−$20", tone: "bad" },
      { name: "Dave", note: "never on in one", value: "−$20", tone: "bad" },
    ],
    net: { label: "NET · YOU’RE OWED", sub: "Four par-3 holes, netted", value: "+$40" },
    phone: {
      // In GoLo a greenie that carries is the Skins game's Greenie option
      // (capabilities.ts skins-greenie-sandie); Closest to Pin doesn't carry.
      game: "Skins", opponent: "Four-player greenies", through: "18", of: "/ 18", state: "FINAL", stateSub: "four par 3s",
      sequence: ["h", "h", "w", "h", "h", "h", "h", "h", "h", "h", "h", "w", "h", "h", "h", "l", "h", "h"],
      stats: [
        { label: "GREENIES", status: "3", value: "of 4", tone: "good" },
        { label: "BIGGEST", status: "$30", value: "hole 12", tone: "good" },
        { label: "CARRIED", status: "1", value: "hole 7", tone: "neutral" },
      ],
      callout: { label: "NO PAR", note: "Tom’s three-putt carried hole 7" },
      settleTitle: "You’re owed", settleSub: "Greenies, netted", settleValue: "$40",
      label: "Final greenie results in a Skins game: you win three of four greenies and are owed forty dollars.",
    },
  },
  headings: {
    variations: { kicker: "GREENIES & VARIATIONS", title: "You don't have to stop at the par 3s.", lead: "A greenie is the classic, but the same game works anywhere there is a green and an argument about who is closest." },
    tips: { kicker: "PLAY SMART", title: "The greenie isn't yours until the putt drops.", lead: "Par-to-win separates this from a target contest. Four feet means nothing if you three-putt." },
    glossary: { kicker: "TALK THE TALK", title: "The terms you'll hear on the tee." },
    faq: { kicker: "CLOSEST TO PIN, ANSWERED", title: "Before you tee it up." },
    related: { kicker: "STACK IT WITH", title: "Nobody plays this one on its own.", lead: "Closest to the pin is a garnish. Put a real game underneath it and let GoLo settle the whole plate." },
    cta: { title: "Retire the pencil on the greenie stick.", lead: "Mark the par 3s, record each winner, and let GoLo net it into the settle-up." },
  },
  variations: [
    { icon: "pin", title: "Greenies on every par 3", body: "Four separate greenies over 18 holes, one on each par 3." },
    { icon: "target", title: "Closest in two", body: "Run it on a par 5 and measure after everyone’s second shot." },
    { icon: "drive", title: "Approach on a marked par 4", body: "Settle on approach shots instead of tee shots." },
    { icon: "cash", title: "One for the whole round", body: "One amount for the round, and the tightest single shot wins it." },
  ],
  tips: [
    { tone: "good", title: "Play to the middle when the pin is tucked", body: "Thirty feet on the green beats hole-high in the sand every time." },
    { tone: "bad", title: "Club up into the wind", body: "Short is where trouble lives on par 3s. Coming up light means no greenie and probably no par." },
    { tone: "good", title: "Treat the par putt like the game", body: "Under par-to-win, the four-footer is the one that counts." },
  ],
  glossary: [
    { term: "Greenie", def: "Closest to the pin on a par 3, on in one, par or better to win.", href: "/glossary#greenie" },
    { term: "On in one", def: "Your tee shot finished on the putting surface." },
    { term: "Par to win", def: "Closest gets nothing unless they finish in par or better." },
    { term: "Carry", def: "An unclaimed greenie rolling to the next par 3." },
    { term: "Greenie stick", def: "The pencil-and-peg marker used to log the current best distance." },
    { term: "Inside the leather", def: "Old shorthand for a distance close enough to call even." },
  ],
  faqs: gameFaqs("closest-to-pin", [
    { q: "Does the ball have to be on the green?", a: "In most groups, yes. Agree it either way, but decide before the first par 3." },
    { q: "Do you really have to make par?", a: "Only if your group plays it as a greenie, where par-to-win is the standard rule. In GoLo’s Closest to Pin game it’s the group’s call: the scorer marks whoever the group says won. Its Skins game has a Greenie option that pays only on par or better and carries an unclaimed greenie to the next par 3." },
    { q: "How do we measure it?", a: "Eyeball obvious gaps, pace close ones, or use a rangefinder. The scorer marks the winner once everyone is on the green." },
    { q: "What if two players are the same distance?", a: "Split it or carry it to the next par 3." },
    { q: "Can we play it on par 4s and 5s?", a: "Yes. Closest in two and marked approaches use the same rules." },
    { q: "Can it be one greenie for the whole round?", a: "Yes. The tightest tee shot across all par 3s takes it." },
  ]),
  related: ["longest-drive", "birdies", "bingo-bango-bongo"], prev: "scramble", next: "longest-drive",
};

const longestDrive: GameDetailCopy = {
  slug: "longest-drive", kicker: "SIDE GAME · ONE MARKED HOLE",
  updated: "2026-10-15",
  seoTitle: "Longest Drive Golf Side Game: Rules & Settling Up",
  tagline: "Pick a hole, swing out of your shoes, and the longest ball that finishes in the fairway takes it. Short grass or nothing.",
  metaDescription: "Set up a longest-drive side game with a marked hole, fairway-only rule, measurement, carryovers, and a clean settle-up.",
  traits: ["Any group size", "One marked hole", "Fairway only", "Winner takes it"],
  howTitle: "One hole where you can stop playing golf and just hit it.",
  intro: "Mark a hole before the round — usually a wide par 5 with a fairway you can miss and survive. Everybody hits a tee shot, the longest ball that finishes in the fairway takes it, and the guy who bombed it into the trees gets nothing but the story.",
  steps: [
    { n: "1", title: "Mark the hole and the amount", body: "Pick it on the first tee, not on the tee box. A wide par 5 downwind is the classic choice." },
    { n: "2", title: "Tee shots only, one ball", body: "The ball you play from the tee is the ball that counts. Reload and you are out." },
    { n: "3", title: "It has to finish in the fairway", body: "A 320 in the rough loses to a 280 in the middle, every time." },
    { n: "4", title: "Settle it at the ball", body: "Compare drives as you walk past them, not from the tee. The ball in the fairway that is furthest along wins." },
    { n: "5", title: "GoLo settles the hole", body: "Record the winner and GoLo nets it into the settle-up. If nobody finds the fairway, your house rule decides whether it carries." },
  ],
  scoring: {
    kicker: "SETTLE THESE FIRST", title: "Four questions, asked before anybody tees off.", lead: "Longest drive falls apart on definitions. These are the four to nail down.",
    rows: [
      { title: "Does it have to be in the fairway?", detail: "A bomb in rough against a shorter ball in the middle", value: "IN THE FAIRWAY" },
      { title: "One hole, or every par 5?", detail: "A marked hole or a separate one on each long hole", value: "ONE MARKED HOLE" },
      { title: "How do you measure it?", detail: "Sprinkler heads, rangefinder, or GPS", value: "RANGEFINDER" },
      { title: "Nobody found the fairway — now what?", detail: "The hole dies or rides to the next one", value: "CARRY IT" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT", title: "One par 5, $10 a man, and a 318-yarder that finished six feet into the rough.", lead: "Four players, longest drive on the 12th, fairway only. Dave hit the longest ball anybody had seen all year and won nothing for it.",
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
    net: { label: "NET · YOU’RE OWED", sub: "Longest ball in play", value: "+$30" },
    phone: {
      opponent: "Hole 12 side game", through: "12", of: "/ 18", state: "FINAL", stateSub: "marked hole",
      sequence: ["h", "h", "h", "h", "h", "h", "h", "h", "h", "h", "h", "w", "h", "h", "h", "h", "h", "h"],
      stats: [
        { label: "IN PLAY", status: "296", value: "you, fairway", tone: "good" },
        { label: "OVERALL", status: "318", value: "Dave, rough", tone: "neutral" },
        { label: "OWED", status: "$30", value: "3 × $10", tone: "good" },
      ],
      callout: { label: "FAIRWAY ONLY", note: "Dave’s 318 yards did not qualify" },
      settleTitle: "You’re owed", settleSub: "One marked hole", settleValue: "$30",
      label: "Longest-drive result on hole 12: your 296-yard fairway drive wins thirty dollars; Dave's 318-yard rough drive does not qualify.",
    },
  },
  headings: {
    variations: { kicker: "FORMATS & VARIATIONS", title: "One hole is the tradition. It does not have to be the whole game.", lead: "Same swing, four structures — ways groups stretch longest drive past a single tee box." },
    tips: { kicker: "PLAY SMART", title: "Nobody wins longest drive from the trees.", lead: "The fairway rule is the whole game. Your normal driver at a wider target beats chasing 15 yards you have never hit on command." },
    glossary: { kicker: "TALK THE TALK", title: "The words that settle the tee box." },
    faq: { kicker: "LONGEST DRIVE, ANSWERED", title: "Before you grip it any tighter." },
    related: { kicker: "STACK IT WITH", title: "A tee-box side game needs a real game underneath it.", lead: "One swing on one hole is not a round. Put a game beneath it and let GoLo settle the whole thing." },
    cta: { title: "Settle the tee box before the beer cart gets there.", lead: "Mark the hole, let fairway-only decide it, and let GoLo net it into the settle-up." },
  },
  variations: [
    { icon: "drive", title: "Every par 5", body: "A separate one on each long hole gives four swings that matter." },
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
    { term: "Longest drive", def: "The side game for the longest tee shot on a marked hole." },
    { term: "In play", def: "Finished in the fairway — the usual price of admission." },
    { term: "Marker", def: "The peg or plate left beside the current leading ball." },
    { term: "Tee shot only", def: "The first ball from the tee. Reloads and mulligans are out." },
    { term: "Carry", def: "Nobody found the fairway, so it rides to the next hole." },
    { term: "Distance handicap", def: "Agreed yards given to shorter hitters." },
  ],
  faqs: gameFaqs("longest-drive", [
    { q: "Does the ball have to be in the fairway?", a: "In almost every group, yes. Fairway-only keeps it a golf shot." },
    { q: "Which hole should we mark?", a: "A wide par 5 with helping wind is traditional. Avoid forced carries and fairways that run out." },
    { q: "How do we measure the distance?", a: "Sprinkler heads, a rangefinder or a GPS watch, compared as you pass the balls. Agree which on the tee." },
    { q: "What if nobody hits the fairway?", a: "It can die or carry. Carrying makes the next marked hole worth twice as much." },
    { q: "Can we play it on every hole?", a: "You can, but par 5s only is usually enough swings without slowing the round." },
    { q: "How do we keep mismatched hitters fair?", a: "Give yards, not strokes. A 20- to 30-yard allowance can create a real contest." },
  ]),
  related: ["closest-to-pin", "birdies", "skins"], prev: "closest-to-pin", next: "birdies",
};

const birdies: GameDetailCopy = {
  slug: "birdies", kicker: "BOUNTY · ALL 18 HOLES",
  deeperReading: { href: "/blog/skins-carryover", label: "Deeper reading: how skins carryovers stack up →" },
  updated: "2026-10-11",
  seoTitle: "Birdie Bounties in Golf: Side Game Rules & Settling Up",
  tagline: "A standing price on every birdie. Card one and everybody who did not pays you. Eagles double it, and nobody has ever complained about paying.",
  metaDescription: "How a birdie bounty works: gross or net birdies, eagle multipliers, who owes whom, and a sensible cap so one hot round stays friendly.",
  traits: ["Any group size", "All 18 holes", "Per-birdie bounty", "Eagles double"],
  howTitle: "The only side game that pays you for playing well instead of for beating somebody.",
  intro: "Put a price on a birdie before the round. Every time somebody makes one, each of the other players hands over that amount — so a $5 birdie is worth $15 in a foursome. Eagles usually pay double, and because it sits on top of whatever else you are playing, most groups leave it running all season.",
  steps: [
    { n: "1", title: "Set the price", body: "$5 a birdie is standard. Much more and one hot nine becomes a real number." },
    { n: "2", title: "Gross or net", body: "Gross is simple. Net lets a 20 handicap into the game when par on a stroke hole counts. GoLo counts gross birdies only." },
    { n: "3", title: "Everybody else owes the maker", body: "Nothing builds up in the middle. Every other player owes the maker." },
    { n: "4", title: "Eagles double, aces clear the table", body: "The traditional multiplier, with optional bonuses for streaks or hard holes." },
    { n: "5", title: "GoLo tallies every bounty", body: "In GoLo it is a Skins setting: Birdie Skin, plus Eagle Skin for the double, both at your skin price. Each bounty posts automatically and nets against what you owe." },
  ],
  scoring: {
    kicker: "SETTLE THESE FIRST", title: "Four questions, asked before the first birdie.", lead: "A bounty is simple until somebody makes five of them. Here is where most groups land.",
    rows: [
      { title: "Gross or net birdies?", detail: "Whether a handicap stroke can turn par into birdie", value: "GROSS" },
      { title: "What does an eagle pay?", detail: "Flat rate, double, or a number of its own", value: "DOUBLE" },
      { title: "Who owes the maker?", detail: "Every other player or only those who lost the hole", value: "EVERYBODY ELSE" },
      { title: "Is there a cap?", detail: "What happens when one player makes five (GoLo has no cap setting)", value: "SET A CAP" },
    ],
  },
  example: {
    kicker: "WATCH IT PLAY OUT", title: "$5 a birdie, four players, and one eagle worth two of them.", lead: "Gross birdies, eagles double, no cap. Seven bounties changed hands over 18 holes and two players finished dead level.",
    bets: [
      { tag: "H4", tagSub: "BIRDIE", title: "You — 12-footer", detail: "Three players owe $5 each", value: "+$15", tone: "good" },
      { tag: "H9", tagSub: "BIRDIE", title: "Mike — drove the green", detail: "Everybody else owes, including you", value: "−$5", tone: "neutral" },
      { tag: "H13", tagSub: "EAGLE", title: "Tom — par 5 in two", detail: "Double bounty, and the round turned here", value: "−$10", tone: "bad" },
      { tag: "H17", tagSub: "BIRDIE", title: "You — tap-in", detail: "Back level with Tom with one to play", value: "+$15", tone: "good" },
    ],
    standings: [
      { name: "You", note: "3 birdies", value: "+$20", tone: "good" },
      { name: "Tom", note: "a birdie and an eagle", value: "+$20", tone: "good" },
      { name: "Mike", note: "2 birdies", value: "$0", tone: "neutral" },
      { name: "Dave", note: "none, owed on all seven", value: "−$40", tone: "bad" },
    ],
    net: { label: "NET · YOU’RE OWED", sub: "Seven bounties, netted", value: "+$20" },
    phone: {
      opponent: "Four-player bounty", through: "18", of: "/ 18", state: "FINAL", stateSub: "seven bounties",
      sequence: ["h", "l", "h", "w", "h", "l", "h", "w", "l", "h", "h", "h", "l", "h", "h", "h", "w", "h"],
      stats: [
        { label: "YOURS", status: "3", value: "+$45", tone: "good" },
        { label: "THEIRS", status: "4", value: "−$25", tone: "neutral" },
        { label: "EAGLES", status: "1", value: "Tom, H13", tone: "neutral" },
      ],
      callout: { label: "EAGLE", note: "Tom’s eagle on 13 paid double" },
      settleTitle: "You’re owed", settleSub: "All bounties, netted", settleValue: "$20",
      label: "Final birdie bounty: you made three birdies and are owed twenty dollars after seven bounties are netted.",
    },
  },
  headings: {
    variations: { kicker: "BOUNTIES & VARIATIONS", title: "A bounty does not have to stop at birdies.", lead: "Same mechanic every time: a fixed price on one specific thing happening. Four versions worth adding. GoLo scores the plain gross bounty and sandies; net and escalating bounties, barkies and Arnies are house rules it does not track." },
    tips: { kicker: "PLAY SMART", title: "Birdies pay for the cheap risk, not every risk.", lead: "Attack the short par 5 and drivable par 4. Do not take on a tucked pin over water for the same bounty." },
    glossary: { kicker: "TALK THE TALK", title: "The bounties your group already argues about." },
    faq: { kicker: "BIRDIES, ANSWERED", title: "Before you set the price." },
    related: { kicker: "STACK IT WITH", title: "Bounties are the seasoning, not the meal.", lead: "Birdies runs on top of whatever your group already plays. Pick the game underneath it." },
    cta: { title: "Put a price on the best shot you hit all day.", lead: "Turn on Birdie Skin and Eagle Skin, set the price, and GoLo posts each one while you play." },
  },
  variations: [
    { icon: "bird", title: "Net birdies", body: "A par on a stroke hole counts, giving a high handicap a real chance." },
    { icon: "cash", title: "Escalating bounty", body: "Every birdie raises the price of the next one." },
    { icon: "dice", title: "Barkies, sandies, and Arnies", body: "Cheap bounties for recovery shots and rounds that never touch a fairway." },
    { icon: "stack", title: "Team birdies", body: "Play as partners and let either ball count." },
  ],
  tips: [
    { tone: "good", title: "Hunt them on reachable holes", body: "Two par 5s and a short par 4 are where most bounties are made." },
    { tone: "bad", title: "Do not let a bounty cost the main game", body: "A $15 birdie chase can lose a $50 Nassau hole. Check what else is riding." },
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
    { q: "Should we count net birdies?", a: "Yes when the handicap spread is wide. A game nobody can win is not much of a game. GoLo counts gross birdies only, so net birdies are a house rule it does not track." },
    { q: "Do eagles really pay double?", a: "Almost always, and a hole-in-one commonly clears the table. Set it before the shot. GoLo counts an eagle double when Eagle Skin is on, and has no separate ace bonus." },
    { q: "Who owes the maker?", a: "Everybody else owes. That is what makes it a bounty rather than a match." },
    { q: "What if somebody goes on a run?", a: "Use a cap so a great round stays a great story instead of an awkward bill. GoLo has no cap setting, so agree one before the round and settle the difference yourselves." },
    { q: "Can we stack it on another game?", a: "Yes. In GoLo it is part of the Skins game, so it runs beside a Nassau or Best Score, with or without the standard skin, and GoLo nets it all." },
  ]),
  related: ["skins", "nassau", "closest-to-pin"], prev: "longest-drive", next: "skins",
};

export const gameDetails = {
  skins: withRoster(skins),
  nassau: withRoster(nassau),
  "best-score": withRoster(bestScore),
  wolf: withRoster(wolf),
  "bingo-bango-bongo": withRoster(bingoBangoBongo),
  scramble: withRoster(scramble),
  "closest-to-pin": withRoster(closestToPin),
  "longest-drive": withRoster(longestDrive),
  birdies: withRoster(birdies),
} satisfies Record<GameSlug, GameDetail>;

export const gameDetailSlugsWithContent = Object.keys(gameDetails) as GameSlug[];

export function findGameDetail(slug: string): GameDetail | undefined {
  return gameDetails[slug as GameSlug];
}
