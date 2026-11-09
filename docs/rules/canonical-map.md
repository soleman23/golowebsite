# Rules Center canonical map

Which URL owns which question, so the Rules Center doesn't compete with the glossary, the game guides or the blog. Issue #231 (RULES-001); spec §4 "Canonical ownership" and §9; tracking epic #230. Prepared November 6, 2026 against `main` at 108174f.

## Rules

1. **`/rules` is the only indexed URL for Release A.** Every overview and situation is a fragment on it (`/rules#rule-18`, `/rules#lost-ball`). `?category=` views are the same page: the canonical is always `/rules`, and filters never enter the sitemap.
2. **One owner per intent.**

   | Intent | Owner |
   |---|---|
   | What a term means | `/glossary#…` |
   | What the Rules of Golf say happens next | `/rules#…` |
   | How a betting game or format works, including its house rules | `/games/…` |
   | An editorial angle or an argument worth having | `/blog/…` |

   A page that touches another owner's intent states it in a sentence and links to it, rather than explaining it again.
3. **"<game> rules" belongs to the game guide.** Queries such as "nassau rules golf" and "skins golf rules" are about a game's format, not the Rules of Golf. They're the only "rules" queries the site gets today (`inventory.md` §Search evidence). `/rules` never targets them in titles, headings or aliases.
4. **House rules are labelled as house rules.** A gimme, a mulligan, a breakfast ball or a press is a group's agreement. The Rules Center can say what the Rules of Golf say instead; it never presents a convention as a Rule, or a Rule as optional.
5. **Model Local Rules are conditional.** E-5 and E-3 are described as "if the Committee has adopted it", never as the default.
6. **Handicapping is a different rulebook.** Rules of Handicapping citations stay in caveats and link to usga.org; they never sit in a rule overview as if they were Rules of Golf.

## Overlaps with existing content

