> **Status (November 6, 2026):** the owner's planning draft v1.0, committed as supplied (#231). Where it and the [Amendments](#amendments-november-6-2026) at the end disagree, the amendments win. Tracking: #230.

# GoLo Golf Rules Center — Product and Technical Plan

**Version:** Planning draft 1.0  
**As of:** November 3, 2026  
**Website:** https://www.golo.golf/  
**Repository:** https://github.com/soleman23/golowebsite  
**Proposed route:** https://www.golo.golf/rules  
**Status:** Research and specification only. **No issues created, code edited, or changes deployed.**

## 1. Executive decision

Build an independently written, source-backed **Golf Rules Center** that combines the orientation of the official USGA/R&A digital rulebook with the speed of a practical question-based rules finder. Make GoLo an approachable source of *explanations*—not the publisher or arbiter of the official rule text. The center should educate first, connect to the glossary/game guides second, and invite app downloads only where relevant and factually supported.

**Recommended MVP:** one fast, server-rendered `/rules` hub; navigation to Rules 1–25; 25 original high-quality rule summaries; 12 reviewed real-world question/answer scenarios; topic and rule-number search; topic filters; durable anchor links; prominent links to official sources; related glossary and game-guide links; consent-aware measurement; editorial/update workflow. **Do not create 25 thin SEO pages or republish copyrighted rules content.**

**Later:** search-validated dedicated scenario pages, original diagrams, visual relief/penalty walkthroughs, optional guided situation finder. A computerized “ruling engine,” official-rule text hosting, and in-app synchronized rulings are **not in MVP**.

## 2. Verified baseline and reuse opportunities

- Public GoLo website: https://www.golo.golf/; current navigation: Features, Games, How it works, Blog, FAQ, Contact. The existing glossary is in the footer, not top navigation.
- Glossary: https://www.golo.golf/glossary — 56 published terms across eight categories, searchable, filtered, A–Z, deep-linkable; editorial sources and reviewed dates.
- Repo: `soleman23/golowebsite`, default `main`. Current repository tree contains `app/glossary/page.tsx`, `components/sections/glossary/`, `lib/content/glossary/`, `components/ui/ChipFilter`, `lib/content/nav.ts`, `app/sitemap.ts`, `lib/schema.ts`, `lib/analytics.ts`, and automated `scripts/check-content.mjs` / glossary checks. No `/rules` route found in the inspected `main` tree.
- Existing glossary plan: `docs/glossary/product-spec.md`, epic https://github.com/soleman23/golowebsite/issues/151; serves as an implementation-process template, not duplicated content.
- Growth strategy: https://github.com/soleman23/golowebsite/issues/106; SEO content planning https://github.com/soleman23/golowebsite/issues/78. New standalone pages should be justified by real Search Console demand or genuinely distinct value.
- Technical: Next.js 15 App Router, React 18, TypeScript, CSS Modules, versioned typed content, existing analytics and content guard. `npm run lint && npm run typecheck && npm run build` are current release gates; node-based test scripts and 320 / 760 / 1100 / 1440 px responsive reviews are established patterns.
- The marketing capability registry (`lib/content/capabilities.ts`) guards statements about what the GoLo app supports. It must not confuse golf knowledge with product features.

## 3. Official rules, intellectual property and change policy

### Source hierarchy

1. Official USGA/R&A **Rules of Golf** and **Definitions** (currently the 2023 edition, in effect at the time of this plan).
2. Official published clarifications and committee procedures, including quarterly updates.
3. Official Model Local Rules **only when adopted by the competition/course Committee**.
4. Official Rules of Handicapping as a **separate** body of rules; reference it when handicap-posting or handicap computation is involved.
5. GoLo-authored explanatory prose and examples, with evidence links, and explicit caveats for stroke vs. match play, known/virtually certain standards, course markings, and local rules.

### Rights and attribution gate

