# Rules Center review packet: common situations

The review record for the 12 common situations in `lib/content/rules/scenarios.ts`: batch 1 (#240, the seven P0) and batch 2 (#241, the five P1). Process and standards: `docs/rules/editorial-review.md`. Citations expected per situation: `docs/rules/source-map.md` § Citations by situation. Tracking: #230.

For each situation: every factual sentence mapped to the anchor that supports it, the reviewer agents' findings and how each was resolved, the copy-distance result and the owner's approval line.

## How this batch was checked

- **Sources.** Every cited rule page, Definition and Model Local Rule was opened on the date in the record's `checkedOn`. R&A rule pages were fetched with curl (the rule text is server-rendered under subrule ids such as `18_2b`). The Definitions page and Committee Procedures Section 8 render their text from the page's `__NEXT_DATA__` JSON, which was read directly: the Definition bodies, and the full text and Purpose of Model Local Rules E-5 and E-3 in section 8E. The Rules of Handicapping page (usga.org returns 403 to scripts) was read in a browser.
- **Reviewer A (stage `rules`).** An independent agent fetched the same sources itself and checked every sentence, penalty, stroke count and caveat against them, including each Definition the answer leans on.
- **Reviewer B (stages `product` and `seo`).** A second independent agent checked voice, `NEVER_WORDS`, the claim guard, Model Local Rule wording, links and fragments, and ran its own copy-distance script.
- **Copy distance.** Both sides normalised (lower case, straight apostrophes, hyphens to spaces, other punctuation dropped); any run of eight or more consecutive words shared with the fetched official text fails. Defined terms ("known or virtually certain", "nearest point of complete relief") are the main source of shorter shared runs and are allowed below eight words.
- **Questions.** `lost-ball` keeps the working title "Lost ball: what happens next?" and `ball-moved` keeps "My ball moved after it stopped": `scripts/test-rules.mjs` pins both strings, and this batch doesn't touch the tests. Both already read the way a player would type them.

## Batch 1 (#240): the seven P0 situations

**Drafted, reviewed and moved to `in-review`:** November 6, 2026. Every source below was opened that day (`checkedOn: 2026-11-06`).

**Copy distance, batch 1:** 0 runs of eight or more words shared with the official text, checked against Rules 3, 7, 9, 12, 13, 14, 16, 17, 18 and 19 (rule text and the Interpretations embedded in each page), the Definitions, and Committee Procedures Sections 2 and 8. 25 seven-word runs remain, almost all built on a defined term ("known or virtually certain to be in", "the nearest point of complete relief or", "within two club-lengths of the ball"). Reviewer B's own script found two eight-word runs in the draft, both from Interpretations my first corpus had missed. Both were reworded, and the corpus now includes the Interpretations.

**Open question for the owner (one):** `red-vs-yellow-penalty-areas` states that a Committee may mark every penalty area red. That's Committee Procedures Section 2C (https://www.randa.org/en/rog/committee-procedures/sections/2, read November 6, 2026), which `inventory.md` requires as a caveat. The content model has no source type for Committee Procedures outside Section 8 (Model Local Rules), so the sentence's source is recorded here rather than in the record's `sources`. Approving the batch accepts that; a `committee-procedures` source type would be a small follow-up to #233's model.

### lost-ball

Sources: 18.2a, 18.2b, 18.1, 7.1, 7.2, 17.1c, 16.1e, 9.6; Definitions: Lost, Known or Virtually Certain; MLR E-5.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | A ball you haven't found within three minutes … is lost: add one penalty stroke and play again … | 18.2a(1); 18.2b; Definitions: Lost |
| answer | The exception is when it's known or virtually certain what happened … penalty area or ground under repair, or … moved by an animal after it stopped | 18.2b Exception (17.1c, 16.1e, 9.6) |
| conditions[0] | The three minutes start when you or your caddie begin looking … team format | Definitions: Lost |
| conditions[0] | Time paused for a good reason … doesn't count | Definitions: Lost |
| conditions[1] | Saying it's lost doesn't make it lost | Definitions: Lost |
| conditions[1] | You don't have to search the full three minutes … the first ball is then out of play even if it turns up | 18.1 |
| conditions[2] | A ball found in time but not identified: a reasonable time to identify it; if you can't, it's lost | 18.2a(1); 7.2 |
| conditions[3] | Known or virtually certain means conclusive evidence … or 95 percent … only what you learn during the three minutes counts | Definitions: Known or Virtually Certain |
| options[0] | Stroke and distance: one penalty stroke, play again from the last stroke | 18.2b |
| options[1] | Known or virtually certain in a penalty area: penalty area relief | 17.1c |
| options[2] | Known or virtually certain in an abnormal course condition: free relief, crossing point as the ball's spot | 16.1e |
| options[3] | An outside influence moved it after it came to rest: no penalty, replace on the estimated spot | 9.6 |
| penalty | Stroke and distance: one penalty stroke … | 18.2b |
| example | Drive lost on the 7th: back to the tee, third shot | 18.2b (tee shot 1 + penalty 1, next stroke 3) |
| localRuleCaveat | E-5 if adopted: two strokes, drop between the estimated spot and the nearest point of fairway, no nearer the hole | MLR E-5 (Local Rule text) |
| localRuleCaveat | Meant for general play, not professional or elite amateur events | MLR E-5 (Purpose) |
| localRuleCaveat | A group agreeing to play it isn't the Committee adopting it | MLR E-5 ("may adopt"); Committee Procedures 8 |
| localRuleCaveat | Not after a provisional (only for the provisional itself), not for a ball known or virtually certain to be in a penalty area | MLR E-5 (Local Rule text) |

`7.1` stays in `sources` because `source-map.md` expects it for this situation; no sentence relies on it alone (Reviewer A noted this; harmless).

### provisional-ball

Sources: 18.3a, 18.3b, 18.3c; Definitions: Provisional Ball, Stroke and Distance.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Ball might be out of bounds or lost outside a penalty area: provisional allowed to save time, announced first | 18.3a; 18.3b; Definitions: Provisional Ball |
| answer | Only possible place is a penalty area: no provisional; the second ball is in play under stroke and distance | 18.3a |
| conditions[0] | Say the word provisional or something that plainly means it; "I'll hit another" or "reloading" doesn't count; that ball is then in play | 18.3b (and Interpretation 18.3b/1 for "reloading") |
| conditions[1] | Nobody close enough to hear: play it, tell someone when you can | 18.3b |
| conditions[2] | Could be in a penalty area but could also be lost elsewhere or out of bounds: still allowed | 18.3a |
| conditions[3] | Stays provisional while played from no nearer the hole than the original's estimated spot | 18.3c(1) |
| options[0] | Original found outside a penalty area within three minutes, provisional not yet in play: play the original; provisional strokes don't count | 18.3c(3) |
| options[1] | Original out of bounds or lost outside a penalty area: provisional in play under stroke and distance | 18.3c(2) |
| options[1] | Known or virtually certain in an abnormal course condition or moved by an outside influence: that Rule's relief instead | 18.3c(2) Exception |
| options[2] | Provisional played from nearer the hole than the original's estimated spot: it's in play even if the original is found | 18.3c(2) |
| options[3] | Original in a penalty area (found, or known or virtually certain), provisional not yet in play: abandon it; play the original or take penalty area relief | 18.3c(3) |
| penalty | Under stroke and distance: original stroke, one penalty stroke, every provisional stroke | 18.3c(2); Definitions: Stroke and Distance |
| example | 12th: provisional announced, original not found, next shot is the fourth | 18.3c(2) (tee 1 + penalty 1 + provisional 1) |

### out-of-bounds

Sources: 18.2a, 18.2b; Definitions: Out of Bounds, Boundary Object; MLR E-5.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Not under the standard Rules: one penalty stroke, play again from the last stroke | 18.2b |
| answer | Drop near the fairway for two strokes only where the Committee adopted E-5 | MLR E-5 |
| conditions[0] | Out only when the whole ball is beyond the boundary edge; any part on the course side is in | 18.2a(2) |
| conditions[1] | White stakes or fence: edge is the line joining their course-side faces at ground level; stakes and posts are out. Painted line: the line is out | Definitions: Out of Bounds |
| conditions[2] | White stakes and boundary fences are boundary objects: treated as fixed, no free relief | Definitions: Boundary Object |
| conditions[3] | You may stand out of bounds to play a ball that's in | 18.2a(2) |
| options[0] | Stroke and distance | 18.2b |
| options[1] | E-5, only if adopted: two strokes, drop between where it last crossed the boundary and the nearest point of fairway, no nearer the hole | MLR E-5 |
| penalty | One penalty stroke (18.2b); E-5's drop costs two | 18.2b; MLR E-5 |
| example | 3rd: second drive is the third stroke; with E-5, a drop and the fourth stroke | 18.2b; MLR E-5 (drive 1 + 2 penalty) |
| localRuleCaveat | General play, casual rounds and a club's own competitions; not in force unless adopted; not professional or elite amateur events | MLR E-5 (Purpose) |
| localRuleCaveat | Not after a provisional (only for the provisional itself); not for a ball known or virtually certain to be in a penalty area | MLR E-5 (Local Rule text) |

### red-vs-yellow-penalty-areas

Sources: 17.1a, 17.1b, 17.1c, 17.1d, 17.1e; Definitions: Penalty Area. Off-record: Committee Procedures 2C (see the open question above).

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Either color: play as it lies free, or relief outside for one stroke | 17.1b; 17.1d |
| answer | Yellow: stroke and distance or back on the line | 17.1d(1), (2); Definitions: Penalty Area |
| answer | Red adds lateral relief: two club-lengths from where it last crossed the edge, no nearer the hole | 17.1d(3) |
| conditions[0] | In the penalty area if any part touches inside the edge or is above it; stakes and painted lines are part of it | 17.1a; Definitions: Penalty Area |
| conditions[1] | Back-on-the-line and lateral relief measured from where it last crossed the edge | 17.1d(2), (3) |
| conditions[2] | Not found: must be known or virtually certain (conclusive evidence or 95 percent); otherwise lost after three minutes, stroke and distance | 17.1c; Definitions: Known or Virtually Certain |
| conditions[3] | The Committee doesn't have to use yellow and can mark every area red | Committee Procedures 2C |
| conditions[3] | Unmarked color counts as red | Definitions: Penalty Area |
| conditions[3] | The color that matters is where the ball last crossed | 17.1d(3); Committee Procedures 2C (part red, part yellow) |
| options[0] | Play as it lies, no penalty, general-area Rules apply | 17.1b |
| options[0] | Not allowed when the ball lies in a no play zone or one interferes with stance or swing; relief required | 17.1b Exception; 17.1e |
| options[1] | Stroke and distance, one stroke | 17.1d(1) |
| options[2] | Back on the line: outside the area, as far back as you like, one club-length from where it lands, same area of the course, no nearer than the crossing point | 17.1d(2); Definitions: Relief Area |
| options[3] | Lateral, red only: two club-lengths, no nearer the hole, outside that penalty area; same area of the course it first lands in when the space spans more than one | 17.1d(3) |
| penalty | One stroke for any relief option; as it lies is free | 17.1d; 17.1b |
| example | 14th: last crossed on the green side; lateral drop there; fourth stroke | 17.1d(3) (2 strokes + 1 penalty) |

### unplayable-ball

Sources: 19.1, 19.2, 19.3a, 19.3b.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Anywhere except a penalty area; only you decide | 19.1 |
| answer | Each option one stroke: stroke and distance, back on the line, two club-lengths | 19.2 (19.2a–c) |
| answer | In a bunker those drops stay in the bunker, unless two strokes in total to go back outside | 19.3a; 19.3b |
| conditions[0] | Not in a penalty area: only Rule 17 relief | 19.1 |
| conditions[1] | Back on the line and lateral need the ball's spot; stroke and distance doesn't | 19.2 |
| conditions[2] | Ball in a tree: measure from the spot on the ground beneath it | 19.2c |
| conditions[3] | In a bunker the one-stroke drops come to rest in the bunker | 19.3a |
| options[0]–[2] | Stroke and distance; back on the line with its relief-area limits; lateral two club-lengths, no nearer the hole, same area of the course it first lands in when the space spans more than one | 19.2a, 19.2b, 19.2c |
| options[3] | Bunker only: two strokes, back on the line outside | 19.3b |
| penalty | One stroke, or two in total outside a bunker | 19.2; 19.3a; 19.3b |
| example | 9th: in the sand under the lip; lateral in the bunker one stroke, back on the line outside two | 19.3a; 19.3b; Definitions: Bunker (the lip isn't part of it) |

### bunker-sand

Sources: 12.2a, 12.2b, 12.3; Definitions: Bunker, Loose Impediment.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Club can't touch sand right in front of or behind the ball, or on a practice swing or backswing | 12.2b(1) |
| answer | No touching the sand on purpose, with anything, to test it | 12.2b(1) |
| answer | Allowed: feet, leaning on a club, laying clubs or rake down, smoothing for course care, searching, removing loose impediments or movable obstructions | 12.2b(1) exceptions; 12.2b(2); 12.2a |
| conditions[0] | The limits apply before a stroke at a ball in the bunker | 12.2b(1) |
| conditions[1] | Lip, face, spilled sand, natural sand and waste areas aren't the bunker unless the Committee defines one as a bunker | Definitions: Bunker |
| conditions[2] | An allowed touch that improves the conditions affecting the stroke beyond what the Rules allow: general penalty; digging in for a stance is fine | 12.2b(2) |
| conditions[3] | Ball out, or relief outside taken or intended: touch and smooth freely; back in, limits return | 12.2b(3) |
| conditions[4] | Bunker relief is its own: 16.1c and 19.3 | 12.3 |
| penalty | General penalty | 12.2 (Penalty for Breach of Rule 12.2); Definitions: General Penalty |
| example | 5th: rake down and feet in fine; practice swing touching the sand two strokes in stroke play | 12.2b(1), (2) |

### cart-path

Sources: 16.1a, 16.1b, 16.1c, 16.1d, 14.3; Definitions: Immovable Obstruction, Nearest Point of Complete Relief, Relief Area, Obstruction, Integral Object.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | An artificially surfaced cart path is an immovable obstruction; free relief when the ball is on it or it interferes with stance or swing | Definitions: Obstruction, Immovable Obstruction, Abnormal Course Condition (via 16.1); 16.1a(1) |
| answer | From the general area: nearest point of complete relief, one club-length, no nearer the hole, general area | 16.1b |
| conditions[0] | Artificial surface; sprinkler heads too; integral object means no free relief | Definitions: Obstruction, Integral Object |
| conditions[1] | Interference: ball, stance, swing; line of play only on the putting green; distraction never; no relief when clearly unreasonable | 16.1a(1), (3) |
| conditions[2] | General area only; bunker and green differ; no free relief in a penalty area | 16.1a(2); 16.1c; 16.1d |
| conditions[3] | Nearest point of complete relief: closest spot in the general area, no nearer the hole, with your club, stance, swing and line of play; may be in a bush | Definitions: Nearest Point of Complete Relief; 16.1b |
| conditions[4] | Relief area one club-length, no nearer the hole, general area; drop from knee height; complete relief; two drops then place | 16.1b; Definitions: Relief Area; 14.3b; 14.3c |
| options[0]–[1] | Play it as it lies, or take relief | 16.1b ("may take free relief") |
| penalty | Relief free; playing from outside the relief area is the general penalty | 16.1 (Penalty for Playing Ball from a Wrong Place in Breach of Rule 16.1) |
| example | 11th: nearest spot off the path, one club-length with your longest club other than the putter, drop from knee height | 16.1b; 14.3b; Definitions: Club-Length |

### Findings and resolutions, batch 1

Reviewer A (rules): 21 findings, none blockers, four majors. Reviewer B (product, seo): 20 findings, two blockers (both copy distance), three majors. All seven records were judged accurate after fixes.

| # | Record · field | Finding | Resolution |
|---|---|---|---|
| A1 (major) | lost-ball · options[3], answer | Rule 9.6 covers a ball at rest; a ball taken in motion isn't covered | Fixed: "after it came to rest on the course"; answer "after it stopped" |
| A2 | lost-ball · conditions[1] | "Only the three-minute limit" overstated; 18.1 allows stroke and distance any time | Fixed; `18.1` added to sources |
| A3 | lost-ball · options[2] | Relief isn't measured from the crossing point; the crossing point is the ball's spot for finding the nearest point of complete relief | Fixed |
| A4 | out-of-bounds · options[1]; E-5 caveats | "last crossed"; E-5 still available for the provisional itself | Fixed, both caveats |
| A5 | provisional-ball · options[0], [3] | 18.3c(3) applies only before the provisional is in play; "as it lies" needs the ball found | Fixed |
| A6 | provisional-ball · options[1] | 18.3c(2) Exception missing | Fixed |
| A7 | provisional-ball · penalty | Left out the stroke with the original | Fixed |
| A8 | out-of-bounds · example | Abbreviated E-5; "that drive" ambiguous; stroke and distance stays available under E-5 | Fixed |
| A9 | out-of-bounds · conditions[2] | Boundary objects are "treated as immovable", not unmovable | Fixed, from the Definition |
| A10 (major) | red-vs-yellow · conditions | Required caveat "the Committee can mark all areas red" missing | Fixed; source is Committee Procedures 2C (open question above) |
| A11 | red-vs-yellow · conditions[2] | Evidence standard, not the player's feeling; lost only when three minutes pass | Fixed |
| A12 | red-vs-yellow · options[2] | Missing: drop outside the penalty area; same area of the course | Fixed |
| A13 | red-vs-yellow · example | "Fourth" needs the approach to be the second shot | Fixed: "your second shot, a 7-iron" |
| A14 | unplayable-ball · options[1] | 19.2b relief-area limits missing | Fixed |
| A15 | unplayable-ball · conditions[3], example | "One penalty stroke" to avoid contradicting 19.3b; the lip isn't part of the bunker | Fixed: "in the sand under the steep front lip" |
| A16 | bunker-sand · conditions[2] | Read as penalising any improvement; 12.2b(2) penalises only a breach of 8.1a | Fixed |
| A17 | bunker-sand · answer | Search and movable obstructions are also exceptions | Fixed |
| A18 (major) | cart-path · conditions[1] | Read as if distraction counts on the green | Fixed |
| A19 (major) | cart-path · conditions[3] | The point must be in the general area; line of play is part of the estimate | Fixed |
| A20 | cart-path · answer, options[1] | 16.1b is general-area only | Fixed: new condition; `16.1c`, `16.1d` added |
| A21 | cart-path · example | A club-length is the longest club other than the putter | Fixed |
| A, optional | provisional-ball | Model Local Rule B-5 (provisional for a penalty area) | Not added: not in `source-map.md` for this situation; a candidate for a later recheck |
| B1 (blocker) | lost-ball · answer | 8-word run from an Interpretation | Fixed |
| B2 (blocker) | cart-path · conditions[3] | 8-word run from an Interpretation | Fixed |
| B3 (major) | cart-path · conditions[4], penalty | "Relief area" never explained; `/rules#cart-path` owns the term until #168 | Fixed: defined in conditions[4]; alias "relief area" added |
| B4 (major) | bunker-sand · answer | Three separate bans read as one | Fixed |
| B5 (major) | red-vs-yellow · conditions | Required caveat (as A10) | Fixed; conditions[0] and [1] merged to stay at five or fewer |
| B6 | lost-ball · answer | "another way to carry on" vague | Fixed |
| B7 | lost-ball · conditions[0] | "partner" and "pause" unclear | Fixed |
| B8 | several | "Known or virtually certain" unexplained outside lost-ball | Fixed in red-vs-yellow (where it decides the outcome). Not repeated in provisional-ball options[3] or the out-of-bounds caveat: those use it as a condition, and repeating the definition in every field adds length without changing the answer. Owner may overrule |
| B9 | provisional-ball · conditions[0] | "make it just as clear" vague | Fixed |
| B10 | provisional-ball · options[3] | Can't play an unfound ball as it lies | Fixed (as A5) |
| B11 | provisional-ball · penalty | Stroke count unclear | Fixed (as A7) |
| B12 | out-of-bounds · example | Abbreviated E-5; ambiguous drive | Fixed (as A8) |
| B13 | out-of-bounds · caveat | A group might think it can adopt E-5 by agreement | Fixed, both E-5 caveats |
| B14 | lost-ball · caveat | Two E-5 caveats didn't match | Aligned |
| B15 | unplayable-ball · conditions[1] | Tense and "never" | Fixed |
| B16 | bunker-sand · conditions[4] | Cross-reference read as boilerplate | Fixed |
| B17 | cart-path · aliases | "sprinkler head" not in the copy; where "free drop" and "free relief" live | Sprinkler head added to conditions[0]. "free drop" and "free relief" stay on cart-path; temporary-water (#241) doesn't take them |
| B18 | red-vs-yellow · example | Stroke number (as A13) | Fixed |
| B19 | spelling | "colour", "penalised": site copy is US | Fixed |
| B20 | unplayable-ball · links | Published glossary slug `rough` | Added |
| B, to A | bunker-sand · conditions[1]; cart-path "paved"; lost-ball 18.1 | Waste-area wording; paved vs artificial surface; searching isn't required | Waste areas reworded to the Definition; answer now says "artificial surface"; 18.1 added (A2) |

Codex (PR #256, review of 5c1f0d8), after the owner's approval:

| # | Record · field | Finding | Resolution |
|---|---|---|---|
| C1 (P2) | red-vs-yellow · options[3]; unplayable-ball · options[2] | Lateral relief also requires the ball to finish in the area of the course it first touched, when the relief area spans more than one (17.1d(3), 19.2c) | Fixed in both |
| C2 (P2) | red-vs-yellow · options[0] | A ball in a no play zone, or one interfering with stance or swing, can't be played as it lies (17.1b Exception, 17.1e) | Fixed; `17.1e` added to sources (anchor in `source-map.md`) |

Checks both reviewers passed: no GoLo claims; `NEVER_WORDS` clean (every "stakes" follows white, red or yellow); E-5 conditional everywhere; fragments match `canonical-map.md`; glossary slugs `penalty-area`, `bunker`, `rough` published; no related content paths (no served page owns these intents); answers one to three sentences; two to five conditions; examples use hole numbers and clubs, no money; `npm run lint:content` passes.

### Approval, batch 1

**Approved by the owner in chat on November 6, 2026** ("Approve batch 1"), on this packet as written. The approval covers all seven records and accepts the off-record Committee Procedures 2C source for `red-vs-yellow-penalty-areas`. The records are `approved` with `reviewedOn: 2026-11-06`, `reviewedBy: "owner"` and a review log of rules, product and seo by "agent" and approval by "owner" (`P0_APPROVED` in `scenarios.ts`). Not published at approval: `rulesLive` was false and only #247 published. (Published 2026-11-07 by #269, `f27675b`.)

**Post-approval changes:** Codex findings C1 and C2 (above) changed three options after the approval. Copy distance is still 0 runs of eight or more words. **The owner confirmed both fixes as part of the batch 1 approval in chat on November 6, 2026** ("Confirm fixes").

## Batch 2 (#241): the five P1 situations

**Drafted, reviewed and moved to `in-review`:** November 6, 2026. Every source below was opened that day (`checkedOn: 2026-11-06`). Rules of Handicapping 3.3 was read in the browser pane; usga.org blocks scripts, so Reviewers A and B checked that one source against the drafter's capture of the page, and say so.

**Copy distance, batch 2:** 0 runs of eight or more words shared with the official text. Two checks agree:
- My corpus: Rules 3, 9, 13, 14 and 16 (rule text plus embedded Interpretations), the Definitions, Committee Procedures Sections 2 and 8, and the Rules of Handicapping 3.3 capture.
- `npm run check:rules-copy` (#245, merged during this batch): 220 copy fields in all 37 records against 27 R&A pages.

Reviewer B's own script also found 0 runs of eight or more, and 9 seven-word runs, all on defined terms or citations. `npm run check:rules-sources` confirms every anchor this batch added (`9_1b`, `16_1f`).

**Glossary check (`conceded-putt` against the published `gimme` note):** they **agree**, and the glossary record was not touched. The note says:
- an opponent can concede your next stroke in match play (3.2b);
- you hole out on every hole in regular stroke play (3.3c);
- for handicap posting, a ball left within five feet on the green counts as one more stroke (RoH 3.3).

Each matches the fetched text. The note is narrower than this record: it leaves out the net double bogey cap, the "valid reason" condition and the rows beyond five feet. Those are omissions, not contradictions. Both reviewers reached the same result independently.

### temporary-water

Sources: 16.1a, 16.1b, 16.1c, 16.1d, 16.1e, 16.1f; Definitions: Abnormal Course Condition, Temporary Water, Ground Under Repair, Known or Virtually Certain, Nearest Point of Complete Relief, Point of Maximum Available Relief, No Play Zone.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Ball touches or lies in temporary water or GUR, or it interferes with stance or swing: free relief except in a penalty area | 16.1a(1), (2); Definitions: Abnormal Course Condition |
| answer | General area: one club-length from the nearest point of complete relief, no nearer the hole; bunker and green differ | 16.1b; 16.1c; 16.1d |
| conditions[0] | Temporary water visible before or after the stance without pressing hard; wet or muddy ground, dew, frost don't count; not in a penalty area | Definitions: Temporary Water |
| conditions[1] | GUR is what the Committee defines, normally by marking the edge; unmarked: maintenance holes (not aeration), material piled for removal | Definitions: Ground Under Repair |
| conditions[2] | Ball on the green: a condition on the line of play counts, on or off the green; distraction never counts | 16.1a(1) |
| conditions[3] | No relief in a penalty area, when clearly unreasonable, or when interference comes only from an unreasonable choice | 16.1a(2), (3) |
| conditions[4] | Not found: known or virtually certain (conclusive or 95 percent) it's in the condition; crossing point is the ball's spot; otherwise lost, stroke and distance | 16.1e; Definitions: Known or Virtually Certain |
| options[0] | As it lies, unless a no play zone holds the ball or interferes with stance or swing | 16.1f; Definitions: No Play Zone |
| options[1] | General area: nearest point of complete relief explained; one club-length, no nearer the hole, general area; complete relief where the ball comes to rest | 16.1b; Definitions: Nearest Point of Complete Relief |
| options[2] | Bunker: free relief in the bunker (nearest point of complete relief, or least interference); or one stroke back on the line outside | 16.1c; Definitions: Point of Maximum Available Relief |
| options[3] | Putting green: place at the nearest point of complete relief or least interference, on the green or in the general area | 16.1d |
| penalty | Relief free except one stroke outside a bunker; wrong place is the general penalty | 16.1c(2); 16.1 (penalty statement) |
| example | 2nd: puddle on the fairway; nearest clear spot; one club-length | 16.1b |

### ball-moved

Sources: 9.1b, 9.2, 9.3, 9.4, 9.5, 9.6; Definitions: Moved, Known or Virtually Certain, Natural Forces, Outside Influence.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Wind, water or gravity: play from the new spot, no penalty | 9.3; Definitions: Natural Forces |
| answer | You, caddie, opponent or anything else: replace; one stroke when you or your caddie caused it, unless an exception | 9.4a, 9.4b; 9.5a; 9.6 |
| conditions[0] | Moved means left its spot and stopped elsewhere, visible to the naked eye; a wobble isn't; must be known or virtually certain; otherwise play as it lies | Definitions: Moved; 9.2a; Definitions: Known or Virtually Certain |
| conditions[1] | You, an opponent or an outside influence is the cause only if known or virtually certain; otherwise natural forces | 9.2b(2) |
| conditions[2] | Accidental movement often no penalty: searching or identifying, on the green, marking, lifting, replacing, measuring, taking relief | 9.4b Exceptions 2–4 |
| conditions[3] | Moves after the backswing starts and you finish the stroke: play it where it ends up; penalty and exceptions still apply if you caused it | 9.1b; 9.4a; 9.4b |
| conditions[4] | Natural forces move a dropped, placed or replaced ball to another area of the course or out of bounds: it goes back; on the green after lift and replace, it goes back whatever moved it | 9.3 Exceptions 1 and 2 |
| options[0] | Natural forces: no penalty, new spot | 9.3 |
| options[1] | You, your caddie, or a partner in a team format: replace, one stroke unless an exception | 9.2b(1) (Rules 22.2, 23.5); 9.4 |
| options[2] | Opponent in match play: replace, opponent one stroke unless an exception | 9.5 |
| options[3] | Anything else, including another player in stroke play who isn't your partner: replace, no penalty | 9.6; Definitions: Outside Influence |
| penalty | One stroke (9.4b); played without replacing: general penalty only | 9.4b; 9.4 (penalty note) |
| example | 4th: club grounded, a gust moves the ball; not known or virtually certain the club did it, so natural forces | 9.2b(2); 9.3 |
| matchVsStrokeCaveat | Match play: opponent's ball movement replaced, one stroke; stroke play: another player is an outside influence | 9.5; 9.6 |

### mark-lift-clean

Sources: 14.1a, 14.1b, 14.1c, 14.2, 13.1b, 9.4, 15.3b; MLR E-3.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | On the putting green: mark, lift, clean, replace any time | 13.1b |
| answer | Elsewhere only when a Rule lets you, such as at another player's request; why you lifted decides cleaning | 14.1c; 9.4b; 15.3b(2) |
| answer | Lift, clean and place is E-3, only if adopted | MLR E-3 |
| conditions[0] | Mark before lifting a ball to be replaced, with a ball-marker or a club, right behind or beside; no mark needed for relief | 14.1a |
| conditions[1] | Only you or someone you authorize each time; caddie without asking on the green or when relief is clear | 14.1b |
| conditions[2] | Cleaning off the green: not for cut or crack, interference, or relief check without relief; to identify, only as needed | 14.1c |
| conditions[3] | You or whoever lifted it replaces it by hand on the original spot; remove the ball-marker | 14.2b; 14.2c; 14.1a |
| penalty | One stroke: no mark, marker left down, cleaning not allowed, replaced by someone not allowed | 14.1a; 14.1c; 14.2b(1) |
| penalty | Lifting with no Rule, including an unrequested lift off the green for interference: one stroke; played without replacing: general penalty instead | 9.4b; 15.3b(2); 9.4 (penalty note); 14.2 |
| example | 6th: marker behind, lift, wipe, replace, pick up the marker | 13.1b; 14.1a |
| localRuleCaveat | E-3 only if adopted; ball touching general area mown to fairway height or less, or an area the Committee names; placed once, within the Committee's distance, no nearer the hole, in the general area | MLR E-3 (Local Rule text) |
| localRuleCaveat | A group agreeing to it isn't the Committee adopting it | MLR E-3 ("may adopt"); canonical-map.md rule 4 |

### repairing-the-green

Sources: 13.1c; Definitions: Putting Green.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Repair damage during the round, ball on or off the green, with hand, foot, repair tool, tee or club; restoring, without delay | 13.1c(2) |
| answer | Natural flaws and normal maintenance aren't damage | 13.1c |
| conditions[0] | Damage: harm by a person or outside influence, with the listed examples | 13.1c |
| conditions[1] | Not damage: aeration holes, vertical mowing grooves, rain or irrigation, weeds, bare or uneven patches, natural wear of the hole | 13.1c |
| conditions[2] | Beyond restoring (a channel to the hole): general penalty | 13.1c (breach of 8.1a) |
| conditions[3] | Sand and loose soil may be removed | 13.1c(1) |
| conditions[4] | Only the green of the hole being played; other greens are wrong greens in the general area | Definitions: Putting Green |
| penalty | Reasonable repair free; beyond restoring or a disallowed object: general penalty | 13.1c |
| example | 8th: spike mark tapped down; thin grass and aeration hole rim left | 13.1c |

### conceded-putt

Sources: 3.2b, 3.3c; RoH 3.3.

| Field | Sentence (start) | Source |
|---|---|---|
| answer | Match play: the opponent can concede the next stroke; the score includes it | 3.2b(1) |
| answer | Stroke play: hole out on every hole | 3.3c |
| answer | A casual gimme is the group's agreement, not a Rule | 3.3c (no concessions in stroke play); canonical-map.md rule 4 |
| conditions[0] | Match play only; any time before the stroke; by words or a clear gesture | 3.2b(1), (2) |
| conditions[1] | Final: can't be declined or withdrawn | 3.2b(2) |
| conditions[2] | Lifted on a reasonable misunderstanding: no penalty, replace | 3.2b(2) |
| conditions[3] | Stroke play: correct before the next tee or before returning the scorecard; Stableford, maximum score, par/bogey differ | 3.3c |
| penalty | Not holing out and not correcting it: disqualification | 3.3c |
| example | 18th: a putt for three, conceded, scores four; stroke play taps in | 3.2b(1) |
| matchVsStrokeCaveat | Match play concedes stroke, hole or match; stroke play holes out | 3.2b(1); 3.3c |
| handicapCaveat | Separate rulebook; valid reason (hole conceded in match play is an example); most likely score or net double bogey if lower; within five feet one stroke; five feet to 20 yards two or three | RoH 3.3 |

### Findings and resolutions, batch 2

Reviewer A (rules): 3 majors, 14 minors, plus 1 optional note; no penalty, stroke-count or example errors. Reviewer B (product, seo): 4 majors and 17 minors, no blockers. All five records were judged accurate after fixes.

| # | Record · field | Finding | Resolution |
|---|---|---|---|
| A1 (major) | ball-moved · conditions[3] | Backswing rule is 9.1b; the 9.4b exceptions still apply (no penalty on the green) | Fixed; `9.1b` added |
| A2 (major) | ball-moved · conditions[4] | Any natural force, not just wind or water; the trigger is another *area* of the course | Fixed |
| A3 (major) | ball-moved · options[3], matchVsStrokeCaveat | A partner in Four-Ball or Foursomes isn't an outside influence | Fixed in options[1], [3] and the caveat |
| A4 | ball-moved · conditions[2] | Read as a complete list of 9.4b exceptions | Fixed: "for example", identifying and measuring added |
| A5 | ball-moved · sources | Natural Forces, Outside Influence, Known or Virtually Certain, 9.1b not cited | Added |
| A6 | temporary-water · conditions[2] | The test is the ball on the green; the condition can be on or off it | Fixed |
| A7 | temporary-water · conditions[3] | Second 16.1a(3) denial missing | Added |
| A8 | temporary-water · conditions[4] | What happens when the standard isn't met | Added: lost, stroke and distance |
| A9 | temporary-water · options[0] | No play zone also forces relief for stance or swing; the Committee defines it | Fixed |
| A10 | temporary-water · penalty | Wrong place covers more than outside the relief area | Fixed |
| A11 | temporary-water · sources | Four Definitions not cited | Added |
| A12 | mark-lift-clean · conditions[2] | Identify by brand or number too, not only your mark | Fixed |
| A13 | mark-lift-clean · penalty | Not replacing: general penalty only; 14.2b one-stroke penalties missing | Fixed |
| A14 | mark-lift-clean · caveat | E-3 can name a specific area | Added. The "lift and clean" alias stays (inventory); E-2 isn't cited |
| A15 | repairing-the-green · conditions[0] | "Anything a person caused" contradicted the aeration exclusion | Fixed |
| A16 | conceded-putt · handicapCaveat | "Can add more" understates the RoH table | Fixed: "from five feet to 20 yards, two or three" |
| A17 | conceded-putt · handicapCaveat | RoH 3.3 names a hole conceded in match play, not a conceded stroke | Fixed |
| A, optional | conceded-putt · answer | Rule 1.3b(1), agreeing to waive a Rule | Not added: not in `source-map.md` for this situation |
| B1 (major) | ball-moved · conditions[2] | "penalised" | Sentence rewritten (A4); no "penalised" left |
| B2 (major) | mark-lift-clean · conditions[1] | "authorise" | "authorize" |
| B3 (major) | ball-moved · conditions[0] | Known or virtually certain unexplained | Explained |
| B4 (major) | ball-moved · penalty | General penalty unexplained; "instead" twice | Fixed |
| B5 | ball-moved · question | No question mark | Declined: `scripts/test-rules.mjs` pins "My ball moved after it stopped" (see How this batch was checked) |
| B6 | ball-moved · example | "ball moved at address" alias had no matching copy | New example: club set down behind the ball |
| B7 | ball-moved · matchVsStrokeCaveat | Who replaces; "usually" | Fixed |
| B8 | mark-lift-clean · conditions[2] | Dangling modifier; "your mark" | Fixed |
| B9 | mark-lift-clean · caveat | Group agreement line | Added, as the E-5 caveats |
| B10 | mark-lift-clean · conditions[3] | "by" twice | Fixed |
| B11 | temporary-water · penalty | "is a wrong place" | Fixed |
| B12 | temporary-water · options[1] | Nearest point of complete relief unexplained | Explained |
| B13 | temporary-water · conditions[2] | First sentence repeated the answer | Dropped |
| B14 | temporary-water · conditions[1] | Where to look for GUR; "white circle" alias | Fixed to "a painted line or markers on the ground" (the Definition). No color: the white line is a Committee Procedures example, not in this record's sources |
| B15 | repairing-the-green · conditions[4] | "It's" unclear | Fixed |
| B16 | repairing-the-green · conditions[2], penalty | "is a breach", "is the general penalty" | "costs the general penalty" |
| B17 | repairing-the-green · answer | Bare patches don't grow | Fixed |
| B18 | conceded-putt · example | "your third shot, a putt" | Fixed |
| B19 | conceded-putt · handicapCaveat | "5 feet" vs "five feet" | "five feet" |
| B20 | conceded-putt · links | `net-double-bogey` is published | Added |
| B21 (info) | conceded-putt · handicapCaveat | Goes further than the glossary's posting note; no mismatch | Kept: editorial-review.md requires the caveat; trimming is the owner's call |
| B, seo | aliases | "free relief" goes first to cart-path; "white line" only to out-of-bounds | Left: both are deliberate owners (cart-path owns free relief, the boundary owns white lines); a later pass can mark them ambiguous |

Codex (PR #261, review of ac9fcce), after the owner's approval:

| # | Record · field | Finding | Resolution |
|---|---|---|---|
| C3 (P2) | temporary-water · options[1] | 16.1b requires complete relief where the dropped ball comes to rest, not only at the reference point | Fixed, as cart-path's condition already says |
| C4 (P2, review of 2db047b) | mark-lift-clean · answer | Off the green, an interfering ball is lifted only when another player requires it; lifting on your own belief is one penalty stroke (15.3b) | Fixed in the answer, conditions[2] and the penalty; `15.3b` added (anchor in `source-map.md`) |

Checks both reviewers passed: no GoLo claims; `NEVER_WORDS` clean; E-3 conditional; the Rules of Handicapping only in the caveat, called a separate rulebook; glossary slugs `putt`, `gimme`, `match-play`, `stroke-play`, `net-double-bogey` published; `/blog/gimmes` served; fragments match `canonical-map.md`; aliases as `inventory.md`, with "casual water" shared only with Rule 16, its primary rule; answers two or three sentences, four or five conditions; `npm run lint:content` passes.

### Approval, batch 2

**Approved by the owner in chat on November 6, 2026** ("Approve batch 2"), on this packet as written. The records are `approved` with `reviewedOn: 2026-11-06`, `reviewedBy: "owner"` and a review log of rules, product and seo by "agent" and approval by "owner" (`P1_APPROVED` in `scenarios.ts`). With both batches approved, all 12 situations are `approved`. Not published at approval: `rulesLive` was false and only #247 published. (Published 2026-11-07 by #269, `f27675b`.)

**Post-approval change:** Codex finding C3 (above) added one sentence to `temporary-water` options[1]. Copy distance is still 0 runs of eight or more words (`npm run check:rules-copy`). **The owner confirmed the fix as part of the batch 2 approval in chat on November 6, 2026** ("Confirm fix").

**Second post-approval change:** Codex finding C4 (above) changed `mark-lift-clean`'s answer, conditions[2] and penalty. The owner told me in chat on November 6, 2026 to verify the finding and fix it if real. I checked it against the fetched Rule 15.3b(2) text, which allows lifting only when the other player requires it and gives one penalty stroke otherwise, off the green. The finding is real, and the fix is the one above.

**Seen in `next dev`** (the hub, #255, renders approved records marked "Not published"): all 12 situations render with their "Before you decide" lists, caveats and official links; no horizontal overflow at 320, 760, 1100 or 1440 px; no console errors; no review-log, `reviewedBy` or `checkedOn` text in the page. Focus styling is the hub's components', unchanged here.
