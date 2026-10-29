# Glossary MVP: working progress

A short record so the next session can pick up without redoing the research. It isn't a status report for visitors and doesn't replace the issues: #151 is the source of truth for status and order.

Gates are separate, and none implies another:

1. implemented locally
2. pushed (branch only)
3. PR open
4. CI green
5. editorially approved
6. released

No glossary PR is open. CI runs only on PRs and `main`, so **no glossary branch has been through CI**.

## Branches (all pushed to origin, no PRs)

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
- **Existing-site conflicts:** Wolf tee order; skins validation wording; a possible "every validation" overclaim. `inventory.md` § Existing site definitions; also in `capability-check.md`. No issues filed.
- **#165 vs #164 sequencing.** #165 lists #164 as a dependency, and #164 ships with the launch. Resolution: the events, docs and gated discovery work are built now behind `glossaryLive`; public exposure (footer link, inbound links, flag flip) is the combined #164 + #166 launch change. #165's acceptance criteria are unchanged; its consent checks ran in the local launch simulation and run again on the live site after launch.
- **Title format:** the site template gives "… · GoLo", not the spec's "| GoLo Golf". The repo convention was kept.
- **`?category=` and the URL sanitizer:** `lib/analyticsPreference.ts` drops unlisted query params on every page load in production. `category` on `/glossary` was added to its allow-list (#157). Without that, the category would vanish from the address in production.

## Owner actions, precisely

1. **#152:** answer `inventory.md` Q1 (vocabulary vs betting terms, M8 only), Q2 ("press bet" alias), Q3 (Wolf tee order), Q4 (accept substitutions S1–S9, merges M1–M6).
2. **#153:** accept or change `ux.md` D1–D8.
3. **#154:** fill in `capability-check.md` rows 1–13 and Q-a to Q-e.
4. **Network:** allow `www.usga.org` and `www.randa.org` for this environment (it didn't take effect in this session), or do the source checks in a local session. No rules or WHS record can reach `approved` without them.
5. **#171:** supply course photography (original or licensed) as desktop 2688×1152 and mobile 1792×2240 masters, with the dark side for the H1 and search field. Nothing can be generated or licensed on your behalf.
6. **Content approval (#158–#162):** the review stages in `editorial-review.md`, once drafts exist.
7. **PRs:** say when to open them, and in which order (above).

## Next ready

- **#158–#162 drafts:** draft records (`status: "draft"`, no sources claimed) can be written now against the #155 contract. Rules and WHS text stays unverified until the sources are reachable. GoLo notes for #159 and #160 wait on #154.
- **#164:** footer entry, inbound links and per-intent CTA copy can be prepared behind the flag, but must merge with or as part of the launch (#166).
- **#171:** blocked on photography.
- **#166:** blocked on everything above plus the owner's go.
