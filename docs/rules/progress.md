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

## Where things stand (November 6, 2026)

- **Tracking created:** epic #230; issues #231–#251; milestones M9 · Rules Center and M10 · Rules Center expansion; label `rules-center`.
- **#231 / #232 (this PR):** `product-spec.md` (owner's v1.0 plus Amendments), `inventory.md`, `source-map.md`, `canonical-map.md`, `editorial-review.md`, `ux.md`. Waiting on the owner to approve the Amendments (#231) and the wireframes (#232).
- **Next ready:** #233 (content model, flag, validators, tests). Once it merges, #234 (hub), #237–#241 (content batches) and #245 (source monitoring) can run in parallel.

## Facts established on November 6, 2026

- All 25 R&A rule pages return 200 to a script; anchors are `N_xy` (full list in `source-map.md`).
- The R&A Definitions page gives multi-word terms opaque ids: cite at page level.
- Model Local Rule E-5 lives in Committee Procedures Section 8 (`/en/rog/committee-procedures/sections/8`), in a collapsed block with no stable anchor.
- usga.org returns 403 to scripts and loads in the browser pane. The USGA clarifications page reads "Updated October 2, 2026"; next update early January 2027.
- Search Console shows no Rules of Golf demand yet; every "rules" query so far is a game-format query owned by `/games/*`.

## Owner actions outstanding

1. Approve the Amendments in `product-spec.md` (#231).
2. Approve the wireframes and decisions D1–D8 in `ux.md` (#232).