- The R&A terms of use prohibit unauthorized commercial reproduction or modification of site content. Do not scrape or bulk host official full rule text, copyrighted diagrams, videos, logos or clarification text without verified permission.
- Original facts, high-level summaries and references to rule numbers can be authored independently, with official external links. Any substantial quote, branded graphic or licensed excerpt must be reviewed separately.
- Never style GoLo as an official USGA partner, rules adjudicator, or USGA-approved site without authorization. Use clear independent-site attribution and a source disclaimer.
- Links to the official R&A rule pages are public; the supplied USGA deep link could not be opened in the browser research tool (403), so link robustness must be verified manually and via an automated checker before launch.

### Dates and monitoring

- Current complete edition: **2023 Rules of Golf**.
- Current clarifications page seen in research: **updated October 2, 2026**; next quarterly update expected January 2027.
- The R&A announced the next full edition for **January 1, 2028**; do not incorrectly treat 2027 workshop dates as a 2027 new edition.
- Source owner performs review every January/April/July/October, upon important official notices, and in advance of the 2028 edition. Broken links, source-content changes or user-reported errors open a review task; never auto-publish AI-generated updates.
- Display a genuine **“Reviewed [date]”** only after a human completed the review; otherwise show the rules edition and an official source link, without a fabricated stamp.

**Reference URLs:**
- Official index: https://www.randa.org/en/rog/the-rules-of-golf
- Official USGA hub: https://www.usga.org/content/usga/home-page/rules-hub.html
- USGA additional clarifications: https://www.usga.org/rules-hub/clarifications-of-the-rules-of-golf.html
- R&A next edition announcement: https://www.randa.org/en/articles/new-and-updated-model-local-rules-for-2026
- R&A terms: https://www.randa.org/sw/terms-and-conditions
- WHS terms (handicapping content): https://www.whs.com/footer/terms-of-use.html

## 4. Information architecture and canonical ownership

### Primary structure

`/rules` — canonical, crawlable, accessible Rules Center landing page:
1. Hero: **“Golf Rules, Without the Clubhouse Argument.”** Clear note: *Independent explanations based on the current Rules of Golf; official text is linked.*
2. Persistent search: “What happened to your ball?” Search rule numbers, terms, synonyms, and scenario titles.
3. Quick action cards: Lost ball, Out of bounds, Penalty areas, Free relief, Bunkers, Provisional, Unplayable ball, Match play.
4. **Browse all 25 rules**, grouped into understandable categories; links to dedicated anchored sections.
5. **Common situations** with brief answers, applicability checks, direct governing-body sources and links.
6. “Official source” panel, version notice and link to Rules 25 modifications and local-rules explanation.
7. Related Glossary / Games / Guides and light-touch app CTA.

### Link design

MVP links: `/rules#rule-18`, `/rules#provisional-ball`, `/rules#cart-path`. Preserve stable fragment identifiers and verify them against a registry. Do not index search/filter combinations, since they are alternative hub views, not distinct content. `/rules` is the canonical.

Phase 2 pages: `/rules/lost-ball`, `/rules/provisional-ball`, `/rules/red-vs-yellow-penalty-area`, `/rules/unplayable-ball`, etc., **only after** they contain materially unique source-backed explanatory value and query demand or clear first-party usefulness. If expanded, reserve `/rules/rule-18` for a sufficiently complete original guide to Rule 18; not a duplicated official text page.

Canonical ownership: `/glossary#provisional-ball` explains terminology; `/rules#provisional-ball` answers practical consequences; `/games/nassau` explains the game format; `/blog/...` explores a distinct editorial angle. Do not manufacture keyword-targeted duplicates. Add glossary and game cross-links without falsely equating informal game conventions with formal rules.

### Rule taxonomy — complete navigation inventory

**Foundations / equipment**
1. The Game, Player Conduct and the Rules
2. The Course
3. The Competition
4. The Player’s Equipment

**Playing the round**
5. Playing the Round
6. Playing a Hole
7. Ball Search: Finding and Identifying Ball
8. Course Played as It Is Found
9. Ball Played as It Lies; Ball at Rest Lifted or Moved
10. Preparing for and Making a Stroke; Advice and Help; Caddies
11. Ball in Motion Accidentally Hits Person, Animal or Object; Deliberate Actions to Affect Ball in Motion

