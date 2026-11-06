# Rule overviews: review packet for the owner (#237, #238, #239)

The evidence behind the 25 rule overviews in `lib/content/rules/overviews.ts`, one batch per section, for the owner's sign-off as reviewer of record (`docs/rules/editorial-review.md`, Amendment A2). Situations have their own packet (`review-packet-situations.md`).

Each rule's entry has the copy as it stands, every summary sentence and common question mapped to the subrule or Definition it rests on, both reviewer agents' findings with what was done about each, the copy-distance result, and the owner's approval line. Where a finding quotes earlier wording, the copy shown above it already carries the fix.

## How each batch was checked

1. **Draft.** Claude wrote each record from the R&A rule pages (`https://www.randa.org/en/rog/the-rules-of-golf/rule-N`) and the Definitions page (`https://www.randa.org/en/rog/definitions`), opened on the date in the batch's heading. Every source on a record carries that date as `checkedOn`. Overviews cite no Model Local Rule and no Rules of Handicapping (`validateRules` refuses both); where the Committee decides something, the copy says so.
2. **Review.** Two reviewer agents ran in parallel. Each got the exported records and opened the sources itself; neither saw the drafter's reasoning or the other's notes.
   - **Agent A, rules accuracy** (`rules` stage): every factual sentence against the fetched rule text and Definitions; match play against stroke play; Committee and Local Rule dependence; stated penalties; defined terms; citations.
   - **Agent B, site rules** (`product` and `seo` stages): house voice, `NEVER_WORDS`, the claim guard, word counts, glossary slugs and aliases against `inventory.md`, every source link and anchor, `npm run lint:content`, and its own copy-distance script.
3. **Fixes.** Every finding was fixed or answered below before the record moved to `in-review`. A finding the drafter disagreed with is marked as such, for the owner to decide.
4. **Copy distance.** No run of eight or more consecutive words may be shared with the official text. The check normalises case, punctuation and curly quotes, and compares each summary and question against a corpus of all 25 rule pages and the Definitions, both the visible text and the page data that carries the interpretations (about 454,000 words). Agent B ran its own version independently.
5. **Approval.** The owner approves a batch in chat. The records then move to `approved` with `reviewedBy: "owner"`, `reviewedOn` set to the approval date and a review log of the agents' `rules`, `product` and `seo` stages and the owner's `approval`. Nothing here sets `published`; the launch PR (#247) does.

## #238 · Rules 12–19

Course areas and procedures (12–16) and relief and penalties (17–19), the most-read rules. Sources opened November 6, 2026; both reviewer agents ran the same day.

**Result.** Agent A found 2 errors: Rule 14 said any mistake could be fixed free before playing the ball, and Rule 18 started the lost-ball clock when "the search starts" rather than when you or your caddie start looking. Agent B found 1 error: Rule 18 shared a 9-word run with 18.2b once "it's" is read as "it is". All three are fixed, along with the gaps and should-fix items below. Each summary is 112–120 words with four questions. The drafter's checker now spells out contractions too, and every overview was rerun through it: the longest run left in this batch is 7 words. `npm run lint:content` passes. Agent B checked every link on the draft; after the fixes, the final 43 subrule anchors and 23 Definitions citations were rechecked against the fetched pages, and all resolve.

**For the owner to decide:**

1. **Questions as pointers.** A "Look here when" question tells a reader this is the rule to look in; the drafter didn't try to answer every one inside 120 words. Agent A flagged those without an answer in the summary. Still unanswered here: Rule 15 Q4 (another ball on your line), Rule 16 Q2 (soggy fairway), Rule 17 Q4 (unplayable in a penalty area, answered in Rule 19's overview) and Rule 18 Q4 (original found after a provisional). Each is mapped to its subrule below. Say if you'd rather every question be answered on the card; that means swapping questions, since every summary is at or near 120 words.
2. **Ground under repair** (Rule 16). Agent A asked for a line saying it's mostly what the Committee marks, since casual groups treat any bare patch as ground under repair. There is no room left; the Definition is now linked instead.
3. **Old names.** "Water hazard" (Rule 17) and "casual water" (Rule 16) are aliases for search, as `inventory.md` sets out, but neither card uses them. They are not in the 2023 text, so the drafter left them out of the copy.

