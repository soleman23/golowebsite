# Handoff: GoLo Golf — Marketing Landing Page

## Overview
This is the public marketing website landing page for **GoLo**, a golf-betting scorekeeper
app ("Bet it. Track it. Settle it."). It's a single long-scroll page that sells the app and
drives App Store / Google Play downloads. GoLo tracks side-games (Skins, Nassau, Wolf, etc.)
during a round, does the handicap math live, and nets everyone into the fewest possible
payments at the end. The page's job is to communicate that promise and get the download.

This will be the **website for the app** — a standalone marketing site, built in
**Next.js / React**.

---

## About the Design Files
The files in `design-reference/` are a **design reference created in HTML** — a prototype
showing the intended look and behavior. **They are not production code to copy directly.**

The prototype is authored as a "Design Component" (`.dc.html`) — a proprietary HTML format
with a custom template runtime (`support.js`), `{{ }}` template holes, `<sc-for>`/`<sc-if>`
control-flow tags, and a `class Component extends DCLogic` logic block at the bottom. **Do not
try to run or port that runtime.** Read it purely as a spec for markup, styling, copy, and
data. Your task is to **recreate this design in a Next.js/React codebase** using its
established patterns (components, CSS solution, image handling) — not to ship the HTML.

Open `design-reference/Golo Golf - Landing Page.dc.html` in a text editor to read exact
markup/inline styles, and see `screenshots/` for the rendered result.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and layout. Recreate the UI
pixel-accurately using the codebase's chosen styling approach (CSS Modules, Tailwind,
styled-components — whatever the project standardizes on). All measurements below are the
source of truth. Every color is an exact hex/rgba value.

---

## Tech translation notes (Next.js / React)
- **Component structure:** Split into section components — `<Nav>`, `<Hero>`, `<StatsBand>`,
  `<Features>` (with a reusable `<FeatureRow>`), `<GamesGrid>`, `<HowItWorks>`,
  `<Testimonials>`, `<FinalCTA>`, `<FAQ>`, `<Footer>`. Repeated items (game cards, FAQ items,
  leaderboard rows) map to `.map()` over data arrays — the prototype already holds that data
  in its logic block; copy the arrays out (see **Data Arrays** below).
- **Images:** Use `next/image`. The three background photos live in
  `design-reference/assets/` — move them to `public/` (or `/public/images/`). They are
  **placeholders** — swappable for the client's own course photography at the same aspect
  crops. See **Assets**.
- **Icons:** All icons are inline SVG `<path>` strings defined in the `ICONS` map in the logic
  block. Copy those path strings into a React icon component (`<Icon name="trophy" />`) or
  individual SVG components. They're single-path, `viewBox="0 0 24 24"`, `fill="currentColor"`.
- **The lime accent** (`#d4f23a`) is the single brand accent and appears everywhere. Define it
  as one token/CSS variable and derive translucent tints from it (the prototype uses a
  `hexA(hex, alpha)` helper — replicate as a util or precompute the rgba values listed below).
- **Fonts:** System UI stack only — **no web font**. See Typography.
- **Interactivity:** Per direction, **document behavior only — wire nothing** this pass. Build
  the FAQ accordion, phone input, and store buttons as static/visual; hooks noted in
  **Interactions & Behavior** are for a later pass.

---

## Design Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| Page background | `#0a0d10` | Body + most sections |
| Footer background | `#070a0c` | Footer only |
| Accent (lime) | `#d4f23a` | The one brand accent — CTAs, kickers, highlights, numerals |
| Accent ink | `#13250a` | Text/icons **on** the lime accent |
| Accent glow | `rgba(212,242,58,0.42)` | Radial glows, shadows behind CTAs |
| Accent soft | `rgba(212,242,58,0.14)` | Icon-chip fills, pill backgrounds |
| Accent border | `rgba(212,242,58,0.40)` | Borders on accented cards/chips |
| Text primary | `#ffffff` | Headings, key copy |
| Text secondary | `rgba(255,255,255,0.66)` | Body paragraphs |
| Text muted | `rgba(255,255,255,0.5)` | Sub-labels, captions |
| Text faint | `rgba(255,255,255,0.4)` | Footer legal, finest text |
| Glass surface | `rgba(20,28,24,0.5)` + `backdrop-filter: blur(18–20px)` | Cards, phone panels |
| Glass chrome | `rgba(255,255,255,0.13)` + `blur(10px)` | Pills, small controls |
| Card border | `rgba(255,255,255,0.12–0.13)` | Default card/section borders |
| Hairline border | `rgba(255,255,255,0.07–0.08)` | Section dividers, nav border |
| Nav background | `rgba(10,13,16,0.72)` + `blur(18px)` | Sticky nav |

