# golowebsite — house rules for Claude Code

Marketing site for GoLo, the golf-betting scorekeeper. Next.js 15 App Router · React 18 · TypeScript · CSS Modules · Prisma/Postgres.

## Non-negotiables

- **CSS Modules only.** No Tailwind, no styled-components, no CSS-in-JS, no UI library. One `.module.css` beside each component.
- **Tokens live in `app/globals.css` `:root`.** Use `var(--…)`; never hardcode a hex or an rgba tint that a token already covers. New token → add it there, once.
- **Copy lives in `lib/content/`**, typed, not inline in JSX. Components stay thin.
- **`@/` alias** for all internal imports.
- **Server components by default.** `"use client"` only on the leaf that owns state.
- **No `backdrop-filter` on sticky or fixed elements.** It triggers a Chromium compositing bug that blanks this page on scroll. Use a near-opaque background (`--nav-bg` pattern).
- **Photos go through the `image-set` classes** in globals.css (`.golo-bd-*`, `.golo-bd-mock-*`) or `next/image`. Never a raw multi-MB PNG background.
- **New analytics event?** Add it to the `AnalyticsEvent` union in `lib/analytics.ts` first. Never send PII as an event param.
- **Never commit secrets.** Anything `NEXT_PUBLIC_*` ships to the browser.

## Before you say you're done

```bash
npm run lint && npm run typecheck && npm run build
```

All three must pass. Then check the page at 320px, 760px, 1100px and 1440px, and tab through every interactive element looking for the lime focus ring.

## Visual language

Dark (`#0a0d10`) with frosted-glass surfaces, one lime accent (`#d4f23a`), heavy type (800 for anything structural), oversized numerals in mockups, course photography under a dark scrim. Lower/lime = better score; rose `#fb7185` = over par or money lost.

Muted text never goes below `rgba(255,255,255,.5)` on the page background or `.55` on the footer — below that it fails WCAG AA.

## Content voice

Written for people who actually keep score: plain, dry, specific. Real dollar amounts and hole numbers over adjectives. No hype, no emoji, no exclamation marks. Where the app isn't finished, the copy says so.

## Structure

```
app/            App Router. (content) route group = text pages. api/ = route handlers.
components/     layout/ · sections/ · ui/ · mockups/
lib/            content/ (copy data) · siteConfig · analytics · db · email · sms · validation
public/images/  backdrops, in 640/960/1600 avif+webp+png tiers
```
