# GoLo Golf Glossary
## Final Product Requirements & SEO Specification — v1.0

> **Repository copy.** Imported from the owner's v1.0 spec on October 28, 2026, unchanged below this note. The GitHub plan built from it (milestones, issues, dependencies, and the reconciliation against `main` that found where the spec and the code disagree) lives in the issues labelled `glossary`, starting from the tracking epic.

**Date:** October 28, 2026  
**Project:** GoLo Golf Marketing Website  
**Website:** https://www.golo.golf/  
**Primary proposed route:** https://www.golo.golf/glossary  
**Repository:** https://github.com/soleman23/golowebsite  
**Related growth roadmap:** https://github.com/soleman23/golowebsite/issues/106  
**Status:** Specification decisions approved; implementation **not** started  
**Implementation policy:** This is a planning document. No code, issues, branches, PRs, database migrations, merges, or deployments are authorized by the document itself.

---

## Executive summary

Create a comprehensive, searchable GoLo Golf Glossary to help new and experienced golfers understand terminology, scoring, side games, handicaps, course rules, equipment, and golf slang. It should be a useful reference **first**, an educational GoLo resource **second**, and an organic user-acquisition channel throughout.

The approved plan calls for **166 planned canonical terms** across eight categories, with **56 polished, reviewed definitions at launch**. The initial user experience includes a crawlable alphabetical directory, instant search, category filtering, cross-links to existing game guides and blog posts, and carefully contextualized app calls to action. Individual term SEO pages should only be published when justified by distinct search demand and content value. Interactive calculators, quizzes, and advanced visual learning experiences are deferred.

**Primary outcome:** More qualified users discovering GoLo and downloading the app.  
**Secondary outcome:** Email newsletter signups and a steadily growing educational audience.

The key differentiator is **original, accurate examples connected to how golf groups actually score and play**, rather than bulk production of generic dictionary entries.

---

# 1. Approved product decisions

| Decision | Approved requirement |
|---|---|
| Glossary breadth | Comprehensive golf dictionary: 150+ terms |
| Definitive inventory | 166 planned unique canonical entries |
| Editorial tone | Professional definitions with GoLo's funny, irreverent personality |
| Initial release | 56 polished terms, within the agreed launch range of 50–60 |
| Detail pages | Only create individual SEO pages when they are independently justified |
| Primary marketing conversion | GoLo app downloads |
| Secondary marketing conversion | Newsletter subscriptions |
| v1 interactions | Search, A–Z browsing, category filters, direct term links |
| Future interactions | Scoring diagrams, calculators, quizzes, interactive explainers |
| Implementation repo | `soleman23/golowebsite` |
| Data storage | Typed, version-controlled content; no new DB for MVP |
| Release status | Planning only; nothing to build or modify yet |

The **166-term inventory is not a mandate to generate 166 individual web pages**. Page creation is governed by distinct search intent, editorial quality, and canonical ownership.

# 2. Product vision, positioning, audiences and voice

## 2.1 Public-facing positioning

**Title:** GoLo Golf Glossary: Golf Terms, Slang, Scoring & Side Games Explained  
**Hero line:** *Know the game. Talk the talk.*  
**Supporting line:** *From birdies and bogeys to skins, presses, and sandbaggers. Golf's terminology explained without the clubhouse lecture.*

The glossary serves three connected objectives:

1. **Educate.** Give accurate, plain-language definitions, practical examples, and references when relevant.
2. **Attract.** Reach non-branded golf searches, including searches from golfers unfamiliar with GoLo.
3. **Convert.** Show the right readers how GoLo can help with *currently supported* scoring, games, handicap allocation, and settle-up tracking.

## 2.2 Audience segments

| Audience | Information need | GoLo opportunity |
|---|---|---|
| New/casual golfers | Birdies, bogeys, etiquette, common slang | Introduce golf scoring and GoLo |
| Weekend golfers | Skins, Nassau, presses, junk, handicaps | Explain side-game scoring and current support |
| Golf-trip organizers | Formats, groups, team play, side bets | Show how supported games can be organized |
| Competitive amateurs | Gross vs. net, handicap adjustments, stroke index | Demonstrate scoring accuracy and establish credibility |

Definitions must remain beginner-accessible without oversimplifying formal rules or handicap math.

## 2.3 Editorial voice and examples

- Start with an accurate, direct definition.
- Follow with a concrete, recognizable golf example.
- Humor comes after clarity; do not change facts to land a joke.
- Prefer specific situations over filler and generic platitudes.
- Distinguish **official rules**, **common conventions**, and **house rules**.
- Be inclusive and avoid portraying beginners as incompetent.
- Explain jargon without introducing unneeded jargon.

**Approved style example:**

> **Press:** A new wager or match started while an existing match continues.  
> *Example: You're down two holes, your buddy is already shopping for the victory beer, and you ask for a press. Congratulations—you now have two matches to worry about.*

When appropriate, explain that a press, automatic press, or re-press depends on agreed group rules.

# 3. Current website integration and truth requirements

## 3.1 Existing technical foundation

Repository review as of October 28, 2026 found:

- Next.js 15 App Router, TypeScript, React, CSS Modules.
- Site-wide content and navigation data under `lib/content/`.
- Existing game detail routes at `/games/[slug]` and posts at `/blog/[slug]`.
- Server-generated per-page metadata and a content-driven sitemap at `app/sitemap.ts`.
- Shared schema helpers in `lib/schema.ts`.
- Existing `scripts/check-content.mjs` for claim restrictions, internal links and metadata checks.
- Consent-aware GA4 instrumentation via `lib/analytics.ts`.
- Download/store availability controlled by `lib/siteConfig.ts`.

### Current published game roster in code

`skins`, `nassau`, `best-score`, `wolf`, `bingo-bango-bongo`, `scramble`, `closest-to-pin`, `longest-drive`, `birdies`.

These are existing guides and should be preferred as canonical answers for matching format-specific searches when they already satisfy the query.

## 3.2 Product capability source of truth

`lib/content/capabilities.ts` remains authoritative for marketing claims. It defines statuses such as `live`, `testing`, `planned`, and `not-offered`, with verification provenance and limits.

Important facts observed in the repository at the time of planning:

- **Scramble:** marked live with team handicaps, but has defined game/format limitations.
- **Presses:** live on **Overall Match**, manually called; not automatic; **Nassau does not take presses in GoLo**.
- **Handicaps:** stroke allocation is based on current group tee selection; do not claim per-player individual tees are live until verified and released.
- **Settlements:** GoLo shows who owes whom and provides a short settle-up list. It **does not hold, move, send, receive, or process payments**, and does not guarantee the mathematically fewest possible transfers.
- **Store availability:** Android is listed live on Google Play as of October 26, 2026; the native iOS listing is separately gated and the browser app is available. Read live configuration at publication time.

**Rule:** The glossary can *educate* about any legitimate golf concept. It must only *advertise GoLo support* for verified live capabilities. Never duplicate capability status as uncontrolled literal text across content records.

# 4. Definitive content taxonomy and term inventory

There are eight primary categories and **166 planned canonical entries**. Editorial planning counts are intentionally separate from the number of indexable URLs.

| Category | MVP | Expansion | Planned total |
|---|---:|---:|---:|
| A. Scoring | 8 | 16 | 24 |
| B. Games and formats | 10 | 14 | 24 |
| C. Side games and wagers | 10 | 16 | 26 |
| D. Handicaps and course ratings | 10 | 10 | 20 |
| E. Shots and ball flight | 5 | 15 | 20 |
| F. Course, rules and etiquette | 5 | 15 | 20 |
| G. Equipment and technology | 2 | 10 | 12 |
| H. Slang and golf culture | 6 | 14 | 20 |
| **TOTAL** | **56** | **110** | **166** |

