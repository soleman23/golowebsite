# Rule overviews: review packet for the owner (#237, #238, #239)

The evidence behind the 25 rule overviews in `lib/content/rules/overviews.ts`, one batch per section, for the owner's sign-off as reviewer of record (`docs/rules/editorial-review.md`, Amendment A2). Situations have their own packet (`review-packet-situations.md`).

Each rule's entry has the copy as it stands, every summary sentence and common question mapped to the subrule or Definition it rests on, both reviewer agents' findings with what was done about each, the copy-distance result, and the owner's approval line. Where a finding quotes earlier wording, the copy shown above it already carries the fix.

## How each batch was checked

1. **Draft.** Claude wrote each record from the R&A rule pages (`https://www.randa.org/en/rog/the-rules-of-golf/rule-N`) and the Definitions page (`https://www.randa.org/en/rog/definitions`), opened on the date in the batch's heading. Every source on a record carries that date as `checkedOn`. Overviews cite no Model Local Rule and no Rules of Handicapping (`validateRules` refuses both); where the Committee decides something, the copy says so.
2. **Review.** Two reviewer agents ran in parallel. Each got the exported records and opened the sources itself; neither saw the drafter's reasoning or the other's notes.
   - **Agent A, rules accuracy** (`rules` stage): every factual sentence against the fetched rule text and Definitions; match play against stroke play; Committee and Local Rule dependence; stated penalties; defined terms; citations.
   - **Agent B, site rules** (`product` and `seo` stages): house voice, `NEVER_WORDS`, the claim guard, word counts, glossary slugs and aliases against `inventory.md`, every source link and anchor, `npm run lint:content`, and its own copy-distance script.
