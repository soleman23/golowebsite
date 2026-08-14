# Prompt 01 — `/features`

**Reference:** `design_handoff/reference/Golo Golf - Features.dc.html` — open it in a browser and read its inline styles for exact values. Copy every string verbatim.

---

Build `/features` as a server component at `app/features/page.tsx`, with page-specific sections in `components/sections/features/` and content data in `lib/content/features.ts`. Reuse `PageHero`, `SectionHeader`, `FeatureRow`, `CheckList`, `StatusPill`, `Accordion`, `PhoneShell`, `FinalCTA`.

## Section order

1. **Hero** — kicker `EVERYTHING GOLO DOES`, H1 "A scorecard that can do arithmetic, keep a bet straight, and remember who owes who.", the lead paragraph, two CTAs (`Get the app` primary → `/#get`, `Browse the games` ghost → `/games`), then a row of three status pills: `FREE WHILE WE'RE IN BETA`, `NO MONEY MOVES THROUGH GOLO`, `ONE PHONE SCORES THE GROUP`.

2. **Eight feature blocks**, alternating sides via `FeatureRow`, each with kicker + `StatusPill` + H3 + lead + 3-item `CheckList`, and a mockup visual:

| # | Kicker | Status | Visual |
|---|---|---|---|
| 1 | ROUND SETUP | today | `SetupPhone` — new round card: course, par/yardage/rating line, players & tees rows with color dots, games-on-the-card chips (Nassau $5, Skins $2, Junk $1), `Start the round` button |
| 2 | GAME LIBRARY | today | `GameStackCard` — 6 game tiles (Nassau, Skins, Wolf, Stroke purse, Bingo Bango Bongo, Junk board) each with name + one-line rule |
| 3 | IMMERSIVE SCORING | today | `ScoringPhone` (**exists** — extend with the `+ Greenie` / `+ Sandie` junk buttons and the hole 7 header) |
| 4 | LIVE LEADERBOARD | today | `MoneyCard` (**exists** — extend to the MONEY/GROSS toggle, four player rows with reason lines and ± dollar figures, skins-pot footer) |
| 5 | PRESS TRACKING | today | `PressLadder` — Nassau $5 ladder: front base closed, press called on 6 closed, back base live, auto-press live, plus an "exposure if everything falls badly" footer |
| 6 | HANDICAPS & STROKES | today | `StrokeGrid` — 22.0 index → 24 strokes header, then an 18-cell grid by stroke index with one-stroke / two-stroke marks and a legend |
| 7 | AUTO SETTLE-UP | today | `SettleCard` — FINAL · SETTLE UP, +$85 hero numeral, per-game breakdown chips, `WHO PAYS WHOM · 3 TRANSFERS` rows with `Mark paid` / `Paid ✓` states, `Share the card` |
| 8 | HISTORY, STATS & YOUR LOCKER | `HISTORY LIVE · STATS EXPANDING` | `LockerCard` — season/all-time net, handicap trend, per-format record |

Blocks 2, 5 and 7 each end with a lime text link: `See every format →` `/games`, `How presses work →` `/games/nassau`, `The etiquette of settling up →` `/blog/who-pays-first`.

3. **"Also in there"** — two wide glass cards under an `ALSO IN THERE` label: *Course database* (`GPS YARDAGES NEXT` pill) and *Receipts for the group chat* (`IN TESTING` pill).

4. **Roadmap** — `RoadmapColumns`, kicker `WHERE THE APP ACTUALLY IS`, H2 "We're in beta, so here's the honest list.", lead, then three columns — `IN THE APP TODAY` (5 items), `IN TESTING WITH REAL GROUPS` (4), `ON THE LIST, NOT BUILT` (4). Column headers carry the matching `StatusPill` variant; items are plain checked/dashed rows, not marketing.

5. **Testimonials** — kicker `FROM THE GROUPS TESTING IT`, sub "40+ rounds, real money, no free hats", three quote cards with initial avatars using the player palette (`--avatar-teal`, `--avatar-orange`, `--avatar-blue`) and index/role lines.

6. **Pricing note** — `WHAT IT COSTS`, oversized `Free` numeral + "while we're in beta", the paragraph, and three checked lines.

7. **Quick answers** — `QUICK ANSWERS` + `FULL FAQ →` link to `/faq`, then an `Accordion` of 5 questions (verbatim from the reference), firing `faq_open` with `{ page: "features", question_id }`.

8. **Closing CTA** — `FinalCTA`: kicker `TRACK IT. BET IT. SETTLE IT.`, H2 "Bring it Saturday. Let the phone keep the tally.", buttons `Get the app` → `/#get` and `Ask us something` → `/contact`. Fire `cta_click`.

## Data

`lib/content/features.ts` — extend the existing `Feature` type with `status: "today" | "testing" | "planned" | string`, `visual: string` (component key) and optional `link: {label, href}`. Export `featureBlocks`, `alsoInThere`, `roadmap`, `betaQuotes`, `pricing`, `quickAnswers`. Copy verbatim; keep the em dashes and smart quotes.

## Mockups

All new visuals are **real HTML/CSS**, in `components/mockups/`, styles appended to `mockups.module.css`. Build them on `PhoneShell` where they're phone-shaped (blocks 1, 3, 4, 7) and on a plain glass card otherwise (2, 5, 6, 8). Each one: `role="img"` + descriptive `aria-label` on the frame, everything inside `aria-hidden="true"`. Numerals 800 weight, tabular where columns align. No screenshots, no image files.

## Responsive

Per BUILD-SPEC §4: feature rows two-up ≥1100px alternating, single column below with copy above visual; roadmap 3→1; hero pills wrap; mockups `min(<w>px, 90vw)`.

## SEO

`metadata`: title `Features`, the description from BUILD-SPEC §6, canonical `/features`. `FAQPage` JSON-LD from the quick answers. Add to `app/sitemap.ts` at priority 0.9.

## Acceptance checks

- Eight feature blocks, alternating, each with a working mockup — none empty, none an `<img>`
- All copy matches the reference exactly (spot-check three checklist lines and the roadmap items)
- Roadmap reads honestly — "in testing" and "not built" items are not styled to look shipped
- Accordion keyboard-operable; `faq_open` fires once per open
- No muted text below `rgba(255,255,255,.5)`
- 320px: no horizontal scroll, no mockup wider than the viewport
- `npm run lint && npm run typecheck && npm run build` pass
