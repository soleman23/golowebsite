# Testing study: claims to verify (SEO-16)

The unpublished `forty-rounds` post in `lib/content/blog.ts` makes claims that nothing in this repo supports. This file lists every one and what would settle it, so the owner's part of soleman23/golowebsite#74 is filling in a log and answering a short list. SEO-17 (#75) may publish only what ends up **supported** here, with the number taken from `docs/research/testing-summary.md`.

**The repo is public.** The raw log, names, phone numbers, messages and group identities stay outside it. Only the aggregated summary and this matrix are committed.

## Owner steps

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
| N0 | "before writing any marketing" (tested first, marketed after) | title, intro | Dated records of when marketing copy was first **written**, not published: the git history of the earliest copy (`lib/content/blog.ts`, the home page), and any drafts kept elsewhere. Publication dates set the upper limit: the oldest published post is dated 2026-06-18, the draft of this very post is dated 2026-04-23, and the repo's first commit is 2026-07-14 (`22fcfbe`). The claim holds only if the last logged round is before the earliest written marketing. | Unverified |
| N1 | 40 rounds | title, intro, "THE TEST", table, summary | Summary: Rounds logged (demo and desk-test rows are already left out). Exact only if "On a course not known" is 0 (a blank could be a demo) **and** "Rows sharing a date and group with another row" is 0, or the owner confirms those were separate rounds. | Unverified |
| N2 | "over one season" | "THE TEST" | Summary: First and last round. The owner states the season's boundaries (for example, one year's Bend golf season, April–October), and the claim holds only if both dates fall inside one. Otherwise publish the actual date range instead of "season". | Unverified |
| N3 | 11 groups | "THE TEST", table, paragraph | Summary: Distinct groups, exact only if "Rounds with no group label" is 0 | Unverified |
| N4 | "none of them ours" | "THE TEST" | Summary: Rounds with someone from GoLo playing = 0 **and** "Rounds where that isn't known" = 0. A "y" on a row with no group label still counts. | Unverified |
| N5 | 6 formats | "THE TEST", table | Summary: Distinct formats. It's exact only if it isn't "at least" (a bare `other` was used; renumber those rounds as `other-1`…) **and** "Rounds with formats not known" is 0. If "Distinct formats GoLo runs today" is lower, the post must not imply GoLo runs the others. | Unverified |
| N6 | 31 finished with a complete card, and "Score entry survives a round" | table, summary | Summary: Finished. `finished` means a complete card in GoLo, so the conclusion holds only for those rounds. If the records can't tell a GoLo card from a paper one, leave `finished` blank. N6 and N7–N9 are then exact only if "Completion not known" is 0. | Unverified |
| N7 | 6 abandoned before the turn | table | Summary: "18-hole rounds stopped before the turn (0–8 holes scored)". Exact only if "Completion not known" and "Unfinished rounds of unknown length" are both 0. Nine-hole rounds have no turn; report them separately. | Unverified |
| N8 | 5 of the 6 quit on holes 3–5 | table, key stat, summary | Read "holes 3–5" as the 3rd to 5th hole played. Numerator: "Quit on the 3rd–5th hole played (2–4 holes scored)". Denominator: N7's resolved value. "5 of 6" holds only if both match. | Unverified |
| N9 | "The nine that fell apart" (40 − 31) | paragraph | Summary: "Unfinished in GoLo", exact only if "Completion not known" is 0. N1 − N6 isn't the same number once completion can be unknown. | Unverified |
| N10 | 27 settled in the app | table | Summary: "How rounds were settled", the All rounds row, In the app column. Exact only if that row's Settlement not known is 0. | Unverified |
| N11 | 4 settled from memory | table | Summary: "How rounds were settled", the All rounds row, From memory column. Exact only if that row's Settlement not known is 0; otherwise "at least N". 27 + 4 = 31 assumes every finished round settled and no unfinished one did; the split rows show whether that's true. | Unverified |
| N12 | 9 groups changed the wager mid-round | table, "What broke" | Summary: Changed the wager, exact only if "Rounds where a wager change isn't known" is 0. The draft says "nine of forty **groups**", but there were 11 groups: it means rounds | Unverified, and the wording is wrong either way |
| N13 | 3 features cut, "because nobody used them" | excerpt, dek, "THE TEST", heading, summary | Product decisions for the count. The excerpt and dek's reason contradicts B4 (GPS was cut because watches and lasers already cover it) and needs B5–B6's records; otherwise the excerpt and dek drop the reason. | Unverified |
| N14 | "rebuilt scoring twice" | "What broke" | Product decisions | Unverified |
| N15 | "first fifteen rounds asking, last twenty-five watching" | callout | Owner: was there a switch, and at which round (k)? The second number is then N1 − k, not a fixed 25. | Unverified |
| N16 | "Two players opened" post-round stats | "What they ignored" | Owner: is there usage data, or is this recollection? | Unverified |
| N17 | "Forty rounds of watching… worth more than four hundred hours of designing" | first image caption | Rhetorical, not a measured figure | Remove, or keep only if N1 holds and "four hundred hours" is cut |
| N18 | The settle-up moment "lasts about ninety seconds" | second image caption | Owner: is it timed anywhere? The live settle-up post uses "ninety seconds" as a figure of speech too. | Unverified; remove unless measured |
| N19 | A group text thread "with eight years of history" | in-app chat card | Rhetorical | Remove |
| N20 | "real Saturday rounds, real money" | intro | "Real money" only if Played for money equals Rounds logged; otherwise give the count ("N of M rounds were played for money") or drop it. "Real rounds" (here and in the intro's "not demos, not internal testing") only if On a course equals Rounds logged. Saturday is the summary's "Rounds on a Saturday" against Rounds logged; keep "Saturday" only if every round was one. "Mostly" needs more than half of Rounds logged, with the number given; otherwise give the number alone or drop the word. | Unverified |
| N21 | "with the numbers from all forty rounds" | dek | N1, plus every "not known" row being 0. Otherwise drop "all". | Unverified |
| N22 | "we tracked one thing above everything else: how many rounds made it all the way to a settled number" | "The only question that mattered" | Owner: were completion, dropouts **and settlement** recorded at the time, or reconstructed for this log? If any of them was reconstructed, the post says so in its methodology section (#75) and drops "tracked". | Unverified |

**Default:** any number in the draft that isn't in this table is removed, not carried over.

## Product claims

These must also match `lib/content/capabilities.ts` (the registry) and `/features`, the AC of #75.

| # | Draft claim | Registry today | Needs the owner | Status |
|---|---|---|---|---|
| P1 | GPS yardages were cut | `gps-yardages`: not-offered, "Cut" (owner, 2026-10-15). `/features` no longer lists GPS as next. | When was it cut? | Settled by the registry; date needed for the decisions list |
| P2 | Scorecard photo scanning was built, then cut | Not in the registry | Was it built and tested with groups, or only prototyped? | Unverified |
| P3 | In-app group chat was built, then cut | Not in the registry | Was it built and tested with groups? | Unverified |
| P4 | Post-round stats were ignored | `season-stats` is **live**: season and all-time net, records, head-to-head | The draft means a shot-stats screen (fairways, putts, strokes gained). Was that a separate feature, and was it removed? If not, the section contradicts the Locker. | Conflict to resolve |
| P5 | Streaks and badges were built | Not in the registry | Built and still in the app, or removed? | Unverified |
| P6 | A feed of other groups' rounds | Not in the registry; `public-live-link` is not-offered | Built and removed? | Unverified |
| P7 | Setup is now one screen with sane defaults | Not in the registry | True of the current build? | Unverified |
| P8 | Score entry accepts scores out of order | Not in the registry | True of the current build? | Unverified |
| P9 | The live bet state shows on the scoring screen | Not in the registry | True of the current build? | Unverified |
| P10 | One-tap logging for a press or a carry, stamped to the hole | Presses: `overall-match-presses` is live, called, on Overall Match only, and Nassau doesn't take presses. Carries: not in the registry, and `/how-it-works` says skins "carry automatically on tied holes", which isn't a tap. | Presses: does the copy hold once it says Overall Match? Carries: is there a manual carry log in the app? | Presses must be reworded to match the registry. The carry half is removed unless the app or the owner confirms a manual carry log. |
| P11 | The settle screen gives the fewest payments | `settle-up`: live | — | Supported by the registry |
| P12 | "Nobody has asked for any of them since" | — | Is there a record (support messages, feedback)? | Unverified |
| P13 | "Three things got used in every single round" | — | Is there a record, or is it an impression? | Unverified |
| P14 | "We had no way to let them" (change the bet mid-round) and "We treated the bet as a setting chosen once" | "What broke" | Implies GoLo now lets a group change stakes mid-round. Not in the registry, apart from called presses on Overall Match. Owner: can a group change a game's stake mid-round in the current build? | Reword as past tense with no current-capability claim unless the registry gains the entry |

## Usage and behaviour claims

The draft also says what testers did and why. A yes to "was it built?" in the table above doesn't back up any of these. Each one needs a record (session data, notes made at the time, messages) or it's removed. Recollection alone doesn't count for a published study.

| # | Draft claim | Where | Needs | Default |
|---|---|---|---|---|
| B1 | Groups answered half the setup on the first tee and the rest on the 4th | "Setup was a conversation" | Notes or session data | Remove |
| B2 | Groups score on the next tee or in the bar, backfilling in bursts | "Nobody scores on the green" | Score timestamps, or notes | Remove |
| B3 | Groups quietly stopped entering scores on the 4th tee and blamed themselves | callout | Notes, ties to N8 | Remove |
| B4 | GPS: everyone already had a watch or laser; it doubled scope, ate battery, improved nobody's round | "The three features we cut" | Decision notes (scope and battery are internal facts); the rest is a judgment | Keep only the decision and its recorded reason |
| B5 | Scanning: groups spent longer correcting a misread 5 than typing four numbers, and never opened it again | same | Usage data or notes | Remove |
| B6 | Chat: groups already had a text thread, so a second one wasn't wanted | same | Decision notes | Keep only the recorded reason |
| B7 | Nobody mentioned the streak, even when it broke | "What they ignored" | Feedback records | Remove |
| B8 | Groups sent each other the settle screenshot instead of using the feed | same | Notes or messages | Remove |
| B9 | The live bet state, press logging and settle screen were used in every round without prompting | "What we kept" | Usage data, ties to P13 | Remove |
| B10 | Everyone else "already has a stats app they do not use either" | "What they ignored" | A survey or notes. N16's usage data doesn't cover it. | Remove |
| B11 | Early dropouts were "not from boredom, but because setup had spilled into the round" | key stat | Notes or messages at the time that give the cause | Remove the cause, and keep only the counts (N8) |
| B12 | Testers were "real groups who did not care about our roadmap" | intro | Notes or messages that show it | Remove; keep "real groups" only if N1 and N4 hold |

## Words and framing

Each row is resolved one of two ways: here, before #74 closes, or as a named task that #75 must finish before publishing.

| # | Draft text | Issue | Resolved when | Status |
|---|---|---|---|---|
| W1 | "real Saturday rounds, real money" | Whether money was at stake is N20. However that lands, the post must not suggest GoLo touched the money. | N20 is settled, and #75 adds the registry's limit: GoLo never holds, moves or processes money | Open |
| W2 | Quote: "Nobody wants a golf app. They want the argument to be over." | Who said it? A quote needs a real, consenting source. | The owner names a source who agrees to be quoted, or it's marked for rewriting as plain prose in our own voice | Open |
| W3 | Date 2026-04-23 | Draft date only. | Assigned to #75: publish with the real publication date | Assigned to #75 |
| W4 | Hero alt "Golfers testing a scoring app during a real round" and mid-article alts | The images are stock course photos, and the alts describe scenes that aren't in them. | Assigned to #75: replace the images or rewrite the alts | Assigned to #75 |
| W5 | Title "We tested GoLo on 40 rounds before writing any marketing" | The count is N1; "before writing any marketing" is N0. | The title is decided from N0 and N1: keep it only if both hold; otherwise "What N real rounds taught us…", or drop the numbers and run it as qualitative build notes | Open |

## Done when

- Every N row is supported, changed or removed, with its source.
- Every P row agrees with the registry, or the registry is updated first with `verified` set.
- Every B row is backed by a record or removed.
- Every W row is resolved, or assigned to #75 with its task named.
- `docs/research/testing-summary.md` exists and has no personal data.

That closes #74. #75 then rewrites the post from the supported rows only.
