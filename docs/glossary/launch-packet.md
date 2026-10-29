# Glossary MVP: go/no-go packet, launch diff and rollback (#164 + #166)

Prepared October 29, 2026. **No launch decision is made here.** The owner approves the release in #166; nothing is pushed, merged or deployed without that. Evidence files are listed at the end; the numbers below are what was measured, on the date shown.

## Go/no-go

| Gate | State on 2026-10-29 | Go needs |
|---|---|---|
| Content approved (#158–#162) | 56 records `in-review`, sources opened, examples recomputed (`review-packet.md`); **no owner sign-off** | owner signs rules, product, SEO and approval per record |
| Capability recheck (`capability-check.md` § Release recheck) | rows 1–13 not re-confirmed; `junk-board`, `skins-validation` not offered | owner rechecks against the current release |
| Photo hero (#171), a launch blocker | code wired on a local branch; **no masters exist** | masters + 13 files + evidence |
| Discovery and CTAs (#164) | intent links and closing-band copy on `m7/164-glossary-ctas`; footer and inbound links on the local launch branch | merge with the launch |
| QA GL-QA-01–24 | run on a local launch simulation; results below | rerun on the launch commit, then live |
| Newsletter band | on hold (#121) | owner records the exception in #166 |
| CI | not run (nothing pushed) | green on the launch PR |
| Owner go | — | written approval in #166 |

**Today: no-go.** Content approval, the capability recheck and the photo hero are open, and only the owner can close them.

## QA results (local launch simulation, 2026-10-29)

Production build (`next build && next start`, Node 24.21.0, `NEXT_PUBLIC_ANALYTICS_ENABLED=true` as production has it), `glossaryLive = true`, all 56 records temporarily `published`, everything reverted afterwards. Google requests were intercepted and answered locally, so nothing was sent.

| ID | Check | Result | Evidence |
|---|---|---|---|
| GL-QA-01 | 56 public terms with JS | **pass**: 56 visible, 56 `<dt>` in server HTML | qa-b.txt |
| GL-QA-02 | JS disabled | **pass**: 56 terms, definitions and links render; search field hidden | qa-b.txt |
| GL-QA-03 | `bir` → Birdie | **pass**: Birdie first | qa-b.txt |
| GL-QA-04 | `DOUBLE EAGLE` → Albatross | **not applicable**: Albatross is an M8 term (#168). Not counted as a pass | — |
| GL-QA-05 | `alternate shot` → Foursomes | **pass** | qa-b.txt |
| GL-QA-06 | unknown term | **pass**: empty state with Clear | qa-b.txt |
| GL-QA-07 | Side games filter | **pass**: 10 terms, all side-games; `?category=side-games` | qa-b.txt |
| GL-QA-08 | search within category | **pass**: "press" in Side games gives Press, Re-press; "par" excludes Par | qa-b.txt |
| GL-QA-09 | Clear | **pass**: 56 back, no `category` param | qa-b.txt |
| GL-QA-10 | `/glossary#press` | **pass** at 390 px: entry in view | qa-b.txt |
| GL-QA-11 | back/forward, reload | **pass**: Handicaps → Slang → Back restores Handicaps; reload keeps it | qa-b.txt |
| GL-QA-12 | keyboard | **pass**: 382 focusable elements walked more than three times at 320 and 1440 px (1,298 Tab presses each); every stop draws the 2px lime ring, none clipped | tabwalk.txt |
| GL-QA-13 | screen reader | **blocked**: no human VoiceOver or NVDA pass yet. axe reported one issue type (chip count contrast, fixed on `fix/chip-count-contrast`); no other WCAG 2.1 AA or best-practice violation | axe.txt |
| GL-QA-14 | 320/760/1100/1440 | **pass**: no horizontal page overflow (the chip row scrolls inside itself, by design) | qa-b.txt, shots/ |
| GL-QA-15 | unpublished detail URL | **pass**: `/glossary/press` 404 | qa-b.txt |
| GL-QA-16 | metadata, sitemap | **pass**: self-canonical; one `/glossary` sitemap entry, no fragments; llms.txt Glossary section. A term left `in-review` is absent from HTML, RSC, browser bundles, schema and search | qa-b.txt, exclusion.txt |
| GL-QA-17 | schema | **pass**: 56 `DefinedTerm`s, names and descriptions equal to the visible ones; no internal fields. Schema.org validator: 0 errors, 0 warnings. Rich Results Test: Breadcrumbs valid; DefinedTermSet isn't a Google rich-result type, so valid schema doesn't mean a rich result | qa-b.txt, schema.md |
| GL-QA-18 | Press/Nassau copy | **pass**: claim guard plus reading. Press says GoLo presses are called on Overall Match, never automatic, and its Nassau takes none | review-packet.md |
| GL-QA-19 | Android CTA | **pass**: Google Play `id=golf.golo.app` | qa-b.txt |
| GL-QA-20 | iOS pre-release | **pass**: no App Store link while `iosLive` is false | qa-b.txt |
| GL-QA-21 | consent declined | **pass**: undecided, declined, GPC (even with a stored grant) and withdrawn send no request and no event | consent.txt |
| GL-QA-22 | consent allowed | **pass**: gtag requested; `glossary_search`, `glossary_filter`, `glossary_term_open`, `glossary_cta_click` with closed-set params only; one term_open per term. A deep link with a saved grant reports once; a deep link before any choice isn't replayed after Allow, and a later open reports once | consent.txt |
| GL-QA-23 | no raw search text | **pass**: the typed text appears in no event, no param and no request URL; search never enters the address | consent.txt, qa-b.txt |
| GL-QA-24 | project checks | **pass** on each branch, Node 24.21.0: lint, typecheck, test, build. The launch branch fails `lint:content` by design until records are published | checks-*.log |

Regression (same simulation, 320 and 1440 px): home, `/games`, `/games/nassau`, `/games/skins`, `/games/scramble`, `/blog`, `/blog/nassau`, `/blog/index-vs-course-handicap`, `/faq`, `/how-it-works`, `/features`: 200, no overflow, no console errors, footer present, every `/glossary#…` link resolves to an entry. The newsletter form renders on `/blog` and posts (not submitted: no database writes). State A (flag off, committed state): `/glossary`, `?category=` and `/glossary/press` 404; no glossary entry in the sitemap or `llms.txt`; no `/glossary` link or `DefinedTerm` on 12 pages; no draft definition in any browser bundle.

**Lab performance** (Lighthouse 12.8.2, default mobile throttling, local `next start`, 5 runs, median): `/glossary` type-only hero, score 98, LCP 2,335 ms (LCP element: the H1), TBT 27 ms, CLS 0. For scale, `/faq` with its photo hero on the same build: LCP 2,419 ms. Lab numbers only; not field Core Web Vitals, and TBT isn't INP. The with-photo run waits for #171's masters.

## Launch diff (local branch `m7/launch-164-166`, not pushed)

Stacked on `m7/glossary-content-review` and the #164 CTA commits.

1. `lib/content/glossary/launch.ts`: `glossaryLive = true`.
2. `lib/content/nav.ts`: footer Games column gets "Golf glossary" → `/glossary`. No header entry.
3. Inbound links (link map below), in sentences and term lists already about the term.
4. **At approval only:** each approved record `approved` → `published` with `publishedOn` set to the real merge-and-deploy date. Not on the branch: no record is approved.
5. `#171` merged first (photo, 13 files, `heroOgImage("glossary")`).

### Link map

| From | Anchor text | To |
|---|---|---|
| Footer (every page) | Golf glossary | `/glossary` |
| `/games/nassau` term list | Press | `/glossary#press` |
| `/games/skins` term list | Carryover (carry) | `/glossary#carryover` |
| `/games/best-score` term list | Net score | `/glossary#net-score` |
| `/games/wolf` term list | Best ball | `/glossary#four-ball` |
| `/games/scramble` term list | Stroke index | `/glossary#stroke-index` |
| `/games/closest-to-pin` term list | Greenie | `/glossary#greenie` |
| `/blog/nassau` | match-play (contests) | `/glossary#match-play` |
| `/blog/nassau` | Presses can be pressed | `/glossary#re-press` |
| `/blog/index-vs-course-handicap` | stroke index | `/glossary#stroke-index` |
| `/blog/index-vs-course-handicap` | score differentials | `/glossary#score-differential` |

Outbound, unchanged: every entry with an `existing` canonical links its guide or post, so the guides keep their intent. Paths to the 31 P0/P1 terms: every one is reachable from the footer link to the hub (A–Z, Start here, search). Eight P0/P1 terms get a direct inbound link above: Press, Re-press, Carryover, Net Score, Four-Ball, Stroke Index, Match Play and Score Differential (Greenie, P3, is the ninth link). Fragments are validated by `lint:content` against published slugs and by the regression run against the built page's `id`s.

## Release steps (after the owner's go in #166)

1. Merge #171 (photo hero) once its evidence is in, and `fix/chip-count-contrast`.
2. For each approved record, set `status: "published"` and `publishedOn` to the deploy date on the launch branch; rebase it on `main`; check the retargeted diff touches only the files listed above.
3. Recheck every `official-rules`/`handicapping` source and every capability (editorial-review.md § Release recheck); record in #166.
4. Open the launch PR; CI green; owner approves in #166; merge (Hostinger deploys `main`).
5. Live checks on `https://www.golo.golf` (apex 308s): `/glossary` 200; sitemap has `/glossary`; schema on the live source; footer and inbound links; consent states; one event per action with consent.
6. Search Console: URL Inspection on `/glossary`, request indexing; record the date.
7. Set #167's checkpoints from the real launch date: +7, +28, +56, +90 days.

## Rollback

The glossary is one constant. To pull it: set `glossaryLive = false` in `lib/content/glossary/launch.ts`, which 404s the route and removes it from the sitemap, `llms.txt`, the footer and the schema, but the inbound links would then fail `lint:content`. So revert the launch merge commit instead (`git revert -m 1 <merge sha>`), open a PR, merge; Hostinger redeploys. Nothing is in the database, so there's nothing to migrate back. After a rollback, remove the URL in Search Console only if it was indexed.

## Evidence files

In the session scratchpad (not committed; screenshots for a PR go on a `pr-assets/glossary-launch` branch if the owner wants them): `evidence/qa-b.txt`, `consent.txt`, `regression.txt`, `tabwalk.txt`, `axe.txt`, `contrast-typeonly.txt`, `lighthouse-glossary-typeonly.txt`, `exclusion.txt`, `schema.md`, `gsc-baseline-2026-10-29.md`, `shots/`.
