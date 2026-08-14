# Prompt 00 — Foundation

Paste into Claude Code at the repo root. Do this before any page work.

---

You're extending the GoLo marketing site (`soleman23/golowebsite`) from one landing page to nine real routes. Read `CLAUDE.md`, `design_handoff/BUILD-SPEC.md`, `app/globals.css`, `lib/content.ts`, `components/layout/Nav.tsx` and `components/layout/Footer.tsx` before writing anything.

This step builds **only the foundation** — no page content yet. Do not touch `app/page.tsx` sections beyond what's listed.

## 1. Split the content layer

Convert `lib/content.ts` into `lib/content/` as described in BUILD-SPEC §3, with `lib/content/index.ts` re-exporting everything so existing imports of `@/lib/content` keep compiling. Move today's exports into `lib/content/home.ts` and `lib/content/nav.ts` unchanged. Create empty-but-typed stubs for `features.ts`, `games.ts`, `gameDetail.ts`, `faq.ts`, `blog.ts`, `legal.ts`.

## 2. Route skeletons

Create these with a minimal server component that renders `<PageHero>` and nothing else, so navigation works end to end before content lands:

```
app/features/page.tsx
app/games/page.tsx
app/games/[slug]/page.tsx        // generateStaticParams from lib/content/games.ts
app/faq/page.tsx
app/blog/page.tsx
app/blog/[slug]/page.tsx         // generateStaticParams from lib/content/blog.ts
app/(content)/terms/page.tsx     // reuse the (content) route group + content.module.css
```

`/contact` and `/privacy` already exist — leave them alone in this step. `[slug]` routes must return `notFound()` for unknown slugs.

## 3. Nav and footer

In `lib/content/nav.ts`:

```ts
export const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Games", href: "/games" },
  { label: "How it works", href: "/#how" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];
```

Six links plus the CTA is tight at 1100–1300px — reduce the desktop link gap from 28px to 22px and let the row shrink before the drawer takes over at 760px. Don't change the drawer breakpoint.

Footer grows to four columns; extend `footerLinks` and the `columns` array in `Footer.tsx`:

- **PRODUCT** — Features `/features`, How it works `/#how`, Download `/#get`
- **GAMES** — All games `/games`, Nassau `/games/nassau`, Skins `/games#skins`
- **LEGAL** — Terms of Service `/terms`, Privacy Policy `/privacy`
- **COMPANY** — Blog `/blog`, FAQ `/faq`, Contact `/contact`, Support `mailto:<the confirmed support address>`

Footer must stay a 4-up grid at wide, 2×2 at mid, stacked at narrow.

## 4. Home page teasers

The home page keeps every existing section **and its id** (`#features`, `#games`, `#how`, `#faq`, `#get`) — inbound `/#features` links must keep working. Add one link at the end of three sections, styled like the existing "See every format →" lime text link:

- Features section → `See everything GoLo does →` to `/features`
- Games section → `Browse all 8 games →` to `/games`
- FAQ section → `Read the full FAQ →` to `/faq`

Nothing else on the home page changes.

## 5. Shared components

Create, in `components/ui/`, following the repo's existing component + `.module.css` pattern and taking their visual values from `design_handoff/reference/Golo Golf - Features.dc.html`:

- `PageHero` — props: `kicker`, `title`, `lead?`, `breadcrumbs?`, `status?` (StatusPill props), `ctas?` ({label, href, variant: "primary"|"ghost"}[]), `meta?` (small text row), `visual?` (ReactNode). Renders the single `<h1>`.
- `Breadcrumbs` — `<nav aria-label="Breadcrumb"><ol>`, `/` separators, last item `aria-current="page"`, plus a `BreadcrumbList` JSON-LD emitted server-side.
- `StatusPill` — variants `today` (lime tint + lime text), `testing` (yellow `--secondary-yellow` tint), `planned` (neutral glass). 11px/800/1.4px uppercase.
- `CheckList` — lime circled check + `<strong>lead</strong> — rest`. Extract the markup currently inside `FeatureRow` and have `FeatureRow` use it.
- `Accordion` / `AccordionItem` — generalize `components/sections/FAQ.tsx`'s disclosure (button in a heading, `aria-expanded`, `aria-controls`, panel `role="region"`, max-height transition). Props: `items`, `defaultOpen`, `onOpen?` (for the `faq_open` event), `headingLevel`. Refactor the existing home FAQ to use it — behavior must not change.
- `ChipFilter` — `items: {id,label,count?}[]`, `value`, `onChange`, `aria-pressed`, horizontal scroll with snap ≤760px, 44px tap height.
- `CalloutCard` — lime-tint glass card, optional title, children.

Add the three new tokens from BUILD-SPEC §1 to `app/globals.css`.

Add any missing glyphs to `components/ui/Icon.tsx` as new `IconName` values (the new pages need: `press`, `stack`, `auto`, `grid`, `clock`, `shield`, `chat`, `share`, `mail`, `instagram`, `arrowRight`, `warn`). Keep them single-path, `currentColor`, 24×24 viewBox like the existing ones.

## 6. Analytics + config

Extend the `AnalyticsEvent` union in `lib/analytics.ts` with `faq_open`, `game_filter`, `blog_filter`, `newsletter_signup`, `newsletter_error`, `share_click`, `cta_click`. No other change to that file.

## Acceptance checks

- `npm run lint && npm run typecheck && npm run build` all pass
- Every nav and footer link resolves — no 404s
- `/#features`, `/#games`, `/#how`, `/#faq`, `/#get` still scroll to the right home sections
- Home FAQ still opens/closes exactly as before after the `Accordion` refactor
- Nav fits on one row at 1100px without wrapping; drawer still appears at 760px
- `/games/not-a-game` and `/blog/not-a-post` return the 404 page
