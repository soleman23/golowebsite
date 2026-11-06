# Rules Center inventory

The editorial source of truth for the Golf Rules Center: the 25 rule overviews and the 12 common situations, with their stable ids, categories, aliases, rule references, required caveats and glossary links. Issue #231 (RULES-001); spec `docs/rules/product-spec.md` §4, §5 and Amendments; tracking epic #230.

**Status of this file:** prepared November 6, 2026 against `main` at 108174f. It is a research document, not an approval. Rule titles were checked against the R&A index that day; everything else is a proposal until the owner signs off on #231.

## Totals

| Category | id | Rules | Overviews | Situations |
|---|---|---|---:|---:|
| Foundations and equipment | `foundations` | 1–4 | 4 | 1 |
| Playing the round | `playing` | 5–11 | 7 | 1 |
| Course areas and procedures | `course-areas` | 12–16 | 5 | 5 |
| Relief and penalties | `relief` | 17–19 | 3 | 5 |
| Rulings, formats and accessibility | `formats` | 20–25 | 6 | 0 |
| **Total** | | | **25** | **12** |

The content batches map as: #237 Rules 1–11 (11), #238 Rules 12–19 (8), #239 Rules 20–25 (6), #240 seven P0 situations, #241 five P1 situations. 11 + 8 + 6 = 25; 7 + 5 = 12.

## Conventions

