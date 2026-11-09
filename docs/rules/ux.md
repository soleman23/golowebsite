# Rules Center UX: states, layout and components

How `/rules` is laid out, how it behaves in every state, and which components build it. Issue #232 (RULES-002); spec §6, §8; inventory and ids in `inventory.md`; tracking epic #230. Patterns come from the shipped glossary (`docs/glossary/ux.md`); where this file is silent, that one applies.

**Status:** proposal of November 6, 2026. The owner signs off on #232.

## Decisions made here

- **D1. Answers before reference.** Common situations come before the 25 rules. A reader mid-round needs "my ball is against the cart path", not Rule 16.
- **D2. Everything expanded.** No accordions. Every answer and overview is open in the server HTML, so a deep link, a no-JS reader, find-in-page and a crawler all see the same thing. Overviews are short (60–120 words), so the page stays scannable.
- **D3. A 1–25 number grid instead of a rail.** It replaces the glossary's A–Z: 25 plain anchor links to `#rule-N`, 44px targets, server-rendered. No `TocRail` (`components/sections/legal/TocRail.tsx`): a scroll-spy rail plus a chip strip would be two navigation strips, and nothing on this page is sticky except the existing nav.
- **D4. One filter, two lists.** Topic chips filter situations and rules together. A situation belongs to its primary rule's category (`inventory.md`). With a filter on, the quick cards and the number grid hide, because they'd point at hidden entries.
- **D5. Search replaces the lists.** While a query is active, CSS hides the situations and rules and a ranked result list shows, grouped "Situations" then "Rules". Choosing a result jumps to the entry, which clears the search (the glossary's hash-reveal behaviour).
- **D6. The edition notice sits under the hero,** not in a footnote. Its last-checked date is the clarifications check date from `edition.ts`.
- **D7. Official links are plain external links** with the source named in the text ("Rule 18.2 on randa.org"), following the site's existing outbound-link convention (as the glossary's source links).
- **D8. No photo subject under text.** The hero follows the PageHero copy-span rules (#235); nothing else on the page sits on a photo.

## Page structure

Top to bottom, in DOM and tab order:

1. Breadcrumbs: Home › Golf rules.
2. **Hero** (`PageHero`, `photo="rules"`): kicker "Rules of Golf", H1 "Golf Rules Explained", lead (one sentence on what the page is and that the official text is linked), search field "What happened to your ball?" (hidden without JS).
3. **Edition notice:** "Based on the 2023 Rules of Golf, written by The R&A and the USGA. The next edition takes effect on 1 January 2028. Clarifications checked <date>." Links to the R&A rules and the USGA rules hub. Independent-site line: GoLo isn't affiliated with or endorsed by either.
4. **Controls** (`#rules-controls`, JS only): topic chips (All · Foundations · Playing · Course areas · Relief · Formats), a filter status line and Clear. While searching: the result list (`#rules-results`).
5. **Quick situations** (`#quick-situations`): eight cards, each linking to a situation anchor: Lost ball, Out of bounds, Penalty areas, Cart path relief, Bunkers, Provisional ball, Unplayable ball, Conceded putts.
6. **Common situations** (`#situations`, H2): 12 situation entries (H3 each).
7. **All 25 rules** (`#all-rules`, H2): the 1–25 number grid (`#rules-numbers`), then five category groups (H3, `#cat-…`), each with its overviews (H4 each, `#rule-N`).
8. **Official sources** (`#official-sources`, H2): the R&A Rules, Definitions, Clarifications, Committee Procedures (Model Local Rules), the USGA rules hub and clarifications, and the Rules of Handicapping, labelled as a separate rulebook. A note that a Committee's Local Rules can change any answer. A "Spot an error?" link to the contact form (#245).
9. **Related** (`#related`, H2): glossary, game guides, posts per `canonical-map.md`.
10. **CTA band** (`FinalCTA`), copy through the claim guard.

## Wireframes

Content widths assume `--max-width` 1200px and `--gutter` `clamp(18px, 4vw, 46px)`. Body copy is capped at about 68 characters a line (`max-width: 68ch`).

### 320 px

```
┌──────────────────────────────┐
│ ≡ GoLo                  [Get]│  existing nav
├──────────────────────────────┤
│ Home › Golf rules            │  ┐ copy on the dark top
│ RULES OF GOLF                │  │ of the 4:5 phone frame
│ Golf Rules Explained         │  │
│ Plain answers to the …       │  │
│ ┌──────────────────────────┐ │  │
│ │ ⌕ What happened to your… │ │  │ 48px tall
│ └──────────────────────────┘ │  ┘
├──────────────────────────────┤
│ Based on the 2023 Rules of   │  edition notice
│ Golf … Checked 6 Nov 2026.   │
├──────────────────────────────┤
│ [All][Foundations][Playing][→│  chip strip scrolls itself
│ 37 entries                   │
├──────────────────────────────┤
│ ┌────────────┐┌────────────┐ │  quick cards, 2 columns,
│ │ Lost ball  ││ Out of     │ │  ≥ 44px tall
│ └────────────┘│ bounds     │ │
│ … 4 rows      └────────────┘ │
├──────────────────────────────┤
│ COMMON SITUATIONS            │  H2
│ Lost ball: what happens next?│  H3                   [⧉]
│ Short answer …               │
│ Before you decide            │
│ • Searched for 3 minutes?    │
│ • Known or virtually certain │
│   it's in a penalty area?    │
│ Your options …               │
│ Penalty: one stroke …        │
│ Example: On the 7th …        │
│ ⓘ Local Rule E-5, if adopted │  caveat block
│ Rules 18.2a · 18.2b ↗        │  official links
│ Related: Rule 18 · Glossary  │
│ Reviewed 12 November 2026    │
│ ─────────────────────────    │
│ …                            │
├──────────────────────────────┤
│ ALL 25 RULES                 │  H2
│ [1][2][3][4][5]              │  number grid, 5 per row
│ [6][7][8][9][10]             │  44px targets
│ … 5 rows                     │
│ FOUNDATIONS AND EQUIPMENT    │  H3
│ Rule 1 · The Game, Player    │  H4 (title wraps)     [⧉]
│ Conduct and the Rules        │
│ Summary …                    │
│ Look here when …             │
│ Read Rule 1 on randa.org ↗   │
│ ← Rule 25    Rule 2 →        │
├──────────────────────────────┤
│ OFFICIAL SOURCES             │
│ RELATED                      │
│ CTA band + store buttons     │
└──────────────────────────────┘
```

### 760 px

```
┌──────────────────────────────────────────────┐
│ Home › Golf rules                             │
│ RULES OF GOLF                                 │  phone frame until
│ Golf Rules Explained                          │  767px, then desktop
│ ┌───────────────────────────────┐             │  search max 560px
│ │ ⌕ What happened to your ball? │             │
│ └───────────────────────────────┘             │
├──────────────────────────────────────────────┤
│ edition notice, one paragraph                 │
├──────────────────────────────────────────────┤
│ [All][Foundations][Playing][Course areas][Re… │
├──────────────────────────────────────────────┤
│ [Lost ball][Out of bounds][Penalty areas]     │  quick cards,
│ [Cart path][Bunkers][Provisional]             │  3 columns
│ [Unplayable][Conceded putts]                  │
├──────────────────────────────────────────────┤
│ situations, one column, 68ch                  │
├──────────────────────────────────────────────┤
│ [1][2][3][4][5][6][7][8][9][10][11][12][13]   │  number grid,
│ [14]…[25]                                     │  2 rows
│ overviews by category, one column             │
└──────────────────────────────────────────────┘
```

### 1100 px

```
┌──────────────────────────────────────────────────────────────┐
│ Home › Golf rules                                  (photo    │
│ RULES OF GOLF                                       subject  │
│ Golf Rules Explained                                right)   │
│ ┌───────────────────────────────┐                            │
│ │ ⌕ What happened to your ball? │  scrim to --copy-span      │
│ └───────────────────────────────┘                            │
├──────────────────────────────────────────────────────────────┤
│ edition notice                                                │
│ [All][Foundations][Playing][Course areas][Relief][Formats]    │  one line
├──────────────────────────────────────────────────────────────┤
│ [Lost ball][Out of bounds][Penalty areas][Cart path]          │  4 columns
│ [Bunkers][Provisional][Unplayable][Conceded putts]            │
├──────────────────────────────────────────────────────────────┤
│ situation ─────────────────────────────────────────── [Copy] │  68ch text;
│ answer, checklist, options …    │ Rules 18.2a ↗              │  citations and
│                                 │ Related                    │  related in a
│                                 │ Reviewed …                 │  side column
├──────────────────────────────────────────────────────────────┤
│ [1]…[13]                                                      │
│ [14]…[25]                                                     │
│ overviews: same two-column entry layout                       │
└──────────────────────────────────────────────────────────────┘
```

From 1100 px an entry's citations, related links and review date move to a side column (about 260px) beside the 68ch text. They stay after the text in the DOM, so reading and tab order don't change.

### 1440 px

Same as 1100, centred in `--max-width`. The extra width goes to the margins, not the measure.

### Overflow rules

- The chip strip scrolls inside its own box (`ChipFilter`, with `scrollIntoStrip` on focus). Six labels fit on one line from about 760px.
- Long rule titles wrap. Rule 14's 120-character title wraps to four lines at 320px; nothing uses `nowrap` except chip labels.
- The number grid uses `grid-template-columns: repeat(auto-fill, minmax(44px, 1fr))` with a 5-column floor, so it never scrolls sideways.
- QA checks `document.documentElement.scrollWidth === innerWidth` at all four widths.

## Entry anatomy

### Situation

```
<article id="lost-ball" data-category="relief" data-scenario-id="lost-ball">
  <h3 tabindex="-1">Lost ball: what happens next?</h3>      copy-link button
  <p>short answer</p>
  <h4>Before you decide</h4> <ul>conditions</ul>
  <h4>Your options</h4> <ol>…</ol>                          when there are choices
  <p><strong>Penalty:</strong> …</p>                        only when sourced
  <p><strong>Example:</strong> …</p>
  <aside>Local Rule / match vs stroke / handicap caveat</aside>   only when present
  <p>Rules: <a data-rules-official>18.2a on randa.org</a> …</p>
  <p>Related: <a data-rules-related>Rule 18</a> · <a data-rules-related>Penalty area (glossary)</a></p>
  <p>Reviewed <time datetime="…">…</time></p>                 published + reviewed only
</article>
```

### Rule overview

```
<article id="rule-18" data-category="relief" data-rule-number="18">
  <h4 tabindex="-1"><span>Rule 18</span> Stroke-and-Distance Relief, …</h4>   copy-link
  <p>summary</p>
  <h5>Look here when</h5> <ul>common questions</ul>
  <p>Situations: <a href="#lost-ball">Lost ball</a> …</p>
  <p><a data-rules-official>Read Rule 18 on randa.org</a></p>
  <nav aria-label="Rule 18">← Rule 17 · Rule 19 →</nav>
  <p>Reviewed …</p>
</article>
```

Category is never shown by colour alone: the category group heading names it. Over-par rose and lime-better colours aren't used on this page; nothing here is a score.

## Flows and states

| State | Behaviour |
|---|---|
| Arrive with no hash | Top of page, no filter, no query |
| Arrive with `#rule-18` or `#lost-ball` | Hash reveal: filter reset to All and search cleared (both announced), target heading focused, scrolled into view under the nav (`--scroll-inset-top`), smooth unless reduced motion |
| Arrive with `?category=relief` | `FilterBoot` paints the filter before hydration; chip selected; status line "8 entries in Relief and penalties" |
| `?category=` plus a hash | The hash wins: the filter resets so the target is visible |
| Empty query | Lists shown; no result list |
| Results | Lists hidden; results grouped Situations then Rules, best first; each shows the title, a one-line snippet and rule refs; up to 8 per group with "Show all n" |
| Exact rule reference (`18`, `rule 18`, `18.2b`) | Rule 18's overview first, then situations that cite that subrule |
| Alias (`OB`, `white stakes`, `water hazard`) | The aliased situation or rule first |
| Typo (`casul water`, `bunkre`) | Fuzzy tier; results labelled "Closest matches" |
| Ambiguous (`drop`) | Ranked normally; situations first; no guess at intent |
| No results | "No match for '<query>'." Suggests a rule number or a topic chip, and links to the R&A rules index. Never a made-up answer. |
| Query plus filter | Results respect the filter; the status line says so, with Clear |
| Back / forward | Walks through categories (`router.push` on chip change); the query isn't in history |
| No JavaScript | Search field and chips hidden (`data-requires-js` + `<noscript>` style); every entry visible; quick cards, number grid and all links work |
| Slow connection | Everything is in the first HTML; JS only adds search and filters |
| Stale source | Not shown to visitors; `lint:content` warns after 100 days and `check-rules-sources` opens an issue (#245) |
| Official page unreachable | Link text names the source and rule, so a reader can find it from the R&A home page |

## Keyboard and focus

- Tab order: nav → breadcrumbs → search → edition notice links → chips → Clear → quick cards → each situation (copy link, official links, related links) → number grid → each overview → sources → related → CTA.
- Escape in the search field clears it and keeps focus there.
- Results are links; Enter jumps to the entry and focus lands on its heading (`tabindex="-1"`).
- Every control shows the lime ring (`--focus-ring-*`). Chips use `scrollIntoStrip`; nothing sticky can cover a focused element (`scroll-padding` with `--scroll-inset-top`).
- Targets are at least 44×44px: chips, quick cards, number grid, copy buttons, previous/next.

## Screen readers

- Landmarks: one `main`; each H2 section is a `section` with `aria-labelledby`.
- Two polite status regions, as in the glossary: the provider's (filter reset, copy confirmation, hash-reveal resets) and the controls' (result count, debounced 600ms: "4 results: 2 situations, 2 rules").
- Chips use `aria-current`, as `ChipFilter` does.
- The search field is a labelled `input type="search"` with `aria-controls="rules-results"`.
- External links say where they go in their text; no "click here".
- The number grid's links are labelled "Rule 1" … "Rule 25" (visible numbers, accessible names with the word).

## Reduced motion and touch

- `prefers-reduced-motion`: jumps are instant; no transitions on reveal.
- Nothing is hover-only. Copy buttons are always visible.

## Visual language

Dark page and glass surfaces from existing tokens (`--glass-surface`, `--card-border`, `--hairline`). Lime (`--accent`) only for focus, the selected chip and links. Rule numbers in the grid and overview headings use the heavy numeral style (800). No `backdrop-filter` on anything sticky; nothing new is sticky. Muted text no lighter than `--text-muted` (`.5` on the page).

## Component plan

| Component | Kind | Notes |
|---|---|---|
| `app/rules/page.tsx` | server | `notFound()` when not visible; metadata; JSON-LD; review banner in dev |
| `RulesProvider` | client | Context: query, category, `choose`, `announce`, `reveal`; owns hash handling. Wraps the page body; server children pass through |
| `RulesSearchField` | client | In PageHero's `search` slot |
| `RulesControls` | client | `ChipFilter`, `FilterStatus`, Clear, result list, no-results |
| `EditionNotice` | server | Reads `edition.ts` |
| `QuickSituations` | server | Eight anchor cards |
| `ScenarioAnswer` | server | One situation; copy link is the only client leaf |
| `RuleNumberGrid` | server | 25 anchors |
| `RuleDirectory`, `RuleOverview` | server | Category groups; previous/next |
| `OfficialSourcesPanel` | server | Sources, disclaimer, "Spot an error?" |
| `RelatedResources` | server | Links from `copy.ts` |
| `FinalCTA` | server (existing) | Copy through the claim guard |
| `CopyLinkButton` | client | Moved from `components/sections/glossary/` to `components/ui/` (#234) |
| `openReport` | module | Moved from the glossary to a shared location (#234) for once-per-load open events |
| `FilterBoot`, `FilterUrlSync`, `FilterStatus`, `ChipFilter` | existing | `?category=` with CSS hiding; `/rules` added to `ROUTE_PARAMS` and `check-filter-css` |

## Analytics hooks

Shipped in #244 (`lib/rulesAnalytics.ts`; definitions in `docs/analytics-data-notes.md`). Params from closed sets only; the query text never leaves the page.

| Event | Fires when | Params |
|---|---|---|
| `rules_search` | Debounced query settles, de-duplicated per `category|normalisedQuery` | `result_bucket`, `match_type`, `category` |
| `rules_filter` | A chip is chosen | `category` |
| `rules_rule_open` | A `#rule-N` reveal (once per rule per load) | `rule_number`, `source`: browse, search, related, or deep_link for the fragment on arrival (#244) |
| `rules_scenario_open` | A situation reveal (once per load) | `scenario_id`, `source` |
| `rules_official_click` | Click on `a[data-rules-official]` | `rule_number`, `document_type` |
| `rules_related_click` | Click on `a[data-rules-related]` | `destination_type`, `content_id` |
| `rules_cta_click` | CTA click | `placement`, `destination_type` |

## QA mapping

Each row becomes an RL-QA check in `launch-packet.md` (#246): every state in [Flows and states](#flows-and-states); the four widths with the overflow check; the Tab walk and focus-ring check; the two status regions with a screen reader (owner, VoiceOver); reduced motion; no-JS; consent for each analytics event.