**Course areas and procedures**
12. Bunkers
13. Putting Greens
14. Procedures for Ball: Marking, Lifting and Cleaning; Replacing on Spot; Dropping in Relief Area; Playing from Wrong Place
15. Relief from Loose Impediments and Movable Obstructions
16. Relief from Abnormal Course Conditions, Dangerous Animal Condition and Embedded Ball

**Relief and penalties**
17. Penalty Areas
18. Stroke-and-Distance Relief, Ball Lost or Out of Bounds, Provisional Ball
19. Unplayable Ball

**Rulings, formats and accessibility**
20. Resolving Rules Issues During Round; Rulings by Referee and Committee
21. Other Forms of Individual Stroke Play and Match Play
22. Foursomes (Alternate Shot)
23. Four-Ball
24. Team Competitions
25. Modifications for Players with Disabilities

These descriptions are navigation references, not a proposal to reproduce official rules. Recheck exact current title labels against the governing-body index before publication.

## 5. Initial practical scenario inventory (12 fully reviewed answers)

| Priority | Search-language entry | Rule references | Required caveat |
|---|---|---|---|
| P0 | Lost ball — what happens next? | 18.2 | Search clock, known/virtually certain exceptions, stroke-and-distance and local-rule checks |
| P0 | When may I play a provisional ball? | 18.3 | Correct announcement and whether penalty area is suspected |
| P0 | Ball out of bounds — can I drop near the fairway? | 18.2, Model Local Rule E-5 if adopted | Do not present E-5 as universal |
| P0 | Red vs yellow penalty areas | 17 | Boundaries, where ball last crossed, available options |
| P0 | Unplayable ball in rough or bunker | 19 | Available options vary by location; penalty conditions |
| P0 | Can I touch the sand in a bunker? | 12 | Which action, when, purpose, exceptions |
| P0 | Ball against a cart path | 16.1 | Free relief requires qualifying interference and feasible relief procedure |
| P1 | Temporary water or ground under repair | 16.1 | Actual conditions and course/Committee designations |
| P1 | My ball moved after it stopped | 9 | Cause of movement and replacement requirements |
| P1 | When can I mark, lift and clean my ball? | 14 | Where ball lies, purpose, procedural restrictions |
| P1 | Can I repair damage on the putting green? | 13 | Qualifying damage and applicable limitations |
| P1 | Does a conceded putt count? | 3.2b and relevant stroke-play rules | Match-play concessions vs casual 'gimmes' and handicap posting |

Each answer includes: immediate answer; **“Before deciding”** condition checklist; common alternatives; penalty/result only when sourced; example; precise rule/subrule citation; official link; optional clarification/local-rule flag; related GoLo content. High-risk rulings require independent qualified rules review where feasible.

Expansion candidates: embedded ball, wrong ball, teeing outside markers, 14-club limit, advice, match-play order, dangerous animal, movable vs immovable obstruction, wrong green, wrong place, flagstick, preferred lies, Rule 25 contexts, handicap posting and local-rule implications.

## 6. User experience and states

### Primary journey — urgent question

1. User arrives from search or footer with “Ball went over white stakes.”
2. Search suggestions use synonyms: “OB”, “out of bounds”, “white stakes”. They see the relevant scenario and Rule 18.
3. Open concise answer in the same site, with applicability warning and alternative rule references.
4. User taps “Read official Rule 18.2” for authoritative detail, or shares an anchor link.
5. Related glossary and applicable GoLo content appear below, not ahead of the answer.

### Browse journey

1. Choose a topic or numbered rule.
2. See short original overview, related real-world scenarios and official link.
3. Use previous/next rule and contextual related topics.

### States and accessibility

