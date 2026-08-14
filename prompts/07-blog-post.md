# Prompt 07 — `/blog/who-pays-first`

**Reference:** `design_handoff/reference/Golo Golf - Blog Post Who Pays First.dc.html`
**Template reference:** `design_handoff/reference/Golo Golf - Blog Post Template.dc.html` — the canonical post layout; every future post reuses it.

---

Build the post **template** at `app/blog/[slug]/page.tsx` and render the one written post from data. The body is a `Block[]` (BUILD-SPEC §3) rendered by `components/ui/blog/ProseBlocks.tsx`. Adding a post must never mean adding a page file.

## Layout, top to bottom

1. **Photo hero** — full-bleed image under a bottom-weighted scrim, with breadcrumbs `Home / Blog / Settling up`, a category pill `BETTING ETIQUETTE`, `5 MIN READ`, the H1 "Who pays first? The unwritten rules of settling up", the dek "Nine rules, ranked by how often your group breaks them. Number one is not negotiable: if you lost, you pay, and you pay first.", and the byline `From the GoLo team · August 11, 2026`.

   Use `next/image` with `priority` and explicit dimensions — this is the LCP element. Keep the scrim so the text stays legible (see BUILD-SPEC §5.3 before adding a new backdrop class).

2. **Body** — one **760px** centered column, no sidebar. 17–18px body, 1.75 line-height, `--text-secondary`, `text-wrap: pretty`. Paragraph spacing 22px. `<strong>` lifts to `--text-primary`.

   Block types this post uses, in order: intro paragraphs → `atAGlance` grid (SETTLING UP AT A GLANCE: who moves first / when / cash or app / the odd dollar) → `h2` "The nine rules, most-violated first" → nine numbered rule sections, each a `steps`-style heading + paragraphs, the first carrying a `BROKEN EVERY SATURDAY` tag → a lime `callout` → a `quote` pull quote → an inline `image` with caption → a closing `summary` box.

   Every `h2`/rule heading gets a stable `id` for deep links, `scroll-margin-top: 96px`.

3. **Share row** — after the body: copy-link button + the channels the team actually wants (text, X, email). Fires `share_click` `{ post, channel }`. Copy-link writes to the clipboard and confirms inline — no toast library.

4. **Keep reading** — three related post cards (reuse the `/blog` card component). Skip unpublished posts; if fewer than three are available, show what exists rather than padding.

5. **Newsletter band** — the same component as `/blog`, `newsletter_signup` param `{ page: "post" }`.

6. **App CTA + footer** — `FinalCTA`.

## Data

The post's nine rules and all prose come from the reference **verbatim** — this is finished editorial copy. Do not shorten, re-order, or "tighten" it, and keep the em dashes, smart quotes and dollar figures exactly as written. Store it as `blocks` in `lib/content/blog.ts`.

`generateMetadata` from the post data; `generateStaticParams` from published slugs; unknown or unpublished slug → `notFound()`.

## Images

Three slots: hero, one inline photo, and the keep-reading card art. **Not sourced yet.** Until the team supplies them, render the hero as the `--page-bg` gradient + scrim with the text intact (the layout must not collapse), and omit the inline `image` block rather than shipping a placeholder graphic. Add the real files to `public/images/blog/` at 640/960/1600 in AVIF+WebP+PNG when they arrive.

## Responsive

Wide/mid: hero min-height 62vh (cap 720px), H1 `clamp(34px,5vw,56px)`. Narrow: hero min-height 78vh, H1 `clamp(28px,7.5vw,36px)`, body 17px, `--gutter` sides, at-a-glance grid 2×2 → 1 column, pull quote loses its hanging indent.

## SEO

Title from the post, description = the dek, canonical `/blog/who-pays-first`, `openGraph.type: "article"` with `publishedTime`, `authors: ["GoLo Golf"]`, and the hero as the OG image once it exists. `Article` JSON-LD (headline, datePublished, author, publisher with logo, image, mainEntityOfPage). Sitemap 0.7 via the published-posts loop.

## Acceptance checks

- Post renders entirely from `blocks` — no post prose inside the TSX
- Every block type in the union has a renderer; an unknown `kind` fails loudly in dev, not silently in prod
- Copy matches the reference word for word (spot-check rules 1, 5 and 9)
- Heading anchors work: `/blog/who-pays-first#rule-5` scrolls clear of the nav
- Copy-link puts the canonical URL on the clipboard and confirms
- No broken image requests; hero still legible with no photo
- Lighthouse mobile Accessibility 100, Performance ≥ 85
- `npm run lint && npm run typecheck && npm run build` pass