| Existing page | Overlap | Treatment |
|---|---|---|
| `/glossary#penalty-area` | Rule 17, `red-vs-yellow-penalty-areas` | Glossary defines it; `/rules` says what to do. Each links to the other at launch (#242). |
| `/glossary#bunker` | Rule 12, `bunker-sand`, `unplayable-ball` | As above. |
| `/glossary#teeing-area` | Rule 6 | As above. |
| `/glossary#gimme` | `conceded-putt` | The glossary explains the convention and its posting note; `/rules#conceded-putt` explains match-play concessions and stroke-play holing out. The two must agree; #241 rechecks the glossary's posting note against Rules of Handicapping 3.3 and reports any mismatch rather than fixing the published record silently. |
| `/glossary#mulligan`, `#breakfast-ball` | Rule 1, Rule 18 | `/rules` says these aren't in the Rules and links to the glossary for the posting consequence. |
| `/glossary#match-play`, `#stroke-play`, `#four-ball`, `#foursomes`, `#stableford` | Rules 3, 21, 22, 23 | Overviews link to the glossary for the format's definition. |
| `/blog/gimmes` | `conceded-putt` | The post is the editorial angle ("when 'that's good' starts an argument"). `/rules` links to it as further reading. |
| `/blog/match-play-vs-stroke-play` | Rule 3 | The post owns "which should we play"; `/rules#rule-3` owns what the Rules require in each. |
| `/blog/best-ball-vs-scramble` | Rules 21.5, 23 | The post owns the comparison. Rule 23's overview links to it. |
| `/blog/closest-to-the-pin-rules` | none | A side-game convention post, not a Rules of Golf question. No link from `/rules`. |
| `/games/*` | none | Game guides own their own "rules". `/rules` links to `/games` only from Rules 3 and 21 ("games your group plays on top of the Rules"). |

## Link map (#242)

Every link into `/rules` that the launch adds, and the links out of it that #242 added. Prepared November 7, 2026 against `main` at 7cbb101.

### Where the links are

- **On `main` (merged with #242).** None of this changed production while `rulesLive` was false (it went true with #269 on 2026-11-07):
  - the related reading for Rules 3, 21 and 23;
  - the closing band's lead and the `rules-rulings` registry entry;
  - the glossary's link text for `/rules#…` paths (`glossaryPathLink`);
  - the content check for `/rules` paths in glossary records (`glossaryRulesPathProblems` in `scripts/rules-checks.mjs`). Before it, a bare `/rules` in a record's `relatedContentPaths` passed while the flag was off, because `/rules` is a route.
- **In the launch PR (#247), from branch `launch/242-rules-inbound-links`; merged as #269, `f27675b`, on 2026-11-07.** The footer link, the glossary record edits, the post links and the guide link. `lint:content` rejected each of them while the flag was off, so they ship in the same change that flips `rulesLive` and moves the records to `published`. § Launch check records how the branch was verified.

Every fragment below is an id in § Fragment registry. Each one resolves only once its record is published, and `lint:content` checks that on the launch branch.

### Inbound: footer

| Source | Link | Target | Why |
|---|---|---|---|
| `lib/content/nav.ts` `footerLinks.games`, after "Golf glossary" | Golf rules | `/rules` | Amendment A9: the site-wide entry point, beside the glossary. No header link (§13.4). |

### Inbound: glossary records

The owner approved these ten links in chat on November 7, 2026. They're on the launch branch, in `lib/content/glossary/terms/*.ts`, with the helper `rulesLinkReview` in `lib/content/glossary/review.ts`.

Each edit does three things, and nothing else:

1. Appends one path to the record's `relatedContentPaths`, after the paths it already has. The entry's link list shows it as "See what Rule N covers" for an overview, or "Read “<question>”" for a situation (`glossaryPathLink`).
2. Appends one review-log entry, identical on every record except for the path:

   ```ts
   {
     stage: "seo",
     by: "agent",
     on: "2026-11-07",
     note: "Related link <path> added for the Rules Center launch (#242), approved by the owner in chat on 2026-11-07. A link isn't a copy change, so reviewedOn and updatedOn stay.",
   }
   ```

3. Leaves everything else alone:
   - `reviewedOn` stays `2026-10-29`. The validator requires it to equal the latest `approval` entry, so the owner's yes is in the `seo` entry's note, not in an `approval` entry of its own.
   - `updatedOn` doesn't move, since a link isn't a substantive change.
   - The term, definition, explanation, example, rule note and GoLo note are unchanged.

Each target is the most specific record for the term: a situation where one answers the term's own example, otherwise the rule the record cites. Every target already links back to the term through its `relatedGlossaryIds`.

| Record | `relatedContentPaths` now | Adds | Target on `/rules` | Why | `updatedOn` moves | Copy changes |
|---|---|---|---|---|---|---|
| `penalty-area` | `[]` | `/rules#red-vs-yellow-penalty-areas` | Situation "Red or yellow penalty area: what are my options?" | The record says red marks allow more relief than yellow; the situation lists the options for each. | No | None |
| `bunker` | `[]` | `/rules#bunker-sand` | Situation "Can I touch the sand in a bunker?" | The record's example is the club resting on the sand; the situation says which touches cost a penalty. | No | None |
| `teeing-area` | `[]` | `/rules#rule-6` | Overview "Rule 6: Playing a Hole" | The record cites Rule 6.1b's penalty for playing from outside it. No situation covers it. | No | None |
| `gimme` | `["/blog/gimmes"]` | `/rules#conceded-putt` | Situation "Does a conceded putt count?" | The same question from the Rules side: a concession in match play, holing out in stroke play. | No | None |
| `match-play` | `["/games/nassau"]` | `/rules#rule-3` | Overview "Rule 3: The Competition" | The record cites Rule 3.2, which is in Rule 3. No situation is about the format. | No | None |
| `stroke-play` | `[]` | `/rules#rule-3` | Overview "Rule 3: The Competition" | The record cites Rule 3.3. | No | None |
| `four-ball` | `["/games/wolf", "/blog/best-ball-vs-scramble"]` | `/rules#rule-23` | Overview "Rule 23: Four-Ball" | The record cites Rule 23. | No | None |
| `foursomes` | `[]` | `/rules#rule-22` | Overview "Rule 22: Foursomes (Also Known as Alternate Shot)" | The record cites Rule 22. | No | None |
| `stableford` | `[]` | `/rules#rule-21` | Overview "Rule 21: Other Forms of Individual Stroke Play and Match Play" | The record cites Rule 21.1. | No | None |
| `mulligan` | `[]` | `/rules#rule-1` | Overview "Rule 1: The Game, Player Conduct and the Rules" | The record says a mulligan isn't allowed under the Rules; Rule 1's overview says what hitting again does under Rule 18. | No | None |

Considered and left out:

| Record | Why not |
|---|---|
| `breakfast-ball` | A mulligan by another name, and its rule content is the handicap-posting note. It reaches Rule 1 through `mulligan`. |
| `fairway`, `rough` | Each already says it's general area with no special rules. Rule 2 adds nothing for that reader. |
| `scramble` | The Rules have no scramble Rule. A link to Rule 21 would suggest they define one (`inventory.md`, notes on Rule 21). |
| `best-score` | A side game decided on the round's result, not a Rules format. |
| `sandy` | A side-game point. |
| `putt`, `driver`, `putter` | Definitions of a shot or a club, with no Rules question. |
| `net-score`, `handicap-stroke` | Handicapping, a separate rulebook (rule 6 above). |

### Inbound: posts

Each link wraps words already in the post, so no copy changes and `updated` doesn't move. Each post's Rule numbers keep their randa.org links; the new link is on the plain-language phrase next to them.

| Post | Where | Linked words | Target | Why |
|---|---|---|---|---|
| `/blog/gimmes` | "What the Rules actually allow", second paragraph | "must hole out on every hole" | `/rules#conceded-putt` | The situation gives both formats and Rule 3.3c's penalty. § Overlaps already links it back to the post. |
| `/blog/match-play-vs-stroke-play` | "Two formats, two questions", stroke-play paragraph | "you hole out on every hole" | `/rules#rule-3` | The post owns which format to play; Rule 3's overview owns what each requires (§ Overlaps). |
| `/blog/best-ball-vs-scramble` | "Best ball in GoLo is Team Play", callout "When a partner picks up" | "count one partner’s score when the other picks up" | `/rules#rule-23` | Rule 23.2a is the Rule behind that sentence, and Rule 23's overview says it. The overview links back. |

Considered and left out:

| Post | Why not |
|---|---|
| `net-vs-gross-scoring` | Its only Rules sentence already links Rule 3 on randa.org, and a second link would need new copy. |
| `closest-to-the-pin-rules` | A side-game convention, not a Rules of Golf question (§ Overlaps). |
| `first-tee-checklist` | Its conceded-putt sentence is about a house agreement across games. `gimmes` covers it. |
| The other "Game rules & how-to" posts (`nine-hole-games`, `golf-games-for-3-players`, `golf-games-for-2-players`, `five-dollar-birdie`, `skins-vs-nassau`, `nassau`, `skins-carryover`, `wolf`, `bingo-bango-bongo`) | Formats and money. None asks a Rules of Golf question; "match play" there is the glossary's to define. `nine-hole-games` cites the Rules of Handicapping only. |
| The handicaps posts | The Rules of Handicapping, a separate rulebook (rule 6). |

### Inbound: game guides

| Guide | Where | Link | Target | Why |
|---|---|---|---|---|
| `/games/overall-match` | FAQ `overall-match-8`, "What if the match or a press finishes level?" | WHAT RULE 3 COVERS → | `/rules#rule-3` | The answer cites Rule 3.2a(4) on a tied match. |

No other guide cites a Rule of Golf. Each one owns its game's house rules (rule 3 above).

### Outbound: related reading added by #242

These are Rules Center records, merged with #242. They're live when the records are published.

| Record | Path | Why |
|---|---|---|
| `rule-3` | `/blog/match-play-vs-stroke-play` | The post owns the comparison (§ Overlaps). |
| `rule-3` | `/games` | The games a group plays on top of the Rules (§ Overlaps). |
| `rule-21` | `/games` | As Rule 3. |
| `rule-23` | `/blog/best-ball-vs-scramble` | The post owns the comparison (§ Overlaps). |

Already in place before #242: `conceded-putt` → `/blog/gimmes`, and the hub's Related block (`/glossary`, `/games`, `/blog/gimmes`, `/blog/match-play-vs-stroke-play`).

### The closing band

`rulesFinalCta` in `lib/content/rules/copy.ts`. Its lead reads: "GoLo keeps the score and settles the side games. It doesn't make rulings: the drop and the penalty are yours to get right, and GoLo counts the strokes you enter."

The capability registry backs every claim in it:

- `hole-scoring`, `game-library` and `settle-up` are live.
- `rules-rulings` is not-offered. Its `claimPhrases` ("makes rulings", "applies the Rules", "rules engine" and others) fail any sentence that has GoLo making rulings or applying the Rules, wherever the claim guard reads.
- The lead passes the claim guard with no `claim-ok`.
- `test-rules` fails if `rules-rulings` goes live while the lead still denies it.

### Analytics

A glossary entry's `/rules#…` link reports `glossary_cta_click` with `destination_type: "rules"`. The launch PR (#247) added the value: before it, the link fell back to `page`, which also counts the product links. `destination_type` is already a registered GA4 dimension, so the new value needs no admin change.

### Launch check

Run on November 7, 2026 in a scratch worktree: the launch branch on top of #242's commits, with `rulesLive` flipped and all 25 overviews and 12 situations set to `published` with a `publishedOn`, as #247 will do.

- `npm run lint`, `npm run typecheck`, `npm run build` and `npm test` pass. lint:content reports 37 rules records valid, 37 published.
- The built HTML has every link in this map with the text above, and every target id is on `/rules`.
- No horizontal scroll on `/`, `/glossary`, `/rules`, the three posts or the guide, at 320, 760, 1100 and 1440px.
- Tab reaches each kind of new link (footer, glossary entry, post, guide FAQ) with the lime focus ring.
- With the flag still off, the branch fails `lint:content` on all 15 links and `test-rules` on the shipped-glossary case. It can't merge before the flip.

On top of the branch, #247:

- flips the flag;
- publishes the records, each with `publishedOn` set to `RULES_LAUNCHED_ON` in `lib/content/rules/launch.ts`;
- rewrites the two `test-rules` cases that stated the pre-launch state, as "launch: the flag is on (#247)" and "boundary: the shipped records are all published (#247)".

`docs/rules/launch-packet.md` has the QA run on the launch build.

## Missing glossary terms (candidates for #168)

The spec assumed these glossary anchors (A13). None exists. Until #168 ships one, the `/rules` situation owns the term as well as its consequences, and nothing links to the missing glossary anchor.

| Term | Suggested glossary slug | Owner until then |
|---|---|---|
| Provisional ball | `provisional-ball` | `/rules#provisional-ball` |
| Out of bounds | `out-of-bounds` | `/rules#out-of-bounds` |
| Lost ball | `lost-ball` | `/rules#lost-ball` |
| Unplayable ball | `unplayable` | `/rules#unplayable-ball` |
| Stroke and distance | `stroke-and-distance` | `/rules#rule-18` |
| Relief area | `relief-area` | `/rules#cart-path` |
| Ground under repair | `ground-under-repair` | `/rules#temporary-water` |

## Fragment registry

Every fragment the Rules Center publishes. Ids are permanent: a renamed record keeps its id, and a retired one is listed here with where it now points (none yet). `validateRules` (#233) checks that this registry and the records agree.

- **Overviews:** `rule-1` … `rule-25`.
- **Situations:** `lost-ball`, `provisional-ball`, `out-of-bounds`, `red-vs-yellow-penalty-areas`, `unplayable-ball`, `bunker-sand`, `cart-path`, `temporary-water`, `ball-moved`, `mark-lift-clean`, `repairing-the-green`, `conceded-putt`.
- **Page sections (reserved):** `rules-search`, `rules-results`, `rules-controls`, `rules-numbers`, `quick-situations`, `situations`, `all-rules`, `official-sources`, `related`, `cat-foundations`, `cat-playing`, `cat-course-areas`, `cat-relief`, `cat-formats`.

### Retired fragments

None.

## Competitor structure (for reference, nothing copied)

- **R&A Player's Rule Finder** (https://www.randa.org/players-rule-finder): a visual search over a drawn hole. The player picks the area of the course the ball is in and gets the matching rules. It's scoped to individual stroke play and match play, and the R&A's rules index suggests players start there rather than with the full Rules. Takeaway for `ux.md`: players think in course areas and in "what happened", not rule numbers. The quick-situation cards follow that, and the number grid serves the reader who already knows the rule.
- **USGA Rules hub** (https://www.usga.org/content/usga/home-page/rules-hub.html): a portal to the Rules text, short videos, a Rules course, the Rules app and workshops. It's a resource index, not an answer page. Takeaway: GoLo's value is the direct, conditional answer with the official link beside it, not another index.
