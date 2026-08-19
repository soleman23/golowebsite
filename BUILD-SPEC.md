# Build spec — shared rules for all nine pages

Read this once before the first prompt. Everything here applies to every page.

---

## 1. Design tokens

**All tokens already exist** in `app/globals.css` `:root`. Use them; do not hardcode hex values in new CSS Modules, and do not create a second token file.

Already present and correct:

| Token | Value | Use |
|---|---|---|
| `--page-bg` | `#0a0d10` | page background |
| `--footer-bg` | `#070a0c` | footer |
| `--accent` | `#d4f23a` | the one accent |
| `--accent-ink` | `#13250a` | text on accent |
| `--accent-soft` `--accent-16` `--accent-35` `--accent-45` `--accent-50` `--accent-border` `--accent-glow` | rgba tints | lime tints — use these instead of new rgba() |
| `--text-primary` / `--text-secondary` / `--text-muted` / `--text-faint` | `#fff` / .66 / .5 / .55 | body text |
| `--glass-surface` | `rgba(20,28,24,.5)` | card/sheet fill |
| `--glass-chrome` | `rgba(255,255,255,.13)` | pills, chips, controls |
| `--card-border` `--hairline` | .12 / .08 | borders |
| `--positive` `--negative` `--secondary-yellow` `--blue` | `#bef264` `#fb7185` `#facc15` `#60a5fa` | semantic |
| `--avatar-teal/blue/orange/purple/pink/yellow` | player palette | avatars, in join order |
| `--max-width` | `1200px` | content max width |
| `--gutter` | `clamp(18px,4vw,46px)` | page side padding |
| `--section-y` | `clamp(56px,8vw,110px)` | vertical section rhythm |
| `--radius-pill/-card/-section` | `9999px` / `18px` / `24px` | radii |
| `--shadow-cta` `--shadow-phone` | | shadows |

**Add these three** (the new pages need them, nothing else):

```css
--radius-tile: 14px;          /* small tiles, chips, form fields */
--glass-sheet: rgba(14, 20, 16, 0.9);  /* opaque-ish sheets: TOC rail, sticky sub-nav */
--glass-raised: rgba(20, 28, 24, 0.72); /* card-on-card, one level above --glass-surface */
```

### Type
System stack only (`--font-sans`) — no web fonts, nothing to install. Weights run heavy:

- **Kicker / eyebrow:** 12px · 800 · `letter-spacing: 2.5px` · uppercase · `--accent`
- **Section label:** 11px · 800 · 1.4px · uppercase · `--text-muted`
- **H1:** `clamp(34px, 5.4vw, 60px)` · 800 · `-0.025em` · line-height 1.03 · `text-wrap: balance`
- **H2:** `clamp(28px, 4vw, 44px)` · 800 · `-0.02em` · 1.06
- **H3:** `clamp(20px, 2.2vw, 28px)` · 800 · `-0.015em` · 1.15
- **Lead:** `clamp(16px, 1.5vw, 19px)` · 600 · 1.6 · `--text-secondary`
- **Body:** 16px · 400–600 · 1.7 · `--text-secondary`; long-form prose (blog, legal) 17–18px · 1.75
- **Numerals in mockups:** 800, oversized (28–64px), tabular where they align in columns
- **Buttons / chips:** 14px · 800

Never below 12px anywhere. `text-wrap: pretty` on paragraphs, `balance` on headings.

### Shape
Section card 24px · card 18px · tile/field 14px · small button 10–11px · pill 9999px. Phone mockup frame 40px (matches `PhoneShell` default). Tap targets ≥ 44px.

---

## 2. Components

### Reuse as-is
| Component | Path | Notes |
|---|---|---|
| `Nav` | `components/layout/Nav.tsx` | driven by `navLinks`; drawer at ≤760px. **Don't add `backdrop-filter`** — see §5 |
| `Footer` | `components/layout/Footer.tsx` | needs a 4th column; extend the `columns` array from `footerLinks` |
| `Logo` | `components/ui/Logo.tsx` | |
| `Icon`, `CheckIcon` | `components/ui/Icon.tsx` | add new glyphs here as new `IconName`s — never inline a one-off SVG in a page |
| `SectionHeader` | `components/ui/SectionHeader.tsx` | kicker + H2 + lead; `align`, `headingId`, `maxWidth` |
| `FeatureRow` | `components/ui/FeatureRow.tsx` | alternating copy/visual row — the backbone of `/features` |
| `StoreButtons` | `components/ui/StoreButtons.tsx` | App Store / Play; already fires `store_button_click` |
| `TextMeLink` | `components/ui/TextMeLink.tsx` | phone capture → `/api/text-link` |
| `ContactForm` | `components/ui/ContactForm.tsx` | extend for the topic picker (prompt 05) |
| `PhoneShell` | `components/mockups/PhoneShell.tsx` | frame + photo + scrim; `bg="course"|"turf"`, `label` (a11y), `float` |
| `FinalCTA` | `components/sections/FinalCTA.tsx` | the closing band; parameterize heading/sub/buttons rather than forking |

