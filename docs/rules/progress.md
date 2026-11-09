# Rules Center: working progress

A short record so the next session can pick up without redoing the research. It isn't a status report for visitors and doesn't replace the issues: #230 is the source of truth for status and order.

Gates are separate, and none implies another:

1. implemented locally
2. pushed (branch only)
3. PR open
4. CI green
5. editorially approved (content: the owner's approval in `review-packet-overviews.md` or `review-packet-situations.md`)
6. released (`rulesLive` flipped by #247)

CI runs on PRs to `main` and pushes to `main`. `main` auto-deploys to Hostinger, so every PR before #247 must leave `/rules` a 404 in production.

## Where things stand (November 7, 2026)

`rulesLive` is `false`. All 25 rule overviews and all 12 situations are `approved`; none is `published`. Only the launch PR (#247) publishes them.

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

#264 (7e4992c) came out of the #236 work: `/glossary#%` crashed the live glossary, and it now ignores a malformed hash (#157).

`npm test` runs 135 rules cases and 40 rules-sources cases.

**Open in M9:**

- **#242 discovery** and **#244 analytics**: in progress in parallel sessions as of this update. Check #230 and the open PRs before starting either.
  - The links into `/rules` from the footer, glossary records, game guides and posts can't merge while the flag is off (`rulesHrefProblem` in `scripts/rules-checks.mjs`), so #242 prepares them for the launch PR.
  - Related reading for Rules 3, 21 and 23 was deferred to #242.
- **#246 QA matrix**: needs #242 and #244.
- **#247 launch**: the owner's go/no-go.

M10 (#248–#251) waits on launch, Search Console evidence or the 2028 edition.

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

## Owner actions outstanding

- **#242.** Approve the edits to published glossary records (`relatedContentPaths` and their review-log entries).
- **#244.** Register the new event-scoped custom dimensions in GA4. The #244 PR lists them; the property is at 24 of 50.
- **#246.** Run the VoiceOver check, as for GL-QA-13.
- **#247.**
  - Give the launch go/no-go.
  - After deploy, approve the Search Console URL inspection.
