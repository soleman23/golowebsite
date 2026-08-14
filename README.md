# Handoff: golo.golf — nine new pages

## Start here (2 minutes)

1. Clone the repo and copy this whole folder into its root **renamed `design_handoff/`** — every prompt refers to paths like `design_handoff/reference/…`:
   ```bash
   git clone https://github.com/soleman23/golowebsite.git && cd golowebsite
   cp -r ~/Downloads/design_handoff_site_pages ./design_handoff
   cp design_handoff/for-repo/CLAUDE.md ./CLAUDE.md      # house rules Claude Code reads every session
   echo "design_handoff/" >> .gitignore                  # optional — keeps the zip out of the repo
   npm install && npm run dev
   ```
2. Open `design_handoff/reference/Golo Golf - Features.dc.html` in a browser — the designs run standalone, no build step.
3. Read `BUILD-SPEC.md` once. Then paste `prompts/00-foundation.md` into Claude Code and work through the prompts in order, one per session.

One prompt per session, and let each one build clean before starting the next — the prompts assume the previous step landed.

## Overview
golo.golf is currently **one long landing page** plus `/contact` and `/privacy`. This package turns nine designed pages into real routes on that site, and repoints the nav at them. The home page keeps its existing sections as teasers.

**Target repo:** `soleman23/golowebsite` (branch `main`)
**Stack (verified in repo, do not re-guess):** Next.js 15.5 App Router · React 18 · TypeScript · **CSS Modules** (no Tailwind) · Prisma + Postgres (Supabase) · zod · GA4 via `next/script` · PM2 + Nginx on a Hostinger VPS.

## About the design files
`reference/*.dc.html` are **design references** — HTML prototypes showing intended look, copy and behavior. They are **not production code to copy**. Each one opens directly in a browser (double-click) and carries every exact value as an inline style, so use them as the source of truth for color, size, spacing and copy.

Your job is to **recreate them in the existing Next.js app using its established patterns**: CSS Modules per component, tokens from `app/globals.css`, content data in `lib/`, `@/` import alias. Do not introduce Tailwind, styled-components, a UI library, or a second styling system.

## Fidelity
**High-fidelity.** Final colors, type, spacing and copy. Recreate pixel-close at desktop and follow `BUILD-SPEC.md` §4 for breakpoints. The one deliberate deviation: **muted text** — several prototypes use `rgba(255,255,255,.4)`, which fails WCAG AA on `#0a0d10`. Use the repo's `--text-muted` (.5) or `--text-faint` (.55) instead. Never go below .5.

## Routes to add

| Route | Page | Reference file | Status |
|---|---|---|---|
| `/features` | Features | `Golo Golf - Features.dc.html` | new |
| `/games` | Games index | `Golo Golf - Games.dc.html` | new |
| `/games/nassau` | Game detail | `Golo Golf - Game Nassau.dc.html` | new (dynamic route, 1 entry) |
| `/faq` | FAQ | `Golo Golf - FAQ.dc.html` | new (home keeps its short FAQ) |
| `/contact` | Contact | `Golo Golf - Contact.dc.html` | **exists — rebuild** |
| `/blog` | Blog index | `Golo Golf - Blog.dc.html` | new |
| `/blog/who-pays-first` | Blog post | `Golo Golf - Blog Post Who Pays First.dc.html` | new |
| `/privacy` | Privacy Policy | `Golo Golf - Legal Privacy.dc.html` | **exists — re-present only, keep legal copy** |
| `/terms` | Terms of Service | `Golo Golf - Legal Terms.dc.html` | new — **needs legal sign-off before ship** |

## Nav & footer changes
Nav becomes: **Features · Games · How it works · Blog · FAQ · Contact** + `Get the app` pill.
`How it works` stays an anchor (`/#how`) — that section lives on home only.

Home keeps `#features`, `#games`, `#how`, `#faq` sections **and their ids** (old `/#features` links must keep working), each gaining a "See all …" link to its new full page.

Footer grows from three columns to four — Product / Games / Legal / Company — per the prototypes.

Both live in `lib/content.ts` (`navLinks`, `footerLinks`). Edit the data, not the components.

## Build order
Run the prompts in `prompts/` in order. Each is self-contained and ends with acceptance checks.

1. `00-foundation.md` — routes, nav/footer data, content-module split, shared components, tokens
2. `01-features.md`
3. `02-games.md`
4. `03-game-nassau.md`
5. `04-faq.md`
6. `05-contact.md` (touches API + Prisma)
7. `06-blog.md` (touches API + Prisma)
8. `07-blog-post.md`
9. `08-privacy-terms.md`
10. `09-polish-launch.md` — sitemap, robots, redirects, JSON-LD, analytics, a11y, Lighthouse

Ship in that order; each step should build clean (`npm run lint && npm run typecheck && npm run build`) before you move on.

## Decisions to confirm before building
These are real conflicts between the prototypes and what's live. Ask, don't guess.

1. **Support email.** Prototypes use `support@gologolf.app`; the live site and `/privacy` use `info@golo.golf`. Pick one and use it everywhere.
2. **Launch posture.** The new pages say "not live yet · in beta · no App Store link." The live home page shows App Store / Google Play buttons. Either soften the new pages or gate the store buttons behind a flag — the site can't say both.
3. **Terms of Service.** The prototype's terms copy is *design copy*. It needs a lawyer's read before `/terms` goes public. `/privacy` is the opposite case: the repo's existing legal text is authoritative — keep it verbatim and only change the presentation.
4. **Blog depth.** The blog index design lists eight posts; one is written. Ship with one live card and the rest hidden, or commission the other seven?
5. **Game detail depth.** Only Nassau is designed. The other seven game cards need a destination — stub pages, or link them all to `/games` sections until written?
6. **Roadmap / testimonials / beta-pricing blocks** on `/features`: keep always-on, or put behind `siteConfig` flags like `showStats`?
7. **`/delete-account`** is referenced in FAQ and contact copy but doesn't exist. In scope?

## Definition of done
- All nine routes render, are linked from nav/footer, and pass `npm run lint`, `npm run typecheck`, `npm run build`
- No route regresses the home page's LCP; new photo heroes use `next/image` or a preload (see `BUILD-SPEC.md` §5)
- Every interactive element is keyboard-reachable with a visible focus ring
- `sitemap.xml` lists all nine; `robots.txt` unchanged in policy
- Lighthouse mobile: Performance ≥ 85, Accessibility 100 on `/features` and `/blog/who-pays-first`

## Files in this package
```
README.md                  this file
BUILD-SPEC.md              tokens, components, data layer, responsive, SEO/analytics/a11y
for-repo/CLAUDE.md         drop into the repo root so Claude Code keeps the house rules
prompts/00…09              copy-paste prompts, one per step
reference/*.dc.html        the nine designs + design system + blog template
reference/assets/          the three course photos the designs use
reference/support.js       runtime the .dc.html files load (keep alongside them)
reference/image-slot.js    image placeholder component used by the blog designs
```

The reference designs are the pixel source of truth: every value is an inline style, so read them rather than eyeballing a screenshot. `reference/Golo Golf - Design System.dc.html` renders the whole token set, type scale and component library live — open it when a value is ambiguous.

## Still needed from the team
- **Five photos** for the blog: one post hero, one inline shot, three keep-reading card images. Until they arrive the pages render without them (spec'd in prompts 06 and 07) — nothing breaks, but the blog looks thin.
- **Three app screenshots** if you'd rather show real UI than the CSS mockups on `/features` (the mockups are built to ship as-is).
- Answers to the seven decisions above.