**Player avatar palette** (assigned in join order): `#2dd4bf` `#60a5fa` `#fb923c` `#c084fc`
`#f472b6` `#facc15`.
**Semantic:** positive `#bef264`, negative/loss `#fb7185`, secondary accent yellow `#facc15`,
blue `#60a5fa`.

### Typography
Font family (everywhere): `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
Weights run heavy — **800** for all structural text (headings, labels, numerals, buttons),
**700** for sub-text, **600** for muted body.

| Role | Size | Weight | Tracking / notes |
|---|---|---|---|
| Hero H1 | `clamp(44px, 7vw, 82px)` | 800 | `line-height:.96; letter-spacing:-.025em; text-wrap:balance` |
| Section H2 | `clamp(32px, 4.5vw, 52px)` | 800 | `line-height:1.04; letter-spacing:-.02em` |
| Final-CTA H2 | `clamp(36px, 6vw, 68px)` | 800 | `line-height:1; letter-spacing:-.025em` |
| Feature H3 | `clamp(26px, 3vw, 38px)` | 800 | `line-height:1.08; letter-spacing:-.02em` |
| Kicker / eyebrow | `12px` | 800 | `letter-spacing:2.5px`, color = accent, UPPERCASE |
| Small label | `10–11px` | 800 | `letter-spacing:1.2–2px`, UPPERCASE |
| Body / lead | `clamp(16px, 1.5vw, 19px)` | 600 | `line-height:1.6`, secondary color |
| Feature bullet | `15px` | 600 (700 on `<strong>`) | `line-height:1.5` |
| Nav links | `14px` | 700 | secondary color |
| Buttons | `14–15px` | 800 | — |
| Big display numerals (stats/phones) | `30–96px` | 800 | tight negative tracking |

### Spacing / Shape
- **Section vertical padding:** `clamp(56px, 8vw, 110px)` top/bottom (hero and final-CTA run larger).
- **Horizontal gutter:** `clamp(18px, 4vw, 46px)`.
- **Content max-width:** `1200px` centered (`820–840px` for FAQ and final-CTA).
- **Radii:** pill `9999px`; cards/sections `16–24px`; phone screens `40–42px`; small
  chips/controls `9–15px`; icon tiles `12–13px`.
- **Shadows:** CTA lift `0 12–14px 30–34px rgba(0,0,0,.4)`; phone mockups
  `0 40–50px 80–90px -28px rgba(0,0,0,.8)`; accent glow behind CTAs uses the accent-glow color
  with `filter: blur(40–50px)`.
- **Glass recipe (reuse everywhere):** `background: rgba(20,28,24,.5); backdrop-filter:
  blur(18px); border: 1px solid rgba(255,255,255,.12)`.

---

## Screens / Views
Single page, top to bottom. IDs are the anchor targets used by the nav.

### 1. Nav (`sticky`, `top:0`, `z-index:100`)
- **Layout:** Full-width flex row, space-between, `padding: 14px clamp(18px,4vw,46px)`.
  Background `rgba(10,13,16,.72)` + `blur(18px)`, bottom border `rgba(255,255,255,.08)`.
- **Left:** Logo lockup — a 38×38 rounded (`11px`) tile (`#0c0f12`, subtle border, lime glow
  shadow) holding the GoLo mark SVG, followed by wordmark "**Go**" (white) + "**Lo**" (lime),
  21px/800.
- **Right:** Link group ("Features", "Games", "How it works", "FAQ") 14px/700 secondary, gap
  28px; then a **"Get the app"** pill button — 42px tall, `padding:0 20px`, radius 11px,
  background = accent, text = accent-ink, box-shadow accent-glow.