- Empty query, results, no results, ambiguous search, exact rule reference, alias and typo tolerance, stale sources, unavailable external link, slow connection and no JavaScript.
- On zero results: show topic browsing and official search; never hallucinate a ruling.
- All primary explanations and references are in server-rendered HTML. JavaScript only enhances filtering and search.
- Full keyboard navigation; semantic headings; `aria` on collapsible sections; visible focus; search results announced to assistive tech; no hover-only discovery.
- Mobile first: sticky/available search but no obstructive overlay, a scan-friendly single column with 44px+ tap targets, and no awkward sideways scrolling.
- Respect reduced motion; diagrams have descriptive alt text or text equivalents; typography/scanning never depends on color alone.

## 7. Editorial/data contract

Use **typed, version-controlled static data**, not a database or CMS for the first release. Keep internal review data out of serialized client props. Suggested types:

```ts
type RulesEdition = {
  id: "2023" | "2028";
  effectiveFrom: string;       // ISO date
  effectiveTo?: string;
  officialIndexUrl: string;
};

type RulesSource = {
  authority: "USGA" | "RANDA" | "USGA_RANDA";
  document: "rules" | "clarification" | "definitions" |
            "local-rule" | "handicapping" | "committee";
  edition: string;
  ruleRef: string;             // e.g., "18.3b" or "MLR E-5"
  url: string;                 // manually verified canonical destination
  checkedOn?: string;
};

type RuleOverview = {
  id: string; number: number; title: string; categoryId: string;
  summary: string; commonQuestions: string[];
  scenarioIds: string[]; relatedGlossaryIds: string[];
  sources: RulesSource[]; status: PublicationStatus;
  reviewedOn?: string; publishedOn?: string; updatedOn?: string;
};

type RulesScenario = {
  id: string; slug: string; question: string; aliases: string[];
  topicIds: string[]; ruleRefs: string[]; answer: string;
  conditions: string[]; variations: string[]; example?: string;
  penaltyExplanation?: string; localRuleCaveat?: string;
  handicapCaveat?: string; matchVsStrokeCaveat?: string;
  sourceEdition: string; sources: RulesSource[];
  relatedRules: string[]; relatedGlossaryIds: string[];
  relatedContentPaths: string[]; status: PublicationStatus;
  reviewedOn?: string; publishedOn?: string; updatedOn?: string;
  reviewedBy?: string; reviewLog?: ReviewEntry[];
};

type PublicationStatus =
  "planned" | "draft" | "in-review" | "approved" | "published" | "archived";

type ReviewEntry = { reviewer: string; on: string; note?: string; scope: string };
```

Validation: unique IDs and slugs; all 25 rule numbers exactly once; every published rule/scenario has current edition, valid source, reviewed date, tested anchor and referenced content path; no drafts exposed in sitemap or client; all references resolve; no unsupported or hard-coded product claims; stale dates flagged for human review; optional MLR language never asserted universally; no unlicensed official-media assets.

Suggested repository structure:

```text
app/rules/page.tsx
app/rules/rules.module.css
lib/content/rules/{index,types,edition,categories,overviews,scenarios,
                   search,selectors,validate,launch}.ts
components/sections/rules/{RulesSearch,RuleDirectory,RulesTopicFilter,
                           RuleOverview,ScenarioAnswer,OfficialSourceLink}.tsx
scripts/{rules-checks,test-rules}.mjs
docs/rules/{product-spec,inventory,source-map,canonical-map,
            editorial-review,ux,launch-packet,maintenance}.md
```

Reuse `PageHero`, metadata/schema utilities, existing filter chips, copy-link patterns, navigation content data, capability registry, analytics consent wrapper and launch flag precedent. Isolate search to client leaf; keep text crawlable on the server.

## 8. Search specification

Searchable fields: rule number (`18`, `Rule 18`, `18.3`), official title, scenario title, human search aliases, keywords, description and related vocabulary. Normalize case, punctuation, apostrophes and whitespace. Curated alias map: OB→out of bounds; water hazard→penalty area; casual water→temporary water; cart path→immovable obstruction; plugged ball→embedded ball; breakfast ball/gimme→house-rule context. Search should rank exact rule number and title first, exact question/alias second, topic tokens and descriptions third. Category filters and matches should work without any remote requests. No AI answer generator in MVP.