The terms below form the approved **editorial backlog**, subject to final precision checks before each term becomes published content. Synonyms do not become separate canonical records merely to inflate the count. If a listed candidate proves substantively redundant, replace it with a similarly relevant unique term and record the revision.

## A. Golf scoring — 24 terms

**MVP (8):** Par; Birdie; Eagle; Bogey; Double Bogey; Gross Score; Net Score; Stroke Play.

**Expansion (16):** Hole-in-One; Albatross; Condor; Triple Bogey; Quadruple Bogey; Even Par; Under Par; Over Par; Scorecard; Front Nine; Back Nine; Stableford Points; Round; Penalty Stroke; Maximum Score; Cut Line.

**Editorial requirements:** Use simple hole/scorecard examples, explain relation to par, and distinguish net from gross. Explain that a cut line concerns qualifying play rather than an individual hole score. Treat rare scoring achievements clearly as unusual, not common.

## B. Golf games and competition formats — 24 terms

**MVP (10):** Skins; Nassau; Wolf; Bingo Bango Bongo; Best Score; Scramble; Four-Ball; Foursomes; Match Play; Stableford.

**Expansion (14):** Shamble; Chapman; Pinehurst; Texas Scramble; Modified Stableford; Ryder Cup-style Competition; Vegas; Quota; Sixes; Nines; Round Robin; Individual vs. Team Competition; Peoria System; Three-Ball.

**Editorial requirements:** Explain players, scoring basis, typical variations, and where house rules differ. Display product-support claims only when verified.

**Aliases:** “Best Ball” should point to Four-Ball in the formal scoring sense, with a note that naming is sometimes informal. “Alternate Shot” should point to Foursomes where the competition format matches; distinguish casual variants when necessary. Do not create duplicate canonical SEO pages for aliases.

## C. Side games and friendly wagers — 26 terms

**MVP (10):** Press; Re-press; Carryover; Push; Greenie; Sandy; Junk; Settle-up; Closest to the Pin; Longest Drive.

**Expansion (16):** Automatic Press; Side Pot; Buy-in; Stakes; Payout; Debt Netting; Birdie Bounty; Eagle Bounty; Barkie; Poley; Snake; Dots; Hammer; Double or Nothing; Lone Wolf; Partner Bet.

**Editorial requirements:** Use concrete examples and small, agreed stakes; separate educational betting vocabulary from GoLo's actual functionality. Explain varying house rules. Do not imply GoLo sends money, automatically starts presses, or supports all listed wagers.

## D. Handicaps and course ratings — 20 terms

**MVP (10):** Handicap Index; Course Handicap; Playing Handicap; Course Rating; Slope Rating; Stroke Index; Handicap Stroke; Handicap Allowance; Net Double Bogey; Score Differential.

**Expansion (10):** World Handicap System (WHS); Scratch Golfer; Bogey Golfer; Plus Handicap; Sandbagging; Playing Conditions Calculation (PCC); Soft Cap; Hard Cap; Exceptional Score Reduction; Most Likely Score.

**Editorial requirements:** Differentiate Handicap Index, Course Handicap and Playing Handicap precisely, and explain competition allowances and stroke allocation with verifiable examples. Refer to the current governing-body World Handicap System guidance. Do not conflate official rules with GoLo's implementation limits.

## E. Golf shots and ball flight — 20 terms

**MVP (5):** Drive; Chip; Pitch; Putt; Slice.

**Expansion (15):** Draw; Fade; Hook; Shank; Flop Shot; Punch Shot; Bump-and-Run; Lag Putt; Approach Shot; Layup; Fat Shot; Thin Shot; Topped Shot; Up-and-Down; Three-Putt.

**Editorial requirements:** Explain what the shot is, when it is used and how it differs from similar shots. Visuals should clarify physical movements or ball flight, not merely decorate.

## F. Course layout, rules and etiquette — 20 terms

**MVP (5):** Teeing Area (Tee Box); Fairway; Rough; Bunker; Penalty Area.

**Expansion (15):** Putting Green; Fringe; General Area; Out of Bounds; Provisional Ball; Unplayable Ball; Stroke and Distance; Relief Area; Nearest Point of Complete Relief; Ground Under Repair; Temporary Water; Preferred Lies; Ready Golf; Local Rule; Pace of Play.

**Editorial requirements:** Use modern R&A/USGA rules terminology; clarify colloquial alternatives (“tee box”) and historical terms. Where a definition concerns an official procedure, cite current official guidance.

## G. Equipment and technology — 12 terms

**MVP (2):** Driver; Putter.

**Expansion (10):** Iron; Wedge; Hybrid; Fairway Wood; Loft; Lie Angle; Bounce; Shaft Flex; Rangefinder; Launch Monitor.

**Editorial requirements:** Basic definitions, not shopping guides. Lower priority than scoring, games and handicapping. Avoid unnecessary brand-specific claims.

## H. Golf slang and culture — 20 terms

**MVP (6):** Mulligan; Gimme; Breakfast Ball; Snowman; 19th Hole; Worm Burner.

**Expansion (14):** Banana Ball; Fried Egg; Chili Dip; Lip-Out; Dance Floor; The Turn; Dormie; All Square; Good-Good; Hosel Rocket; The Yips; Army Golf; Member's Bounce; Grip It and Rip It.

**Editorial requirements:** Light personality, a plain-language definition and the context in which the expression is used. Clearly label informal phrases and non-Rules-of-Golf practices. Explain historical/legacy expressions such as “all square” where appropriate.

## 4.1 Inventory governance

1. One stable canonical record per distinct concept; aliases do not count separately.
2. Each term has exactly one primary category and optional secondary tags.
3. If a word has multiple meanings, choose one record with numbered definitions unless separate intent genuinely warrants another page.
4. House-rule-dependent terms require appropriate caveats.
5. Unsupported formats are educational only and must not display misleading feature badges.
6. Keep the fixed 56-term MVP as the starting plan, allowing documented substitutions if necessary for correctness or relevance.
7. Do not publish an expansion term until it has passed the same editorial review as an MVP term.

# 5. Information architecture and UX flows

## 5.1 Route hierarchy

```text
/glossary
  Intro and featured definitions
  Search and category filters
  Browse A–Z
  Complete published term directory
  Related educational resources
  Contextual GoLo CTA and newsletter

/glossary/[slug]
  Only approved, independently valuable standalone pages

Existing routes remain authoritative when appropriate:
  /games/[slug]
  /blog/[slug]
  /features
  /how-it-works
```

## 5.2 Main hub sections

1. **Header / hero:** H1 “Golf Glossary: Terms, Slang & Games Explained,” short introductory text, visible search.
2. **Popular terms:** A small curated selection connected to core user needs; avoid implying unverified popularity from analytics.
3. **Category discovery:** Eight clearly named topic filters.
4. **A–Z navigation:** Jump to or filter by alphabetical group with consistent semantics.
5. **Definition directory:** Short definition, example, relevant term links and deeper reading where helpful.
6. **Related guides:** Contextual pathways to Games, Blog and How It Works.
7. **Relevant GoLo CTA:** Correct live platform options and truthful supported features.
8. **Newsletter:** Existing subscription system, secondary to app conversion.

