# Glossary capability check (#154): owner checklist

What the owner confirms against the current GoLo release before any glossary GoLo note or CTA leans on it. This repo doesn't read the app repo, so nothing below has been re-verified; each row shows what `lib/content/capabilities.ts` says today (`main` at ba08106) and when it was last checked.

Fill in the last three columns, or reply on #154 with the row numbers. An agent then updates the registry in a small PR (`verified: { by: "owner", date, appVersion }`, plus `limits` where useful) and runs `npm run lint:content`.

**Status:** prepared October 29, 2026. Nothing confirmed yet.

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
| Q-a | **Junk board scope.** Which of these does the junk board score today: greenie, sandy, barkie, poley, snake, arnie, birdie bounty, eagle bounty? (`game-library` only records that birdie and eagle bounties are a Skins setting, gross birdies only.) | Junk, Greenie, Sandy notes (#159) and the M8 junk terms. Recommended: one `limits` line on `game-library`, not new capability entries | |
| Q-b | **Re-press.** On Overall Match, can a side press a press, given "up to two live at once"? Or is a second press only a second press on the original match? | The Re-press GoLo note (#159). Without an answer, Re-press ships with no GoLo note | |
| Q-c | **Changes due before launch.** Is any capability above expected to change before the glossary launches (for example automatic presses, allowances or mixed tees going live)? | #166 rechecks these at publication | |
| Q-d | **Skins validation.** The skins guide CTA says GoLo "tracks every carry, every validation" (`lib/content/gameDetail.ts` line 419). Does the app support validation rules (birdie-to-win or par minimum on carried skins)? No capability records it. | Possible existing overclaim found in the #152 audit. Not glossary scope, but the Carryover entry links to that guide | |
| Q-e | **Wolf tee order.** Does GoLo's Wolf have the wolf tee off first or last? The guide says last, the post says first (`docs/glossary/inventory.md` § Existing site definitions, conflict 1). | The Wolf entry says the order varies either way; the guide and post should agree | |

## What happens with the answers

- Rows 1–13: a registry PR updates `verified` (and `limits` where the answer adds one). The PR doesn't change any glossary copy.
- Q-a, Q-b: the side-games batch (#159) writes its GoLo notes from the updated registry, by `capabilityIds`, never as literal status text.
- Q-c: copied into #166's release recheck list.
- Q-d, Q-e: each needs its own issue against the existing pages. They're listed here only because the glossary audit found them.
