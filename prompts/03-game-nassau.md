# Prompt 03 — `/games/nassau`

**Reference:** `design_handoff/reference/Golo Golf - Game Nassau.dc.html`

---

Build the game-detail template at `app/games/[slug]/page.tsx`, driven entirely by data so the next seven games are a data addition, not a new file. Content in `lib/content/gameDetail.ts`, keyed by slug — `nassau` is the only entry today. `generateStaticParams` from its keys; unknown slug → `notFound()`.

## Section order

1. **Hero** — breadcrumbs `Home / Games / Nassau`, big game icon, kicker, H1 `Nassau`, tagline "Three bets in one: front nine, back nine, and the overall match." (use the reference's exact string), and a row of trait pills (players, stakes, strokes, difficulty).

2. **How it works** — `HOW IT WORKS` kicker + H2 + intro, then numbered steps as glass cards with an oversized lime numeral.

3. **Worked example** — `WATCH IT PLAY OUT`, H2 "A $20 Nassau, front to back.", the lead. Two columns at wide: a bet-by-bet ledger (tag, title, detail, ± value per line, then a `NET · YOU COLLECT +$30` total row) beside a `NassauPhone` mockup showing the live match — FRONT/BACK/TOTAL rows with up/down status and values, a press line, and the final "Tom pays you" summary. This is the page's centerpiece — get the numbers exactly right; they must add up to +$30.

4. **Presses & variations** — `PRESSES & VARIATIONS` + H2 "The press is where Nassau gets dangerous.", four cards: The press · 2-down auto-press · Presses stack · Escalating stakes.

5. **Play smart** — `PLAY SMART` + H2 "When to press — and when to shut up.", three tip cards. The "don't chase a bad swing" tip uses the rose warning icon (`--negative`); the other two use the lime check.

6. **Glossary** — `TALK THE TALK` + H2 "The terms you'll hear on the tee.", term/definition pairs as a two-column definition list (`<dl>`), single column ≤760px.

7. **FAQ** — `NASSAU, ANSWERED` + H2 "Before you tee it up.", `Accordion`, firing `faq_open` with `{ page: "nassau", question_id }`.

8. **Related games** — `STACK IT WITH` + H2 "Crews that run Nassau also play…", three game cards reusing the `/games` card component (import it, don't fork it).

9. **Prev / next** — two-up nav: `PREVIOUS GAME` / `NEXT GAME` from the game order in `lib/content/games.ts`. Until other detail pages exist, point these at `/games#<slug>`.

10. **Closing CTA** — `FinalCTA`, H2 "Set up your Nassau in ten seconds.", the lead, `StoreButtons` + the free-to-download line.

## Data shape

```ts
export type GameDetail = {
  slug: string;
  name: string; kicker: string; tagline: string;
  traits: string[];
  howTitle: string; intro: string;
  steps: { n: string; title: string; body: string }[];
  example: { title: string; lead: string; bets: Bet[]; net: { label: string; sub: string; value: string }; phone: PhoneBet[]; pressNote: string };
  variations: { icon: IconName; title: string; body: string }[];
  tips: { tone: "good" | "bad"; title: string; body: string }[];
  glossary: { term: string; def: string }[];
  faqs: { q: string; a: string }[];
  related: string[];   // game slugs
  prev?: string; next?: string;
};
```

## Responsive

Worked example two-up ≥1100px (ledger `1fr`, phone `minmax(0,340px)`), stacked below with the phone under the ledger. Steps 3-up → 1-up. Glossary `<dl>` two columns → one. Related cards 3 → 2 → 1.

## SEO

Title `Nassau, Explained`, description from BUILD-SPEC §6, canonical `/games/nassau`, `openGraph.type: "article"`. `HowTo` JSON-LD from the steps plus `FAQPage` from the FAQ — or `Article` if `HowTo` feels forced. Sitemap 0.8, generated from the `gameDetail` keys so future games self-register.

## Acceptance checks

- Page renders from data only — no hardcoded Nassau strings in the TSX
- The worked example's numbers reconcile to +$30
- Related cards use the same component as `/games`
- Prev/next never dead-ends; unknown slug 404s
- Glossary is a real `<dl>`; FAQ accordion keyboard-operable
- `npm run lint && npm run typecheck && npm run build` pass