### New shared components to create
Put page-agnostic ones in `components/ui/`, page-specific sections in `components/sections/<page>/`.

| New | Where | Why |
|---|---|---|
| `PageHero` | `ui/` | breadcrumb + kicker + H1 + lead + status pill + CTA row. Used by all nine pages |
| `Breadcrumbs` | `ui/` | `Home / Blog / Settling up`, with JSON-LD (§6) |
| `StatusPill` | `ui/` | "IN THE APP TODAY" / "IN TESTING" / "ON THE LIST" — three variants |
| `ChipFilter` | `ui/` | filter row with counts, used by `/games` and `/blog`; URL-synced |
| `Accordion` | `ui/` | generalize the existing `sections/FAQ.tsx` disclosure so FAQ, Features quick-answers and Nassau FAQ share it |
| `CheckList` | `ui/` | lime circled-check list with `<strong>` lead-in (currently inside `FeatureRow`) |
| `CalloutCard` | `ui/` | lime-tint callout used in prose + legal "plain English" notes |
| `ProseBlocks` | `ui/blog/` | renders the typed blog block union (§3) |
| `TocRail` | `ui/` | sticky numbered TOC with scroll-spy, for legal pages |
| `RoadmapColumns` | `sections/features/` | the honest three-column today/testing/not-built table |
| `MockCard` family | `mockups/` | new visuals: `SetupPhone`, `PressLadder`, `StrokeGrid`, `SettleCard`, `GameStackCard`, `LockerCard`, `NassauPhone` — all built on `PhoneShell` or a plain glass card |

**Mockups are real HTML/CSS, not images.** Keep them in `components/mockups/` with styles in the shared `mockups.module.css`, mark them `aria-hidden` inside a `role="img"` frame with a descriptive `aria-label` (the pattern `PhoneShell` already uses), and let them scale with `min(<width>px, 90vw)`.

---

## 3. Data layer

`lib/content.ts` is already 8 KB and would triple. Split it into a folder, keeping the existing named exports so nothing breaks:

```
lib/content/
  index.ts        re-exports everything (so `@/lib/content` keeps working)
  nav.ts          navLinks, footerLinks
  home.ts         stats, features, games, steps, quotes, faqs  (today's content.ts)
  features.ts     the 8 feature blocks, roadmap columns, beta pricing, quick answers
  games.ts        the game roster: slug, name, desc, how, players, format, popular
  gameDetail.ts   per-game long-form content, keyed by slug (nassau today)
  faq.ts          categories → questions, with ids for deep links
  blog.ts         posts: slug, category, title, excerpt, date, readMins, hero, body blocks
  legal.ts        section trees for /privacy and /terms
```

Rules: content is **typed data, not JSX**. Copy comes verbatim from the reference files — don't rewrite it, don't "improve" it, keep the smart quotes and em dashes. Where a prototype uses inline `<strong>`/`<em>`, keep the existing `bodyHtml` + `dangerouslySetInnerHTML` pattern already used by `Feature`.

Blog bodies use a discriminated union so prose stays data:

```ts
export type Block =
  | { kind: "p"; html: string }
  | { kind: "h2"; text: string; id: string }
  | { kind: "atAGlance"; items: { label: string; value: string }[] }
  | { kind: "callout"; title: string; html: string }
  | { kind: "quote"; text: string; cite?: string }
  | { kind: "steps"; items: { title: string; body: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "keyStat"; value: string; label: string }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "summary"; title: string; items: string[] };
```

`ProseBlocks` switches over `kind`. Adding a post = adding data, never a new page file.

---

## 4. Responsive spec

Existing breakpoint in the repo: **760px** (nav drawer). Keep it, and use these three for content:

