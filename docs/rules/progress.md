# Rules Center: working progress

A short record so the next session can pick up without redoing the research. It isn't a status report for visitors and doesn't replace the issues: #230 is the source of truth for status and order.

Gates are separate, and none implies another:

1. implemented locally
2. pushed (branch only)
3. PR open
4. CI green
5. editorially approved (content: the owner's approval in `review-packet-overviews.md` or `review-packet-situations.md`)
6. released (`rulesLive` flipped by #247)

CI runs on PRs to `main` and pushes to `main`. `main` auto-deploys to Hostinger, so every PR before #247 had to leave `/rules` a 404 in production.

## Where things stand (November 9, 2026)

**Live since 2026-11-07.** The launch PR #269 merged as `f27675b` at 11:04:03 PST on the owner's "Go" (11:03 PST, recorded in #247), and `/rules` first returned 200 on www.golo.golf at 11:05:53 PST. `rulesLive` is `true` and `RULES_LAUNCHED_ON` is `"2026-11-07"` (`lib/content/rules/launch.ts`); all 25 overviews and all 12 situations are `published` with `publishedOn` 2026-11-07. The live checks and the Search Console steps are in `launch-packet.md` § Live results; the checkpoint dates are in `docs/seo-reports/rules-checkpoints.md`.

**M9 is done.** Every M9 issue is closed. On 2026-11-09 the owner waived the VoiceOver check, RL-QA-14: "We don't need to run the voice over". It's recorded as an owner-approved exception, not a pass, in `launch-packet.md` (#271), on #246 and on #230. No one has made a human screen-reader pass on `/rules`. The automated checks stand in its place: axe (RL-QA-12), the accessibility tree (RL-QA-13) and the Tab walk (RL-QA-09–11).

### Before launch (as recorded on November 7, 2026)

`rulesLive` was `false`. All 25 rule overviews and all 12 situations were `approved`; none was `published`. Only the launch PR (#247) published them.

| Issue | What | PR | Merge commit |
|---|---|---|---|
| #231, #232 | Research, source map, UX plan, spec Amendments A1–A14 | #252 | fdb528d |
| #233 | Content model, launch flag, validators, `test-rules` | #253 | 50e7f6b |
| #245 | Source monitoring, quarterly review, corrections (`maintenance.md`) | #254 | a40c977 |
| #234 | Server-rendered hub behind the flag | #255 | 118bd75 |
| #240 | Situations batch 1: seven P0 answers | #256 | 2cd5a1e |
| #238 | Overviews batch 2: Rules 12–19 | #257 | 632b67a |
| #237 | Overviews batch 1: Rules 1–11 | #258 | 3dc62f9 |
| #239 | Overviews batch 3: Rules 20–25 | #259 | 0088da2 |
| #236 | Search, topic filters, deep links | #260 | 8aaa8da |
| #241 | Situations batch 2: five P1 answers | #261 | fc5e57c |
| #243 | Metadata, `CollectionPage` schema, gated sitemap and llms.txt | #262 | 119c2fc |
| #235 | Hero photo and share card | #263 | c73e784 |
| #242 | Discovery: link map, related reading, closing band (the inbound links shipped with #269) | #266 | efd2ed5 |
| #244 | Consent-aware analytics and reporting definitions | #267 | 189e7eb |
| #247 | Launch: flag on, 37 records published, 15 inbound links | #269 | f27675b |

#264 (7e4992c) came out of the #236 work: `/glossary#%` crashed the live glossary, and it now ignores a malformed hash (#157).

`npm test` runs 135 rules cases and 40 rules-sources cases.

**M9 closed out (November 9, 2026):**

- **#246 QA matrix**: closed 2026-11-09 (20:49 UTC). 24 of 25 RL-QA rows pass on the launch build. RL-QA-14 was waived by the owner and is recorded as an exception, not a pass. Its script stays in `launch-packet.md` § VoiceOver script in case anyone runs a screen-reader check later.
- **#230 epic**: every M9 box is ticked. It stays open for the M10 items below.

Closed on November 7, 2026: #242 (18:01 UTC), #244 (18:11 UTC) and #247 (closed by the #269 merge, 19:04 UTC). #269's body said "Closes #247 once…", and GitHub closed #247 at the merge, before its post-launch record. Keep closing keywords out of a PR whose issue still needs records after the merge.

**M10:**

- **#248 checkpoints**: L+7 on 2026-11-14, L+28 on 2026-12-05, L+56 on 2027-01-02, L+90 on 2027-02-05 (`rules-checkpoints.md`). The prelaunch baseline (2026-10-10 – 2026-11-06) was re-read with complete days on 2026-11-09 and is unchanged (6 clicks, 684 impressions, Rules of Golf 0); a fresh CSV export goes with the L+7 run.
- **#249** and **#250** wait on Search Console evidence from those checkpoints.
- **#251** waits on the official 2028 edition.

Before launch, M9 also held #242 discovery and #244 analytics, run in parallel sessions. The links into `/rules` couldn't merge while the flag was off (`rulesHrefProblem` in `scripts/rules-checks.mjs`), so #242 prepared them for the launch PR, along with the related reading for Rules 3, 21 and 23.

## Facts established on November 6, 2026

- All 25 R&A rule pages return 200 to a script; anchors are `N_xy` (full list in `source-map.md`).
- The R&A Definitions page gives multi-word terms opaque ids: cite at page level.
- Model Local Rule E-5 lives in Committee Procedures Section 8 (`/en/rog/committee-procedures/sections/8`), in a collapsed block with no stable anchor.
- usga.org returns 403 to scripts and loads in the browser pane. The USGA clarifications page reads "Updated October 2, 2026"; next update early January 2027.
- Search Console shows no Rules of Golf demand yet; every "rules" query so far is a game-format query owned by `/games/*`.

## Learned on November 6–7, 2026

- **Review.** Codex kept finding narrower rules points after the owner had approved a batch:
  - same-area lateral drops
  - no play zones
  - complete relief after a drop
  - the 15.3b request to lift

  Each fix went back to the owner, and the packets mark every change made after approval. Plan for this in any future batch.
- **Glossary.** The glossary's `gimme` entry agrees with the Rules of Handicapping 3.3, so the conceded-putt situation needed no glossary change.
- **Citations.** The source model has no Committee Procedures type outside Section 8. CP 2C ("all areas red") is cited in the situations packet only.
- **Pinned copy.** `scripts/test-rules.mjs` pins two situation questions: "Lost ball: what happens next?" and "My ball moved after it stopped". It allows at most two overviews to match the search "rules", so keep "Rules" out of overview first sentences and questions.
- **Rights check.** `npm run check:rules-copy` is the 8-word copy-distance check against the cached R&A text. Run it during review; it isn't in CI.
- **Search.** A native `history.replaceState` doesn't reach `FilterUrlSync` on a cold arrival, so the hub uses `router.replace` plus a retry for a pending reveal.
- **Schema.** The built page (about 427 KB) is too big to set through the pane's JS. To check it on validator.schema.org, paste only the JSON-LD `<script>` blocks into the page's main CodeMirror and press the round play button. #243 got 0 errors and 0 warnings.
- **Hero.**
  - The Higgsfield `gpt_image_2_6` model at 2688×1152 needs `resolution: "4k"`.
  - The phone frame at AVIF q40 (`START_FOR` rules-mobile) put lab LCP at 2.35 s.
  - From 768px up the desktop crop uses `object-position: right 80%`, which keeps the ball in view at 1920px.
  - Screenshots are on `pr-assets/rules-hero` and `pr-assets/rules-hub`.
- **Merging.** The auto-mode classifier blocks `gh pr merge` on delegated authority alone. Every Rules Center merge so far has had the owner's yes in chat, on top of CI and a Codex 👍 at the head SHA.

## Model notes for the next session

- A record's Rules of Golf citations are its `rules` sources (`rogSource("18.2b")`); there is no separate `ruleRefs` field. Titles and categories come from the rule number, so overviews don't carry them.
- Search treats a rule reference ("18", "rule 18", "18.2b") as a reference only: it never matches text by digits.
- A situation may share an alias with its primary rule's overview ("water hazard", "casual water"); any other shared alias needs `ambiguousAliases` and a reason in `inventory.md`.
- A static `/rules#id` href fails lint until the record is published; build it with `rulesAnchorHref`.
- `validateRules` fails every record from 2028-01-01 until #251 moves them to the new edition; a clarifications check older than 100 days only warns.

## Owner actions outstanding (November 9, 2026)

None for M9. The next scheduled work is the #248 L+7 checkpoint on 2026-11-14.

Done on November 7, 2026: the glossary record edits for #242 ("Approve all 10"), the five Rules GA4 dimensions for #244 (29 of 50), the launch go for #247 ("Go", 11:03 PST), and the Search Console inspection, indexing request and sitemap resubmission after deploy. Decided on November 9, 2026: the VoiceOver check (RL-QA-14) is waived.
