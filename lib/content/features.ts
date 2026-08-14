/**
 * /features content. Copy is verbatim from
 * design_handoff/reference/Golo Golf - Features.dc.html — including its
 * straight apostrophes in the block copy and curly ones in the quick answers,
 * which is how the designs have it. Don't tidy them.
 */

import type { StatusVariant } from "@/components/ui/StatusPill";
import type { CheckListItem } from "@/components/ui/CheckList";

/** Keys into the visual map in app/features/page.tsx. */
export type FeatureVisual =
  | "setup"
  | "gameStack"
  | "scoring"
  | "money"
  | "pressLadder"
  | "strokeGrid"
  | "settle"
  | "locker";

export type FeatureBlock = {
  id: string;
  kicker: string;
  status: { variant: StatusVariant; label: string };
  title: string;
  lead: string;
  checklist: CheckListItem[];
  visualSide: "left" | "right";
  visual: FeatureVisual;
  /** Optional lime text link closing the block. */
  link?: { label: string; href: string };
};

const TODAY = { variant: "today" as const, label: "IN THE APP TODAY" };

export const featureBlocks: FeatureBlock[] = [
  {
    id: "round-setup",
    kicker: "ROUND SETUP",
    status: TODAY,
    title: "Ninety seconds on the first tee, then nobody touches it again.",
    lead: "Course, tees, players, games, stakes. Set it once while the group is still stretching and the rest of the round is just tapping numbers. Save your Saturday crew as a preset and it's four taps next week.",
    checklist: [
      {
        lead: "Different tees per player",
        rest: "the card adjusts, the bet still works.",
      },
      {
        lead: "Guests need nothing",
        rest: "add a name and an index, no account required.",
      },
      {
        lead: "Stakes written down",
        rest: "the number is on the screen, not in three memories.",
      },
    ],
    visualSide: "right",
    visual: "setup",
  },
  {
    id: "game-library",
    kicker: "GAME LIBRARY",
    status: TODAY,
    title: "Run four games at once. Nobody has to keep track but the phone.",
    lead: "A Nassau over the top of skins over the top of a junk board is a normal Saturday, and it's also four separate tallies nobody can hold in their head. Stack them, set each one's house rules, and let the app do the bookkeeping.",
    checklist: [
      {
        lead: "Your house rules, per game",
        rest: "carryover, auto-presses, allowances.",
      },
      {
        lead: "Teams or individual",
        rest: "two-on-two, best ball, or every man for himself.",
      },
      {
        lead: "Junk priced separately",
        rest: "a greenie is a dollar, not a debate.",
      },
    ],
    visualSide: "left",
    visual: "gameStack",
    link: { label: "See every format →", href: "/games" },
  },
  {
    id: "immersive-scoring",
    kicker: "IMMERSIVE SCORING",
    status: TODAY,
    title: "One thumb, one hole at a time, no pencil.",
    lead: "One screen per hole: the yardage, the stroke index, everyone's score, and buttons big enough to hit while walking. Strokes apply themselves, so net and gross are both right without anyone doing subtraction on a cart path.",
    checklist: [
      {
        lead: "Whole foursome on one screen",
        rest: "no passing the phone around the green.",
      },
      { lead: "Net and gross together", rest: "see both, bet on either." },
      {
        lead: "Junk logged on the hole",
        rest: "tap the greenie before you forget it.",
      },
    ],
    visualSide: "right",
    visual: "scoring",
  },
  {
    id: "live-leaderboard",
    kicker: "LIVE LEADERBOARD",
    status: TODAY,
    title: "Trash talk, with a source.",
    lead: "Everyone can see exactly where they stand while there's still golf left to fix it. Flip between net, gross and the money — the third one being the view that actually changes how people putt on 15.",
    checklist: [
      {
        lead: "Money view",
        rest: "every game's standing rolled into one running figure.",
      },
      {
        lead: "Live pot and carries",
        rest: "watch the skins money pile up hole by hole.",
      },
      {
        lead: "Movement",
        rest: "proof you made the turn in first, for as long as it lasted.",
      },
    ],
    visualSide: "left",
    visual: "money",
  },
  {
    id: "press-tracking",
    kicker: "PRESS TRACKING",
    status: TODAY,
    title: "Every press logged the second it's called.",
    lead: "Presses are where friendly bets go to die — three of them deep and nobody agrees what's live. Tap it on the tee and the ladder stays legible: which bet, which holes, at what stake, and who's up in it right now.",
    checklist: [
      { lead: "Auto-press at 2 down", rest: "on or off, agreed once at setup." },
      {
        lead: "Presses on presses",
        rest: "nested and still readable at the end.",
      },
      {
        lead: "Timestamped",
        rest: '"you pressed on 14" is a fact, not a memory.',
      },
    ],
    visualSide: "right",
    visual: "pressLadder",
    link: { label: "How presses work →", href: "/games/nassau" },
  },
  {
    id: "handicaps-strokes",
    kicker: "HANDICAPS & STROKES",
    status: TODAY,
    title: "The 6 and the 22 can play for real money.",
    lead: "Index in, course handicap out, strokes allocated by the card's stroke index — including the second stroke on the hardest holes when somebody needs 24 of them. Play it full, play it at 90%, or play straight up; the bets follow whatever you chose.",
    checklist: [
      {
        lead: "No GHIN required",
        rest: "type an index, or let the group agree on a number.",
      },
      {
        lead: "Slope-aware",
        rest: "the same index gives different strokes at different tees.",
      },
      {
        lead: "Allowance settings",
        rest: "match play off the low ball, or full handicap.",
      },
    ],
    visualSide: "left",
    visual: "strokeGrid",
  },
  {
    id: "auto-settle-up",
    kicker: "AUTO SETTLE-UP",
    status: TODAY,
    title: "Four players, six debts, three payments.",
    lead: "Nassau, presses, skins, the purse and every greenie get netted into one number per player, then reduced to the fewest transfers that make everyone whole. You read the list out loud in the parking lot and it's over — no daisy chain, no arithmetic with a beer in your hand.",
    checklist: [
      { lead: "Who pays whom", rest: "names and amounts, in plain order." },
      {
        lead: "Mark paid",
        rest: "tick it off as the cash or the transfer lands.",
      },
      {
        lead: "Itemized",
        rest: "tap any number to see which bet produced it.",
      },
    ],
    visualSide: "right",
    visual: "settle",
    link: {
      label: "The etiquette of settling up →",
      href: "/blog/who-pays-first",
    },
  },
  {
    id: "history-locker",
    kicker: "HISTORY, STATS & YOUR LOCKER",
    status: { variant: "planned", label: "HISTORY LIVE · STATS EXPANDING" },
    title: "A season-long record of who actually wins.",
    lead: 'Every round is saved with its scores, its games and its money, so the guy who claims he "always" takes the back nine can be checked. Your Locker keeps the running net, your handicap trend, and your record in each format.',
    checklist: [
      {
        lead: "Season and all-time net",
        rest: "one number nobody can argue with.",
      },
      {
        lead: "Round archive",
        rest: "reopen any card, see every hole and every bet.",
      },
      {
        lead: "Head-to-head",
        rest: "your record against each regular, per format.",
      },
    ],
    visualSide: "left",
    visual: "locker",
  },
];

