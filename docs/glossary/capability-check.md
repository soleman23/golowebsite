# Glossary capability check (#154): owner checklist

What the owner confirms against the current GoLo release before any glossary GoLo note or CTA leans on it. This repo doesn't read the app repo, so nothing below has been re-verified; each row shows what `lib/content/capabilities.ts` says today (`main` at ba08106) and when it was last checked.

Fill in the last three columns, or reply on #154 with the row numbers. An agent then updates the registry in a small PR (`verified: { by: "owner", date, appVersion }`, plus `limits` where useful) and runs `npm run lint:content`.

**Status:** prepared October 29, 2026. Questions Q-a to Q-e answered by the owner on October 29, 2026 (below). Rows 1–13, junk-board and skins-validation were **rechecked by an agent against the app's code on October 29, 2026**, at the owner's request (the owner didn't recheck them or test the app): results in [Release recheck results](#release-recheck-results-2026-10-29). Three of the owner's answers don't match the shipped code (Q-a, Q-b, and the #195 carry).

## Capabilities the glossary will cite

| # | Capability id | Registry today | Last checked | Used by | Still true? | Correction | App version checked |
|---|---|---|---|---|---|---|---|
| 1 | `overall-match-presses` | live: "The side 2 or more down calls a press at two, three or four times the amount; up to two live at once." Limits: called, never automatic; Nassau doesn't take presses | app-check, 0.6.2, 2026-10-11 | Press, Re-press, Nassau, Match Play notes; side-game CTA | | | |
| 2 | `handicap-strokes` | live: Index in, course handicap out for the group's tees, strokes by stroke index. Limits: full course handicap, no 90% or other allowance except a scramble's team handicap, nobody plays off the low man; one set of tees per group | app-check, 0.6.2, 2026-10-11 | Handicap Index, Course Handicap, Stroke Index, Handicap Stroke, Net Score, Handicap Allowance notes; handicap CTA | | | |
| 3 | `hole-scoring` | live: one scorer, net and gross kept for every player | app-check, 0.6.2, 2026-10-11 | Gross Score, Net Score | | | |
| 4 | `auto-press` | planned: presses that open on their own at 2 down | app-check, 0.6.2 | Automatic Press (education only), Press note ("doesn't open presses automatically") | | | |
| 5 | `nassau-presses` | planned | app-check, 0.6.2 | Nassau and Press notes ("its Nassau takes none") | | | |
| 6 | `handicap-allowances` | planned: percentage allowances such as 90%, and playing off the low man | app-check, 0.6.2 | Handicap Allowance, Playing Handicap (education only) | | | |
| 7 | `mixed-tees` | planned: players in one group on different tees | app-check, 0.6.2 | Course Handicap, Slope Rating notes | | | |
| 8 | `quota` | planned | app-check, 0.6.2 | Quota (M8, education only) | | | |
| 9 | `saved-groups` | live, but `site-copy`: **never checked against the app** | site-copy, 2026-10-15 | Not cited by the MVP; listed because #154 names it | | | |
| 10 | `settle-up` | live: netted settle-up; each round settles on its own; at most n − 1 payments, not always the fewest; never holds, moves or processes money | app-check, 1.0.0, 2026-10-16 | Settle-up note; settle-up CTA | | | |
| 11 | `scramble` | live: up to 12 players, 2 to 6 teams; WHS team percentages or Gross or set by the organizer; no Wolf or Bingo Bango Bongo in a scramble; no Texas scramble drive count; no shamble | app-check, 1.2.1, 2026-10-28 | Scramble, Texas Scramble, Shamble notes | | | |
| 12 | `distance-logging` | not offered: no measured distance for Closest to Pin or Longest Drive | owner, 2026-10-15 | Closest to the Pin, Longest Drive notes | | | |
| 13 | `ios-app` | follows `siteConfig.iosLive` (false today); Android live on Google Play since 2026-10-26; web app open to anyone | owner, 2026-10-26 | Every store CTA (GL-QA-19/20) | | | |

## Specific questions

| # | Question | Why the glossary needs it | Answer |
|---|---|---|---|
| Q-a | **Junk board scope.** Which of these does the junk board score today: greenie, sandy, barkie, poley, snake, arnie, birdie bounty, eagle bounty? (`game-library` only records that birdie and eagle bounties are a Skins setting, gross birdies only.) | Junk, Greenie, Sandy notes (#159) and the M8 junk terms. Recommended: one `limits` line on `game-library`, not new capability entries || **No junk board in the app.** What exists lives inside Skins: birdie and eagle skins. Greenie, sandy, barkie, poley, snake and arnie are not offered. Junk, Greenie, Sandy and the M8 junk terms are education only, with no GoLo note. Registry and site copy fixed in #172 / PR #173. |
| Q-b | **Re-press.** On Overall Match, can a side press a press, given "up to two live at once"? Or is a second press only a second press on the original match? | The Re-press GoLo note (#159). Without an answer, Re-press ships with no GoLo note || **Yes, a side can press a press**; the two-live limit still applies. Added to `overall-match-presses` limits in PR #179. Re-press gets a GoLo note written from the registry. |
| Q-c | **Changes due before launch.** Is any capability above expected to change before the glossary launches (for example automatic presses, allowances or mixed tees going live)? | #166 rechecks these at publication || **Unknown.** All 13 rows go into #166's release recheck (below). |
| Q-d | **Skins validation.** The skins guide CTA says GoLo "tracks every carry, every validation" (`lib/content/gameDetail.ts` line 419). Does the app support validation rules (birdie-to-win or par minimum on carried skins)? No capability records it. | Possible existing overclaim found in the #152 audit. Not glossary scope, but the Carryover entry links to that guide || **No skins validation rules in the app.** Filed as #176; the CTA fix and a not-offered `skins-validation` guard are in PR #177. Any glossary Validation record is education only. |
| Q-e | **Wolf tee order.** Does GoLo's Wolf have the wolf tee off first or last? The guide says last, the post says first (`docs/glossary/inventory.md` § Existing site definitions, conflict 1). | The Wolf entry says the order varies either way; the guide and post should agree || **Last.** The guide is right; the post is fixed in #174 / PR #175. |

## Release recheck for #166

Owner, October 29, 2026 (Q-c): it's unknown whether any of these change before launch, so the launch PR rechecks every row against the release then current, and records the result in #166:

1. `overall-match-presses`, including the press-on-press limit
2. `handicap-strokes`
3. `hole-scoring`
4. `auto-press` (still planned?)
5. `nassau-presses` (still planned?)
6. `handicap-allowances` (still planned?)
7. `mixed-tees` (still planned?)
8. `quota` (still planned?)
9. `saved-groups` (still `site-copy`?)
10. `settle-up`
11. `scramble`
12. `distance-logging` (still not offered?)
13. `ios-app` / `siteConfig.iosLive`

Plus the two added on October 29: `junk-board` and `skins-validation`, both still not offered.

## What happens with the answers

- Rows 1–13: a registry PR updates `verified` (and `limits` where the answer adds one). The PR doesn't change any glossary copy.
- Q-a, Q-b: the side-games batch (#159) writes its GoLo notes from the updated registry, by `capabilityIds`, never as literal status text.
- Q-c: copied into #166's release recheck list.
- Q-d, Q-e: each needs its own issue against the existing pages. They're listed here only because the glossary audit found them.

## Release recheck results (2026-10-29)

**Who and what:** an agent, at the owner's written request of October 29, 2026. The owner didn't recheck these rows or test the app. **Evidence:** the app's source at golo `main` 2237c1d55e44 (the production branch: GoLo 1.2.1, Android versionCode 28, iOS 1.2.1 build 28), read only; no app was run and no database was queried. golo `staging` (ae2eacd, 72 commits ahead) changes nothing under `src/`. Google Play listing `golf.golo.app` opened the same day (updated October 27, 2026). Paths below are in the golo repo.

| # | Capability | Result | Evidence | Registry change in the launch PR |
|---|---|---|---|---|
| 1 | `overall-match-presses` | **Partly.** 2+ down, ×2/×3/×4, two live, Overall Match only, never automatic: confirmed. **"A side can press a press" is not in the code:** every press hangs off the Overall Match and a side qualifies on the main match's standing. Nobody "calls" it: the scorer enters it | `src/engines/pressBets.js` `MAX_ACTIVE_PRESSES = 2`, `MULTIPLIERS = [2, 3, 4]`, `margin >= 2` on the parent match, `parentBetId` | Summary reworded; press-on-press limit replaced; `verified` app-check 1.2.1, 2026-10-29. Press and Re-press GoLo notes narrowed |
| 2 | `handicap-strokes` | **Confirmed.** One tee per round; Course Handicap from Index, Slope, Rating, par; strokes by stroke index; full Course Handicap, no allowance outside a scramble, no low-man code. The Index is typed in (no GHIN); a round can also be played Gross | `src/pages/SetupWizard.jsx` (`tee: storedTeeOf`, `calculateCourseHandicap`), `src/engines/handicap.js` | `verified` updated |
| 3 | `hole-scoring` | **Partly.** Net and gross for every entity; one scorer, except a scramble, where each team can have its own | `src/lib/teamScorers.js`, `src/engines/scoring.js` | Corrected in the #200 PR: one scorer, or one per team in a scramble; `verified` app-check 1.2.1 |
| 4 | `auto-press` | **Not built** for users: hidden in Setup. A Nassau auto-press engine is still in the code, reachable only from an old saved round | `SetupWizard.jsx` "Auto-press is hidden for now"; `src/engines/nassau.js` | `verified` updated |
| 5 | `nassau-presses` | **Not built** | `getPressEligibility` looks only for the Overall Match | `verified` updated |
| 6 | `handicap-allowances` | **Not built** (scramble team percentages aside) | searched "allowance", "low man", "relative" | `verified` updated |
| 7 | `mixed-tees` | **Not built**: one `round.tee` | searched per-player tee fields | `verified` updated |
| 8 | `quota` | **Not built** | `src/engines/betResults.js` game types | `verified` updated |
| 9 | `saved-groups` | **Confirmed** (members are crew members with accounts; guests aren't saved) | `supabase/migrations/0060_crew_groups.sql`, `src/lib/db/crew.js` | `verified` updated |
| 10 | `settle-up` | **Confirmed**, including "not always the fewest" (traced +4, +3, −2, −2, −3 → 4 payments). GoLo tracks sent/received status only; no money moves | `src/engines/payouts.js`, `src/lib/venmo.js`, `src/lib/db/payments.js` | `verified` updated |
| 11 | `scramble` | **Confirmed** | `src/lib/scrambleTeams.js`, `src/engines/handicap.js` team percentages, `SCRAMBLE_UNPLAYED` | `verified` updated |
| 12 | `distance-logging` | **Confirmed not offered**: Closest to Pin and Longest Drive store a player id only. Longest Drive is a live game | `src/store/roundStore.js` `flagCTP` / `flagLD`; `src/engines/longestDrive.js` | `verified` updated |
| 13 | `ios-app` | **iOS build exists (1.2.1); App Store status can't be read from code.** Unchanged: `siteConfig.iosLive` stays false, so no App Store link ships | `ios/App/App.xcodeproj` | None |
| — | `junk-board` | **Contradicted.** The Skins game has **Greenie** (par-3 closest plus par or better; an unclaimed greenie carries to the next par 3) and **Sandie** options, scored and settled. Barkie, poley, snake, arnie: not found. The Play listing says "Junk: Greenies and Sandies" | `SetupWizard.jsx` Skins types; `src/engines/skins.js` | Corrected in the #200 PR: new live `skins-greenie-sandie` entry; `junk-board` narrowed to barkies, poleys, snakes and arnies; `game-library` limits rewritten. The glossary's Junk, Greenie and Sandy stay education with no GoLo note |
| — | `skins-validation` | **Confirmed** for standard and carryover skins (lowest unique score wins, no birdie or par test). The Greenie and Sandie options do require par | `src/engines/skins.js` | `verified` updated |
| — | `closest-to-pin` | **Partly.** Winner marked by the scorer, netted into settle-up, no distance, no par check: confirmed. Holes are all the par 3s or the back nine's, not any hole. **A hole nobody wins pays nothing and doesn't carry** (#195's carry claim is contradicted; the carry is the Skins Greenie's) | `src/engines/ctp.js` "Holes with no winner flagged are skipped"; `src/lib/roundBets.js` `ctpHolesOn` | Summary and limits corrected; `verified` updated; CTP GoLo note narrowed |
| — | `live-skins` | **Confirmed** | `src/engines/betStatus.js` carried pill; `src/engines/skins.js` | `verified` updated |
| — | `game-library` (Wolf) | Games confirmed. **No tee order in the code:** the wolf rotates by player order (`players[(hole − 1) % 4]`). The owner's "last" stays the site's guide wording, but no GoLo note can claim it, so Wolf has none | `src/engines/wolf.js` `getWolfOrder` | Corrected in the #200 PR: label adds Overall Match and Longest Drive; limits cover Greenie/Sandie, Longest Drive's one par 5 and Wolf's rotation; `verified` app-check 1.2.1 |