Desktop may use a sidebar or wider filters; mobile must preserve one-column reading, usable controls, and no horizontal overflow. Keep search close to the top and preserve accessible heading hierarchy.

## 5.3 Required user flows

| Flow | Trigger | Expected result |
|---|---|---|
| Browse | Visit `/glossary` | Full published directory and featured terms load |
| Search | Enter query | Matching published terms show immediately |
| Filter | Choose category | Only category matches show |
| Combine | Search within a category | Intersection of matches shows |
| Browse letter | Choose A–Z entry | Move to appropriate letter or apply letter filter consistently |
| Expand/open | Activate a term | Reveal more explanation or open its assigned canonical resource |
| Deep link | Visit `/glossary#press` | Press is visible, focused/located appropriately |
| Related term | Follow related link | Arrive at corresponding definition or canonical guide |
| Share | Copy term link | Copy stable URL for same definition |
| No results | Enter unknown term | Clear empty state, reset option and suggestion link |
| App CTA | Activate relevant CTA | Correct configured download/product destination |
| Newsletter | Submit signup | Existing validation, consent and error handling used |

## 5.4 Search specification

- Client-side search over the entire **published** term inventory; server rendering still supplies readable definitions without JS.
- Case-insensitive; normalize whitespace, punctuation and safe accents.
- Ranking: exact canonical name > exact alias > term prefix > partial term > alias prefix > description/tag match.
- Explicit synonyms/aliases, not blind keyword expansion.
- Search and category filters combine; clearing resets both.
- Stable deterministic result ordering, with alphabetical tie-breaking.
- Visible and accessible result count.
- Do not send one analytics event per keystroke.
- Do not log raw free-text search values.
- Do not create separate indexable URL variants for filters or queries.
- Important deep links must show their target even if local UI state would otherwise hide it.

**Examples:** `double eagle` → Albatross (once published); `alternate shot` → Foursomes; `pop` → Handicap Stroke where editorially appropriate; `tee box` → Teeing Area; `wolf` → Wolf and related variants; `auto press` → Automatic Press (once published).

## 5.5 Progressive enhancement and accessibility

- Primary definitions visible in server-rendered HTML and readable with JavaScript disabled.
- Semantic definition lists (`<dl>`, `<dt>`, `<dd>`) where appropriate.
- Real buttons and links for interactive controls; no clickable non-interactive elements.
- Complete keyboard access, visible focus states and sufficient contrast.
- Screen-reader result announcements without announcing each keystroke.
- Correct focus behavior after opening a deep link or changing a major view.
- Respect reduced-motion preferences; avoid unnecessary movement.
- Support browser history and direct navigation predictably.
- No focus traps, obstructed touch targets or overflowing filter chips.

## 5.6 Responsive QA breakpoints

| Viewport | Behavior |
|---|---|
| 320 px | One-column, compact controls, no horizontal overflow |
| 760 px | Comfortable two-column optional discovery layout |
| 1100 px | Optional sidebar or wider topic discovery |
| 1440 px | Centered reading content with restrained line lengths |

Add the glossary to footer and relevant educational navigation first; determine header placement in design review to avoid overcrowding the existing mobile nav.

# 6. Standalone term pages and editorial page template

## 6.1 When does a term deserve `/glossary/[slug]`?

**All five criteria must hold:**

1. A distinct search intent exists (or clear first-party need).
2. Existing `/games`, `/blog` or other pages do not already adequately satisfy that intent.
3. The topic benefits from a materially deeper explanation, example or visual.
4. The planned page provides substantial original value, not duplicated boilerplate.
5. Canonical owner, internal links and maintenance responsibility are documented.

**No detail-page quota.** The 56-term MVP can launch entirely on the main hub. Never create 56 thin individual pages just because the glossary has 56 terms.

## 6.2 Individual term-page template

1. Breadcrumbs and topic category.
2. Descriptive H1: term and, where helpful, the question it answers.
3. Clear answer in the first paragraph.
4. Extended plain-language explanation if needed.
5. One accurate worked example.
6. Variations, exceptions and house-rule caveats.
7. Formal rules sources where applicable.
8. Related terms and one or two useful existing guides.
9. Contextual, honest GoLo CTA if applicable.
10. Unique metadata, self-referencing canonical and appropriate schema.

Avoid generic artificial word counts and repetitive intros.

# 7. SEO strategy and canonical ownership

## 7.1 Search-intent priorities

| Tier | Sample queries | Recommended handling |
|---|---|---|
| P0: Direct GoLo relevance | What is a golf press? How do skins work? Nassau rules | Link to supported guides and current feature explanations |
| P1: High relevance | Net score vs. gross score, playing handicap, stroke index | Rich definitions, examples and appropriate product connections |
| P2: Broad education | What is a birdie? What does mulligan mean? | Reference coverage and brand awareness |
| P3: Long-tail | Greenie, barkie, dormie, worm burner | Specific, accurate definitions and thematic linking |

Priorities express strategic fit **not verified search volumes**. Final standalone briefs require GSC/SERP evidence or a clearly documented first-party angle.

## 7.2 Canonical content ownership map

| Topic / intent | Initial canonical destination | Glossary role |
|---|---|---|
| Golf terms A–Z | `/glossary` | Primary hub |
| Nassau rules | `/games/nassau` | Short definition and guide link |
| Skins rules | `/games/skins` | Short definition and guide link |
| Wolf rules | `/games/wolf` | Short definition and guide link |
| Pressing in golf | `/blog/pressing`, pending intent audit | Definition and contextual article link |
| Handicap Index vs. Course Handicap | Existing handicap article, pending audit | Definitions and a link to detailed comparison |
| Net score meaning | `/glossary#net-score` initially | Full inline definition |
| Mulligan meaning | `/glossary#mulligan` initially | Inline definition |
| Stroke index explained | `/glossary#stroke-index` initially | Candidate for future deeper page |

The exact canonical ownership must be verified against the latest site's search performance and existing content before publishing a new detail page.

## 7.3 Canonical and routing rules

- `/glossary` self-canonicalizes to `https://www.golo.golf/glossary`.
- Approved standalone detail pages self-canonicalize to their full route.
- Aliases lead to a single canonical term; avoid indexable duplicate aliases.
- Search/filter/sort states are not independently indexed.
- Drafts, archived terms and unpublished detail paths are absent from the sitemap and public search payload.
- Define proper redirects for retired public slugs.
- URL fragments such as `#press` are deep-link anchors **not** separate indexable pages.
- Use explicit, meaningful internal-link anchor text, not forced keyword stuffing.

## 7.4 Metadata examples

**MVP title:** `Golf Glossary: Terms, Slang & Games Explained | GoLo Golf`  
**MVP description:** `Learn golf terms, scoring rules, handicaps, slang and side games with clear definitions and real examples from GoLo Golf.`

**Later title only once true:** `Golf Glossary: 150+ Terms, Slang & Games | GoLo Golf`.

Use one H1, logical H2 sections, accessible definitions and unique page metadata. Do not claim 150+ terms while only 56 are public.

## 7.5 Structured data

- Reuse existing shared Organization/WebSite IDs and builders.
- Represent the main collection as a Schema.org `DefinedTermSet` where appropriate.
- Use `DefinedTerm` for visible published entries and `inDefinedTermSet` relationships for relevant detail pages.
- Dedicated pages may have connected `WebPage` nodes and appropriate visible references.
- Structured data must match visible content and validated canonical URLs.
- No FAQ rich-result promises, spammy FAQ markup, fake authors, or fabricated review metadata.
- Validate through Schema.org and applicable search-engine testing tools, with any warnings documented.

