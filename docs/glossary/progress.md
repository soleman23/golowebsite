# Glossary MVP: working progress

A short record so the next session can pick up without redoing the research. It isn't a status report for visitors and doesn't replace the issues: #151 is the source of truth for status and order.

Gates are separate, and none implies another:

1. implemented locally
2. pushed (branch only)
3. PR open
4. CI green
5. editorially approved
6. released

CI runs only on PRs to `main` and pushes to `main`, so a stacked PR gets CI once it's retargeted to `main`. The session 2 table below is current; the session 1 sections after it are kept for the record.

## Session 2, October 29, 2026: owner answers, PRs open

The owner answered #152 Q1–Q4, accepted #153 D1–D8, answered #154 Q-a to Q-e, and found the junk board overclaim (#172), which took priority. Rows 1–13 of `capability-check.md` are not re-confirmed.

| PR | Issue | Base | CI (Node 24) |
|---|---|---|---|
| #173 junk board fix (owner review before merge) | #172 | `main` | green |
| #175 Wolf post tees off last | #174 | `main` | green |
| #177 skins validation CTA | #176 | `main` | green |
| #179 registry: a press on a press | part of #154 | `main` | green |
| #180 inventory, canonical map, editorial review | #152 | `main` | green (date-rule finding fixed) |
| #181 capability checklist and answers | part of #154 | `main` | green |
| #182 UX doc + this file | #153 | #180's branch | runs after retarget |
| #183 model, flag, search, validation | #155 | `main` | green (126 glossary tests on Node 24.22.1) |
| #184 hub | #156 | #183's branch | runs after retarget |
| #185 search, filters, deep links | #157 | #184's branch | runs after retarget |
| #186 SEO | #163 | #185's branch | runs after retarget |
| #187 analytics | #165 | #186's branch | runs after retarget |
| #188 → #189 → #190 → #191 → #192 drafts | part of #158–#162 | stacked on #183 | runs after retarget |

Other issues filed: #178 (push/halve in the skins guide; PR #193). #173 and #177 both add `OWNER_1029` to `capabilities.ts`; the second to merge needs a one-line conflict fix.