- The GoLo mark SVG (reuse in nav + footer): see `design-reference` — it's a lime "G" arc + a
  white golf ball + a lime flagstick with white pennant, `viewBox="0 0 120 124"`.

### 2. Hero (`#top`)
- **Layout:** Relative section. Full-bleed background image (**sunset.png** by default),
  `background-size:cover; background-position:50% 52%`, over a top-to-bottom dark scrim
  `linear-gradient(180deg, rgba(8,12,9,.72) 0%, rgba(8,12,9,.6) 38%, rgba(6,11,8,.86) 100%)`,
  plus a blurred lime radial glow top-left. Content max-width 1200px, two-column flex that
  wraps: copy column `flex:1 1 460px`, phone column `flex:0 0 auto`.
- **Copy column:**
  - Live pill: glass-chrome pill, pulsing lime dot (see animation), text
    "THE SCOREKEEPER THAT SETTLES THE BET" 12px/800 lime, `letter-spacing:2px`.
  - **H1:** "Bet it." / "Track it." / "**Settle it.**" (last line lime) — three lines via `<br>`.
  - Lead paragraph (secondary): *"Skins, Nassau, the press on the back nine — GoLo runs every
    side-game, does the math you hate, and tells everyone **exactly who owes who** before you
    hit the parking lot."*
  - **Store buttons** (App Store + Google Play): white pills, 58px tall, radius 15px, each with
    brand glyph SVG + two-line label ("Download on the" / "App Store"). App Store glyph is a
    black Apple; Google Play glyph is the 4-color triangle. Content black `#0a0d10`.
  - **"or text me the link:"** row — glass input with placeholder `(555) 012-3456`
    (`inputmode="tel"`) + lime **"Send"** button. On send, a lime confirmation
    "Link sent — check your messages" appears (see Interactions).
- **Hero phone mockup (right):** 300×610 device, radius 42px, course.png background + scrim.
  It's a **live leaderboard** mock containing, top to bottom:
  - LIVE pill (pulsing dot, "LIVE · Pinehurst No.2") + "Skins · Nassau" label.
  - "THROUGH **12** / 18" big numeral + "6 to play / on hole 13".
  - 18-segment hole progress bar (played holes lime, current white, remaining faint).
  - Net / Gross / Money segmented control (Net active = lime fill).
  - "▲ LEADING · NET" spotlight card: orange "T" avatar (lime ring), "Tom / Gross 71 · Hdcp 5",
    big lime "−4 / TO PAR".
  - Leaderboard rows (pos, avatar, name, score) — Mike (has a lime "YOU" badge), Sarah, Dave.
  - "Skins pot / 2-hole carry live" money chip with lime "$120".
  - Whole phone gently floats (see animation).

### 3. Stats band (toggleable — `showStats`, default on)
- **Layout:** Full-width, hairline top+bottom borders, `#0a0d10`. Auto-fit grid,
  `minmax(180px,1fr)`, gap `clamp(20px,3vw,40px)`.
- **4 stats** (big numeral `clamp(34px,4vw,46px)`/800 + bold label + muted sub):
  - **8** — "games scored automatically" / "Skins, Nassau, Wolf & more" (numeral is lime).
  - **&lt;30s** — "from last putt to settled" / "while you're still on the green".
  - **0** — "arguments about who won 14" / "the app keeps the receipts".
  - **100%** — "of debts, remembered" / "no more 'I'll get you next time'".

### 4. Features (`#features`)
Header kicker "WHAT GOLO DOES" + H2 "Three taps to score. Zero math to settle." Then **three
alternating feature rows** (two-column flex, wraps on mobile). Each row = copy column + visual.
Copy column has: a pill badge (icon + label), an H3, a lead paragraph, and a 3-item checklist
(lime circled-check icon + bold lead-in + rest).

