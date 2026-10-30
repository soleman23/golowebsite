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

## Where things stand (October 29, 2026, night: released)

**Live since 2026-10-29 17:23 PDT.** The owner approved the merge in the session at 17:21 PDT (recorded in #166). #201 merged as `70d9686` (CI green, Codex 👍), and Hostinger deployed it two minutes later. www.golo.golf/glossary has 56 published terms.

**Live checks, 2026-10-29** (details in #166):
- **Routes:** `/glossary` 200, and the apex 308s to www; `/glossary/press` 404; `?category=` is self-canonical.
- **Sitemap and llms.txt:** `/glossary` is in the sitemap with lastmod 2026-10-29, and in `llms.txt`.
- **Page:** 56 `DefinedTerm`s, with no internal fields in the page.
- **Suites:** GL-QA 32/32, consent 13/13 (Google answered locally), regression 22/22.
- **Hero:** the served bytes hash-match the committed files at 7 viewport/DPR pairs.
- **Live Lighthouse** varies a lot from one connection (`/glossary` median 3,679 ms, `/faq` 4,061 ms; Hostinger time to first byte ~0.36 s). It isn't comparable with the 2.5 s lab target, which the launch build met at 2,485 ms.

**Search Console:** URL Inspection said "URL is unknown to Google". Indexing was requested on 2026-10-29 at about 17:30 PDT and added to the priority crawl queue.

**Issues:**
- **Closed with evidence:** #158–#162, #164, #171. #154 and #165 were already closed.
- **#166:** open only for GL-QA-13, the screen-reader pass, which the owner accepted as a post-deploy check.
- **#167:** dates set from launch day L = 2026-10-29: 2026-11-05, 2026-11-26, 2026-12-24, 2027-01-27.

**Gates:** released. GL-QA-13 is the one check that hasn't happened.

## The launch PR (October 29, 2026, evening)

**On `main`:** #196 (chip count contrast), #197 (#164 CTAs), #198 (the 56 records at `in-review`), #199 (photo hero). Production still has `glossaryLive = false`: `/glossary` 404s (checked live after the deploy).

**Launch PR, branch `m7/launch-164-166`** (four commits; `launch-packet.md` § Launch diff): the app-code capability recheck, the final review and publication of all 56 records, the flag, footer and inbound links, and a lighter phone hero. **Not merged, not deployed:** nothing is published in production until the owner approves the merge.

**How the owner's five open items were resolved** (owner's instruction of October 29, 2026):
1. **Records and the eight questions:** the owner delegated the rules, product and SEO stages to an agent and approved the content in writing, subject to those checks. Done and logged per record (`review.ts`); answers in `review-packet.md` § Resolution.
2. **Capability rows 1–13:** rechecked by an agent against the app's code at golo `main` 2237c1d (GoLo 1.2.1), not by the owner. Three owner answers don't match the code (press on a press, the Closest to Pin carry, no junk board); the glossary follows the code. `capability-check.md` § Release recheck results; out-of-scope findings in #200.
3. **#195:** reviewed (comment on the PR). Its Closest to Pin carry is contradicted by the code; the launch PR doesn't depend on it. Not merged. If it merges as is, its `closest-to-pin` summary line will conflict with the launch PR's.
4. **Screen reader (GL-QA-13):** **not done**, because it needs a person. axe and an accessibility-tree inspection are recorded as supplements.
5. **Release go:** the owner's approval to merge and deploy is the last step.

**Defect fixed on the way:** #171's acceptance needs lab LCP ≤ 2.5 s, and the photo hero measured 2,634 ms. The glossary phone AVIF now starts at q40 (24.9 KB at 768w), and the median is 2,485 ms, about 15 ms inside the target.

**Gates:** implemented and QA'd on the launch build (Node 24.21.0); pushed and PR open (CI on the PR); content approved by the owner through the delegation; **not released**.

## Session 3 (October 29, 2026, afternoon)

Reconciled against GitHub and `origin/main` 488e5a8. Session 2's list below this one described #188–#192 and #194 as open; all six are merged.

**On `main`, merged:** #173, #175, #177, #179–#187 and #193 (session 2's table), plus #188–#192 (all 56 MVP records, then at `draft`) and #194 (`closest-to-pin` and `live-skins` live, owner 2026-10-29). `glossaryLive` is `false`.

**Open on GitHub:** #195 (restores the skins-carry and Closest to Pin claims, and records that an unwon Closest to Pin hole carries). It was opened by another session; this session didn't touch it.

**Session 3 branches:**

| Branch | Base | What | Checks (Node 24.21.0) |
|---|---|---|---|
| `m7/glossary-content-review`, PR #198, merged 2026-10-29 | `main` | #158–#162: all 56 records `in-review`, sources opened and dated, 18 corrections, examples recomputed, GoLo notes from live entries; `review-packet.md`, `launch-packet.md`, this file; Rules edition note fixed (next edition 2028) | lint, typecheck, test, build pass |
| `m7/164-glossary-ctas`, PR #197, merged 2026-10-29 | `main` | #164 prelaunch half: one product link per term by `ctaIntent`, the hub's closing-band title, hero lead names only MVP terms | lint, typecheck, test, build pass; State A rechecked on its production build |
| `fix/chip-count-contrast`, PR #196, merged 2026-10-29 | `main` | ChipFilter count opacity 0.6 → 0.75: 3.8–4.0:1 → 5.2–6.2:1 (axe, /blog live and the hub) | lint passes; axe clean on a build with it |
| `m7/171-glossary-hero`, PR #199 | `main` | #171: the owner's photos, image approved by the owner 2026-10-29 (sunset drive, generated by the owner with an AI image tool, supplied 2026-10-29), all 13 files, `heroPhotos` entry, `photo`, `heroOgImage`, `--copy-span: 660px` and a 640px title cap | lint, typecheck, test, build pass; contrast, hash and Lighthouse runs below |
| `m7/launch-164-166` | content + CTA commits | flag on, footer link, ten inbound links; fails `lint:content` by design until records are published | WIP; not to push |

Gates: #196–#198 pushed, CI green, Codex 👍, merged by the owner's instruction on 2026-10-29; nothing visible changes but /blog's chip counts, since `glossaryLive` is still false. #199: CI green, Codex 👍, hero image owner-approved. No record is owner-approved; nothing in the glossary is released.

**What session 3 verified** (details and files in `launch-packet.md`):
- State A on a production build (flag off): 404s, nothing in the sitemap, `llms.txt`, schema or other pages' links; no draft text in browser bundles.
- State B, a local launch simulation (flag on, records temporarily published, reverted): GL-QA-01–03, 05–12 and 14–24 pass; GL-QA-04 is not applicable (M8 term); GL-QA-13 is blocked on a human screen-reader pass. Consent: undecided, declined, GPC, withdrawn, allowed, deep link with and without a saved choice. A term held at `in-review` leaks into nothing.
- Schema.org validator 0/0; Rich Results Test: Breadcrumbs valid, DefinedTermSet not a rich-result type.
- Lighthouse lab median for the type-only hub: score 98, LCP 2,335 ms, CLS 0. With the photo (#171): score 97, LCP 2,634 ms, CLS 0; `/faq` with its photo, same build: 2,411 ms.
- #171 photo: per-pixel contrast passes at 20 widths, 320–2560px (tightest 5.28:1, the search placeholder). Chrome fetches the committed bytes at every viewport and DPR checked (7 of 7 hash matches).
- GSC prelaunch baseline taken (last 28 days to October 27): in the session evidence; to be retaken on launch day.

**Not done, and why:**
- **#171:** the files are built from the owner's photos (1916×821 and 1122×1402, upscaled to master size, so the 1920w and 2560w desktop files carry no more detail than the source). The owner generated both with an AI image tool (recorded 2026-10-29). With the photo, lab LCP is 2,634 ms, over the 2.5 s line; the hub's HTML (55 KB compressed against `/faq`'s 25 KB) is most of the gap to `/faq`.
- **Owner sign-off** on all 56 records, rows 1–13 of `capability-check.md`, and the release.
- **Screen reader** (VoiceOver or NVDA): needs a person.

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

1. **GL-QA-13:** a VoiceOver or NVDA pass on www.golo.golf/glossary, then record it in #166 and close #166. Script: rotor headings (one H1, Start here, Browse A–Z, letters); type "press" and listen for "2 terms match", then Tab to Clear and the results; pick Side games and listen for the active chip; read one entry (term, definition, example, notes, links); open `/glossary#press` cold.
2. **#195:** decide whether to drop its carry sentence; it conflicts with the released `closest-to-pin` entry.
3. **#200:** registry and site-copy corrections the app check found: in review on its own PR (Greenie and Sandie Skins options, scramble scorers, the CTP guide's greenie carry).

## Next ready

- #167's first checkpoint, 2026-11-05 (L+7): deployed and crawlable, sitemap and URL Inspection, events firing, broken links.
- #200, separately from the glossary.