### Rule 12 · Bunkers

**Summary (119 words):** Rule 12 covers playing from a bunker: when your ball is in one, and what you may touch before the stroke. It's in if any part touches sand inside the edge, or rests on something there, like a rake; on grass or soil inside the edge, not touching sand, it isn't. Before playing, you can't touch the sand to test it, with the club just in front of or behind the ball, or in a practice swing or backswing. Each costs the general penalty: two strokes in stroke play, loss of the hole in match play. Digging in your feet or moving a rake is fine. Once your ball is out, or you're taking relief outside, you can rake.

**Look here when:** Is my ball in the bunker if it's on grass inside the edge? · Can my practice swing brush the sand? · Can I move a rake, leaves or a stone before I play from the sand? · When can I smooth the sand?

**Glossary:** `bunker`, `sandy` · **Aliases:** none · **Sources:** 12, 12.1, 12.2a, 12.2b, Definitions: General Penalty

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 12 covers playing from a bunker: when your ball is in one, and what you may touch before the stroke. | [Rule 12](https://www.randa.org/en/rog/the-rules-of-golf/rule-12) |
| 2 | It's in if any part touches sand inside the edge, or rests on something there, like a rake; on grass or soil inside the edge, not touching sand, it isn't. | [12.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_1) |
| 3 | Before playing, you can't touch the sand to test it, with the club just in front of or behind the ball, or in a practice swing or backswing. | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |
| 4 | Each costs the general penalty: two strokes in stroke play, loss of the hole in match play. | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b), Definitions: General Penalty |
| 5 | Digging in your feet or moving a rake is fine. | [12.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2a), [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |
| 6 | Once your ball is out, or you're taking relief outside, you can rake. | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |
| Q1 | Is my ball in the bunker if it's on grass inside the edge? | [12.1](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_1) |
| Q2 | Can my practice swing brush the sand? | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |
| Q3 | Can I move a rake, leaves or a stone before I play from the sand? | [12.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2a) |
| Q4 | When can I smooth the sand? | [12.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-12#12_2b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* The in-bunker sentence left out a ball resting on something lying on the sand (a rake, leaves, a puddle), so a group could treat it as outside the bunker and ground the club (12.1). **Resolution:** Fixed: the sentence now counts a ball resting on something lying in the bunker, such as a rake, and says a ball on grass or soil inside the edge that touches no sand isn't in.
- *Rules accuracy (agent A), gap:* 12.3 is cited, but nothing in the summary covers relief in a bunker, and Q4 (unplayable in a bunker) isn't answered here. **Resolution:** Fixed together with agent B's finding on the same question: Q4 is now "When can I smooth the sand?", which this summary answers, and 12.3 is no longer cited. Rule 19's overview covers unplayable relief in a bunker.
- *Rules accuracy (agent A), nit:* Moving a leaf or stone that then moves the ball costs a stroke (15.1b); touching sand in an allowed way can still be the general penalty if it improves the lie (12.2b(2), 8.1a). **Resolution:** Changed the example to digging in your feet or moving a rake, both free whatever happens to the ball. The leaf-and-ball case is in Rule 15's overview.
- *Rules accuracy (agent A), nit:* Raking is also free once you are taking, or intend to take, relief outside the bunker (12.2b(3)). **Resolution:** Fixed: "Once your ball is out, or you're taking relief outside, you can rake."
- *Site rules (agent B), should-fix:* In the list of banned touches, the last item had no "or", so "in a practice swing or on the backswing" read as part of the club-near-the-ball case; and "That is the general penalty" could be read as the last item only. **Resolution:** Fixed: "you can't touch the sand to test it, with the club just in front of or behind the ball, or in a practice swing or backswing. Each costs the general penalty..."
- *Site rules (agent B), should-fix:* Q4 (unplayable in a bunker) belongs to Rule 19 and duplicated Rule 19's Q2. **Resolution:** Fixed: Q4 is now "When can I smooth the sand?"; 12.3 dropped.
- *Site rules (agent B), nit:* "rake away" was breezy one sentence after a penalty. **Resolution:** Fixed: "you can rake."

**Copy distance:** longest run shared with the R&A text is 6 words ("of the hole in match play"); no run of 8 or more.

**Owner approval:** pending.

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

**Owner approval:** pending.

### Rule 14 · Procedures for Ball: Marking, Lifting and Cleaning; Replacing on Spot; Dropping in Relief Area; Playing from Wrong Place

**Summary (120 words):** Rule 14 covers the procedures behind relief: marking, lifting, replacing and dropping a ball, and playing from a wrong place. Mark the spot before lifting a ball you'll replace; skipping that costs a penalty stroke. Drop from knee height, straight down, into the relief area, usually one or two club-lengths from a reference point, where it must stay; if it rolls out twice, place it where the second drop landed. A wrong drop, placement or replacement can be redone free before you play the ball. Playing from a wrong place costs the general penalty, two strokes or loss of the hole in match play; in stroke play, a serious breach must be corrected before the next tee, or you're disqualified.

**Look here when:** Do I have to mark my ball before lifting it? · How do I drop, and what if the ball rolls out of the relief area? · I dropped in the wrong spot: can I pick it up and drop again? · I played from the wrong place in stroke play: what now?

**Glossary:** none · **Aliases:** `wrong place` · **Sources:** 14, 14.1a, 14.3b, 14.3c, 14.5a, 14.7a, 14.7b, Definitions: Relief Area, Definitions: Club-Length, Definitions: General Penalty

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 14 covers the procedures behind relief: marking, lifting, replacing and dropping a ball, and playing from a wrong place. | [Rule 14](https://www.randa.org/en/rog/the-rules-of-golf/rule-14) |
| 2 | Mark the spot before lifting a ball you'll replace; skipping that costs a penalty stroke. | [14.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_1a) |
| 3 | Drop from knee height, straight down, into the relief area, usually one or two club-lengths from a reference point, where it must stay; if it rolls out twice, place it where the second drop landed. | [14.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_3b), [14.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_3c), Definitions: Relief Area, Definitions: Club-Length |
| 4 | A wrong drop, placement or replacement can be redone free before you play the ball. | [14.5a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_5a) |
| 5 | Playing from a wrong place costs the general penalty, two strokes or loss of the hole in match play; in stroke play, a serious breach must be corrected before the next tee, or you're disqualified. | [14.7a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_7a), [14.7b](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_7b), Definitions: General Penalty |
| Q1 | Do I have to mark my ball before lifting it? | [14.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_1a) |
| Q2 | How do I drop, and what if the ball rolls out of the relief area? | [14.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_3b), [14.3c](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_3c) |
| Q3 | I dropped in the wrong spot: can I pick it up and drop again? | [14.5a](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_5a) |
| Q4 | I played from the wrong place in stroke play: what now? | [14.7b](https://www.randa.org/en/rog/the-rules-of-golf/rule-14#14_7b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), error:* "Mistakes can be fixed without penalty before you play the ball" was broader than 14.5a, which covers only a wrong substitution or a ball dropped, placed or replaced the wrong way, in the wrong place or under the wrong Rule; penalties already incurred stand (14.1a, 14.1c, 14.5c). **Resolution:** Fixed: "A wrong drop, placement or replacement can be redone free before you play the ball."
- *Rules accuracy (agent A), gap:* The wrong-place sentence left out the stroke-play serious-breach rule that Q4 asks about (14.7b). **Resolution:** Fixed: "in stroke play, a serious breach must be corrected before the next tee, or you're disqualified." The general penalty itself is defined in Rules 1 and 12 and linked here as Definitions: General Penalty.
- *Rules accuracy (agent A), nit:* A ball dropped the wrong way but played from inside the relief area is one stroke, not the wrong-place penalty (14.3b(4)). **Resolution:** Not added, for length.
- *Rules accuracy (agent A), nit:* The first sentence said "wrong spot"; use the defined "wrong place". **Resolution:** Fixed.
- *Rules accuracy (agent A), nit:* Only the player may drop, and the ball must not touch the player or their equipment first (14.3b(1)-(2)). **Resolution:** Not added, for length.
- *Site rules (agent B), should-fix:* "Playing from a wrong place is the general penalty": the act isn't the penalty, the general penalty wasn't explained on this card, and the first sentence said "wrong spot". **Resolution:** Fixed: "costs the general penalty, two strokes or loss of the hole in match play", and "wrong place" in both sentences.
- *Site rules (agent B), nit:* "Mistakes can be fixed" was vague. **Resolution:** Fixed with agent A's error: names a wrong drop, placement or replacement.
- *Site rules (agent B), nit:* "Club-lengths" isn't explained here, or in Rules 16, 17 and 19. **Resolution:** Not added to the copy, for length; each of those records now cites Definitions: Club-Length, which the page links.

**Copy distance:** longest run shared with the R&A text is 6 words ("one or two club lengths from"); no run of 8 or more.

**Owner approval:** pending.

### Rule 15 · Relief from Loose Impediments and Movable Obstructions (Including Ball or Ball-Marker Helping or Interfering with Play)

**Summary (113 words):** Rule 15 covers two kinds of things you can usually move out of the way without penalty. Loose impediments are unattached natural objects, such as leaves, twigs and stones. Movable obstructions are artificial objects you can move with reasonable effort and without damage, such as rakes, bottles and towels. Off the putting green and teeing area, if removing a loose impediment moves your ball, replace it and add a penalty stroke; if removing a movable obstruction moves it, just replace it. If your ball sits on a movable obstruction, lift it, remove the object and drop within one club-length of the spot beneath, no nearer the hole; on the green, place it there.

**Look here when:** Can I move a twig or a leaf that's touching my ball? · My ball is resting against a rake: what do I do? · My ball stopped on a towel or a headcover: how do I take relief? · Another ball is near my line: can I ask for it to be marked and lifted?

**Glossary:** none · **Aliases:** none · **Sources:** 15, 15.1a, 15.1b, 15.2a, 15.3b, Definitions: Loose Impediment, Definitions: Movable Obstruction

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 15 covers two kinds of things you can usually move out of the way without penalty. | [15.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_1a), [15.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_2a) |
| 2 | Loose impediments are unattached natural objects, such as leaves, twigs and stones. | Definitions: Loose Impediment |
| 3 | Movable obstructions are artificial objects you can move with reasonable effort and without damage, such as rakes, bottles and towels. | Definitions: Movable Obstruction |
| 4 | Off the putting green and teeing area, if removing a loose impediment moves your ball, replace it and add a penalty stroke; if removing a movable obstruction moves it, just replace it. | [15.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_1b), [15.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_2a) |
| 5 | If your ball sits on a movable obstruction, lift it, remove the object and drop within one club-length of the spot beneath, no nearer the hole; on the green, place it there. | [15.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-15#15_2a) |
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

**Copy distance:** longest run shared with the R&A text is 5 words ("move out of the way"); no run of 8 or more.

**Owner approval:** pending.

### Rule 16 · Relief from Abnormal Course Conditions (Including Immovable Obstructions), Dangerous Animal Condition, Embedded Ball

**Summary (118 words):** Rule 16 covers free relief from abnormal course conditions (ground under repair, temporary water, animal holes and immovable obstructions such as paved paths), from dangerous animals, and for a ball in the general area that plugs in its own pitch-mark. A condition has to interfere with your lie, stance or swing, or, on the green, your line; one that only distracts you doesn't count. In the general area, find the nearest point of complete relief: the closest spot, no nearer the hole, free of the condition for the shot you'd have played. Drop within one club-length of it, no nearer the hole and clear of the condition. None of this applies in a penalty area, except dangerous-animal relief.

**Look here when:** My ball is on a cart path: where do I drop? · Does a soggy patch of fairway count as temporary water? · My ball plugged in the rough: do I get a free drop? · Can I move my ball away from a snake or a swarm of bees?

**Glossary:** none · **Aliases:** `plugged ball`, `embedded ball`, `casual water` · **Sources:** 16, 16.1a, 16.1b, 16.2a, 16.2b, 16.3a, 16.3b, Definitions: Abnormal Course Condition, Definitions: Ground Under Repair, Definitions: Obstruction, Definitions: Nearest Point of Complete Relief, Definitions: Club-Length, Definitions: Temporary Water, Definitions: Embedded

| # | Sentence | Rests on |
|---:|---|---|
| 1 | Rule 16 covers free relief from abnormal course conditions (ground under repair, temporary water, animal holes and immovable obstructions such as paved paths), from dangerous animals, and for a ball in the general area that plugs in its own pitch-mark. | [16.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1a), [16.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_2a), [16.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3a), Definitions: Abnormal Course Condition, Definitions: Ground Under Repair, Definitions: Obstruction, Definitions: Embedded |
| 2 | A condition has to interfere with your lie, stance or swing, or, on the green, your line; one that only distracts you doesn't count. | [16.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1a) |
| 3 | In the general area, find the nearest point of complete relief: the closest spot, no nearer the hole, free of the condition for the shot you'd have played. | [16.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1b), Definitions: Nearest Point of Complete Relief |
| 4 | Drop within one club-length of it, no nearer the hole and clear of the condition. | [16.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1b), Definitions: Club-Length |
| 5 | None of this applies in a penalty area, except dangerous-animal relief. | [16.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1a), [16.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_2b), [16.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3a) |
| Q1 | My ball is on a cart path: where do I drop? | [16.1b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1b) |
| Q2 | Does a soggy patch of fairway count as temporary water? | [16.1a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_1a), Definitions: Temporary Water |
| Q3 | My ball plugged in the rough: do I get a free drop? | [16.3a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3a), [16.3b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_3b) |
| Q4 | Can I move my ball away from a snake or a swarm of bees? | [16.2a](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_2a), [16.2b](https://www.randa.org/en/rog/the-rules-of-golf/rule-16#16_2b) |

**Review findings and resolution:**

- *Rules accuracy (agent A), gap:* Ground under repair is what the Committee defines, plus a few unmarked cases; casual groups treat any bare patch as ground under repair (Definitions: Ground Under Repair). **Resolution:** Partly fixed: Definitions: Ground Under Repair is now a source, so the page links it. No words added; the summary is at 120. Flagged for the owner.
- *Rules accuracy (agent A), gap:* The relief area must also be in the general area and give complete relief; dropping within a club-length with the stance still on the path is a wrong place (16.1b). **Resolution:** Fixed: "drop within one club-length of it, no nearer the hole and clear of the condition." "In the general area" opens the sentence.
- *Rules accuracy (agent A), nit:* "Where the condition no longer affects the shot" could be read to include line of play in the general area (Definitions: Nearest Point of Complete Relief). **Resolution:** Fixed: "free of the condition for the shot you'd have played", after a sentence that defines interference as lie, stance or swing (line only on the green).
- *Rules accuracy (agent A), gap:* Q2 (soggy fairway) isn't answered in the summary (Definitions: Temporary Water). **Resolution:** Kept as a pointer, with Definitions: Temporary Water linked. Same position as Rule 12's Q4.
- *Rules accuracy (agent A), nit:* Only artificially surfaced paths are obstructions (Definitions: Obstruction). **Resolution:** Fixed: "paved paths", with Definitions: Obstruction added as a source.
- *Rules accuracy (agent A), nit:* No relief for a ball embedded in sand in an area not cut to fairway height; the Committee may limit embedded relief to fairway height. **Resolution:** Not added. The summary states the default; it names no Model Local Rule.
- *Rules accuracy (agent A), nit:* The interference sentence followed a list that includes dangerous animals and plugged balls, but describes only abnormal course conditions. **Resolution:** Fixed: it now opens "A condition has to interfere...".
- *Rules accuracy (agent A), nit:* 16.1c, 16.1d supported no sentence. **Resolution:** Fixed: both removed.
- *Site rules (agent B), should-fix:* "One" had no clear antecedent, and the phrase about the green needed commas. **Resolution:** Fixed: "A condition has to interfere with your lie, stance or swing, or, on the green, your line".
- *Site rules (agent B), nit:* "General area" isn't explained; "embedded" isn't used though cited; the alias "casual water" has nothing on the card. **Resolution:** Not added, for length (118 words). The Definitions links cover embedded and general area; the alias is for search only, as inventory.md intends.
- *Site rules (agent B), nit:* The nearest-point sentence was 44 words with "no nearer the hole" twice. **Resolution:** Split into two sentences. "No nearer the hole" stays in both: one limits the reference point, the other the drop.

**Copy distance:** longest run shared with the R&A text is 7 words ("for a ball in the general area"); no run of 8 or more.

**Owner approval:** pending.

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

**Owner approval:** pending.

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

**Owner approval:** pending.

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

**Owner approval:** pending.