Structured data expresses meaning; it does **not** guarantee rich results or AI citations.

## 7.6 Internal-link strategy

Useful clusters:

- Skins → Carryover → Net Score → `/games/skins`.
- Nassau → Match Play → Press → `/blog/pressing`.
- Course Handicap → Stroke Index → Handicap Stroke → existing handicap article.
- Scramble → Four-Ball → Team Competition → `/games/scramble`.

High-priority terms should receive relevant contextual inbound links from existing game guides and blog posts, rather than relying only on the glossary index. Do not add links indiscriminately.

## 7.7 Sources and external standards

Primary sources to consult and recheck at publication:

- R&A/USGA **Rules of Golf** definitions and guidance: https://www.randa.org/rog
- USGA **World Handicap System** and handicapping guidance: https://www.usga.org/handicapping.html
- Schema.org `DefinedTerm`: https://schema.org/DefinedTerm
- Schema.org `DefinedTermSet`: https://schema.org/DefinedTermSet
- Google Search Central canonical guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central people-first content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Use official current texts as the source of truth for specific rules, procedures and handicapping calculations. Reference competitor pages to understand content gaps, not to copy definitions or illustrations.

# 8. Technical architecture and content contracts

## 8.1 Proposed repository layout

```text
golowebsite/
├── app/
│   └── glossary/
│       ├── page.tsx
│       ├── glossary.module.css
│       └── [slug]/
│           └── page.tsx
├── components/
│   └── glossary/
│       ├── GlossarySearch.tsx
│       ├── GlossaryFilters.tsx
│       ├── AlphabetNavigation.tsx
│       ├── GlossaryDirectory.tsx
│       ├── GlossaryEntry.tsx
│       ├── RelatedTerms.tsx
│       └── GlossaryCTA.tsx
├── lib/
│   └── content/
│       └── glossary/
│           ├── types.ts
│           ├── categories.ts
│           ├── terms.ts
│           ├── selectors.ts
│           └── seo.ts
├── docs/
│   └── glossary/
│       ├── product-spec.md
│       ├── inventory.md
│       ├── canonical-map.md
│       └── editorial-review.md
└── scripts/
    └── (extend existing content checks)
```

This is an architectural proposal. Final file names and code placement should be reconciled with the current repository conventions. Avoid gratuitous abstraction and new dependencies.

## 8.2 TypeScript data contract

```typescript
type GlossaryCategoryId =
  | "scoring"
  | "formats"
  | "side-games"
  | "handicaps"
  | "shots"
  | "course-rules"
  | "equipment"
  | "slang";

type PublicationStatus =
  | "planned"
  | "draft"
  | "in-review"
  | "approved"
  | "published"
  | "archived";

type CanonicalTarget =
  | { kind: "hub"; anchor: string }
  | { kind: "detail"; path: string }
  | { kind: "existing"; path: string };

type GlossarySource = {
  title: string;
  url: string;
  kind: "official-rules" | "handicapping" | "editorial" | "first-party";
  accessedOn?: string;
};

type GlossaryTerm = {
  id: string;
  slug: string;
  term: string;
  aliases: string[];

  primaryCategory: GlossaryCategoryId;
  tags: string[];
  priority: "mvp" | "expansion";

  shortDefinition: string;
  explanation?: string;
  example?: string;
  ruleNote?: string;

  relatedTermIds: string[];
  relatedContentPaths: string[];

  canonical: CanonicalTarget;
  capabilityIds: string[];
  ctaIntent?: "games" | "handicaps" | "settle-up" | "download" | "none";

  sources: GlossarySource[];

  status: PublicationStatus;
  reviewedBy?: string;
  reviewedOn?: string;
  publishedOn?: string;
  updatedOn?: string;
};
```

### Notes on the contract

- `id` is stable and internal; `slug` is public routing/deep-link identifier.
- `aliases` should resolve via a reviewable canonical mapping.
- `relatedTermIds` must reference known IDs, not unreviewed free-form strings.
- `relatedContentPaths` must pass the site's existing link validation.
- `capabilityIds` references existing verified capability records; it is **not** itself a public support badge.
- Publication status governs route generation, sitemap, search payload, and schema.
- `reviewedOn`, `publishedOn`, `updatedOn` must correspond to real editorial events.
- Any record with `canonical.kind === "existing"` should point to an existing, published page.

## 8.3 Example draft record: Press

```typescript
const press: GlossaryTerm = {
  id: "press",
  slug: "press",
  term: "Press",
  aliases: ["press bet", "pressing a bet"],

  primaryCategory: "side-games",
  tags: ["match-play", "wagers", "nassau"],
  priority: "mvp",

  shortDefinition:
    "A new wager or match started while an existing match continues.",
  explanation:
    "A press creates a separate result. The original match stays active.",
  example:
    "Two down after six holes? Agree on a press starting on seven. " +
    "The original match and new match are tracked separately.",
  ruleNote:
    "Press rules vary by group. Automatic presses are not universal.",

  relatedTermIds: ["nassau", "re-press", "match-play"],
  relatedContentPaths: ["/blog/pressing"],

  canonical: { kind: "hub", anchor: "press" },
  capabilityIds: ["overall-match-presses"],
  ctaIntent: "games",

  sources: [],
  status: "draft",
};
```

This is an illustrative **draft**, not approved production content. Add authoritative source records, verified publication data and any editorial changes before publication. The source of truth for actual GoLo press behavior remains the capability registry.

## 8.4 Data integrity and static generation

Enforce the following checks:

1. Unique normalized primary terms, IDs and public slugs.
2. Approved alias collisions and ambiguity handling.
3. Valid categories, canonical destinations and link targets.
4. All related-term IDs resolve to existing records; links to unpublished terms must not appear publicly.
5. All `capabilityIds` resolve, and support claims use live verified status only.
6. Dates are correctly formatted and represent actual review/publication changes.
7. Drafts and archived terms never appear in public search output, static routes, sitemap or term structured data.
8. Escaped and safe rendering of all content; no raw untrusted HTML.
9. Deterministic alphabetical ordering and stable search output.
10. No hard-coded unsupported feature claims in titles, CTAs or schema.

Implementation should use server rendering/static generation for content, with lightweight client-side enhancement for searching and filtering. For approved individual routes, use the Next.js App Router's static parameter generation and 404 behavior consistently with the site's current Blog and Games patterns.

## 8.5 No new infrastructure required

For MVP, do **not** add a CMS, new content database, external search service, authentication requirements, new analytics vendor, or specialized indexing API. Reconsider only when a demonstrated operational requirement exists (e.g., multi-editor approvals or live publishing).

## 8.6 Existing infrastructure integration

- Reuse `lib/siteConfig.ts` for store availability and site URLs.
- Reuse current StoreButtons and FinalCTA patterns rather than inventing a second download pathway.
- Extend `app/sitemap.ts` to include the hub and approved published term routes.
- Extend `lib/schema.ts` shared identifiers for structured data.
- Extend `scripts/check-content.mjs` to validate glossary links and marketing claims.
- Maintain existing GA4 consent and PII protections in `lib/analytics.ts`.
- Review `lib/content/nav.ts` for placement and mobile navigation constraints.
- Preserve the site's existing URL sanitization; avoid unreviewed search query-string exceptions. Fragment deep links (`#press`) are preferred for MVP.

