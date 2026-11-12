# Glossary expansion batch 4: scoring (#168, #292)

Prepared November 11, 2026 for the owner's review; stages 2–4 done the same day under the owner's delegation. **Approval (stage 5) is still the owner's.** The records are in `lib/content/glossary/terms/expansion-batch-4.ts`, all `in-review`, and reach no public page, search index, sitemap, `llms.txt` or structured data (`selectors.ts`; checked by `npm run test:glossary`, and in the built `glossary.html`, `glossary.rsc`, `llms.txt` and `.next/static` for this PR).

## Why now, and when it can ship

Batches 1–3 are published (96 records). Scoring is next in #168's order and in `inventory.md` § Expansion batch plan. Drafting changes nothing public, so it goes ahead now. **Release is a separate decision.** #288 recorded that #167's launch + 28 read can reorder batch 4 onward. That read runs on 2026-11-26 (window 2026-10-29 – 11-25). What exists today is too thin to reorder anything:

- launch + 7: `/glossary` 0 clicks, 71 impressions;
- no complete GA4 zero-result window;
- no recorded reader requests.

So batch 4 waits for launch + 28, unless the owner overrides, as for batches 1–3. If launch + 28 puts another category first, these records stay `in-review` until their turn.

## Scope

**15 terms**, #168's cap: the scoring expansion terms in `inventory.md` § A, rows 9–19 and 21–24.

`hole-in-one`, `albatross`, `condor`, `triple-bogey`, `quadruple-bogey`, `even-par`, `under-par`, `over-par`, `scorecard`, `front-nine`, `back-nine`, `round`, `penalty-stroke`, `maximum-score`, `cut-line`.

**Halve (row 20, substitution S1) isn't here.** Scoring has 16, one over the cap, and 16 can't make two batches of at least 10. Halve goes to batch 7 with Dormie and All Square: all three are match-play standings checked against Rule 3.2. Its category stays `scoring` (`inventory.md` § Expansion batch plan).

**Canonicals:** all 15 are hub entries (`/glossary#<slug>`), as `canonical-map.md` has every scoring expansion term. No published guide or post owns any of these intents.

## Stages

| # | Stage | Done | Still needed |
|---|---|---|---|
| 1 | Draft | Agent, 2026-11-11 | — |
| 2 | Rules fact-check | Agent, 2026-11-11, under the owner's delegation: every source reopened, every sentence checked, examples recomputed below. [Results](#stage-24-results-agent-2026-11-11) | — |
| 3 | GoLo product audit | Agent, 2026-11-11, under the owner's delegation: no record mentions GoLo or the app, links a GoLo page, or cites a capability | — |
| 4 | SEO/canonical | Agent, 2026-11-11, under the owner's delegation: hub anchors at each slug; `lint:content` passes; related ids and paths resolve | — |
| 5 | Approval | — | **Owner** |

