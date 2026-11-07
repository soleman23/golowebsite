# Rules Center checkpoints (#248): run sheet

The four post-launch readings of `/rules`, with the same definitions each time (spec §10). This file holds the procedure, the date windows, the prelaunch baseline and the status. The results go in the monthly reports; this file records where. The metrics are defined once, in `docs/analytics-data-notes.md` § Rules Center events and reporting definitions (#244). Where this file is silent, `glossary-checkpoints.md` applies.

**Launch date L: not set.** #247 sets it: the Pacific day the launch PR merged and `/rules` first returned 200 on www.golo.golf. Record the merge time and the first 200 here, as `glossary-checkpoints.md` does, then fill in the table.

**Status on 2026-11-07:** the Rules Center isn't live (`rulesLive = false`). No checkpoint is due, and no results exist.

| Checkpoint | Run on | Window (Pacific days) | Filed in | Status |
|---|---|---|---|---|
| Launch + 7 days | L+7 | L – L+6 (7 days) | the report for L+7's month | not scheduled |
| Launch + 28 days | L+28 | L – L+27 (28 days) | the report for L+28's month | not scheduled |
| Launch + 56 days | L+56 | L – L+55 (56 days) | the report for L+56's month | not scheduled |
| Launch + 90 days | L+90 | L – L+89 (90 days) | the report for L+90's month | not scheduled |

Each date comes from `date -j -v+Nd -f %F <L> +%F`: N is 7, 28, 56 or 90 for the run date, and one less for the window's last day. Day 1 of every window is L, so it holds only part of a day of the live page. A late run keeps its window and records the day it actually ran. When a checkpoint is filed, change its status to "filed in `<file>` (#<PR>)".

## Where each checkpoint is filed

The glossary's convention (owner, 2026-10-29): a report file is named for the month it's **filed** in and reports the month before, so `2026-12.md` reports November. A checkpoint goes in the report for the month its run date falls in, which is the file named for the following month. A November run goes in `2026-12.md`, not `2026-11.md`.

If the file doesn't exist on the run date, copy `TEMPLATE.md` to it and add a status line: "Monthly sections not filled until <first week of next month>; the Rules Center checkpoint below is filed." Add the checkpoint as `## Rules Center checkpoint: launch + N days (#248)`, after section 7 and after any glossary checkpoint, before Actions. Actions stays last, and each checkpoint action is an issue link there.

## Before launch (#247)

Two things only the launch can start. Without them, L+28 has nothing to compare against and GA4 has no splits.

1. **The prelaunch baseline.** On or after L, export Search Console for the 28 days **L-28 – L-1**, property-wide, to `~/gsc/rules-baseline/`, and run:

   ```bash
   node scripts/gsc-groups.mjs ~/gsc/rules-baseline
   ```

   Paste the property total and the **Rules of Golf** row below, under Baseline. Before L, no page on the site answers a rules query, so this row is what the site drew without the Rules Center.

2. **GA4 custom definitions.** The five below must be registered before L+7, or every split by them is "not available before <registration date>". GA4 doesn't backfill. Record the date they were registered.

### Baseline

| Window | Property clicks | Property impressions | Rules of Golf queries | Impressions | Clicks | Position |
|---|---:|---:|---:|---:|---:|---:|
| L-28 – L-1 | | | | | | |

The "Rules of Golf" group was added to `scripts/gsc-groups.mjs` with #244. It sits after every other named group, so it takes only queries that were Unassigned before it existed. Every other group's numbers are unchanged. A report filed earlier counts those queries under Unassigned.

## GA4 custom definitions (owner step)

Admin → Custom definitions → Create custom dimension, scope **Event**, for each row. Display names can't contain hyphens. Checked read-only on 2026-11-07: 24 of 50 event-scoped dimensions are registered, and these five would make 29. The side-game chooser's five (#224) are still unregistered; with them it's 34.

| Dimension name | Event parameter | Description |
|---|---|---|
| Rules rule number | `rule_number` | Rule 1 to 25 opened, shared or linked to the official text; none for a page-level link |
| Rules open source | `source` | How a rule or situation was reached: browse, search, related or deep_link |
| Rules situation | `scenario_id` | Id of the situation opened or shared, such as lost-ball |
| Rules official document | `document_type` | Official document linked: rules, definitions, clarifications, local-rule or handicapping |
| Rules related content | `content_id` | Rule, situation, glossary term or page a related link went to |

Already registered, and shared with the Rules events: `result_bucket` (Glossary result count), `match_type` (Glossary match type; Rules searches add the value `fuzzy`), `category` (Blog category; Rules topics too), `destination_type` (Glossary destination; Rules related and CTA links too), `placement` (Placement) and `channel` (Share channel). Their display names and descriptions predate the Rules Center. Editing them is optional and also the owner's: the data doesn't change.

`source` isn't on GA4's reserved parameter list (checked 2026-11-07). If GA4 refuses it anyway, say so on #248 rather than renaming the param in code: a rename changes every report.

## Rules for every checkpoint

`glossary-checkpoints.md` § Rules for every checkpoint applies: every number names its source and date range; Search Console and GA4 in separate tables, with no rate mixing the two; a store click isn't an install; Pacific days, and UTC bounds for `leads.sql`; incomplete Search Console days read once complete, without shortening the window; exports outside the repo. Also:

- **No search text.** The events never carry it. Failed searches are read from `result_bucket`, `match_type` and `category`, never from what was typed.
- **One URL.** In Release A every situation and rule is a fragment of `/rules`. Search Console can't split them, so per-situation demand comes from the queries (read B) and from GA4's opens, never from page rows.
- **Known non-visitor traffic.** Read `docs/analytics-data-notes.md` § Test traffic first, and leave out sessions with medium `qa`. The #244 consent harness (2026-11-07) ran against a local build with every Google request answered locally, and sent nothing to GA4. Any live check on launch day that allows analytics is recorded in § Test traffic by #247; report day L on its own line wherever GA4 allows.
- **Opens are once per entry per page load,** and the first source wins. A second open of the same entry on the same page isn't counted. Read them as "entries reached", not "times read".

## Shared reads

Each checkpoint below lists which of these it uses.

### A. Search Console, property-wide

Performance → Search results, search type Web, custom range = the window, no other filters. Export to `~/gsc/rules-L<N>/property`, then:

```bash
node scripts/gsc-groups.mjs ~/gsc/rules-L<N>/property --baseline ~/gsc/rules-baseline
```

Read the **Rules of Golf** row against the baseline. The Δ columns compare equal lengths only at L+28; at L+7, L+56 and L+90, say the lengths differ.

### B. Search Console, the `/rules` page

Same range, with a Page filter: URL is exactly `https://www.golo.golf/rules`. Export the Queries, Pages and Dates tabs to `~/gsc/rules-L<N>/page`, then:

```bash
node scripts/gsc-groups.mjs ~/gsc/rules-L<N>/page
```

- **Page totals** from the chart: clicks, impressions, CTR, position.
- **Non-brand organic clicks:** the page's clicks from queries outside the Branded group, summed from the script's groups. Anonymized queries have no group, so also give the page total and the remainder no exported query accounts for.
- **First impression date:** the earliest date with impressions in the Dates tab.
- Repeat with "URL contains" `/rules`. If it returns more than the exact filter (fragment or `?category=` URLs), report the difference on its own line.

### C. Search Console, indexing

- **URL Inspection** on `https://www.golo.golf/rules`: on Google or not, last crawl, user-declared and Google-selected canonical (it should be `/rules`, with or without `?category=`), and whether the sitemap is listed as a referring source. Record the date checked.
- **Indexing request:** made on launch day, with the owner's yes (#247). Record when; requesting it again is the owner's call too.
- **Sitemaps:** last read date and discovered count for `https://www.golo.golf/sitemap.xml`.
- **Indexation rate:** indexed Rules Center URLs divided by submitted ones. In Release A that's `/rules` alone: 0 of 1 or 1 of 1.
- **Generative AI features** report, Pages tab: the `/rules` row, impressions only. "Not shown" if it isn't listed.
- **Links** report → Top linked pages: the `/rules` row's linking sites (referring domains).

### D. GA4, the consented sample

Property "GoLo Golf" (README § Where the dashboards live). Date range = the window.

- **First, the custom definitions.** Admin → Custom definitions: the five in § GA4 custom definitions, and the six shared ones. Quote each one's registration date. A rate that needs one registered after the window opened is "not available before <date>".
- **Rules landing visits:** sessions whose landing page is `/rules`, and engaged sessions.
- **Event counts:** `rules_search`, `rules_filter`, `rules_rule_open`, `rules_scenario_open`, `rules_official_click`, `rules_related_click`, `rules_cta_click`, `share_click` with a `scenario_id` or `rule_number`, and on page path `/rules` `store_button_click`.
- **Rates,** exactly as `docs/analytics-data-notes.md` defines them: qualified app-download clicks, rules-to-product CTR, search success, no-result rate, typo rescues. Print each with its numerator and denominator.
- **No-result rate, split:** by `category`. The `match_type: none` count must equal the `result_bucket: 0` count; if not, say so. A zero inside a topic can be an entry that lives in another topic (the no-results block offers "Search all").
- **Opens by source:** `rules_scenario_open` and `rules_rule_open` by `source`. A high `deep_link` share means shared and inbound links are doing the work; a high `search` share means the field is.

### E. Leads

`docs/seo-reports/leads.sql`, read-only, `start_at` = L, `end_at` = the day after the window's last day. Query 2's rows with landing path `/rules`. The lead table is the volume source; it isn't the GA4 population, so the two aren't divided into each other.

### F. Live site

On `https://www.golo.golf` (the apex 308s; use the www host or `curl -L`):

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://www.golo.golf/rules
curl -s https://www.golo.golf/sitemap.xml | grep -A1 '<loc>https://www.golo.golf/rules</loc>'
curl -s https://www.golo.golf/llms.txt | grep -n -i rules
```

Broken links. Save the page once, then check every internal path and every in-page fragment. Each loop prints nothing when everything resolves:

```bash
mkdir -p ~/gsc/rules-L<N>
curl -s https://www.golo.golf/rules -o ~/gsc/rules-L<N>/rules.html
F=~/gsc/rules-L<N>/rules.html
grep -o 'href="/[^"]*"' "$F" | sed 's/^href="//;s/"$//;s/#.*//' | sort -u |
  while read -r p; do printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "https://www.golo.golf$p")" "$p"; done | grep -v '^200 '
grep -o 'href="\(/rules\)\?#[^"]*"' "$F" | sed 's/^href="[^#]*#//;s/"$//' | sort -u |
  while read -r id; do grep -q "id=\"$id\"" "$F" || echo "missing #$id"; done
```

Official links: the latest run of the monthly `rules-sources` workflow (`docs/rules/maintenance.md`) or `npm run check:rules-sources` on the day; the USGA links by hand in a browser, since they refuse scripts. Inbound links: each page in `docs/rules/canonical-map.md`'s link map still has its link to `/rules`, and its fragment is in the list above.

## Launch + 7 days

**Status: not scheduled.** Window L – L+6. Reads: C, F, D (events firing and custom definitions only), B (first impression only).

| Check | Expected | Result (date checked) |
|---|---|---|
| `/rules` status | 200 | |
| In the live sitemap, with lastmod | yes | |
| In `llms.txt` | yes | |
| Sitemap last read by Google | after L | |
| URL Inspection | on Google, declared canonical | |
| Indexing request | made on L with the owner's yes (#247) | |
| Internal links and fragments | nothing printed | |
| Official links | source check green; USGA links open | |
| Inbound links (link map) | all present | |
| GA4 custom definitions for the five Rules params | registered, with dates | |
| Each Rules event seen in GA4 at least once | yes | |
| First impression date for `/rules` | | |

Then the actions, as issue links: anything broken, a dimension still unregistered (for the owner), and anything not on Google.

## Launch + 28 days

**Status: not scheduled.** Window L – L+27, the same length as the baseline. Reads: A, B, C, D, E.

| Table | Source |
|---|---|
| Property total and query groups, Rules of Golf against the baseline | A |
| `/rules` page totals, its query groups, non-brand clicks, top queries | B |
| Indexing status, indexation rate, Generative AI features row, referring domains | C |
| Landing visits, engaged sessions, event counts, the rates, no-result rate by topic, opens by source | D |
| `rules_official_click` by `document_type`; `rules_cta_click` and `store_button_click` on `/rules` | D |
| Leads landing on `/rules` | E |

## Launch + 56 days

**Status: not scheduled.** Window L – L+55. Reads: A, B, C, D, E.

- **Ranking movement:** run B twice, for L – L+27 and L+28 – L+55 (28 days each), and pass the first as `--baseline` to the second. Compare `/rules`' position and the Rules of Golf row.
- **Which situations and rules draw queries:** from B's queries, list the ones that ask about one situation or rule and map each to its record id by hand (`lost-ball`, `rule-18`). From D, `rules_scenario_open` by `scenario_id` and `rules_rule_open` by `rule_number`, each by `source`.
- **Candidates for #249:** a situation qualifies only if B shows Search Console demand for it (queries mapped to it above, with their impressions) and a standalone page would add something the hub can't hold, such as an original diagram or a worked example (#249's gate). List each candidate with its queries and impressions, and what the page would add. The agent drafts; the owner decides whether #249 starts.
- **Content-quality issues:** no-result searches by topic; `fuzzy` share; correction issues opened under `docs/rules/maintenance.md` (a count, with links); anything a reading of the cited records turns up. Each becomes an issue link.

## Launch + 90 days

**Status: not scheduled.** Window L – L+89. Reads: A, B, C, D, E. Also run B for the latest 28 days, L+62 – L+89, against L – L+27.

The section ends with a written decision for the Rules Center: **expand, improve, consolidate or stop.** The agent drafts the evidence and the options; the decision is the owner's, recorded with the date the owner gave it. Then list the issues it opens or closes, including what it means for #249 (standalone situation pages) and #250 (a guided finder, gated on #249 and on the search behaviour and no-result evidence here).

#248 closes when all four sections are filed and this one has its decision.