Analytics must never transmit the actual text typed into rule search. Avoid PII and raw URLs in event params.

## 9. SEO and distribution

- Primary hub: `/rules` (self-canonical). Suggested page title: **Golf Rules Explained: Penalties, Relief & Common Questions | GoLo**. H1: **Golf Rules Explained**. Avoid unverified ranking/traffic or expertise claims.
- Hub is server-rendered and indexable only after full release approval. If 25 numbered overviews have little independent value, keep them as anchored sections rather than separate indexed pages.
- Contextual links from `/glossary`, `/games`, relevant blog posts, footer, and selected rule terms. No forced top-nav addition: the existing header already has six links, and the glossary previously avoided header placement.
- Follow existing `app/sitemap.ts`, `pageMetadata`, `lib/schema.ts`, `llms.txt` and content checks. `CollectionPage`/`ItemList` for appropriate page content; no fabricated Q&A ratings/authority claims. `FAQPage` only if it accurately describes visible content and is eligible under current search guidance, not because rich-result appearance is guaranteed.
- Do not index internal search-result permutations, query parameters or temporary preview pages.
- Log rules content in GSC reports and organic acquisition reporting. Reuse observed query data from issues #65/#78, but do not invent volumes or promise traffic.
- Cite authoritative sources; link to useful official documentation; seek appropriate educational backlinks rather than mass outreach or duplicate generic listicles.

## 10. Analytics and success metrics

Add consent-aware event names to the existing `AnalyticsEvent` union:

- `rules_search` — `{result_bucket, match_type, category}`; **no raw query**.
- `rules_filter` — `{category}`.
- `rules_rule_open` — `{rule_number, source: browse|search|related}`.
- `rules_scenario_open` — `{scenario_id, source: browse|search|related}`.
- `rules_official_click` — `{rule_number, document_type}`.
- `rules_related_click` — `{destination_type, content_id}`.
- `rules_cta_click` — `{placement, destination_type}`.

Primary 28-day indicators: non-branded organic clicks to the hub/scenario landing URLs, qualified app-download clicks from the Rules Center, and successful engagement from searches. Supporting: no-result rate, common scenario opens, source-link clicks, measured web-vitals, relevant indexed URLs, referring domains and user-reported content inaccuracies. Consent limitations mean GA4 is a sampled view, not a total-volume ground truth. Baseline first; set growth targets only after data.

## 11. Verification and launch acceptance criteria

Content and rights:
- [ ] Exactly Rules 1–25 represented; all official links checked.
- [ ] 12 scenarios meet condition/caveat/source/reviewer gates.
- [ ] Every official statement mapped to specific rule, definition or clarification.
- [ ] Distinguish match vs stroke, MLR adoption, house rules, handicapping and Rule 25 contexts.
- [ ] No copyrighted official text/graphics/marks reproduced without permission.
- [ ] No unverified GoLo feature claims, payment-processing claims, or unofficial endorsement implication.
- [ ] 2023 rules edition and actual review dates displayed accurately.

Engineering:
- [ ] `npm run lint && npm run typecheck && npm run build && npm test` all pass.
- [ ] New rules-validation tests run in CI; existing glossary, game, blog, home, footer, analytics and SEO checks remain green.
- [ ] Search handles exact rule IDs, aliases, no results, typo/partial matches, diacritics and empty input.
- [ ] All fragment links, related links and official URLs checked.
- [ ] Keyboard-only and screen-reader task flow succeeds; focus visible and logical.
- [ ] Design reviewed at 320, 760, 1100, 1440px, plus iOS Safari / Android Chrome.
- [ ] LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile as post-launch CWV targets, not promises from Lighthouse alone.
- [ ] Analytics respects consent and never sends raw search queries.
- [ ] Only approved published records reach public HTML/sitemap/schema; no 404 internal links in launch.
- [ ] Review packet documents sources, content exceptions, checks, and rollback.

## 12. Phased implementation, dependencies, and proposed GitHub issue descriptions