- **id** is internal and never changes once a record exists. For overviews it is `rule-N` and doubles as the fragment (`/rules#rule-18`). For situations, `id === slug` at creation; the slug is the fragment (`/rules#lost-ball`) and the path segment if #249 ever approves a standalone page.
- Ids are lower-case ASCII, words joined by `-`. No situation slug may look like `rule-N` or match a category id. Reserved page ids are listed under [Reserved ids](#reserved-ids).
- **Category** is the overview's group, from the spec's taxonomy. A situation takes the category of its primary rule, so a topic filter shows a situation next to the rule that governs it.
- **Title** is the R&A label, verbatim (A11). It's a navigation reference, not quoted rule text.
- **Aliases** are what a player types: slang, old names and course markings. They're normalised the way search normalises (case, punctuation, accents, apostrophes). Aliases never become records, pages or sitemap entries.
- **Glossary** lists published glossary slugs only (A13). A link that needs an unpublished term waits for #168.
- **Rule refs** use R&A numbering. `docs/rules/source-map.md` holds the URL and anchor for each.

## Categories

| id | Label | Chip | Rules |
|---|---|---|---|
| `foundations` | Foundations and equipment | Foundations | 1–4 |
| `playing` | Playing the round | Playing | 5–11 |
| `course-areas` | Course areas and procedures | Course areas | 12–16 |
| `relief` | Relief and penalties | Relief | 17–19 |
| `formats` | Rulings, formats and accessibility | Formats | 20–25 |

## Rule overviews

Titles checked against https://www.randa.org/en/rog/the-rules-of-golf on November 6, 2026.

| N | id | Title (R&A) | Category | Glossary | Situations | Batch |
|---:|---|---|---|---|---|---|
| 1 | `rule-1` | The Game, Player Conduct and the Rules | foundations | `mulligan`, `breakfast-ball` | | #237 |
| 2 | `rule-2` | The Course | foundations | `teeing-area`, `fairway`, `rough`, `bunker`, `penalty-area` | | #237 |
| 3 | `rule-3` | The Competition | foundations | `match-play`, `stroke-play`, `gimme`, `net-score`, `handicap-stroke` | `conceded-putt` | #237 |
| 4 | `rule-4` | The Player's Equipment | foundations | `driver`, `putter` | | #237 |
| 5 | `rule-5` | Playing the Round | playing | | | #237 |
| 6 | `rule-6` | Playing a Hole | playing | `teeing-area` | | #237 |
| 7 | `rule-7` | Ball Search: Finding and Identifying Ball | playing | | `lost-ball` (related) | #237 |
| 8 | `rule-8` | Course Played as It Is Found | playing | | | #237 |
| 9 | `rule-9` | Ball Played as It Lies; Ball at Rest Lifted or Moved | playing | | `ball-moved` | #237 |
| 10 | `rule-10` | Preparing for and Making a Stroke; Advice and Help; Caddies | playing | | | #237 |
| 11 | `rule-11` | Ball in Motion Accidentally Hits Person, Animal or Object; Deliberate Actions to Affect Ball in Motion | playing | | | #237 |
| 12 | `rule-12` | Bunkers | course-areas | `bunker`, `sandy` | `bunker-sand` | #238 |
| 13 | `rule-13` | Putting Greens | course-areas | `putt` | `repairing-the-green` | #238 |
| 14 | `rule-14` | Procedures for Ball: Marking, Lifting and Cleaning; Replacing on Spot; Dropping in Relief Area; Playing from Wrong Place | course-areas | | `mark-lift-clean` | #238 |
| 15 | `rule-15` | Relief from Loose Impediments and Movable Obstructions (Including Ball or Ball-Marker Helping or Interfering with Play) | course-areas | | | #238 |
| 16 | `rule-16` | Relief from Abnormal Course Conditions (Including Immovable Obstructions), Dangerous Animal Condition, Embedded Ball | course-areas | | `cart-path`, `temporary-water` | #238 |
| 17 | `rule-17` | Penalty Areas | relief | `penalty-area` | `red-vs-yellow-penalty-areas` | #238 |
| 18 | `rule-18` | Stroke-and-Distance Relief, Ball Lost or Out of Bounds, Provisional Ball | relief | `mulligan` | `lost-ball`, `provisional-ball`, `out-of-bounds` | #238 |
| 19 | `rule-19` | Unplayable Ball | relief | `bunker` | `unplayable-ball` | #238 |
| 20 | `rule-20` | Resolving Rules Issues During Round; Rulings by Referee and Committee | formats | | | #239 |
| 21 | `rule-21` | Other Forms of Individual Stroke Play and Match Play | formats | `stableford`, `scramble` | | #239 |
| 22 | `rule-22` | Foursomes (Also Known as Alternate Shot) | formats | `foursomes` | | #239 |
| 23 | `rule-23` | Four-Ball | formats | `four-ball`, `best-score` | | #239 |
| 24 | `rule-24` | Team Competitions | formats | | | #239 |
| 25 | `rule-25` | Modifications for Players with Disabilities | formats | | | #239 |

Notes for the writers:

- **Rule 1** links `mulligan` and `breakfast-ball` only to say plainly that neither exists in the Rules. The glossary already explains the handicap-posting side (Rules of Handicapping 2.1b); the overview doesn't repeat it.
- **Rule 21** links `scramble` because Rule 21.5 is where other forms of play are pointed. The overview must not suggest the Rules of Golf define a scramble.
- **Rule 23** links `best-score` only if its glossary entry still distinguishes best ball from Four-Ball when #239 is drafted.
- **Rule 25** is written plainly and respectfully, with no humour (A5).

## Common situations

| P | id / slug | Question (working) | Rule refs | Category | Required caveats | Glossary | Batch |
|---|---|---|---|---|---|---|---|
| P0 | `lost-ball` | Lost ball: what happens next? | 18.2a, 18.2b, 7.1, 7.2; Definitions: Lost, Known or Virtually Certain | relief | Three-minute search; known or virtually certain exceptions (17.1c, 16.1e, 9.6); stroke and distance; MLR E-5 only if adopted | | #240 |
| P0 | `provisional-ball` | When may I play a provisional ball? | 18.3a, 18.3b, 18.3c; Definitions: Provisional Ball | relief | Must be announced; not for a ball that could only be in a penalty area | | #240 |
| P0 | `out-of-bounds` | Ball out of bounds: can I drop near the fairway? | 18.2b; Definitions: Out of Bounds; MLR E-5 | relief | E-5 applies only where the Committee adopted it, never as the default | | #240 |
| P0 | `red-vs-yellow-penalty-areas` | Red vs yellow penalty areas | 17.1a, 17.1b, 17.1c, 17.1d; Definitions: Penalty Area | relief | Where the ball last crossed the edge; lateral relief is red only; the Committee can mark all areas red | `penalty-area` | #240 |
| P0 | `unplayable-ball` | Unplayable ball in the rough or a bunker | 19.1, 19.2, 19.3a, 19.3b | relief | Options differ by where the ball is; the extra bunker option costs two strokes; not available in a penalty area | `bunker` | #240 |
| P0 | `bunker-sand` | Can I touch the sand in a bunker? | 12.2a, 12.2b, 12.3 | course-areas | Which touches are penalised, when, and the exceptions | `bunker` | #240 |
| P0 | `cart-path` | Ball against a cart path | 16.1a, 16.1b, 14.3; Definitions: Immovable Obstruction, Nearest Point of Complete Relief, Relief Area | course-areas | Relief needs real interference; the Committee can make paths integral; not from a penalty area | | #240 |
| P1 | `temporary-water` | Temporary water or ground under repair | 16.1a–16.1e; Definitions: Abnormal Course Condition, Temporary Water, Ground Under Repair | course-areas | Actual conditions and Committee markings; relief differs in a bunker and on the green | | #241 |
| P1 | `ball-moved` | My ball moved after it stopped | 9.2, 9.3, 9.4, 9.5, 9.6; Definitions: Moved | playing | Who or what caused it decides replace or play; match play differs for an opponent | | #241 |
| P1 | `mark-lift-clean` | When can I mark, lift and clean my ball? | 14.1a, 14.1b, 14.1c, 14.2, 13.1b | course-areas | Where the ball lies and why it's lifted; preferred lies are MLR E-3, only if adopted | | #241 |
| P1 | `repairing-the-green` | Can I repair damage on the putting green? | 13.1c; Definitions: Putting Green | course-areas | What counts as damage, and what doesn't (natural surface imperfections) | `putt` | #241 |
| P1 | `conceded-putt` | Does a conceded putt count? | 3.2b, 3.3c; Rules of Handicapping 3.3 | foundations | Concessions exist in match play only; stroke play holes out; casual gimmes and handicap posting are a separate source (RoH) | `gimme`, `match-play`, `stroke-play` | #241 |

### Aliases

| Situation | Aliases |
|---|---|
| `lost-ball` | lost ball, can't find my ball, ball not found, three minutes, search time |
| `provisional-ball` | provisional, reload, hit another one, play a provisional |
| `out-of-bounds` | OB, out of bounds, white stakes, white line, boundary, E-5, drop near the fairway, two-stroke drop |
| `red-vs-yellow-penalty-areas` | water hazard, lateral hazard, red stakes, yellow stakes, red line, yellow line, pond, creek, lake |
| `unplayable-ball` | unplayable, unplayable lie, declare it unplayable, in a bush, tree roots |
| `bunker-sand` | sand trap, trap, ground the club, practice swing in a bunker, rake |
| `cart-path` | cart path, path, sprinkler head, immovable obstruction, free drop, free relief, nearest point of relief |
| `temporary-water` | casual water, puddle, GUR, ground under repair, white circle, standing water, abnormal course condition |
| `ball-moved` | ball moved, ball moved at address, wind moved my ball, accidentally moved my ball |
| `mark-lift-clean` | mark my ball, clean my ball, lift and clean, preferred lies, lift clean and place, winter rules |
| `repairing-the-green` | ball mark, pitch mark, spike mark, repair the green, fix a ball mark |
| `conceded-putt` | gimme, concede, conceded putt, that's good, inside the leather |

### Term aliases for the search map

These point a query at a rule overview, not a situation (#233 §Search):

| Query | Goes to | Why |
|---|---|---|
| plugged ball, embedded ball | `rule-16` | Embedded ball is Rule 16.3; no MVP situation |
| water hazard | `rule-17` | Renamed penalty area in 2019 |
| casual water | `rule-16` | Now temporary water |
| breakfast ball, mulligan | `rule-1`, `rule-18` | House-rule context only; the answer says the Rules have no such thing |
| 14 clubs, club limit | `rule-4` | Rule 4.1b |
| advice | `rule-10` | Rule 10.2 |
| flagstick | `rule-13` | Rule 13.2 |
| wrong ball | `rule-6` | Rule 6.3c |
| wrong green | `rule-13` | Relief is in Rule 13.1f |
| wrong place | `rule-14` | Rule 14.7 |

## Expansion candidates (not MVP)

From spec §5, for #249 or later batches: embedded ball (16.3), wrong ball (6.3c), teeing outside the markers (6.1b), the 14-club limit (4.1b), advice (10.2), order of play in match play (6.4a), dangerous animal condition (16.2), movable vs immovable obstruction (15.2, 16.1), wrong green (13.1f), playing from a wrong place (14.7), the flagstick (13.2), preferred lies (MLR E-3), Rule 25 contexts, and handicap posting with Local Rules (Rules of Handicapping).

## Reserved ids

Page-level ids that no record may take: `rules-search`, `rules-results`, `rules-controls`, `rules-numbers`, `quick-situations`, `situations`, `all-rules`, `official-sources`, `related`, and the category section ids `cat-foundations`, `cat-playing`, `cat-course-areas`, `cat-relief`, `cat-formats`. `validateRules` (#233) enforces this.

## Search evidence

Observed Search Console data only. The site's Search Console exports (September and October 2026, `~/gsc/`) were grepped for rules language on November 6, 2026.

- Every "rules" query is a game-format query: "nassau rules golf" (3 impressions in October, position 31), "bingo bango bongo rules" (3), "skins golf rules", "wolf golf game rules" and similar (1 each). `/games/*` owns these (`canonical-map.md`). They are not demand for `/rules`.
- Rules of Golf queries: "blue stakes in golf" (1 impression, September, position 71) and "golfer's sand-filled hazard" (2, September, position 82, a crossword clue).

Conclusion: the site shows no measurable Rules of Golf demand yet. The hub is justified on usefulness to people already on the site (glossary and game-guide readers mid-round) and on topical fit, not on observed queries. A fresh export would add five days of November data to a property with 529 October impressions in total; it was not run, and #248's first checkpoint takes the baseline instead.
