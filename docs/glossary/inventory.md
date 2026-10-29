# Glossary inventory

The editorial source of truth for the GoLo Golf Glossary: every planned canonical term, its stable id and public slug, its category, MVP or expansion, its strict aliases, the concepts it must not be confused with, and the authoritative source a reviewer checks it against. Issue #152 (GLS-001); spec `docs/glossary/product-spec.md` §4, §10; tracking epic #151.

**Status of this file:** prepared October 28, 2026 against `main` at ba08106. It is a research document, not an approval. The MVP list is the owner-approved spec list; the substitutions in [Revisions](#revisions) and the [open questions](#open-questions-for-the-owner) are proposals until the owner signs off on #152.

## Totals

| Category | id | MVP | Expansion | Total |
|---|---|---:|---:|---:|
| A. Scoring | `scoring` | 8 | 16 | 24 |
| B. Games and formats | `formats` | 10 | 14 | 24 |
| C. Side games | `side-games` | 10 | 16 | 26 |
| D. Handicaps and course ratings | `handicaps` | 10 | 10 | 20 |
| E. Shots and ball flight | `shots` | 5 | 15 | 20 |
| F. Course, rules and etiquette | `course-rules` | 5 | 15 | 20 |
| G. Equipment and technology | `equipment` | 2 | 10 | 12 |
| H. Slang and golf culture | `slang` | 6 | 14 | 20 |
| **Total** | | **56** | **110** | **166** |

These reconcile with spec §4: eight categories, 56 MVP, 110 expansion, 166 canonical records. The rows below were counted per category after the revisions (each substitution replaces one record with one record, so no subtotal moved). Aliases are not records and are not counted.

The MVP 56 are exactly the spec's MVP list. Every revision is in the expansion backlog (M8, #168), logged with a reason.

The content batches map to the MVP as: #158 formats (10), #159 side games (10), #160 handicaps (10), #161 scoring 8 + shots 5 (13), #162 course 5 + equipment 2 + slang 6 (13). 10 + 10 + 10 + 13 + 13 = 56.

## Conventions

- **id** is internal and never changes once a record is created. **slug** is the public fragment (`/glossary#<slug>`) and, if a standalone page is ever approved (#169), the path segment. At creation `id === slug` for every record; if a slug later changes, the id stays and the old fragment is handled per `canonical-map.md` §Retired slugs.
- Both are lower-case ASCII, words joined by `-`. One slug starts with a digit (`19th-hole`). That's a valid HTML id; client code must look it up with `getElementById`, not `querySelector("#19th-hole")`.
- **Term** is the display name. Title case except where the term is a phrase ("Grip It and Rip It").
- **Category** is the one primary category; **tags** are optional secondary labels for search (`tags` match is the lowest ranking tier, spec §5.4). Tags are lower-case, from this closed set: `match-play`, `stroke-play`, `team`, `handicap`, `scoring-basics`, `junk`, `presses`, `rules`, `etiquette`, `short-game`, `ball-flight`, `putting`, `scramble`, `informal`.
- **Tier** is strategic fit from spec §7.1 (P0 direct GoLo relevance … P3 long tail). It is **not** search volume. See [Search evidence](#search-evidence) for the only observed data.
- **Aliases** are strict synonyms only: a reader typing the alias wants exactly this record. Normalised the same way search normalises (case, whitespace, punctuation, accents), so `four-ball`, `four ball` and `Four Ball` are one form and aren't listed separately. A form that collapses differently (`fourball`) is listed. Aliases never become records, pages or sitemap entries.
- **Related, not the same** lists records or ideas a writer must keep distinct from this one, and is the starting point for `relatedTermIds`. It is not an alias list.
- **Destination** is shorthand for the canonical target in `canonical-map.md`: `hub` = `/glossary#<slug>` owns the definition; `→ /path` = an existing published page owns the intent and the entry is a short definition plus that link.
- **Sources** name what a reviewer checks the entry against. Nothing in this column has been checked yet; see [Source map](#source-map).

## Source map

Rules- and WHS-sensitive records cite these. Abbreviations are used in the tables.

| Key | Source | Where | Status |
|---|---|---|---|
| RoG | Rules of Golf, R&A and USGA (2023 edition in force as of October 2026) | https://www.randa.org/rog · https://www.usga.org/rules | **Not accessed.** The session that wrote this file could not reach either host (network policy). |
| RoG Def. | Rules of Golf, Definitions | as above | Not accessed |
| CP | Official Guide to the Rules of Golf, Committee Procedures (Model Local Rules) | as above | Not accessed |
| ER | Equipment Rules | https://www.randa.org · https://www.usga.org/equipment-standards | Not accessed |
| RoH | Rules of Handicapping, World Handicap System (USGA edition, 2024 revision) | https://www.usga.org/handicapping/roh/ | **Not accessed.** Same network block. |
| ED | Editorial: reputable instruction or specialist golf sources, cross-checked; community usage for slang | named per entry at drafting | Not chosen yet |
| GoLo | `lib/content/capabilities.ts`, by capability id | this repo | Read October 28, 2026 at ba08106 |

Rule numbers below were assigned from the structure of the current editions as the writer understands it and **must be confirmed at the rules fact-check**: a wrong number is a fact-check finding, not a reason to skip the check.

Two edition notes for whoever reviews:

1. **Rules of Golf.** Revisions have taken effect on January 1 every four years (2019, 2023). If that cycle holds, a revised edition takes effect January 1, 2027, likely before or near this glossary's launch. The fact-check confirms which edition is current at the planned publication date and cites that one. GLS-010 (#166) rechecks at publication.
2. **Rules of Handicapping.** The 2024 revision is the one the site's handicap post already cites. Confirm it's still current at publication.

Existing site content already cites RoH Appendix C (allowances), Appendix G (Course and Slope Rating) and Rule 3.1b (net double bogey) in `/blog/index-vs-course-handicap`. Those links are on the site today; they haven't been re-opened for this inventory.

## A. Scoring (24)

| # | id = slug | Term | MVP | Tags | Tier | Aliases | Related, not the same | Sources | Destination |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `par` | Par | ✓ | scoring-basics | P2 | | `even-par`, `birdie`, `bogey`; Par Competition (`par-competition`, a format) | RoH Definitions (Par) | hub |
| 2 | `birdie` | Birdie | ✓ | scoring-basics | P2 | | `eagle`; Birdie Bounty (`birdie-bounty`, a side game); net birdie (a birdie after a handicap stroke, explained inside the entry) | — | hub |
| 3 | `eagle` | Eagle | ✓ | scoring-basics | P2 | | `albatross`, `birdie`; `eagle-bounty` | — | hub |
| 4 | `bogey` | Bogey | ✓ | scoring-basics | P2 | | `double-bogey`; Bogey Golfer (`bogey-golfer`); the older British sense of "bogey" as the ground score, now par (say so briefly) | — | hub |
| 5 | `double-bogey` | Double Bogey | ✓ | scoring-basics | P2 | | **Net Double Bogey** (`net-double-bogey`: a WHS hole maximum, not just a score of +2); `triple-bogey` | — | hub |
| 6 | `gross-score` | Gross Score | ✓ | handicap | P1 | gross | `net-score` | RoG R. 3.3 (scores in stroke play); RoH Definitions | hub |
| 7 | `net-score` | Net Score | ✓ | handicap | P1 | net | `gross-score`, `handicap-stroke`, `course-handicap`, `playing-handicap` | RoG R. 3.3 (handicap competitions); RoH Definitions | hub (standalone candidate, #169) |
| 8 | `stroke-play` | Stroke Play | ✓ | stroke-play | P1 | medal play | `match-play`, `stableford`, `maximum-score` | RoG Def. Stroke Play; RoG R. 3.3 | hub |
| 9 | `hole-in-one` | Hole-in-One | | scoring-basics | P2 | ace | `eagle`, `albatross`, `condor` | — | hub |
| 10 | `albatross` | Albatross | | scoring-basics | P2 | double eagle | `eagle`, `condor` | — | hub |
| 11 | `condor` | Condor | | scoring-basics | P3 | | `albatross` | — | hub |
| 12 | `triple-bogey` | Triple Bogey | | scoring-basics | P2 | | `double-bogey`, `quadruple-bogey` | — | hub |
| 13 | `quadruple-bogey` | Quadruple Bogey | | scoring-basics | P3 | | `triple-bogey`, `snowman` | — | hub |
| 14 | `even-par` | Even Par | | scoring-basics | P2 | level par | `par`, `under-par`, `over-par`; All Square (`all-square`, a match standing) | — | hub |
| 15 | `under-par` | Under Par | | scoring-basics | P2 | | `even-par`, `over-par` | — | hub |
| 16 | `over-par` | Over Par | | scoring-basics | P2 | | `even-par`, `under-par` | — | hub |
| 17 | `scorecard` | Scorecard | | rules | P2 | card | `stroke-index` (a row on it) | RoG Def. Scorecard; RoG R. 3.3b | hub |
| 18 | `front-nine` | Front Nine | | scoring-basics | P2 | front 9 | `back-nine`, `the-turn`, `nassau` | — | hub |
| 19 | `back-nine` | Back Nine | | scoring-basics | P2 | back 9 | `front-nine`, `the-turn`, `nassau` | — | hub |
| 20 | `halve` | Halve | | match-play | P1 | halved hole | **Push** (`push`, the side-game outcome of a tie); `all-square`, `match-play` | RoG R. 3.2a | hub — **substitution S1** |
| 21 | `round` | Round | | rules | P2 | | `front-nine`, `back-nine` | RoG Def. Round | hub |
| 22 | `penalty-stroke` | Penalty Stroke | | rules | P2 | | `stroke-and-distance`, `penalty-area` | RoG R. 1.3c; RoG Def. General Penalty | hub |
| 23 | `maximum-score` | Maximum Score | | stroke-play, rules | P2 | | **Net Double Bogey** (a WHS posting adjustment, not a competition format) | RoG R. 21.2; RoG Def. Maximum Score | hub |
| 24 | `cut-line` | Cut Line | | stroke-play | P3 | the cut, making the cut | — (qualifying for later rounds, not a hole score: spec §4 A) | ED | hub |

Subtotal: 8 MVP + 16 expansion = 24.

## B. Games and formats (24)

| # | id = slug | Term | MVP | Tags | Tier | Aliases | Related, not the same | Sources | Destination |
|---|---|---|---|---|---|---|---|---|---|
| 25 | `skins` | Skins | ✓ | | P0 | skins game | `carryover`, `push`, `net-score`, `birdie-bounty` | GoLo `game-library` | → `/games/skins` |
| 26 | `nassau` | Nassau | ✓ | match-play | P0 | | `match-play`, `press`, `front-nine`, `back-nine` | GoLo `game-library`, `overall-match-presses` (Nassau takes no presses) | → `/games/nassau` |
| 27 | `wolf` | Wolf | ✓ | team | P0 | | `lone-wolf`, `four-ball` | GoLo `game-library` | → `/games/wolf` |
| 28 | `bingo-bango-bongo` | Bingo Bango Bongo | ✓ | | P0 | bbb | `closest-to-the-pin`, `greenie` | GoLo `game-library` | → `/games/bingo-bango-bongo` |
| 29 | `best-score` | Best Score | ✓ | | P0 | | **Four-Ball** (`four-ball`). Best Score is GoLo's name for "the best single score in the group takes it" (`lib/content/games.ts`: "Net or gross: the best score takes it"). It is an individual format. It is **not** best ball, and the entry says how they differ. `stroke-play`, `net-score` | GoLo `game-library` | → `/games/best-score` |
| 30 | `scramble` | Scramble | ✓ | team, scramble | P0 | captain's choice | `texas-scramble`, `florida-scramble`, `shamble`, `four-ball` | RoH Appendix C (scramble allowances); GoLo `scramble` | → `/games/scramble` |
| 31 | `four-ball` | Four-Ball | ✓ | team, match-play, stroke-play | P1 | best ball, better ball, fourball | **Best Score** (`best-score`: not a team format); `foursomes`, `scramble`, `wolf` | RoG Def. Four-Ball; RoG R. 23; RoH Appendix C | hub |
| 32 | `foursomes` | Foursomes | ✓ | team | P1 | alternate shot | `greensomes`, `chapman`; a casual "foursome" (four players in a group) is not this format: say so in the entry | RoG Def. Foursomes; RoG R. 22; RoH Appendix C | hub |
| 33 | `match-play` | Match Play | ✓ | match-play | P1 | matchplay | `stroke-play`, `halve`, `dormie`, `all-square`, `nassau` | RoG Def. Match Play; RoG R. 3.2 | hub |
| 34 | `stableford` | Stableford | ✓ | stroke-play | P1 | | `modified-stableford`, `quota`, `par-competition` | RoG Def. Stableford; RoG R. 21.1 | hub |
| 35 | `shamble` | Shamble | | team, scramble | P1 | | `scramble` | ED; GoLo `scramble` (no shamble) | hub |
| 36 | `chapman` | Chapman | | team | P2 | pinehurst, american foursomes | `foursomes`, `greensomes` | ED | hub — **merge M1** |
| 37 | `par-competition` | Par Competition | | stroke-play | P2 | bogey competition, par/bogey | `par`, `stableford`, `match-play` | RoG R. 21.3; RoG Def. Par/Bogey | hub — **substitution S2** |
| 38 | `texas-scramble` | Texas Scramble | | team, scramble | P1 | | `scramble`, `florida-scramble`. US usage: a minimum number of each player's drives. In Britain and Ireland "Texas scramble" often just means a scramble; say so. | ED; RoH Appendix C; GoLo `scramble` (no drive count) | hub |
| 39 | `modified-stableford` | Modified Stableford | | stroke-play | P2 | | `stableford` | ED | hub |
| 40 | `ryder-cup-style` | Ryder Cup-Style Competition | | team, match-play | P1 | ryder cup format | `four-ball`, `foursomes`, `match-play` | ED; GoLo `trip-tally` is planned (education only) | hub |
| 41 | `vegas` | Vegas | | team | P2 | las vegas | — | ED | hub |
| 42 | `quota` | Quota | | | P1 | | `stableford` | ED; GoLo `quota` is planned (education only) | hub |
| 43 | `sixes` | Sixes | | team | P2 | round robin, hollywood | `nines` | ED | hub — **merge M2** |
| 44 | `nines` | Nines | | | P2 | | `sixes` | ED | hub |
| 45 | `greensomes` | Greensomes | | team | P2 | | `foursomes`, `chapman` | ED; RoH Appendix C | hub — **substitution S3** |
| 46 | `florida-scramble` | Florida Scramble | | team, scramble | P2 | step-aside scramble | `scramble`, `texas-scramble` | ED; GoLo `scramble` | hub — **substitution S4** |
| 47 | `peoria-system` | Peoria System | | handicap | P2 | peoria | `handicap-index`, `sandbagging` | ED | hub |
| 48 | `three-ball` | Three-Ball | | match-play | P3 | | `match-play`; a casual "threesome" (three in a group) | RoG R. 21.4 | hub |

Subtotal: 10 MVP + 14 expansion = 24.

## C. Side games (26)

The spec calls this category "Side games and friendly wagers". The public label is **Side games** (owner, 2026-10-29: Q1), because the site's vocabulary check fails "wager" anywhere in site copy. The category id is `side-games`.

The app has no junk board (owner, 2026-10-29, #172). Junk, Greenie, Sandy and every junk item are golf education with no GoLo note. Birdie and eagle bounties exist in GoLo only as the Skins game's birdie and eagle skin settings.

| # | id = slug | Term | MVP | Tags | Tier | Aliases | Related, not the same | Sources | Destination |
|---|---|---|---|---|---|---|---|---|---|
| 49 | `press` | Press | ✓ | presses, match-play | P0 | | `re-press`, **`automatic-press`**, `nassau`, `match-play`, `double-or-nothing` | GoLo `overall-match-presses` (called, never automatic; Nassau takes none) | → `/blog/pressing` |
| 50 | `re-press` | Re-press | ✓ | presses | P0 | repress, press the press | `press`, `automatic-press` | GoLo `overall-match-presses`: a side can press a press, and the two-live limit still applies (owner, 2026-10-29, #154 Q-b; registry line in #179) | hub |
| 51 | `carryover` | Carryover | ✓ | | P0 | carry, carry over | `push`, `skins`, `greenie` (greenies can carry too) | GoLo `game-library` | → `/blog/skins-carryover` |
| 52 | `push` | Push | ✓ | | P1 | | **Halve** (`halve`, the Rules' match-play term); `carryover`, `all-square` | — | hub |
| 53 | `greenie` | Greenie | ✓ | junk | P3 | | **Closest to the Pin** (`closest-to-the-pin`: closest wins; a greenie usually also needs on in one and par or better); `junk`, `sandy` | education only; no GoLo note (the app has no junk board: owner, 2026-10-29, #172) | hub, links `/games/closest-to-pin` |
| 54 | `sandy` | Sandy | ✓ | junk | P3 | sandie | `up-and-down`, `junk`, `bunker` | education only; no GoLo note (the app has no junk board: owner, 2026-10-29, #172) | hub |
| 55 | `junk` | Junk | ✓ | junk | P1 | trash, garbage, dots | `greenie`, `sandy`, `barkie`, `poley`, `arnie`, `snake` | education only; no GoLo note (the app has no junk board: owner, 2026-10-29, #172) | hub |
| 56 | `settle-up` | Settle-up | ✓ | | P0 | settling up | `debt-netting`, `carryover` | GoLo `settle-up` (never holds, moves or processes money; each round settles on its own; not always the fewest payments), `payment-handle` | hub |
| 57 | `closest-to-the-pin` | Closest to the Pin | ✓ | | P0 | closest to pin, ctp, kp | **Greenie** (`greenie`) | GoLo `closest-to-pin` (live: the scorer marks the winner; par-to-win isn't enforced), `distance-logging` (not offered: no measured distance) | → `/games/closest-to-pin` |
| 58 | `longest-drive` | Longest Drive | ✓ | | P0 | long drive | `drive`, `driver`, `fairway` | GoLo `game-library`, `distance-logging` | → `/games/longest-drive` |
| 59 | `automatic-press` | Automatic Press | | presses | P0 | auto press | `press`, `re-press` | GoLo `auto-press` (**planned**: education only, no GoLo note) | hub, links `/blog/pressing` |
| 60 | `point-value` | Point Value | | | P2 | | `buy-in`, `wolf`, `bingo-bango-bongo` | — | hub — **substitution S10** |
| 61 | `buy-in` | Buy-in | | | P2 | | `point-value` | — | hub |
| 62 | `validation` | Validation | | | P2 | | `carryover`, `skins` | Education only; no GoLo note (the app has no validation rules: owner, 2026-10-29, #176) | hub, links `/games/skins` — **substitution S11** |
| 63 | `net-skins` | Net Skins | | handicap | P1 | | `skins`, `net-score`, `handicap-stroke` | GoLo `game-library`, `handicap-strokes` (product audit decides any note) | hub, links `/games/skins` — **substitution S12** |
| 64 | `debt-netting` | Debt Netting | | | P1 | netting | `settle-up` | GoLo `settle-up` (netted into one number per player) | hub |
| 65 | `birdie-bounty` | Birdie Bounty | | junk | P0 | birdies game | `birdie`, `eagle-bounty`, `skins` | GoLo `game-library` limit: birdie and eagle bounties are a Skins setting, gross birdies only | → `/games/birdies` |
| 66 | `eagle-bounty` | Eagle Bounty | | junk | P2 | | `birdie-bounty`, `eagle` | GoLo `game-library` (same limit) | hub, links `/games/birdies` |
| 67 | `barkie` | Barkie | | junk | P3 | barky, woodie | `junk`, `sandy` | education only; no GoLo note (the app has no junk board: owner, 2026-10-29, #172) | hub |
| 68 | `poley` | Poley | | junk | P3 | polie | `junk` | education only; no GoLo note (the app has no junk board: owner, 2026-10-29, #172) | hub |
| 69 | `snake` | Snake | | junk, putting | P3 | | `three-putt`, `junk` | education only; no GoLo note (the app has no junk board: owner, 2026-10-29, #172) | hub |
| 70 | `arnie` | Arnie | | junk | P3 | arnold | `junk`, `fairway` | education only; no GoLo note (the app has no junk board: owner, 2026-10-29, #172) | hub — **substitution S5** |
| 71 | `hammer` | Hammer | | | P2 | | `press`, `double-or-nothing` | — | hub |
| 72 | `double-or-nothing` | Double or Nothing | | | P3 | | `press`, `hammer` | — | hub |
| 73 | `lone-wolf` | Lone Wolf | | team | P2 | | `wolf` | GoLo `game-library` | hub, links `/games/wolf` |
| 74 | `rabbit` | Rabbit | | | P3 | | `skins` | ED | hub — **substitution S6** |

Subtotal: 10 MVP + 16 expansion = 26.

## D. Handicaps and course ratings (20)

Every record here is rules-sensitive. Worked examples are recomputed by the reviewer from shown inputs (#160). GoLo notes keep official rules apart from GoLo's narrower implementation: full Course Handicap for everyone, one set of tees per group, no percentage allowance except a scramble's team handicap, nobody plays off the low man (`handicap-strokes`; `handicap-allowances` and `mixed-tees` are planned).

| # | id = slug | Term | MVP | Tags | Tier | Aliases | Related, not the same | Sources | Destination |
|---|---|---|---|---|---|---|---|---|---|
| 75 | `handicap-index` | Handicap Index | ✓ | handicap | P1 | | **`course-handicap`**, **`playing-handicap`**, `score-differential` | RoH Definitions; RoH R. 5.2 (best 8 of 20) | → `/blog/index-vs-course-handicap` |
| 76 | `course-handicap` | Course Handicap | ✓ | handicap | P1 | | **`handicap-index`**, **`playing-handicap`**, `slope-rating`, `course-rating` | RoH R. 6.1 | → `/blog/index-vs-course-handicap` |
| 77 | `playing-handicap` | Playing Handicap | ✓ | handicap | P1 | | **`course-handicap`**, `handicap-allowance` | RoH R. 6.2; RoH Appendix C | hub, links the post |
| 78 | `course-rating` | Course Rating | ✓ | handicap | P1 | | `slope-rating`, `par`, `scratch-golfer` | RoH Definitions; RoH Appendix G | hub |
| 79 | `slope-rating` | Slope Rating | ✓ | handicap | P1 | slope | `course-rating`, `bogey-golfer` | RoH Definitions; RoH Appendix G | hub |
| 80 | `stroke-index` | Stroke Index | ✓ | handicap | P1 | handicap hole, hole handicap | `handicap-stroke` | RoH Appendix E (stroke index allocation); RoG R. 3.3 | hub (standalone candidate, #169) |
| 81 | `handicap-stroke` | Handicap Stroke | ✓ | handicap | P1 | pop | `stroke-index`, `net-score`, `course-handicap` | RoH R. 6 (applying strokes); RoH Appendix E | hub |
| 82 | `handicap-allowance` | Handicap Allowance | ✓ | handicap | P1 | | `playing-handicap`, `course-handicap` | RoH R. 6.2; RoH Appendix C; GoLo `handicap-allowances` (**planned**: education only) | hub |
| 83 | `net-double-bogey` | Net Double Bogey | ✓ | handicap | P1 | | **`double-bogey`**, `maximum-score`, `most-likely-score` | RoH R. 3.1 (3.1b) | hub |
| 84 | `score-differential` | Score Differential | ✓ | handicap | P1 | differential | `handicap-index`, `playing-conditions-calculation` | RoH R. 5.1 | hub |
| 85 | `world-handicap-system` | World Handicap System | | handicap | P1 | whs | `handicap-index` | RoH (whole) | hub |
| 86 | `scratch-golfer` | Scratch Golfer | | handicap | P2 | scratch, scratch player | `course-rating`, `plus-handicap` | RoH Definitions | hub |
| 87 | `bogey-golfer` | Bogey Golfer | | handicap | P2 | | `bogey`, `slope-rating` | RoH Definitions | hub |
| 88 | `plus-handicap` | Plus Handicap | | handicap | P2 | plus handicapper | `scratch-golfer` | RoH R. 6 | hub |
| 89 | `sandbagging` | Sandbagging | | handicap, informal | P1 | sandbagger, bandit | `handicap-index`, `exceptional-score-reduction` | RoH R. 7 (Committee review) | → `/blog/sandbagging` |
| 90 | `playing-conditions-calculation` | Playing Conditions Calculation | | handicap | P2 | pcc | `score-differential` | RoH R. 5.6 | hub |
| 91 | `soft-cap` | Soft Cap | | handicap | P2 | | `hard-cap`, `handicap-index` | RoH R. 5.8 | hub |
| 92 | `hard-cap` | Hard Cap | | handicap | P2 | | `soft-cap` | RoH R. 5.8 | hub |
| 93 | `exceptional-score-reduction` | Exceptional Score Reduction | | handicap | P2 | esr | `sandbagging`, `score-differential` | RoH R. 5.9 | hub |
| 94 | `most-likely-score` | Most Likely Score | | handicap | P2 | | `net-double-bogey` | RoH R. 3.3 | hub |

Subtotal: 10 MVP + 10 expansion = 20.

## E. Shots and ball flight (20)

| # | id = slug | Term | MVP | Tags | Tier | Aliases | Related, not the same | Sources | Destination |
|---|---|---|---|---|---|---|---|---|---|
| 95 | `drive` | Drive | ✓ | | P2 | | **Driver** (`driver`: the club, not the shot); `longest-drive`, `teeing-area`. "Tee shot" is broader (an iron on a par 3 is a tee shot, not usually called a drive), so it's not an alias. | — | hub |
| 96 | `chip` | Chip | ✓ | short-game | P2 | chip shot | **`pitch`**, `bump-and-run`, `chili-dip` | ED | hub |
| 97 | `pitch` | Pitch | ✓ | short-game | P2 | pitch shot | **`chip`**, `flop-shot` | ED | hub |
| 98 | `putt` | Putt | ✓ | putting | P2 | | `putter`, `lag-putt`, `three-putt`, `gimme` | RoG R. 13 (on the putting green) | hub |
| 99 | `slice` | Slice | ✓ | ball-flight | P2 | banana ball | `fade` (controlled, smaller), `hook` | ED | hub |
| 100 | `draw` | Draw | | ball-flight | P2 | | `hook`, `fade` | ED | hub |
| 101 | `fade` | Fade | | ball-flight | P2 | | `slice`, `draw` | ED | hub |
| 102 | `hook` | Hook | | ball-flight | P2 | | `draw`, `slice` | ED | hub |
| 103 | `shank` | Shank | | | P2 | hosel rocket, socket | `slice` | ED | hub |
| 104 | `flop-shot` | Flop Shot | | short-game | P2 | flop | `pitch` | ED | hub |
| 105 | `punch-shot` | Punch Shot | | | P2 | punch | `bump-and-run` | ED | hub |
| 106 | `bump-and-run` | Bump-and-Run | | short-game | P2 | | `chip` (a bump-and-run is a low running chip, often from farther out; keep the difference stated) | ED | hub |
| 107 | `lag-putt` | Lag Putt | | putting | P2 | lag | `putt`, `three-putt` | ED | hub |
| 108 | `approach-shot` | Approach Shot | | | P2 | approach | `layup`, `pitch` | ED | hub |
| 109 | `layup` | Layup | | | P2 | lay up | `approach-shot` | ED | hub |
| 110 | `fat-shot` | Fat Shot | | | P2 | chunk, chunked, heavy | `thin-shot`, `chili-dip` (a fat chip specifically) | ED | hub |
| 111 | `thin-shot` | Thin Shot | | | P2 | skull, skulled, bladed | `fat-shot`, `topped-shot` | ED | hub |
| 112 | `topped-shot` | Topped Shot | | | P2 | topped | `thin-shot`, `worm-burner` (describes the flight, not the contact) | ED | hub |
| 113 | `up-and-down` | Up-and-Down | | short-game | P2 | | `sandy` (an up-and-down from a bunker, as junk) | ED | hub |
| 114 | `three-putt` | Three-Putt | | putting | P2 | three jack, 3-putt | `snake`, `lag-putt` | ED | hub |

Subtotal: 5 MVP + 15 expansion = 20.

## F. Course, rules and etiquette (20)

Use the Rules' defined terms. "Fairway" and "rough" aren't defined areas; both are part of the general area, and the entries say so without being pedantic (#162). Historical terms ("hazard", "casual water", "through the green") are aliases with a note that the Rules stopped using them in 2019.

| # | id = slug | Term | MVP | Tags | Tier | Aliases | Related, not the same | Sources | Destination |
|---|---|---|---|---|---|---|---|---|---|
| 115 | `teeing-area` | Teeing Area | ✓ | rules | P2 | tee box, tee ground | `drive` | RoG Def. Teeing Area; RoG R. 6.2 | hub |
| 116 | `fairway` | Fairway | ✓ | | P2 | short grass | `rough`, `general-area` | RoG Def. General Area | hub |
| 117 | `rough` | Rough | ✓ | | P2 | | `fairway`, `general-area` | RoG Def. General Area | hub |
| 118 | `bunker` | Bunker | ✓ | rules | P2 | sand trap, trap | `penalty-area`, `sandy`, `fried-egg` | RoG Def. Bunker; RoG R. 12 | hub |
| 119 | `penalty-area` | Penalty Area | ✓ | rules | P2 | water hazard, lateral hazard | `bunker`, `penalty-stroke`, `out-of-bounds` | RoG Def. Penalty Area; RoG R. 17 | hub |
| 120 | `putting-green` | Putting Green | | rules, putting | P2 | green, dance floor | `fringe` | RoG Def. Putting Green; RoG R. 13 | hub |
| 121 | `fringe` | Fringe | | | P2 | collar, apron, frog hair | `putting-green`, `general-area` | RoG Def. General Area | hub |
| 122 | `general-area` | General Area | | rules | P2 | through the green | `fairway`, `rough` | RoG Def. General Area | hub |
| 123 | `out-of-bounds` | Out of Bounds | | rules | P2 | ob | `stroke-and-distance`, `provisional-ball` | RoG Def. Out of Bounds; RoG R. 18.2 | hub |
| 124 | `provisional-ball` | Provisional Ball | | rules | P2 | provisional | `out-of-bounds`, `stroke-and-distance` | RoG Def. Provisional Ball; RoG R. 18.3 | hub |
| 125 | `unplayable-ball` | Unplayable Ball | | rules | P2 | unplayable | `stroke-and-distance` | RoG R. 19 | hub |
| 126 | `stroke-and-distance` | Stroke and Distance | | rules | P2 | | `out-of-bounds`, `penalty-stroke` | RoG Def. Stroke and Distance; RoG R. 18.1 | hub |
| 127 | `relief-area` | Relief Area | | rules | P3 | | `nearest-point-of-complete-relief` | RoG Def. Relief Area; RoG R. 14.3 | hub |
| 128 | `nearest-point-of-complete-relief` | Nearest Point of Complete Relief | | rules | P3 | nearest point of relief, npcr | `relief-area` | RoG Def. Nearest Point of Complete Relief | hub |
| 129 | `ground-under-repair` | Ground Under Repair | | rules | P2 | gur | `temporary-water` | RoG Def. Ground Under Repair; RoG R. 16.1 | hub |
| 130 | `temporary-water` | Temporary Water | | rules | P3 | casual water | `ground-under-repair` | RoG Def. Temporary Water; RoG R. 16.1 | hub |
| 131 | `preferred-lies` | Preferred Lies | | rules | P2 | lift clean and place, winter rules | `local-rule` | CP Model Local Rule E-3; RoH (posting under preferred lies) | hub |
| 132 | `ready-golf` | Ready Golf | | etiquette | P2 | | `pace-of-play` | RoG R. 5.6; RoG R. 6.4 | hub |
| 133 | `local-rule` | Local Rule | | rules | P2 | local rules | `preferred-lies` | RoG R. 1.3; CP Section 8 | hub |
| 134 | `pace-of-play` | Pace of Play | | etiquette | P2 | | `ready-golf` | RoG R. 5.6 | hub |

Subtotal: 5 MVP + 15 expansion = 20.

## G. Equipment and technology (12)

Definitions, not buying advice. No brands (#162).

| # | id = slug | Term | MVP | Tags | Tier | Aliases | Related, not the same | Sources | Destination |
|---|---|---|---|---|---|---|---|---|---|
| 135 | `driver` | Driver | ✓ | | P2 | big dog, 1-wood | **Drive** (`drive`: the shot); `fairway-wood`, `longest-drive` | ER (club conformity) | hub |
| 136 | `putter` | Putter | ✓ | putting | P2 | flatstick | `putt` | ER; RoG R. 4.1 | hub |
| 137 | `iron` | Iron | | | P2 | | `wedge`, `hybrid` | — | hub |
| 138 | `wedge` | Wedge | | short-game | P2 | | `iron`, `bounce`, `loft` | — | hub |
| 139 | `hybrid` | Hybrid | | | P2 | rescue club | `iron`, `fairway-wood` | — | hub |
| 140 | `fairway-wood` | Fairway Wood | | | P2 | | `driver`, `hybrid` | — | hub |
| 141 | `loft` | Loft | | | P2 | | `lie-angle`, `bounce` | — | hub |
| 142 | `lie-angle` | Lie Angle | | | P3 | | `loft`. Not "lie" (where the ball rests, RoG Def. Lie), so "lie" is not an alias. | — | hub |
| 143 | `bounce` | Bounce | | short-game | P3 | | `wedge`, `loft` | — | hub |
| 144 | `shaft-flex` | Shaft Flex | | | P3 | flex | — | — | hub |
| 145 | `rangefinder` | Rangefinder | | | P2 | laser | `launch-monitor`; GPS devices (GoLo `gps-yardages` is not offered) | RoG R. 4.3a; CP Model Local Rule G-5 | → `/blog/rangefinder` |
| 146 | `launch-monitor` | Launch Monitor | | | P3 | | `rangefinder` | RoG R. 4.3 | hub |

Subtotal: 2 MVP + 10 expansion = 12.

## H. Slang and golf culture (20)

Each entry is labelled informal. Mulligan, Gimme and Breakfast Ball are labelled as practices the Rules don't allow, with what that means for a score posted for handicap (#162).

| # | id = slug | Term | MVP | Tags | Tier | Aliases | Related, not the same | Sources | Destination |
|---|---|---|---|---|---|---|---|---|---|
| 147 | `mulligan` | Mulligan | ✓ | informal | P2 | | **`breakfast-ball`** (a mulligan on the first tee only) | RoG (no such provision); RoH R. 2 (acceptable scores) | hub |
| 148 | `gimme` | Gimme | ✓ | informal, putting | P2 | | `good-good`, `inside-the-leather`; the Rules' concession (match play only) | RoG R. 3.2b (concessions); RoG R. 3.3c (holing out in stroke play); RoH R. 3.3 (unfinished holes) | hub |
| 149 | `breakfast-ball` | Breakfast Ball | ✓ | informal | P3 | | **`mulligan`** | as Mulligan | hub |
| 150 | `snowman` | Snowman | ✓ | informal | P3 | | `quadruple-bogey` (an 8 is a quad only on a par 4) | — | hub |
| 151 | `19th-hole` | 19th Hole | ✓ | informal | P3 | nineteenth hole | `settle-up` | — | hub |
| 152 | `worm-burner` | Worm Burner | ✓ | informal | P3 | worm killer | `topped-shot`, `thin-shot` | — | hub |
| 153 | `knee-knocker` | Knee-Knocker | | informal, putting | P3 | | `gimme`, `the-yips` | ED | hub — **substitution S7** |
| 154 | `fried-egg` | Fried Egg | | informal | P3 | | `bunker` | ED | hub |
| 155 | `chili-dip` | Chili Dip | | informal, short-game | P3 | | `fat-shot` (any club), `chip` | ED | hub |
| 156 | `lip-out` | Lip-Out | | informal, putting | P3 | lipped out | `putt` | ED | hub |
| 157 | `inside-the-leather` | Inside the Leather | | informal, putting | P3 | in the leather | `gimme`, `good-good` | ED | hub — **substitution S8** |
| 158 | `the-turn` | The Turn | | informal | P3 | making the turn | `front-nine`, `back-nine` | ED | hub |
| 159 | `dormie` | Dormie | | match-play | P2 | dormy | `match-play`, `all-square` | ED | hub, links `/games/nassau` |
| 160 | `all-square` | All Square | | match-play | P2 | | `halve`, `even-par`, `dormie` | ED | hub, links `/games/nassau` |
| 161 | `good-good` | Good-Good | | informal, putting | P3 | | `gimme` | ED | hub |
| 162 | `the-yips` | The Yips | | informal | P3 | yips | `knee-knocker` | ED | hub |
| 163 | `army-golf` | Army Golf | | informal | P3 | | `hook`, `slice` | ED | hub |
| 164 | `members-bounce` | Member's Bounce | | informal | P3 | | — | ED | hub |
| 165 | `grip-it-and-rip-it` | Grip It and Rip It | | informal | P3 | | `drive` | ED | hub |
| 166 | `ham-and-egg` | Ham and Egg | | informal, team | P3 | ham-and-egging | `four-ball` | ED | hub — **substitution S9** |

Subtotal: 6 MVP + 14 expansion = 20.

## Alias decisions

The six from #152, each resolved to exactly one record:

| Alias | Record | Reason |
|---|---|---|
| best ball | `four-ball` | In the formal sense, "best ball" is a partnership format where each team counts its better score: Four-Ball (RoG R. 23). People also say "best ball" loosely for other things, so the Four-Ball entry notes the informal use. It never resolves to `best-score`: GoLo's Best Score is an individual format ("the best score takes it"), and its entry says how it differs. |
| alternate shot | `foursomes` | Foursomes is the Rules' name for partners alternating strokes on one ball (RoG R. 22). Casual "alternate shot" variants where both partners drive (Greensomes, Chapman) are separate records, and the Foursomes entry points to them. |
| tee box | `teeing-area` | The 2019 Rules renamed the "teeing ground" the teeing area; "tee box" is what most golfers say. |
| double eagle | `albatross` | The same score, three under par on a hole. US usage. |
| pop | `handicap-stroke` | US slang for a handicap stroke on a hole ("I get a pop here"). Exact equivalence; no other glossary sense of "pop". |
| auto press | `automatic-press` | Same concept. It's an expansion record, so before #168 publishes it, a search for "auto press" finds nothing (or Press, by its description). |

Other strict aliases are in the tables. Two kinds of candidate were rejected:

- **Not strict.** "tee shot" (broader than a drive), "concession" (the Rules' term covers more than a gimme), "handicap" alone (could mean Index or Course Handicap), "lie" (the ball's lie, not the club's lie angle), "foursome" (a group of four, not the format), "scramble" for up-and-down (collides with the format).
- **Fails the vocabulary check.** The spec's draft Press record (§8.3) lists "press bet" and "pressing a bet". Both fail `scripts/check-content.mjs` (`NEVER_WORDS` matches "bet"), so they're dropped. See Q2.

Deliberately ambiguous aliases (an alias resolving to two records): **none.** The model in #155 should fail any collision unless an alias is listed here as deliberately ambiguous.

## Revisions

Each substitution replaces one expansion record with one, so category totals are unchanged. Merges move a redundant record's name into another record's aliases (spec §4.1 rule 1: one record per concept; aliases don't count).

| Id | Category | Change | Reason |
|---|---|---|---|
| S1 | Scoring | **Stableford Points** → **Halve** | "Stableford Points" is the Stableford format's own scoring, so a second record would define the same concept as `stableford` (MVP). Halve is the Rules' match-play term for a tied hole (RoG R. 3.2a). The site already uses it (Nassau guide glossary), and it needs to be kept distinct from Push. |
| M1 + S2 | Formats | **Pinehurst** merged into **Chapman** (alias); **Par Competition** added | Pinehurst and Chapman are commonly the same format, with American foursomes as a third name. If the fact-check finds a distinct regional definition, split them again and drop S2. Par Competition (Par/Bogey, RoG R. 21.3) is a Rules-defined format missing from the list. |
| M2 + S3 | Formats | **Round Robin** merged into **Sixes** (aliases round robin, hollywood); **Greensomes** added | In side-game use, round robin, sixes and Hollywood all mean partners rotating every six holes. Greensomes (both partners drive, then alternate) completes the foursomes family that the alternate-shot alias points at. |
| S4 | Formats | **Individual vs. Team Competition** → **Florida Scramble** | The original is a comparison, not a term: no one searches it as a word to define, and Four-Ball, Foursomes, Scramble and Match Play already cover it. Florida (step-aside) scramble is a real scramble variant next to Texas Scramble. |
| M3 + S5 | Side games | **Dots** merged into **Junk** (alias); **Arnie** added | Dots, junk, trash and garbage are the same thing: side points marked on the card. Arnie (par after missing the fairway) is a common junk item alongside barkie, sandy and poley. |
| S6 | Side games | **Partner Bet** → **Rabbit** | "Partner bet" isn't an established term with one meaning, and the name fails the vocabulary check ("bet"). Rabbit is a named side game. |
| M4 + S7 | Slang | **Banana Ball** merged into **Slice** (alias); **Knee-Knocker** added | A banana ball is a big slice, the same ball flight. A knee-knocker is a short, nervy putt. |
| M5 + S8 | Slang | **Hosel Rocket** merged into **Shank** (alias); **Inside the Leather** added | A hosel rocket is a shank. Inside the leather is the old gimme-distance convention, already on the site (Closest to Pin guide glossary). |
| M6 + S9 | Slang | **Dance Floor** merged into **Putting Green** (alias); **Ham and Egg** added | "Dance floor" is slang for the green. Ham and egg is partners covering for each other's holes. |

Kept on purpose, with the reason recorded so it isn't re-litigated:

- **Even Par / Under Par / Over Par** are separate records. Each is searched and defined on its own, and none is a synonym of another or of Par.
- **Birdie Bounty / Eagle Bounty** are separate: different triggers and different values, the same way Greenie and Sandy are separate junk items.
- **Worm Burner / Topped Shot**, **Chili Dip / Fat Shot**, **Bump-and-Run / Chip**: the slang or named technique describes something narrower than the general term. Each entry says how.
- **Breakfast Ball / Mulligan**: the spec's MVP. A breakfast ball is the first-tee-only mulligan, and the entry says so.
- **Greenie / Closest to the Pin**: closest wins CTP; a greenie usually also needs on in one and par or better. They share a guide (`/games/closest-to-pin`) but are different contests.

| S10 | Side games | **Side Pot** → **Point Value** | Owner, 2026-10-29 (Q1): the name fails the vocabulary check, and no `vocab-ok` exceptions. Point Value is already the site's term (Wolf and Bingo Bango Bongo guides). |
| S11 | Side games | **Stakes** → **Validation** | Owner, 2026-10-29 (Q1). The skins house rule the site already explains. Education only: GoLo has no validation rules (#176). |
| S12 | Side games | **Payout** → **Net Skins** | Owner, 2026-10-29 (Q1). Skins played off handicap strokes, already in the skins guide's glossary. |

The owner accepted S1–S9 and M1–M6 as the M8 backlog on 2026-10-29 (Q4), and added S10–S12 (Q1).

## Existing site definitions: audit

Read October 28, 2026 at ba08106: the `glossary` and FAQ arrays of all nine guides (`lib/content/gameDetail.ts`), `lib/content/faq.ts`, `lib/content/games.ts`, and the relevant posts in `lib/content/blog.ts` (`pressing`, `index-vs-course-handicap`, `nassau`, `skins-carryover`, `wolf`, `bingo-bango-bongo`).

The glossary's wording has to agree with these. Where it can't, the conflict is listed here for a decision.

**Agrees; the glossary follows the existing wording:**

| Topic | Existing wording | Where |
|---|---|---|
| Course Handicap formula | index × (slope ÷ 113) + (course rating − par); 12.4 → 14 (blues, 131/71.8) and 11 (whites, 122/69.6), par 72 | `/blog/index-vs-course-handicap` |
| Stroke allocation | One stroke on stroke index 1–14 for a 14; above 18, strokes double up from the hardest | same post; `/games/scramble` glossary |
| Playing handicap | "Course handicap × format allowance"; four-ball match play commonly 90%, individual match play 100% | same post (cites RoH Appendix C; recheck at #160) |
| Net double bogey | "the standard maximum for posting purposes"; FAQ `q-pickup`: "usually net double bogey (the handicap system's cap) or double par" | post; FAQ |
| Handicap Index | best 8 of the last 20 differentials, revised daily | post (recheck at #160) |
| Press | "A new side match opened mid-nine by the player who's behind, covering only the holes that remain"; post: "a new match, same amount, only the holes remaining, called by the side that is down" | `/games/nassau` glossary; `/blog/pressing` |
| GoLo and presses | "The app does not do automatic presses yet, and its Nassau takes none" | `/blog/pressing`; registry `overall-match-presses` |
| Carryover | "A skin nobody won. It rolls onto the next hole" | `/games/skins` glossary |
| Greenie | "Closest to the pin on a par 3, on in one, par or better to win" | `/games/closest-to-pin` glossary; roster `rule` |
| Dormie, All Square, Halve | as defined | `/games/nassau` glossary |
| Birdie, Eagle, Net birdie, Barkie | "One under par"; "Two under par, usually worth double"; "A par on a hole where your handicap gives you a stroke"; "Par or better after hitting a tree" | `/games/birdies` glossary |
| Texas scramble, Shamble | drive minimum; best drive then own ball | `/games/scramble` glossary |
| Quota | "A Stableford variant that scores points against a target" | `/games/best-score` glossary |
| Best ball (informal) | "The team's better score on the hole, not a total" | `/games/wolf` glossary; consistent with the Four-Ball alias |

**Conflicts.** These are in existing pages, not in the glossary. They're recorded here, and an issue is needed for each, but this session wasn't authorised to file one:

1. **Wolf tee order.** *Resolved: GoLo's Wolf tees off last (owner, 2026-10-29); the post is fixed in #174 / PR #175.* The guide says "The Wolf tees off last" (`lib/content/gameDetail.ts` lines 557, 560, 623). The post says "The wolf tees off first" (`lib/content/blog.ts` lines 373, 381, 387). Both are real house-rule variants, but the site states each as the rule. The glossary entry will say the order varies and link the guide. Fixing the guide/post pair needs an owner call on which one GoLo's Wolf follows.
2. **Validation (skins).** *Owner, 2026-10-29: the app has no validation rules, so any glossary Validation record (S11) is education only.* The guide glossary says carried skins "only count on a birdie or better" (`gameDetail.ts` line 436). The guide's own step 4 and variations card (lines 379, 423) and the post (`blog.ts` line 350) say birdie-to-win **or** a par minimum, or a two-putt rule. The glossary has no MVP Validation record. If one is added (see Q1's recommended replacements), it uses the broader wording.
3. **Push vs halve.** *Filed as #178.* The skins guide glossary has one entry, "Push / halve". The glossary keeps them as two records: **Push** is the side-game outcome of a tie (nothing changes hands, or the skin carries), **Halve** is the Rules' match-play result. That's compatible, but the next edit to the skins guide could split its entry the same way.
4. **Overclaim, outside the glossary.** *Confirmed by the owner; fixed in #176 / PR #177.* The skins guide CTA says GoLo "tracks every carry, every validation" (`gameDetail.ts` line 419). No capability records validation rules. Added to the #154 checklist.

## Search evidence

Spec §7.1 tiers are strategic fit, not volume. The only first-party query data available on October 28, 2026:

- **Search Console baseline, October 8, 2026** (`docs/seo-progress.md`; property `sc-domain:golo.golf`, last 3 months, data through October 5; production was then still running the August 25 build). Glossary-relevant queries among the top ten by impressions: *nassau golf bet* (14 impressions, position 40.8), *what is a nassau in golf* (10, 73.2), *nassau golf game* (8, 41.6), *nassau golf format* (8, 61.0), *golf nassau bet* (7), *what is a nassau bet in golf* (5). All Nassau-definition intent; the canonical owner is `/games/nassau` (see `canonical-map.md` on #78). *mongolian reversal* (6) is real match-play slang, but #78's prep found no first-party angle, so it is not added to the inventory.
- **#65's revalidation run** is due between October 22 and November 5 and had not been recorded as of this file. When it lands, add its glossary-relevant queries here with their date range. Don't change any tier on them before #78 reads them.

Nothing else was used to rank or select terms. No keyword-tool volumes.

## Owner decisions (October 29, 2026)

- **Q1.** Category label "Side games". For M8, Side Pot, Stakes and Payout are replaced by Point Value, Validation and Net Skins (S10–S12). No `vocab-ok` exceptions.
- **Q2.** No "press bet" alias.
- **Q3.** GoLo's Wolf tees off last; the guide is right and the post is fixed (#174). The glossary's Wolf entry still says the order varies between groups and links the guide.
- **Q4.** S1–S9 and M1–M6 accepted as the M8 backlog.
- **Q5.** Review roles as proposed (recorded October 29 in `editorial-review.md`).
- **Junk (#154 Q-a, #172).** No junk board in the app. Junk, Greenie, Sandy and the M8 junk terms carry no GoLo note.

The original questions follow, for the record.

## Open questions for the owner

Ordered by what they block. Each has a recommendation.

**Q1. The vocabulary rule vs betting terms.** `scripts/check-content.mjs` fails "gambl*", "wager*", "stake(s)", "odds", "bet(s)", "betting", "pot(s)", "pool(s)", "payout(s)", "cash" and more anywhere in site copy (SIDE-GAME-POSITION §3 in soleman23/golo: "GoLo is a scoreboard, not a betting app"). The spec's category name "Side games and friendly wagers", its Press draft ("A new wager or match…"), the aliases "press bet" and "pressing a bet", and three expansion term names (**Side Pot**, **Stakes**, **Payout**) all fail it. This wasn't in the epic's reconciliation.
- **For M7: no decision needed.** The 56 MVP names pass; definitions are written to the rule ("amount", "match", "what each player plays for", as the guides already do); the category label is "Side games".
- **For M8:** *Recommended:* replace the three blocked names with records already in the site's vocabulary: **Point Value** (Wolf and Bingo Bango Bongo guides), **Validation** (skins guide and post), **Net Skins** (skins guide). The alternative is a reviewed `vocab-ok:` exception for those three term names only, defined as golf vocabulary with no GoLo connection.

**Q2. "press bet" as a search-only alias.** People do search that way (the Nassau queries above say "bet"). An alias appears in no visible copy, but it's a string in `lib/content` and ships in the client search index. *Recommended: no.* Keep the vocabulary rule whole; a search for "press bet" still reaches Press through the partial-name tier.

**Q3. Wolf tee order** (conflict 1 above). Which order does GoLo's own Wolf follow? The glossary doesn't need the answer, but the guide and post should agree.

**Q4. Accept the revisions table** (S1–S9, M1–M6) as the M8 backlog, or name changes.

**Q5. Reviewer roles.** **Decided October 29, 2026 (owner):** the owner signs the rules fact-check, the GoLo product audit and approval; an agent prepares the SEO/canonical review and the owner confirms it.
