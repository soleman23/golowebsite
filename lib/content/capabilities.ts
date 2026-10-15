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
 * One entry follows siteConfig.appLive instead of a fixed status: the store
 * apps are live exactly when the launch flag says the app is downloadable, so
 * flipping that flag moves them on the roadmap, in the FAQ and in the
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
};

/** soleman23/golowebsite#27: golo `main` 291c545, GoLo 0.6.2. */
const APP_CHECK_062 = {
  by: "app-check",
  date: "2026-10-11",
  appVersion: "0.6.2",
} as const;

/** Owner's answers on 2026-10-15 (soleman23/golowebsite#61). */
const OWNER_1015 = { by: "owner", date: "2026-10-15" } as const;

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
      "Run several games in one round, each with its own stake, netted into one number per player.",
    limits: [
      "Birdie and eagle bounties are a Skins setting (Birdie Skin, Eagle Skin), gross birdies only, no cap.",
      "Closest to Pin and Longest Drive don't record a measured distance.",
    ],
    verified: OWNER_1015,
    roadmap: true,
  },
  {
    id: "overall-match-presses",
    label: "Presses on the Overall Match game",
    status: "live",
    summary:
      "The side 2 or more down calls a press at two, three or four times the stake; up to two live at once.",
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
    summary:
      "Every game netted into one number per player, then the fewest payments that square the group; each round is saved.",
    limits: [
      "Each round settles on its own.",
      "GoLo never holds, moves or processes money.",
    ],
    verified: APP_CHECK_062,
    roadmap: true,
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
      "One card with the final scores, the money and who pays whom, sent to the group's text thread.",
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
    limits: ["GoLo doesn't send or receive the payment."],
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
      "GoLo runs in a phone browser today, in private testing; there's no public sign-up yet.",
    verified: OWNER_1015,
  },

  /* ---------------------------------------------------------- testing */
  {
    id: "dead-spot-sync",
    label: "Scoring through dead spots",
    status: "testing",
    summary:
      "Scores stay on the phone with no signal and sync to the group when it returns.",
    verified: SITE_COPY_1015,
    roadmap: true,
  },

  /* ---------------------------------------------------------- planned */
  {
    id: "self-scoring",
    label: "Everyone entering their own scores",
    status: "planned",
    summary: "Each player enters their own scores instead of one scorer.",
    verified: APP_CHECK_062,
    roadmap: true,
  },
  {
    id: "trip-tally",
    label: "Multi-day trip tallies",
    status: "planned",
    summary: "One running tally across a trip's rounds, settled once.",
    verified: APP_CHECK_062,
    roadmap: true,
  },
  {
    id: "store-apps",
    label: "iPhone and Android apps",
    // Follows the launch flag; see the note at the top of the file.
    status: siteConfig.appLive ? "live" : "planned",
    summary: "Native apps in the App Store and Google Play.",
    verified: OWNER_1015,
    roadmap: true,
  },
  {
    id: "watch-app",
    label: "Watch app",
    status: "planned",
    summary: "Scoring from a watch.",
    verified: SITE_COPY_1015,
    roadmap: true,
  },
  {
    id: "auto-press",
    label: "Automatic presses",
    status: "planned",
    summary: "Presses that open on their own at 2 down.",
    verified: APP_CHECK_062,
  },
  {
    id: "nassau-presses",
    label: "Presses on a Nassau",
    status: "planned",
    summary: "Presses on the Nassau game itself.",
    verified: APP_CHECK_062,
  },
  {
    id: "handicap-allowances",
    label: "Handicap allowances",
    status: "planned",
    summary: "Percentage allowances such as 90%, and playing off the low man.",
    verified: APP_CHECK_062,
  },
  {
    id: "mixed-tees",
    label: "Different tees per player",
    status: "planned",
    summary: "Players in one group on different tees.",
    verified: APP_CHECK_062,
  },
  {
    id: "quota",
    label: "Quota game",
    status: "planned",
    summary: "A points quota game.",
    verified: APP_CHECK_062,
  },

  /* ------------------------------------------------------ not offered */
  {
    id: "gps-yardages",
    label: "GPS yardages",
    status: "not-offered",
    summary: "Cut. Not in the app and not on the list.",
    verified: OWNER_1015,
  },
  {
    id: "public-live-link",
    label: "Public live link",
    status: "not-offered",
    summary: "A link anyone outside the round can open to follow it.",
    verified: OWNER_1015,
  },
  {
    id: "distance-logging",
    label: "Distance logging",
    status: "not-offered",
    summary:
      "Recording the measured distance for Closest to Pin or Longest Drive.",
    verified: OWNER_1015,
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
