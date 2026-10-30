# Content plan: query-led (SEO-20, #78)

Built on October 29, 2026 from the Search Console revalidation (#65), recorded in [`docs/seo-progress.md` § Search Console revalidation, October 29, 2026](seo-progress.md#search-console-revalidation-october-29-2026-seo-07-65). Product claims follow `lib/content/capabilities.ts` as it stood that day (app check of 2026-10-29 against GoLo 1.2.1; Android on Google Play since 2026-10-26, iPhone app not yet in the App Store).

**Data:** property `sc-domain:golo.golf`, Performance → Search results, search type Web, **2026-09-30 – 2026-10-27** (the After window; data through October 27). Every number below is from that window unless a row says otherwise. Exports are kept outside the repo (`~/gsc/2026-10-29-after/`). Query-to-page pairs come from the same window with a Query filter (exact, or "contains") and the Pages tab, or a Page filter and the Queries tab, metrics including position.

**How to read it:**

- The whole property had 404 impressions and 4 clicks in 28 days. Most rows rest on a handful of impressions, so most decisions are "no action, re-read".
- 56% of impressions came from anonymized queries that no export shows. A page can rank for queries this plan can't see.
- Position in a group row is the impression-weighted mean of its queries' positions. It's a summary, not a Search Console number.
- Rules this plan follows: don't write for a query just because it has impressions; change titles or links only for real cannibalization; every new page needs an observed query or a clear first-party angle; no more than two new briefs a month.

## Decisions

| # | Observed query or group | Metrics, 2026-09-30 – 10-27 | Ranking URL(s) | Intent | Decision | Evidence |
|---|---|---|---|---|---|---|
| 1 | Nassau group (13 queries). Top: "nassau golf bet" 27 impressions, position 23.8; "nassau golf format" 13, 41.7; "nassau golf game" 6, 13.3; "what is a nassau in golf" 4, 47.8 | 64 impressions, 0 clicks, weighted position 31.2 (Before window: 52, 50.5) | `/games/nassau`: all 64 impressions of queries containing "nassau". `/blog/nassau`: 14 impressions at 10.1, every one from anonymized queries; it ranks for none of the named Nassau queries | How to play; how the money works; definition | **No action.** Not cannibalization: the post doesn't show for any observed Nassau query, and the two pages already split rules (guide) and house rules (post) and link each other. The top query says "bet". The site's vocabulary rule and the owner's October 8 decision keep that word out of titles until counsel approves, so no title change from this data | [Query groups](seo-progress.md#query-groups), [Guides](seo-progress.md#guides-after) |
| 2 | Skins queries in Other games (9). "golf skins" 5 impressions, 78.6; "how do golf skins work" 3, 80.0; "how to play skins in golf" 2, 97.5; six more with 1 each | 16 impressions, 0 clicks, position 79.2 (contains "skins", by page) | `/games/skins` only. `/blog/skins-carryover` had no impressions | How to play; rules; meaning | **No action.** The right page ranks; the gap is position (page 8), not which page. Rewriting on 16 impressions breaks #65's rule. Re-read in the monthly report | [Guides](seo-progress.md#guides-after) |
| 3 | Wolf queries (8). "wolf golf game" 5, 75.2; "wolf points" 3, 41.7; "lone wolf golf game" 2, 27.5 | 16 impressions: `/games/wolf` 15 at 58.3, `/blog/wolf` 1 at 95.0 | `/games/wolf` | How to play; scoring | **No action.** One stray post impression isn't competition | [Guides](seo-progress.md#guides-after) |
| 4 | Bingo Bango Bongo queries (6). "bingo bango bongo" 5, 58.0; "bingo bango bongo rules" 3, 49.0; "how to play bingo bango bongo in golf" 2, 49.5 | Pages for "bingo" queries: guide 10 impressions at 39.3, post 4 at 70.2 | Both `/games/bingo-bango-bongo` and `/blog/bingo-bango-bongo` show for the same three queries | How to play; rules | **No action, watch.** Two URLs on one query isn't proof of cannibalization. Here it's 14 impressions, with the guide 31 places ahead. Re-check if the pair passes 50 impressions in 28 days or the post overtakes the guide; then the fix is links and titles, not a merge | [Posts](seo-progress.md#posts-after) |
| 5 | Handicap group (4): "index vs handicap", "handicap index vs handicap", "golf index vs handicap", "handicap vs index", 1 each; plus "course index" 1 at 42.0 (Unassigned) | 5 impressions at 68.6 on the post (contains "index", by page) | `/blog/index-vs-course-handicap` | Definition; comparison | **No action.** The page answers exactly this question. The candidate brief "handicaps in Nassau and Skins" isn't supported: no stroke-allocation query appeared, and this post already covers allocation by stroke index and playing the differences | [Query groups](seo-progress.md#query-groups) |
| 6 | "what is a press in golf" | 1 impression, position 65.0 | `/blog/pressing` | Definition | **Supports brief A** together with the first-party angle; on its own it would be no action | [Posts](seo-progress.md#posts-after) |
| 7 | Closest to Pin. "closest to pin" 1, 65.0; "closest to pin golf" 1, 82.0 | Guide 25 impressions at 11.6; queries containing "pin" put 3 impressions on it at 51.3, so most come from anonymized queries | `/games/closest-to-pin` | How to play | **No action.** The guide is close to page 1 on queries this plan can't see. Nothing observed to target | [Guides](seo-progress.md#guides-after) |
| 8 | "does longest drive have to be in fairway" | 1 impression, position 11.0 | `/games/longest-drive` (14 impressions at 10.6 overall) | Rules question | **No action.** The guide already answers it: fairway only, in its tagline, steps and worked example | [Guides](seo-progress.md#guides-after) |
| 9 | Branded: "golo golf" 20 impressions, 2 clicks, 16.5; "golo bet" 12, 4.0 | 32 impressions, 2 clicks (Before window: 10, 0) | "golo golf": `/` 13 at 6.4 with both clicks, `/about` 5, `/faq` 3, `/contact` 3. "golo bet": `/games` 10 at 5.9, `/` 5 at 2.8 | Navigational | **No action.** The home page takes the clicks. Track it in #68's branded table | [Query groups](seo-progress.md#query-groups) |
| 10 | "golo board" (watched); "golo cancel" | "golo board" 8 at 43.1; "golo cancel" 1 at 9.0 | "golo board": `/contact` 4, `/faq` 3, `/terms` 1, `/about` 1 | Another product: the GOLO dice game; GOLO the diet company | **No action.** Brand collision, Off-topic GOLO in the script. Nothing to write | [Watched queries](seo-progress.md#watched-queries) |
| 11 | "mongolian reversal" (watched) | 1 at 76.0 (Before window: 3 at 73.3) | `/blog` (the index) | Slang definition | **No action.** GoLo has no first-party angle and doesn't score it. It isn't in the glossary's 166-term inventory, and one impression doesn't earn it a place | [Watched queries](seo-progress.md#watched-queries) |
| 12 | Slang and side-game names the site doesn't cover: "golf high low game" 2, 94.5; "high low golf" 1, 85; "hi low golf game" 1, 89; "high low golf game" 1, 92; "dogfight golf" 1, 84; "what is a dogfight in golf" 1, 92; "golfers goal" 1, 87; "golfer's goal" 1, 89; "ringer in golf" 1, 88; "what is a looper in golf" 1, 89; "lone ranger golf game" 1, 85; "bifurcation in golf" 1, 93 | 13 impressions, 0 clicks | Queries containing "low", "dogfight" and "goal" land on `/blog` (positions 88–91). The single-impression ringer, looper, lone ranger and bifurcation queries weren't checked one by one | Definition; how to play | **Improve existing, through #168 only.** None of these terms is in the glossary inventory. Hand them to #168 as candidates for its first expansion batch, decided at #167's 28-day checkpoint (2026-11-26) with that checkpoint's data. No standalone pages (#169's gate). GoLo scores none of these games, so any entry is education only | [Query groups](seo-progress.md#query-groups) |
| 13 | Settle-up group; Trips group | 0 impressions each | none | – | **No action.** "How to settle multiple side games" has no observed query, and `/blog/settle-up-screen` and `/blog/who-pays-first` already cover it. A Ryder Cup-style trip piece has neither a query nor a first-party angle while `trip-tally` is planned | [Query groups](seo-progress.md#query-groups) |
| 14 | Mixed-handicap groups (candidate from the issue) | no query observed | none | – | **No brief.** Handicap allowances and mixed tees are both `planned`, so a GoLo angle would have to say the app doesn't do it. Nothing to anchor a page on yet | `capabilities.ts`: `handicap-allowances`, `mixed-tees` |
| 15 | Comparison pages ("best golf side-game apps") | no query observed | none | – | **Deferred.** The issue allows them after launch, and only as transparent comparisons. Android launched on October 26, but no comparison query appears. Revisit when one does | – |
| 16 | GoLo's Overall Match game: presses on a match | No GoLo-specific query (the name is GoLo's); "what is a press in golf" 1 at 65.0 (row 6) | No page explains it: `/features`, `/faq`, `/how-it-works`, the Nassau guide's press FAQ and the glossary's Press note all name the Overall Match | Product: how GoLo handles presses | **New page: brief A** | `capabilities.ts`: `overall-match-presses`, `game-library` |

Two newer pages have no data in this window: `/games/scramble` (published 2026-10-28) and `/glossary` (2026-10-29). The Glossary / definitions group had 3 queries and 4 impressions here. That's the pre-launch reference for #167, not a target.

## Briefs this month

One brief. A second wasn't justified: no other candidate in the issue has an observed query and a first-party angle that existing pages don't already cover (rows 5, 13, 14). Each approved brief becomes its own issue before anything is written.

### Brief A: Overall Match, presses on an 18-hole match

- **Audience and job:** a group that already plays presses, and the scorer deciding whether GoLo can carry them. The job: know how a press works on GoLo's Overall Match before the first tee, and know what the app won't do.
- **Angle:** GoLo puts presses on its Overall Match game, not on the Nassau. Every page that says so sends the reader to a game the site never explains. This page explains it: one 18-hole match, presses opened by the scorer when a side is 2 or more down, at two, three or four times the amount, up to two live at once.
- **Product truth to keep:**
  - Live, from `overall-match-presses`: a press can start once a side is 2 or more down; it's entered by the scorer and never automatic; it runs at two, three or four times the amount; at most two are live at once.
  - The limits to state plainly: the Nassau takes no presses; a press can't itself be pressed, because a second press also needs a side 2 or more down in the main match; there are no automatic presses (`auto-press` is planned).
  - The copy must pass `npm run lint:content`, including the planned-capability claim phrases ("auto-press", "Nassau press").
- **Existing coverage, and how this differs:**
  - `/blog/pressing`: the etiquette and mechanics of pressing in general, including an auto-press sequence that GoLo doesn't do. It stays the general piece.
  - `/glossary#press`: the definition.
  - `/games/nassau`'s press FAQ: says presses live on the Overall Match.
  - `/features`: one paragraph.
  - The new page is the game guide: rules, the app's limits and a worked settle-up. It doesn't repeat the etiquette.
  - It's a guide, not a press calculator: #106's Phase 2 tools own interactive calculators.
- **Worked example and evidence:**
  - Use one real round scored in the app with one or two presses on the Overall Match, and show the settle-up the app produced. It has to come from the owner's own round, as `/how-it-works`'s example did.
  - Don't invent one, and don't describe a press-on-a-press.
  - Check the screens against the app at the release current when it's written. The registry's last check was GoLo 1.2.1 on 2026-10-29.
- **Sources to verify:**
  - The Rules of Golf, Rule 3.2 (match play), for "up", "down", "dormie" and concessions. Presses are a custom, not a Rule, so say so.
  - The registry entries `overall-match-presses`, `auto-press` and `nassau-presses`.
  - The app code paths named in `docs/glossary/capability-check.md` for presses.
- **Internal links:**
  - In: `/games/nassau` (its press FAQ), `/blog/pressing`, `/features` (presses paragraph), `/how-it-works`, `/glossary#press`.
  - Out: `/games/nassau`, `/blog/pressing`, `/glossary#press`, `/glossary#match-play`.
- **Implementation note:**
  - Overall Match isn't in the `games.ts` roster, and the sitemap builds guides from `gameDetailSlugsWithContent`. The page needs a roster entry and a detail record.
  - Also update `gsc-revalidation.md`'s URL list and `leads.sql`'s allow-list (`npm run lint:content` checks both).
  - Keep existing URLs as they are.
- **Success measure:**
  - Indexed within 21 days of publication (URL Inspection).
  - In the first monthly report after 28 days live: impressions on the page, and any query containing "press" or "match" landing on it.
  - No claim-guard failures.
  - No traffic target: the property's whole Other games group had 53 impressions in this window.
- **Maintenance owner:** the owner, through the registry. Recheck the page whenever an app release changes `overall-match-presses`, `auto-press` or `nassau-presses`. If presses come to the Nassau or turn automatic, the page changes with the registry, in the same PR.

## Next read

Re-run this table from the first full monthly report (#68), using its query groups and the same rules. Rows 4 and 12 carry explicit thresholds and dates; the rest wait for volume.