**No issues created by this plan.** Suggested labels: `rules-center`, `website`, `content`, `seo`, `needs-review` (confirm actual label inventory before creation). Use one master epic and clear dependency edges; separate docs and implementation PRs. Do not merge or deploy without owner approval.

| Proposed ID | Issue title and scope | Dependency | Effort |
|---|---|---|---|
| RULES-000 | Tracking epic, goals, priority, signed decisions and rollout gates | None | S |
| RULES-001 | Source/licensing and rule/intent inventory. Record official editions, links, copyright decisions, canonical owners, competitor UX and data baseline. | None | M |
| RULES-002 | UX specification. Desktop/mobile wireframes, search, empty/ambiguous states, rule browsing, accessibility and responsive QA. | 001 | M |
| RULES-003 | Typed content model, source provenance, edition change tracking, lifecycle, validators and tests. Reuse glossary pattern without exposing internal reviews. | 001 | M |
| RULES-004 | Server-rendered `/rules` hub, all 25 browse sections, stable anchors and publication flag; no public preview before approval. | 002,003 | M |
| RULES-005 | Search, synonyms and topic chips with keyboard navigation, no-JS fallback and safe URL behavior. | 004 | M |
| RULES-006 | Author and verify 25 short original rule overviews. Exact official source mapping and practical links, no bulk copied text. | 003 | L |
| RULES-007 | Author and review first 12 common-situation explanations, applicability caveats, example and direct citations. | 003 | L |
| RULES-008 | Cross-link glossary, game guides, relevant posts; add launch-gated footer/educational links and truthful app CTA. | 006,007 | S–M |
| RULES-009 | Metadata, sitemap, canonical, schema and content SEO guard integration; handle noindex drafts; update reporting path rules. | 004,006,007 | M |
| RULES-010 | Consented analytics and 7/28/56/90-day measurement template. No raw search query tracking. | 005,009 | S–M |
| RULES-011 | Automated and manual QA matrix: rule references, rights, accessibility, responsive, regressions, structured data, broken links and Core Web Vitals. | 005–010 | M |
| RULES-012 | Quarterly clarification review workflow, source-diff notifications, maintenance ownership, correction procedure and 2028 migration readiness. | 001,003 | M |
| RULES-013 | Owner go/no-go, publication flag flip, verified link release, rollback and first observation checkpoint. | 011,012 | S |
| RULES-014 | Phase 2: 3–5 search-validated standalone scenario pages, with unique diagrams and distinct canonical intents. | 013 + GSC evidence | M–L |
| RULES-015 | Phase 3: optional interactive guided situation finder / visual relief aid. Human-reviewed conditional logic, no automatic definitive rulings. | 014 + UX evidence | L |
| RULES-016 | 2028 edition migration: staged diff, legal review, scenario audit, redirects and source-link changes. | 012 + official release | L |

### Release phases

**Phase 0 — decisions and evidence:** licensing, source mapping, published rules revision, canonical overlap, existing GSC demand; output is a reviewed spec only.

**Release A — useful MVP:** 25 indexed-in-hub rules overviews and 12 vetted scenario answers, search, links, telemetry, accessibility, review controls, and version badge. Rollout gated by complete rights, source and QA review.

**Release B — content depth:** deeper original explanations on rule categories, diagrams for drops/relief, validated scenario landing pages; only promote URLs when unique value and traffic evidence support them.

**Release C — guided learning:** optional “what happened?” decision tree, print/share checklists, a mini-quiz or diagrams; no fake official ruling authority and no auto-generated penalties without known conditions.

**Release D — full rules edition maintenance:** respond to 2028 rules update with historical version awareness, documented review and careful links rather than overwriting evidence invisibly.

## 13. Go/no-go decisions to lock before engineering

Recommended defaults:

