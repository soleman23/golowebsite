# Glossary UX: states, layout and components

How `/glossary` behaves at every breakpoint and in every flow in spec §5.3, precisely enough to build (#156, #157) and to test (QA GL-QA-01 to 14). Issue #153 (GLS-002). Categories and counts come from `inventory.md`; canonicals from `canonical-map.md`.

**Status:** prepared October 29, 2026. The three owner decisions below are recorded; everything else is a design decision made here for review.

## Owner decisions (October 28, 2026)

1. **Photo hero**, with the search field on top of it. The photo and its 13 files are #171; this doc lays the hero out for it.
2. **No header nav entry.** Footer and contextual links only for the MVP (#164). Revisit with #167's data.
3. **Category in the URL**: `?category=<id>` through the existing `FilterBoot` / `FilterUrlSync` / `useInitialFilter` pattern, the same as `/blog?topic=`. Back and forward restore it; the canonical stays `/glossary`. Search text never goes in the URL.

The newsletter is on hold (#121): there is no `NewsletterBand` on the hub and no `glossary` signup source.

## Decisions made here

| # | Decision | Why |
|---|---|---|
| D1 | **A–Z is jump links** to letter headings, not a letter filter. Letters with no published term render as plain disabled text, not links, and stay in place. Numbers group under **#** (first), for "19th Hole". | Works without JavaScript, never hides a term, and doesn't fight the category filter or deep links (#153's recommendation). |
| D2 | **The directory is grouped by letter**, one `<dl>` per letter under an `<h3>`. Category is a label on each entry and a filter, not a second grouping. | One stable reading order. Grouping by category as well would mean either duplicating entries or making A–Z jump within a category. |
| D3 | **Category filtering is CSS**, keyed off `<html data-filter>`, like `/games` and `/blog`, so `/glossary?category=side-games` paints filtered on the first frame and `lint:filters` checks the rules. | Reuses the existing mechanism and its check. |
| D4 | **Search shows a ranked results list** above the directory and hides the directory while a query is active. The list is rendered by the client leaf from the published search index (name, slug, category, short definition: the fields search needs anyway). | Spec §5.4's ranking order isn't the A–Z order. Showing ranked matches by reordering the server list (CSS `order`) would make reading and tab order disagree with what's on screen. This is a deliberate exception to #157's "no re-render from a JS payload if it can be avoided": here it can't be. The server directory is untouched, so no-JS and crawlers see everything. |
| D5 | **Entries are fully expanded.** No accordions. Short definition, example and notes are short enough to show; "more" means the canonical guide link. | No hidden content to crawl around or reveal, nothing to break without JS. #165's `glossary_term_open` is redefined accordingly (see [Analytics hooks](#analytics-hooks)). |
| D6 | **Deep links win.** A `#slug` target always ends up visible: an active search is cleared and a category that would hide it resets to All, both announced. | Spec §5.4, #157. |
| D7 | **No sticky controls.** Search, chips and A–Z scroll with the page. Each letter heading has a "Back to A–Z" link. | No `backdrop-filter`-on-sticky risk (CLAUDE.md), no covered anchors, no mobile height lost. |
| D8 | **JavaScript-only controls are hidden without JavaScript**: the search field and the copy-link buttons carry `data-requires-js`, and a `<noscript><style>` in the page hides them. Chips still render without JS. | Without JS the chips show "All" lit, which is true. A dead search box isn't. |

## Page structure

Spec §5.2, in order. One H1; H2s for the sections; H3 per letter.

1. **Hero** (`PageHero`, `photo="glossary"` once #171 lands): breadcrumbs (Home › Glossary), kicker, H1 "Golf Glossary: Terms, Slang & Games Explained", lead, then the **search field** (a slot the hero gets for this page).
2. **Controls**, under the hero:
   - category chips (`ChipFilter`): All terms · Scoring · Games & formats · Side games · Handicaps · Shots · Course & rules · Equipment · Slang, each with its count;
   - the visible count line ("56 terms" / "10 side-game terms");
   - a **Clear** button whenever the query or category isn't the default.
3. **Search results** (only while a query is active): count line and ranked list.
4. **Start here** (H2): six curated terms as links. The proposal is Press, Skins, Net Score, Stroke Index, Handicap Index and Mulligan, one or two per intent tier. It's labelled as a starting point, never "most searched" or "popular".
5. **Browse A–Z** (H2): the letter bar, then the directory.
6. **Related guides** (H2): three cards (`CalloutCard`) to `/games`, `/blog`, `/how-it-works`.
7. **CTA**: `FinalCTA` with the store buttons from `siteConfig` (#164 finalises the copy).

No newsletter band (on hold).

## Wireframes

Content widths assume `--max-width` 1200px and `--gutter` `clamp(18px, 4vw, 46px)`. Definitions are capped at about 68 characters a line (`max-width: 68ch`) at every width.

### 320 px

```
┌──────────────────────────────┐
│ ≡ GoLo                  [Get]│  existing nav, unchanged
├──────────────────────────────┤
│ Home › Glossary              │  ┐
│ GOLF TERMS                   │  │ copy on the dark top of
│ Golf Glossary: Terms,        │  │ the 4:5 phone frame
│ Slang & Games Explained      │  │
│ Know the game. Talk the …    │  │
│ ┌──────────────────────────┐ │  │
│ │ ⌕ Search 56 terms        │ │  │ full width, 48px tall
│ └──────────────────────────┘ │  ┘
│   (photo subject, bottom)    │  mobileSubject share of frame
├──────────────────────────────┤
│ [All terms 56][Scoring 8][Ga→│  chip strip scrolls inside
│ 56 terms                     │  itself, never the page
├──────────────────────────────┤
│ START HERE                   │
│ Press · Skins · Net Score ·  │  wrapped inline links
│ Stroke Index · Handicap …    │
├──────────────────────────────┤
│ BROWSE A–Z                   │
│ [#][A][B][C][D][E]           │  6 columns, 44px targets
│ [F][G][H] I  J  K            │  plain = no terms (disabled)
│ … 5 rows                     │
├──────────────────────────────┤
│ #                            │  H3
│ 19th Hole        Slang  [⧉]  │  dt: name, category, copy
│ The bar after the round…     │  dd: definition
│ Example: …                   │
│ Related: Settle-up           │
│ ─────────────────────────    │
│ B                            │
│ Best Score   Games …    [⧉]  │
│ …                            │
│ Read the Best Score guide →  │  existing canonical
│               Back to A–Z ↑  │
├──────────────────────────────┤
│ RELATED GUIDES  (stacked)    │
│ CTA band + store buttons     │
└──────────────────────────────┘
```

### 760 px

```
┌──────────────────────────────────────────────┐
│ Home › Glossary                               │
│ GOLF TERMS                                    │
│ Golf Glossary: Terms, Slang & Games Explained │  photo: phone frame
│ Know the game. Talk the talk. …               │  until 767px, then
│ ┌───────────────────────────────┐             │  the desktop frame
│ │ ⌕ Search 56 terms              │            │  max 560px
│ └───────────────────────────────┘             │
├──────────────────────────────────────────────┤
│ [All terms 56][Scoring 8][Games & formats 10][…│  strip scrolls
│ 56 terms                                      │
├──────────────────────────────────────────────┤
│ START HERE        two columns of links        │
├──────────────────────────────────────────────┤
│ BROWSE A–Z  [#][A][B][C][D][E][F][G][H][I][J][K][L]│ 14 per row
│             [M][N][O][P][Q][R][S][T][U][V][W][X][Y][Z]│
├──────────────────────────────────────────────┤
│ A                                             │
│ term ─ category ───────────────────── [Copy]  │  one column,
│ definition, example, notes, related           │  68ch measure
├──────────────────────────────────────────────┤
│ RELATED GUIDES  [card][card]                  │
│                 [card]                        │
└──────────────────────────────────────────────┘
```

### 1100 px

```
┌──────────────────────────────────────────────────────────────┐
│ Home › Glossary                                   (photo     │
│ GOLF TERMS                                         subject   │
│ Golf Glossary: Terms, Slang & Games Explained      on the    │
│ Know the game. Talk the talk. …                    right)    │
│ ┌───────────────────────────────┐                            │
│ │ ⌕ Search 56 terms              │  scrim holds behind copy  │
│ └───────────────────────────────┘  to --copy-span            │
├──────────────────────────────────────────────────────────────┤
│ [All terms 56][Scoring 8][Games & formats 10][Side games 10]…│  fits or
│ 56 terms                                           [Clear]   │  scrolls
├───────────────────┬──────────────────────────────────────────┤
│ START HERE        │ BROWSE A–Z                                │
│ Press             │ [#][A][B] … [Z]  one row                  │
│ Skins             │                                           │
│ Net Score         │ A                                         │
│ Stroke Index      │ term ─ category ─────────────── [Copy]    │
│ Handicap Index    │ definition (68ch) …                       │
│ Mulligan          │                                           │
│ (not sticky)      │                                           │
├───────────────────┴──────────────────────────────────────────┤
│ RELATED GUIDES  [card][card][card]                            │
└──────────────────────────────────────────────────────────────┘
```

From 1100 px, "Start here" becomes a left column (about 220px). It comes first in the DOM, so reading and tab order are unchanged. It isn't sticky (D7).

### 1440 px

Same as 1100, centred in `--max-width` 1200px. The extra width goes to the page margins, not the measure: definitions stay at 68ch, and the space right of the entries holds the category label and copy button.

### Overflow rules

- The chip strip scrolls inside its own box (the existing `ChipFilter` behaviour; focus scrolls a chip into view). Eight short labels plus "All terms" fit on one line from about 1000px.
- Long term names wrap; nothing uses `white-space: nowrap` except chip labels.
- The longest MVP name, "Closest to the Pin", wraps at 320 px beside its category label: the label drops under the name below 400px.
- Long URLs never appear in copy.
- QA checks `document.documentElement.scrollWidth === innerWidth` at all four widths (GL-QA-14).

## Entry anatomy

```html
<div class="entry" data-category="side-games">      <!-- valid inside <dl> -->
  <dt id="press" tabindex="-1">
    <a href="#press">Press</a>                          <!-- self-link, works without JS -->
    <span class="category">Side games</span>
    <button data-requires-js aria-label="Copy link to Press">Copy link</button>
  </dt>
  <dd>
    <p>Short definition.</p>
    <p><span class="label">Example</span> …</p>          <!-- if present -->
    <p><span class="label">House rules</span> …</p>      <!-- rule or house-rule note, labelled by kind -->
    <p><span class="label">In GoLo</span> …</p>          <!-- only from live capabilities -->
    <p>Related: <a href="#re-press">Re-press</a>, <a href="#nassau">Nassau</a></p>
    <p><a href="/blog/pressing">Read the pressing guide</a></p>  <!-- existing canonical -->
    <p class="reviewed">Reviewed {date}</p>    <!-- published + reviewedOn only -->
  </dd>
</div>
```

- The `<dt>` id equals the slug. `tabindex="-1"` makes it focusable for deep links without adding a tab stop.
- The note label states its kind: **Rules of Golf**, **Handicapping**, **Common practice** or **House rules**. The record says which (#155 adds the field).
- Related terms render only if the target is published. With the flag off in local review, approved targets render too, marked like their entries.
- In local review, an `approved` (not yet published) entry carries a visible "Not published" marker. It never appears in production, because only published records reach the production selector.
- Guide link text names the guide ("Read the Nassau guide"), never "read more".
- "Reviewed <date>" is the only review signal; `reviewedBy` never renders.
- Rose (`--negative`) is not used for anything here. Lime is for focus and the active chip only.

## Flows and states

Spec §5.3. "Announce" means the polite live region, debounced.

| Flow | Trigger | Result | Focus | Announce | URL |
|---|---|---|---|---|---|
| Browse | Load `/glossary` | Hero, chips (All lit), Start here, A–Z, full directory | Normal page start | Nothing | `/glossary` |
| Search | Type in the hero field | After 250ms idle: ranked results list replaces the directory; count line "4 terms match" | Stays in the field | After 600ms idle: "4 terms match" (never per keystroke) | Unchanged; query never written |
| Search, Enter | Press Enter in the field | Same as typing; nothing submits | Stays in field | — | Unchanged |
| Filter | Choose a chip | Directory (or results) narrowed by CSS; letter groups with no match hidden; A–Z letters with no match greyed | Stays on the chip | "Side games: 10 terms" (`FilterStatus`) | `?category=side-games` pushed; All removes the param |
| Combine | Query + category | Results = matches within the category | — | "2 side-game terms match" | `?category=` only |
| Letter | Activate a letter | Jumps to that letter's heading (`#letter-p`); smooth only without reduced motion | Moves to the heading (`tabindex="-1"`) | — | `#letter-p` (fragment, not indexed) |
| Letter, filtered | A letter with no match in the active category | Greyed and `aria-disabled="true"`; activation does nothing | — | — | — |
| Open term | Activate a result | Query cleared, directory shown, scroll to the entry | Moves to its `<dt>` | "Showing Press" | `#press` |
| Deep link | Cold load or refresh of `/glossary#press` | Entry visible and in view below the nav | `<dt>` focused after hydration | Nothing on cold load | Unchanged |
| Deep link, hidden | `/glossary?category=handicaps#press` | Category resets to All (target wins); entry shown | `<dt>` | "Category cleared to show Press" | `?category` removed with `replaceState` (no extra history entry) |
| Deep link, search active | Hash change while a query is active | Query cleared, then as above | `<dt>` | "Search cleared to show Press" | — |
| Deep link, unknown | `/glossary#not-a-term` | Nothing happens | Normal | Nothing | Unchanged |
| Deep link, retired slug | `#old-slug` listed as a retired alias | Treated as the current slug | `<dt>` | — | Unchanged |
| Related term | Follow "Related: Re-press" | Same as deep link | `<dt>` | As deep link | `#re-press` |
| Guide link | Follow "Read the pressing guide" | Navigates to `/blog/pressing` | — | — | — |
| Copy link | Activate Copy link | Copies `https://www.golo.golf/glossary#press`; button text "Copied" for 2s | Stays on button | "Link to Press copied" | Unchanged |
| Copy fails | Clipboard denied or unavailable | Button text "Copy failed"; the term's self-link still works | Stays | "Couldn't copy. The term name is a link you can copy instead." | — |
| No results | Query matches nothing | Empty state: "No terms match ‘xyz’." Clear search button; "Tell us what's missing" link to `/contact` | Stays in field | "No terms match" | — |
| No results, filtered | Matches exist outside the category | Empty state adds "3 matches in other categories. Search all terms" (button sets category All) | — | — | — |
| Clear | Clear button or Escape in the field | Query emptied, category All, directory back | Search field | "Showing all 56 terms" | `?category` removed (push) |
| Back/forward | Browser history | Category restored from the URL (`FilterUrlSync`); query not restored (never stored) | Browser default | `FilterStatus` message | — |
| App CTA | Activate a store button or CTA | Existing `StoreButtons` / `TrackedCta`; iOS follows `siteConfig.iosLive` | — | — | — |
| Newsletter | — | Not on the hub (on hold, #121) | — | — | — |
| No JavaScript | Any | Full directory, A–Z links, guide links, related links work. Search field and copy buttons hidden. Chips render with All lit and do nothing | — | — | — |
| Flag off | Production or Hostinger preview | `/glossary` 404 | — | — | — |

The empty state never echoes the query into a URL, title or analytics; it's rendered as text by React (escaped).

## Search display

- The ranking is spec §5.4 exactly, from #155's pure functions:
  1. exact name;
  2. exact alias;
  3. name prefix;
  4. partial name;
  5. alias prefix;
  6. description or tag.

  Ties sort alphabetically.
- Each result shows the term name (link to its anchor), the category, and the short definition.
- If the match came through an alias, the result shows the alias it matched as "also: alternate shot". Without that, "alternate shot" returning Foursomes looks like a mistake.
- At most all published terms (56 today); no paging.
- Count wording: "1 term matches", "4 terms match", "No terms match"; with a category, "2 side-game terms match".
- The results list is an `<ol>` with `aria-label="Search results"`. The count line above it is plain text; the announcement is the separate live region.
- Minimum query: 1 character after normalisation. An all-punctuation query is treated as empty.

## Keyboard and focus

Tab order, top to bottom:

1. skip link and nav (existing);
2. breadcrumb link;
3. search field;
4. chips (each a button), then Clear when shown;
5. results (each a link) when shown;
6. Start here links;
7. A–Z links;
8. in each entry: term self-link, copy button, related links, guide link;
9. "Back to A–Z" per letter;
10. related guides;
11. CTA buttons.

- **Escape** in the search field clears it (same as Clear).
- **Arrow keys** don't move between chips. `ChipFilter` is a group of buttons, not a radio group; its existing doc explains why.
- **Focus after a view change:**
  - deep link and opening a result: the entry's `<dt>`;
  - letter jump: the letter `<h3>`;
  - Clear: the search field;
  - chip change: focus stays on the chip.
- Every control shows the lime focus ring (`--focus-ring-*`), including the search field over the photo (#171 checks its contrast per pixel).
- Scroll targets clear the fixed nav through the existing `scroll-padding-top`.
- No focus traps; nothing opens a dialog.

## Screen readers

- Live regions:
  - `FilterStatus` for category changes made by the reader (not the initial URL read);
  - one search status for result counts, debounced 600ms;
  - one status for copy and deep-link messages.

  They're never announced on page load.
- The directory is real `<dl>` / `<dt>` / `<dd>`. Letter headings make it navigable by heading.
- Disabled letters are plain text with `aria-disabled` only where they're links that the category disabled; letters with no published terms are not links at all.
- The search field has a visible label ("Search the glossary"; visually it can sit in the placeholder position as long as the `<label>` exists) and `type="search"`, `autocomplete="off"`, `enterkeyhint="search"`.

## Reduced motion and touch

- `scroll-behavior: smooth` only under `prefers-reduced-motion: no-preference`. No other motion on the page; the copy confirmation is a text change, not an animation.
- Touch targets at least 44 × 44 px: chips, A–Z cells, copy buttons, Clear. At 320 px, A–Z is a 6-column grid: 288px of content ÷ 6 = 48px cells less gaps.

## Visual language

- Dark page (`--page-bg`) and frosted surfaces (`--glass-surface`) for the controls panel and result cards. Never on anything sticky (nothing is).
- Lime accent only for the active chip, focus rings and the H1 accent line.
- 800 weight for the H1, section headings, letter headings and term names.
- Muted text uses `--text-muted` (0.5 alpha) at the lowest, never below; category labels use `--text-secondary`.
- The photo sits under the existing `PageHero` scrim. The search field sits on the scrim's guaranteed-dark band, inside `--copy-span`.

## Component plan

Reuse first. New components live under `components/sections/glossary/`, next to the other page-section folders (`blog/`, `games/`, `faq/`), and are named for what they render. Spec §8.1's names were a proposal.

| Need | Component | New or reused |
|---|---|---|
| Hero with photo and search slot | `PageHero` | Reused. Gets an optional `search` slot rendered after the lead (a small additive prop), so the search field sits on the photo |
| Breadcrumbs | `Breadcrumbs` (via `PageHero`) | Reused |
| Category chips | `ChipFilter` | Reused |
| Category from URL, paint before hydration | `FilterBoot` (`param="category"`) | Reused |
| URL ↔ state, back/forward | `FilterUrlSync`, `useInitialFilter` | Reused |
| Category announcement | `FilterStatus` | Reused |
| Related guides | `CalloutCard` | Reused |
| CTA band, store buttons | `FinalCTA`, `StoreButtons` | Reused; #164 sets the copy |
| Newsletter | `NewsletterBand` | **Not used** (on hold) |
| State shared by the hero field, chips and results | `GlossaryProvider` | New, `"use client"`; wraps the page body, children stay server-rendered |
| Search field | `GlossarySearchField` | New, client leaf |
| Chips + count + Clear + results + statuses | `GlossaryControls` | New, client leaf |
| Directory | `GlossaryDirectory` | New, **server** component |
| One entry | `GlossaryEntry` | New, server component |
| Copy-link button | `CopyLinkButton` | New, client leaf (tiny) |
| Deep-link handling (hash on load and `hashchange`) | inside `GlossaryProvider` | New |
| A–Z bar | `GlossaryAlphabet` | New, server component; the client only sets `aria-disabled` under a filter |
| Start here | part of the page | Server markup, list from `lib/content/glossary` |

Copy (hero, labels, empty state, Start here list, related guides) lives in `lib/content/glossary/` (CLAUDE.md), not in JSX.

## Analytics hooks

The events land in #165; #157 only leaves the calls at these points:

- `glossary_search`: once per settled query (the 600ms announcement debounce), only when the normalised query changed. Params come from the closed sets in #165. Never the text.
- `glossary_filter`: on a chip change made by the reader (not the initial URL read, not a deep-link reset).
- `glossary_term_open`: **redefined by D5.** Since nothing expands, it fires when a reader opens a term: activating a search result, a related-term link, or arriving on a `#slug` deep link (once per page load per term). #165 records the redefinition.
- Copy link: #165 decides between `glossary_share` and the existing `share_click` with `method: "copy"`.
- `glossary_cta_click`: on the contextual CTA and guide links, `term_id` from the closed set.

## QA mapping

| QA | Covered by |
|---|---|
| GL-QA-01, 02 | Browse; No JavaScript |
| GL-QA-03 to 05 | Search display; #155 tests |
| GL-QA-06 | No results |
| GL-QA-07 to 09 | Filter; Combine; Clear |
| GL-QA-10 | Deep link (cold, refresh, hidden, search active) |
| GL-QA-11 | Back/forward |
| GL-QA-12 | Keyboard and focus |
| GL-QA-13 | Screen readers |
| GL-QA-14 | Wireframes; overflow rules |

## Pending

- Wireframe images on a `pr-assets/glossary-ux` branch (the repo's convention) aren't drawn. The ASCII wireframes above are the reviewable version; rendered screenshots come with #156, from the real page.
