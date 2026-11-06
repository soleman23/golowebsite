# Rules Center: working progress

A short record so the next session can pick up without redoing the research. It isn't a status report for visitors and doesn't replace the issues: #230 is the source of truth for status and order.

Gates are separate, and none implies another:

1. implemented locally
2. pushed (branch only)
3. PR open
4. CI green
5. editorially approved (content: the owner's approval in `review-packet.md`)
6. released (`rulesLive` flipped by #247)

CI runs on PRs to `main` and pushes to `main`. `main` auto-deploys to Hostinger, so every PR before #247 must leave `/rules` a 404 in production.

## Where things stand (November 6, 2026, evening)

- **Tracking created:** epic #230; issues #231–#251; milestones M9 · Rules Center and M10 · Rules Center expansion; label `rules-center`.
- **#231 / #232: done.** Merged in #252 (fdb528d) after the owner approved the Amendments and the UX plan in the session ("Approve, start #233").
- **#233 (content model): PR open.** `lib/content/rules/`:
  - `official.ts`: R&A titles and every subrule anchor, as fetched November 6.
  - Types, categories, edition, `rulesLive = false`, source builders.
  - 25 overview and 12 situation skeletons (`planned`).
  - Selectors, search and `validateRules`.
  - `scripts/rules-checks.mjs` and `scripts/test-rules.mjs` (98 cases).
  - `check-content.mjs` wiring and a CI step.
- **Next ready once #233 merges:** #234 (hub), #237–#241 (content batches) and #245 (source monitoring), in parallel. Each content batch moves records from `planned` to `draft` and on through review. #234 needs at least one `approved` record to show anything in `next dev`; until a batch lands, build it against records flipped locally.

## Facts established on November 6, 2026

- All 25 R&A rule pages return 200 to a script; anchors are `N_xy` (full list in `source-map.md`).
- The R&A Definitions page gives multi-word terms opaque ids: cite at page level.
- Model Local Rule E-5 lives in Committee Procedures Section 8 (`/en/rog/committee-procedures/sections/8`), in a collapsed block with no stable anchor.
- usga.org returns 403 to scripts and loads in the browser pane. The USGA clarifications page reads "Updated October 2, 2026"; next update early January 2027.
- Search Console shows no Rules of Golf demand yet; every "rules" query so far is a game-format query owned by `/games/*`.

## Model notes for the next session

- A record's Rules of Golf citations are its `rules` sources (`rogSource("18.2b")`); there is no separate `ruleRefs` field. Titles and categories come from the rule number, so overviews don't carry them.
- Search treats a rule reference ("18", "rule 18", "18.2b") as a reference only: it never matches text by digits.
- A situation may share an alias with its primary rule's overview ("water hazard", "casual water"); any other shared alias needs `ambiguousAliases` and a reason in `inventory.md`.
- `validateRules` fails every record from 2028-01-01 until #251 moves them to the new edition; a clarifications check older than 100 days only warns.

## Owner actions outstanding

None until the first content batch's review packet.