- **Feature 1 — IMMERSIVE SCORING**, icon `card`. H3 "**Tap in scores, not spreadsheets.**"
  Visual on the right = **scoring phone** (288×580, turf.png bg): back/forward hole nav
  ("HOLE 7 / Par 3 · 168y · SI 15"), giant "**7**" numeral, active-player card (teal "M" Mike,
  "+1 stroke · net 2", −/score 3/+ stepper with lime +), then three compact player rows
  (Sarah, Tom, Dave — net + gross), and an 18-segment progress bar at the bottom.
  Checklist: "Handicap strokes, auto-applied…", "Net & gross at once…", "Built for a foursome…".
- **Feature 2 — LIVE LEADERBOARD**, icon `trophy`. H3 "**Talk your trash — with receipts.**"
  Visual on the **left** (row is `justify-content:flex-end`) = **"MONEY ON THE LINE" card**
  (course.png bg): four rows — Skins ($120, in the pot), Nassau · Front (Tom 2 up, "closed"),
  Stroke Purse ($80, winner takes), Closest to Pin (Sarah · hole 7, $20). Each row = colored
  icon tile + title + who + right-aligned value/tag.
  Checklist: "Net · Gross · Money…", "Live skins & carries…", "Movement arrows…".
- **Feature 3 — AUTO SETTLE-UP**, icon `swap`. H3 "**The math is done before the handshake.**"
  Visual on the right = **settle-up phone** (288×580, course.png bg): "FINAL · NET STROKE" +
  Pinehurst pill, "Settle Up" title, hero result card ("MIKE · 1ST OF 4 · YOU COLLECTED",
  big lime "**+$85**", "76 gross · 68 net"), then "WHO PAYS WHOM" transfer rows (from-avatar →
  to-avatar, amount, "Mark paid" / "✓ Paid" state button — one row shown paid at 0.6 opacity),
  and a footer "↗ Share" + full-width lime "Mark all paid".
  Checklist: "One net number per person…", "Mark paid…", "Drop it in the group chat…".

### 5. Games grid (`#games`)
- Kicker "EVERY GAME YOU ACTUALLY PLAY", H2 "Stack as many games as your group can argue
  about.", lead paragraph.
- **8 game cards** in an auto-fill grid (`minmax(250px,1fr)`, gap 14px). Each card: glass
  surface, radius 18px, `padding:20px` — a 46×46 accent-soft icon tile (lime icon), name
  (18px/800), description (14px secondary). See **Data Arrays → games**.

### 6. How it works (`#how`)
- Full-bleed **sunset.png** background + heavy scrim
  (`linear-gradient(180deg, rgba(8,12,9,.88), rgba(6,11,8,.92))`).
- Kicker "DEAD SIMPLE", H2 "From first tee to settled up in three steps."
- **3 step cards** (auto-fit `minmax(260px,1fr)`, gap 20px), glass + blur, radius 22px: big
  lime numeral (46px) + accent-soft icon tile, then title + body.
  - 1 · icon `card` · "Set the round" — pick course/tees, add players, stack games.
  - 2 · icon `flame` · "Play & track" — tap scores hole by hole; live leaderboard.
    ⚠️ **Copy fix:** the prototype data has a stray HTML entity (`Play &amp; track`) that
    renders literally — the correct title is **"Play & track"**.
  - 3 · icon `swap` · "Settle up" — nets every game into the fewest transfers.

### 7. Testimonials (toggleable — `showTestimonials`, default on)
- Kicker "THE GROUP CHAT AGREES", H2 "Built for the people who keep score."
- **3 quote cards** (auto-fit `minmax(290px,1fr)`, gap 18px): big lime opening quote mark,
  quote text (17px), then avatar (colored initial) + name + role. See **Data Arrays → quotes**.

### 8. Final CTA (`#get`)
- Radial green background `radial-gradient(120% 100% at 50% 0%, #14532d 0%, #0a2418 55%,
  #070b08 100%)` + blurred lime glow at top. Centered, max-width 840px.
- H2 "Stop doing math in the parking lot.", lead paragraph, the two store buttons again
  (60px tall here), and fine print "Free to download · No card to start · iPhone & Android".

### 9. FAQ (`#faq`)
- Centered kicker "QUESTIONS FROM THE 19TH HOLE" + H2 "Good question." Max-width 820px.
- **6 accordion items**, glass cards radius 16px, gap 10px. Each: full-width button (question
  17px/800 + lime "+" that rotates 45° to "×" when open); answer panel animates open via
  `max-height` transition (`.28s ease`), padding `0 20px 18px`, 15px secondary text.
  **First item open by default.** See **Data Arrays → faqs**.