/* ---------------------------------------------------------------- also in */

export type AlsoCard = {
  title: string;
  status: { variant: StatusVariant; label: string };
  body: string;
};

export const alsoInThere: AlsoCard[] = [
  {
    title: "Course database",
    status: { variant: "planned", label: "GPS YARDAGES NEXT" },
    body: "Pars, ratings, slopes and stroke index for the courses you actually play — so the strokes land right without anyone typing in a scorecard. Live GPS yardages are the next thing we're building.",
  },
  {
    title: "Receipts for the group chat",
    status: { variant: "testing", label: "IN TESTING" },
    body: "One card with the final scores, the money and who paid whom — dropped straight into the text thread where the trash talk already lives. Ends the Tuesday re-litigation.",
  },
];

/* ----------------------------------------------------------------- roadmap */

export type RoadmapColumn = {
  status: StatusVariant;
  heading: string;
  items: string[];
};

export const roadmap: RoadmapColumn[] = [
  {
    status: "today",
    heading: "IN THE APP TODAY",
    items: [
      "Hole-by-hole scoring, net and gross",
      "Nassau, skins, stroke purse, junk board",
      "Presses, including auto-presses",
      "Handicap strokes by stroke index",
      "Netted settle-up and round history",
    ],
  },
  {
    status: "testing",
    heading: "IN TESTING WITH REAL GROUPS",
    items: [
      "Wolf and Bingo Bango Bongo",
      "Saved group presets",
      "Share card for the group chat",
      "Season stats in the Locker",
    ],
  },
  {
    status: "planned",
    heading: "ON THE LIST, NOT BUILT",
    items: [
      "GPS yardages and shot distances",
      "Everyone scoring at once, live-synced",
      "Multi-day trip tallies",
      "Watch app",
    ],
  },
];

