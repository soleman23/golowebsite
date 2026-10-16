# Testing study: claims to verify (SEO-16)

The unpublished `forty-rounds` post in `lib/content/blog.ts` makes claims that nothing in this repo supports. This file lists every one and what would settle it, so the owner's part of soleman23/golowebsite#74 is filling in a log and answering a short list. SEO-17 (#75) may publish only what ends up **supported** here, with the number taken from `docs/research/testing-summary.md`.

**The repo is public.** The raw log, names, phone numbers, messages and group identities stay outside it. Only the aggregated summary and this matrix are committed.

## Owner steps

1. **Build the log.** Make a CSV outside the repo, e.g. `~/private/golo-testing-log.csv`, with one row per test round. Use whatever records exist: the app's round history, notes, messages. Columns:

   | Column | Value |
   |---|---|
   | `date` | YYYY-MM-DD (required) |
   | `group` | a private label (`G1`, `G2`…), never a name; blank if unknown |
   | `group_size` | players in the round; blank if unknown |
   | `own_team` | `y` if anyone from GoLo played in the group, `n` if not, blank if unknown |
   | `formats` | games played, separated by `;`, from this list only: `nassau`, `skins`, `wolf`, `bingo-bango-bongo`, `best-score`, `closest-to-pin`, `longest-drive`, `birdies`, `junk`, `overall-match`, `best-ball`, `scramble`, `match-play`, `stroke-play`, `quota`. A game not on the list is `other-1`, `other-2`… (the same number for the same game every time, so different games stay distinct); blank if unknown |
   | `app_version` | the build used, like `0.6` or `0.6.2` (one or two digits per part); blank if unknown |
   | `finished` | `y` or `n`: did the round reach a complete card **in GoLo** (required). A round finished on paper or in another app is `n`, with `stopped_hole` where GoLo entry stopped. |
   | `stopped_hole` | hole where scoring stopped; required if unfinished, blank if finished |
   | `settled` | `app`, `memory` or `none` (required) |
   | `wager_changed` | `y` or `n`: did the group change the bet mid-round; blank if unknown |
   | `stakes` | `y` or `n`: was the group playing for money; blank if unknown |
   | `course`, `notes` | optional; read for nothing and never printed |

   A round you can't reconstruct goes in with what's known. Leave any field blank rather than guess, except `date`, `finished`, `settled` and (for an unfinished round) `stopped_hole`. The summary counts every unknown separately. Don't fill gaps from memory of the draft.

   The summary is public, so the script lets nothing free-form through: formats must come from the list above, and versions must look like `0.4.1`. A name typed into the wrong column stops the run instead of reaching the summary.

2. **Run** `node scripts/testing-summary.mjs ~/private/golo-testing-log.csv`. It checks every row and prints the summary with counts only. It refuses a path inside the repo.
3. **Save** the output as `docs/research/testing-summary.md`, then add a "Product decisions" section by hand. One line per decision: date, what was cut or added, and why. Example: "2026-05: GPS yardages cut. Watches and lasers already cover it."
4. **Answer** the questions in the "Needs the owner" column below. A short reply on #74 is enough; an agent can then fill in the Status column.

## Numbers

Status is one of: supported (with its source), changed (with the new value), or removed.

**Exact or "at least".** A count from the summary is exact only when the matching "not known" row is 0. Otherwise it's a minimum: publish it as "at least N", or resolve the blanks first. The rows below say which "not known" row applies.

| # | Draft claim | Where in the draft | Settled by | Status |
|---|---|---|---|---|
| N0 | "before writing any marketing" (tested first, marketed after) | title, intro | Dated records: the last test round against the first marketing copy. This repo's first commit, the marketing site with copy, is 2026-07-14 (`22fcfbe`). The claim holds only if every logged round is earlier, and no earlier marketing exists elsewhere. | Unverified |
| N1 | 40 rounds | title, intro, "THE TEST", table, summary | Summary: Rounds logged | Unverified |
| N2 | "over one season" | "THE TEST" | Summary: First and last round | Unverified |
| N3 | 11 groups | "THE TEST", table, paragraph | Summary: Distinct groups, exact only if "Rounds with no group label" is 0 | Unverified |
| N4 | "none of them ours" | "THE TEST" | Summary: Rounds with someone from GoLo playing = 0 **and** "Rounds where that isn't known" = 0. A "y" on a row with no group label still counts. | Unverified |
| N5 | 6 formats | "THE TEST", table | Summary: Distinct formats. It's exact only if it isn't "at least" (a bare `other` was used; renumber those rounds as `other-1`…) **and** "Rounds with formats not known" is 0. | Unverified |
| N6 | 31 finished with a complete card, and "Score entry survives a round" | table, summary | Summary: Finished. `finished` means a complete card in GoLo, so the conclusion holds only for those rounds. If the owner's records can't tell a GoLo card from a paper one, mark them `n`, or drop the conclusion. | Unverified |
| N7 | 6 abandoned before the turn | table | Summary: Stopped before the turn | Unverified |
| N8 | 5 of the 6 quit on holes 3–5 | table, key stat, summary | Summary: Stopped on holes 3–5 for the numerator, and N7's resolved value for the denominator. Both change together: "5 of 6" holds only if N7 stays 6. | Unverified |
| N9 | "The nine that fell apart" (40 − 31) | paragraph | N1 − N6. The draft's 6 before the turn leaves 3 unaccounted for: check them against "Stopped on the back nine" | Unverified |
| N10 | 27 settled in the app | table | Summary: Settled in the app | Unverified |
| N11 | 4 settled from memory | table | Summary: "How rounds were settled", split by finished and unfinished. 27 + 4 = 31 assumes every finished round settled and no unfinished one did; the split shows whether that's true. | Unverified |
| N12 | 9 groups changed the wager mid-round | table, "What broke" | Summary: Changed the wager, exact only if "Rounds where a wager change isn't known" is 0. The draft says "nine of forty **groups**", but there were 11 groups: it means rounds | Unverified, and the wording is wrong either way |
| N13 | 3 features cut | dek, "THE TEST", heading, summary | Product decisions | Unverified |
| N14 | "rebuilt scoring twice" | "What broke" | Product decisions | Unverified |
| N15 | "first fifteen rounds asking, last twenty-five watching" | callout | Owner: was there a switch, and at which round (k)? The second number is then N1 − k, not a fixed 25. | Unverified |
| N16 | "Two players opened" post-round stats | "What they ignored" | Owner: is there usage data, or is this recollection? | Unverified |
| N17 | "Forty rounds of watching… worth more than four hundred hours of designing" | first image caption | Rhetorical, not a measured figure | Remove, or keep only if N1 holds and "four hundred hours" is cut |
| N18 | The settle-up moment "lasts about ninety seconds" | second image caption | Owner: is it timed anywhere? The live settle-up post uses "ninety seconds" as a figure of speech too. | Unverified; remove unless measured |
| N19 | A group text thread "with eight years of history" | in-app chat card | Rhetorical | Remove |
| N20 | "real Saturday rounds, real money" | intro | Summary: Played for money (and Stakes not known). Saturday is the summary's "Rounds on a Saturday" against Rounds logged; keep "Saturday" only if every round was one. "Mostly" needs more than half of Rounds logged, with the number given; otherwise give the number alone or drop the word. | Unverified |

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
