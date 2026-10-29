# Glossary canonical map

For each glossary term, which URL answers the search intent, and what the glossary does about it. Issue #152 (GLS-001), spec §7.2–7.3 and §7.6. Ids, slugs and categories come from `inventory.md`.

**Status:** prepared October 28, 2026 against `main` at ba08106. It's a proposal for owner review, not a sign-off. Ownership of the Nassau and Wolf guide/post pairs waits on #78 (see [Guide and post pairs](#guide-and-post-pairs)).

## The rules

1. **One owner per intent.** Each search intent has one canonical URL. The glossary never publishes a second page for an intent a guide or post already answers.
2. **Every published term has an anchor on the hub**, `https://www.golo.golf/glossary#<slug>`, whatever its canonical. The anchor is a deep link, not an indexable page (spec §7.3).
3. **Two kinds of canonical** in the MVP, matching the spec §8.2 `CanonicalTarget`:
   - `{ kind: "hub", anchor: <slug> }`: the hub entry is the answer. Short definition, example, notes, related terms.
   - `{ kind: "existing", path }`: a published guide or post owns the intent. The hub entry is a short definition and a "Read the full guide" link to `path`. It doesn't restate the guide's rules, so the guide stays the answer for "how does X work" (#158).
   - `{ kind: "detail", path }` is **not used in the MVP.** See [Standalone term pages](#standalone-term-pages-169).
4. **Structured data follows the visible definition.** A term's `DefinedTerm.url` is its hub anchor (`/glossary#<slug>`) even when its canonical is `existing`, because the hub anchor is where the `DefinedTerm`'s name and description are visible. The guide or post keeps the structured data it has today; nothing on it changes (#163).
5. **Aliases never get a URL.** No `/glossary#best-ball`, no redirect, no sitemap entry. An alias is a search key that resolves to one record (`inventory.md` § Alias decisions).
6. **Search and filter state never gets a URL either**, except `?category=<id>` (owner decision, #153). The hub's canonical stays `https://www.golo.golf/glossary` with or without it, and only `/glossary` goes in the sitemap. Search text is never in the URL.
7. **`existing` paths must be served.** Each one must be a published post (`publishedPosts`) or a guide (`gameDetailSlugsWithContent`), checked by `lint:content` (#155).

## MVP: 56 terms

Columns: **Canonical** is the target. **Related pages** are links the entry may carry besides its canonical, each an existing published page. **Planned related terms** are the starting `relatedTermIds`; only MVP ids are listed, since a link to an unpublished term never renders (#155). Every MVP term has a canonical and at least one related term or page (#152 acceptance criterion).

### A. Scoring (8)

| Term | Canonical | Glossary role | Related pages | Planned related terms |
|---|---|---|---|---|
| Par | hub `#par` | Full inline definition | — | `birdie`, `bogey`, `stroke-play` |
| Birdie | hub `#birdie` | Full inline definition | `/games/birdies` (the bounty game, not the definition) | `eagle`, `par` |
| Eagle | hub `#eagle` | Full inline definition | — | `birdie`, `par` |
| Bogey | hub `#bogey` | Full inline definition | — | `double-bogey`, `par` |
| Double Bogey | hub `#double-bogey` | Full inline definition; distinguishes Net Double Bogey | — | `bogey`, `net-double-bogey`, `snowman` |
| Gross Score | hub `#gross-score` | Full inline definition | `/games/best-score` | `net-score`, `stroke-play` |
| Net Score | hub `#net-score` | Full inline definition (spec §7.2). Standalone candidate for #169 | `/blog/index-vs-course-handicap` | `gross-score`, `handicap-stroke`, `course-handicap` |
| Stroke Play | hub `#stroke-play` | Full inline definition | — | `match-play`, `gross-score`, `stableford` |

### B. Games and formats (10)

| Term | Canonical | Glossary role | Related pages | Planned related terms |
|---|---|---|---|---|
| Skins | `/games/skins` | Short definition + guide link | `/blog/skins-carryover` | `carryover`, `push`, `net-score` |
| Nassau | `/games/nassau` | Short definition + guide link | `/blog/nassau`, `/blog/pressing` | `match-play`, `press` |
| Wolf | `/games/wolf` | Short definition + guide link; says tee order varies | `/blog/wolf` | `four-ball`, `match-play` |
| Bingo Bango Bongo | `/games/bingo-bango-bongo` | Short definition + guide link | `/blog/bingo-bango-bongo` | `closest-to-the-pin`, `putt` |
| Best Score | `/games/best-score` | Short definition + guide link; says how it differs from Four-Ball | — | `four-ball`, `gross-score`, `net-score` |
| Scramble | `/games/scramble` | Short definition + guide link | — | `four-ball`, `foursomes`, `handicap-allowance` |
| Four-Ball | hub `#four-ball` | Full inline definition; "best ball" alias and informal use | `/games/scramble`, `/games/wolf` | `foursomes`, `best-score`, `match-play` |
| Foursomes | hub `#foursomes` | Full inline definition; "alternate shot" alias | — | `four-ball`, `scramble`, `match-play` |
| Match Play | hub `#match-play` | Full inline definition | `/games/nassau` | `stroke-play`, `nassau`, `press` |
| Stableford | hub `#stableford` | Full inline definition. Education only, not a GoLo game | — | `stroke-play`, `par`, `net-score` |

### C. Side games (10)

| Term | Canonical | Glossary role | Related pages | Planned related terms |
|---|---|---|---|---|
| Press | `/blog/pressing` | Short definition + post link (spec §7.2: "definition and contextual article link") | `/games/nassau` | `re-press`, `nassau`, `match-play` |
| Re-press | hub `#re-press` | Full inline definition | `/blog/pressing` | `press`, `nassau` |
| Carryover | `/blog/skins-carryover` | Short definition + post link | `/games/skins` | `skins`, `push`, `greenie` |
| Push | hub `#push` | Full inline definition; distinguishes Halve | `/games/skins` | `carryover`, `skins`, `match-play` |
| Greenie | hub `#greenie` | Full inline definition; distinguishes Closest to the Pin | `/games/closest-to-pin` | `closest-to-the-pin`, `junk`, `sandy` |
| Sandy | hub `#sandy` | Full inline definition | `/games/skins` | `junk`, `bunker`, `greenie` |
| Junk | hub `#junk` | Full inline definition | `/blog/who-pays-first` | `greenie`, `sandy`, `settle-up` |
| Settle-up | hub `#settle-up` | Full inline definition; GoLo note from `settle-up` | `/blog/who-pays-first`, `/blog/settle-up-screen` | `junk`, `press`, `19th-hole` |
| Closest to the Pin | `/games/closest-to-pin` | Short definition + guide link | — | `greenie`, `longest-drive` |
| Longest Drive | `/games/longest-drive` | Short definition + guide link | — | `drive`, `driver`, `fairway` |

### D. Handicaps and course ratings (10)

| Term | Canonical | Glossary role | Related pages | Planned related terms |
|---|---|---|---|---|
| Handicap Index | `/blog/index-vs-course-handicap` | Short definition + post link | — | `course-handicap`, `score-differential` |
| Course Handicap | `/blog/index-vs-course-handicap` | Short definition + post link | — | `handicap-index`, `playing-handicap`, `slope-rating` |
| Playing Handicap | hub `#playing-handicap` | Full inline definition | `/blog/index-vs-course-handicap` (its "In a match, nobody plays their full number" section) | `course-handicap`, `handicap-allowance` |
| Course Rating | hub `#course-rating` | Full inline definition | `/blog/index-vs-course-handicap` | `slope-rating`, `course-handicap` |
| Slope Rating | hub `#slope-rating` | Full inline definition | `/blog/index-vs-course-handicap` | `course-rating`, `course-handicap` |
| Stroke Index | hub `#stroke-index` | Full inline definition (spec §7.2). Standalone candidate for #169 | `/blog/index-vs-course-handicap` | `handicap-stroke`, `net-score` |
| Handicap Stroke | hub `#handicap-stroke` | Full inline definition; "pop" alias | `/blog/index-vs-course-handicap` | `stroke-index`, `net-score`, `course-handicap` |
| Handicap Allowance | hub `#handicap-allowance` | Full inline definition. Education only; GoLo's limit stated from `handicap-strokes` | `/blog/index-vs-course-handicap` | `playing-handicap`, `four-ball`, `scramble` |
| Net Double Bogey | hub `#net-double-bogey` | Full inline definition; agrees with FAQ `q-pickup` | `/faq` | `double-bogey`, `score-differential` |
| Score Differential | hub `#score-differential` | Full inline definition | `/blog/index-vs-course-handicap` | `handicap-index`, `course-rating`, `slope-rating` |

### E. Shots (5), F. Course (5), G. Equipment (2), H. Slang (6)

All hub-canonical: no existing page owns these intents.

| Term | Canonical | Related pages | Planned related terms |
|---|---|---|---|
| Drive | hub `#drive` | `/games/longest-drive` | `driver`, `longest-drive`, `teeing-area` |
| Chip | hub `#chip` | — | `pitch`, `putt` |
| Pitch | hub `#pitch` | — | `chip` |
| Putt | hub `#putt` | — | `putter`, `gimme` |
| Slice | hub `#slice` | — | `drive`, `driver` |
| Teeing Area | hub `#teeing-area` | — | `drive`, `fairway` |
| Fairway | hub `#fairway` | `/games/longest-drive` | `rough`, `teeing-area` |
| Rough | hub `#rough` | — | `fairway` |
| Bunker | hub `#bunker` | — | `sandy`, `penalty-area` |
| Penalty Area | hub `#penalty-area` | — | `bunker` |
| Driver | hub `#driver` | — | `drive`, `longest-drive` |
| Putter | hub `#putter` | — | `putt` |
| Mulligan | hub `#mulligan` (spec §7.2) | — | `breakfast-ball` |
| Gimme | hub `#gimme` | — | `putt`, `match-play` |
| Breakfast Ball | hub `#breakfast-ball` | — | `mulligan` |
| Snowman | hub `#snowman` | — | `double-bogey`, `par` |
| 19th Hole | hub `#19th-hole` | — | `settle-up` |
| Worm Burner | hub `#worm-burner` | — | `drive` |

Count: 8 + 10 + 10 + 10 + 18 = 56.

## Expansion terms with an existing page

Every other expansion term is hub-canonical (`inventory.md`). These have an owner already:

| Term | Canonical | Note |
|---|---|---|
| Sandbagging | `/blog/sandbagging` | Short definition + post link |
| Rangefinder | `/blog/rangefinder` | Short definition + post link |
| Birdie Bounty | `/games/birdies` | Short definition + guide link |
| Eagle Bounty | hub, links `/games/birdies` | The guide covers it in passing ("Eagles usually count double") |
| Automatic Press | hub, links `/blog/pressing` | The post has a section on auto-presses, but "what is an automatic press" is a definition; revisit with #169 data |
| Lone Wolf | hub, links `/games/wolf` | |
| Texas Scramble, Shamble, Florida Scramble | hub, links `/games/scramble` | The guide's glossary defines the first two in one line each |
| Dormie, All Square, Halve | hub, links `/games/nassau` | The guide's glossary defines all three in one line each |
| Quota | hub, links `/games/best-score` | Same |

## Existing pages and the terms that point at them

Every published guide and the posts with glossary overlap. This is also the inbound-link candidate list for #164 (spec §7.6), which adds one to three links per page, in sentences already about the term, at launch only.

| Page | Owns | Glossary terms linking to it | Inbound candidates for #164 |
|---|---|---|---|
| `/games/skins` | Skins rules | Skins (canonical), Carryover, Push, Sandy | → Carryover, Net Score |
| `/games/nassau` | Nassau rules (see #78) | Nassau (canonical), Match Play, Press | → Match Play, Press |
| `/games/wolf` | Wolf rules (see #78) | Wolf (canonical), Four-Ball | → Four-Ball (its "best ball" glossary line) |
| `/games/bingo-bango-bongo` | BBB rules | Bingo Bango Bongo (canonical) | → Closest to the Pin |
| `/games/best-score` | Best Score rules | Best Score (canonical), Gross Score | → Net Score, Four-Ball |
| `/games/scramble` | Scramble rules | Scramble (canonical), Four-Ball | → Four-Ball, Stroke Index, Handicap Allowance |
| `/games/closest-to-pin` | CTP and greenies | Closest to the Pin (canonical), Greenie | → Greenie |
| `/games/longest-drive` | Longest drive rules | Longest Drive (canonical), Drive, Fairway | → Fairway |
| `/games/birdies` | Birdie bounties | Birdie (related only) | → Birdie, Eagle |
| `/blog/pressing` | "Pressing in golf" | Press (canonical), Re-press | → Re-press, Match Play |
| `/blog/index-vs-course-handicap` | Index vs Course Handicap | Handicap Index, Course Handicap (canonical); seven handicap terms related | → Stroke Index, Handicap Stroke, Playing Handicap |
| `/blog/skins-carryover` | Carryover math | Carryover (canonical) | → Push |
| `/blog/nassau` | Nassau stakes and house rules (see #78) | Nassau (related) | → Press, Match Play |
| `/blog/wolf` | Wolf strategy (see #78) | Wolf (related) | — |
| `/blog/bingo-bango-bongo` | BBB strategy | BBB (related) | — |
| `/blog/who-pays-first` | Settling-up etiquette | Junk, Settle-up (related) | → Settle-up |
| `/blog/settle-up-screen` | How GoLo's settle-up was built | Settle-up (related) | — |
| `/blog/sandbagging` | Sandbagging | Sandbagging (M8) | → Handicap Index |
| `/blog/rangefinder` | Rangefinder vs GPS | Rangefinder (M8) | — |
| `/faq` | Product questions | Net Double Bogey (related) | — (FAQ answers stay short) |

No glossary record competes with a page in this table. The checks behind that:

- Every intent a page owns is either that term's canonical (so the hub entry is short and links out), or a different intent. Example: Birdie the score vs Birdie Bounty the game.
- No MVP or expansion record restates a guide's rules section. #158–#162 reviewers check this per term.

## Guide and post pairs

`/games/nassau` vs `/blog/nassau`, and `/games/wolf` vs `/blog/wolf`, are #78's question: which URL ranks for which query, and is there real cannibalisation. This map doesn't decide it again. It follows the issue plan (#158):

- **Nassau** and **Wolf** take the **guide** as canonical (rules intent, "what is a Nassau"), with the post as a related page (stakes, house rules, strategy). This matches #78's prep (October 16): the guide is rules and terms, the post is stakes and house rules.
- When #78 records its finding, update this section. If #78 moves a query to the post, the glossary entry's canonical moves with it in the next content PR. Nothing else changes, since the hub anchor stays.
- The only page-level data so far is the October 8 baseline in `inventory.md` § Search evidence, taken before the current titles were live. It's not enough to decide.

## Standalone term pages (#169)

None in the MVP, and no empty `app/glossary/[slug]` route (#163). When #169 approves a page:

1. The record's canonical becomes `{ kind: "detail", path: "/glossary/<slug>" }`. The id and slug don't change.
2. `app/glossary/[slug]/page.tsx` follows the Blog and Games pattern:
   - `generateStaticParams` returns only published records with `canonical.kind === "detail"`;
   - `dynamicParams = false`, so anything else 404s;
   - the page's `pageMetadata` self-canonicalises to the full route;
   - it carries `DefinedTerm` with `inDefinedTermSet` pointing at the hub's `DefinedTermSet` `@id`.
3. The hub entry stays, as a short definition linking to the page; the hub anchor keeps working.
4. The sitemap adds the route with the term's real `updatedOn` or `publishedOn`.
5. Each page needs the five criteria in spec §6.1, written down in the #169 brief. Candidates already named: Net Score, Stroke Index.

## Retired slugs

A published slug never silently disappears:

- **Fragment only** (MVP): a renamed term keeps the old slug as a hidden anchor on the hub for at least a year, so old `#<slug>` links still land. Nothing can redirect a fragment server-side. The anchor is an empty element with the old id placed before the entry, and the client deep-link handler treats it as that term.
- **Detail page** (post-#169): a 308 redirect in `next.config.mjs`, matching the existing legacy-redirect list.
- An archived term (`status: "archived"`) drops out of the hub. Inbound links to it fail `lint:content` (#155), and are fixed in the same PR.

## Category URLs

`/glossary?category=<id>` is the only query string the hub reads, via the existing `FilterUrlSync` / `useInitialFilter` pattern. Category ids are the eight in `inventory.md`. Its canonical is `https://www.golo.golf/glossary`; it's never in the sitemap, `llms.txt` or an internal link's `href` except where a link deliberately opens a category. An unknown `category` value falls back to all terms.
