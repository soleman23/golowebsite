# Glossary checkpoints (#167): run sheet

The four post-launch readings of `/glossary`, with the same definitions each time (spec §9.4–9.5). This file holds the procedure, the date windows and the status. The results go in the monthly reports, as #167 asks; this file only records where.

**Launch date L: 2026-10-29.** #201 merged at 17:21 PDT and `/glossary` returned 200 on www.golo.golf at 17:23 PDT (#166). Day 1 of every window is October 29, so it holds about 6.5 hours of the live page.

**Status on 2026-10-30:** none due. No results exist yet, and none are written below.

| Checkpoint | Run on | Window (Pacific days) | Filed in | Status |
|---|---|---|---|---|
| Launch + 7 days | Thu 2026-11-05 | 2026-10-29 – 2026-11-04 (7 days) | `2026-12.md` | pending |
| Launch + 28 days | Thu 2026-11-26 | 2026-10-29 – 2026-11-25 (28 days) | `2026-12.md` | pending |
| Launch + 56 days | Thu 2026-12-24 | 2026-10-29 – 2026-12-23 (56 days) | `2027-01.md` | pending |
| Launch + 90 days | Wed 2027-01-27 | 2026-10-29 – 2027-01-26 (90 days) | `2027-02.md` | pending |

November 26 is Thanksgiving and December 24 is Christmas Eve. A late run keeps its window and records the day it actually ran. The dates come from `date -j -v+Nd -f %F 2026-10-29 +%F`.

When a checkpoint is filed, change its status here to "filed in `<file>` (#<PR>)".

## Where each checkpoint is filed

The owner set the naming on 2026-10-29: a report file is named for the month it's **filed** in and reports the month before. `2026-11.md` reports October 2026 and is filed November 1–7. The template's own text still describes the other convention, so each report says in its header which one it follows.

A checkpoint goes in the report for the month it falls in, which is the file named for the following month:

- **L+7 and L+28** (November) go in `2026-12.md`, which reports November and is filed December 1–7.
- **L+56** (December) goes in `2027-01.md`.
- **L+90** (January) goes in `2027-02.md`.

Not `2026-11.md`. It reports October and is filed by November 7, three weeks before L+28. L+7 falls in its filing week, but putting it there would mix a November reading into the October report.

If the file doesn't exist on the run date, copy `TEMPLATE.md` to it and add a status line: "Monthly sections not filled until <first week of next month>; the glossary checkpoint below is filed." Add the checkpoint as `## Glossary checkpoint: launch + N days (#167)`, after section 7 and before Actions. Actions stays last, and each checkpoint action is an issue link there.

## Rules for every checkpoint

These add to the rules at the top of `TEMPLATE.md`.

- **Every number names its source and date range,** so it can be reproduced. Where a source has nothing, write "not available". Never estimate.
- **Search Console and GA4 stay in separate tables.** Search Console is the property's totals. GA4 is a sample of visitors who chose analytics in Privacy choices, with GPC respected. No rate takes its numerator from one and its denominator from the other, and there's no blended funnel rate.
- **A store click isn't an install.** `store_button_click` counts clicks to Google Play. Verified acquisition comes only from store or app attribution where it exists; if none is read, write "not available".
- **No search text.** The events never carry it, and nothing here asks for it. Failed searches are read from `result_bucket` and `match_type`.
- **Time zones:** Search Console days and GA4 (reporting time zone Los Angeles) are Pacific. `leads.sql` takes UTC bounds: for a window ending on day D, `end_at` is the day after D at 00:00 UTC.
- **Incomplete days:** Search Console runs about two days behind and marks the latest days "Data is still being collected". If the window's last day isn't complete on the run date, read Search Console as soon as it is and record that date. Don't shorten the window: L+28 has to match the 28-day prelaunch baseline.
- **Known non-visitor traffic:** read `docs/analytics-data-notes.md` § Test traffic first, and leave out sessions with medium `qa`. October 29 includes the launch-day live checks in #166. The consent suite answered Google's requests locally, but the record doesn't say that for every other live run, so report October 29 on its own line wherever GA4 allows.
- **Exports stay outside the repo,** in `~/gsc/glossary-L<N>/` (Search Console) and the run's notes. Paste only counts.

## Shared reads

Each checkpoint below lists which of these it uses.

### A. Search Console, property-wide

Performance → Search results, search type Web, custom range = the window, no other filters. Export, then:

