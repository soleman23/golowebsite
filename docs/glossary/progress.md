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

## Where things stand (October 29, 2026, end of session 3)

Reconciled against GitHub and `origin/main` 488e5a8. Session 2's list below this one described #188–#192 and #194 as open; all six are merged.

**On `main`, merged:** #173, #175, #177, #179–#187 and #193 (session 2's table), plus #188–#192 (all 56 MVP records, then at `draft`) and #194 (`closest-to-pin` and `live-skins` live, owner 2026-10-29). `glossaryLive` is `false`.

**Open on GitHub:** #195 (restores the skins-carry and Closest to Pin claims, and records that an unwon Closest to Pin hole carries). It was opened by another session; this session didn't touch it.

**Session 3 branches, local only (nothing pushed):**

| Branch | Base | What | Checks (Node 24.21.0) |
|---|---|---|---|
| `m7/glossary-content-review` | `main` | #158–#162: all 56 records `in-review`, sources opened and dated, 18 corrections, examples recomputed, GoLo notes from live entries; `review-packet.md`, `launch-packet.md`, this file; Rules edition note fixed (next edition 2028) | lint, typecheck, test, build pass |
| `m7/164-glossary-ctas` | `main` | #164 prelaunch half: one product link per term by `ctaIntent`, the hub's closing-band title, hero lead names only MVP terms | lint, typecheck, test, build pass; State A rechecked on its production build |
| `fix/chip-count-contrast` | `main` | ChipFilter count opacity 0.6 → 0.75: 3.8–4.0:1 → 5.2–6.2:1 (axe, /blog live and the hub) | lint passes; axe clean on a build with it |
| `m7/171-glossary-hero` | `main` | #171 code wired (generator page, `heroPhotos`, `photo`, `heroOgImage`, measured `--copy-span: 660px`); **no image files**; `mobileSubject`/`ogAlt` placeholders | WIP; not to push |
| `m7/launch-164-166` | content + CTA commits | flag on, footer link, ten inbound links; fails `lint:content` by design until records are published | WIP; not to push |

Gates for each: implemented locally, yes; pushed, no; PR, no; CI, no; owner-approved, no; released, no.

**What session 3 verified** (details and files in `launch-packet.md`):
- State A on a production build (flag off): 404s, nothing in the sitemap, `llms.txt`, schema or other pages' links; no draft text in browser bundles.
- State B, a local launch simulation (flag on, records temporarily published, reverted): GL-QA-01–03, 05–12 and 14–24 pass; GL-QA-04 is not applicable (M8 term); GL-QA-13 is blocked on a human screen-reader pass. Consent: undecided, declined, GPC, withdrawn, allowed, deep link with and without a saved choice. A term held at `in-review` leaks into nothing.
- Schema.org validator 0/0; Rich Results Test: Breadcrumbs valid, DefinedTermSet not a rich-result type.
- Lighthouse lab median for the type-only hub: score 98, LCP 2,335 ms, CLS 0.
- GSC prelaunch baseline taken (last 28 days to October 27): in the session evidence; to be retaken on launch day.

**Not done, and why:**
- **#171:** no glossary masters exist (`tmp/hero-src/glossary-{desktop,mobile}.png`). The old `tmp/hero-src` PNGs are the pre-#50 photos for other pages, with no recorded licence, so they weren't reused. Contrast, image-hash and with-photo Lighthouse evidence wait on the masters; the scripts are ready.
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

1. **Content (#158–#162):** sign the four stages per record from `review-packet.md`, and answer its eight questions.
2. **#154 rows 1–13:** re-confirm against the current app; row 2 backs the handicap GoLo notes.
3. **#171:** supply or approve course photography: a 2688×1152 desktop master (21:9, subject right, left half dark for the H1 and search field) and a 1792×2240 phone master (4:5, top dark, subject in the lower half), original or licensed, with its provenance.
4. **#195:** merge or close; then say whether the Closest to Pin entry should mention the carry.
5. **Push and PRs:** say which local branches to push. Suggested order: `fix/chip-count-contrast`, `m7/164-glossary-ctas`, `m7/glossary-content-review` (one PR, "Part of #158–#162"; the records stay `in-review`).
6. **Screen-reader pass** on the launch simulation (VoiceOver: rotor headings, the search results' live count, an entry's definition list).
7. **Release (#166):** go/no-go from `launch-packet.md`; record the newsletter exception.

## Next ready

- After owner approval of records: an agent adds the review logs (dated as signed), sets `approved`, and the launch branch moves them to `published`.
- After the masters land: `node scripts/generate-hero-images.mjs glossary`, then the contrast, image-hash and Lighthouse runs on `m7/171-glossary-hero`.
- After both: the launch PR (#164 + #166), per `launch-packet.md`.
