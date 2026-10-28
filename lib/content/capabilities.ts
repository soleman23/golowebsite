/**
 * What GoLo does, in one place. Every public claim about the app — page copy,
 * FAQ answers, guide CTAs, metadata, structured data — should agree with the
 * status recorded here, and the /features roadmap is generated from it.
 *
 * Why it exists: status used to live in prose across a dozen files, and they
 * drifted. The FAQ described a "Trip mode" that /features listed as not built
 * (fixed in soleman23/golowebsite#83), and Wolf was "in testing" on one page
 * and fully supported on another.
 *
 * The rule: when an app release changes what's true, change the entry here
 * first — status and `verified` — then the copy that mentions it. Don't
 * promote a capability on a page's say-so; check the build or ask the owner,
 * and record which in `verified`.
 *
 * - live         in the app people are using today
 * - testing      built, being tried with real groups, not yet dependable
 * - planned      on the list, not built
 * - not-offered  not in the app and not on the list (including things cut)
 *
 * One entry follows siteConfig instead of a fixed status: the iPhone app is
 * live exactly when siteConfig.iosLive says its App Store listing is public,
 * so flipping that moves it on the roadmap, in the FAQ, on /about and in the
 * SoftwareApplication schema together.
 */

import { siteConfig } from "@/lib/siteConfig";

export type CapabilityStatus = "live" | "testing" | "planned" | "not-offered";

export type Capability = {
  id: string;
  /** Public name, as the roadmap shows it. */
  label: string;
  status: CapabilityStatus;
  /** Approved one-line public description. */
  summary: string;
  /** What it doesn't do, stated plainly wherever the capability is described. */
  limits?: string[];
  /**
   * How the status was established. `app-check` = read from the app's code at
   * that version; `owner` = confirmed by the owner on that date; `site-copy` =
   * carried over from what the site already said, not yet checked against the
   * app. Check a `site-copy` entry before building new copy on it.
   */
  verified: {
    by: "app-check" | "owner" | "site-copy";
    date: string;
    appVersion?: string;
  };
  /** Shown as a line in the /features roadmap column for its status. */
  roadmap?: boolean;
  /**
   * Phrases that would present this capability as working. While its status
   * isn't `live`, `npm run lint` (scripts/check-content.mjs) fails on any of
   * them in site copy unless the sentence says it isn't built, and on any of
   * them in a title, meta description or the site description at all.
   * Lower-case; matched case-insensitively.
   */
  claimPhrases?: readonly string[];
  /**
   * Extra words that, in the same clause, mark this capability as not out yet
   * ("coming soon"). Only for a built capability waiting on a store; the
   * checker's shared status words stay strict for everything else.
   */
  statusPhrases?: readonly string[];
  /**
   * Phrases that overstate a capability even while it's live: it does
   * something, just not this. `npm run lint` fails on any of them in site
   * copy and metadata, whatever the status, unless the sentence denies it or
   * the line carries `claim-ok: <reason>` (a worked example that really is
   * the minimum, say). Lower-case; matched case-insensitively.
   */
  overclaims?: readonly string[];
};

/** soleman23/golowebsite#27: golo `main` 291c545, GoLo 0.6.2. */
const APP_CHECK_062 = {
  by: "app-check",
  date: "2026-10-11",
  appVersion: "0.6.2",
} as const;

/**
 * soleman23/golowebsite#103: golo `main` acd6eee (GoLo 1.0.0, the production
 * branch), src/engines/payouts.js calculateSettlementCents, called from
 * src/pages/PayoutsPage.jsx.
 */
const APP_CHECK_100 = {
  by: "app-check",
  date: "2026-10-16",
  appVersion: "1.0.0",
} as const;

/**
 * golo `main` 2237c1d (GoLo 1.2.1): the Scramble format in
 * src/pages/SetupWizard.jsx and src/lib/scrambleTeams.js, team handicaps per
 * docs/GOLO-032-SCRAMBLE-HANDICAP.md, team games in src/engines/betResults.js.
 */
const APP_CHECK_121 = {
  by: "app-check",
  date: "2026-10-28",
  appVersion: "1.2.1",
} as const;

