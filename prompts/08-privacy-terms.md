# Prompt 08 — `/privacy` (re-present) and `/terms` (new)

**References:** `design_handoff/reference/Golo Golf - Legal Privacy.dc.html`, `Golo Golf - Legal Terms.dc.html`

---

## Read this first

**`/privacy` already exists and its legal text is authoritative.** `app/(content)/privacy/page.tsx` holds a full, reviewed policy (14 sections, effective July 16 2026, `info@golo.golf`). The prototype's privacy copy is *shorter and different*. **Keep the repo's text verbatim.** This task changes presentation only: structure, TOC, plain-English notes, the short-version panel.

**`/terms` does not exist**, and the prototype's terms copy is design copy, not lawyer-reviewed (README decision #3). Build the page, wire it up, and **leave it out of the sitemap and nav until the team confirms sign-off** — or ship it with `robots: { index: false }` until then. Flag this in your summary; don't quietly publish it.

## Shared legal template

Both pages use one template: `components/sections/legal/LegalPage.tsx` + `legal.module.css`, driven by data in `lib/content/legal.ts`. Keep them inside the existing `app/(content)/` route group and keep using `content.module.css` for prose defaults where it already fits.

Structure:

1. **Sticky legal sub-nav** — `LEGAL` label + links (Terms · Privacy · plus any others the team adds). Active link takes the lime color + a 2px lime underline. Sticky under the main nav — **no `backdrop-filter`** (BUILD-SPEC §5.1); use `--glass-sheet`. Hidden ≤760px.

2. **Hero** — breadcrumbs `Home / Privacy Policy`, kicker `LEGAL`, H1, the lead paragraph, then a meta row: `Effective date: …`, `GoLo Golf LLC · Bend, Oregon`, `N sections · ~X min read` (count computed from data, not typed).

3. **Short version panel** — lime-bordered `CalloutCard` with a warning glyph:
   - Privacy: `THE SHORT VERSION` — "We collect what the scorecard needs. Nothing else." + the three tagged lines.
   - Terms: `READ THIS FIRST` — "GoLo is a scoreboard. It is not a betting app." + the tagged lines.
   
   This panel is a **summary, not a substitute** — include a line saying the full text below governs.

4. **TOC rail + body** — `TocRail` (`ON THIS PAGE`, numbered section list, sticky `top: 150px`, scroll-spy `aria-current`) beside the numbered sections. Each section: number, title, the legal paragraphs, and where the data provides one, an `IN PLAIN ENGLISH` note in a muted glass card beside/above the legal text. Sections support paragraphs, definition lists, bullet lists and sub-tables — the privacy policy needs all four.

   `[data-legal-body] h2 { scroll-margin-top: 150px; }` so `#section-7` anchors clear both sticky bars.

5. **Contact block** — `PRIVACY QUESTIONS` / `LEGAL QUESTIONS`: entity name, address, one line of context, the support email, and a `Questions? Talk to a human` link to `/contact`.

6. **More from the legal shelf** — cards to the sibling legal docs.

7. **Closing CTA** — `FinalCTA` with the page's own line ("That's the whole policy. Now go win the back nine." / "Terms read. Now go win the back nine.").

## Data

```ts
export type LegalSection = {
  num: string; id: string; title: string;
  plain?: string;                       // the "in plain English" note
  blocks: ({ kind: "p"; html: string }
        | { kind: "ul"; items: string[] }
        | { kind: "dl"; items: { term: string; text: string }[] }
        | { kind: "table"; head: string[]; rows: string[][] })[];
};
export type LegalDoc = {
  slug: "privacy" | "terms";
  title: string; kicker: string; lead: string;
  effective: string; entity: string;
  short: { tag: string; title: string; sub: string; lines: { tag: string; text: string }[] };
  sections: LegalSection[];
};
```

**Migrate the existing privacy prose into this shape by copy-paste, not by rewriting.** Diff the rendered text against the current live page before and after — it must read identically, including the `You → Account → Delete Account` paths, the vendor names, and the 30/90-day retention numbers. Legal text with a typo introduced by a refactor is a real problem.

## Responsive

Wide ≥1100px: rail `minmax(0,270px)` + body `minmax(0,1fr)`, body max 780px. Mid: rail collapses to a chip row above the body. Narrow: chip row scrolls, body 17px, plain-English notes stack above their section text, sub-nav hidden.

## SEO

Privacy: keep the existing title/description. Terms: title `Terms of Service`, description from BUILD-SPEC §6 — but `index: false` until sign-off. Canonicals on both. No JSON-LD needed. Sitemap 0.3 (terms only once approved).

## Acceptance checks

- Rendered privacy text is **byte-identical in meaning** to what's live today — no clauses dropped, no numbers changed (diff it)
- TOC scroll-spy tracks the section in view; anchors clear both sticky bars
- Both pages share one template and one stylesheet
- `/terms` is either unindexed or explicitly approved before it ships
- Plain-English notes are visually subordinate to the legal text, never replacing it
- `npm run lint && npm run typecheck && npm run build` pass
