# Testing summary (SEO-16)

What the GoLo testing study (#75) may say, and what it may not. Resolved October 16, 2026, for soleman23/golowebsite#74.

**Basis.** No reliable private testing records exist: no per-round log, no completion or settlement counts, no session data. The owner decided on 2026-10-16 that unverifiable claims are removed or rewritten, never reconstructed. So this summary rests only on these sources:

1. **The app's repository:** soleman23/golo, `main` at `acd6eee` (GoLo 1.0.0, the production branch), with its commits, issues and pull requests from 2026-06-18 to 2026-10-15. This is the source for the timeline, the changes and what the app does today.
2. **This website's repository:** the capability registry (`lib/content/capabilities.ts`), including the owner's confirmation on 2026-10-15 that GPS yardages were cut, and the correction history in soleman23/golowebsite#103 and #105.
3. **The owner's decision of 2026-10-16** on how to treat claims without a record.

Every claim in the draft is resolved in `docs/research/testing-claims.md`. This file has no personal data.

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
- **Settle-up:** greedy. Debtors and creditors are sorted biggest first once, then both lists are walked, each payment settling the smaller of the two balances. For n players it never needs more than n − 1 payments, and it isn't always the minimum (#103).
- **Streaks:** a "Hot hand" badge for three money-positive rounds in a row, in a six-badge Trophy Case.
- **Money:** GoLo never holds, moves or processes money (registry `settle-up` limits).
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
- Anything built or decided before 2026-06-18, or outside the three sources above.
- The reasons behind several decisions: moving bet detail to the leaderboard, and dropping GPS. The positioning on `/features` ("your watch or laser already does that") is today's stance, not a recorded reason.

## Re-check and republication, 2026-11-09 (M4)

Both M4 posts were hidden on 2026-10-30 (7b2065b) and republished on 2026-11-09 on the owner's authorization, after an agent re-checked them against soleman23/golo, read-only: commits, issues, PRs, and `main` at `398a08b2` (2026-11-05, GoLo 1.2.2, Android build 34). This was a source check, not owner confirmation, and nothing in it is a record of real rounds.

**`/blog/what-we-got-wrong`, a build note.** Every dated fix still holds. Corrected:
- The presses fix was found and merged on September 25, Pacific (issue #285 opened 2026-09-26 UTC; PR #291 merged 2026-09-25 20:30 PT). The post had said September 26.
- Money to the cent landed on October 6 (settle-up screens, 71ed3db3) and October 7 (scoring, PR #442). The post had said October 7.
- The re-agree list now names the format, teams, net or gross and the holes, and says the Closest to Pin and Longest Drive marks don't count (src/lib/termsSummary.js).
- The press lock now names the round's shape: Scramble or Team Play, the teams, net or gross, and the holes (9faf5e76).
- "One scorer" now says "or one per team in a scramble" (src/lib/teamScorers.js).
- Removed: "reading the code during a review". The original find isn't in commit text.
- Added a section on where the note comes from and what it can't say.

**`/blog/settle-up-screen`, now titled "How GoLo settles up".**
- The method is from src/engines/payouts.js `calculateSettlementCents`: whole cents; both lists sorted once, largest first, ties by player id; walked without re-sorting.
- Both worked examples were run through the app's own `calculateSettlements` and match:
  - +47, +18, −9, −21, −35 gives four settle-ups.
  - +4, +3, −2, −2, −3 gives four where three would do.
- Removed as unsupported:
  - "It took several versions";
  - the "What we tried" sequence (ledger, matrix, net per player) and its tester reactions;
  - the unattributed pull quote;
  - "twelve debts";
  - "in ninety seconds";
  - the claim that the decision not to move money was "product before legal".
- Corrected:
  - Tapping a player switches whose view you see; it doesn't open their games. Each game's card shows every player's result, and a tap opens the game's lines.
  - Marking paid has two layers: a Mark settled toggle on the phone showing it, and payment requests between accounts (sent, confirmed or disputed).
  - The share card is live (golo #954, 2026-10-26).
  - A saved Venmo handle is shown to whoever owes, on the payments screen. The registry's `payment-handle` summary and the FAQ money answer said "shown to the group at settle-up", and both are corrected.

**Second pass, the same day.** An independent fact check of the rewrite added these corrections:
- The fix dates are when each fix merged into the app's development branch. The September 25 to October 7 fixes reached the production web app (`main`) on October 9.
- The re-check is against the production *web* build. Play was on an earlier build at the time.
- The June 29 step's finish prompt dates from October 7 (PR #419).
- The skins figures are illustrative, so they're marked "for example".
- "place in the order" is out of the re-agree list.
- The share card draws the course, the games, up to six settle-ups and highlights (src/lib/receiptCard.js), not scores. The final standings are in the copied text summary. Corrected in the registry, `/features`, the FAQ, the group-accountant post and the settle-up post.
- `/features` said "tap any number to see which game produced it". Tapping a standings number switches whose view you see, so it now describes the game cards.
- The About line no longer promises a write-up for every mistake.
- Not changed: the Terms of Service still say a saved Venmo handle is displayed "to the other players in your group" (`lib/content/legal.ts`). That's legal text, left for the owner.

**The testing study is still blocked.** M4 asks for a testing study built from a testing log. No first-party record of test rounds exists in this repo or in the app repo:
- `docs/TESTFLIGHT.md` is a template.
- The external beta (golo #92) and go/no-go (#57, #58) issues are still open.
- The settlement and regression documents are scripted browser runs, not golf.

`/blog/what-we-got-wrong` is a qualitative build note from code history. It doesn't count as that study. The study needs the private per-round log described in `testing-claims.md` (one CSV row per real round, kept outside the repo, summarised with `scripts/testing-summary.mjs`).