1. **Positioning:** practical original rules summaries plus official source links (recommended), not unlicensed full official text.
2. **Initial breadth:** all 25 rule numbers as browseable overviews + 12 fully reviewed high-frequency situations (recommended).
3. **UX:** search + topic filters + deep links in MVP; guided decision tree later.
4. **Navigation:** footer, glossary and game-guide entry points at release; test a Resources dropdown only if demand justifies it. Avoid crowding six-item header now.
5. **SEO:** `/rules` as single canonical hub initially; individual rule/scenario pages only with unique demand and editorial value.
6. **Accuracy review:** owner signs off, with an independent qualified rules specialist for nuanced or penalty-sensitive cases where feasible; review names remain internal unless explicitly approved.
7. **Content tone:** correct and calm first, light dry GoLo wit second; no sarcasm in penalties or disability modifications.
8. **No database / account:** typed static content, no login, no saved user rule history, no AI rules engine for MVP.
9. **Release policy:** launch flag held closed until approval; independent code/content review and measured release/rollback.
10. **Maintenance:** quarterly official clarification checks, a correction intake, and explicit 2028 edition review plan.

## 14. Risks and controls

| Risk | Control |
|---|---|
| Copyright infringement or misleading USGA endorsement | No wholesale republication, no official logos/diagrams without license, external attribution and legal clearance |
| Wrong penalty or conditional advice | Precise subrule references, condition checklist, mode/local rule flags, human review and source recheck |
| A Model Local Rule shown as universal | `requiresCommitteeAdoption` metadata + visible caveat and tests |
| Confusing Rules of Handicapping with playing rules | Separate source namespace and editorial taxonomy |
| Competing with glossary or game pages in SEO | Canonical ownership map; start with a single hub; query-led pages only |
| Overstating GoLo app support | All GoLo CTAs through existing capability registry, never duplicated strings |
| Stale 2023-based advice after an update | Explicit edition, quarterly review, 2028 transition milestone, user correction workflow |
| Slow, unreadable mobile browsing | Server-rendered contents and lightweight search, mobile-first QA, no heavyweight search service |
| Search that sounds definitive without facts | No free-form generated ruling; show uncertainties and alternatives; refer to Committee/official rules |
| No measurable acquisition | Reuse GSC/GA4 reporting, establish baseline, evaluate 7/28/56/90-day cohorts |

## 15. Reference links

- https://www.golo.golf/
- https://www.golo.golf/glossary
- https://github.com/soleman23/golowebsite/issues/151
- https://github.com/soleman23/golowebsite/issues/106
- https://github.com/soleman23/golowebsite/issues/78
- https://www.usga.org/content/usga/home-page/rules-hub.html
- https://www.usga.org/rules-hub/clarifications-of-the-rules-of-golf.html
- https://www.randa.org/en/rog/the-rules-of-golf
- https://www.randa.org/en/rog/the-rules-of-golf/rule-18
- https://www.randa.org/en/rog/the-rules-of-golf/rule-25
- https://www.randa.org/en/articles/new-and-updated-model-local-rules-for-2026
- https://www.randa.org/sw/terms-and-conditions

**Research limitation:** The exact user-supplied USGA hash-fragment rules page returned access restrictions in browser retrieval. The official USGA hub, clarification pages, and equivalent official R&A interactive rules pages were reviewed instead. Treat any deep-link syntax or permission as unverified until checked directly.

## Amendments (November 6, 2026)

Recorded with #231. Items A1–A4 were decided by the owner on November 6, 2026. A5–A13 are defaults taken from CLAUDE.md, the glossary precedent and checks against the official sources on that date; the owner approves them by approving #231.

### Decisions

- **A1. Tracking.** Epic #230 and one issue per RULES-0xx step (#231–#251). Milestones M9 · Rules Center (Release A) and M10 · Rules Center expansion (Phase 2/3 and the 2028 edition). Label `rules-center`.
- **A2. Accuracy review.** Claude drafts. Two independent reviewer agents check every record: one for rules accuracy against the fetched R&A text and Definitions, one for site rules (voice, vocabulary, claims, copy distance, links). The owner signs off as reviewer of record. `reviewedBy` stays internal; a page shows "Reviewed <date>" only after a real review. This replaces §13.6's "independent qualified rules specialist where feasible"; the owner can still bring one in for any record.
- **A3. Merging.** Pre-launch PRs merge on green CI plus a Codex 👍 at the head SHA, or independent agent reviews when Codex is out of quota. Flipping `rulesLive`, editing published glossary records, registering GA4 dimensions and Search Console actions wait for the owner's yes in chat.
- **A4. Hero photo.** Generated in Higgsfield (21:9 desktop, 4:5 phone frame) and run through `scripts/generate-hero-images.mjs`, as #171 did for the glossary.