```bash
node scripts/gsc-groups.mjs ~/gsc/glossary-L<N>/property --baseline ~/gsc/2026-10-29-after
```

The baseline export is the prelaunch window, **2026-09-30 – 2026-10-27** (28 days, #65's After window and #167's prelaunch baseline): property total 4 clicks, 404 impressions. Its Glossary / definitions row was 3 queries, 4 impressions, 0 clicks, position 70.5 (`docs/seo-progress.md` § Search Console revalidation). Read the **Glossary / definitions** row against it. The Δ columns compare equal lengths only at L+28; at L+7, L+56 and L+90, say the lengths differ.

### B. Search Console, the `/glossary` page

Same range, with a Page filter: URL is exactly `https://www.golo.golf/glossary`. Export the Queries, Pages and Dates tabs, then run the script on that export (no `--sitemap`):

```bash
node scripts/gsc-groups.mjs ~/gsc/glossary-L<N>/page
```

- **Page totals** from the chart: clicks, impressions, CTR, position.
- **Non-brand organic clicks** (`docs/analytics-data-notes.md`): the page's clicks from queries outside the Branded group, summed from the script's groups. Anonymized queries have no group, so also give the page total and the remainder that no exported query accounts for.
- **First impression date:** the earliest date with impressions in the Dates tab.
- Repeat with "URL contains" `/glossary`. If it returns more than the exact filter (fragment or parameter URLs), report the difference on its own line.

### C. Search Console, indexing

- **URL Inspection** on `https://www.golo.golf/glossary`: on Google or not, last crawl, user-declared and Google-selected canonical, and whether the sitemap is listed as a referring source. Record the date checked. (Launch day: on Google, crawled 17:32 PDT, declared canonical, discovered without the sitemap; `docs/seo-progress.md`.)
- **Sitemaps:** last read date and discovered count for `https://www.golo.golf/sitemap.xml`. It was last read October 20, before `/glossary` was in it.
- **Indexation rate** (spec §9.4): indexed glossary URLs divided by submitted indexable glossary URLs. Today that's `/glossary` alone, so it's 0 of 1 or 1 of 1.
- **Generative AI features** report, Pages tab: the `/glossary` row, impressions only. "Not shown" if it isn't listed.

### D. GA4, the consented sample

Property "GoLo Golf" (README § Where the dashboards live). Date range = the window.

- **Before the first read (L+7): check the custom definitions.** Admin → Custom definitions should list event-scoped dimensions for `result_bucket`, `match_type`, `term_id`, `destination_type` and the glossary's `category`. The README records 20 registered before the glossary existed; whether these were added isn't recorded. GA4 doesn't backfill a dimension registered later, so report any rate that needs a missing dimension as "not available before <registration date>". Registering one is a change to the GA4 property for the owner to approve, not part of this run.
- **Glossary landing visits:** sessions whose landing page is `/glossary` (Reports → Engagement → Landing page). Also engaged sessions.
- **Event counts:** `glossary_search`, `glossary_filter`, `glossary_term_open`, `glossary_cta_click`, `share_click` with a `term_id`, and on `/glossary` `store_button_click` and `cta_click` (`page: "glossary"`).
- **Rates**, exactly as `docs/analytics-data-notes.md` § Glossary events and reporting definitions defines them: glossary-to-product CTR, store-click rate, search success, zero-result rate. Print each rate with its numerator and denominator.
- **Zero-result rate, split:** `glossary_search` with `result_bucket` `0`, by `category`. In the code, `match_type` is `none` exactly when there are no results (`lib/content/glossary/search.ts`), so the `match_type: none` count must equal the `result_bucket: 0` count. If they differ, say so; it means an event or a dimension is wrong. A zero inside a category can be a term that lives in another category.
- **Newsletter signup rate:** not measured; the hub has no newsletter band while #121 is on hold.

### E. Leads

`docs/seo-reports/leads.sql`, read-only, `start_at=2026-10-29`, `end_at` = the day after the window's last day. Query 2's rows with landing path `/glossary`. The lead table is the volume source; it isn't the GA4 population, so the two aren't divided into each other.

### F. Live site

On `https://www.golo.golf` (the apex 308s; use the www host or `curl -L`):

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://www.golo.golf/glossary
curl -s https://www.golo.golf/sitemap.xml | grep -A1 '<loc>https://www.golo.golf/glossary</loc>'
curl -s https://www.golo.golf/llms.txt | grep -n -i glossary
```

Broken links. Save the page once, then check every internal path and every in-page fragment. Each loop prints nothing when everything resolves:

```bash
curl -s https://www.golo.golf/glossary -o ~/gsc/glossary-L<N>/glossary.html
F=~/gsc/glossary-L<N>/glossary.html
grep -o 'href="/[^"]*"' "$F" | sed 's/^href="//;s/"$//;s/#.*//' | sort -u |
  while read -r p; do printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "https://www.golo.golf$p")" "$p"; done | grep -v '^200 '
