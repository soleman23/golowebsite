/**
 * /faq content: categories, each holding questions with stable ids so
 * individual answers can be deep-linked (/faq#q-settle).
 *
 * This file is the single source of FAQ copy. The home page's short list is
 * the same six as the "most asked" panel and is re-exported from here through
 * home.ts — an answer is never written down twice.
 *
 * Three answers deviate from the design handoff because the handoff copy
 * contradicted the shipped privacy policy or pointed at a route that doesn't
 * exist. Each one is flagged inline. The policy wins.
 */

import { siteConfig } from "@/lib/siteConfig";

export type FaqItem = {
  /** Anchor id — the whole point of this page. `/faq#q-settle` opens this one. */
  id: string;
  q: string;
  a: string;
  /** Uppercase tag on the callout under the answer, e.g. "STATUS". */
  noteTag?: string;
  note?: string;
  link?: { label: string; href: string };
};

export type FaqCategory = {
  id: string;
  /** Short uppercase form, for the rail chip at mid width. */
  short: string;
  label: string;
  blurb: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "starting",
    short: "GETTING STARTED",
    label: "Getting started",
    blurb: "Where GoLo is today, and what the first round looks like.",
    items: [
      {
        id: "q-available",
        q: "Is GoLo available yet?",
        a: "Not yet. We’re building it and testing with real groups on real courses before we put it in anybody’s hands. There’s no App Store link today — when there is, it goes on the home page first.",
        noteTag: "STATUS",
        note: "In private testing. No public launch date announced.",
      },
      {
        id: "q-everyone",
        q: "Do all four of us need the app?",
        a: "No. One person runs the whole round and the rest just play. Share the live link or the final summary to the group chat so everyone can follow along and check the receipts.",
      },
      {
        id: "q-start-round",
        q: "How do I start a round?",
        a: "Pick the course, pick the tees, add your players, stack the games you’re playing, and tee off. Setup is four screens and takes about as long as loading the cart.",
      },
      {
        id: "q-need-first-tee",
        q: "What do I need before the first tee?",
        a: "Names and — if you’re playing net — handicap indexes. Everything else (course, tees, stroke index) comes from the course you pick. You can add a player after the round starts, too.",
      },
    ],
  },
  {
    id: "scoring",
    short: "SCORING & GAMES",
    label: "Scoring & the games",
    blurb:
      "Stacking formats, entering scores, and fixing the ones you got wrong.",
    items: [
      {
        id: "q-which-games",
        q: "Which games can I run at once?",
        a: "Stack as many as you want in one round: Skins, Nassau, Stroke Purse, Wolf, Bingo Bango Bongo, Closest to Pin, Longest Drive and Birdies. Each is scored on its own, then netted into a single number per player at the end.",
        link: { label: "SEE ALL THE GAMES →", href: "/games" },
      },
      {
        id: "q-hole-by-hole",
        q: "Do I have to enter scores hole by hole?",
        a: "That’s the fast path — one tap per player as you walk off the green, and every game updates instantly. If you got busy, you can back-fill a hole or three later without losing anything.",
      },
      {
        id: "q-fix-score",
        q: "Can I fix a score after the hole?",
        a: "Yes. Tap any hole, change the number, and every total, press and payout recalculates. Everyone in the round sees the correction, so nobody is arguing from an old screen.",
      },
      {
        id: "q-pickup",
        q: "What if somebody picks up and never holes out?",
        a: "Record their maximum for the hole — most groups use double par or the ESC cap. Net scoring stays honest and the hole still counts in the games that need a number.",
      },
    ],
  },
  {
    id: "handicaps",
    short: "HANDICAPS",
    label: "Handicaps & fairness",
    blurb:
      "How strokes get allocated so a 20 and a 5 can play the same bet.",
    items: [
      {
        id: "q-handicaps",
        q: "Does it handle handicaps?",
        a: "Yes — enter each player’s index once and GoLo allocates strokes hole by hole using the course stroke index. Net and gross are both always live, so a 20-handicap and a 5 can play the same game fairly.",
      },
      {
        id: "q-gross-only",
        q: "Can we just play gross?",
        a: "Sure. Turn net off and every game scores straight up. You can also run one game net and another gross in the same round — the strokes only apply where you asked for them.",
      },
      {
        id: "q-no-index",
        q: "What if someone doesn’t know their index?",
        a: "Put in an honest estimate and move on, or play the round gross. You can change an index mid-round and everything recalculates — which is also how you settle the “he’s not a 12” conversation.",
      },
    ],
  },
  {
    id: "bets",
    short: "BETS & SETTLING",
    label: "Bets, settling up & the gambling question",
    blurb:
      "What GoLo does with the money question: the math, and nothing else.",
    items: [
      {
        id: "q-settle",
        q: "How does the settle-up work?",
        a: "When the last putt drops, GoLo totals every game, figures out who’s up and who’s down, and reduces it to the fewest transfers that square the group. Nobody sends four separate payments — you get one clean “pay this person” instruction.",
      },
      {
        id: "q-gambling",
        q: "Is this real-money gambling?",
        a: "GoLo is a scorekeeper for friendly wagers between playing partners — the kind you’ve always settled by hand on the 18th green. It doesn’t process payments or hold money; it just does the math and tells you who owes who. Keep it friendly and play your local rules.",
        // /terms stays unlinked until it clears legal review, same rule the
        // footer follows. The answer reads fine without the link.
        ...(siteConfig.termsPublished
          ? { link: { label: "READ THE TERMS →", href: "/terms" } }
          : {}),
      },
      {
        id: "q-money-move",
        q: "Does money actually move through GoLo?",
        a: "Never. The settlement screen is a scoreboard, not a wallet — we don’t touch cards, balances or transfers. If you save a Venmo handle we just show it to your group so they know where to send it.",
      },
      {
        id: "q-dispute",
        q: "What if someone disputes the tally?",
        a: "Open the hole-by-hole ledger. Every skin, press and stroke is shown with the hole it came from, so the argument ends in about nine seconds.",
      },
      {
        id: "q-stakes",
        q: "Can we set different stakes per game?",
        a: "Yes — each game carries its own stake, so a $5 Nassau and $2 skins live in the same round. Change them any time before the first tee shot.",
      },
    ],
  },
  {
    id: "trips",
    short: "TRIPS",
    label: "Trips & multi-day rounds",
    blurb: "Four days, five guys, one settle-up.",
    items: [
      {
        id: "q-trips",
        q: "What about multi-day trips?",
        a: "Trip mode keeps a running tally across every round so a four-day Scottsdale or Myrtle Beach trip settles once, on the 18th green of the last day — not in a confusing pile of daily Venmos.",
      },
      {
        id: "q-roster",
        q: "Can the group change from day to day?",
        a: "Yes. Each round has its own roster, and the trip tally follows each player across the days they actually played. Guys who join for one round only carry that round’s number.",
      },
      {
        id: "q-games-per-day",
        q: "Can we run different games each day?",
        a: "Every round is set up on its own, so Tuesday can be a Nassau and Wednesday can be Wolf and skins. The trip total nets all of it.",
      },
    ],
  },
  {
    id: "pricing",
    short: "PRICING",
    label: "Pricing & billing",
    blurb: "The honest answer: we haven’t set it.",
    items: [
      {
        id: "q-cost",
        q: "What will GoLo cost?",
        a: "We haven’t set pricing. GoLo isn’t publicly launched, so there’s nothing to buy and no plan to compare yet. When we decide, it gets announced here and on the home page before anyone is asked for a dollar.",
        noteTag: "NO PRICING YET",
        note: "No plans, no tiers, no trial — nothing is for sale today.",
      },
      {
        id: "q-subscription",
        q: "Is there a subscription?",
        a: "Not today. There’s nothing to subscribe to, and no free-trial clock running in the background.",
      },
      {
        id: "q-card",
        q: "Do I have to enter a card?",
        a: "No. GoLo doesn’t collect or store payment card information at all — not for the app, and not for the bets your group settles between themselves.",
      },
    ],
  },
  {
    id: "account",
    short: "ACCOUNT & PRIVACY",
    label: "Account, privacy & your data",
    blurb: "What we collect, what we don’t, and how to leave.",
    items: [
      {
        id: "q-collect",
        q: "What data do you collect?",
        // Handoff copy claimed "no analytics vendor — we don't even collect
        // crash telemetry". /privacy §1 and §4 say the opposite (analytics,
        // logging and crash-reporting providers). Corrected to the policy.
        a: "Your account basics, the scores you enter, an optional photo, and location only while you’re searching for a course. No ads, no data brokers, nothing sold. We do use hosting, analytics and crash-reporting providers to keep the app running — the privacy policy says what each kind gets.",
        link: { label: "READ THE PRIVACY POLICY →", href: "/privacy" },
      },
      {
        id: "q-sell",
        q: "Do you sell my data or run ads?",
        a: "No, and no. GoLo shows no ads, sends no marketing pushes, and never sells personal information. The only notifications we send are live scoring, round activity, and “time to settle up” — each switchable.",
      },
      {
        id: "q-delete",
        q: "How do I delete my account?",
        // Handoff copy pointed at a /delete-account page that doesn't exist and
        // promised immediate deletion. /privacy §8 is the authority: in-app
        // path, email if locked out, 30 days out of active systems.
        a: `You → Account → Delete Account, in the app. Locked out? Email ${siteConfig.supportEmail} and we’ll do it for you. Deletion removes your profile, your photo and any round nobody else played in, and clears active systems within 30 days.`,
        link: { label: "READ THE PRIVACY POLICY →", href: "/privacy" },
      },
      {
        id: "q-shared-rounds",
        q: "What happens to rounds I played with other people?",
        a: "They stay, because they’re your partners’ history too — but your name becomes “Former player” and your email, phone and photo come off. Their leaderboards stay intact; you disappear from them.",
      },
      {
        id: "q-location",
        q: "Are you tracking my location around the course?",
        a: "No. Location is used only in the moment you search for a course, so nearby ones sort to the top. It’s never attached to the round — the round records the course you picked.",
      },
    ],
  },
  {
    id: "offline",
    short: "OFFLINE & BATTERY",
    label: "Offline, signal & battery",
    blurb: "What happens on the back nine where there are no bars.",
    items: [
      {
        id: "q-offline",
        q: "Does it work with no signal?",
        a: "That’s the bar we’re building to: scoring stays on your phone and syncs to the group the moment signal comes back. Dead-spot behavior is one of the things we’re hammering on in testing right now.",
      },
      {
        id: "q-battery",
        q: "Will it drain my battery over 18 holes?",
        a: "It shouldn’t — there’s no continuous GPS tracking and no map running in the background. Location gets used once, when you search for the course, and then it’s done.",
      },
      {
        id: "q-devices",
        q: "Can I use it on a tablet or a cart screen?",
        a: "It runs in a browser, so any decent screen works. The scoring layout is built phone-first, thumb-first — that’s the one we design against.",
      },
    ],
  },
  {
    id: "trouble",
    short: "TROUBLESHOOTING",
    label: "Troubleshooting",
    blurb: "When it looks wrong, start here.",
    items: [
      {
        id: "q-not-syncing",
        q: "Scores aren’t showing up for the rest of the group.",
        a: "Usually signal. Refresh the round; the host device is the source of truth and will push the latest state. If it’s still stale after a refresh, send us the round name and roughly when it happened.",
      },
      {
        id: "q-wrong-course",
        q: "I picked the wrong course or the wrong tees.",
        a: "Change it in the round settings. Pars and stroke index reload from the right card and every net score, skin and press recalculates on the spot.",
      },
      {
        id: "q-bug",
        q: "Something’s broken. What do you need from me?",
        // Handoff copy hardcoded support@gologolf.app; the address of record
        // lives in siteConfig.
        a: `Email ${siteConfig.supportEmail} with the round name, roughly what time it happened, and what you expected to see. A screenshot of the scorecard makes it about five times faster to fix.`,
        link: { label: "GET IN TOUCH →", href: "/contact" },
      },
    ],
  },
];

