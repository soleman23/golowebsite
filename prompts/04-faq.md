# Prompt 04 — `/faq`

**Reference:** `design_handoff/reference/Golo Golf - FAQ.dc.html`

---

Build the full FAQ at `app/faq/page.tsx`. The home page keeps its short six-question FAQ — this is the long version, organized by category with deep-linkable questions. Data in `lib/content/faq.ts`; the home FAQ keeps reading its own `faqs` array from `lib/content/home.ts` (don't merge them, don't duplicate answers — if a question appears in both, define it once in `faq.ts` and have `home.ts` re-export the six it shows).

## Sections

1. **Hero** — breadcrumbs `Home / FAQ`, kicker `QUESTIONS FROM THE 19TH HOLE`, H1 "Good question.", the lead, a `testing`-variant status pill reading "Not live yet — in testing with real groups", a meta line `N questions · M categories` computed from the data, and a `Not here? Ask us →` link to `/contact`.

2. **Most asked** — lime-bordered panel, `THE SIX WE GET MOST`, six numbered questions that jump to the full answer below (`href="#q-…"`, `scroll-margin-top: 104px` on targets).

3. **Category rail + answers** — at wide, a sticky left rail (`CATEGORIES`, numbered rows with per-category counts, plus a "Still stuck? TALK TO A HUMAN →" card at the bottom) beside the answer column. The answer column repeats per category: number, label, blurb, then an `Accordion` of that category's questions.

   Some answers carry an extra note block (`noteTag` + `note`, e.g. `STATUS — In private testing. No public launch date announced.`) rendered as a `CalloutCard`, and/or a `linkLabel` link. Keep those.

4. **Talk to a human** — `STILL GOT A QUESTION`, H2 "We answer these ourselves.", the lead, a primary button to `/contact` and the support email as a `mailto:`.

5. **Keep reading** — `KEEP READING` cards linking `/features`, `/games`, `/blog`.

6. **Closing CTA** — `FinalCTA`, kicker `TRACK IT. BET IT. SETTLE IT.`, H2 "That's every question. Now go win the back nine.", buttons `Get the app` / `Browse the games`.

## Data

```ts
export type FaqItem = {
  id: string;            // "q-available" — the anchor
  q: string; a: string;
  noteTag?: string; note?: string;
  link?: { label: string; href: string };
};
export type FaqCategory = {
  id: string; short: string; label: string; blurb: string; items: FaqItem[];
};
```

Copy every question and answer verbatim — including the honest "Not yet. We're building it…" launch answer.

## Interactions

- Accordion, multiple open allowed, first item of the first category open by default.
- **Deep links must work:** on mount, if `location.hash` matches an item id, open that item and scroll it clear of the sticky nav. Landing on `/faq#q-settle` opens that answer.
- Category rail links are same-page anchors with `scroll-margin-top: 96px`; the rail highlights the section in view (IntersectionObserver scroll-spy, `aria-current="true"` on the active row).
- Fire `faq_open` with `{ page: "faq", question_id }` on open only.
- Give each question a small copy-link affordance only if it's keyboard-accessible; otherwise skip it.

## Responsive

Wide ≥1100px: rail `minmax(0,270px)` + answers `minmax(0,1fr)`, rail `position: sticky; top: 96px`. Mid: rail becomes a horizontal chip row above the answers. Narrow: same chip row, scrollable; most-asked panel goes 2-col → 1-col.

## SEO

Title `FAQ`, description from BUILD-SPEC §6, canonical `/faq`. **`FAQPage` JSON-LD covering every question on the page** (this is the highest-value schema on the site — get all of them in, plain text answers, no HTML). Sitemap 0.6.

## Acceptance checks

- Question count in the hero equals the number rendered
- `/faq#q-available` opens and scrolls to that answer on a cold load
- Scroll-spy highlights the right category; rail is sticky and never overlaps the nav
- Every answer with a `note` renders its callout; no orphan tags
- `FAQPage` JSON-LD validates and contains every Q/A
- `npm run lint && npm run typecheck && npm run build` pass