/** Owner's answers on 2026-10-15 (soleman23/golowebsite#61). */
const OWNER_1015 = { by: "owner", date: "2026-10-15" } as const;

/**
 * The Android launch, 2026-10-26: GoLo on Google Play
 * (play.google.com/store/apps/details?id=golf.golo.app); the iPhone app waits
 * on Apple, with no date; the web app at gologolf.netlify.app is open to
 * anyone. Relayed from soleman23/golo, where it was checked.
 */
const OWNER_1026 = { by: "owner", date: "2026-10-26" } as const;

/** The site's own wording before the registry existed, unchecked. */
const SITE_COPY_1015 = { by: "site-copy", date: "2026-10-15" } as const;

export const capabilities = [
  /* ------------------------------------------------------------- live */
  {
    id: "hole-scoring",
    label: "Hole-by-hole scoring, net and gross",
    status: "live",
    summary:
      "One scorer taps in each hole; net and gross are both kept for every player.",
    verified: APP_CHECK_062,
    roadmap: true,
  },
  {
    id: "game-library",
    label: "Nassau, skins, Best Score, Wolf, Bingo Bango Bongo, junk board",
    status: "live",
    summary:
      "Run several games in one round, each with its own amount, netted into one number per player.",
    limits: [
      "Birdie and eagle bounties are a Skins setting (Birdie Skin, Eagle Skin), gross birdies only, no cap.",
      "Closest to Pin and Longest Drive don't record a measured distance.",
    ],
    verified: OWNER_1015,
    roadmap: true,
  },
  {
    id: "scramble",
    label: "Scramble with team handicaps",
    status: "live",
    summary:
      "Up to 12 players in 2 to 6 teams of up to four, one ball a team; Skins, Nassau, Best Score and Overall Match play team against team.",
    limits: [
      "Team handicaps follow the WHS percentages (30/20/10% for three players), or play Gross, or the organizer sets them.",
      "Teams of different sizes each use their own percentages, so an uneven split isn't fully evened out.",
      "Wolf and Bingo Bango Bongo aren't played in a scramble.",
      "No Texas scramble drive count and no shamble.",
    ],
    verified: APP_CHECK_121,
    roadmap: true,
  },
  {
    id: "overall-match-presses",
    label: "Presses on the Overall Match game",
    status: "live",
    summary:
      "The side 2 or more down calls a press at two, three or four times the amount; up to two live at once.",
    limits: ["Called, never automatic.", "Nassau doesn't take presses."],
    verified: APP_CHECK_062,
    roadmap: true,
  },
  {
    id: "handicap-strokes",
    label: "Handicap strokes by stroke index",
    status: "live",
    summary:
      "Index in, course handicap out for the group's tees, strokes placed by the card's stroke index.",
    limits: [
      "Everyone gets their full course handicap; no 90% or other allowance except a scramble's team handicap, and nobody plays off the low man.",
      "One set of tees per group.",
    ],
    verified: APP_CHECK_062,
    roadmap: true,
  },
  {
    id: "settle-up",
    label: "Netted settle-up and round history",
    status: "live",
    // The payment list is greedy: debtors and creditors are sorted biggest
    // first once, then both lists are walked, each payment settling the
    // smaller of the two balances, until every balance is zero. For n players
    // that never needs more than n − 1 payments, but it isn't always the
    // minimum: nets of +4, +3, −2, −2, −3 come out as 4 payments where 3
    // would do (the +3 and −3 can settle on their own).
    summary:
      "Every game netted into one number per player, then a short who-owes-whom list for the group; each round is saved.",
    limits: [
      "Each round settles on its own.",
      "For n players, never more than n − 1 settle-ups, but not always the fewest possible.",
      "GoLo never holds, moves or processes money.",
    ],
    verified: APP_CHECK_100,
    roadmap: true,
    overclaims: [
      "fewest payments",
      "fewest settle-ups",
      "fewest possible settle-ups",
      "fewest transfers",
      "fewest possible payments",
      "fewest possible transfers",
      "fewest legible payments",
      "minimum number of payments",
      "minimal set of payments",
      "minimal set of transfers",
      "fewest number of payments",
      "fewest number of transfers",
      "fewest transactions",
      "minimum number of transfers",
      "minimum number of transactions",
      "as few payments as possible",
      "as few transfers as possible",
      "optimal set of payments",
      "optimal set of transfers",
      "smallest set of payments",
      "smallest set of transfers",
      "smallest number of payments",
      "smallest number of transfers",
    ],
  },
  {
    id: "saved-groups",
    label: "Saved groups, teams included",
    status: "live",
    summary: "Save a regular group, teams and all, and load it next round.",
    verified: OWNER_1015,
    roadmap: true,
  },
  {
    id: "share-card",
    label: "Share card for the group chat",
    status: "live",
    summary:
      "One card with the final scores, the results and who owes whom, sent to the group's text thread.",
    verified: OWNER_1015,
    roadmap: true,
  },
  {
    id: "season-stats",
    label: "Season stats in the Locker",
    status: "live",
    // Owner-confirmed on 2026-10-15: season and all-time net, a record per
    // format, an overall head-to-head record, the round archive. No handicap
    // trend, and head-to-head isn't broken down by format.
    summary:
      "Season and all-time net, a record in each format, and an overall head-to-head record against each regular.",
    limits: ["No handicap trend.", "Head-to-head isn't split by format."],
    verified: OWNER_1015,
    roadmap: true,
  },
  {
    id: "live-follow",
    label: "Follow a round live",
    status: "live",
    summary:
      "Signed-in players can join a round and follow it live on their own phones.",
    limits: [
      "One scorer enters scores (one per team in a scramble).",
      "There's no public link for people outside the round.",
    ],
    verified: APP_CHECK_062,
  },
  {
    id: "guests",
    label: "Guests without an account",
    status: "live",
    summary: "Add a guest with a name and an index; no account needed.",
    verified: APP_CHECK_062,
  },
  {
    id: "notifications",
    label: "Round notifications",
    status: "live",
    summary:
      "Live scoring, round activity and settle-up notifications, each switchable.",
    verified: OWNER_1015,
  },
  {
    id: "payment-handle",
    label: "Venmo handle at settle-up",
    status: "live",
    summary:
      "A player can save a Venmo handle, shown to the group at settle-up so they know where to send it.",
    limits: ["GoLo never sends or receives money."],
    verified: OWNER_1015,
  },
  {
    id: "course-data",
    label: "Course database",
    status: "live",
    summary:
      "Pars, ratings, slopes and stroke index load from the course and tees you pick.",
    limits: ["No GPS yardages."],
    // The /how-it-works round picked Tetherow's Tan tees through 0.6.2's UI.
    verified: APP_CHECK_062,
  },
  {
    id: "web-app",
    label: "Runs in a browser",
    status: "live",
    summary:
      "GoLo runs in a phone browser, iPhone included, with the same account as the Android app.",
    verified: OWNER_1026,
  },
  {
    id: "android-app",
    label: "Android app on Google Play",
    status: "live",
    summary: "The Android app, on Google Play.",
    verified: OWNER_1026,
    roadmap: true,
  },

  /* ---------------------------------------------------------- testing */
  {
    id: "ios-app",
    label: "iPhone app",
    // Built, not yet in the App Store: Apple's review hasn't started. Follows
    // siteConfig.iosLive; see the note at the top of the file. It stays off
    // the /features columns until it's live: neither "in testing with real
    // groups" nor "on the list, not built" is true of it today.
    status: siteConfig.iosLive ? "live" : "testing",
    summary:
      "The iPhone app, coming to the App Store. Until then, GoLo runs in Safari on iPhone.",
    verified: OWNER_1026,
    roadmap: siteConfig.iosLive,
    // Only this capability may be excused by "coming soon" / "coming to"
    // (scripts/check-content.mjs): it is built and waiting on the store.
    statusPhrases: ["coming soon", "coming to"],
    claimPhrases: [
      "iphone app",
      "ios app",
      "app for iphone",
      "on the app store",
      "in the app store",
      "from the app store",
      "download on the app store",
      "on iphone and android",
      "on iphone & android",
    ],
  },
  {
    id: "dead-spot-sync",
    label: "Scoring through dead spots",
    status: "testing",
    summary:
      "Scores stay on the phone with no signal and sync to the group when it returns.",
    verified: SITE_COPY_1015,
    roadmap: true,
    claimPhrases: [
      "works offline",
      "works with no signal",
      "works without signal",
      "works in dead spots",
    ],
  },

  /* ---------------------------------------------------------- planned */
  {
    id: "self-scoring",
    label: "Everyone entering their own scores",
    status: "planned",
    summary: "Each player enters their own scores instead of one scorer.",
    verified: APP_CHECK_062,
    roadmap: true,
    claimPhrases: [
      "enter their own scores",
      "entering their own scores",
      "enters their own scores",
      "own scores",
    ],
  },
  {
    id: "trip-tally",
    label: "Multi-day trip tallies",
    status: "planned",
    summary: "One running tally across a trip's rounds, settled once.",
    verified: APP_CHECK_062,
    roadmap: true,
    claimPhrases: [
      "trip mode",
      "trip tally",
      "trip total",
      "trip ledger",
      "ledger across",
      "across every round",
      "across rounds",
    ],
  },
  {
    id: "watch-app",
    label: "Watch app",
    status: "planned",
    summary: "Scoring from a watch.",
    verified: SITE_COPY_1015,
    roadmap: true,
    claimPhrases: ["watch app", "apple watch", "on your watch"],
  },
  {
    id: "auto-press",
    label: "Automatic presses",
    status: "planned",
    summary: "Presses that open on their own at 2 down.",
    verified: APP_CHECK_062,
    claimPhrases: [
      "auto-press",
      "auto press",
      "automatic press",
      "presses automatically",
    ],
  },
  {
    id: "nassau-presses",
    label: "Presses on a Nassau",
    status: "planned",
    summary: "Presses on the Nassau game itself.",
    verified: APP_CHECK_062,
    claimPhrases: [
      "press on a nassau",
      "presses on a nassau",
      "press the nassau",
      "nassau press",
    ],
  },
  {
    id: "handicap-allowances",
    label: "Handicap allowances",
    status: "planned",
    summary: "Percentage allowances such as 90%, and playing off the low man.",
    verified: APP_CHECK_062,
    claimPhrases: ["90%", "95%", "low man", "allowance"],
  },
  {
    id: "mixed-tees",
    label: "Different tees per player",
    status: "planned",
    summary: "Players in one group on different tees.",
    verified: APP_CHECK_062,
    claimPhrases: [
      "tees per player",
      "tee per player",
      "mixed tees",
      "players on different tees",
    ],
  },
  {
    id: "quota",
    label: "Quota game",
    status: "planned",
    summary: "A points quota game.",
    verified: APP_CHECK_062,
    claimPhrases: ["quota"],
  },

  /* ------------------------------------------------------ not offered */
  {
    id: "gps-yardages",
    label: "GPS yardages",
    status: "not-offered",
    summary: "Cut. Not in the app and not on the list.",
    verified: OWNER_1015,
    claimPhrases: ["gps", "yardages"],
  },
  {
    id: "public-live-link",
    label: "Public live link",
    status: "not-offered",
    summary: "A link anyone outside the round can open to follow it.",
    verified: OWNER_1015,
    claimPhrases: ["live link", "public link", "share the link"],
  },
  {
    id: "distance-logging",
    label: "Distance logging",
    status: "not-offered",
    summary:
      "Recording the measured distance for Closest to Pin or Longest Drive.",
    verified: OWNER_1015,
    claimPhrases: [
      "log the distance",
      "log the yardage",
      "log it in the app",
      "logs the distance",
      "record the distance",
    ],
  },
] as const satisfies readonly Capability[];

export type CapabilityId = (typeof capabilities)[number]["id"];

export function capability(id: CapabilityId): Capability {
  // Every CapabilityId is in the list, so this can't miss.
  return capabilities.find((c) => c.id === id) as Capability;
}

/** Capabilities with a given status, in registry order. */
export function capabilitiesWithStatus(
  status: CapabilityStatus,
): readonly Capability[] {
  return capabilities.filter((c) => c.status === status);
}