grep -o 'href="\(/glossary\)\?#[^"]*"' "$F" | sed 's/^href="[^#]*#//;s/"$//' | sort -u |
  while read -r id; do grep -q "id=\"$id\"" "$F" || echo "missing #$id"; done
```

A dry run of both loops on 2026-10-30 checked 39 internal paths and 75 fragments and printed nothing. That's a test of the commands, not the L+7 reading. External links (Google Play, social profiles) are checked by opening them, since some hosts refuse `curl`. The inbound links into `/glossary` are listed in `docs/glossary/launch-packet.md` § Link map; check each page still has its link and that the fragment is in the list above.

## Launch + 7 days: 2026-11-05

**Status: pending.** Window 2026-10-29 – 2026-11-04. Reads: C, F, D (events firing only), B (first impression only).

| Check | Expected | Result (date checked) |
|---|---|---|
| `/glossary` status | 200 | |
| In the live sitemap, with lastmod | yes, `2026-10-29T00:00:00.000Z` | |
| Sitemap last read by Google | after 2026-10-29 | |
| URL Inspection | on Google, declared canonical | |
| Indexing request | made 2026-10-29 ~17:31 PDT (#166) | done |
| Internal links and fragments | nothing printed | |
| Inbound links (link map) | all present | |
| GA4 custom definitions for the glossary params | registered | |
| Each glossary event seen in GA4 at least once | yes | |
| First impression date for `/glossary` | | |

Then the actions, as issue links: anything broken, a dimension that needs registering (for the owner), and anything not on Google.

## Launch + 28 days: 2026-11-26

**Status: pending.** Window 2026-10-29 – 2026-11-25, the same length as the prelaunch baseline. Reads: A, B, C, D, E.

| Table | Source |
|---|---|
| Property total and query groups, Glossary / definitions against the prelaunch baseline | A |
| `/glossary` page totals, its query groups, non-brand clicks, top queries | B |
| Indexing status, indexation rate, Generative AI features row | C |
| Landing visits, engaged sessions, event counts, the four rates, zero-result rate by category | D |
| Leads landing on `/glossary` | E |

#168 may start once this section is filed (its gate). Record that the gate is met, not that #168 has started.

## Launch + 56 days: 2026-12-24

**Status: pending.** Window 2026-10-29 – 2026-12-23. Reads: A, B, C, D, E.

- **Ranking movement:** run B twice, for 2026-10-29 – 2026-11-25 and 2026-11-26 – 2026-12-23 (28 days each), and pass the first as `--baseline` to the second. Compare `/glossary`'s position and the Glossary / definitions row.
- **Which terms and categories draw queries:** from B's queries, list the ones that name a published term and map each to the term's slug by hand. From D, `glossary_term_open` by `term_id` and by `category`.
- **Referral paths into guides:** `glossary_cta_click` by `destination_type` (`guide`, `post`, `page`), and `link_click` events on `/glossary` whose `link_url` starts with `/games/` or `/blog/`. GA4 sample only.
- **Content-quality issues:** zero-result searches by category; "term missing" messages the owner received, as a count with no names or addresses; anything a reading of the cited GoLo pages turns up. Each becomes an issue link.

#169 may start once this section is filed and #78's plan is in (its gate). Record whether both hold.

## Launch + 90 days: 2027-01-27

**Status: pending.** Window 2026-10-29 – 2027-01-26. Reads: A, B, C, D, E. Also run B for the latest 28 days, 2026-12-30 – 2027-01-26, against 2026-10-29 – 2026-11-25.

The section ends with a written decision for the glossary: **expand, optimise, consolidate or stop.** The agent drafts the evidence and the options; the decision is the owner's, and it's recorded with the date the owner gave it. Then list the issues it opens or closes, including what it means for #168 (later batches), #169 (standalone term pages; spec §6.1's five criteria) and #170 (visual tools, which may start after this section is filed).

#167 closes when all four sections are filed and this one has its decision.