/* ------------------------------------------------------------- testimonials */

export type BetaQuote = {
  text: string;
  name: string;
  meta: string;
  initial: string;
  color: string;
};

export const betaQuotes: BetaQuote[] = [
  {
    text: '"We used to spend the whole ride home arguing about the presses. Now we spend it arguing about my swing."',
    name: "Dave M.",
    meta: "11.6 index · Saturday game, 9 years",
    initial: "D",
    color: "var(--avatar-teal)",
  },
  {
    text: '"I\'m a 22 and I finally understand what I\'m getting. The stroke grid ended a four-year disagreement in about nine seconds."',
    name: "Tom R.",
    meta: "22.0 index · muni regular",
    initial: "T",
    color: "var(--avatar-orange)",
  },
  {
    text: '"Three transfers instead of six, and nobody standing in the lot doing math. That\'s the whole thing for me."',
    name: "Sarah K.",
    meta: "14.1 index · runs the trip every spring",
    initial: "S",
    color: "var(--avatar-blue)",
  },
];

/* ----------------------------------------------------------------- pricing */

export const pricing = {
  kicker: "WHAT IT COSTS",
  value: "Free",
  qualifier: "while we're in beta",
  body: "No card, no ads, no trial clock. If we ever charge for something, it'll be small, it'll be obvious, and you'll hear it from us before it happens — not from a paywall on the 14th tee.",
  items: [
    "Every game and every feature on this page",
    "Unlimited players and rounds",
    "Your rounds stay yours if you leave",
  ],
};

/* ----------------------------------------------------------- quick answers */

export type QuickAnswer = { id: string; question: string; answer: string };

export const quickAnswers: QuickAnswer[] = [
  {
    id: "move-the-money",
    question: "Does GoLo move the money?",
    answer:
      "No. GoLo tracks who owes what and reduces it to the fewest payments — then you settle in cash, Venmo, Zelle or however your group already does it. Nothing runs through us, and we never see a payment.",
  },
  {
    id: "everyone-need-the-app",
    question: "Does everyone in the group need the app?",
    answer:
      "No. One phone scores the round and everyone else can look over a shoulder. Live sync so all four can enter their own scores is on the list, not built yet.",
  },
  {
    id: "need-a-ghin",
    question: "Do I need a GHIN or an official handicap?",
    answer:
      "No. Type in an index, use the number your group agreed on years ago, or play straight up. If you do have a real index, GoLo turns it into a course handicap at the tees you’re actually playing.",
  },
  {
    id: "house-rules",
    question: "Can we play our own house rules?",
    answer:
      "That’s the point. Carryover on or off, auto-presses at 2 down or press-on-request, full handicap or 90% — you set it at the first tee and the app scores it your way.",
  },
  {
    id: "launch-and-cost",
    question: "When does it launch, and what will it cost?",
    answer:
      "We’re in beta with real groups and we don’t have a public date yet — when we do, it’ll be on the blog and in the newsletter before it’s anywhere else. It’s free while we’re in beta.",
  },
];