# 9. Analytics, acquisition and conversion

## 9.1 Primary funnel

**Non-branded organic discovery → glossary engagement → related guide/product consideration → app/store action → verified acquisition, where available.**

A store click is **not** a verified install. A newsletter signup is **not** a product user. The reporting model must maintain these distinctions.

## 9.2 CTA strategy by reader intent

| Interest | Contextual conversion message |
|---|---|
| Skins, Nassau, Wolf | See how GoLo tracks supported side games |
| Handicap, net score, stroke index | Learn about GoLo's current handicap-aware scoring |
| Press, carryover, settle-up | Take the parking-lot math out of supported games |
| General slang and golf terms | Explore games and scoring before a harder sell |
| Unsupported formats | Browse the formats GoLo **currently** supports |

CTAs must not promise future features, payment processing, non-live formats, or unsupported handicap behavior. Android and iOS destinations must honor live `siteConfig` state. Newsletter placement is secondary to relevant app conversion and reuses the existing subscription workflow.

## 9.3 Proposed analytics events

| Event | When | Allowed parameter examples |
|---|---|---|
| `glossary_search` | Debounced completed search interaction | `category`, `result_bucket`, `match_type` |
| `glossary_filter` | Category changed | `category` |
| `glossary_term_open` | A definition expanded | `term_id`, `category` |
| `glossary_share` | Definition share/copy action | `term_id`, `method` |
| `glossary_cta_click` | Glossary-to-product link selected | `term_id`, `destination_type` |

Continue using established events for store clicks, accepted leads and newsletter signups. Ensure new event names fit the existing typed event union.

**Privacy invariants:** Existing GA4 explicit opt-in still governs tracking. Never send raw free-text searches, email addresses, phone numbers, private query strings, personal names, or unbounded arbitrary URLs. Do not log per-keystroke activity. Test denied, withdrawn, GPC and blocked-storage scenarios as appropriate.

## 9.4 Metrics and calculation definitions

| Metric | Definition / limitation |
|---|---|
| Non-brand organic clicks | GSC clicks to glossary landing pages from classified non-brand queries |
| Glossary landing visits | GA4 consented sample, not total visitors |
| Glossary-to-product CTR | Eligible measured glossary sessions with product CTA click / eligible measured glossary sessions |
| Store-click rate | Measured glossary sessions with store click / measured glossary sessions |
| Newsletter signup rate | Completed signups attributable to eligible glossary sessions / those eligible sessions |
| Search success | Meaningful searches leading to selection, opening, or onward useful navigation / meaningful searches |
| Zero-result rate | Meaningful searches returning zero results / all meaningful searches |
| Indexation rate | Indexed glossary URLs / submitted indexable glossary URLs |
| Verified acquisition | Only from trustworthy app/store attribution where available; never inferred from clicks alone |

Do not combine Search Console totals and consented GA4 samples into a false full-funnel conversion rate. Record exact reporting dates, definitions, and exclusions.

## 9.5 Measurement checkpoints

| Timing | Purpose |
|---|---|
| Prelaunch | Record GSC baseline, existing relevant queries and indexing state |
| Launch + 7 days | Verify deployment, crawlability, events, broken links and indexing submissions |
| Launch + 28 days | Review impressions, clicks, queries, engagement and conversion patterns |
| Launch + 56 days | Assess content quality, ranking changes, categories and referral paths |
| Launch + 90 days | Decide what to expand, optimize, consolidate, or stop |

Coordination dependencies:

