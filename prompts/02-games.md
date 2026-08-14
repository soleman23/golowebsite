# Prompt 02 — `/games`

**Reference:** `design_handoff/reference/Golo Golf - Games.dc.html`

---

Build the games index at `app/games/page.tsx` (server component) with the interactive grid as a client leaf in `components/sections/games/GamesBrowser.tsx`. Data goes in `lib/content/games.ts`.

## Sections

1. **Hero** (`PageHero`) — kicker `EVERY GAME, SCORED AUTOMATICALLY`, H1 "Pick your poison. We'll keep the books." (line break before "We'll"), the lead paragraph verbatim.

2. **Filter + grid** — `ChipFilter` row above a card grid. Filters: `All`, `Match play`, `Individual`, `Team`, `Side bets`, `No strokes needed` — each with a live count. A result line reads `All 8 games` when unfiltered, `N games` when filtered.

   Each game card: icon in a lime-tint tile, name, one-line description, then three labelled meta rows — **How it works**, **Players**, **Format** — and a `How to play →` link. Cards for popular games carry a `MOST PLAYED` badge and a lime border + soft glow.

   Eight games, copy verbatim from the reference and `lib/content/home.ts`: Skins, Nassau, Stroke Purse, Wolf, Bingo Bango Bongo, Closest to Pin, Longest Drive, Birdies.

3. **Closing CTA** — `FinalCTA` with H2 "Stack 'em all. Settle in seconds.", the lead, `StoreButtons`, and the `Free to download · No card to start · iPhone & Android` line.

## Data

```ts
export type Game = {
  slug: string;            // "nassau" — anchor + detail route
  icon: IconName;
  name: string;
  desc: string;
  how: string;
  players: string;
  format: string;
  tags: GameTag[];         // drives the filters
  popular?: boolean;
  hasDetailPage?: boolean; // true for nassau only, today
};
```

Give every card `id={slug}` so `/games#skins` from the footer lands on it (`scroll-margin-top: 96px`).

`How to play →` goes to `/games/<slug>` when `hasDetailPage`, otherwise to `/contact?topic=idea` — or whatever the team decided in README "Decisions" #5. Don't ship dead `#` links.

## Interactions

- Filtering is client-side and **URL-synced**: `?filter=team` via `useSearchParams` + `router.replace(..., { scroll: false })`, so a filtered view is shareable and back/forward works.
- Selecting a chip fires `game_filter` with `{ filter }`.
- Chips are buttons with `aria-pressed`; the grid gets `aria-live="polite"` on the result-count line so screen readers hear the change.
- Empty state can't happen with these filters — but if a filter yields zero, show "No games match that filter." rather than an empty grid.

## Responsive

Grid `repeat(auto-fill, minmax(300px,1fr))` max 3 columns ≥1100px, 2 at mid, 1 at narrow. Chip row wraps at wide/mid, horizontal-scrolls with snap ≤760px. Meta rows stack inside the card below 380px.

## SEO

Title `Golf Betting Games`, description from BUILD-SPEC §6, canonical `/games`. Sitemap priority 0.9. No FAQ schema here.

## Acceptance checks

- All eight games render with their four content fields filled
- Counts on the chips match the number of cards each filter shows
- `?filter=side-bets` deep-links to a filtered grid; back button restores `All`
- `/games#skins` scrolls the Skins card clear of the sticky nav
- No `href="#"` anywhere
- Keyboard: chips reachable, focus ring visible, focused chip scrolls into view on mobile
- `npm run lint && npm run typecheck && npm run build` pass
