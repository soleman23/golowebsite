# Prompt 09 — Polish & launch

Run this after all nine pages are built. It's the pass that makes the set feel like one site.

---

## 1. Sitemap & robots

Rewrite `app/sitemap.ts` to generate from data, not a hand-written list:

- static: `/`, `/features`, `/games`, `/faq`, `/contact`, `/privacy` (+ `/terms` once approved)
- dynamic: every `hasDetailPage` game → `/games/<slug>`; every `published` post → `/blog/<slug>`
- priorities per BUILD-SPEC §6; `lastModified` from post/section dates where they exist, `new Date()` otherwise

`app/robots.ts` policy stays as-is (allow all + sitemap). If `/terms` isn't approved, make sure it's excluded from the sitemap and carries `index: false`.

## 2. Redirects

Add `redirects()` to `next.config.mjs`, all `permanent: true`:

```
/privacy-policy      → /privacy
/terms-of-service    → /terms
/tos                 → /terms
/faqs                → /faq
/game/nassau         → /games/nassau
/games/nassau-explained → /games/nassau
/blog/who-pays       → /blog/who-pays-first
```

Note for the record: `/#features`-style links can't be redirected server-side (fragments never reach the server) — they keep working because the home page keeps its section ids. Verify that's still true after all the section edits.

## 3. Structured data audit

One JSON-LD block per page, server-rendered, no duplicates:

- home → `SoftwareApplication` (+ `Organization` with logo)
- `/faq` → `FAQPage` with **every** question
- `/features` → `FAQPage` for its quick answers only
- `/games/nassau` → `HowTo` (or `Article`) + `FAQPage`
- `/blog` → `Blog` + `ItemList`
- `/blog/*` → `Article`
- every page with breadcrumbs → `BreadcrumbList`

Validate each with Google's Rich Results Test. Two `FAQPage` blocks on one page, or the same Q/A in `FAQPage` on two pages, is a demotion risk — keep `/contact`'s six questions out of schema.

## 4. Analytics verification

With `NEXT_PUBLIC_GA_ID` set in a preview build, confirm each event fires exactly once with the right params: `cta_click`, `store_button_click`, `faq_open`, `game_filter`, `blog_filter`, `newsletter_signup`, `newsletter_error`, `share_click`, `contact_submit`. Check GA4 DebugView. **No names, emails or phone numbers in any param.**

## 5. Cross-page consistency sweep

Walk all nine pages side by side and fix drift:

- One `<h1>` per page; kicker/H2/H3 sizes identical across pages (they should all come from shared components)
- Section vertical rhythm is `--section-y` everywhere — no page with hand-tuned padding
- Every closing CTA uses `FinalCTA`; every hero uses `PageHero`
- Card radii: section 24 / card 18 / tile 14 — no strays
- The support email is the **same address on every page** (README decision #1)
- The launch posture is consistent: if the pages say "not live yet," the store buttons are gated the same way everywhere (decision #2)
- Nav highlights the current section — add an `aria-current="page"` + lime treatment to the active nav link, matched on pathname prefix (`/games/nassau` highlights Games)
- No `href="#"` and no dead links anywhere: `grep -rn 'href="#"' app components`

## 6. Accessibility pass

- Tab through every page: visible lime focus ring on every stop, logical order, skip link still first
- Screen-reader spot check: breadcrumbs, accordions, filter chips, form errors, mockup `aria-label`s
- Contrast check every muted text color against its actual background (≥.5 on page, ≥.55 on footer)
- Zoom to 200% at 1280px: nothing clipped, no horizontal scroll
- 320px width: no horizontal scroll on any page
- `prefers-reduced-motion`: no float, no pulse, instant transitions

## 7. Performance

Lighthouse mobile on `/features`, `/blog/who-pays-first`, `/games`:

- Performance ≥ 85, Accessibility 100, Best Practices ≥ 95, SEO 100
- LCP element is the hero photo or H1 — never a mockup
- No raw PNG backdrop requests; every photo comes through `image-set` or `next/image`
- Client bundle: confirm the page shells are server components and only filter/accordion/form leaves are `"use client"`

## 8. Ship

```bash
npm run lint && npm run typecheck && npm run build
```

Then deploy per the README's VPS flow (`npm run deploy` on the box, or push to `main` if the GitHub Action is wired). After deploy: hit `/api/health`, click every nav and footer link on production, submit the contact form once and confirm the row lands in Postgres and the notification email arrives.

Finally, update the repo `README.md` "Project structure" section with the new routes and the `lib/content/` split, and note the new `NewsletterLead` model in the database section.