- [#65 — Search Console post-deploy revalidation](https://github.com/soleman23/golowebsite/issues/65)
- [#78 — Query-led content plan](https://github.com/soleman23/golowebsite/issues/78)
- [#106 — Always-on organic traffic engine](https://github.com/soleman23/golowebsite/issues/106)

Avoid unsupported numerical traffic/install forecasts before a reliable baseline is available.

# 10. Editorial workflow, accuracy and maintenance

## 10.1 Production stages

| Stage | Responsibility | Evidence / deliverable |
|---|---|---|
| Inventory | SEO/content research | Term, classification, synonyms, intent, priority |
| Research | Content researcher | Reliable source links and explanatory notes |
| Draft | Writer/AI-assisted writer | Original short definition and example |
| Rules fact-check | Golf/rules reviewer | Correct formal definitions or house-rule caveats |
| GoLo product audit | Product reviewer | Claims match live registry and verified app behavior |
| SEO/canonical review | SEO editor | Unique intent, page owner, links and metadata |
| Approval | Content owner | Documented reviewed/approved status |
| Publish | Website release workflow | Tested build, approved publication record |

One person may fulfill multiple review roles, but no required review step is skipped. Do not invent a reviewer, credential or verification date.

## 10.2 Definition standards

- Core definition normally 20–45 words, but accuracy overrides length.
- At least one simple example for priority terms; more only when useful.
- Longer notes only for complex rules, formats, exceptions or calculations.
- Official sources for formal Rules of Golf and handicapping claims.
- Synonyms/aliases reviewed for exact or contextual equivalence.
- Relevant links rather than generic “read more” anchors.
- Humor is optional and subordinate to the answer.
- Avoid generic filler or artificially long pages.

## 10.3 Source hierarchy

1. Current R&A / USGA Rules of Golf for official definitions and rules procedures.
2. Current USGA/WHS materials for handicapping.
3. Reputable instruction and specialist golf resources for terminology and general practices, cross-checked as needed.
4. Verified GoLo code and capability registry for product behavior.
5. Golf community usage for slang and informal house rules, labeled appropriately.

Content must be original, not copied from Sunday Golf or other competitor glossaries. Use original diagrams or properly licensed imagery.

## 10.4 Content review triggers

- Governing rule or handicap methodology changes.
- GoLo feature availability or behavior changes.
- Reported error or ambiguity.
- Repeated visitor “term missing” requests or failed searches.
- Search Console evidence showing unmet intent or competition with existing pages.
- Scheduled annual source review for formal Rules of Golf and WHS terms.

Only reflect a new `updatedOn` date when a substantive editorial change actually occurred.

# 11. MVP acceptance criteria / definition of done

## 11.1 Content

- [ ] 56 fully reviewed published terms (or documented quality exception within the approved 50–60 range).
- [ ] All eight categories represented per the signed-off launch taxonomy.
- [ ] 166-term complete inventory documented as roadmap.
- [ ] Every published term has reviewed name, stable identifier, category, definition and editorial record.
- [ ] All rules and WHS definitions fact-checked against current authoritative sources.
- [ ] Examples are logically correct and terminology is clear.
- [ ] GoLo claims checked against live capability registry.
- [ ] No duplicate canonical term IDs, broken related-term references or unsupported functionality claims.

## 11.2 UX

- [ ] All published definitions browsable without search or JavaScript.
- [ ] Search supports casing, meaningful partial matches and reviewed aliases.
- [ ] All eight filters work and combine correctly with search.
- [ ] A–Z behavior is consistent and accessible.
- [ ] Direct term links survive initial load and refresh.
- [ ] Clear empty-result and reset behavior.
- [ ] Keyboard and screen-reader behavior reviewed.
- [ ] Responsive tests at 320, 760, 1100 and 1440 px show no overflow or hidden controls.

## 11.3 SEO

- [ ] Unique meta title/description and self-canonical on hub.
- [ ] Approved individual pages only; no duplicate keyword-intent pages.
- [ ] Published indexable routes included in sitemap with honest last-modified dates.
- [ ] Drafts/unpublished routes absent from search and sitemap.
- [ ] `DefinedTerm`/`DefinedTermSet` structured data valid and truthful.
- [ ] Internal links and existing guide links pass validation.
- [ ] Search/filter state URLs do not create indexable duplicates.
- [ ] Relevant discovery links exist from site nav/footer and appropriate content.

## 11.4 Analytics and conversion

- [ ] Correct currently available store/browser destinations render.
- [ ] CTA language accurately describes live GoLo support.
- [ ] Existing newsletter flow reused with its consent and validation protections.
- [ ] Glossary events are typed, deduplicated and consent-gated.
- [ ] No user-entered raw search text or PII sent as events.
- [ ] Reporting distinguishes visits, clicks, leads and verified installs.

# 12. QA matrix

| ID | Scenario | Expected result |
|---|---|---|
| GL-QA-01 | Load glossary with JS enabled | 56 public terms accessible |
| GL-QA-02 | Disable JavaScript | Definitions and core links readable |
| GL-QA-03 | Search `bir` | Birdie returned |
| GL-QA-04 | Search `DOUBLE EAGLE` after expansion | Albatross returned |
| GL-QA-05 | Search `alternate shot` | Foursomes returned via alias |
| GL-QA-06 | Search unknown term | Useful empty state and reset |
| GL-QA-07 | Select Side Games | Only appropriate terms displayed |
| GL-QA-08 | Search within category | Correct intersection |
| GL-QA-09 | Clear filters | Full published directory restored |
| GL-QA-10 | Direct visit `/glossary#press` | Press visible and discoverable |
| GL-QA-11 | Back/forward navigation | Predictable location/state restoration |
| GL-QA-12 | Keyboard-only browse | All controls operable and focus visible |
| GL-QA-13 | Screen reader | Definitions/results understandably announced |
| GL-QA-14 | 320/760/1100/1440 px | No overflow, clipped copy, blocked actions |
| GL-QA-15 | Visit unpublished detail URL | Correct 404, no draft content |
| GL-QA-16 | Inspect metadata and sitemap | Only approved indexable URLs present |
| GL-QA-17 | Validate schema | Connected, truthful and valid data |
| GL-QA-18 | Read Press/Nassau copy | No GoLo auto-press or Nassau press overclaim |
| GL-QA-19 | Android app CTA | Correct configured Google Play listing |
| GL-QA-20 | iOS pre-release CTA | Correct coming-soon / web-app behavior |
| GL-QA-21 | Reject analytics consent | No GA4 glossary events |
| GL-QA-22 | Accept consent | Expected events, no personal data |
| GL-QA-23 | Inspect URLs and client logs | No raw private search terms disclosed |
| GL-QA-24 | Run project checks | Lint, typecheck, tests and build pass |

### Regression suite

Exercise homepage, Games index, representative game details, Blog index, representative articles, FAQ, How It Works, shared header/footer, newsletter flow and app downloads. Changes to sitemap, schema, analytics and `lint:content` must not break established site behavior.

### Performance objectives

Target the conventional Core Web Vitals good thresholds when measured with adequate data: LCP ≤ 2.5 seconds; INP ≤ 200 ms; CLS ≤ 0.1. These are goals, **not** verified results. Use repeatable lab tests during development and field evidence when available. Avoid shipping the glossary as a heavy client-only app.

# 13. Phased GitHub milestone and proposed issues

**Proposed milestone:** `GoLo Golf Glossary — SEO & User Acquisition`  
**Repository:** https://github.com/soleman23/golowebsite  
**Parent alignment:** https://github.com/soleman23/golowebsite/issues/106

**Important:** The labels `GLS-001` through `GLS-013` are **planning identifiers**, not actual GitHub issue numbers. No issues have been created. Before creating any issues, reconcile this roadmap with existing work to avoid duplicate tickets, and preserve current repository workflows.

## Phase 1 — Research and design

### GLS-001 — Finalize glossary taxonomy, term inventory and source map

**Goal:** Establish the authoritative editorial source of truth before writing or implementing content.

**Scope**
- Record all 166 candidate canonical terms and their intended category/priority.
- Confirm the 56 launch-term set.
- Normalize IDs, URL slugs, alternate spellings and equivalent expressions.
- Distinguish strict aliases from merely related concepts.
- Assign official sources for rules and handicapping terms.
- Audit existing game guides, blog posts and FAQ content for overlap.
- Build the initial query/canonical ownership matrix.
- Document source review and editorial sign-off requirements.

**Acceptance criteria**
- [ ] Inventory count, category subtotals and MVP subtotals reconcile.
- [ ] No unresolved duplicate canonical concepts.
- [ ] Rules-sensitive records list authoritative references for later review.
- [ ] Every priority term has a proposed destination and content relationship.
- [ ] Any revisions to the provided inventory are logged and explained.

**Dependencies:** SEO issue #65 and #78 insights should be consulted when available; editorial inventory work may proceed before their final data, but don't invent demand.

**Deliverable:** `docs/glossary/inventory.md` and `docs/glossary/canonical-map.md` (or repository-convention equivalents).

### GLS-002 — Design glossary UX and responsive behavior

**Goal:** Define a coherent, discoverable and accessible user experience.

**Scope**
- Create main hub wireframes for phone, tablet and desktop.
- Define category controls, A–Z behavior, instant search, result ordering and empty states.
- Define short definition, expanded definition, canonical-guide link and share interactions.
- Detail keyboard, focus and screen-reader behaviors.
- Specify CTA placement without overwhelming educational content.
- Review shared header and footer for discoverability and responsive fit.

**Acceptance criteria**
- [ ] All listed UX flows have documented states.
- [ ] Responsive views cover 320, 760, 1100 and 1440 px.
- [ ] Accessible controls and deep-link behavior specified.
- [ ] GoLo design language is preserved.
- [ ] Approved design does not assume new dependencies or services.

**Dependencies:** GLS-001.

**Deliverable:** UX states, wireframes and component plan.

## Phase 2 — Architecture and interface

### GLS-003 — Add typed glossary content model and validation

**Goal:** Create a reliable, version-controlled glossary content system.

**Scope**
- Implement category, term, canonical target, source and lifecycle types.
- Implement public/published-only selectors and deterministic search indexing.
- Validate IDs, aliases, routes, related terms, sources and dates.
- Integrate current capability registry and existing claim checker.
- Ensure unpublished terms cannot leak into public search/routes/schema.
- Add unit/content tests without introducing a new DB or CMS.

**Acceptance criteria**
- [ ] Malformed content fails tests or lint.
- [ ] Unpublished items cannot be served as public content.
- [ ] Product claims reflect the capability registry.
- [ ] Broken and unpublished links are rejected.
- [ ] Existing site validation continues to pass.

**Dependencies:** GLS-001.

**Deliverable:** Typed model, selectors and validation tests.

### GLS-004 — Build the server-rendered glossary hub

**Goal:** Create the accessible core `/glossary` page.

**Scope**
- Hero, category navigation, A–Z index, featured terms and directory.
- Server-render primary definitions and links.
- Reuse the existing layout, typography, metadata defaults and responsive CSS conventions.
- Include a suitable secondary product CTA area and newsletter placement.
- Ensure it remains useful with JavaScript disabled.

**Acceptance criteria**
- [ ] Published content visible in server HTML.
- [ ] Terms have semantic associations and a logical reading order.
- [ ] No horizontal overflow at required breakpoints.
- [ ] Existing navigation and components remain functional.
- [ ] No requirement for new service, DB or client-only rendering.

**Dependencies:** GLS-002 and GLS-003.

**Deliverable:** Functional glossary hub on a review branch.

### GLS-005 — Implement search, filters and term deep links

**Goal:** Make the directory fast and easy to use.

**Scope**
- Instant search with alias handling and deterministic ranking.
- Category filters that combine correctly with search.
- Consistent alphabet navigation.
- Empty state/reset functionality.
- Stable term fragment links and copy/share control.
- Keyboard and screen-reader result behavior.
- Debounce/deduplicate analytics candidates; do not log raw query text.

**Acceptance criteria**
- [ ] All designated search and navigation QA cases pass.
- [ ] Direct links work when entered cold or refreshed.
- [ ] Unknown searches recover gracefully.
- [ ] All published terms are searchable; drafts are not.
- [ ] Search and filters do not generate duplicate indexable URLs.

**Dependencies:** GLS-004.

**Deliverable:** Searchable, filterable glossary UI.

## Phase 3 — Content, SEO and site integration

### GLS-006 — Write, review and publish the first 56 definitions

**Goal:** Deliver the complete approved MVP educational corpus.

**Scope**
- Draft all launch terms with original short definitions and examples.
- Add caveats for official rules versus house rules.
- Verify handicapping examples, scoring examples and format distinctions.
- Add relevant existing guide links and term relationships.
- Record appropriate sources and reviewer decisions.
- Check all GoLo-specific claims against current live capability data.

**Acceptance criteria**
- [ ] 56 approved term records present, or documented exception within 50–60.
- [ ] Every term meets the editorial checklist.
- [ ] No unsupported product claims.
- [ ] No fabricated source, author, review date or traffic claim.
- [ ] No duplicate canonical term concepts.

**Dependencies:** GLS-001 and GLS-003. Content drafting can run in parallel with UI work.

**Deliverable:** Reviewed, publication-ready MVP glossary records.

### GLS-007 — Integrate glossary SEO, canonicals, sitemap and schema

**Goal:** Make the new resource crawlable, canonicalized and semantically correct.

**Scope**
- Set main hub metadata, canonical and OG defaults.
- Register approved published indexable glossary routes with sitemap generation.
- Add appropriate `DefinedTermSet` and `DefinedTerm` structured data using shared IDs.
- Build selective dedicated page routing foundation without mass-generating thin pages.
- Validate existing page ownership and alias rules.
- Add metadata/schema test coverage.

**Acceptance criteria**
- [ ] Hub and any approved detail pages have accurate metadata.
- [ ] No public draft URLs or search-state variants in sitemap.
- [ ] Structured data matches visible content and validates.
- [ ] No duplicate canonical intent with existing Games/Blog pages.
- [ ] No fabricated rich-result or AI-citation guarantees.

**Dependencies:** GLS-001, GLS-003 and GLS-004.

**Deliverable:** Search-ready SEO implementation.

### GLS-008 — Connect the glossary to Games, Blog and navigation

**Goal:** Create meaningful internal discovery and product paths.

**Scope**
- Place the glossary in appropriate footer, navigation and educational sections.
- Add inbound links from relevant existing game guides and blog articles.
- Add related term links and topic links back to authoritative existing guides.
- Add contextual app CTAs using current product availability.
- Preserve existing CTA attribution and privacy behavior.
- Verify small/mobile navigation remains usable.

**Acceptance criteria**
- [ ] All priority terms have deliberate discovery paths.
- [ ] Existing guides retain canonical ownership where applicable.
- [ ] Links pass existing validation.
- [ ] No irrelevant link stuffing or false product feature statements.
- [ ] Header and footer work across required breakpoints.

**Dependencies:** GLS-004, GLS-006, GLS-007.

**Deliverable:** Connected educational ecosystem.

## Phase 4 — Measurement and release

### GLS-009 — Implement consent-aware glossary analytics and conversion tracking

**Goal:** Understand whether the glossary creates useful engagement and qualified app interest.

**Scope**
- Extend the typed GA4 event union for glossary events.
- Instrument meaningful filtered/search/open/share/product-CTA actions.
- Reuse existing store click and newsletter events.
- Ensure attribution to glossary landing paths where supported.
- Update reporting definitions and test notes.
- Preserve opt-in, withdrawal, GPC and personal-data restrictions.

**Acceptance criteria**
- [ ] Defined events fire only when appropriate and consented.
- [ ] No raw search terms or PII in analytics payloads.
- [ ] No duplicate event spam on every keystroke.
- [ ] Reporting clearly distinguishes store clicks from verified installs.
- [ ] Existing conversion events remain correct.

**Dependencies:** GLS-005 and GLS-008.

**Deliverable:** Auditable glossary measurement system.

### GLS-010 — Complete glossary QA, release readiness and launch

**Goal:** Release the reviewed MVP without harming the existing site.

**Scope**
- Run full QA matrix and targeted regression suite.
- Verify all 56 definitions and their linked content.
- Test at 320, 760, 1100 and 1440 px.
- Validate page metadata, sitemap, structured data, canonicals and draft exclusion.
- Test analytics consent, app store links, newsletter and current capability claims.
- Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` and other relevant CI checks.
- Prepare go/no-go checklist, launch owner approval and postlaunch monitoring.

**Acceptance criteria**
- [ ] All blockers fixed and reviewed.
- [ ] Required checks green; failures not waived without documented owner approval.
- [ ] MVP publication and canonical-map approval recorded.
- [ ] No regressions in existing site critical flows.
- [ ] Release authorized by the owner; postlaunch checkpoints assigned.

**Dependencies:** GLS-004 through GLS-009.

**Deliverable:** Release-ready MVP and documented launch checks.

## Phase 5 — Expansion and demand-driven improvements

### GLS-011 — Expand the glossary from 56 to 166 terms

**Goal:** Grow broad educational coverage with consistent quality.

**Scope**
- Work through the remaining 110 candidates in editorially reviewed batches.
- Confirm continued accuracy, uniqueness and intent.
- Adapt priority to validated GSC evidence and reader requests.
- Maintain source metadata, related links and product truth checks.
- Revise content map when necessary to avoid duplication.

**Acceptance criteria**
- [ ] 166 reviewed, unique canonical entries published, after any documented replacements.
- [ ] Category distribution and revisions traceable.
- [ ] Source/claim checks continue to pass.
- [ ] No artificial duplicate pages or alias-count inflation.

**Dependencies:** GLS-010 and early measurement evidence.

**Deliverable:** Comprehensive 166-term published glossary.

### GLS-012 — Introduce search-validated standalone term pages

**Goal:** Create deeper search assets only where they fill a proven need.

**Scope**
- Review term queries, ranking URLs and competing site pages.
- Write selective content briefs with unique user intent and examples.
- Decide whether to improve an existing guide, enhance the hub or publish a new page.
- Add canonical metadata, schema, links, testing and ongoing ownership for approved pages.

**Acceptance criteria**
- [ ] Each new page has a written distinct search-intent rationale.
- [ ] No competing duplicate pages with Games or Blog.
- [ ] Each page provides substantial additional user value.
- [ ] Technical SEO and QA gates pass.

**Dependencies:** GLS-010, GSC results and SEO issue #78.

**Deliverable:** Small, justified portfolio of individual glossary term assets.

### GLS-013 — Evaluate visual learning tools and content repurposing

**Goal:** Use high-value definitions to create interactive and social learning opportunities.

**Scope**
- Evaluate scoring diagrams and handicap allocation illustrations.
- Assess glossary-specific social shorts / “Term of the Week” series.
- Consider simple golf-slang quizzes and shareable cards.
- Connect (do not duplicate) the existing side-game chooser and calculator roadmap in issue #106.
- Require separate scope approval and success criteria for any new tool.

**Acceptance criteria**
- [ ] Proposed tools address observed visitor needs.
- [ ] No duplication of existing growth issues.
- [ ] Each approved concept has a unique user job, measurement plan and maintenance owner.
- [ ] Future features are not portrayed as already built.

**Dependencies:** GLS-010 and initial traffic/engagement signals.

**Deliverable:** Evidence-backed roadmap for enhanced learning assets.

## 13.1 Issue management and PR gates

- Create a dedicated glossary milestone **only when authorized**.
- Use these identifiers as proposed issue descriptions; assign real GitHub numbers after creation.
- Reconcile against existing issues first; don't duplicate or overwrite existing SEO/growth work.
- Use existing branch/PR standards and a dependency-ordered backlog.
- Prefer small, reviewable PRs and separate content/UX/SEO changes where practical.
- Require integration, quality, accessibility, copy-claim and regression verification before merging.
- No automatic publication or production deployment merely because tests pass.

# 14. Release plan, risk management and governance

## Release A — MVP

**Contents:** Searchable A–Z hub, 56 approved definitions, eight categories, instant search, filters, term links, metadata/schema/sitemap integration, truthful GoLo CTAs, analytics and newsletter integration.

**Exit gate:** All MVP content, technical SEO, QA, accessibility, claims and release checks pass and the release is approved.

## Release B — Complete dictionary

**Contents:** Remaining reviewed categories and terms in manageable batches, toward 166 total canonical entries.

**Exit gate:** Full inventory reviewed, published and linked without duplicate canonical concepts or unsupported product claims.

## Release C — Search-demand optimization

**Contents:** Improve pages based on genuine search behavior; selectively launch standalone term pages; strengthen internal link clusters; consolidate or improve weak content.

**Exit gate:** Changes supported by dated Search Console evidence or documented visitor need.

## Release D — Interactive learning

**Contents:** Carefully prioritized scoring visuals, calculators, quizzes and glossary-derived video/social campaigns.

**Exit gate:** Each feature has a separate approved specification, useful user outcome, measurement plan and maintenance owner.

## 14.1 Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Glossary competes with existing guides | Fragmented organic rankings | Single canonical owner per intent, mapping and prepublication review |
| Incorrect rules/WHS explanation | Trust loss | Current official references and documented fact-check |
| Unsupported GoLo marketing claim | Misleading users | Central capability registry, lint guard and owner review |
| Bulk low-value content | Poor user value/search performance | Original examples, selective page creation and editorial approval |
| Excessive search JavaScript | Slower mobile UX and poor crawlability | Server-render definitions; lightweight enhancement |
| Privacy/analytics regression | User trust and compliance issues | Consent/PII tests; reuse existing instrumentation |
| Crowded navigation | Mobile usability regression | Responsive design review and targeted placement |
| Traffic with no acquisition | Low commercial impact | Contextual CTAs and honest conversion reporting |
| Premature expansion | Wasted maintenance effort | Phase gates and measured prioritization |

## 14.2 Release and production safeguards

- Do not touch live production data or add migrations for MVP.
- Keep draft content private and unindexed.
- Keep publishing separate from authoring/preview approval.
- Preserve security headers, privacy disclosures, tracking consent and shared layout.
- Follow existing GitHub CI, review and production release gates.
- Require documented approval before any public deployment.

# 15. Definition of done and handoff

## 15.1 MVP definition of done

The MVP is complete only when:

- The approved launch corpus is accurate, helpful and original.
- Golfers can find terms using search, A–Z or topic filters.
- Terms are visible in server HTML, keyboard accessible and responsive.
- Deep links and related guides work.
- SEO/canonical/schema/sitemap behavior is correct.
- Marketing claims are verifiably accurate.
- Available app destinations and newsletter paths work.
- Consent-aware analytics and privacy checks pass.
- All required CI, functional and regression tests pass.
- Owner has approved the release and the measurement checkpoints are assigned.

The project is **not** completed merely by rendering `/glossary` or importing a list of terms.

## 15.2 Full-inventory definition of done

All 166 canonical concepts have approved definitions and appropriate source/link coverage. Aliases are not counted as independent concepts. Expansion does not require 166 SEO URLs. Advanced calculators, quizzes and social campaigns remain separate optional projects.

## 15.3 Next execution directive for Claude / development agents

**Do not build or modify anything merely from importing this document.** First:

1. Read the latest `soleman23/golowebsite` main branch and current open/closed issues.
2. Reconcile each proposed file and feature with existing architecture and work already completed.
3. Revalidate the product capability registry against the current released GoLo app where marketing claims depend on it.
4. Inspect current Search Console/SEO plans before creating any standalone term pages or changing keyword priorities.
5. Produce a dependency-ordered issue plan, real PR boundaries, estimate of effort (not launch promises), potential blockers and owner-review gates.
6. Ask for authorization before creating issues, editing code, merging or deploying.

The end state is a **useful golf reference first, a GoLo educational resource second, and a qualified acquisition channel throughout**—not a dictionary-shaped advertisement.

---

## Appendix A — Direct links and supporting backlog

- **Website:** https://www.golo.golf/
- **Marketing repository:** https://github.com/soleman23/golowebsite
- **Sunday Golf inspiration/reference:** https://sundaygolf.com/blogs/news/golfing-terms
- **Organic growth master roadmap (#106):** https://github.com/soleman23/golowebsite/issues/106
- **GSC revalidation (#65):** https://github.com/soleman23/golowebsite/issues/65
- **Query-led content plan (#78):** https://github.com/soleman23/golowebsite/issues/78
- **Internal linking improvements (#77):** https://github.com/soleman23/golowebsite/issues/77
- **GA4 key-event configuration (#66):** https://github.com/soleman23/golowebsite/issues/66
- **Current games:** https://www.golo.golf/games
- **Current blog:** https://www.golo.golf/blog

## Appendix B — Proposed reusable glossary social workflow

**Definition → SEO resource → simple worked example → short vertical video → social caption → newsletter feature → measured clicks/engagement.**

Recommended initial ideas: “What is a press?”, “A Skins carryover explained”, “Net vs gross score”, “What exactly is a greenie?”, “Why playing handicap is different from course handicap?”.

For each asset: use original graphics; verify official rules and real app screenshots; do not claim GoLo supports games it does not; maintain a link back to the relevant canonical page. Repurposing should support the site's existing GoLo social/YouTube work rather than create another disconnected content program.

## Appendix C — One-paragraph agent brief

> Use this file as the approved GoLo Golf Glossary v1.0 product and SEO specification. Review the latest `soleman23/golowebsite` repository, its current capabilities, SEO issues and growth roadmap. Produce an implementation-ready, dependency-ordered GitHub plan, identifying overlap with existing work, MVP boundaries, canonical-content ownership, QA gates and owner approval requirements. Preserve the approved scope: 56 launch terms and 166-term eventual inventory, a server-rendered `/glossary` with search and filters, selective term pages, app downloads as primary conversion and newsletter as secondary conversion. Do not create issues, modify code, merge or deploy until explicitly authorized.

---

*GoLo Golf Glossary — Specification v1.0 · October 28, 2026 · Planning only.*
