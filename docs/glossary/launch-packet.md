# Glossary MVP: go/no-go packet, launch diff and rollback (#164 + #166)

Prepared October 29, 2026 and brought current the same evening for the launch PR. **Released 2026-10-29 17:23 PDT:** the owner approved the merge at 17:21 PDT (recorded in #166), and #201 merged as `70d9686`. Live results are in #166 and `progress.md`. Evidence files are listed at the end; the numbers below are what was measured, on the date shown.

## Go/no-go

| Gate | State at the go decision, 2026-10-29 (evening) | Go needed |
|---|---|---|
| Content approved (#158–#162) | 56 records `published` on the launch branch, each with a review log: rules, product and SEO by an agent under the owner's delegation, approval by the owner in writing (`review.ts`, `review-packet.md` § Resolution) | merge |
| Capability recheck (`capability-check.md` § Release recheck results) | done against the app's code, golo `main` 2237c1d (GoLo 1.2.1), by an agent; the owner didn't test the app. Two entries the glossary cites corrected (`overall-match-presses`, `closest-to-pin`); four GoLo notes narrowed; out-of-scope findings in #200 | merge |
| Photo hero (#171) | merged (#199), image approved by the owner; phone AVIF lightened on the launch branch; lab LCP median 2,485 ms (target ≤ 2.5 s) | merge |
| Discovery and CTAs (#164) | intent links and closing band merged (#197); footer and ten inbound links on the launch branch | merge |
| QA GL-QA-01–24 | run on the launch build; results below. **GL-QA-13 (screen reader) blocked: needs a person** | owner: the screen-reader pass, or accept the release without it |
| Newsletter band | on hold (#121), per the owner's standing decision | exception noted in #166 |
| CI | green on the launch PR head (see the PR) | — |
| Owner go | — | written approval to merge and deploy |

**Outcome: go**, given by the owner on 2026-10-29. The merge landed the same day (Pacific), so `publishedOn` 2026-10-29 stands. GL-QA-13 became a post-deploy check by the owner's choice.

## QA results (the launch build, 2026-10-29)

Production build of the launch branch (`next build && next start`, Node 24.21.0, `NEXT_PUBLIC_ANALYTICS_ENABLED=true` as production has it): `glossaryLive = true` and all 56 records `published`, as they'll ship. Google requests were intercepted and answered locally, so nothing was sent. Earlier the same day the same checks ran on a temporary simulation of `main`; they're superseded by these.

| ID | Check | Result | Evidence |
|---|---|---|---|
| GL-QA-01 | 56 public terms with JS | **pass**: 56 visible, 56 `<dt>` in server HTML | launch/qa-b.txt |
| GL-QA-02 | JS disabled | **pass**: 56 terms, definitions and links render; search field hidden | launch/qa-b.txt |
| GL-QA-03 | `bir` → Birdie | **pass**: Birdie first | launch/qa-b.txt |
| GL-QA-04 | `DOUBLE EAGLE` → Albatross | **not applicable**: Albatross is an M8 term (#168). Not counted as a pass | — |
| GL-QA-05 | `alternate shot` → Foursomes | **pass** | launch/qa-b.txt |
| GL-QA-06 | unknown term | **pass**: empty state with Clear | launch/qa-b.txt |
| GL-QA-07 | Side games filter | **pass**: 10 terms, all side-games; `?category=side-games` | launch/qa-b.txt |
| GL-QA-08 | search within category | **pass**: "press" in Side games gives Press, Re-press; "par" excludes Par | launch/qa-b.txt |
| GL-QA-09 | Clear | **pass**: 56 back, no `category` param | launch/qa-b.txt |
| GL-QA-10 | `/glossary#press` | **pass** at 390 px: entry in view | launch/qa-b.txt |
| GL-QA-11 | back/forward, reload | **pass**: Handicaps → Slang → Back restores Handicaps; reload keeps it | launch/qa-b.txt |
| GL-QA-12 | keyboard | **pass**: Tab walk at 320, 760, 1100 and 1440 px (449, 377, 449 and 382 stops); every stop draws the 2px lime ring, none clipped. Tab order matches `ux.md` § Keyboard and focus | launch/tabwalk-*.txt |
| GL-QA-13 | screen reader | **blocked: needs a person.** No VoiceOver or NVDA pass was possible here (turning VoiceOver on is a system setting and takes over the screen). Supplementary, not a pass: axe (WCAG 2.1 AA + best practice) 0 violations at 320 and 1280 px; the accessibility tree has one H1, H2 sections and A–Z H3s, 56 `dt`/`dd` pairs, a labelled search field ("Search the glossary"), a status region that reads "2 terms match" after typing "press", a labelled results list, the active chip as `aria-current`, and the hero image hidden (`alt=""`) | launch/axe.txt, launch/a11y-tree.txt |
| GL-QA-14 | 320/760/1100/1440 | **pass**: no horizontal page overflow (the chip row scrolls inside itself, by design); screenshots at all four | launch/qa-b.txt, launch/shots/ |
| GL-QA-15 | unpublished detail URL | **pass**: `/glossary/press` 404 | launch/qa-b.txt |
| GL-QA-16 | metadata, sitemap | **pass**: unique title and description, self-canonical, og image; one `/glossary` sitemap entry (lastmod 2026-10-29, from `publishedOn`), no fragments or `?category=`; `llms.txt` Glossary section. Exclusion: with one record held at `in-review` it's absent from HTML, RSC, static bundles, schema, sitemap and `llms.txt` (55 terms shown) | launch/qa-b.txt, launch/exclusion.txt |
| GL-QA-17 | schema | **pass**: 56 `DefinedTerm`s, names and descriptions equal to the visible ones; no internal field in HTML, RSC or bundles (`reviewLog`, `reviewedBy`, sources, the app commit). Schema.org validator (earlier today, same structure): 0 errors, 0 warnings; Rich Results Test: Breadcrumbs valid; DefinedTermSet isn't a Google rich-result type | launch/qa-b.txt, schema.md |
| GL-QA-18 | Press/Nassau copy | **pass**: claim guard plus reading against the app's code. Press: a press starts once a side is two down, never automatic, and the Nassau takes none; Re-press: GoLo doesn't press a press | review-packet.md § Resolution |
| GL-QA-19 | Android CTA | **pass**: Google Play `id=golf.golo.app` | launch/qa-b.txt |
| GL-QA-20 | iOS pre-release | **pass**: no App Store link while `iosLive` is false | launch/qa-b.txt |
| GL-QA-21 | consent declined | **pass**: undecided, declined, GPC (even with a stored grant) and withdrawn send no request and no event | launch/consent.txt |
| GL-QA-22 | consent allowed | **pass**: gtag requested; `glossary_search`, `glossary_filter`, `glossary_term_open`, `glossary_cta_click` with closed-set params only; one term_open per term; a deep link with a saved grant reports once, one before any choice isn't replayed. A 10-character query typed key by key fires one `glossary_search`; `store_button_click` still fires on `/glossary` and `/` | launch/consent.txt, launch/consent-extra.txt |
| GL-QA-23 | no raw search text | **pass**: the typed text appears in no event, no param and no request URL; search never enters the address | launch/consent.txt, launch/qa-b.txt |
| GL-QA-24 | project checks | **pass** on the launch branch, Node 24.21.0: `lint:content` (56 records valid, 56 published), lint, typecheck, test (133 glossary cases), build. CI on the PR head | launch/checks-node24.log |

Regression (the launch build, 320 and 1440 px, 22 checks): home, `/games`, `/games/nassau`, `/games/skins`, `/games/scramble`, `/blog`, `/blog/nassau`, `/blog/index-vs-course-handicap`, `/faq`, `/how-it-works`, `/features`: 200, no overflow, no console errors, nav and footer present, the footer's `/glossary` link, every `/glossary#…` link resolves to an entry. The newsletter form renders on `/blog` (not submitted: no database writes). State A is today's production: `/glossary` and `/glossary/press` 404 on www.golo.golf, nothing in the sitemap, `llms.txt` or the home page's links (checked after #196–#199 deployed).

**Lab performance** (Lighthouse 12.8.2, default mobile throttling, local `next start` of the launch build, 5 runs, median): `/glossary` score 97, **LCP 2,485 ms** (runs 2,484–2,499; LCP element: the hero `<picture>`), TBT 28 ms, CLS 0; `/faq` on the same build 2,408 ms. Inside #171's 2.5 s target, by about 15 ms: the phone hero's AVIF was cut from 45.9 KB to 24.9 KB at 768w (it was 2,634 ms). The rest of the gap to `/faq` is the hub's HTML (about 58 KB compressed against 25 KB: all 56 entries server-rendered, their search index and the JSON-LD). Lab numbers only; not field Core Web Vitals, and TBT isn't INP.

## Launch diff (branch `m7/launch-164-166`)

Four commits on `main`:

1. **registry** (`lib/content/capabilities.ts`, `capability-check.md`): the app-code recheck; `overall-match-presses` and `closest-to-pin` corrected; `verified` on 13 entries.
2. **content** (`lib/content/glossary/terms/*`, `review.ts`, `review-packet.md`, `editorial-review.md`, `inventory.md`): final review fixes; all 56 records `published` with their review log, `reviewedOn` and `publishedOn` 2026-10-29.
3. **launch** (`launch.ts`, `nav.ts`, `GameGlossary.tsx` and its CSS, `gameDetail.ts`, `blog.ts`): `glossaryLive = true`, the footer link, ten inbound links (map below). No header entry.
4. **hero** (`scripts/generate-hero-images.mjs`, three `glossary-mobile-*.avif`): lighter phone frame for the LCP target.

Plus this file and `progress.md`.

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

## Release steps (after the owner approves the merge)

1. If the merge date isn't 2026-10-29, set every record's `publishedOn` (and `MVP_REVIEWED_ON` only if the approval itself changes) to the merge date, rerun `npm run lint:content`, push, and wait for CI.
2. Merge the launch PR (merge commit). Hostinger deploys `main`; LiteSpeed serves `public/` with `max-age=0`, so no purge.
3. Live checks on `https://www.golo.golf` (the apex 308s): `/glossary` 200; `/glossary/press` 404; the sitemap lists `/glossary` with the publish date; `llms.txt` Glossary section; schema in the live source; footer and the ten inbound links; hero bytes per viewport; consent states and one event per action with consent; Lighthouse on the live URL (recorded as live lab data, not field data).
4. Search Console: URL Inspection on `/glossary`, request indexing; record the date in #166.
5. #167: fill the checkpoint dates from the real launch date L: L+7, L+28, L+56, L+90.
6. GL-QA-13: the screen-reader pass, if it didn't happen before the merge.
7. Close #158–#162, #164, #165, #171 and #166 once the live checks pass; keep #167 open.

## Rollback

The glossary is one constant. To pull it: set `glossaryLive = false` in `lib/content/glossary/launch.ts`, which 404s the route and removes it from the sitemap, `llms.txt`, the footer and the schema, but the inbound links would then fail `lint:content`. So revert the launch merge commit instead (`git revert -m 1 <merge sha>`), open a PR, merge; Hostinger redeploys. Nothing is in the database, so there's nothing to migrate back. After a rollback, remove the URL in Search Console only if it was indexed.

## Evidence files

In the session scratchpad (not committed). The launch build's: `evidence/launch/qa-b.txt`, `consent.txt`, `consent-extra.txt`, `regression.txt`, `tabwalk-{320,760,1100,1440}.txt`, `axe.txt`, `a11y-tree.txt`, `contrast.txt`, `herohash.txt`, `lighthouse-glossary.txt`, `lighthouse-faq.txt`, `exclusion.txt`, `checks-node24.log`, `shots/`. Earlier the same day: `evidence/schema.md`, `gsc-baseline-2026-10-29.md`, the type-only and first photo runs, and the app check's notes.
