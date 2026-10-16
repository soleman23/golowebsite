# SEO/AIO report: <Month YYYY>

Copy this file to `docs/seo-reports/YYYY-MM.md` and fill it in during the first week of the next month. Use the same query and page groups every month. They're defined in `scripts/gsc-groups.mjs`, the same ones the SEO-07 revalidation uses (soleman23/golowebsite#65).

Rules:

- Every number names its source and date range. Write "not available" where a source has nothing. Never estimate.
- Exports and query results stay outside the repo. Paste only the counts.
- No phone numbers, emails, names or other personal data, ever. The SQL below doesn't select any.
- If an AI answer gets GoLo wrong, open a content issue against the page it cited and fix the page's facts. Never add hidden "AI text".

**Period:** <first day> – <last day>. **Compared with:** <previous month>. **Filed:** <date>, by <who>.

## 1. Search visibility

Source: Search Console → Performance → Search results, for this month and for last month as two separate exports. Then:

```bash
node scripts/gsc-groups.mjs <this-month-export> --baseline <last-month-export> --sitemap <month-end-sitemap.xml>
```

The guide and post tables list every page in the sitemap you pass. Use the sitemap as it stood on the month's last day, saved then with `curl -s https://www.golo.golf/sitemap.xml > ~/gsc/sitemap-YYYY-MM.xml`. A live sitemap fetched later lists pages published after the month ended, and they'd show as "not in the export". If no snapshot was saved, use the live one and strike any page published after the period ends.

| | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| Property total (chart), this month | | | | |
| Property total (chart), last month | | | | |

<paste the script's query groups, watched queries, page groups, guides and posts tables>

Indexed pages (Indexing → Pages): <n> indexed, <n> not indexed, on <date>. <Note any change in reasons since last month.>

## 2. Branded demand

Use the Branded row from the query groups. Keep a running table, adding one row a month:

| Month | Branded impressions | Branded clicks | Position |
|---|---:|---:|---:|
| | | | |

Off-topic GOLO queries (diet, putters, dice, board) don't count as demand for GoLo. Report them separately only if they grow.

## 3. Content discovery

For each page first published in the last 60 days:

| URL | Published | First impression (Performance, filtered to the page) | Indexed on (URL Inspection) | Days to index |
|---|---|---|---|---|
| | | | | |

## 4. AI referral visibility

- **Leads.** Query 1 in `docs/seo-reports/leads.sql`: leads whose `landingSource` or `referrerHost` is an AI assistant host.

  | Kind | Recorded as | Host | Leads |
  |---|---|---|---:|
  | | | | |

- **GA4 "AI assistants" channel** (set up in #66). Reports → Acquisition → Traffic acquisition, with the custom channel group selected. This is a sample of visitors who chose analytics in Privacy choices: there's no banner, and GPC is respected. Treat it as a direction, not a volume.

  | Channel | Sessions | Key events (generate_lead) |
  |---|---:|---:|
  | AI assistants | | |

- **A Search Console AI-surface report,** if Google offers one by then. When this template was written (October 2026), AI Overviews and AI Mode traffic was counted in the Web totals with no separate breakdown. If that's still true, write "not available".

## 5. AI answer accuracy

Run each prompt by hand in a fresh, signed-out session where possible. Use ChatGPT (search on), Perplexity, Gemini and Google AI Mode. Don't automate it.

Starter prompts. Keep the set fixed so months compare; add new ones at the end.

1. What is GoLo Golf?
2. App to track golf side bets like Nassau and skins
3. How do you settle a Nassau with presses
4. Golf trip betting structure for 8 players
5. Handicap index vs course handicap

Record one row per prompt and engine:

| # | Engine | golo.golf cited? | Page cited | Describes GoLo correctly? | Notes |
|---|---|---|---|---|---|
| | | | | | |

"Correctly" means all three of these:

- It describes GoLo as a scorekeeper for side games.
- It says GoLo doesn't hold or move money.
- It gives the current status: in private testing, store apps not out yet. After launch, check against `lib/content/capabilities.ts` instead.

Any "no" in that column needs an issue link in Notes.

## 6. Conversions

Query 2 in `docs/seo-reports/leads.sql` gives leads by landing path and form placement. Query 3 gives them by source bucket.

| Kind | Landing path | Placement | Leads |
|---|---|---|---:|
| | | | |

| Bucket | Phone | Newsletter |
|---|---:|---:|
| AI assistants | | |
| Search | | |
| Social | | |
| Other referrer or tag | | |
| Direct or not recorded | | |

The lead table is the volume source. GA4 key events cover only the opted-in sample.

## 7. Outreach log

One row per message the owner sent this month, from the SEO-22 target list (`docs/outreach.md`, added by soleman23/golowebsite#80's PR). Record no contact details, only the target's name as listed there.

| Date sent | Target | Page offered | Reply | Link or mention earned (URL) |
|---|---|---|---|---|
| | | | | |

## Actions

Each action is an issue link. A finding with no issue isn't an action.

- <issue link: one line on what and why>