### 10. Footer
- Background `#070a0c`, hairline top border. Left: logo lockup + tagline "Track it. Bet it.
  Settle it. The scorekeeper that finally settles the bet." Right: three link columns —
  **PRODUCT** (Features / How it works / Download), **GAMES** (Skins / Nassau / Wolf),
  **COMPANY** (FAQ / Privacy / Contact). Bottom bar (hairline top): "© 2026 GoLo Golf. All
  rights reserved." + a friendly-wager disclaimer line.

---

## Interactions & Behavior
Per direction this pass is **document-only — wire nothing**. Build these visually; the notes
below define the eventual behavior.

- **Nav links & footer links:** in-page anchors (`#features`, `#games`, `#how`, `#faq`,
  `#get`). Add `scroll-behavior:smooth` on the html root when wired.
- **FAQ accordion:** clicking a question toggles its answer panel (`max-height` 0 ↔ ~240px,
  `.28s ease`) and rotates the "+" 45°. Single-open or multi-open both fine; prototype allows
  multiple open and starts with item 0 open.
- **"Text me the link" input:** on **Send**, show the lime confirmation "Link sent — check your
  messages" for ~3.2s, then hide. (No real SMS/backend this pass — later it would POST the
  phone number to an SMS service.)
- **Store buttons:** currently `href="#get"`. Replace with real App Store / Google Play URLs
  when available.
- **Animations (define as CSS keyframes):**
  - `goloPulse` — expanding fading ring on the "LIVE" dots. `0%{scale(1);opacity:1}
    70%{scale(2.6);opacity:0} 100%{opacity:0}`, `1.8s ease-out infinite`.
  - `goloFloat` — hero phone bob. `0%,100%{translateY(0)} 50%{translateY(-14px)}`,
    `6s ease-in-out infinite`.
  - FAQ "+" rotation and answer `max-height` transitions as above.

## State Management
Local UI state only (no data fetching):
- `faqOpen` — set/map of which FAQ items are expanded (init `{0: true}`).
- `textSent` — boolean, true briefly after Send to show the confirmation (auto-resets ~3.2s).
- Optional **content flags** exposed as props/config: `showStats` (bool, default true),
  `showTestimonials` (bool, default true), `heroBackdrop` (which background image the hero
  uses — one of the three assets, default sunset), and `accent` (brand accent hex, default
  `#d4f23a`). These were tweakable in the prototype; expose them as component props or site
  config if you want the same flexibility.

## Responsive Behavior
The design is **fluid** — sizes use `clamp()` and layouts use `flex-wrap` / auto-fit grids, so
it adapts continuously rather than at hard breakpoints. Concretely:

- **Desktop (≥ ~1000px):** Two-column hero and feature rows sit side-by-side (copy + phone/
  visual). Games grid shows 3–4 columns; how-it-works and testimonials 3 across; stats band 4
  across. Content capped at 1200px and centered with `clamp(18px,4vw,46px)` gutters.
- **Tablet (~640–1000px):** Feature rows and hero **wrap to stacked** once a column hits its
  `min-width` (~280–300px) — copy above, phone/visual below, centered. Games grid drops to 2
  columns; how-it-works/testimonials to 2; stats band to 2. Padding and type scale down via
  the `clamp()` mid-range.
- **Mobile (< ~640px):** Everything is single-column. Phone mockups center and cap at
  `min(300px, 90vw)`. Grids collapse to 1 column. Headings hit their `clamp()` minimums (e.g.
  hero H1 → 44px). Nav: the prototype keeps the horizontal link row — **for true mobile you
  should add a hamburger/drawer** for the Features/Games/How/FAQ links, keeping the logo and
  "Get the app" button visible. Store-button rows wrap; the "text me the link" row wraps.
- Order control: feature-row copy uses `order:1` and the visual `order:2` so that when stacked,
  **copy always sits above its phone/visual** regardless of left/right desktop placement.

---

