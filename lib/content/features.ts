/**
 * /features content. Copy is verbatim from
 * design_handoff/reference/Golo Golf - Features.dc.html — including its
 * straight apostrophes in the block copy and curly ones in the quick answers,
 * which is how the designs have it. Don't tidy them.
 *
 * Where the design promised more than the app ships, the copy follows the app
 * (checked against GoLo 0.6.2): full course handicaps for everyone, nobody off
 * the low man, one set of tees per group, Net or Gross with no percentage
 * allowance outside a scramble's team handicap, presses only on the Overall
 * Match game and never automatic, and one scorer per round (one per team in a
 * scramble) while signed-in players follow along live. Check the app before
 * putting any of that back.
 */

import type { StatusVariant } from "@/components/ui/StatusPill";
import type { CheckListItem } from "@/components/ui/CheckList";
import { siteConfig } from "@/lib/siteConfig";
import { capabilitiesWithStatus, type CapabilityStatus } from "./capabilities";

/**
 * The full launch (pricing and the "in beta" lines), not the Android one: it
 * follows siteConfig.appLive, as these lines did before the store apps split.
 */
const launched = siteConfig.appLive;

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
    lead: "Course, tees, players, games, amounts. Set it once while the group is still stretching and the rest of the round is just tapping numbers. Save your Saturday crew as a group and next week they're in with one tap, teams and all.",
    checklist: [
      {
        lead: "One set of tees for the group",
        rest: "everyone's course handicap comes off it. Mixed tees aren't in the app.",
      },
      {
        lead: "Guests need nothing",
        rest: "add a name and an index, no account required.",
      },
      {
        lead: "Amounts written down",
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
        rest: "skins carryover, which skins count, how Best Score splits.",
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
      { lead: "Net and gross together", rest: "see both, play either." },
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
    lead: "Everyone can see exactly where they stand while there's still golf left to fix it. Flip between Net, Gross and Results — the third one being the view that actually changes how people putt on 15.",
    checklist: [
      {
        lead: "Results view",
        rest: "every game's standing rolled into one running figure.",
      },
      {
        lead: "Live skins and carries",
        rest: "watch each carried skin build hole by hole.",
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
    lead: "Presses are where friendly side games get messy — three of them deep and nobody agrees what's live. In GoLo they're on the Overall Match game: the side that's 2 or more down taps it on the tee and the ladder stays legible — which holes, at what amount, and who's up in it right now.",
    checklist: [
      {
        lead: "Called, not automatic",
        rest: "auto-press isn't in the app yet, and Nassau doesn't take presses.",
      },
      {
        lead: "Up to two live at once",
        rest: "at two, three or four times the amount, and still readable at the end.",
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
    title: "The 6 and the 22 can play the same side game.",
    lead: "Index in, course handicap out, strokes allocated by the card's stroke index — including the second stroke on the hardest holes when somebody needs 24 of them. Everyone gets their full course handicap, or play the round gross and nobody gets any; the side games follow whatever you chose.",
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
        lead: "Full strokes, not off the low man",
        rest: "no 90% or other allowances, except a scramble's team handicap.",
      },
    ],
    visualSide: "left",
    visual: "strokeGrid",
  },
  {
    id: "auto-settle-up",
    kicker: "AUTO SETTLE-UP",
    status: TODAY,
    title: "Four players, six debts, three settle-ups.",
    lead: "Nassau, presses, Skins, Best Score and every greenie get netted into one number per player, then reduced to a short who-owes-whom list that squares the group. You read the list out loud in the parking lot and it's over — no daisy chain, no arithmetic with a beer in your hand.",
    checklist: [
      { lead: "Who owes whom", rest: "names and amounts, in plain order." },
      {
        lead: "Mark settled",
        rest: "tick it off once your group has settled up outside the app.",
      },
      {
        lead: "Itemized",
        rest: "tap any number to see which game produced it.",
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
    status: TODAY,
    title: "A season-long record of who actually wins.",
    lead: 'Every round is saved with its scores, its games and its results, so the guy who claims he "always" takes the back nine can be checked. Your Locker keeps your season and all-time net, your record in each format, and your record against each regular.',
    checklist: [
      {
        lead: "Season and all-time net",
        rest: "one number nobody can argue with.",
      },
      {
        lead: "Round archive",
        rest: "reopen any card, see every hole and every side game.",
      },
      {
        lead: "Head-to-head",
        rest: "your record against each regular.",
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
    status: TODAY,
    body: "Pars, ratings, slopes and stroke index for the courses you actually play — so the strokes land right without anyone typing in a scorecard. No GPS yardages: your watch or laser already does that.",
  },
  {
    title: "Receipts for the group chat",
    status: TODAY,
    body: "One card with the final scores, the results and who owes whom — dropped straight into the text thread where the trash talk already lives. Ends the Tuesday re-litigation.",
  },
];

/* ----------------------------------------------------------------- roadmap */

export type RoadmapColumn = {
  status: StatusVariant;
  heading: string;
  items: string[];
};

/**
 * Generated from the capability registry (capabilities.ts): every capability
 * flagged `roadmap` lands in the column for its status. Change a status there,
 * not a list here.
 */
const roadmapLines = (status: CapabilityStatus): string[] =>
  capabilitiesWithStatus(status)
    .filter((c) => c.roadmap)
    .map((c) => c.label);

/** The roadmap section's heading copy. "In beta" stops being true at launch. */
export const roadmapIntro = {
  kicker: "WHERE THE APP ACTUALLY IS",
  title: launched
    ? "Here’s the honest list."
    : "We’re in beta, so here’s the honest list.",
  lead: "Nothing on this page is a mockup of something we hope to build someday, but not everything is finished either. Three columns, no marketing.",
};

export const roadmap: RoadmapColumn[] = [
  { status: "today", heading: "IN THE APP TODAY", items: roadmapLines("live") },
  {
    status: "testing",
    heading: "IN TESTING WITH REAL GROUPS",
    items: roadmapLines("testing"),
  },
  {
    status: "planned",
    heading: "ON THE LIST, NOT BUILT",
    items: roadmapLines("planned"),
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

/**
 * Only real testers who agreed in writing to be quoted, with what they wrote.
 * Empty until then; /features renders no quotes band while it is.
 */
export const betaQuotes: BetaQuote[] = [];

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
      "No. GoLo tracks who owes what and reduces it to a short settle-up list — then you settle up outside the app, in cash, Venmo, Zelle or however your group already does it. Nothing runs through us, and we never see the money.",
  },
  {
    id: "everyone-need-the-app",
    question: "Does everyone in the group need the app?",
    answer:
      "No. One phone keeps the card. Anyone signed in can join the round and follow it live on their own phone, but only the scorer enters scores — in a scramble, each team can have its own. Everyone entering their own scores is on the list, not built yet.",
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
      // claim-ok: the list after "doesn't do today:" is what GoLo doesn't do
      "Most of them. Skins carryover on or off, which skins count, how Best Score splits, net or gross — you set it at the first tee and the app scores it your way. What it doesn’t do today: automatic presses, presses on a Nassau (they’re on the Overall Match game), 90% allowances, or playing off the low man. Everyone gets their full course handicap.",
  },
  // Answers a pre-launch question, so it goes when the app does.
  ...(launched
    ? []
    : [
        {
          id: "launch-and-cost",
          question: "When does it launch, and what will it cost?",
          answer:
            "We’re in beta with real groups and we don’t have a public date yet — when we do, it’ll be on the blog and in the newsletter before it’s anywhere else. It’s free while we’re in beta.",
        },
      ]),
];