| Name | Query | Meaning |
|---|---|---|
| wide | ≥ 1100px | full two-column layouts, sticky rails visible |
| mid | 761–1099px | two columns collapse to one; rails become horizontal chip rows |
| narrow | ≤ 760px | single column, drawer nav, mockups scale down |

Per pattern:

- **PageHero** — wide: 1200px grid, copy `minmax(0,1fr)` + optional visual `minmax(0,420px)`, gap 56px. mid: stack, visual below copy, hero photo aspect 16/9. narrow: H1 to `clamp(30px,8vw,38px)`, CTA row wraps to full-width stacked buttons (44px min height), status pill wraps.
- **FeatureRow** — wide: two columns `1.05fr / .95fr`, alternating sides, gap 64px, align center. mid/narrow: one column, **copy always above visual** (order rules in CSS, already implemented). Visual centered, `min(288px, 90vw)`.
- **Card grids** (games, blog, related, docs) — wide: `repeat(auto-fill, minmax(300px, 1fr))` capped at 3 columns. mid: 2 columns. narrow: 1 column, gap 14px.
- **Roadmap three columns** — wide: 3 equal columns with hairline dividers. mid: 3 → 1 with each column as its own glass card. narrow: same, headings sticky-free.
- **Chip filter rows** — wide/mid: wrap, gap 10px. narrow: horizontal scroll (`overflow-x:auto; scroll-snap-type: x proximity`), hide the scrollbar, keep 44px tap height.
- **Legal / blog prose** — wide: `minmax(0,270px)` TOC rail + `minmax(0,1fr)` body, rail `position: sticky; top: 96px`. mid: TOC becomes a collapsible chip row above the body. narrow: same, body 17px, `--gutter` sides. Blog post body column: 760px max, centered, no sidebar.
- **Phone mockups** — never exceed `90vw`; below 400px viewport drop the float animation (also killed by `prefers-reduced-motion`).
- **Sticky sub-nav** (legal, long pages) — wide/mid only; hidden ≤ 760px in favor of the TOC chips. `scroll-margin-top: 96–150px` on targets so anchors clear the sticky nav (the prototypes already set this).

Global: no horizontal scroll at 320px. `body` already has `overflow-x: clip`.

---

## 5. Performance rules (these are load-bearing on this site)

1. **The nav must not use `backdrop-filter`.** It's `position: sticky`, and that combination triggers a Chromium compositing bug that blanks the page on scroll. The repo works around it with a near-opaque `--nav-bg`. Any new sticky/fixed surface follows the same rule — opacity, not blur.
2. **Photo backdrops go through the `image-set` classes**, not raw `<img src="*.png">`. `.golo-bd-sunset|course|turf` for full-bleed (640/960/1600 tiers), `.golo-bd-mock-course|turf` for mockups. Raw PNGs cost ~6.9 MB and pushed mobile LCP to 27 s once — don't reintroduce them.
3. **New photo heroes** (blog post, features hero): either use `next/image` with `priority` and real dimensions, or add a new `.golo-bd-*` class **and** a matching preload in `lib/siteConfig.ts` → `heroBackdropPreload`, with `media` queries identical to the CSS. Mismatched media queries double-download.
4. Generate the AVIF/WebP tiers for any new photo at the same 640/960/1600 widths and keep the PNG as the plain-url fallback listed first.
5. Client components only where there's state (filters, accordions, forms). Every page shell stays a server component; put `"use client"` on the leaf.
6. Respect `prefers-reduced-motion` — globals.css already neutralizes animations; don't override it locally.

---

## 6. SEO

Per-page metadata via App Router `export const metadata`. The root layout already sets `metadataBase`, the `%s · GoLo` title template, and default OG/Twitter — so each page exports only what differs.

| Route | Title (before template) | Meta description |
|---|---|---|
| `/features` | Features | Every game scored, every press logged, every debt netted. What GoLo does today — round setup, live scoring, presses, handicaps and auto settle-up. |
| `/games` | Golf Betting Games | Skins, Nassau, Wolf, Bingo Bango Bongo and the junk board — how each game works and how GoLo scores them in one round. |
| `/games/nassau` | Nassau, Explained | Front, back and total, plus the press. How a Nassau works, what a press really costs, and the terms you'll hear on the tee. |
| `/faq` | FAQ | Handicaps, stacking games, settling up and where GoLo is today — answered by the people who built it. |
| `/contact` | Contact | Support, feature requests, course-data fixes and press — every message lands in the inbox we read between rounds. |
| `/blog` | Blog | Game rules written by people who play them, betting etiquette, trip structures, and honest notes from building GoLo. |
| `/blog/who-pays-first` | Who Pays First? The Unwritten Rules of Settling Up | Nine rules for settling a golf bet, ranked by how often groups break them. Rule one: if you lost, you pay, and you pay first. |
| `/privacy` | Privacy Policy | (keep the existing string) |
| `/terms` | Terms of Service | The rules of the road for the GoLo app and golo.golf — written to be read, with a plain-English note beside every section. |