/** Ids of the six in the "most asked" panel, in the order they're shown. */
export const mostAskedFaqIds = [
  "q-handicaps",
  "q-which-games",
  "q-settle",
  "q-gambling",
  "q-everyone",
  "q-trips",
] as const;

/** Every question on the page, in reading order. Drives the count and the JSON-LD. */
export const faqItems: FaqItem[] = faqCategories.flatMap((c) => c.items);

export function findFaqItem(id: string): FaqItem | undefined {
  return faqItems.find((item) => item.id === id);
}

/**
 * The six most-asked, resolved. Also what the home page shows — see home.ts.
 * Filtered rather than asserted so a renamed id degrades to a shorter list
 * instead of an undefined blowing up at render.
 */
export const mostAskedFaqs: FaqItem[] = mostAskedFaqIds
  .map((id) => findFaqItem(id))
  .filter((item): item is FaqItem => Boolean(item));

/** Hero meta line: "33 questions · 9 categories". Never hand-typed. */
export const faqCountLine = `${faqItems.length} questions · ${faqCategories.length} categories`;

export type FaqReadNext = {
  label: string;
  blurb: string;
  cta: string;
  href: string;
};

export const faqKeepReading: FaqReadNext[] = [
  {
    label: "Features",
    blurb:
      "Round setup, live scoring, presses, handicaps and the settle-up — what the app actually does today.",
    cta: "SEE THE FEATURES",
    href: "/features",
  },
  {
    label: "The games",
    blurb:
      "Skins, Nassau, Wolf, Bingo Bango Bongo — every format and how it scores.",
    cta: "BROWSE THE GAMES",
    href: "/games",
  },
  {
    label: "Blog",
    blurb:
      "Game rules, settling etiquette, trip structures, and honest notes from building GoLo.",
    cta: "READ THE BLOG",
    href: "/blog",
  },
];