### Defaults

- **A5. Voice.** CLAUDE.md's content voice overrides §13.7 where they differ: plain, dry, specific, no exclamation marks. H1 "Golf Rules Explained" (§9). "Without the clubhouse argument" may appear as a kicker or lead, not the H1. No humour anywhere near a penalty or Rule 25.
- **A6. Primary official link.** The R&A rule pages: they answer automated checks, have stable subrule anchors, and are what the site's existing Rules of Golf citations use. Each page notes that the Rules are written jointly by The R&A and the USGA. The USGA hub and clarifications pages are secondary links checked by hand: they return 403 to scripts but open in a browser.
- **A7. Launch flag.** `rulesLive` is a code constant, as `glossaryLive` was (#155). Off: `/rules` is a 404 in production and on Hostinger previews; `next dev` shows approved records marked unpublished. This replaces §9's "noindex drafts": an unreleased page isn't served at all.
- **A8. Schema.** No `FAQPage` (§9 allowed it only where eligible; Google limits FAQ rich results to authoritative government and health sites, and the glossary didn't use it). `CollectionPage` + `ItemList` + `BreadcrumbList`.
- **A9. Navigation.** Footer link beside "Golf glossary", added by the launch PR. No header link (§13.4).
- **A10. Search typo tolerance.** The glossary search has none. The rules search adds a last tier: edit distance ≤ 1 on tokens of five or more letters (§8 asks for typo tolerance).

### Corrections from checking the sources (November 6, 2026)

- **A11. Rule titles.** Three titles in §4 are shortened. The R&A index reads:
  - Rule 15: Relief from Loose Impediments and Movable Obstructions (Including Ball or Ball-Marker Helping or Interfering with Play)
  - Rule 16: Relief from Abnormal Course Conditions (Including Immovable Obstructions), Dangerous Animal Condition, Embedded Ball
  - Rule 22: Foursomes (Also Known as Alternate Shot)

  Records use the R&A labels; `docs/rules/inventory.md` has all 25.
- **A12. Anchors and links.**
  - R&A subrule anchors use underscores (`rule-18#18_2b`), not hyphens. Every subrule anchor on all 25 rule pages is listed in `docs/rules/source-map.md`.
  - Multi-word Definitions have opaque ids, so Definitions are cited at page level by term name.
  - Model Local Rule E-5 sits in Committee Procedures Section 8 (`/en/rog/committee-procedures/sections/8`), inside a collapsed section with no stable anchor, so it's cited at page level.
  - The USGA's rules text is hash-routed (`rules-and-clarifications.html#section=rules&…`); the §3 limitation stands, and A6 handles it.
- **A13. Glossary anchors.**
  - §4 assumes `/glossary#provisional-ball`. No such term exists, and neither do `out-of-bounds`, `lost-ball` or `unplayable`. The Rules Center links only to published glossary slugs.
  - The missing terms are listed in `docs/rules/canonical-map.md` as candidates for #168. Until one ships, `/rules#provisional-ball` owns both the term and its consequences.
- **A14. Page title.** The layout template appends "· GoLo", so §9's "| GoLo" suffix is dropped. The title is trimmed to fit with the suffix.

### Dates confirmed

- 2023 Rules of Golf in force. The R&A's "New and Updated Model Local Rules for 2026" (14 January 2026) says the next edition is published on 1 January 2028.
- The USGA's "Additional Clarifications of the 2023 Rules of Golf" reads "Updated October 2, 2026": no new clarifications in October 2026, and the next quarterly update is due in early January 2027.
- Rules of Handicapping: 2024 edition in force (the glossary's check of October 29, 2026; rechecked at #247).
