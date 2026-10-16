# Testing study: claims to verify (SEO-16)

The unpublished `forty-rounds` post in `lib/content/blog.ts` makes claims that nothing in this repo supports. This file lists every one and what would settle it, so the owner's part of soleman23/golowebsite#74 is filling in a log and answering a short list. SEO-17 (#75) may publish only what ends up **supported** here, with the number taken from `docs/research/testing-summary.md`.

**The repo is public.** The raw log, names, phone numbers, messages and group identities stay outside it. Only the aggregated summary and this matrix are committed.

## Owner steps

1. **Build the log.** Make a CSV outside the repo, e.g. `~/private/golo-testing-log.csv`, with one row per test round. Use whatever records exist: the app's round history, notes, messages. Columns:

   | Column | Value |
   |---|---|
   | `date` | YYYY-MM-DD |
   | `group` | a private label (`G1`, `G2`…), never a name |
   | `group_size` | players in the round |
   | `own_team` | `y` if anyone from GoLo played in the group |
   | `formats` | games played, separated by `;` (`nassau;skins;junk`) |
   | `app_version` | the build used, e.g. `0.4.1` |
   | `finished` | `y` if the round reached a complete card |
   | `stopped_hole` | hole where scoring stopped; blank if finished |
   | `settled` | `app`, `memory` or `none` |
   | `wager_changed` | `y` if the group changed the bet mid-round |
   | `course`, `notes` | optional; read for nothing and never printed |

   A round you can't reconstruct goes in with what's known. Don't fill gaps from memory of the draft.

2. **Run** `node scripts/testing-summary.mjs ~/private/golo-testing-log.csv`. It checks every row and prints the summary with counts only. It refuses a path inside the repo.
3. **Save** the output as `docs/research/testing-summary.md`, then add a "Product decisions" section by hand. One line per decision: date, what was cut or added, and why. Example: "2026-05: GPS yardages cut. Watches and lasers already cover it."
4. **Answer** the questions in the "Needs the owner" column below. A short reply on #74 is enough; an agent can then fill in the Status column.

## Numbers

Status is one of: supported (with its source), changed (with the new value), or removed.

| # | Draft claim | Where in the draft | Settled by | Status |
|---|---|---|---|---|
| N1 | 40 rounds | title, intro, "THE TEST", table, summary | Summary: Rounds logged | Unverified |
| N2 | "over one season" | "THE TEST" | Summary: First and last round | Unverified |
| N3 | 11 groups | "THE TEST", table, paragraph | Summary: Distinct groups | Unverified |
| N4 | "none of them ours" | "THE TEST" | Summary: Groups with someone from GoLo playing = 0 | Unverified |
| N5 | 6 formats | "THE TEST", table | Summary: Distinct formats | Unverified |
| N6 | 31 finished with a complete card | table, summary | Summary: Finished | Unverified |
| N7 | 6 abandoned before the turn | table | Summary: Stopped before the turn | Unverified |
| N8 | 5 of the 6 quit on holes 3–5 | table, key stat, summary | Summary: Stopped on holes 3–5 | Unverified |
| N9 | "The nine that fell apart" (40 − 31) | paragraph | N1 − N6. The draft's 6 before the turn leaves 3 unaccounted for: check them against "Stopped on the back nine" | Unverified |
| N10 | 27 settled in the app | table | Summary: Settled in the app | Unverified |
| N11 | 4 settled from memory | table | Summary: Settled from memory. 27 + 4 = 31, so the draft assumes every finished round settled and no unfinished one did. Check that. | Unverified |
| N12 | 9 groups changed the wager mid-round | table, "What broke" | Summary: Changed the wager. The draft says "nine of forty **groups**", but there were 11 groups: it means rounds | Unverified, and the wording is wrong either way |
| N13 | 3 features cut | dek, "THE TEST", heading, summary | Product decisions | Unverified |
| N14 | "rebuilt scoring twice" | "What broke" | Product decisions | Unverified |
| N15 | "first fifteen rounds asking, last twenty-five watching" | callout | Owner: was there a switch, and at which round? | Unverified |
| N16 | "Two players opened" post-round stats | "What they ignored" | Owner: is there usage data, or is this recollection? | Unverified |

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
| P10 | One-tap logging for a press or a carry, stamped to the hole | `overall-match-presses`: live, called, on Overall Match only. Nassau doesn't take presses. | Does the copy hold once it says presses are on Overall Match? | Must be reworded to match the registry |
| P11 | The settle screen gives the fewest payments | `settle-up`: live | — | Supported by the registry |
| P12 | "Nobody has asked for any of them since" | — | Is there a record (support messages, feedback)? | Unverified |
| P13 | "Three things got used in every single round" | — | Is there a record, or is it an impression? | Unverified |

## Words and framing

| # | Draft text | Issue |
|---|---|---|
| W1 | "real Saturday rounds, real money" | Fine as a description of the groups' own bets, but the post must not suggest GoLo touched the money. SEO-17 should add the registry's limit: GoLo never holds, moves or processes money. |
| W2 | Quote: "Nobody wants a golf app. They want the argument to be over." | Who said it? A quote needs a real, consenting source. Otherwise turn it into plain prose in our own voice. |
| W3 | Date 2026-04-23 | Draft date only. Publish with the real publication date (#75). |
| W4 | Hero alt "Golfers testing a scoring app during a real round" and mid-article alts | The images are stock course photos, and the alts describe scenes that aren't in them. Replace the images or rewrite the alts (#75). |
| W5 | Title "We tested GoLo on 40 rounds…" | Keep it only if N1 is supported. Otherwise "What N real rounds taught us…", or drop the numbers and run it as qualitative build notes (#74). |

## Done when

- Every N row is supported, changed or removed, with its source.
- Every P row agrees with the registry, or the registry is updated first with `verified` set.
- `docs/research/testing-summary.md` exists and has no personal data.

That closes #74. #75 then rewrites the post from the supported rows only.
