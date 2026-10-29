# Glossary MVP: working progress

A short record so the next session can pick up without redoing the research. It isn't a status report for visitors and doesn't replace the issues: #151 is the source of truth for status and order.

Gates are separate, and none implies another:

1. implemented locally
2. pushed (branch only)
3. PR open
4. CI green
5. editorially approved
6. released

CI runs on PRs to `main` and pushes to `main`. A retargeted PR needs a push before CI runs.

## Where things stand (October 29, 2026, end of session 2)

**On `main`, merged with merge commits, CI green on Node 24:**

| PR | Issue |
|---|---|
| #173 junk board overclaim | #172 |
| #175 Wolf tees off last | #174 |
| #177 skins validation CTA | #176 |
| #179 registry: a press on a press | part of #154 |
| #180 inventory, canonical map, editorial review | #152 |
| #181 capability checklist and answers | part of #154 |
| #182 UX doc and this file | #153 |
| #183 model, flag, search, validation | #155 |
| #184 hub | #156 |
| #185 search, filters, deep links | #157 |
| #186 SEO | #163 |
| #187 analytics | #165 |
| #193 push and halve in the skins guide | #178 |

`glossaryLive` is `false` on `main`. State A on `main` after #184 and #186 (production builds): `/glossary` and `/glossary?category=…` return 404; the sitemap, `llms.txt` and the home, `/games`, `/faq` and `/blog` pages have no glossary entries or links; there is no `DefinedTerm`.

**Open:**
- **#194** registry: `closest-to-pin` and `live-skins` are live (`OWNER_1029`); `junk-board` no longer lists greenies; the Closest to Pin copy says par-to-win is the group's call. CI green; waits on the owner. It asks whether GoLo carries an unclaimed Closest to Pin hole, and whether to restore the chips removed in #173.
- **#188 → #192** content drafts, all 56 MVP records at `draft`, "Part of" #158–#162. #188 targets `main`; the rest are stacked. None is reviewed, no source is opened, and the handicap GoLo notes wait on row 2. After #194 merges, the Closest to Pin record (#189) should cite `closest-to-pin` instead of `game-library`.

## Decisions and findings from session 2

- **Owner answers:** #152 Q1–Q5 and #153 D1–D8 accepted; #154 Q-a to Q-e answered (no junk board, a press on a press allowed, no skins validation). Closest to Pin is a live game that settles: the scorer marks the winner, no distance is recorded, and par-to-win is the group's call. Skins and carries build hole by hole on the scoring screen and the live leaderboard. Rows 1–13 of `capability-check.md` are not re-confirmed.
- **Rule for product copy:** every product claim traces to a `live` entry in `capabilities.ts`, or it's asked about rather than written.
- **Codex findings, all fixed and tested:** a re-approved published term keeps its `publishedOn` (validator and `editorial-review.md`); a deep-link arrival's `glossary_term_open` waits for the saved analytics choice (`openReport.ts`, 4 test cases); the search success rate uses the same searches on both sides, bounded by the next search. Codex then hit its usage limit and didn't review #181, #193 or #194; the owner accepted #181 and #193 without it.
- **Stacked-branch hazard:** #182's first commit had been made on stale copies of `inventory.md` and `editorial-review.md`, and would have reverted the owner's Q5 decision. It was caught by checking the retargeted diff, then fixed. Check every retargeted diff for files outside the PR's issue.

## Checks actually run in session 1 (October 29, 2026, Node 22.22 in the cloud container)

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: pass on #155, #156, #157, #163 and #165 with the committed records and the flag off. Node 24 couldn't be installed in the container; CI runs Node 24 from `.nvmrc`, and every merged PR passed it.
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
- **Existing-site conflicts, all fixed on `main`:** Wolf tee order (#174, PR #175); skins validation wording (#176, PR #177); push/halve split (#178, PR #193); junk board (#172, PR #173). `inventory.md` § Existing site definitions.
- **#165 vs #164 sequencing.** #165 lists #164 as a dependency, and #164 ships with the launch. Resolution: the events, docs and gated discovery work are built now behind `glossaryLive`; public exposure (footer link, inbound links, flag flip) is the combined #164 + #166 launch change. #165's acceptance criteria are unchanged; its consent checks ran in the local launch simulation and run again on the live site after launch.
- **Title format:** the site template gives "… · GoLo", not the spec's "| GoLo Golf". The repo convention was kept.
- **`?category=` and the URL sanitizer:** `lib/analyticsPreference.ts` drops unlisted query params on every page load in production. `category` on `/glossary` was added to its allow-list (#157). Without that, the category would vanish from the address in production.

## Owner actions

1. **#194:** review, and answer its two questions.
2. **#154 rows 1–13:** re-confirm against the app. The handicap GoLo notes (row 2) wait on this.
3. **Source checks:** a session that can reach `www.usga.org` and `www.randa.org`. No rules or WHS record moves past `draft` until then.
4. **#171:** course photography, desktop 2688×1152 and mobile 1792×2240 masters.
5. **Content approval (#158–#162):** the stages in `editorial-review.md`, record by record.

## Next ready

- **#164:** footer entry, inbound links and per-intent CTA copy, prepared behind the flag, merged with the launch (#166).
- **#171:** blocked on photography.
- **#166:** blocked on everything above plus the owner's go. Its recheck list is in `capability-check.md`.
