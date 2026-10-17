# Testing study: claims to verify (SEO-16)

**Resolved October 16, 2026.** The owner's rule: no reliable private testing records exist to populate a log, so a claim that can't be verified from the repositories or existing records is removed or rewritten, never reconstructed. Every row below is now supported, changed or removed. `docs/research/testing-summary.md` lists the verified facts that remain. The log template and `scripts/testing-summary.mjs` stay for any future testing that is recorded at the time.

The unpublished `forty-rounds` post in `lib/content/blog.ts` makes claims that nothing in this repo supports. This file lists every one and what would settle it, so the owner's part of soleman23/golowebsite#74 is filling in a log and answering a short list. SEO-17 (#75) may publish only what ends up **supported** here, with the number taken from `docs/research/testing-summary.md`.

**The repo is public.** The raw log, names, phone numbers, messages and group identities stay outside it. Only the aggregated summary and this matrix are committed.

## Owner steps (archived)

**Not used for this study**: no reliable records exist. Keep these steps for a future test run that is recorded at the time, and write its output to a new, dated file (for example `docs/research/testing-log-summary-2027.md`). **Never** overwrite `docs/research/testing-summary.md`, which holds the verified record for this study.


1. **Build the log.** Make a CSV outside the repo, e.g. `~/private/golo-testing-log.csv`, with one row per test round. Use whatever records exist: the app's round history, notes, messages. Columns:

   | Column | Value |
   |---|---|
   | `date` | YYYY-MM-DD (required) |
   | `group` | a private label: `G` and a number (`G1`, `G12`), never a name. `g 1` and `G01` read as `G1`. Use the same label for the same group every time; blank if unknown |
   | `group_size` | players in the round, 1–8; blank if unknown |
   | `own_team` | `y` if anyone from GoLo played in the group, `n` if not, blank if unknown |
   | `formats` | games played, separated by `;`, from this list only: `nassau`, `skins`, `wolf`, `bingo-bango-bongo`, `best-score`, `closest-to-pin`, `longest-drive`, `birdies`, `junk`, `overall-match`, `best-ball`, `scramble`, `match-play`, `stroke-play`, `quota`. A game not on the list is `other-1`, `other-2`… (the same number for the same game every time, so different games stay distinct); blank if unknown |
   | `app_version` | the build used, like `0.6` or `0.6.2` (one or two digits per part); blank if unknown |
   | `finished` | `y` or `n`: did the round reach a complete card **in GoLo**. A round finished on paper or in another app is `n`, with `stopped_hole` where GoLo entry stopped. Blank if the records can't tell; never guess `n`. |
   | `holes` | `9` or `18`: the round's length; blank if unknown |
   | `stopped_hole` | **how many holes had a score entered in GoLo**, counted from the group's first hole, so a 10th-tee start that quits after three holes is `3`. `0` if none (stopped during setup). Required if `finished` is `n`, blank otherwise |
   | `settled` | `app`, `memory` or `none`; blank if unknown |
   | `wager_changed` | `y` or `n`: did the group change the bet mid-round; blank if unknown |
   | `stakes` | `y` or `n`: was the group playing for money; blank if unknown |
   | `on_course` | `y` if it was a round played on a course, `n` for a demo or desk test; blank if unknown. Rows marked `n` are left out of every count. |
   | `course`, `notes` | optional; read for nothing and never printed |

   A round you can't reconstruct goes in with what's known. Leave any field blank rather than guess, except `date` and (for a round marked unfinished) `stopped_hole`. Log each round once; if records overlap, merge them into one row. The summary counts every unknown separately. Don't fill gaps from memory of the draft.

   The summary is public, so the script lets nothing free-form through: formats must come from the list above, and versions must look like `0.4.1`. A name typed into the wrong column stops the run instead of reaching the summary.

2. **Run** `node scripts/testing-summary.mjs ~/private/golo-testing-log.csv`. It checks every row and prints the summary with counts only. It refuses a path inside the repo.
3. **Save** the output as `docs/research/testing-summary.md`, then add a "Product decisions" section by hand. One line per decision: date, what was cut or added, and why. Example: "2026-05: GPS yardages cut. Watches and lasers already cover it."
4. **Answer** the questions in the "Needs the owner" column below. A short reply on #74 is enough; an agent can then fill in the Status column.

## Numbers

Status is one of: supported (with its source), changed (with the new value), or removed.

