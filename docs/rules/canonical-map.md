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