3. **Fixes.** Every finding was fixed or answered below before the record moved to `in-review`. A finding the drafter disagreed with is marked as such, for the owner to decide.
4. **Copy distance.** No run of eight or more consecutive words may be shared with the official text. The check normalises Unicode, case, punctuation and curly quotes, spells out contractions ("it's" as "it is") and small numbers, and compares each summary and question against a corpus of all 25 rule pages and the Definitions, both the visible text and the page data that carries the interpretations (about 454,000 words). Agent B ran its own version independently.
5. **Approval.** The owner approves a batch in chat. The records then move to `approved` with `reviewedBy: "owner"`, `reviewedOn` set to the approval date and a review log of the agents' `rules`, `product` and `seo` stages and the owner's `approval`. Nothing here sets `published`; the launch PR (#247) does.

## #238 · Rules 12–19

Course areas and procedures (12–16) and relief and penalties (17–19), the most-read rules. Sources opened November 6, 2026; both reviewer agents ran the same day.

**Result.** Agent A found 2 errors: Rule 14 said any mistake could be fixed free before playing the ball, and Rule 18 started the lost-ball clock when "the search starts" rather than when you or your caddie start looking. Agent B found 1 error: Rule 18 shared a 9-word run with 18.2b once "it's" is read as "it is". All three are fixed, along with the gaps and should-fix items below. Codex then reviewed the pull request and raised four P2 points, all fixed: sand that has washed away still counts as bunker (Rule 12), the last hole's correction deadline is returning the card (Rule 14), a drop from a movable obstruction stays in the same area of the course (Rule 15), and a plugged ball's drop is measured from the spot just behind it (Rule 16). Each summary is 112–120 words with four questions. The drafter's checker now spells out contractions too, and every overview was rerun through it: the longest run left in this batch is 7 words. `npm run lint:content` passes. Agent B checked every link on the draft; after the fixes, the final 43 subrule anchors and 22 Definitions citations were rechecked against the fetched pages, and all resolve.

**Owner calls** (approved on November 6, 2026, with the drafter's positions as written):

1. **Questions as pointers.** A "Look here when" question tells a reader this is the rule to look in; the drafter didn't try to answer every one inside 120 words. Agent A flagged those without an answer in the summary. Still unanswered here: Rule 15 Q4 (another ball on your line), Rule 16 Q2 (soggy fairway), Rule 17 Q4 (unplayable in a penalty area, answered in Rule 19's overview) and Rule 18 Q4 (original found after a provisional). Each is mapped to its subrule below. Say if you'd rather every question be answered on the card; that means swapping questions, since every summary is at or near 120 words.
2. **Ground under repair** (Rule 16). Agent A asked for a line saying it's mostly what the Committee marks, since casual groups treat any bare patch as ground under repair. There is no room left; the Definition is now linked instead.
3. **Old names.** "Water hazard" (Rule 17) and "casual water" (Rule 16) are aliases for search, as `inventory.md` sets out, but neither card uses them. They are not in the 2023 text, so the drafter left them out of the copy.

### Rule 12 · Bunkers

**Summary (120 words):** Rule 12 covers when your ball is in a bunker and what you may touch there. It's in if any part touches sand inside the edge, sits where sand has washed or blown away, or rests on something there, like a rake; on grass inside the edge, not touching sand, it isn't. Before playing, you can't touch the sand to test it, with the club just in front of or behind the ball, or in a practice swing or backswing. Each costs the general penalty: two strokes in stroke play, loss of the hole in match play. Digging in your feet or moving a rake is fine. Once your ball is out, or you're taking relief outside, you can rake.

**Look here when:** Is my ball in the bunker if it's on grass inside the edge? · Can my practice swing brush the sand? · Can I move a rake, leaves or a stone before I play from the sand? · When can I smooth the sand?

**Glossary:** `bunker`, `sandy` · **Aliases:** none · **Sources:** 12, 12.1, 12.2a, 12.2b, Definitions: General Penalty

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 12 covers when your ball is in a bunker and what you may touch there. | [Rule 12](https://www.randa.org/en/rog/the-rules-of-golf/rule-12) |
| 2 | It's in if any part touches sand inside the edge, sits where sand has washed or blown away, or rests on something there, like a rake; on grass inside the edge, not touching sand, it isn't. | [12.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_1) |
| 3 | Before playing, you can't touch the sand to test it, with the club just in front of or behind the ball, or in a practice swing or backswing. | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |
| 4 | Each costs the general penalty: two strokes in stroke play, loss of the hole in match play. | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b), Definitions: General Penalty |
| 5 | Digging in your feet or moving a rake is fine. | [12.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2a), [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |
| 6 | Once your ball is out, or you're taking relief outside, you can rake. | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |
| Q1 | Is my ball in the bunker if it's on grass inside the edge? | [12.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_1) |
| Q2 | Can my practice swing brush the sand? | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |
| Q3 | Can I move a rake, leaves or a stone before I play from the sand? | [12.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2a) |
| Q4 | When can I smooth the sand? | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* The in-bunker sentence left out a ball resting on something lying on the sand (a rake, leaves, a puddle), so a group could treat it as outside the bunker and ground the club (12.1). **Resolution:** Fixed: the sentence now counts a ball resting on something in the bunker, such as a rake, and says a ball on grass inside the edge that touches no sand isn't in.
- *Rules accuracy (agent A), gap:* 12.3 is cited, but nothing in the summary covers relief in a bunker, and Q4 (unplayable in a bunker) isn't answered here. **Resolution:** Fixed together with agent B's finding on the same question: Q4 is now "When can I smooth the sand?", which this summary answers, and 12.3 is no longer cited. Rule 19's overview covers unplayable relief in a bunker.
- *Rules accuracy (agent A), nit:* Moving a leaf or stone that then moves the ball costs a stroke (15.1b); touching sand in an allowed way can still be the general penalty if it improves the lie (12.2b(2), 8.1a). **Resolution:** Changed the example to digging in your feet or moving a rake, both free whatever happens to the ball. The leaf-and-ball case is in Rule 15's overview.
- *Rules accuracy (agent A), nit:* Raking is also free once you are taking, or intend to take, relief outside the bunker (12.2b(3)). **Resolution:** Fixed: "Once your ball is out, or you're taking relief outside, you can rake."
- *Site rules (agent B), should-fix:* In the list of banned touches, the last item had no "or", so "in a practice swing or on the backswing" read as part of the club-near-the-ball case; and "That is the general penalty" could be read as the last item only. **Resolution:** Fixed: "you can't touch the sand to test it, with the club just in front of or behind the ball, or in a practice swing or backswing. Each costs the general penalty..."
- *Site rules (agent B), should-fix:* Q4 (unplayable in a bunker) belongs to Rule 19 and duplicated Rule 19's Q2. **Resolution:** Fixed: Q4 is now "When can I smooth the sand?"; 12.3 dropped.
- *Site rules (agent B), nit:* "rake away" was breezy one sentence after a penalty. **Resolution:** Fixed: "you can rake."
- *Codex, on the pull request, P2:* "On grass or soil inside the edge, not touching sand, it isn't" misclassifies a ball on ground where the sand has washed or blown away, which 12.1 counts as in the bunker. **Resolution:** Fixed: "It's in if any part touches sand inside the edge, sits where sand has washed or blown away, or rests on something there"; "soil" dropped from the not-in case.

**Copy distance:** longest run shared with the R&A text is 6 words ("ball is in a bunker and"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 13 · Putting Greens

**Summary (119 words):** Rule 13 covers the putting green, where you may do things not allowed elsewhere. You can mark, lift, clean and replace your ball, and repair ball marks, spike marks and old hole plugs, but not aeration holes or natural wear. Accidentally moving your ball or marker there costs nothing; replace it. Decide before each stroke whether the flagstick stays in; a putt that hits it is played as it lies, without penalty. If your ball hangs on the lip, you get time to reach the hole, then ten seconds; if it drops later, it counts but adds a penalty stroke. If your ball is on another hole's green, or one is in your stance or swing, take free relief.

**Look here when:** Can I fix a ball mark or spike mark on my putting line? · Can I putt with the flagstick in? · How long can I wait for a ball hanging on the lip? · My ball is on the wrong green: can I putt it from there?

**Glossary:** `putt` · **Aliases:** `flagstick`, `wrong green` · **Sources:** 13, 13.1b, 13.1c, 13.1d, 13.1f, 13.2a, 13.2b, 13.3a, Definitions: Wrong Green

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 13 covers the putting green, where you may do things not allowed elsewhere. | [Rule 13](https://www.randa.org/en/rog/the-rules-of-golf/rule-13) |
| 2 | You can mark, lift, clean and replace your ball, and repair ball marks, spike marks and old hole plugs, but not aeration holes or natural wear. | [13.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_1b), [13.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_1c) |
| 3 | Accidentally moving your ball or marker there costs nothing; replace it. | [13.1d](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_1d) |
| 4 | Decide before each stroke whether the flagstick stays in; a putt that hits it is played as it lies, without penalty. | [13.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_2a), [13.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_2b) |
| 5 | If your ball hangs on the lip, you get time to reach the hole, then ten seconds; if it drops later, it counts but adds a penalty stroke. | [13.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_3a) |
| 6 | If your ball is on another hole's green, or one is in your stance or swing, take free relief. | [13.1f](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_1f), Definitions: Wrong Green |
| Q1 | Can I fix a ball mark or spike mark on my putting line? | [13.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_1c) |
| Q2 | Can I putt with the flagstick in? | [13.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_2a) |
| Q3 | How long can I wait for a ball hanging on the lip? | [13.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_3a) |
| Q4 | My ball is on the wrong green: can I putt it from there? | [13.1f](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_1f), Definitions: Wrong Green |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* Wrong green was missing, though the record carries the alias, 13.1f and Q4: relief is required, including when a wrong green is in the stance or swing (13.1f; Definitions: Wrong Green). **Resolution:** Fixed: added "If your ball is on another hole's green, or one is in your stance or swing, you must take free relief."
- *Rules accuracy (agent A), gap:* The overhanging-ball sentence left out what happens if the ball drops after the waiting time: holed with the previous stroke, plus one penalty stroke (13.3a). **Resolution:** Fixed: "if it drops later, it counts but adds a penalty stroke."
- *Rules accuracy (agent A), nit:* A deliberately off-centre flagstick that the ball then hits is the general penalty; a ball resting against the flagstick with any part below the surface is holed (13.2a(1), 13.2c). **Resolution:** Not added: both are edge cases a 120-word summary can't carry; the rule page link covers them.
- *Rules accuracy (agent A), nit:* "Put it back" covers accidental movement by people only; a ball moved by wind is replaced only if it had already been lifted and replaced (13.1d(2)). **Resolution:** Not added, for length; the sentence is scoped to accidental movement.
- *Rules accuracy (agent A), nit:* Q2 "Should I leave the flagstick in or take it out?" asks for strategy the Rules don't give. **Resolution:** Fixed: now "Can I putt with the flagstick in?"
- *Site rules (agent B), should-fix:* "Gets the time to reach the hole" read as the ball's time. **Resolution:** Fixed: "If your ball hangs on the lip, you get time to reach the hole, then ten seconds".
- *Site rules (agent B), nit:* Q2 asked for strategy. **Resolution:** Fixed, as agent A also asked: "Can I putt with the flagstick in?"
- *Site rules (agent B), nit:* The alias "wrong green" appeared nowhere on the card. **Resolution:** Fixed: Q4 is now "My ball is on the wrong green: can I putt it from there?", and the summary covers it.

**Copy distance:** longest run shared with the R&A text is 5 words ("mark lift clean and replace"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 14 · Procedures for Ball: Marking, Lifting and Cleaning; Replacing on Spot; Dropping in Relief Area; Playing from Wrong Place

**Summary (116 words):** Rule 14 covers marking, lifting, replacing and dropping a ball, and playing from a wrong place. Mark the spot before lifting a ball you'll replace; skipping that costs a penalty stroke. Drop from knee height, straight down, into the relief area, where the ball must stay; if it rolls out twice, place it where the second drop landed. A wrong drop, placement or replacement can be redone free before you play. Playing from a wrong place costs the general penalty, two strokes or loss of the hole in match play; in stroke play, a serious breach must be corrected before the next tee, or on the last hole before you return your card, or you're disqualified.

**Look here when:** Do I have to mark my ball before lifting it? · How do I drop, and what if the ball rolls out of the relief area? · I dropped in the wrong spot: can I pick it up and drop again? · I played from the wrong place in stroke play: what now?

**Glossary:** none · **Aliases:** `wrong place` · **Sources:** 14, 14.1a, 14.3b, 14.3c, 14.5a, 14.7a, 14.7b, Definitions: Relief Area, Definitions: General Penalty

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 14 covers marking, lifting, replacing and dropping a ball, and playing from a wrong place. | [Rule 14](https://www.randa.org/en/rog/the-rules-of-golf/rule-14) |
| 2 | Mark the spot before lifting a ball you'll replace; skipping that costs a penalty stroke. | [14.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_1a) |
| 3 | Drop from knee height, straight down, into the relief area, where the ball must stay; if it rolls out twice, place it where the second drop landed. | [14.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_3b), [14.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_3c), Definitions: Relief Area |
| 4 | A wrong drop, placement or replacement can be redone free before you play. | [14.5a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_5a) |
| 5 | Playing from a wrong place costs the general penalty, two strokes or loss of the hole in match play; in stroke play, a serious breach must be corrected before the next tee, or on the last hole before you return your card, or you're disqualified. | [14.7a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_7a), [14.7b](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_7b), Definitions: General Penalty |
| Q1 | Do I have to mark my ball before lifting it? | [14.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_1a) |
| Q2 | How do I drop, and what if the ball rolls out of the relief area? | [14.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_3b), [14.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_3c) |
| Q3 | I dropped in the wrong spot: can I pick it up and drop again? | [14.5a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_5a) |
| Q4 | I played from the wrong place in stroke play: what now? | [14.7b](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_7b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), error:* "Mistakes can be fixed without penalty before you play the ball" was broader than 14.5a, which covers only a wrong substitution or a ball dropped, placed or replaced the wrong way, in the wrong place or under the wrong Rule; penalties already incurred stand (14.1a, 14.1c, 14.5c). **Resolution:** Fixed: "A wrong drop, placement or replacement can be redone free before you play the ball."
- *Rules accuracy (agent A), gap:* The wrong-place sentence left out the stroke-play serious-breach rule that Q4 asks about (14.7b). **Resolution:** Fixed: "in stroke play, a serious breach must be corrected before the next tee, or on the last hole before you return your card, or you're disqualified." The general penalty is spelled out in the same sentence.
- *Rules accuracy (agent A), nit:* A ball dropped the wrong way but played from inside the relief area is one stroke, not the wrong-place penalty (14.3b(4)). **Resolution:** Not added, for length.
- *Rules accuracy (agent A), nit:* The first sentence said "wrong spot"; use the defined "wrong place". **Resolution:** Fixed.
- *Rules accuracy (agent A), nit:* Only the player may drop, and the ball must not touch the player or their equipment first (14.3b(1)-(2)). **Resolution:** Not added, for length.
- *Site rules (agent B), should-fix:* "Playing from a wrong place is the general penalty": the act isn't the penalty, the general penalty wasn't explained on this card, and the first sentence said "wrong spot". **Resolution:** Fixed: "costs the general penalty, two strokes or loss of the hole in match play", and "wrong place" in both sentences.
- *Site rules (agent B), nit:* "Mistakes can be fixed" was vague. **Resolution:** Fixed with agent A's error: names a wrong drop, placement or replacement.
- *Site rules (agent B), nit:* "Club-lengths" isn't explained here, or in Rules 16, 17 and 19. **Resolution:** Not added to the copy, for length. Rules 16, 17 and 19 cite Definitions: Club-Length; Rule 14 no longer gives a size (cut to fit Codex's last-hole deadline below).
- *Codex, on the pull request, P2:* "Before the next tee" doesn't cover the last hole, where the deadline is returning the scorecard (14.7b(1)). **Resolution:** Fixed: "or on the last hole before you return your card". The relief-area size was cut to fit.

**Copy distance:** longest run shared with the R&A text is 6 words ("relief area where the ball must"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 15 · Relief from Loose Impediments and Movable Obstructions (Including Ball or Ball-Marker Helping or Interfering with Play)

**Summary (120 words):** Rule 15 covers two kinds of things you can usually move out of the way without penalty. Loose impediments are unattached natural objects, such as leaves, twigs and stones. Movable obstructions are artificial objects you can move with reasonable effort and without damage, such as rakes, bottles and towels. Off the putting green and teeing area, if removing a loose impediment moves your ball, replace it and add a penalty stroke; if removing a movable obstruction moves it, just replace it. If your ball sits on a movable obstruction, lift it, remove the object and drop within one club-length of the spot beneath, no nearer the hole, without leaving that area of the course; on the green, place it there.

**Look here when:** Can I move a twig or a leaf that's touching my ball? · My ball is resting against a rake: what do I do? · My ball stopped on a towel or a headcover: how do I take relief? · Another ball is near my line: can I ask for it to be marked and lifted?

**Glossary:** none · **Aliases:** none · **Sources:** 15, 15.1a, 15.1b, 15.2a, 15.3b, Definitions: Loose Impediment, Definitions: Movable Obstruction

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 15 covers two kinds of things you can usually move out of the way without penalty. | [15.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_1a), [15.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_2a) |
| 2 | Loose impediments are unattached natural objects, such as leaves, twigs and stones. | Definitions: Loose Impediment |
| 3 | Movable obstructions are artificial objects you can move with reasonable effort and without damage, such as rakes, bottles and towels. | Definitions: Movable Obstruction |
| 4 | Off the putting green and teeing area, if removing a loose impediment moves your ball, replace it and add a penalty stroke; if removing a movable obstruction moves it, just replace it. | [15.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_1b), [15.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_2a) |
| 5 | If your ball sits on a movable obstruction, lift it, remove the object and drop within one club-length of the spot beneath, no nearer the hole, without leaving that area of the course; on the green, place it there. | [15.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_2a) |
| Q1 | Can I move a twig or a leaf that's touching my ball? | [15.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_1a), [15.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_1b) |
| Q2 | My ball is resting against a rake: what do I do? | [15.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_2a) |
| Q3 | My ball stopped on a towel or a headcover: how do I take relief? | [15.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_2a) |
| Q4 | Another ball is near my line: can I ask for it to be marked and lifted? | [15.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_3b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* "Obstruction" should be "movable obstruction"; and for a ball resting on one (towel, headcover), the procedure is lift, remove and drop within one club-length of the spot beneath, or place it there on the green, not replace (15.2a(2)-(3)). Q3 asks exactly this. **Resolution:** Fixed: both sentences rewritten to say movable obstruction and to give the drop, and the place on the green.
- *Rules accuracy (agent A), gap:* "Shift without much effort or damage" loosened the Definition: an object movable only by damaging it or the course is immovable (Definitions: Movable Obstruction). **Resolution:** Fixed: "that you can move with reasonable effort and without damage." The Committee's power to declare one immovable is left to the Definition link.
- *Rules accuracy (agent A), nit:* In stroke play the other player may play first instead of lifting (15.3b(2)). **Resolution:** The sentence on another player's ball was cut to fit the movable-obstruction fix; Q4 still points to 15.3b.
- *Rules accuracy (agent A), nit:* 15.3a (a ball that might help play) supported no sentence. **Resolution:** Fixed: source removed.
- *Rules accuracy (agent A), nit:* No penalty if the ball moves during a search (7.4). **Resolution:** Not added, for length; "usually" covers it and Rule 7's overview says it.
- *Site rules (agent B), should-fix:* A 41-word first sentence with a definition inside a list read as four things; "for free" was then repeated as "usually ... without penalty". **Resolution:** Fixed: split into a scope sentence and one sentence each for loose impediments and movable obstructions, with agent A's tighter wording of the Definition.
- *Site rules (agent B), nit:* "The catch is" was a chatty lead-in to a penalty. **Resolution:** Fixed: the sentence now starts "Off the putting green and teeing area".
- *Site rules (agent B), nit:* "An obstruction" should be "a movable obstruction". **Resolution:** Fixed.
- *Codex, on the pull request, P2:* The drop from a movable obstruction must stay in the same area of the course (15.2a(2)); without that, a drop beside a bunker or penalty area could be from a wrong place. **Resolution:** Fixed: "no nearer the hole, without leaving that area of the course". ("In the same area of the course" would have been an 11-word run.)

**Copy distance:** longest run shared with the R&A text is 5 words ("move out of the way"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 16 · Relief from Abnormal Course Conditions (Including Immovable Obstructions), Dangerous Animal Condition, Embedded Ball

**Summary (120 words):** Rule 16 covers free relief from abnormal course conditions (ground under repair, temporary water, animal holes and immovable obstructions like paved paths), from dangerous animals, and for a ball in the general area that plugs in its own pitch-mark. A condition must interfere with your lie, stance or swing, or, on the green, your line. In the general area, find the nearest point of complete relief, the closest spot, no nearer the hole, clear of it for the shot you'd have played, and drop within one club-length, no nearer the hole and clear of it. For a plugged ball, the club-length is measured from the spot just behind it. None of this applies in a penalty area, except dangerous-animal relief.

**Look here when:** My ball is on a cart path: where do I drop? · Does a soggy patch of fairway count as temporary water? · My ball plugged in the rough: do I get a free drop? · Can I move my ball away from a snake or a swarm of bees?

**Glossary:** none · **Aliases:** `plugged ball`, `embedded ball`, `casual water` · **Sources:** 16, 16.1a, 16.1b, 16.2a, 16.2b, 16.3a, 16.3b, Definitions: Abnormal Course Condition, Definitions: Ground Under Repair, Definitions: Obstruction, Definitions: Nearest Point of Complete Relief, Definitions: Club-Length, Definitions: Temporary Water, Definitions: Embedded

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 16 covers free relief from abnormal course conditions (ground under repair, temporary water, animal holes and immovable obstructions like paved paths), from dangerous animals, and for a ball in the general area that plugs in its own pitch-mark. | [16.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1a), [16.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_2a), [16.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3a), Definitions: Abnormal Course Condition, Definitions: Ground Under Repair, Definitions: Obstruction, Definitions: Embedded |
| 2 | A condition must interfere with your lie, stance or swing, or, on the green, your line. | [16.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1a) |
| 3 | In the general area, find the nearest point of complete relief, the closest spot, no nearer the hole, clear of it for the shot you'd have played, and drop within one club-length, no nearer the hole and clear of it. | [16.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1b), Definitions: Nearest Point of Complete Relief, Definitions: Club-Length |
| 4 | For a plugged ball, the club-length is measured from the spot just behind it. | [16.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3b) |
| 5 | None of this applies in a penalty area, except dangerous-animal relief. | [16.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1a), [16.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_2b), [16.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3a) |
| Q1 | My ball is on a cart path: where do I drop? | [16.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1b) |
| Q2 | Does a soggy patch of fairway count as temporary water? | [16.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1a), Definitions: Temporary Water |
| Q3 | My ball plugged in the rough: do I get a free drop? | [16.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3a), [16.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3b) |
| Q4 | Can I move my ball away from a snake or a swarm of bees? | [16.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_2a), [16.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_2b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* Ground under repair is what the Committee defines, plus a few unmarked cases; casual groups treat any bare patch as ground under repair (Definitions: Ground Under Repair). **Resolution:** Partly fixed: Definitions: Ground Under Repair is now a source, so the page links it. No words added; the summary is at 120. Flagged for the owner.
- *Rules accuracy (agent A), gap:* The relief area must also be in the general area and give complete relief; dropping within a club-length with the stance still on the path is a wrong place (16.1b). **Resolution:** Fixed: "drop within one club-length, no nearer the hole and clear of it", in a sentence that opens "In the general area".
- *Rules accuracy (agent A), nit:* "Where the condition no longer affects the shot" could be read to include line of play in the general area (Definitions: Nearest Point of Complete Relief). **Resolution:** Fixed: "clear of it for the shot you'd have played", after a sentence that defines interference as lie, stance or swing (line only on the green).
- *Rules accuracy (agent A), gap:* Q2 (soggy fairway) isn't answered in the summary (Definitions: Temporary Water). **Resolution:** Kept as a pointer, with Definitions: Temporary Water linked. Same position as Rule 12's Q4.
- *Rules accuracy (agent A), nit:* Only artificially surfaced paths are obstructions (Definitions: Obstruction). **Resolution:** Fixed: "paved paths", with Definitions: Obstruction added as a source.
- *Rules accuracy (agent A), nit:* No relief for a ball embedded in sand in an area not cut to fairway height; the Committee may limit embedded relief to fairway height. **Resolution:** Not added. The summary states the default; it names no Model Local Rule.
- *Rules accuracy (agent A), nit:* The interference sentence followed a list that includes dangerous animals and plugged balls, but describes only abnormal course conditions. **Resolution:** Fixed: it now opens "A condition must interfere...".
- *Rules accuracy (agent A), nit:* 16.1c, 16.1d supported no sentence. **Resolution:** Fixed: both removed.
- *Site rules (agent B), should-fix:* "One" had no clear antecedent, and the phrase about the green needed commas. **Resolution:** Fixed: "A condition must interfere with your lie, stance or swing, or, on the green, your line"; the distraction clause was later cut for length.
- *Site rules (agent B), nit:* "General area" isn't explained; "embedded" isn't used though cited; the alias "casual water" has nothing on the card. **Resolution:** Not added, for length (118 words). The Definitions links cover embedded and general area; the alias is for search only, as inventory.md intends.
- *Site rules (agent B), nit:* The nearest-point sentence was 44 words with "no nearer the hole" twice. **Resolution:** Rejoined into one sentence after Codex's embedded-ball finding: the two "no nearer the hole" limits stay, one on the reference point and one on the drop.
- *Codex, on the pull request, P2:* The nearest-point procedure was written as if it applied to a plugged ball too; 16.3b measures from the spot right behind the embedded ball. **Resolution:** Fixed: "For a plugged ball, the club-length is measured from the spot just behind it." To fit, the distraction clause was cut and two sentences were joined.

**Copy distance:** longest run shared with the R&A text is 7 words ("for a ball in the general area"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 17 · Penalty Areas

**Summary (120 words):** Rule 17 covers penalty areas: any body of water on the course plus other areas the Committee defines, marked red or yellow (unmarked counts as red). You can play the ball as it lies, grounding the club and moving loose impediments as in the general area. Or, for one penalty stroke, replay from where you last played, or drop outside the area on a line back from the hole through where the ball last crossed into it. Red adds a drop outside it within two club-lengths of that point, no nearer the hole. Without finding the ball, you need it known or virtually certain (at least 95 percent likely) to be in the area; otherwise it's lost, under Rule 18.

**Look here when:** Red stakes or yellow stakes: what's the difference? · Can I ground my club or move leaves in a penalty area? · Nobody saw my ball go in the water: can I still drop by the pond? · Can I declare my ball unplayable in a penalty area?

**Glossary:** `penalty-area` · **Aliases:** `water hazard` · **Sources:** 17, 17.1b, 17.1c, 17.1d, 17.3, Definitions: Penalty Area, Definitions: Club-Length, Definitions: Known or Virtually Certain

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 17 covers penalty areas: any body of water on the course plus other areas the Committee defines, marked red or yellow (unmarked counts as red). | Definitions: Penalty Area |
| 2 | You can play the ball as it lies, grounding the club and moving loose impediments as in the general area. | [17.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-17#17_1b) |
| 3 | Or, for one penalty stroke, replay from where you last played, or drop outside the area on a line back from the hole through where the ball last crossed into it. | [17.1d](https://www.randa.org/en/rog/the-rules-of-golf/rule-17#17_1d) |
| 4 | Red adds a drop outside it within two club-lengths of that point, no nearer the hole. | [17.1d](https://www.randa.org/en/rog/the-rules-of-golf/rule-17#17_1d), Definitions: Club-Length |
| 5 | Without finding the ball, you need it known or virtually certain (at least 95 percent likely) to be in the area; otherwise it's lost, under Rule 18. | [17.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-17#17_1c), Definitions: Known or Virtually Certain |
| Q1 | Red stakes or yellow stakes: what's the difference? | [17.1d](https://www.randa.org/en/rog/the-rules-of-golf/rule-17#17_1d), Definitions: Penalty Area |
| Q2 | Can I ground my club or move leaves in a penalty area? | [17.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-17#17_1b) |
| Q3 | Nobody saw my ball go in the water: can I still drop by the pond? | [17.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-17#17_1c) |
| Q4 | Can I declare my ball unplayable in a penalty area? | [17.3](https://www.randa.org/en/rog/the-rules-of-golf/rule-17#17_3) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* The known-or-virtually-certain sentence didn't say what happens otherwise: the ball is lost and stroke and distance applies (17.1c, 18.2b). **Resolution:** Fixed: "otherwise it's lost, under Rule 18."
- *Rules accuracy (agent A), gap:* 17.3 backs only Q4 (no unplayable or free relief in a penalty area). **Resolution:** Kept as a pointer; Rule 19's overview says unplayable relief isn't available in a penalty area, and Rule 16's that its free relief isn't.
- *Rules accuracy (agent A), gap:* "Two club-lengths" without Definitions: Club-Length among the sources. **Resolution:** Fixed: added.
- *Rules accuracy (agent A), nit:* The back-on-the-line drop must be outside the penalty area (17.1d(2)). **Resolution:** Fixed: "drop outside the area on a line back from the hole...".
- *Rules accuracy (agent A), nit:* Ditches are penalty areas even when dry, unless the Committee makes them general area. **Resolution:** Not added, for length.
- *Site rules (agent B), nit:* "Red adds a drop" is clipped. **Resolution:** Kept, for length (120 words).
- *Site rules (agent B), nit:* Q3 "Nobody saw it go in the water" had no antecedent for "it". **Resolution:** Fixed: "Nobody saw my ball go in the water".
- *Site rules (agent B), nit:* The alias "water hazard" has nothing on the card; loose impediments, general area and the Committee aren't explained. **Resolution:** Not added, for length. "Water hazard" is an old name and isn't in the 2023 text; the alias is for search, as inventory.md intends.

**Copy distance:** longest run shared with the R&A text is 7 words ("any body of water on the course"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 18 · Stroke-and-Distance Relief, Ball Lost or Out of Bounds, Provisional Ball

**Summary (119 words):** Rule 18 covers stroke and distance: one penalty stroke, then replay from where you last played. It's always available, and required for a ball out of bounds, or for a lost ball unless Rule 18.2b allows other relief, as when it's known or virtually certain the ball is in a penalty area. A ball is lost if it isn't found within three minutes of you or your caddie starting to look; it's out of bounds only if all of it lies past the boundary's course-side edge, usually white stakes or lines. If your ball might be out of bounds, or lost somewhere other than a penalty area, you may hit a provisional ball, but call it a provisional first.

**Look here when:** How long can I look for my ball? · Is a ball sitting on the white line in or out of bounds? · When can I hit a provisional, and what do I have to say? · I found my first ball after hitting a provisional: which do I play?

**Glossary:** `mulligan` · **Aliases:** `OB` · **Sources:** 18, 18.1, 18.2a, 18.2b, 18.3a, 18.3b, 18.3c, Definitions: Stroke and Distance, Definitions: Lost, Definitions: Out of Bounds, Definitions: Known or Virtually Certain, Definitions: Provisional Ball

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 18 covers stroke and distance: one penalty stroke, then replay from where you last played. | [18.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_1), Definitions: Stroke and Distance |
| 2 | It's always available, and required for a ball out of bounds, or for a lost ball unless Rule 18.2b allows other relief, as when it's known or virtually certain the ball is in a penalty area. | [18.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_1), [18.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_2b), Definitions: Known or Virtually Certain |
| 3 | A ball is lost if it isn't found within three minutes of you or your caddie starting to look; it's out of bounds only if all of it lies past the boundary's course-side edge, usually white stakes or lines. | [18.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_2a), Definitions: Lost, Definitions: Out of Bounds |
| 4 | If your ball might be out of bounds, or lost somewhere other than a penalty area, you may hit a provisional ball, but call it a provisional first. | [18.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_3a), [18.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_3b), Definitions: Provisional Ball |
| Q1 | How long can I look for my ball? | [18.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_2a), Definitions: Lost |
| Q2 | Is a ball sitting on the white line in or out of bounds? | [18.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_2a), Definitions: Out of Bounds |
| Q3 | When can I hit a provisional, and what do I have to say? | [18.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_3a), [18.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_3b) |
| Q4 | I found my first ball after hitting a provisional: which do I play? | [18.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_3c) |

**Review findings and resolution:**

- *Rules accuracy (agent A), error:* "Three minutes after the search starts" put the clock in the wrong place: it starts when the player or their caddie begins to search (Definitions: Lost, 18.2a(1)). **Resolution:** Fixed: "within three minutes of you or your caddie starting to look."
- *Rules accuracy (agent A), gap:* "Past the boundary" invites the wrong answer to Q2: the boundary is the course-side edge of the stakes or line, and the line itself is out (Definitions: Out of Bounds). **Resolution:** Fixed: "out of bounds only if all of it lies past the boundary's course-side edge, usually white stakes or lines."
- *Rules accuracy (agent A), gap:* "Announce it first": the player must say "provisional" or otherwise make it clear; "I'll hit another" makes the new ball the ball in play (18.3b). **Resolution:** Fixed: "but call it a provisional first."
- *Rules accuracy (agent A), nit:* The exceptions apply to a ball that hasn't been found; the "unless" shouldn't read as covering an out-of-bounds ball (18.2b). **Resolution:** Fixed together with agent B's copy-distance error on the same sentence: "required for a ball out of bounds, or for a lost ball unless Rule 18.2b allows other relief".
- *Rules accuracy (agent A), nit:* 18.3c backs only Q4; the re-tee example would be better with 14.6a. **Resolution:** 18.3c kept as Q4's pointer. The re-tee example was cut to fit the fixes above, so 14.6a isn't needed.
- *Site rules (agent B), error:* Copy distance: "it's known or virtually certain that the ball", with the contraction expanded, is a 9-word run from 18.2b. A word-by-word check that doesn't expand "it's" reported 7 and passed. **Resolution:** Fixed: the sentence was rewritten (see below). The drafter's checker now expands contractions and small numbers too, and every overview was rerun through it.
- *Site rules (agent B), should-fix:* "Another case Rule 18.2b lists" read as a place, and the "unless" seemed to cover out of bounds. **Resolution:** Fixed with agent A's matching nit: "required for a ball out of bounds, or for a lost ball unless Rule 18.2b allows other relief, as when it's known or virtually certain the ball is in a penalty area."
- *Site rules (agent B), nit:* "If a shot might be" should be "If your ball might be"; "that shot is your third" could be read as the drive. **Resolution:** Fixed: "If your ball might be"; the re-tee example was cut.
- *Site rules (agent B), nit:* "Provisional ball" isn't explained; Definitions: Stroke and Distance isn't cited though canonical-map.md makes rule-18 its owner. **Resolution:** Definitions: Stroke and Distance and Definitions: Provisional Ball are both cited; the first sentence explains stroke and distance. No words added for the provisional, for length.
- *Site rules (agent B), nit:* Nothing on the card connects to the mulligan glossary link. **Resolution:** Kept, as inventory.md lists it; the link contrasts a free replay with stroke and distance.

**Copy distance:** longest run shared with the R&A text is 7 words ("when it is known or virtually certain"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 19 · Unplayable Ball

**Summary (112 words):** Rule 19 lets you treat your ball as unplayable anywhere except a penalty area, and only you can make that call. Each option costs one penalty stroke: play again from where you last played; drop on a line back from the hole through the ball's spot, as far back as you like; or drop within two club-lengths of the ball, no nearer the hole, measuring from the ground beneath it if it's up a tree. Only stroke and distance works if you can't find the ball. In a bunker, the two drops stay in the bunker, or you can drop back on the line outside it for two penalty strokes in total.

**Look here when:** My ball is under a bush: what are my options? · Can I declare my ball unplayable in a bunker? · Can I take unplayable relief if I can't find my ball? · My ball is stuck in a tree: where do I drop?

**Glossary:** `bunker` · **Aliases:** none · **Sources:** 19, 19.1, 19.2, 19.2a, 19.2b, 19.2c, 19.3a, 19.3b, Definitions: Club-Length

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 19 lets you treat your ball as unplayable anywhere except a penalty area, and only you can make that call. | [19.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_1) |
| 2 | Each option costs one penalty stroke: play again from where you last played; drop on a line back from the hole through the ball's spot, as far back as you like; or drop within two club-lengths of the ball, no nearer the hole, measuring from the ground beneath it if it's up a tree. | [19.2](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_2), [19.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_2a), [19.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_2b), [19.2c](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_2c), Definitions: Club-Length |
| 3 | Only stroke and distance works if you can't find the ball. | [19.2](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_2) |
| 4 | In a bunker, the two drops stay in the bunker, or you can drop back on the line outside it for two penalty strokes in total. | [19.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_3a), [19.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_3b) |
| Q1 | My ball is under a bush: what are my options? | [19.2](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_2) |
| Q2 | Can I declare my ball unplayable in a bunker? | [19.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_3a), [19.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_3b) |
| Q3 | Can I take unplayable relief if I can't find my ball? | [19.2](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_2) |
| Q4 | My ball is stuck in a tree: where do I drop? | [19.2c](https://www.randa.org/en/rog/the-rules-of-golf/rule-19#19_2c) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* "Two club-lengths" without Definitions: Club-Length among the sources. **Resolution:** Fixed: added.
- *Rules accuracy (agent A), gap:* Q4 (ball up a tree): the lateral reference point is the spot on the ground right below it (19.2c). **Resolution:** Fixed: "measuring from the ground beneath it if it's up a tree."
- *Rules accuracy (agent A), nit:* State the converse: stroke and distance works even if the ball is never found (19.2). **Resolution:** Fixed: "Only stroke and distance works if you can't find the ball."
- *Site rules (agent B), nit:* The penalty-area exclusion was said twice. **Resolution:** Fixed: the second one was cut.
- *Site rules (agent B), nit:* "Two club-lengths" isn't explained and no Definitions source was cited. **Resolution:** Definitions: Club-Length added, as agent A also asked.

**Copy distance:** longest run shared with the R&A text is 6 words ("within two club lengths of the"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

## #237 · Rules 1–11

Foundations and equipment (1–4) and playing the round (5–11). Sources opened November 6, 2026; both reviewer agents ran the same day.

**Result.** Agent A found 5 errors, all fixed:

- Rule 6 read as if you could swap balls mid-hole for free.
- Rule 8 gave a practice swing the same protection as the stroke.
- Rule 9 missed the two cases where a ball moved by wind is put back.
- Rule 11 said a putt that hits the person tending the flagstick is replayed.
- Rule 11 banned moving anything while a ball is in motion, which is broader than 11.3.

Agent B found 1 error, also fixed: Rule 9 shared a 12-word run with 9.2a once "it's" is read as "it is".

Codex then reviewed the pull request and raised four P2 points, all fixed: no between-hole practice from a bunker (Rule 5), a placed ball moved by wind into another area is put back too (Rule 9), others may still give some aiming help (Rule 10), and a putt that hits a ball-marker isn't replayed (Rule 11). Its second review raised three more, also fixed: accidental movement while applying a Rule is free (Rule 9), a provisional isn't a wrong ball (Rule 6), and the replay applies only to what a putt hits on the green (Rule 11). A third review raised three more, also fixed: a disturbed sand lie is re-created even if the ball didn't move (Rule 7), the accident exception covers specific actions, not every Rule (Rule 9), and stopping an opponent's dead ball to concede is allowed in match play (Rule 11). After your approval, a fourth review found one more, fixed and put to you before merging: you lift a ball to identify it only when you can't identify it as it lies (Rule 7).

The two rules #237 singles out now say plainly what is a Committee matter. Rule 4 names the one Committee matter in the default Rule, a Local Rule banning distance devices, and says who the Committee is. Rule 10 says the advice limits cover the others in your group.

Each summary is 117–120 words. The longest run shared with the official text is 7 words. `npm run lint:content` passes, and all 69 subrule anchors and 10 Definitions citations resolve against the pages fetched that day. Copy uses US spelling, as the rest of the site does; rule titles stay as the R&A writes them.

**Owner calls** (approved on November 6, 2026, with the drafter's positions as written):

1. **Rule 1 and house rules.** The card says players who agree to ignore a Rule they know applies are disqualified, and that mulligans and breakfast balls are house rules, not Rules. Both statements are what the Rules and `canonical-map.md` rule 4 say. The card doesn't spell out what follows: a group that plays breakfast balls by agreement isn't playing under the Rules. Agent B asked that you see the two sentences side by side. Confirm the tone, or ask for the second sentence to go first.
2. **Questions as pointers.** As in #238, three questions are mapped to their subrules but not answered on the card: Rule 4 Q4 (broken club), Rule 6 Q4 (who tees off first) and Rule 10 Q3 (club on the ground to aim).
3. **Related reading.** `canonical-map.md` says Rule 3's overview should link `/blog/match-play-vs-stroke-play` and `/games`, Rule 21's `/games`, and Rule 23's `/blog/best-ball-vs-scramble`. The records leave `relatedContentPaths` empty for now. `scripts/test-rules.mjs` runs the shipped records against a fixture that serves only four paths, and that test is outside this task's files. #242 (discovery) can add the links and the fixture paths together.

### Rule 1 · The Game, Player Conduct and the Rules

**Summary (119 words):** Rule 1 sets out the principles: play the course as you find it, play the ball as it lies, and play in the spirit of the game, with integrity, consideration for others and care for the course. You apply your own penalties, at three main levels: one stroke, the general penalty (two strokes in stroke play, loss of the hole in match play) and disqualification. Players who agree to ignore a Rule or penalty they know applies are disqualified once any of them has started the round. Mulligans and breakfast balls are house rules, not Rules: hitting again puts a new ball in play under Rule 18, with a penalty stroke, and the first ball is out of play.

**Look here when:** Is a mulligan or a breakfast ball ever allowed under the Rules? · Do I have to call a penalty on myself? · What happens if our group agrees to skip a Rule? · What's the difference between a one-stroke penalty and the general penalty?

**Glossary:** `mulligan`, `breakfast-ball` · **Aliases:** `mulligan`, `breakfast ball` · **Sources:** 1, 1.1, 1.2a, 1.3b, 1.3c, 18.1, Definitions: General Penalty

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 1 sets out the principles: play the course as you find it, play the ball as it lies, and play in the spirit of the game, with integrity, consideration for others and care for the course. | [1.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-1#1_1), [1.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-1#1_2a) |
| 2 | You apply your own penalties, at three main levels: one stroke, the general penalty (two strokes in stroke play, loss of the hole in match play) and disqualification. | [1.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-1#1_3b), [1.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-1#1_3c), Definitions: General Penalty |
| 3 | Players who agree to ignore a Rule or penalty they know applies are disqualified once any of them has started the round. | [1.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-1#1_3b) |
| 4 | Mulligans and breakfast balls are house rules, not Rules: hitting again puts a new ball in play under Rule 18, with a penalty stroke, and the first ball is out of play. | [18.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_1) |
| Q1 | Is a mulligan or a breakfast ball ever allowed under the Rules? | [18.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_1) |
| Q2 | Do I have to call a penalty on myself? | [1.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-1#1_3b) |
| Q3 | What happens if our group agrees to skip a Rule? | [1.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-1#1_3b) |
| Q4 | What's the difference between a one-stroke penalty and the general penalty? | [1.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-1#1_3c), Definitions: General Penalty |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* "Hitting again is stroke and distance" didn't say the first ball is then out of play even if found; only an announced provisional keeps it alive (18.1, 18.3). **Resolution:** Fixed: "hitting again puts a new ball in play under Rule 18, with a penalty stroke, and the first ball is out of play." The provisional is in Rule 18's overview.
- *Rules accuracy (agent A), nit:* "Knowingly agree to ignore a Rule": the test is that they know the Rule or penalty applies (1.3b(1)). **Resolution:** Fixed: "agree to ignore a Rule or penalty they know applies".
- *Rules accuracy (agent A), nit:* 1.3c(2) says three main levels. **Resolution:** Fixed: "three main levels".
- *Rules accuracy (agent A), nit:* "From the same spot" is loose (14.6). **Resolution:** Wording removed in the rewrite.
- *Site rules (agent B), should-fix:* The disqualification sentence followed by the mulligan sentence told a group that plays breakfast balls it is "all disqualified", and the record never called these house rules (canonical-map.md rule 4). **Resolution:** Fixed: "Mulligans and breakfast balls are house rules, not Rules". The disqualification sentence states only what 1.3b(1) says. Flagged for the owner below.
- *Site rules (agent B), nit:* "Sets the ground rules" is mild wordplay and could be read as Local Rules; it is also the search snippet. **Resolution:** Fixed: "Rule 1 sets out the principles".
- *Site rules (agent B), nit:* The penalty list was dense. **Resolution:** Fixed: "the general penalty (two strokes in stroke play, loss of the hole in match play)".

**Copy distance:** longest run shared with the R&A text is 7 words ("play the course as you find it"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 2 · The Course

**Summary (119 words):** Rule 2 names the five areas of the course, because where your ball lies changes what you may do: the general area (fairway, rough, trees and everything else) and four specific areas: the teeing area you start from, penalty areas, bunkers, and the putting green on the hole you're playing. Every other tee and green is general area, though you must take free relief from a wrong green. A ball partly in a specific area counts as in it; one in two counts as in the penalty area over a bunker, and bunker over green. You can move loose impediments and movable obstructions without penalty, and abnormal course conditions can give free relief; boundary and integral objects give none.

**Look here when:** My ball is half on the grass and half in the bunker: which area is it in? · Is another hole's green part of the general area? · Which objects and conditions give free relief?

**Glossary:** `teeing-area`, `fairway`, `rough`, `bunker`, `penalty-area` · **Aliases:** none · **Sources:** 2, 2.2a, 2.2b, 2.2c, 2.3, 13.1f, Definitions: General Area, Definitions: Wrong Green

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 2 names the five areas of the course, because where your ball lies changes what you may do: the general area (fairway, rough, trees and everything else) and four specific areas: the teeing area you start from, penalty areas, bunkers, and the putting green on the hole you're playing. | [2.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-2#2_2a), [2.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-2#2_2b), [2.2c](https://www.randa.org/en/rog/the-rules-of-golf/rule-2#2_2c) |
| 2 | Every other tee and green is general area, though you must take free relief from a wrong green. | Definitions: General Area, [13.1f](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_1f), Definitions: Wrong Green |
| 3 | A ball partly in a specific area counts as in it; one in two counts as in the penalty area over a bunker, and bunker over green. | [2.2c](https://www.randa.org/en/rog/the-rules-of-golf/rule-2#2_2c) |
| 4 | You can move loose impediments and movable obstructions without penalty, and abnormal course conditions can give free relief; boundary and integral objects give none. | [2.3](https://www.randa.org/en/rog/the-rules-of-golf/rule-2#2_3) |
| Q1 | My ball is half on the grass and half in the bunker: which area is it in? | [2.2c](https://www.randa.org/en/rog/the-rules-of-golf/rule-2#2_2c) |
| Q2 | Is another hole's green part of the general area? | Definitions: General Area, Definitions: Wrong Green |
| Q3 | Which objects and conditions give free relief? | [2.3](https://www.randa.org/en/rog/the-rules-of-golf/rule-2#2_3) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* Other holes' greens are general area, but a ball on a wrong green must take free relief (13.1f). **Resolution:** Fixed: "though you must take free relief from a wrong green"; 13.1f and Definitions: Wrong Green added.
- *Rules accuracy (agent A), nit:* Every other teeing location, including other tees on the same hole, and practice greens are general area. **Resolution:** Fixed: "Every other tee and green is general area".
- *Rules accuracy (agent A), nit:* In a bunker the ball must touch sand (12.1); in a penalty area overhanging counts (17.1a). **Resolution:** Not added, for length; "partly in a specific area" defers to each area's own test, which Rules 12 and 17 state.
- *Rules accuracy (agent A), nit:* 2.1 supported nothing. **Resolution:** Fixed: removed.
- *Site rules (agent B), should-fix:* "Specific area" was used without being introduced. **Resolution:** Fixed: "the general area (...) and four specific areas: ...".
- *Site rules (agent B), should-fix:* "Penalty area comes before bunker" could be read as order on the hole. **Resolution:** Fixed: "one in two counts as in the penalty area over a bunker, and bunker over green."
- *Site rules (agent B), should-fix:* "Loose impediments ... can give free relief" invited a free drop away from a leaf. **Resolution:** Fixed: "You can move loose impediments and movable obstructions without penalty, and abnormal course conditions can give free relief".
- *Site rules (agent B), nit:* Q3 should say objects and conditions. **Resolution:** Fixed: "Which objects and conditions give free relief?"

**Copy distance:** longest run shared with the R&A text is 5 words ("five areas of the course"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 3 · The Competition

**Summary (119 words):** Rule 3 covers the three choices behind every competition: match play or stroke play, individual or partners, and gross or net scores. In match play you win, lose or tie holes, and you may concede your opponent's next stroke, a hole or the whole match; a concession can't be declined or withdrawn. In stroke play you must hole out on every hole, with no gimmes; finish an unfinished hole before the next tee or you're disqualified. You and your marker certify the scorecard: a hole score too high stands; one too low disqualifies you, unless it's short only by a penalty you had no reason to suspect. In a handicap match, the stroke index decides which holes get strokes.

**Look here when:** Can we give each other gimmes in stroke play? · Can I take back a putt I've conceded? · What if I sign for the wrong score on a hole? · Where do handicap strokes fall in a match?

**Glossary:** `match-play`, `stroke-play`, `gimme`, `net-score`, `handicap-stroke` · **Aliases:** none · **Sources:** 3, 3.1a, 3.1b, 3.1c, 3.2a, 3.2b, 3.2c, 3.3b, 3.3c

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 3 covers the three choices behind every competition: match play or stroke play, individual or partners, and gross or net scores. | [3.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_1a), [3.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_1b), [3.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_1c) |
| 2 | In match play you win, lose or tie holes, and you may concede your opponent's next stroke, a hole or the whole match; a concession can't be declined or withdrawn. | [3.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_2a), [3.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_2b) |
| 3 | In stroke play you must hole out on every hole, with no gimmes; finish an unfinished hole before the next tee or you're disqualified. | [3.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_3c) |
| 4 | You and your marker certify the scorecard: a hole score too high stands; one too low disqualifies you, unless it's short only by a penalty you had no reason to suspect. | [3.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_3b) |
| 5 | In a handicap match, the stroke index decides which holes get strokes. | [3.2c](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_2c) |
| Q1 | Can we give each other gimmes in stroke play? | [3.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_2b), [3.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_3c) |
| Q2 | Can I take back a putt I've conceded? | [3.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_2b) |
| Q3 | What if I sign for the wrong score on a hole? | [3.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_3b) |
| Q4 | Where do handicap strokes fall in a match? | [3.2c](https://www.randa.org/en/rog/the-rules-of-golf/rule-3#3_2c) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* The unknown-penalty exception is narrower than "a penalty you didn't know about": not for disqualification, not if you were told or unsure and didn't raise it (3.3b(3)); and the sentence is stroke play only. **Resolution:** Fixed: "unless it's short only by a penalty you had no reason to suspect", in the stroke-play part of the summary.
- *Rules accuracy (agent A), gap:* No consequence for failing to hole out (3.3c). **Resolution:** Fixed: "finish an unfinished hole before the next tee or you're disqualified."
- *Rules accuracy (agent A), nit:* A blanket "inside the leather is good" isn't a valid concession. **Resolution:** Not added, for length; the conceded-putt situation (#241) covers it.
- *Rules accuracy (agent A), nit:* "Every stroke counts" ignores strokes that don't count (6.1b, 6.3c). **Resolution:** Fixed: the phrase was cut.
- *Site rules (agent B), should-fix:* The scorecard sentence didn't say it was stroke play. **Resolution:** Fixed: it now follows the "In stroke play" sentence directly.
- *Site rules (agent B), should-fix:* "Strokes fall hole by hole by the stroke index" was awkward. **Resolution:** Fixed: "In a handicap match, the stroke index decides which holes get strokes."
- *Site rules (agent B), nit:* "Concede a stroke" could be read as admitting a stroke. **Resolution:** Fixed: "concede your opponent's next stroke, a hole or the whole match" ("whole" kept: without it the phrase is an 8-word run).
- *Site rules (agent B), nit:* canonical-map.md pairs Rule 3 with /blog/match-play-vs-stroke-play and lets it link /games. **Resolution:** Deferred, flagged for the owner below: added, then taken out, because scripts/test-rules.mjs runs the shipped records against a fixture that serves only four paths, and that test file is outside this batch's files.

**Copy distance:** longest run shared with the R&A text is 7 words ("opponent's next stroke a hole or the"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 4 · The Player’s Equipment

**Summary (120 words):** Rule 4 covers the clubs, balls and other equipment you may use. Start with no more than 14 clubs. Carry more and it's two penalty strokes per hole with the breach, up to four, in stroke play; in match play, a hole off the match score for each, up to two. Declare any extra club out of play before your next stroke. You can't borrow a club from anyone playing on the course, though partners may share 14. Clubs and balls must conform; hitting a club you adjusted mid-round, without resetting it, is disqualification. A rangefinder for distance is allowed unless the Committee, whoever runs the competition or course, bans it by Local Rule; measuring slope or wind is not.

**Look here when:** I found a 15th club in my bag: what now? · Can I use a rangefinder with a slope setting? · Can I borrow a club from someone in my group? · My club broke during the round: can I replace it?

**Glossary:** `driver`, `putter` · **Aliases:** `14 clubs`, `club limit` · **Sources:** 4, 4.1a, 4.1b, 4.1c, 4.2a, 4.3a, 22.5, 23.7, Definitions: Committee

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 4 covers the clubs, balls and other equipment you may use. | [Rule 4](https://www.randa.org/en/rog/the-rules-of-golf/rule-4) |
| 2 | Start with no more than 14 clubs. | [4.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1b) |
| 3 | Carry more and it's two penalty strokes per hole with the breach, up to four, in stroke play; in match play, a hole off the match score for each, up to two. | [4.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1b) |
| 4 | Declare any extra club out of play before your next stroke. | [4.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1c) |
| 5 | You can't borrow a club from anyone playing on the course, though partners may share 14. | [4.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1b), [22.5](https://www.randa.org/en/rog/the-rules-of-golf/rule-22#22_5), [23.7](https://www.randa.org/en/rog/the-rules-of-golf/rule-23#23_7) |
| 6 | Clubs and balls must conform; hitting a club you adjusted mid-round, without resetting it, is disqualification. | [4.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1a), [4.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_2a) |
| 7 | A rangefinder for distance is allowed unless the Committee, whoever runs the competition or course, bans it by Local Rule; measuring slope or wind is not. | [4.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_3a), Definitions: Committee |
| Q1 | I found a 15th club in my bag: what now? | [4.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1b), [4.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1c) |
| Q2 | Can I use a rangefinder with a slope setting? | [4.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_3a) |
| Q3 | Can I borrow a club from someone in my group? | [4.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1b) |
| Q4 | My club broke during the round: can I replace it? | [4.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-4#4_1a) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* The extra club must be declared out of play before your next stroke, by a declaration or clear act (4.1c(1)). **Resolution:** Fixed: "Declare any extra club out of play before your next stroke."
- *Rules accuracy (agent A), gap:* Partners in Foursomes and Four-Ball may share clubs if they carry 14 or fewer between them (22.5, 23.7). **Resolution:** Fixed: "though partners may share 14"; 22.5 and 23.7 added.
- *Rules accuracy (agent A), gap:* The ball half of "clubs and balls must conform" is 4.2a, not cited. **Resolution:** Fixed: 4.2a added.
- *Rules accuracy (agent A), gap:* Q4 (broken club) gets no answer; 4.1a(2) is cited. **Resolution:** Kept as a pointer to 4.1a(2), for length. Flagged for the owner below.
- *Rules accuracy (agent A), nit:* No penalty if an adjusted setting is put back before the club is used (4.1a(3) Exception). **Resolution:** Fixed: "a club you adjusted mid-round, without resetting it".
- *Rules accuracy (agent A), nit:* A slope-capable rangefinder is fine with slope off (4.3). **Resolution:** The copy bans measuring slope, not carrying the device; left as is.
- *Site rules (agent B), should-fix:* "A hole comes off your match score per hole" was muddled. **Resolution:** Fixed: "in match play, a hole off the match score for each, up to two."
- *Site rules (agent B), nit:* "At the course" suggested measuring elsewhere is fine. **Resolution:** Fixed: removed.
- *Site rules (agent B), should-fix:* #237 asks Rules 4 and 10 to say plainly what is a Committee matter; "Committee" was never explained. **Resolution:** Fixed: "the Committee, whoever runs the competition or course", with Definitions: Committee added. The rangefinder is the only Committee matter in the default Rule 4.

**Copy distance:** longest run shared with the R&A text is 5 words ("clubs balls and other equipment"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 5 · Playing the Round

**Summary (117 words):** Rule 5 covers starting on time, practicing, keeping pace and stopping play. Up to five minutes late but ready to play, or up to five minutes early, is the general penalty on the first hole; beyond that is disqualification. By default you can't practice on the course before a stroke-play round that day, except putting or chipping near the first tee; before a match you can. You can't hit practice shots during a hole, though between holes you may putt or chip near the green just finished or the next tee, but not from a bunker. The Committee can change these limits by Local Rule. You may stop for lightning, but must report it to the Committee.

**Look here when:** Can I hit a few putts on the green after we finish a hole? · What happens if I'm late to the first tee? · Can I practice on the course before a stroke-play round? · Can I stop playing when there's lightning?

**Glossary:** none · **Aliases:** none · **Sources:** 5, 5.2a, 5.2b, 5.3a, 5.5a, 5.5b, 5.6b, 5.7a

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 5 covers starting on time, practicing, keeping pace and stopping play. | [Rule 5](https://www.randa.org/en/rog/the-rules-of-golf/rule-5), [5.6b](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_6b) |
| 2 | Up to five minutes late but ready to play, or up to five minutes early, is the general penalty on the first hole; beyond that is disqualification. | [5.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_3a) |
| 3 | By default you can't practice on the course before a stroke-play round that day, except putting or chipping near the first tee; before a match you can. | [5.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_2a), [5.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_2b) |
| 4 | You can't hit practice shots during a hole, though between holes you may putt or chip near the green just finished or the next tee, but not from a bunker. | [5.5a](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_5a), [5.5b](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_5b) |
| 5 | The Committee can change these limits by Local Rule. | [5.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_2b), [5.5b](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_5b) |
| 6 | You may stop for lightning, but must report it to the Committee. | [5.7a](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_7a) |
| Q1 | Can I hit a few putts on the green after we finish a hole? | [5.5b](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_5b) |
| Q2 | What happens if I'm late to the first tee? | [5.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_3a) |
| Q3 | Can I practice on the course before a stroke-play round? | [5.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_2b) |
| Q4 | Can I stop playing when there's lightning? | [5.7a](https://www.randa.org/en/rog/the-rules-of-golf/rule-5#5_7a) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* No practice before a stroke-play round was stated as absolute; 5.2b allows putting or chipping near the first tee, and the Committee can change the default either way (Model Local Rule I-1, named in 5.2b). **Resolution:** Fixed: "By default ... except putting or chipping near the first tee" and "The Committee can change these limits by Local Rule." No Model Local Rule is named or implied to be in force.
- *Rules accuracy (agent A), gap:* Practising on the green just finished can be banned by Local Rule (I-2, named in 5.5b). **Resolution:** Covered by the same Committee sentence.
- *Rules accuracy (agent A), nit:* Starting up to five minutes early is also the general penalty (5.3a Exception 2). **Resolution:** Fixed.
- *Rules accuracy (agent A), nit:* The 40 seconds is only a recommendation; the Committee's pace policy may set real limits. **Resolution:** The 40-second sentence was cut for length.
- *Rules accuracy (agent A), nit:* 5.1 supported nothing. **Resolution:** Fixed: removed.
- *Site rules (agent B), nit:* "Arrive ready but up to five minutes late" was awkward; "practise" is British spelling. **Resolution:** Fixed: "Up to five minutes late but ready to play, ..."; US "practice" throughout the copy (the R&A titles stay verbatim).
- *Codex, on the pull request, P2:* Between-hole putting or chipping may not be from a bunker (5.5b), even without a Local Rule. **Resolution:** Fixed: "but not from a bunker". The first sentence was shortened to fit.

**Copy distance:** longest run shared with the R&A text is 5 words ("the general penalty on the"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 6 · Playing a Hole

**Summary (120 words):** Rule 6 covers playing a hole: teeing off, the ball you use and the order of play. Tee off inside the teeing area, two club-lengths deep behind the front of the tee markers. Outside it, stroke play costs two penalty strokes and a replay; match play has no penalty, but your opponent may make you replay. Hole out with the ball you started with unless it's lost or out of bounds or a Rule lets you change it, as when taking relief; a swap otherwise costs a stroke. Playing a wrong ball, one that isn't your ball in play or your provisional, costs the general penalty; in stroke play, return to your own before the next tee or be disqualified.

**Look here when:** I teed up in front of the markers: what's the penalty? · Can I switch to a new ball in the middle of a hole? · I played someone else's ball by mistake: what now? · Who tees off first on the next hole?

**Glossary:** `teeing-area` · **Aliases:** `wrong ball` · **Sources:** 6, 6.1b, 6.2b, 6.3a, 6.3b, 6.3c, 6.4a, 6.4b, Definitions: Teeing Area, Definitions: Wrong Ball

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 6 covers playing a hole: teeing off, the ball you use and the order of play. | [Rule 6](https://www.randa.org/en/rog/the-rules-of-golf/rule-6), [6.4a](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_4a), [6.4b](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_4b) |
| 2 | Tee off inside the teeing area, two club-lengths deep behind the front of the tee markers. | [6.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_2b), Definitions: Teeing Area |
| 3 | Outside it, stroke play costs two penalty strokes and a replay; match play has no penalty, but your opponent may make you replay. | [6.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_1b) |
| 4 | Hole out with the ball you started with unless it's lost or out of bounds or a Rule lets you change it, as when taking relief; a swap otherwise costs a stroke. | [6.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_3a), [6.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_3b) |
| 5 | Playing a wrong ball, one that isn't your ball in play or your provisional, costs the general penalty; in stroke play, return to your own before the next tee or be disqualified. | [6.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_3c), Definitions: Wrong Ball |
| Q1 | I teed up in front of the markers: what's the penalty? | [6.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_1b) |
| Q2 | Can I switch to a new ball in the middle of a hole? | [6.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_3b) |
| Q3 | I played someone else's ball by mistake: what now? | [6.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_3c) |
| Q4 | Who tees off first on the next hole? | [6.4a](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_4a), [6.4b](https://www.randa.org/en/rog/the-rules-of-golf/rule-6#6_4b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), error:* "Unless ... you substitute another" read as if swapping balls were a free option; substitution is allowed only when a Rule allows it, otherwise one penalty stroke (6.3b). **Resolution:** Fixed: "unless it's lost or out of bounds or a Rule lets you change it, as when taking relief; a swap otherwise costs a stroke."
- *Rules accuracy (agent A), gap:* In stroke play the wrong-ball strokes don't count and failing to correct before the next tee is disqualification (6.1b(2), 6.3c(1)). **Resolution:** Fixed for the wrong ball: "in stroke play, return to your own before the next tee or be disqualified." The teeing-area sentence says "a replay"; the disqualification detail is left to 6.1b, for length.
- *Rules accuracy (agent A), gap:* Q4 (honour) gets no answer. **Resolution:** Kept as a pointer to 6.4a and 6.4b; the out-of-turn sentence was cut for length. Flagged for the owner below.
- *Rules accuracy (agent A), nit:* A provisional or a second ball under 14.7b isn't a wrong ball. **Resolution:** Fixed: "a wrong ball, one that isn't your ball in play or your provisional" (narrowed again after Codex's finding below).
- *Rules accuracy (agent A), nit:* Feet may be outside the teeing area (6.2b(1)). **Resolution:** Not added, for length.
- *Site rules (agent B), should-fix:* Same substitution point as agent A; "(any ball not yours in play)" parsed two ways. **Resolution:** Fixed with agent A's error.
- *Site rules (agent B), nit:* "Honour" is British; "tee-markers" doesn't match the glossary's "tee markers". **Resolution:** Fixed: Q4 is now "Who tees off first on the next hole?"; "tee markers".
- *Codex, on the pull request, P2:* Second review: "one that isn't your ball in play" would make a properly announced provisional a wrong ball (6.3d, 18.3c(1); Definitions: Wrong Ball). **Resolution:** Fixed: "one that isn't your ball in play or your provisional". A second ball under 14.7b or 20.1c is left to the Definition, for length.

**Copy distance:** longest run shared with the R&A text is 6 words ("is lost or out of bounds"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 7 · Ball Search: Finding and Identifying Ball

**Summary (120 words):** Rule 7 covers finding and identifying your ball. You have three minutes from when you or your caddie start looking, then it's lost. You may move grass, bushes, sand and water while searching; it's a penalty only if that goes beyond a reasonable search and improves your next shot. If anyone accidentally moves your ball while looking, there's no penalty; put it back. If searching disturbed sand on it, re-create the lie before playing. If you can't identify a ball as it lies, mark and lift it, cleaning only enough to tell. It's yours if someone saw your ball come to rest, it carries your mark, or it matches yours where yours should be and no identical ball is nearby.

**Look here when:** How long can I search for my ball? · I stepped on my ball while looking for it: is that a penalty? · Can I pick up a ball to see if it's mine? · Two balls of the same brand are in the rough: which is mine?

**Glossary:** none · **Aliases:** none · **Sources:** 7, 7.1a, 7.1b, 7.2, 7.3, 7.4, Definitions: Lost

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 7 covers finding and identifying your ball. | [Rule 7](https://www.randa.org/en/rog/the-rules-of-golf/rule-7) |
| 2 | You have three minutes from when you or your caddie start looking, then it's lost. | Definitions: Lost |
| 3 | You may move grass, bushes, sand and water while searching; it's a penalty only if that goes beyond a reasonable search and improves your next shot. | [7.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-7#7_1a) |
| 4 | If anyone accidentally moves your ball while looking, there's no penalty; put it back. | [7.4](https://www.randa.org/en/rog/the-rules-of-golf/rule-7#7_4) |
| 5 | If searching disturbed sand on it, re-create the lie before playing. | [7.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-7#7_1b) |
| 6 | If you can't identify a ball as it lies, mark and lift it, cleaning only enough to tell. | [7.3](https://www.randa.org/en/rog/the-rules-of-golf/rule-7#7_3) |
| 7 | It's yours if someone saw your ball come to rest, it carries your mark, or it matches yours where yours should be and no identical ball is nearby. | [7.2](https://www.randa.org/en/rog/the-rules-of-golf/rule-7#7_2) |
| Q1 | How long can I search for my ball? | Definitions: Lost |
| Q2 | I stepped on my ball while looking for it: is that a penalty? | [7.4](https://www.randa.org/en/rog/the-rules-of-golf/rule-7#7_4) |
| Q3 | Can I pick up a ball to see if it's mine? | [7.3](https://www.randa.org/en/rog/the-rules-of-golf/rule-7#7_3) |
| Q4 | Two balls of the same brand are in the rough: which is mine? | [7.2](https://www.randa.org/en/rog/the-rules-of-golf/rule-7#7_2) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* Q1 (how long to search) wasn't answered; Definitions: Lost was cited but unused. **Resolution:** Fixed: "You have three minutes from when you or your caddie start looking, then it's lost."
- *Rules accuracy (agent A), gap:* "If someone saw it come to rest" is looser than 7.2: it must be seen in circumstances where it's known to be your ball. **Resolution:** Fixed: "if someone saw your ball come to rest".
- *Rules accuracy (agent A), gap:* Q4 (two identical balls): if you can't tell which is yours, neither is identified. **Resolution:** The summary's "no identical ball is nearby" condition carries it; no words left for the consequence.
- *Rules accuracy (agent A), nit:* Lifting without need, not marking, or over-cleaning is one stroke (7.3); kicking the ball before the search starts is one stroke (7.4). **Resolution:** Not added, for length.
- *Site rules (agent B), should-fix:* "So long as you don't go beyond a reasonable search and improve your next shot" read as two separate bans. **Resolution:** Fixed: "it's a penalty only if that goes beyond a reasonable search and improves your next shot."
- *Codex, on the pull request, P2:* Third review: sand moved in a search must be put back to re-create the lie even if the ball didn't move (7.1b). **Resolution:** Fixed: a separate sentence, "If searching disturbed sand on it, re-create the lie before playing."
- *Codex, on the pull request, P2:* Fourth review, after the owner's approval: lifting to identify is allowed only when the ball can't be identified as it lies; an unneeded lift is one penalty stroke (7.3). **Resolution:** Fixed after approval: "If you can't identify a ball as it lies, mark and lift it, cleaning only enough to tell." Two small cuts keep the summary at 120 words. Put to the owner before merging.

**Copy distance:** longest run shared with the R&A text is 5 words ("ball to see if it"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 8 · Course Played as It Is Found

**Summary (119 words):** Rule 8 covers playing the course as you find it: you can't improve the conditions for your next stroke, meaning your lie, your stance and swing, your line of play and where you'll drop. Bending or breaking branches, pressing down the ground behind your ball, replacing a divot in a divot hole on your line, or removing dew or frost costs the general penalty if it improves those conditions. You may still ground the club lightly, take a fair stance and make your stroke, even if the swing breaks a branch; a practice swing gets no such pass. If you moved or bent a branch, putting it back before you play avoids the penalty; once it's broken, it doesn't.

**Look here when:** Can I press down the grass behind my ball? · I broke a branch on my backswing: is that a penalty? · Can I replace a divot in a divot hole on my line? · I bent a branch out of the way: can I undo it?

**Glossary:** none · **Aliases:** none · **Sources:** 8, 8.1, 8.1a, 8.1b, 8.1c

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 8 covers playing the course as you find it: you can't improve the conditions for your next stroke, meaning your lie, your stance and swing, your line of play and where you'll drop. | [8.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-8#8_1) |
| 2 | Bending or breaking branches, pressing down the ground behind your ball, replacing a divot in a divot hole on your line, or removing dew or frost costs the general penalty if it improves those conditions. | [8.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-8#8_1a) |
| 3 | You may still ground the club lightly, take a fair stance and make your stroke, even if the swing breaks a branch; a practice swing gets no such pass. | [8.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-8#8_1b) |
| 4 | If you moved or bent a branch, putting it back before you play avoids the penalty; once it's broken, it doesn't. | [8.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-8#8_1c) |
| Q1 | Can I press down the grass behind my ball? | [8.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-8#8_1a) |
| Q2 | I broke a branch on my backswing: is that a penalty? | [8.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-8#8_1b) |
| Q3 | Can I replace a divot in a divot hole on my line? | [8.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-8#8_1a) |
| Q4 | I bent a branch out of the way: can I undo it? | [8.1c](https://www.randa.org/en/rog/the-rules-of-golf/rule-8#8_1c) |

**Review findings and resolution:**

- *Rules accuracy (agent A), error:* "Make your swing, even if it breaks something" was too broad: only the stroke, or a backswing for a stroke then made, is protected; a practice swing that improves conditions is the general penalty (8.1b(7), 8.1a). **Resolution:** Fixed: "make your stroke, even if the swing breaks a branch; a practice swing gets no such pass."
- *Rules accuracy (agent A), nit:* A fair stance must be the least intrusive (8.1b(6)); no grounding in a bunker; the teeing area allows more (8.1b(8)); pressing down or replacing a divot can't be undone (8.1c); removing loose impediments is allowed. **Resolution:** Not added, for length. Bunkers are in Rule 12's overview.
- *Rules accuracy (agent A), nit:* Add the 8.1 anchor for the list of conditions. **Resolution:** Fixed.
- *Site rules (agent B), should-fix:* "Rule 8 is play the course as you find it" was ungrammatical, and it is the search snippet. **Resolution:** Fixed: "Rule 8 covers playing the course as you find it".
- *Site rules (agent B), nit:* Q3 didn't match the summary's wording. **Resolution:** Fixed: "Can I replace a divot in a divot hole on my line?"

**Copy distance:** longest run shared with the R&A text is 7 words ("replacing a divot in a divot hole"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 9 · Ball Played as It Lies; Ball at Rest Lifted or Moved

**Summary (119 words):** Rule 9 covers playing the ball as it lies, and a resting ball that moves. The cause decides; anything but natural forces counts only when that's known or virtually certain. Wind or water: no penalty; play it where it stopped, unless it was replaced on the green, or a dropped, placed or replaced ball rolled into another area or out of bounds; then replace it. You or your caddie: one penalty stroke and replace it, unless it moved by accident on the green, in a search, or while marking it, removing a movable obstruction or taking relief. An opponent in match play: the same, penalty theirs. Anything else, such as another player in stroke play: no penalty, replace it.

**Look here when:** The wind moved my ball after it stopped: do I replace it? · I nudged my ball at address: what's the penalty? · Another ball knocked mine: where do I play from? · My opponent moved my ball in match play: what happens?

**Glossary:** none · **Aliases:** none · **Sources:** 9, 9.1a, 9.2a, 9.2b, 9.3, 9.4a, 9.4b, 9.5a, 9.5b, 9.6, Definitions: Known or Virtually Certain, Definitions: Outside Influence

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 9 covers playing the ball as it lies, and a resting ball that moves. | [9.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_1a) |
| 2 | The cause decides; anything but natural forces counts only when that's known or virtually certain. | [9.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_2a), [9.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_2b), Definitions: Known or Virtually Certain |
| 3 | Wind or water: no penalty; play it where it stopped, unless it was replaced on the green, or a dropped, placed or replaced ball rolled into another area or out of bounds; then replace it. | [9.3](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_3) |
| 4 | You or your caddie: one penalty stroke and replace it, unless it moved by accident on the green, in a search, or while marking it, removing a movable obstruction or taking relief. | [9.4a](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_4a), [9.4b](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_4b) |
| 5 | An opponent in match play: the same, penalty theirs. | [9.5a](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_5a), [9.5b](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_5b) |
| 6 | Anything else, such as another player in stroke play: no penalty, replace it. | [9.6](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_6), Definitions: Outside Influence |
| Q1 | The wind moved my ball after it stopped: do I replace it? | [9.3](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_3) |
| Q2 | I nudged my ball at address: what's the penalty? | [9.4b](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_4b) |
| Q3 | Another ball knocked mine: where do I play from? | [9.6](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_6) |
| Q4 | My opponent moved my ball in match play: what happens? | [9.5a](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_5a), [9.5b](https://www.randa.org/en/rog/the-rules-of-golf/rule-9#9_5b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), error:* "Wind or water: play it from where it stopped" was wrong for a ball already lifted and replaced on the green, and for a dropped, placed or replaced ball that rolls into another area or out of bounds (9.3 Exceptions 1 and 2). **Resolution:** Fixed: "unless it was replaced on the green, or a dropped, placed or replaced ball rolled into another area or out of bounds; then replace it."
- *Rules accuracy (agent A), gap:* The opponent sentence read as absolute; the opponent has the same accident exceptions (9.5b). **Resolution:** Fixed: "An opponent in match play: the same, penalty theirs."
- *Rules accuracy (agent A), gap:* A partner isn't an outside influence (Definitions: Outside Influence; 22.2, 23.5b). **Resolution:** Fixed: "Anything else, such as another player in stroke play" no longer reads as covering everyone.
- *Rules accuracy (agent A), gap:* Missing the fallback: if a person or outside influence isn't known or virtually certain to be the cause, it's natural forces (9.2b(2)). **Resolution:** Fixed: "anything but natural forces counts only when that's known or virtually certain".
- *Rules accuracy (agent A), nit:* The exceptions concern accidentally moving the ball, not touching it. **Resolution:** Fixed: "unless it moved by accident on the green, in a search, or while marking it, removing a movable obstruction or taking relief" (narrowed after Codex's third review, below).
- *Site rules (agent B), error:* Copy distance: "A ball has moved only if it's known or virtually certain that it did" shares a 12-word run with 9.2a once "it's" is read as "it is". **Resolution:** Fixed: the sentence was rewritten; the longest run left is 6 words. The drafter's checker now expands contractions, and every overview was rerun.
- *Site rules (agent B), should-fix:* "Known or virtually certain" wasn't explained. **Resolution:** Fixed at first with "at least 95 percent likely"; that clause was later cut to fit Codex's third-review fix. Rules 17 and 18 explain the 95 percent; Definitions: Known or Virtually Certain is linked here.
- *Codex, on the pull request, P2:* 9.3 Exception 2 covers a placed ball too, such as one placed after two drops that won't stay in the relief area. **Resolution:** Fixed: "a dropped, placed or replaced ball".
- *Codex, on the pull request, P2:* Second review: accidental movement while applying a Rule, such as removing a movable obstruction, marking or taking relief, is also free (9.4b Exception 4). **Resolution:** Fixed, then narrowed after the third review: "or while marking it, removing a movable obstruction or taking relief".
- *Codex, on the pull request, P2:* Third review: "while applying a Rule" was too broad; removing a loose impediment that moves the ball still costs a stroke (15.1b), and 9.4b Exception 4 lists specific actions. **Resolution:** Fixed: "while marking it, removing a movable obstruction or taking relief", which matches Rule 15's overview.

**Copy distance:** longest run shared with the R&A text is 6 words ("playing the ball as it lies"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 10 · Preparing for and Making a Stroke; Advice and Help; Caddies

**Summary (120 words):** Rule 10 covers making a stroke and the help you may get. Strike the ball fairly with the clubhead, and don't anchor the club against your body. During a round you can't ask anyone but your caddie for advice, or give it to anyone else in your competition, such as your group; partners are the exception. Advice is anything meant to influence your club, your stroke or how you play; distances, wind direction and the Rules aren't advice. Only your caddie may help with your line, and not from behind the ball once you begin your stance; others may point out a landmark or, off the green, stand as a target and move away. Any breach costs the general penalty.

**Look here when:** Can I ask someone in my group what club they just hit? · Is telling someone the yardage to the flag advice? · Can I lay a club on the ground to check my alignment? · Can my caddie line me up from behind?

**Glossary:** none · **Aliases:** `advice` · **Sources:** 10, 10.1a, 10.1b, 10.2a, 10.2b, 22.2, 23.5a, Definitions: Advice

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 10 covers making a stroke and the help you may get. | [Rule 10](https://www.randa.org/en/rog/the-rules-of-golf/rule-10) |
| 2 | Strike the ball fairly with the clubhead, and don't anchor the club against your body. | [10.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_1a), [10.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_1b) |
| 3 | During a round you can't ask anyone but your caddie for advice, or give it to anyone else in your competition, such as your group; partners are the exception. | [10.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_2a), [22.2](https://www.randa.org/en/rog/the-rules-of-golf/rule-22#22_2), [23.5a](https://www.randa.org/en/rog/the-rules-of-golf/rule-23#23_5a) |
| 4 | Advice is anything meant to influence your club, your stroke or how you play; distances, wind direction and the Rules aren't advice. | Definitions: Advice |
| 5 | Only your caddie may help with your line, and not from behind the ball once you begin your stance; others may point out a landmark or, off the green, stand as a target and move away. | [10.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_2b) |
| 6 | Any breach costs the general penalty. | [10.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_1a), [10.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_2a), [10.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_2b) |
| Q1 | Can I ask someone in my group what club they just hit? | [10.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_2a), Definitions: Advice |
| Q2 | Is telling someone the yardage to the flag advice? | Definitions: Advice |
| Q3 | Can I lay a club on the ground to check my alignment? | [10.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_2b) |
| Q4 | Can my caddie line me up from behind? | [10.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-10#10_2b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* Only the caddie was restricted; casual groups need 10.2b(2): nobody but your caddie may help with your line. **Resolution:** Fixed, then narrowed after Codex's finding below: "Only your caddie may help with your line, and not from behind the ball once you begin your stance".
- *Rules accuracy (agent A), nit:* The caddie restriction starts when you begin taking your stance; "behind you" should be behind the ball on your line. **Resolution:** Fixed with the sentence above.
- *Rules accuracy (agent A), nit:* Picking up the aiming club before hitting doesn't cancel the penalty. **Resolution:** The club-on-the-ground sentence was cut for length; Q3 points to 10.2b.
- *Rules accuracy (agent A), nit:* Partners may give advice and caddie-type help; cite 22 and 23. **Resolution:** Fixed: "partners are the exception", with 22.2 and 23.5a cited.
- *Rules accuracy (agent A), nit:* 10.3a supported nothing. **Resolution:** Fixed: removed.
- *Site rules (agent B), should-fix:* "Each is the general penalty" read as covering only the last two clauses. **Resolution:** Fixed: "Any breach costs the general penalty."
- *Site rules (agent B), should-fix:* #237 asks what applies in a casual round; "anyone playing in your competition" is unclear to a casual group. **Resolution:** Fixed: "anyone else in your competition, such as your group".
- *Codex, on the pull request, P2:* "Nobody but your caddie may help you line up, and once you begin your stance, not even them" penalised allowed help: anyone may point out public directional information, and off the green stand as a target and move away (10.2b(2)); the caddie restriction is about standing behind the ball (10.2b(4)). **Resolution:** Fixed: "Only your caddie may help with your line, and not from behind the ball once you begin your stance; others may point out a landmark or, off the green, stand as a target and move away." The list of public information was shortened to fit.

**Copy distance:** longest run shared with the R&A text is 5 words ("a club on the ground"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").

### Rule 11 · Ball in Motion Accidentally Hits Person, Animal or Object; Deliberate Actions to Affect Ball in Motion

**Summary (120 words):** Rule 11 covers a ball in motion that hits a person, an animal or an object. Accidental hits usually carry no penalty; play the ball as it lies. In stroke play, a putt that hits another ball at rest, with both on the green beforehand, costs two penalty strokes. A putt that accidentally hits, on the green, another person (not the flagstick attendant), an animal larger than an insect, or a movable obstruction must be replayed; a ball-marker doesn't count. Deliberately stopping or deflecting a moving ball, or removing loose impediments or altering the ground to affect where it stops, costs the general penalty; in match play you may stop an opponent's ball that can't go in, as a concession.

**Look here when:** My shot hit my own golf bag: is that a penalty? · My putt hit another ball on the green: what happens? · My putt hit someone standing near the hole: do I replay it? · Can I stop a ball that's rolling toward the water?

**Glossary:** none · **Aliases:** none · **Sources:** 11, 11.1a, 11.1b, 11.2a, 11.2b, 11.3, 13.2b

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 11 covers a ball in motion that hits a person, an animal or an object. | [Rule 11](https://www.randa.org/en/rog/the-rules-of-golf/rule-11) |
| 2 | Accidental hits usually carry no penalty; play the ball as it lies. | [11.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_1a), [11.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_1b) |
| 3 | In stroke play, a putt that hits another ball at rest, with both on the green beforehand, costs two penalty strokes. | [11.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_1a) |
| 4 | A putt that accidentally hits, on the green, another person (not the flagstick attendant), an animal larger than an insect, or a movable obstruction must be replayed; a ball-marker doesn't count. | [11.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_1b), [13.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_2b) |
| 5 | Deliberately stopping or deflecting a moving ball, or removing loose impediments or altering the ground to affect where it stops, costs the general penalty; in match play you may stop an opponent's ball that can't go in, as a concession. | [11.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_2a), [11.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_2b), [11.3](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_3) |
| Q1 | My shot hit my own golf bag: is that a penalty? | [11.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_1a), [11.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_1b) |
| Q2 | My putt hit another ball on the green: what happens? | [11.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_1a) |
| Q3 | My putt hit someone standing near the hole: do I replay it? | [11.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_1b), [13.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-13#13_2b) |
| Q4 | Can I stop a ball that's rolling toward the water? | [11.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-11#11_2b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), error:* "A putt that accidentally hits another person ... is replayed" missed that a person tending the flagstick is excluded: then it's no penalty and play it as it lies (11.1b(2), 13.2b). **Resolution:** Fixed: "another person (not the flagstick attendant)"; 13.2b added.
- *Rules accuracy (agent A), error:* "Moving things to change where it might stop" was too broad: 11.3 bans changing the ground and removing loose impediments or movable obstructions, but allows moving equipment, a removed flagstick and balls at rest on the green. **Resolution:** Fixed: "removing loose impediments or changing the ground to affect where it stops".
- *Rules accuracy (agent A), nit:* "A putt" should be any stroke from the green; insects don't count as animals here; the replay is required. **Resolution:** Fixed: "must be replayed". "Putt" kept as the plain word for a stroke on the green.
- *Rules accuracy (agent A), nit:* In match play there's no penalty for hitting a ball on the green. **Resolution:** The sentence already opens "In stroke play".
- *Site rules (agent B), should-fix:* "There's no penalty to anyone" was contradicted two sentences later. **Resolution:** Fixed: "Accidental hits usually carry no penalty".
- *Site rules (agent B), nit:* Writing "putting green" in the ball-on-green sentence would make a 9-word run. **Resolution:** Kept as "green".
- *Codex, on the pull request, P2:* The replay applies only to qualifying objects and animals: not a ball-marker, the club used, a ball at rest or the flagstick, and not insects (11.1b(2)). **Resolution:** Fixed: "another person (not the flagstick attendant), an animal larger than an insect, or a movable obstruction must be replayed; a ball-marker doesn't count." A ball at rest is the sentence before; the flagstick is Rule 13.
- *Codex, on the pull request, P2:* Second review: the replay applies only when the qualifying person, animal or obstruction is hit on the putting green (11.1b(2)); off the green the ball is played as it lies. **Resolution:** Fixed: "A putt that accidentally hits, on the green, another person ..."; the dropped-glove example was cut to fit.
- *Codex, on the pull request, P2:* Third review: in match play, stopping an opponent's ball that has no reasonable chance of being holed, to concede the next stroke, isn't penalised (11.2a Exception). **Resolution:** Fixed: "in match play you may stop an opponent's ball that can't go in, as a concession." The ball-on-green sentence was tightened to fit.

**Copy distance:** longest run shared with the R&A text is 7 words ("play the ball as it lies in"); no run of 8 or more.

**Owner approval:** approved in chat on November 6, 2026 ("Approve all three").
