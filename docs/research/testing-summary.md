# Testing summary (SEO-16)

What the GoLo testing study (#75) may say, and what it may not. Resolved October 16, 2026, for soleman23/golowebsite#74.

**Basis.** No reliable private testing records exist: no per-round log, no completion or settlement counts, no session data. The owner decided on 2026-10-16 that unverifiable claims are removed or rewritten, never reconstructed. So this summary rests on the one record that does exist, the app's own repository: soleman23/golo, `main` at `acd6eee` (GoLo 1.0.0, the production branch), with its commits, issues and pull requests from 2026-06-18 to 2026-10-15. Every claim in the draft is resolved in `docs/research/testing-claims.md`. This file has no personal data.

## Verified facts

### Timeline

| Date | Event | Source |
|---|---|---|
| 2026-06-18 | First commit of the app | golo `6ec1a43` |
| 2026-10-09 | 0.6.0 post-release record | golo #271 |
| 2026-10-10 | 0.6.1 and 0.6.2 | golo release commits; `docs/ENVIRONMENTS.md` |
| 2026-10-13 | 0.7.0 | golo release commits |
| 2026-10-15 | 0.7.1, and 1.0.0 (build 19) prepared as a Google Play candidate | golo `acd6eee` |

The store apps weren't public as of 2026-10-16 (registry: `store-apps` follows the launch flag). A Play *candidate* is not a release.

### Changes, with the problem each fixed

Each line is stated as the commit or PR states it.

| Date | What changed | The problem, as recorded | Source |
|---|---|---|---|
| 2026-06-29 | Each hole opens at par as an editable default. Par counts only when the scorer moves on or finishes. | Opening or peeking at a hole used to stamp par for every player. | golo `567576e` |
| 2026-07-20 | A scorecard view on the leaderboard. Any hole already played can be tapped and edited there. | — (feature) | golo `32ea972` |
| 2026-07-23 | Per-bet detail moved from the scoring screen into the leaderboard (a bet-detail sheet). Match Play status and side-game flags stay on the scoring screen. | No reason recorded. | golo PR #14, `636957f` |
| 2026-08-01 | Every side game settles in integer cents. Splits use largest-remainder division that sums back exactly. | Engines computed in floating-point dollars, so splits left residue: "A $10 purse across three players antes $3.33 each and pays out $9.99." A half-cent tolerance in the settlement hid it. | golo `76e0631` (GOLO-044) |
| 2026-09-26 | Saving Setup again on a round in play keeps its presses and the closures they made. A game with presses in play can't be turned off or have its players or amount changed. | Re-saving Setup mid-round deleted every press and its closures, so settle-up paid without them. Found in review the same day. | golo #285 → PR #291 (GOLO-104) |
| 2026-09-28 | A Skins carry rides to the card's last hole; only a tie there splits it. | Mid-round, the live money view split a carry among players tied on the latest hole, showing money the next outright winner would take. The PR's example: after hole 3, two players showed +$1.50 each; hole 4 then went to a third player outright, while the label said the skin was riding. | golo PR #313 (GOLO-109) |
| 2026-10-06 | A press can't be called from a hole behind the scored card ("Go to the latest hole to press"). | A press starts on the hole after the one on screen. A scorer who stepped back to an earlier hole was offered one, so it bet on holes already played, and with a close it froze the original match at the wrong standing. Presses can't be undone. | golo PR #353 (GOLO-129) |
| 2026-10-07 | Setup re-asks every player to agree only when the side-game terms materially change: a stake, a game, a player's name or handicap, or the card. Player colours and in-play state (presses, flags) don't count. | Before, every save re-locked the terms. | golo PR #452 (GOLO-186) |
| 2026-10-07 | Settled money shows to the cent ("$12.50", not "$12.5"). | — | golo `71ed3db` (GOLO-164) |

### What the app does today (`main`, `acd6eee`)

- **Setup:** five steps (Course, Players, Format, Games, Review) with defaults: a $1 stake per game, and Skins with carryover.
- **Scoring:** one scorer enters scores; any hole already played can be edited from the card view.
- **Presses:** called from a short sheet, starting at the next hole, on the Overall Match only.
- **Skins carries:** automatic on tied holes when carryover is on.
- **Mid-round stake changes:** the organizer can change a game's amount in Setup.
  - Every player agrees again.
  - The change reprices the whole game.
  - It's refused once that game has presses in play.
- **Settle-up:** greedy. Debtors and creditors are sorted biggest first once, then both lists are walked, each payment settling the smaller of the two balances. That never takes more than one payment fewer than the number of players, and it isn't always the minimum (#103).
- **Streaks:** a "Hot hand" badge for three money-positive rounds in a row, in a six-badge Trophy Case.
- **Not in the app:** GPS yardages (the owner confirmed "cut", 2026-10-15), scorecard scanning, in-app chat, a feed of other groups' rounds, and shot stats (fairways, putts, strokes gained).

### Website correction

On 2026-10-16 the site said GoLo settles up "in the fewest payments". The app's method doesn't guarantee that. The app's own function shows the gap: balances of +4, +3, −2, −2, −3 come out as 4 payments, where 3 would do (the +3 and −3 can settle on their own). Fifteen claims and the share card were corrected, and a lint rule now blocks the wording (#103, #105).

## Unsupported claims removed

Each of these is in the draft, and there's no record behind it:

- **The study itself:** "40 rounds", "over one season", "11 groups", "none of them ours", "6 formats", "before writing any marketing", "the numbers from all forty rounds".
- **Outcomes:** 31 finished, 6 abandoned before the turn, "5 of the 6 quit on holes 3–5", 27 settled in the app, 4 settled from memory, 9 changed the wager mid-round.
- **Process:** "first fifteen rounds asking, last twenty-five watching", "we tracked one thing above everything else", "rebuilt scoring twice".
- **Features cut:** "three features cut" (GPS, scanning, chat) and "because nobody used them". None was ever in the app's history, so "built and cut" can't be shown.
- **Usage:** "Two players opened" the stats; the streak was never mentioned; "used in every single round"; "nobody has asked for any of them since".
- **Behaviour:** setup "spilled into the round"; groups backfill on the next tee; groups "quietly stopped entering scores on the 4th tee"; testers "did not care about our roadmap".
- **Colour:** "real Saturday rounds, real money", "about ninety seconds", "eight years of history", "four hundred hours of designing".
- **The quote** "Nobody wants a golf app. They want the argument to be over.", which has no verified speaker.

## No record exists for

- Any test round: its date, course, group, size, formats, app version, whether it finished, where it stopped, or how it settled.
- How testers used, ignored or reacted to any feature.
- Anything built or decided before 2026-06-18, or outside the golo repository.
- The reasons behind several decisions: moving bet detail to the leaderboard, and dropping GPS. The positioning on `/features` ("your watch or laser already does that") is today's stance, not a recorded reason.
