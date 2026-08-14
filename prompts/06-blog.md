# Prompt 06 — `/blog`

**Reference:** `design_handoff/reference/Golo Golf - Blog.dc.html`

---

Build the blog index at `app/blog/page.tsx` (server component) with the filter grid as a client leaf. Data in `lib/content/blog.ts` — the same module `/blog/[slug]` reads, so the index is generated from the posts, never hand-listed.

## Sections

1. **Hero** — breadcrumbs `Home / Blog`, kicker `NOTES FROM THE CART PATH`, H1 "How the bet actually works.", the lead verbatim, a `testing` status pill "The app isn't live yet — these are the build notes", and a meta line `N posts · M topics` computed from data.

2. **Featured post** — the post flagged `featured`, as a wide card: photo, category label, title, excerpt, `READ THE POST →`. Only one; if none is flagged, use the newest.

3. **Topics rail + grid** — at wide, a left rail: `TOPICS` chips with counts, then a "Want a format covered? Tell us the game your group argues about. `SEND IT OVER →`" card linking `/contact?topic=idea`. Right: the post grid with an `{activeLabel}` heading and a count.

   Post card: photo (16/9), category pill, title, excerpt. Whole card is one link; no nested interactive elements.

4. **Newsletter band** — `GET IT BEFORE THE GROUP CHAT DOES`, H2 "New format breakdowns, plus first crack at the app.", the lead, an email field + `Join the list`, the fine print, and the success state "You're on the list. We'll email when the next one's up."

5. **Elsewhere on GoLo** — three cards to `/features`, `/games`, `/faq`.

6. **Closing CTA** — `FinalCTA`, H2 "Enough reading. Go settle something."

## Data

```ts
export type Post = {
  slug: string;
  category: "rules" | "etiquette" | "handicaps" | "trips" | "building";
  title: string; excerpt: string;
  date: string;          // ISO
  readMins: number;
  hero: { src: string; alt: string };
  published: boolean;    // false = hidden from index and 404 on the detail route
  featured?: boolean;
  blocks: Block[];       // BUILD-SPEC §3
};
```

Eight posts are designed; **one is written** (`who-pays-first`). Per README decision #4: ship written posts with `published: true` and either omit the rest or render them as unlinked "coming soon" cards — do not link to empty pages. Category counts must reflect what's actually shown.

## Interactions

- Topic filter is client-side and URL-synced (`?topic=etiquette`), same pattern as `/games`; fires `blog_filter` with `{ category }`.
- Newsletter form: **new** `POST /api/subscribe` route handler, mirroring `/api/contact` — zod-validated email, Prisma model `NewsletterLead { id, email @unique, createdAt, source }`, duplicate email returns success (don't leak membership), Resend notification when a key is set, stub mode otherwise. Fires `newsletter_signup` `{ page: "blog" }` on success and `newsletter_error` `{ reason }` on failure. Rate-limit the same way `/api/contact` does, if it does.
- Add `topic` chips to the rail as buttons with `aria-pressed`, count-labelled.

## Images

Post hero photos are real images in `public/images/blog/` at 640/960/1600 AVIF+WebP+PNG, rendered with `next/image` (`sizes` matched to the card widths, `priority` only on the featured card). **The five photos aren't sourced yet** — until they are, render the card's photo area as a flat `--glass-surface` block with the category pill on it, never a stretched placeholder or a broken `src`.

## Responsive

Wide ≥1100px: rail `minmax(0,240px)` + grid `repeat(auto-fill,minmax(320px,1fr))` (2–3 cols), featured card full-width two-up (photo left, copy right). Mid: rail → chip row, grid 2 cols, featured stacks. Narrow: 1 col, chip row scrolls, featured photo aspect 16/9 above copy.

## SEO

Title `Blog`, description from BUILD-SPEC §6, canonical `/blog`. `Blog` + `ItemList` JSON-LD listing the published posts. Sitemap 0.8, and **generate the per-post sitemap entries from `posts.filter(p => p.published)`** so publishing a post is a one-line data change.

## Acceptance checks

- Index is generated from `lib/content/blog.ts` — adding a post requires no JSX edit
- No card links to an unpublished post; counts match visible cards
- `?topic=rules` deep-links; back button restores `All`
- Newsletter: valid email → success + row in Postgres; invalid → inline error, no request; duplicate → success
- No broken image requests in the network tab
- `npm run lint && npm run typecheck && npm run build` pass
