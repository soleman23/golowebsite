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
 * The glossary launch recheck (soleman23/golowebsite#166, #154 rows 1-13):
 * golo `main` 2237c1d (GoLo 1.2.1, build 28), read by an agent on 2026-10-29
 * at the owner's request; the owner didn't test the app. Presses in
 * src/engines/pressBets.js; Closest to Pin in src/engines/ctp.js and
 * src/lib/roundBets.js ctpHolesOn; strokes in src/engines/handicap.js and the
 * one round tee in src/pages/SetupWizard.jsx; scramble in
 * src/lib/scrambleTeams.js; settle-up in src/engines/payouts.js and
 * src/lib/venmo.js; skins and carries in src/engines/skins.js and
 * src/engines/betStatus.js; saved groups in migrations/0060_crew_groups.sql and
 * src/lib/db/crew.js. The planned and not-offered entries stamped with it were
 * searched for and not found. It replaces the earlier stamps on those
 * entries: settle-up's at 1.0.0 (acd6eee, soleman23/golowebsite#103) and
 * scramble's at 1.2.1 (2026-10-28), whose findings it confirms.
 *
 * The same check, applied in soleman23/golowebsite#200: the game list in
 * src/pages/SetupWizard.jsx GAME_DEFS and src/engines/betResults.js; Greenie
 * and Sandie in src/engines/skins.js calculateManualSkins, the Skins types in
 * SetupWizard.jsx and the per-hole flags in src/pages/ScoringPage.jsx; one
 * scorer per scramble team in src/lib/teamScorers.js; Wolf's rotation in
 * src/engines/wolf.js getWolfOrder; Longest Drive in
 * src/engines/longestDrive.js. Where it differs from the owner's answers of
 * 2026-10-29 (no junk board, #172 and #154 Q-a; a press on a press, Q-b; a
 * Closest to Pin carry, #195), the code wins.
 */
const APP_CHECK_1029 = {
  by: "app-check",
  date: "2026-10-29",
  appVersion: "1.2.1",
} as const;

/**
 * The blog pair-1 check (2026-10-30): golo `main` 2237c1d (GoLo 1.2.1) read
 * again for the Skins-vs-Nassau and match-play posts. Team Play in
 * src/pages/SetupWizard.jsx (the "Fixed partners · Team Play · 2v2" toggle,
 * TEAM_GAME_KEYS, Wolf locked out) and src/engines/teamScoring.js
 * deriveTeamHole (each team's lower gross and lower net on the hole); the
 * head-to-head pairings in src/engines/nassau.js calculateNassauGroup and
 * src/engines/overallPurse.js.
 */
const APP_CHECK_1030 = {
  by: "app-check",
  date: "2026-10-30",
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
      "One scorer taps in each hole, or one per team in a scramble; net and gross are both kept for every player.",
    verified: APP_CHECK_1029,
    roadmap: true,
  },
  {
    id: "game-library",
    // Closest to Pin has its own entry, and so do the Skins game's Greenie
    // and Sandie options (skins-greenie-sandie).
    label: "Nassau, Overall Match, skins, Best Score, Wolf, Bingo Bango Bongo, Longest Drive",
    status: "live",
    summary:
      "Run several games in one round, each with its own amount, netted into one number per player.",
    limits: [
      "Birdie and eagle bounties are Skins settings (Birdie Skin, Eagle Skin), gross birdies only, no cap.",
      "No separate junk board: greenies and sandies are Skins settings, and barkies, poleys, snakes and arnies aren't scored.",
      "Longest Drive is played on one par 5 and doesn't record a measured distance.",
      "Wolf takes exactly four players, and the wolf rotates in player order; GoLo sets no tee order.",
      // From APP_CHECK_1030 (src/engines/nassau.js calculateNassauGroup).
      "Without teams, Nassau and the Overall Match are played head to head: with three or four players, every pair has its own match.",
    ],
    verified: APP_CHECK_1029,
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
    verified: APP_CHECK_1029,
    roadmap: true,
  },
  {
    id: "team-play",
    label: "Team Play, two against two",
    status: "live",
    summary:
      "Four players in two fixed pairs; each team's better score on a hole counts, and Skins, Nassau, Best Score and the Overall Match play team against team.",
    limits: [
      "Exactly four players, two teams of two.",
      "Wolf isn't played in Team Play.",
    ],
    verified: APP_CHECK_1030,
  },
  {
    id: "overall-match-presses",
    label: "Presses on the Overall Match game",
    status: "live",
    summary:
      "A press can start once a side is 2 or more down, at two, three or four times the amount; up to two live at once.",
    // The owner's "a side can press a press" (2026-10-29, #154 Q-b) isn't in
    // the code: every press hangs off the Overall Match, and a side qualifies
    // on the main match's standing, never on a press's (APP_CHECK_1029).
    limits: [
      "Entered by the scorer, never automatic.",
      "Nassau doesn't take presses.",
      "A press can't itself be pressed: a second press also needs a side 2 or more down in the main match.",
    ],
    verified: APP_CHECK_1029,
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
    verified: APP_CHECK_1029,
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
    verified: APP_CHECK_1029,
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
    id: "closest-to-pin",
    label: "Closest to Pin",
    status: "live",
    summary:
      "The scorer marks the winner on each par 3 in the game (all of them, or the back nine's), and the amount is netted into the settle-up with every other game.",
    // A hole nobody wins is skipped (src/engines/ctp.js); the carry the owner
    // described on 2026-10-29 (#195) belongs to the Skins game's Greenie
    // option, not to this game (APP_CHECK_1029).
    limits: [
      "No measured distance is recorded.",
      "A hole nobody wins pays nothing; it doesn't carry.",
      "Par-to-win isn't checked in this game: the group decides before the scorer marks the winner. The Skins game's Greenie option does check it.",
    ],
    verified: APP_CHECK_1029,
    // These catch par-to-win presented as something GoLo's Closest to Pin
    // game checks. Copy about the Greenie option says "par or better" instead,
    // so it doesn't trip them.
    overclaims: [
      "enforces par",
      "enforces par-to-win",
      "checks par-to-win",
      "checks for par",
      "verifies par",
      "par-to-win check",
    ],
  },
  {
    id: "skins-greenie-sandie",
    label: "Greenie and Sandie skins",
    status: "live",
    summary:
      "Skins options: on a par 3, the closest tee shot wins a greenie if that player makes par or better, and an unclaimed greenie carries to the next par 3; every par-or-better sand save wins a sandie.",
    limits: [
      "The scorer flags the closest player and the players who were in a bunker; GoLo checks the par from the gross score.",
      "A greenie still carried after the last par 3 is lost.",
      "No barkies, poleys, snakes or arnies.",
    ],
    verified: APP_CHECK_1029,
  },
  {
    id: "live-skins",
    label: "Live skins and carries",
    status: "live",
    summary:
      "Skins and carries build hole by hole on the scoring screen and the live leaderboard.",
    verified: APP_CHECK_1029,
  },
  {
    id: "saved-groups",
    label: "Saved groups, teams included",
    status: "live",
    summary: "Save a regular group, teams and all, and load it next round.",
    verified: APP_CHECK_1029,
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
    // golo main 2237c1d (1.2.1) SetupWizard.jsx incHdcp and the hdcp stepper:
    // a guest's index starts at 12 and moves in steps of 1.0 (2026-10-30).
    limits: ["A guest’s index is set with a stepper in whole numbers."],
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
    verified: APP_CHECK_1029,
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
    verified: APP_CHECK_1029,
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
    verified: APP_CHECK_1029,
    claimPhrases: ["90%", "95%", "low man", "allowance"],
  },
  {
    id: "mixed-tees",
    label: "Different tees per player",
    status: "planned",
    summary: "Players in one group on different tees.",
    verified: APP_CHECK_1029,
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
    verified: APP_CHECK_1029,
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
    id: "junk-board",
    label: "Junk board",
    status: "not-offered",
    summary:
      "A separate board of junk side points (barkies, poleys, snakes, arnies). Greenies and sandies are Skins options, not a junk board.",
    verified: APP_CHECK_1029,
    // Golf copy may still explain junk; these catch a junk board presented as
    // something GoLo has (soleman23/golowebsite#172). "log a sandie" came out
    // in #200: the scorer does flag sandies, as a Skins option.
    claimPhrases: [
      // Any "junk" in product copy (education files only count strings that
      // name GoLo or the app); the rest catch the items by name.
      "junk",
      "log a barkie",
    ],
  },
  {
    id: "skins-validation",
    label: "Skins validation rules",
    status: "not-offered",
    summary:
      "House rules that carried skins only count on a birdie, a par minimum or a two-putt.",
    limits: [
      "The Greenie and Sandie options need par or better to pay; that's part of those skins, not a rule on carried skins.",
    ],
    verified: APP_CHECK_1029,
    // The guide can explain validation as golf; these catch it presented as
    // something GoLo applies (soleman23/golowebsite#176).
    claimPhrases: ["every validation", "validation rule", "tracks validation", "applies validation"],
  },
  {
    id: "distance-logging",
    label: "Distance logging",
    status: "not-offered",
    summary:
      "Recording the measured distance for Closest to Pin or Longest Drive.",
    verified: APP_CHECK_1029,
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