**Exact or "at least".** A count from the summary is exact only when the matching "not known" row is 0. Otherwise it's a minimum: publish it as "at least N", or resolve the blanks first. The rows below say which "not known" row applies.

| # | Draft claim | Where in the draft | Settled by | Status |
|---|---|---|---|---|
| N0 | "before writing any marketing" (tested first, marketed after) | title, intro | Dated records of when marketing copy was first **written**, not published: the git history of the earliest copy (`lib/content/blog.ts`, the home page), and any drafts kept elsewhere. Publication dates set the upper limit: the oldest published post is dated 2026-06-18, the draft of this very post is dated 2026-04-23, and the repo's first commit is 2026-07-14 (`22fcfbe`). The claim holds only if the last logged round is before the earliest written marketing. | Removed: no record (owner, 2026-10-16) |
| N1 | 40 rounds | title, intro, "THE TEST", table, summary | Summary: Rounds logged (demo and desk-test rows are already left out). Exact only if "On a course not known" is 0 (a blank could be a demo) **and** "Rows sharing a date and group with another row" is 0, or the owner confirms those were separate rounds. | Removed: no record (owner, 2026-10-16) |
| N2 | "over one season" | "THE TEST" | Summary: "First round" and "Last round". The owner states the season's boundaries (for example, one year's Bend golf season, April–October), and the claim holds only if both dates fall inside one. Otherwise publish the actual date range instead of "season". | Removed: no record (owner, 2026-10-16) |
| N3 | 11 groups | "THE TEST", table, paragraph | Summary: Distinct groups, exact only if "Rounds with no group label" is 0 | Removed: no record (owner, 2026-10-16) |
| N4 | "none of them ours" | "THE TEST" | Summary: Rounds with someone from GoLo playing = 0 **and** "Rounds where that isn't known" = 0. A "y" on a row with no group label still counts. | Removed: no record (owner, 2026-10-16) |
| N5 | 6 formats | "THE TEST", table | Summary: Distinct formats. It's exact only if it isn't "at least" (a bare `other` was used; renumber those rounds as `other-1`…) **and** "Rounds with formats not known" is 0. If "Distinct formats GoLo runs today" is lower, the post must not imply GoLo runs the others. | Removed: no record (owner, 2026-10-16) |
| N6 | 31 finished with a complete card, and "Score entry survives a round" | table, summary | Summary: "Finished with a complete card in GoLo". `finished` means a complete card in GoLo, so the conclusion holds only for those rounds. If the records can't tell a GoLo card from a paper one, leave `finished` blank. N6 and N7–N9 are then exact only if "Completion not known" is 0. | Removed: no record (owner, 2026-10-16) |
| N7 | 6 abandoned before the turn | table | Summary: "18-hole rounds stopped before the turn (0–8 holes scored)". Exact only if "Completion not known" and "Unfinished rounds of unknown length" are both 0. Nine-hole rounds have no turn; report them separately. | Removed: no record (owner, 2026-10-16) |
| N8 | 5 of the 6 quit on holes 3–5 | table, key stat, summary | Read "holes 3–5" as the 3rd to 5th hole played. Numerator: "18-hole rounds quit on the 3rd–5th hole played (2–4 holes scored)", so it counts the same rounds as N7's denominator. Denominator: N7's resolved value. "5 of 6" holds only if both match, with "Unfinished rounds of unknown length" at 0. | Removed: no record (owner, 2026-10-16) |
| N9 | "The nine that fell apart" (40 − 31) | paragraph | Summary: "Unfinished in GoLo", exact only if "Completion not known" is 0. N1 − N6 isn't the same number once completion can be unknown. | Removed: no record (owner, 2026-10-16) |
| N10 | 27 settled in the app | table | Summary: "How rounds were settled", the All rounds row, In the app column. Exact only if that row's Settlement not known is 0. | Removed: no record (owner, 2026-10-16) |
| N11 | 4 settled from memory | table | Summary: "How rounds were settled", the All rounds row, From memory column. Exact only if that row's Settlement not known is 0; otherwise "at least N". 27 + 4 = 31 assumes every finished round settled and no unfinished one did; the split rows show whether that's true. | Removed: no record (owner, 2026-10-16) |
| N12 | 9 groups changed the wager mid-round | table, "What broke" | Summary: "Changed the wager mid-round", exact only if "Rounds where a wager change isn't known" is 0. The draft says "nine of forty **groups**", but there were 11 groups: it means rounds | Removed: no record (and the draft's "groups" was wrong anyway) |
| N13 | 3 features cut, "because nobody used them" | excerpt, dek, "THE TEST", heading, summary | Product decisions for the count. The app's history (from 2026-06-18) holds none of the three (GPS, scanning, chat). That can't show whether they existed before that date, or that they were deliberately rejected. GPS has the owner's "cut" (P1); scanning and chat have no decision record. So the count of three stays only if the owner's records support all three, and a reworded "decided not to build" needs the same records. The excerpt and dek's "because nobody used them" contradicts B4 and needs B5–B6's records. | Removed: no record that any of the three was built and cut; the app's history has none of them |
| N14 | "rebuilt scoring twice" | "What broke" | Product decisions | Removed: no record |
| N15 | "first fifteen rounds asking, last twenty-five watching" | callout | Owner: was there a switch, and at which round (k)? The second number is then N1 − k, not a fixed 25. | Removed: no record (owner, 2026-10-16) |
| N16 | "Two players opened" post-round stats | "What they ignored" | Owner: is there usage data, or is this recollection? | Removed: no record (owner, 2026-10-16) |
| N17 | "Forty rounds of watching… worth more than four hundred hours of designing" | first image caption | Rhetorical, not a measured figure | Removed: no record (owner, 2026-10-16) |
| N18 | The settle-up moment "lasts about ninety seconds" | second image caption | Owner: is it timed anywhere? The live settle-up post uses "ninety seconds" as a figure of speech too. | Removed: no record (owner, 2026-10-16) |
| N19 | A group text thread "with eight years of history" | in-app chat card | Rhetorical | Removed: no record (owner, 2026-10-16) |
| N20 | "real Saturday rounds, real money" | intro | "Real money" only if Played for money equals Rounds logged; otherwise give the count ("N of M rounds were played for money") or drop it. "Real rounds" (here and in the intro's "not demos, not internal testing") only if On a course equals Rounds logged. Saturday is the summary's "Rounds on a Saturday" against Rounds logged; keep "Saturday" only if every round was one. "Mostly" needs more than half of Rounds logged, with the number given; otherwise give the number alone or drop the word. | Removed: no record (owner, 2026-10-16) |
| N21 | "with the numbers from all forty rounds" | dek | N1, plus every "not known" row being 0. Otherwise drop "all". | Removed: no record (owner, 2026-10-16) |
| N22 | "we tracked one thing above everything else: how many rounds made it all the way to a settled number" | "The only question that mattered" | Owner: were completion, dropouts **and settlement** recorded at the time, or reconstructed for this log? If any of them was reconstructed, the post says so in its methodology section (#75) and drops "tracked". | Removed: no record (owner, 2026-10-16) |

**Default:** any number in the draft that isn't in this table is removed, not carried over.

## App evidence (October 16, 2026)

Product claims were checked read-only against the app repository, soleman23/golo `main` at `acd6eee` (GoLo 1.0.0, the production branch), including its full commit, issue and PR history. That history starts on 2026-06-18 (`6ec1a43`). So the repo can say what the app does now and what changed after that date. It **can't** show anything built or cut before it, or outside it. Rows that depend on that still need the owner.

## Product claims

These must also match `lib/content/capabilities.ts` (the registry) and `/features`, the AC of #75.

| # | Draft claim | Registry today | Needs the owner | Status |
|---|---|---|---|---|
| P1 | GPS yardages were cut | `gps-yardages`: not-offered, "Cut" (owner, 2026-10-15); `/features` says "No GPS yardages". App: no GPS yardage code anywhere in golo's history (starts 2026-06-18); the only GPS code is "Find courses near me" (b0e03ae, 2026-07-13). | When was it cut, and why? Was it ever tested with golfers? | Supported, present tense only: GoLo has no GPS yardages (registry `gps-yardages`, not offered; `/features` says so). "Cut during testing", its date and its reason: removed, no record |
| P2 | Scorecard photo scanning was built, then cut | Not in the registry. App: no scanning or OCR code in golo's history. The camera is used only for profile and support-report photos (`ios/App/App/Info.plist:72`). | Was it built and tested with groups, and when and why was it cut? | Removed: no record of it being built or cut; absent from the app's history |
| P3 | In-app group chat was built, then cut | Not in the registry. App: absent from golo's history (from 2026-06-18). Settle-up copies a summary "to paste in the group chat" (`src/pages/PayoutsPage.jsx:1299`), and the store declarations say there is no chat (`docs/STORE-DECLARATIONS.md:313`). | Was it built and tested with groups, and when and why was it cut? | Removed: no record of it being built or cut; absent from the app's history |
| P4 | Post-round stats were ignored | `season-stats` is **live**. App: no fairways, putts or strokes gained anywhere, and score entry is strokes only. Settle-up shows low gross and birdies; the Locker shows a score mix (`src/pages/YouPage.jsx:470-486`, since 2026-06-18). | Was a shot-stats screen built and tested before 2026-06-18? | Removed: no record of a shot-stats screen; the app has none |
| P5 | Streaks and badges were built | Not in the registry. App: **live**. A Trophy Case of six badges on the You page, including "Hot hand" (3+ money-positive rounds in a row) (`src/pages/YouPage.jsx:488-516`), present since 2026-06-18 and never removed. | Was a "four weeks in a row" streak ever built, as the draft says? | Changed: the app has a live "Hot hand" streak badge (three money-positive rounds in a row). The "four weeks" streak and "ignored": removed, no record |
| P6 | A feed of other groups' rounds | Not in the registry. App: absent from golo's history (from 2026-06-18); there's no feed route (`src/App.jsx:118-143`). The "viewer activity feed" only labels changes inside a live round you follow. | Was it built, before 2026-06-18 or elsewhere? | Removed: no record of it being built; absent from the app's history |
| P7 | Setup is now one screen with sane defaults | Not in the registry. App: setup is **five steps** (Course, Players, Format, Games, Review) with defaults; every game starts at a $1 stake, and Skins starts Standard plus Carryover (`SetupWizard.jsx:134`, `:488-494`, `:711-712`). Unchanged since 2026-06-18. | — | Changed: "setup is five steps, with defaults" (a $1 stake per game; Skins with carryover). Any claim that testing led to this: removed |
| P8 | Score entry accepts scores out of order | Not in the registry. App: Prev/Next moves hole by hole, and moving on fills par for anyone left blank. In the card view any hole already passed can be tapped and edited (`ScoringPage.jsx:152-160`, `:1244-1252`, `:1912-1926`; card-cell entry since 32ea972, 2026-07-20). | Did testing lead to it? (Card-view entry arrived 2026-07-20, in 32ea972.) | Changed: present capability only. A passed hole can be edited from the card view (since 2026-07-20), and moving on fills par for blanks (since 2026-06-29). The testing causation: removed |
| P9 | The live bet state shows on the scoring screen | Not in the registry. App: the scoring screen shows Match Play status and side-game flags. Bet pills (e.g. "$4 carried over") and the Press button moved to the leaderboard sheet, one tap away (636957f, golo PR #14, 2026-07-23). | — | Changed, split: Match Play status and side-game flags stay on the scoring screen; the detailed bet pills and the Press control are on the leaderboard, one tap away (since 2026-07-23) |
| P10 | One-tap logging for a press or a carry, stamped to the hole | Presses: `overall-match-presses`, Overall Match only. App: a press is a short sheet (target, multiplier, confirm) that starts at the next hole (`PressSheet.jsx:47`, `:76`), not one tap. Carries: automatic on tied holes when Carryover is on (`skins.js:222`, `:264`); there's no manual carry log. Greenie and Sandie are flagged per hole by hand. | — | Changed: presses are called from a short sheet, from the next hole, on Overall Match only. Carry logging: removed (carries are automatic) |
| P11 | The settle screen gives the fewest payments | `settle-up`: live, but greedy (golo `main` acd6eee, `src/engines/payouts.js` `calculateSettlementCents`): for n players never more than n − 1 payments, not always the minimum (#103) | — | Changed: "a short list of payments"; for n players never more than n − 1 (#103) |
| P12 | "Nobody has asked for any of them since" | — | Is there a record (support messages, feedback)? | Removed: no record |
| P13 | "Three things got used in every single round" | — | Is there a record, or is it an impression? | Removed: no record |
| P14 | "We had no way to let them" (change the bet mid-round) and "We treated the bet as a setting chosen once" | "What broke" | Was there really no way to change a stake during the test rounds? Is there a record? | Changed: the past claim ("we had no way to let them") is removed, no record. Present tense must say all three: the organizer can change a game's amount in Setup with everyone re-agreeing; it reprices the whole game; it's refused once that game has presses in play |

## Usage and behaviour claims

The draft also says what testers did and why. A yes to "was it built?" in the table above doesn't back up any of these. Each one needs a record (session data, notes made at the time, messages) or it's removed. Recollection alone doesn't count for a published study.

| # | Draft claim | Where | Needs | Default |
|---|---|---|---|---|
| B1 | Groups answered half the setup on the first tee and the rest on the 4th | "Setup was a conversation" | Notes or session data | Removed: no record |
| B2 | Groups score on the next tee or in the bar, backfilling in bursts | "Nobody scores on the green" | Score timestamps, or notes | Removed: no record |
| B3 | Groups quietly stopped entering scores on the 4th tee and blamed themselves | callout | Notes, ties to N8 | Removed: no record |
| B4 | GPS: everyone already had a watch or laser; it doubled scope, ate battery, improved nobody's round | "The three features we cut" | Decision notes (scope and battery are internal facts); the rest is a judgment | Removed: no record of the reason. Present-tense positioning stays as `/features` has it ("your watch or laser already does that") |
| B5 | Scanning: groups spent longer correcting a misread 5 than typing four numbers, and never opened it again | same | Usage data or notes | Removed: no record |
| B6 | Chat: groups already had a text thread, so a second one wasn't wanted | same | Decision notes | Removed: no record |
| B7 | Nobody mentioned the streak, even when it broke | "What they ignored" | Feedback records. The streak is real and live (P5), so this is about tester behaviour only | Removed: no record |
| B8 | Groups sent each other the settle screenshot instead of using the feed | same | Notes or messages | Removed: no record |
| B9 | The live bet state, press logging and settle screen were used in every round without prompting | "What we kept" | Usage data, ties to P13 | Removed: no record |
| B10 | Everyone else "already has a stats app they do not use either" | "What they ignored" | A survey or notes. N16's usage data doesn't cover it. | Removed: no record |
| B11 | Early dropouts were "not from boredom, but because setup had spilled into the round" | key stat | Notes or messages at the time that give the cause | Removed: no record |
| B12 | Testers were "real groups who did not care about our roadmap" | intro | Notes or messages that show it | Removed: no record |

## Words and framing

Each row is resolved one of two ways: here, before #74 closes, or as a named task that #75 must finish before publishing.

| # | Draft text | Issue | Resolved when | Status |
|---|---|---|---|---|
| W1 | "real Saturday rounds, real money" | Whether money was at stake is N20. However that lands, the post must not suggest GoLo touched the money. | N20 is settled, and #75 adds the registry's limit: GoLo never holds, moves or processes money | Removed: "real Saturday rounds, real money" goes with N20. Assigned to #75: the post must say GoLo never holds, moves or processes money |
| W2 | Quote: "Nobody wants a golf app. They want the argument to be over." | Who said it? A quote needs a real, consenting source. | The owner names a source who agrees to be quoted, or it's marked for rewriting as plain prose in our own voice | Removed: no verified speaker |
| W3 | Date 2026-04-23 | Draft date only. | Assigned to #75: publish with the real publication date | Assigned to #75: publish with the real publication date |
| W4 | Hero alt "Golfers testing a scoring app during a real round" and mid-article alts | The images are stock course photos, and the alts describe scenes that aren't in them. | Assigned to #75: replace the images or rewrite the alts | Assigned to #75: a hero whose alt describes what's in the photo, and no mid-article figures that misdescribe themselves |
| W5 | Title "We tested GoLo on 40 rounds before writing any marketing" | The count is N1; "before writing any marketing" is N0. | The title is decided from N0 and N1: keep it only if both hold; otherwise "What N real rounds taught us…", or drop the numbers and run it as qualitative build notes | Removed: the 40-rounds title and framing are abandoned (N1 has no record) |

## Done when

- Every N row is supported, changed or removed, with its source.
- Every P row agrees with the registry, or the registry is updated first with `verified` set.
- Every B row is backed by a record or removed.
- Every W row is resolved, or assigned to #75 with its task named.
- `docs/research/testing-summary.md` exists and has no personal data.

As of October 16, 2026, every N, P and B row is resolved, W2 and W5 are removed, and W1, W3 and W4 are assigned to #75 with their tasks named. #75 rewrites the post from the supported and changed rows only.