**Delegation (owner, 2026-11-11, #292).** The owner delegated stages 2–4 for the 15 records of batch 4 ("Yes, delegate"), as for batches 1–3, and kept approval. Each record now has a `reviewLog` with `rules`, `product` and `seo` entries, `by: "agent"`, dated 2026-11-11, and stays `in-review` until the owner approves.

### Stage 2–4 results (agent, 2026-11-11)

- **Rules.** All 21 source URLs were reopened at the exact addresses in the records, between 19:31 and 19:40 PST; each answered 200. The five R&A pages are still the 2023 edition: Definitions (Scorecard, Round, Maximum Score, General Penalty), Rule 1.1 and 1.3c, Rule 3.3b, Rule 17.1d and Rule 21.2. Every phrase quoted below was found again on its page. Each sentence in the records was checked against these sources. Every `accessedOn` stays 2026-11-11.
- **Examples.** Every number recomputed again from the inputs shown; all match (the "Recomputed" lines below).
- **Product.** No `goloNote`, `ctaIntent` or `capabilityIds` on any record; no public field names GoLo or the app. The GoLo Nassau guide is in Front Nine's and Back Nine's `sources`, which are internal and never reach a page. The $5 Nassau in Front Nine's example is golf, not a product claim, and matches the Nassau guide's format. The product-audit questions below stay open for the owner, and the recommendation stands: no note.
- **SEO.** Every canonical is `{ kind: "hub", anchor: <slug> }`, as `canonical-map.md` has every scoring expansion term. Related ids all resolve to records. The content paths `/rules#rule-3`, `/rules#rule-17` and `/rules#rule-21` are published Rules Center anchors. `lint:content` passes.
- **One packet fix, no record change.** Over Par's Golfshake quote reads "73 or higher", not "73 or more". The record never quoted it.

## Product-audit questions

The drafts are golf only, like batch 3. Three records could carry a GoLo note, if the owner wants one:

1. **Scorecard.** `hole-scoring` (live): "One scorer taps in each hole … net and gross are both kept for every player." A note could say GoLo keeps the group's card hole by hole. It must not suggest GoLo certifies a card or returns one to a committee. *Recommended: no note.* The record is about the Rules' scorecard.
2. **Front Nine / Back Nine.** `nine-hole-rounds` (live) has the limit "A nine-hole round plays holes 1 to 9 of the card; it can't score a course's back nine." A note on Back Nine would state a limit, not help the reader. *Recommended: no note.*
3. **Nassau link.** Front Nine and Back Nine relate to the published `nassau` record, and Front Nine's example is a $5 Nassau, the site's usual amount. Neither links `/games/nassau` directly: the Nassau record already does. Confirm that's enough.

## Differences from `inventory.md`

- **Front Nine / Back Nine** also take "outward nine", "front side", "inward nine" and "back side" (Golf Compendium). Not "out"/"in": both are too short to be strict.
- **Even Par** keeps "level par" (Golf Compendium: "level par" in the U.K. and other R&A places). The inventory's related `all-square` isn't a record yet, so the note names it in text only.
- **Hole-in-One** keeps "ace". "Hole in one" normalises to the record's own name, so it isn't listed.
- **Related ids** stay within existing records. Triple Bogey and Maximum Score relate to `net-double-bogey`; Maximum Score to `par-competition` and `stableford` (the other Rule 21 formats); Penalty Stroke to `penalty-area`. `stroke-and-distance`, `the-turn` and `all-square` aren't records yet.
- **Content links:** Scorecard `/rules#rule-3`, Penalty Stroke `/rules#rule-17`, Maximum Score `/rules#rule-21`. All are published Rules Center anchors.
- **Cut Line** is `convention`: the Rules of Golf don't define a cut. The PGA Tour figure is dated to its source.

## The terms

Every source was opened on 2026-11-11 at the URL in the record. The R&A pages answered a plain fetch and are the 2023 edition. Merriam-Webster, used for the MVP, refused a plain fetch today (403), so other editorial sources replace it. Short definitions are 20–45 words except where one plain sentence answers the question: the bogey family and Under/Over Par, which match the published Bogey and Double Bogey records.

### Hole-in-One (`hole-in-one`, P2)
- **Definition:** A score of 1 on a hole: the tee shot goes in. Nearly every one is made on a par 3, where it's two under par; on a short par 4 it's three under.
- Sources: Golf.com terms guide: an ace is "an alternate golf term for 'hole-in-one'"; "Virtually all 'aces' or 'holes-in-one' occur on par 3s"; occasionally a short par 4. Golfshake A–Z: "Ace - Alternative word for a Hole-in-One".
- Recomputed: 1 on a par 3 = 3 − 2, two under ✓; 1 on a par 4 = three under ✓ (an albatross by the numbers, as Golf.com says).

### Albatross (`albatross`, P2)
- **Definition:** A score three under par on a hole, also called a double eagle: a 2 on a par 5, or a hole-in-one on a par 4.
- Sources: Golf.com: "three fewer strokes on a hole than the par"; the two ways, a holed second on a par 5 or an ace on a par 4. Golfshake: "a double eagle, or 3-under par on any one hole".
- Recomputed: 2 on par 5 = −3 ✓

### Condor (`condor`, P3)
- **Definition:** A score four under par on a hole. It's only possible on a par 5 or longer, so in practice it means a hole-in-one on a par 5, or a 2 on one of the few par 6s.
- Sources: Golf Compendium: "4-under par on a golf hole"; "impossible on par-3s and par-4s"; "A small number of par-6 holes exist". The Golf News Net: "putting a 1 on the card for a par 5 or a 2 on the card for a par 6"; several made by cutting the corner on doglegs.
- No count of condors is given: sources disagree.

### Triple Bogey (`triple-bogey`, P2)
- **Definition:** A score three over par on a hole: a 6 on a par 3, a 7 on a par 4 or an 8 on a par 5.
- Sources: Golf Compendium (the three scores by par). American Golf, "Golf scoring explained": "a six on a par-three hole, a seven on a par-four or an eight on a par-five". (National Club Golfer's glossary URL was opened but served no triple bogey entry, so it isn't cited.)
- Recomputed: drive 1 + chip out 1 + third 1 + chip on 1 + three putts 3 = 7 = 4 + 3 ✓

### Quadruple Bogey (`quadruple-bogey`, P3)
- **Definition:** A score four over par on a hole: a 7 on a par 3, an 8 on a par 4 or a 9 on a par 5.
- Sources: Golf Compendium: "four strokes higher than the hole's par"; 7, 8, 9 by par. Golf Compendium, "What scores come next?": "Quadruple bogey = 4-over par on a hole".
- An 8 on a par 4 is the published Snowman record's score ✓

### Even Par (`even-par`, P2)
- **Definition:** A score equal to par, for a hole or for the holes played so far. A birdie and a bogey cancel out, so a player who makes one of each is back to even.
- Sources: Golf.com: "if a player makes a birdie on the 1st hole and follows it with a bogey on No. 2, he is 'even par'". Golfshake: "A score that matches par for a hole or for a round". Golf Compendium: "'Even par' is more likely to be used in North America, 'level par' in the U.K. and other parts of the golf world governed by the R&A". Golf Monthly: E on a leaderboard means even par.
- Recomputed: 0 − 1 + 1 + 0 = 0 ✓; 72 − 72 = 0 ✓

### Under Par (`under-par`, P2)
- **Definition:** Fewer strokes than par, for a hole or for the holes played so far. Two under means two strokes below par.
- Sources: Golf.com ("two under" after two birdies). Golf Compendium: "fewer strokes than the par of those holes".
- Recomputed: 34 − 36 = −2 ✓; birdie on the 10th: −3 ✓

### Over Par (`over-par`, P2)
- **Definition:** More strokes than par, for a hole or for the holes played so far. Three over means three strokes above par.
- Sources: Golfshake: "If the par for the course is 72, over par is a score of 73 or higher". Golf Compendium: "more strokes [than] the par of those holes".
- Recomputed: 85 − 72 = 13 ✓; 18 × (par + 1) = 72 + 18 = 90, 18 over ✓

### Scorecard (`scorecard`, P2)
- **Definition:** The paper card or approved electronic form where each hole's score is entered. In stroke play your marker enters your score hole by hole, and you both certify it when the round ends.
- Sources: RoG Definitions, Scorecard: "The document where a player's score for each hole is entered in stroke play", "any paper or electronic form approved by the Committee"; "not required in match play but may be used by the players to help keep the match score". Rule 3.3b(1)–(3): the marker enters and certifies the gross score; the player certifies and returns the card; a higher returned score "stands"; lower or none, "The player is disqualified".
- "Par and stroke index" on a printed card agrees with the published Stroke Index record ("printed on the scorecard").

### Front Nine (`front-nine`, P2)
- **Definition:** Holes 1 to 9 of an 18-hole course: the first half of the round for most groups.
- Sources: Golf Compendium: "holes 1, 2, 3, 4, 5, 6, 7, 8 and 9"; also "outward nine", "first nine", "front side". Golfshake: "the first nine holes played by the golfer, wether it be holes 1-9 or 10-18", the basis for the explanation's second sentence. GoLo's Nassau guide: "$20 on the front nine, $20 on the back nine, and $20 on the overall 18" (the example uses $5).

### Back Nine (`back-nine`, P2)
- **Definition:** Holes 10 to 18 of an 18-hole course: the second half of the round for most groups.
- Sources: Golf Compendium: "Hole No. 10 through Hole No. 18"; "inward nine", "second nine", "back side". Golfshake: "the final nine holes of an 18-hole golf course". Nassau guide as above.
- Recomputed: 38 − 36 = +2; 37 − 36 = +1; 38 + 37 = 75; 75 − 72 = +3 ✓

### Round (`round`, P2)
- **Definition:** Eighteen or fewer holes played in the order the committee sets. A full round is usually 18 holes, but nine holes is a round too.
- Sources: RoG Definitions, Round: "18 or fewer holes played in the order set by the Committee". Rule 1.1: "Golf is played in a round of 18 (or fewer) holes".
- The shotgun example follows the definition: the committee sets the order.

### Penalty Stroke (`penalty-stroke`, P2)
- **Definition:** A stroke added to your score under a Rule, not one you swing at. Most penalties are either one stroke or the general penalty: two strokes in stroke play, or loss of the hole in match play.
- Sources: Rule 1.3c(2): "three main penalty levels": one-stroke penalty (minor advantage, or "a player takes penalty relief by playing a ball from a different place than where the original ball lies"), the general penalty, disqualification. Definitions, General Penalty: "Loss of hole in match play or two penalty strokes in stroke play". Rule 17.1d: relief options for a ball in a penalty area, "each for one penalty stroke", including back-on-the-line relief.
- Recomputed: tee shot 1 + penalty 1 + third 1 + two putts 2 = 5 = 3 + 2, double bogey ✓

### Maximum Score (`maximum-score`, P2)
- **Definition:** A form of stroke play where each hole's score is capped at a maximum the committee sets, such as double par, a fixed number or net double bogey. Once you reach it, you can pick up.
- Sources: RoG Definitions, Maximum Score (quoted in the definition's list: "two times par, a fixed number or net double bogey"). Rule 21.2b(1): "A player who does not hole out under the Rules for any reason gets the maximum score for the hole"; players "are encouraged to stop playing a hole when their score has reached the maximum". Rule 21.2c: the five breaches that disqualify in stroke play, including failure to hole out (Rule 3.3c), get the maximum instead.
- Recomputed: double par on a par 4 = 8; lying 7, not holed, picks up: maximum 8 ✓
- The posting distinction agrees with the published Net Double Bogey record.

### Cut Line (`cut-line`, P3)
- **Definition:** In a tournament, the score a player has to match or beat to keep playing after the field is cut, usually halfway through. Players outside it have missed the cut and go home.
- Sources: The Golf News Net (page dated 2026-04-10): "Most PGA Tour events have a cut after two rounds, or 36 holes"; "the top 65 players and ties"; some events cut after 54 holes or to the top 50 and ties. Golfshake: the cut "is the elimination of, typically, the lower half of a stroke-play field at the midpoint of the tournament".
- Recomputed: 65th-best total 142, "and ties": 142 or better stays, 143 doesn't ✓