## Data Arrays
Copy these out of the prototype's logic block into your data files. (Values verbatim; icons
reference the `ICONS` map — see **Assets → Icons**.)

**games** (8) — `{icon, name, desc}`:
1. `target` · **Skins** · "Low score wins the hole. Ties carry the pot to the next — and the next."
2. `trophy` · **Nassau** · "Three bets in one: front nine, back nine and the overall match."
3. `cash` · **Stroke Purse** · "Everyone buys in; lowest net total over 18 takes the whole pot."
4. `wolf` · **Wolf** · "Rotating captain picks a partner — or goes Lone Wolf for double."
5. `dice` · **Bingo Bango Bongo** · "Points for first on, closest once on, and first in the hole."
6. `pin` · **Closest to Pin** · "Stick it tight on the par 3s and take the side pot."
7. `drive` · **Longest Drive** · "Bomb it down the fairway on the marked hole to collect."
8. `bird` · **Birdies** · "A standing bounty on every birdie — paid by everyone who didn't."

**steps** (3) — `{n, icon, title, body}`:
1. `card` · **Set the round** · "Pick the course and tees, add your players, then stack every game your group wants to play."
2. `flame` · **Play & track** · "Tap in scores hole by hole. The leaderboard updates live — strokes, skins, carries and all."
3. `swap` · **Settle up** · "GoLo nets every game into the fewest transfers. Everyone pays the right person before you leave the green."

**quotes** (3) — `{text, name, role, initial, color}`:
1. "I haven't done press-the-back-nine math in my head since I got this. And somehow I always get paid now." — **Marcus T.**, Plays 3× a week (`M`, `#2dd4bf`)
2. "Forty guys, every Saturday. Used to be a spreadsheet and a headache. Now the league just runs itself." — **Dave R.**, MGA commissioner (`D`, `#fb923c`)
3. "Four days in Scottsdale, six games a day. We settled the entire trip standing on the 18th green." — **Tyler K.**, Annual golf trip (`T`, `#60a5fa`)

**faqs** (6) — `{q, a}` (full answer text is in the prototype logic block; questions):
1. "Does it handle handicaps?"
2. "Which games can I run at once?"
3. "How does the settle-up work?"
4. "Is this real-money gambling?"
5. "Do all four of us need the app?"
6. "What about multi-day trips?"

The in-phone mock data (hero leaderboard rows, scoring rows, money rows, transfer rows) is also
in the logic block if you want the mockups to match the screenshots exactly — but those are
illustrative marketing content, not functional data.

---

## Assets
In `design-reference/assets/` (move to `public/`):
- **sunset.png** — golf course at sunset. Used as the **hero** background and the
  **how-it-works** background.
- **course.png** — green course photo. Used in the hero phone, the leaderboard "money" card,
  and the settle-up phone.
- **turf.png** — close turf texture. Used in the scoring phone.

These are **placeholders** — swap for the client's own course photography at the same crops
(`background-size:cover` with the noted `background-position`). Each photo always sits **under a
dark scrim gradient** (values in the section specs) so foreground text stays legible; keep that
scrim when swapping images.

**Icons:** all UI icons are single-path inline SVGs in the `ICONS` map inside the prototype's
`<script>` logic block (`target, trophy, cash, pin, drive, bird, flame, swap, card, crown,
dice, wolf`), plus a circled-check (`check()` method) and the store glyphs (Apple, Google Play)
inline in the markup. All `viewBox="0 0 24 24"`, `fill="currentColor"` — copy the `d` strings
into React icon components. The **GoLo logo mark** SVG (`viewBox="0 0 120 124"`) is inline in
the nav and footer.

**Fonts:** none to install — system UI stack only.

## Files
- `design-reference/Golo Golf - Landing Page.dc.html` — the full design (markup, inline styles,
  copy, data, icon paths, logic). **The source of truth.**
- `design-reference/support.js` — the prototype runtime. Reference only; **do not port.**
- `design-reference/assets/` — the three background images.
- `screenshots/` — rendered reference: `01–05-desktop.png` (hero, features/scoring,
  how-it-works, final CTA) and `01–02-sections.png` (games grid, FAQ). Use these to check
  color, spacing, and layout fidelity.