All 56 MVP records exist as drafts (#188–#192). None is reviewed. No rules or WHS source has been opened. Handicap GoLo notes wait on row 2.

### Round 2 (owner review, same day)

- **#175, #177, #179** accepted by the owner. Merge order now: #175, #179, #181, then #180, then #182 and #183 → #187 in order, each retargeted to `main` as the one below merges.
- **Codex findings, all verified, fixed, answered and resolved:**
  - #180: `reviewedOn ≤ publishedOn` would reject a re-approved published term. The doc (#180) and the validator (#183, 98b9e44) now check publication against the first approval; `reviewedOn` is the latest approval. 2 new test cases.
  - #187: a cold load of `/glossary#<slug>` lost `glossary_term_open`, because AnalyticsLoader applies the saved choice one task after the hub's mount effect. Reproduced in a production build (0 events). Fixed in `components/sections/glossary/openReport.ts` (84cbd69); after the fix, 1 event with a saved grant and none with no choice then Allow. 4 test cases cover D5. A single-task wait fails them.
  - #187: the search success rate now uses the same searches on both sides, bounded by the next search, from params already sent.
- **#173 changes for the owner:** replacements trace to live registry entries; the Closest to Pin and live-standings replacements are gone; one more junk line (skins guide "Stack the side games"); screenshots refreshed on `pr-assets/junk-board`. `lint:content` passes on every glossary content branch with #173 merged in locally (not pushed).
- **#193** opened for #178 (push/halve), against `main`.
- **Unregistered claims already on main, for the owner:** Live Leaderboard "Live skins and carries"; skins guide "GoLo shows the live skins on the scoring screen"; the Closest to Pin game row in `lib/mockData.ts` and the guide's "let GoLo net it into the settle-up". The guide also treats greenie and closest to the pin as the same thing, which conflicts with the `junk-board` entry.

## Branches (session 1; PRs now open, see the table above)

| Issue | Branch | Base | State |
|---|---|---|---|
| #152 | `glossary/152-inventory` | `main` | Docs: `inventory.md`, `canonical-map.md`, `editorial-review.md`. Awaiting owner review (inventory Q1–Q4) |
| #153 | `glossary/153-ux` | #152 | Docs: `ux.md`, this file. Awaiting owner review of D1–D8 |
| #154 | `glossary/154-owner-checklist` | `main` | Docs: `capability-check.md`. Waiting on the owner's answers |
| #155 | `glossary/155-model` | `main` | Code: model, `glossaryLive = false`, selectors, search, validation, `lint:content` integration, `scripts/test-glossary.mjs` (126 cases) in `npm test` and CI. Draft fixture only |
| #156 | `glossary/156-hub` | #155 | Code: server-rendered hub, `notFound()` in production while the flag is off |
| #157 | `glossary/157-search` | #156 | Code: search, category chips (`?category=`), A–Z, deep links, copy link; plus the URL-sanitizer fix for `?category=` |
| #163 | `glossary/163-seo` | #157 (merged in) | Code: metadata, canonical, `DefinedTermSet`, sitemap and `llms.txt`, all gated; run sheet note; GSC groups |
| #165 | `glossary/165-analytics` | #163 (merged in) | Code: four events + `share_click` reuse; data notes; `leads.sql` |
| #158 | `glossary/158-formats` | #155 | Content: ten games-and-formats records at `draft`. No review stage done, no source opened, no GoLo notes |

Merge order: #152 → #153 (docs, any time) · #155 → #156 → #157 → #163 → #165 · #154 (docs, any time). Each code branch contains the ones before it, so a PR for #156 opened against `main` before #155 merges would show both. Open them in order, or retarget each PR as the previous one merges.

## Checks actually run (October 29, 2026, Node 22.22 in the cloud container)

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: pass on #155, #156, #157, #163 and #165 with the committed records and the flag off. **Not run on Node 24**: installing it was blocked here. CI uses Node 24 from `.nvmrc`.
- **State A, flag off (production build, `next start`):** `/glossary` and `/glossary?category=…` return 404. Nothing glossary-related is in `sitemap.xml` or `llms.txt`, there's no schema, and home, `/games`, `/blog` and `/faq` have no `/glossary` links. Rechecked after #156, #157, #163 and #165.
- **State B, temporary local launch simulation** (flag on, 18 uncommitted sample records marked published, reverted afterwards):
  - `/glossary` returns 200, with the title "Golf Glossary: Terms, Slang & Games Explained · GoLo".
  - It's self-canonical, and a `?category=` view gives the same canonical.
  - The sitemap has one `/glossary` entry, and `llms.txt` has a Glossary section.
  - There are 18 `DefinedTerm`s whose names and descriptions match the visible terms exactly.
  - Consent in a production build with analytics enabled (gtag.js stubbed): no events with no choice, after Decline, or under GPC. Events flow after Allow, with no search text. `?category=` survives the URL sanitizer and a reload.
- **`next dev` UI QA**, with the temporary samples at `approved`:
  - 35 scripted checks pass, covering GL-QA-02, 03, 06–11 and the deep-link, copy-link and no-JS cases.
  - No horizontal overflow at 320, 760, 1100 or 1440 px.
  - Every tab stop shows the 2px lime ring.
  - Event emission was checked with a stubbed gtag, including withdrawal.
  - Screenshots are in the session scratchpad only, not committed.
- **Not run:**
  - Schema.org validator and Rich Results Test (unreachable from the container);
  - GA4 DebugView;
  - a screen reader pass;
  - Lighthouse;
  - #171's photo checks (no photo yet);
  - any rules or WHS source check (`usga.org` and `randa.org` unreachable).

## Findings and decisions to know

- **Vocabulary rule.** `NEVER_WORDS` in `scripts/check-content.mjs` bans "wager", "stakes", "bet(s)", "pot(s)", "payout(s)" and more site-wide. That affects the spec's category name, its Press draft and aliases, and three M8 term names. MVP names unaffected. `inventory.md` Q1, Q2.
- **Existing-site conflicts:** Wolf tee order (#174, PR #175); skins validation wording (#176, PR #177); push/halve split (#178); junk board (#172, PR #173). `inventory.md` § Existing site definitions; also in `capability-check.md`.
- **#165 vs #164 sequencing.** #165 lists #164 as a dependency, and #164 ships with the launch. Resolution: the events, docs and gated discovery work are built now behind `glossaryLive`; public exposure (footer link, inbound links, flag flip) is the combined #164 + #166 launch change. #165's acceptance criteria are unchanged; its consent checks ran in the local launch simulation and run again on the live site after launch.
- **Title format:** the site template gives "… · GoLo", not the spec's "| GoLo Golf". The repo convention was kept.
- **`?category=` and the URL sanitizer:** `lib/analyticsPreference.ts` drops unlisted query params on every page load in production. `category` on `/glossary` was added to its allow-list (#157). Without that, the category would vanish from the address in production.

## Owner actions (after session 2)

1. **Review and merge**, never by an agent:
   - #173 first (junk board, your review); then #177, which needs a one-line `OWNER_1029` conflict fix;
   - #175, #179, #180, #181 any time;
   - then #182, and #183 → #184 → #185 → #186 → #187 in order, retargeting each to `main` as the one below merges.
2. **#154 rows 1–13:** re-confirm against the app. Handicap GoLo notes (row 2) wait on this.
3. **Source checks:** a session that can reach `www.usga.org` and `www.randa.org`. No rules or WHS record moves past `draft` until then.
4. **#171:** course photography, desktop 2688×1152 and mobile 1792×2240 masters.
5. **Content approval (#158–#162):** the stages in `editorial-review.md`, record by record.

## Next ready

- **#164:** footer entry, inbound links and per-intent CTA copy, prepared behind the flag, merged with the launch (#166).
- **#171:** blocked on photography.
- **#166:** blocked on everything above plus the owner's go. Its recheck list is in `capability-check.md`.
