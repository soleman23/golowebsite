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

**Approved by the owner in chat on November 6, 2026** ("Approve batch 1"), on this packet as written. The approval covers all seven records and accepts the off-record Committee Procedures 2C source for `red-vs-yellow-penalty-areas`. The records are `approved` with `reviewedOn: 2026-11-06`, `reviewedBy: "owner"` and a review log of rules, product and seo by "agent" and approval by "owner" (`P0_APPROVED` in `scenarios.ts`). Not published: `rulesLive` is false and only #247 publishes.

**Post-approval changes:** Codex findings C1 and C2 (above) changed three options after the approval. Copy distance is still 0 runs of eight or more words. Pending the owner's confirmation in chat.
