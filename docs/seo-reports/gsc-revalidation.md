# Search Console revalidation: run sheet (SEO-07)

How to run soleman23/golowebsite#65 so anyone can reproduce the numbers. This file holds the method only. The results go in a new dated section of `docs/seo-progress.md`; the skeleton is at the bottom.

**When:** between October 22 and November 5, 2026. Record the run date.

**Who:** the owner, or an agent working in a browser signed in to the Search Console domain property `sc-domain:golo.golf`.

## The two windows

Both are 28 days. The deploy went live on October 8, 2026.

- **Before:** September 10 to October 7, 2026, the 28 days before the deploy.
- **After:** the 28 days ending on the run date: run date minus 27 days, through the run date.

Search Console's data usually runs about two days behind. If the last days are empty, keep the window at 28 days: end it on the latest day with data, and start it 27 days before that. For example, a November 4 run with data through November 2 uses October 6 – November 2. Record the run date and both window dates, and work out the overlap from the dates you actually used. The table below assumes no lag.

| Run date | After window | Days shared with Before |
|---|---|---|
| October 22 | Sep 25 – Oct 22 | 13 (Sep 25 – Oct 7) |
| October 29 | Oct 2 – Oct 29 | 6 (Oct 2 – Oct 7) |
| November 4 | Oct 8 – Nov 4 | 0 |
| November 5 | Oct 9 – Nov 5 | 0 |

Note the overlap in the write-up. Running on November 4 or 5 gives two windows that don't overlap. With the two-day lag, an After window that ends on November 2 or 3 shares one or two days with the deploy week.

The October 8 baseline in `docs/seo-progress.md` covers three months, not 28 days, so it isn't the Before window. Re-pull Before from Search Console on the run date.

## Steps

### 1. Performance, both windows

1. Performance → Search results → Date → Custom. Set the Before window. Don't use Compare: a compare export puts both windows in one file, and `scripts/gsc-groups.mjs` reads one window per export.
2. Write down the chart totals: clicks, impressions, average CTR and average position. These are the property totals. The query table leaves anonymized queries out, so its sum comes out lower.
3. Export → Download CSV. Unzip it to a folder outside the repo, e.g. `~/gsc/2026-11-04-before/`.
4. Repeat for the After window, e.g. `~/gsc/2026-11-04-after/`.
5. Run:

   ```bash
   node scripts/gsc-groups.mjs ~/gsc/2026-11-04-after --baseline ~/gsc/2026-11-04-before
   ```

   It prints the query groups with changes against Before, the watched queries ("golo board", "mongolian reversal"), the page groups, and a row per guide and per post. The group definitions live in that script, and SEO-10's monthly reports use the same ones.
6. For each watched query that shows up: Performance → + New → Query → Exact query, then the Pages tab. Record the landing page.

### 2. Page indexing

1. Indexing → Pages. Record the totals for indexed and not indexed.
2. Open each reason under "Why pages aren't indexed" and record every URL.
3. Give every non-indexed URL a reason, marked either "expected" or with a linked issue:
   - **Expected:** the three redirects: the apex domain, `http://`, and the trailing slash. For example, `http://www.golo.golf/blog/` takes two hops: a 301 to `https://www.golo.golf/blog/`, then a 308 to `/blog`.
   - **Expected:** "Alternate page with proper canonical tag", provided the canonical is the URL we declare.
   - **Expected:** `/cookies` and `/acceptable-use` under "Excluded by 'noindex' tag". Both are noindex on purpose.
   - **Expected for now:** a sitemap URL first published fewer than 21 days before the run date and still "Discovered" or "Crawled – currently not indexed".
   - **Defect: open an issue.** Any non-indexed URL whose reason isn't one of the expected cases above. That includes a Google-selected canonical that differs from ours, a soft 404, an unexpected `noindex`, a robots.txt block, a server or redirect error, and a sitemap URL 21 days or older that isn't indexed, with or without a reason.

### 3. URL Inspection

Inspect each URL below. For each one, record whether it's indexed, whether Google's selected canonical matches the canonical we declare, and the last crawl date.

**Guides (8):**

- `https://www.golo.golf/games/skins`
- `https://www.golo.golf/games/nassau`
- `https://www.golo.golf/games/best-score`
- `https://www.golo.golf/games/wolf`
- `https://www.golo.golf/games/bingo-bango-bongo`
- `https://www.golo.golf/games/closest-to-pin`
- `https://www.golo.golf/games/longest-drive`
- `https://www.golo.golf/games/birdies`

**Posts (12, publication date in brackets):**

- `https://www.golo.golf/blog/settle-up-screen` (2026-10-15; under 21 days for runs through November 4. On November 5 it is 21 days old, so the 21-day rule applies)
- `https://www.golo.golf/blog/pressing` (2026-10-10)
- `https://www.golo.golf/blog/index-vs-course-handicap` (2026-10-10)
- `https://www.golo.golf/blog/sandbagging` (2026-10-10)
- `https://www.golo.golf/blog/bandon` (2026-10-09)
- `https://www.golo.golf/blog/scottsdale-trip-structure` (2026-10-08)
- `https://www.golo.golf/blog/rangefinder` (2026-10-07)
- `https://www.golo.golf/blog/who-pays-first` (2026-08-11)
- `https://www.golo.golf/blog/nassau` (2026-07-28)
- `https://www.golo.golf/blog/skins-carryover` (2026-07-14)
- `https://www.golo.golf/blog/wolf` (2026-07-02)
- `https://www.golo.golf/blog/bingo-bango-bongo` (2026-06-18)

The issue counts 11 posts. `settle-up-screen` was published on October 15, after the issue was written, so it's on this list too. Before the run, check the sitemap for anything newer:

```bash
curl -s https://www.golo.golf/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//'
```

On October 16 the sitemap listed 31 URLs.

### 4. Sitemap

Indexing → Sitemaps → `https://www.golo.golf/sitemap.xml`. Record the last read date, its status and the number of discovered pages. Compare that number with the count of sitemap URLs that the Pages report shows as indexed. To get that count, open the Pages report and use the filter set to the submitted sitemap.

### 5. Core Web Vitals

Experience → Core Web Vitals, mobile and desktop. If Search Console says there isn't enough usage data, write that down. Don't substitute Lighthouse or PageSpeed lab numbers.

## Decision rules

- Don't rewrite content because of this data.
- Act only on indexation defects: every non-indexed URL that the triage step can't mark expected (see "Defect" above). Open one issue per defect and link it from the write-up.

## Write-up skeleton for `docs/seo-progress.md`

```markdown
## Search Console revalidation, <run date> (SEO-07)

Property `sc-domain:golo.golf`. Before: 2026-09-10 – 2026-10-07. After: <start> – <end> (<n> days shared with Before). Data through <latest date with data>.

### Performance totals (chart)

| Window | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| Before | | | | |
| After | | | | |

<query groups, watched queries, page groups, guides and posts: paste the output of scripts/gsc-groups.mjs>

Watched queries' landing pages: <query → page, or "not shown">

### Page indexing

Indexed <n>, not indexed <n>.

| URL | Reason | Expected / issue |
|---|---|---|

### URL Inspection

| URL | Indexed | Selected canonical = declared | Last crawl |
|---|---|---|---|

### Sitemap

Last read <date>, <status>, <n> discovered; <n> of the sitemap's URLs indexed.

### Core Web Vitals

<field data per device, or "Not enough usage data">

### Defects opened

<issue links, or "None">
```