Also: `alternates: { canonical: "/<route>" }` on each; OG title/description mirroring the above; `openGraph.type: "article"` + `publishedTime` on blog posts.

**JSON-LD** (`<script type="application/ld+json">`, one per page, rendered server-side):
- `/faq` and `/features` quick-answers → `FAQPage`
- `/blog/*` → `Article` (headline, datePublished, author `GoLo Golf`, publisher, image)
- `/games/nassau` → `HowTo` for the play steps, or `Article` if that reads cleaner
- home → `SoftwareApplication` (name, operatingSystem `iOS, Android`, applicationCategory `SportsApplication`, offers price 0)
- every page with breadcrumbs → `BreadcrumbList`

**Sitemap** — add all nine to `app/sitemap.ts` with honest `lastModified`: home 1.0, `/features` `/games` 0.9, `/games/nassau` `/blog` 0.8, `/blog/*` 0.7, `/faq` `/contact` 0.6, `/privacy` `/terms` 0.3. Drive it from the content data so new blog posts and game pages appear automatically.

**Redirects.** Hash fragments (`/#features`) never reach the server, so they can't be redirected — instead the home page **keeps its section ids** and those links keep working. What *does* need `redirects()` in `next.config.mjs` (all `permanent: true`):
`/privacy-policy → /privacy`, `/terms-of-service → /terms`, `/tos → /terms`, `/game/nassau → /games/nassau`, `/games/nassau-explained → /games/nassau`, `/faqs → /faq`, `/blog/who-pays → /blog/who-pays-first`.

---

## 7. Analytics

`lib/analytics.ts` exports `track(event, params)` and a **union type of event names** — a new event must be added to `AnalyticsEvent` or TypeScript will reject it. Never pass names, emails or phone numbers as params.

Existing: `generate_lead`, `lead_form_error`, `contact_submit`, `store_button_click`.

Add:

| Event | Params | Fires on |
|---|---|---|
| `faq_open` | `{ page, question_id }` | FAQ / quick-answer disclosure opens (not on close) |
| `game_filter` | `{ filter }` | `/games` chip selected |
| `blog_filter` | `{ category }` | `/blog` chip selected |
| `newsletter_signup` | `{ page }` | newsletter accepted |
| `newsletter_error` | `{ reason }` | `validation` \| `server` |
| `share_click` | `{ post, channel }` | blog share row |
| `cta_click` | `{ page, cta }` | hero + closing CTA buttons (`get_app`, `browse_games`, `ask_us`) |

---

## 8. Accessibility

The repo is already in decent shape (skip link, focus-visible ring, semantic sections, reduced motion). Hold the line:

- One `<h1>` per page, in `PageHero`. Headings descend without skipping.
- Accordions: `<button aria-expanded aria-controls>` inside a heading, panel `role="region" aria-labelledby`. Multiple-open is fine; item 0 opens by default (matches the existing FAQ).
- Filter chips: `role="tablist"`/`tab` only if the panel really is tab content; URL-backed filter links use `aria-current="true"` on the active link, while standalone toggle buttons use `aria-pressed`.
- Mockups: decorative internals `aria-hidden="true"` inside a `role="img"` + `aria-label` frame that says what it shows ("Scorecard for hole 7 showing net scores for four players").
- Forms: real `<label>`s (not placeholders), `aria-invalid` + `aria-describedby` on errors, error text as `role="alert"`, focus moves to the first invalid field on submit.
- Contrast: keep muted text at ≥ .5 on `--page-bg` and ≥ .55 on `--footer-bg`. Lime `#d4f23a` on `#0a0d10` passes; lime on `--glass-chrome` needs the same check before you use it for body text.
- Every icon-only control gets an `aria-label`. Breadcrumb trail is a `<nav aria-label="Breadcrumb">` with `<ol>`.
- Keyboard: no interactive element reachable only by hover; chip rows scroll into view on focus.
