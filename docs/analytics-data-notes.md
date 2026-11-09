# Analytics data notes

What's in the GA4 property ("GoLo Golf", `G-36182P0H4D`) and the Clarity
project ("GoLo Golf Website", `z0fu5ddehq`) that shouldn't be read as normal
opted-in traffic, and what can be done about it. Nothing listed here has been
deleted or filtered. Every deletion option below is irreversible.

## Collection without opt-in, October 19–20, 2026

Production deploys a couple of minutes after a merge to `main`. Times are
merge time plus the deploy delay we measured; a visitor who already had a page
open kept the old code until they reloaded, so the edges are approximate.

| From (UTC) | To (UTC) | Pacific (Oct 19) | What ran without asking |
| --- | --- | --- | --- |
| ~01:07 Oct 20 (#113, merged 01:05:47) | ~04:12 Oct 20 (#115, merged 04:10:17) | ~6:07 PM – 9:12 PM PDT | GA4 for every visitor unless they declined or sent GPC |
| ~02:04 Oct 20 (#114, merged 02:02:14) | ~04:12 Oct 20 | ~7:04 PM – 9:12 PM PDT | Microsoft Clarity recordings for every visitor unless they declined or sent GPC |

Before ~01:07 UTC the site was opt-in with no notice (effectively only the
owner). From ~04:12 UTC it is explicit opt-in (#115). Treat GA and Clarity data
inside the window as collected without consent, and report it separately.

## Glossary events and reporting definitions (#165)

Added with the glossary hub; nothing fires until the glossary is live (`lib/content/glossary/launch.ts`) and a visitor has opted in. Every call goes through `track()`, so the consent gate (`__goloAnalyticsAllowed`), GPC and redaction apply. Params are closed sets: a published term id, a category id, a bucket. **The search text is never sent**: not as a param, not in a URL (it never enters the URL), not in the console.

| Event | Fires | Params |
|---|---|---|
| `glossary_search` | Once per settled search: 600 ms after typing stops, and only if the normalised query or category changed since the last one reported. A 10-character query typed straight through sends one event. | `category` (`all` or a category id), `result_bucket` (`0`, `1`, `2-5`, `6+`), `match_type` (`exact`, `alias`, `partial`, `none`) |
| `glossary_filter` | The reader chose a category: a chip, Clear, or "Search all terms". Not the initial read of `?category=` and not a deep link resetting it. | `category` |
| `glossary_term_open` | A term was opened: a search result, a related-term link, or arrival on `/glossary#<slug>`. Once per term per page load. Nothing expands on the hub (docs/glossary/ux.md D5), so this replaces the spec's "definition expanded". | `term_id`, `category` |
| `glossary_cta_click` | A term's guide, post, Rules Center or product link was followed (product links, by `ctaIntent`, go to `/games`, `/features` or `/how-it-works` and report `page`; a `/rules#…` link reports `rules`, from #247). | `term_id`, `destination_type` (`guide`, `post`, `rules`, `page`) |
| `share_click` | Reused for the copy-link button, so every share sits in one report. A blog share has `post`; a glossary share has `term_id`. | `channel` (`copy`), `term_id` |

Unchanged and reused: `store_button_click` and `cta_click` (with `page: "glossary"`) for the CTA band, `link_click` for internal links (a term anchor reports as `/glossary#press`, the term name as its text), `newsletter_signup` (the hub has no newsletter band while #121 is on hold). `docs/seo-reports/leads.sql` counts `/glossary` as a landing path; a category view lands as `/glossary` because `landingPath` never keeps the query string.

Metric definitions (spec §9.4). Report each with its date range and its source, and never combine the two sources into one funnel rate:

- **Non-brand organic clicks**: Search Console clicks to `/glossary` from queries outside the Branded group (`scripts/gsc-groups.mjs`). Search Console totals, not a sample.
- **Glossary landing visits**: GA4 sessions starting on `/glossary`. A consented sample, not all visitors.
- **Glossary-to-product CTR**: consented sessions on `/glossary` with a `glossary_cta_click`, `cta_click` or `store_button_click`, divided by consented sessions on `/glossary`.
- **Store-click rate**: consented sessions on `/glossary` with a `store_button_click`, divided by consented sessions on `/glossary`. A store click is not an install.
- **Search success**: of the `glossary_search` events whose `result_bucket` isn't `0`, the share followed by a `glossary_term_open` or `glossary_cta_click` before the next `glossary_search` in the same session. Computed from event order within a session (`ga_session_id`, then `event_timestamp` in the BigQuery export, or a path exploration in GA4) and the `result_bucket` param; no search text is sent or needed. Numerator and denominator are the same set of searches, so the rate can't pass 100%, and a zero-result search never counts as a success.
- **Zero-result rate**: `glossary_search` with `result_bucket` `0`, divided by all `glossary_search`.
- **Newsletter signup rate**: not measured on the hub while the band is on hold.
- **Verified acquisition**: only from store or app attribution where it exists. Never inferred from clicks.

## Side-game chooser events and reporting definitions (#224)

Added with `/games/chooser`. As with every event, nothing is sent until a visitor opts in, and every call goes through `track()`. Params are closed sets: radio values, a player count from 2 to 12, a format id and a rank. Nothing typed is ever sent, because the chooser has no text input. The shared URL carries the same closed values and nothing else (`lib/chooser/url.ts`).

| Event | Fires | Params |
|---|---|---|
| `chooser_result` | An answer set has stood for 1.5 seconds with a player count chosen. Once per distinct answer set per page load. A shared link's answers count; clicking through the five radio groups sends at most one event per set the reader stopped on. | `group` (`players/partners/handicaps/scoring/holes`, `-` where unanswered, e.g. `4/either/apart/simple/18`), `result_count` (picks shown, `0`–`3`), `top_pick` (format id, or `none`) |
| `chooser_guide_click` | A pick's guide or further-reading link was followed, in the live results only. The worked example's links report through `link_click` as usual. | `format` (format id), `rank` (`1`–`3`) |
| `share_click` | Reused for "Copy link to these answers". | `channel` (`copy`), `page` (`chooser`) |

**Page views.** The answers live in the URL (`?players=4&partners=solo&…`) so a result can be shared, reloaded and come back to with Back. The web stream's enhanced measurement counts browser-history changes as page views ("Page changes based on browser history events" was on when checked on 2026-11-03), so the chooser keeps those history changes to one per settled answer set. Since 2026-11-09 every answer goes into the address bar at once, through the browser's own `History.prototype.replaceState` with the entry's existing state: gtag.js wraps `window.history.replaceState`, not the prototype, so it doesn't see that write, and Next's wrapper passes an entry with its own state through untouched. A reload or a copied address therefore always has the current answers. Next's router, and GA4 with it, are told through `window.history.replaceState` once the answer set has stood for 1.5 seconds, the same moment `chooser_result` is judged, and at once before a link is followed or the tab is hidden. Reset writes straight away. Measured 2026-11-09 with the live gtag.js and every hit answered locally (none sent): the native write sent no `page_view`, the later write to the same URL sent one, and a reload after the native write loaded the new answers. Before 2026-11-09 the address bar waited the same 1.5 seconds, so a reload inside that wait showed the previous answers. A consented visit can therefore show one extra `page_view` of `/games/chooser` per settled answer set: count chooser visits by sessions or landing page, not views, and read views per session on this page as inflated. Measured on 2026-11-05 in headless Chrome with the live gtag.js and every hit intercepted locally (none sent): three `replaceState` calls 1.2 seconds apart sent three `page_view`s, the same as `pushState`; five chooser answers 150 ms apart sent one, about six seconds after the write. The radios sit in a labelled `<form>`, so enhanced measurement's form interactions also send one `form_start` on the first answer of a page view; nothing submits, so there's no `form_submit`. Leave `form_start` on this page out of any form-completion rate. The analytics URL cleaner (`dropUnusedQueryParams` in `lib/analyticsPreference.ts`) keeps exactly the answers the chooser reads on `/games/chooser`: one copy of a duplicated answer whose copies agree, none of one whose copies disagree, and nothing else but campaign fields. `scripts/test-chooser.mjs` runs the real cleaner over every answer set.

Unchanged and reused: `cta_click` and `store_button_click` with `page: "chooser"` for the closing band, and `link_click` for every internal link. `leads.sql` counts `/games/chooser` as a landing path. `scripts/gsc-groups.mjs` puts it in its own **Tools** page group, so it never inflates the guide totals.

**Custom definitions.** Registered on 2026-11-09 at about 13:20 PST (21:20 UTC), on the owner's authorization for this task, in property "GoLo Golf" (Admin → Custom definitions). All five are Event scope; none existed before, so nothing was reused or duplicated. That made 34 of 50.

| Display name | Parameter | Sent as |
|---|---|---|
| Chooser group | `group` | text, e.g. `4/either/-/-/-` |
| Chooser result count | `result_count` | number, `0`–`3` |
| Chooser top pick | `top_pick` | text, a format id or `none` |
| Chooser format | `format` | text, a format id |
| Chooser rank | `rank` | number, `1`–`3` |

The payloads were read the same day from hits a production build sent to a local stand-in for GA (none reached Google): `chooser_result` carried `ep.group`, `epn.result_count` and `ep.top_pick`, and `chooser_guide_click` carried `ep.format` and `epn.rank`. GA4 doesn't backfill, so every split by these five is "not available before 2026-11-09". The chooser went live at 12:55 PST that day, so only its first 25 minutes of events, if any, can't be split. Configuration is checked; collection and processed reporting are separate: Realtime showed no `chooser_*` event at 13:22 PST, and processed reports lag 24 to 48 hours. Confirm the first split in the November report before quoting any.

What each one is for:

- **Group shapes** (`group`): which sizes and constraints people bring. It's evidence for the next tool. For example, many `5/`–`12/` groups would support the trip-format builder (#106 Phase 2, tool 4).
- **Empty-result rate**: `chooser_result` with `result_count` `0`, divided by all `chooser_result`. The rules make only two- or three-player team requests empty, so a high rate means the partner question needs rewording, not that formats are missing.
- **First-pick distribution** (`top_pick`): which guides the chooser sends people towards. Read it against those guides' Search Console and engagement numbers before deepening one.
- **Pick-to-guide rate**: consented sessions with a `chooser_guide_click`, divided by consented sessions with a `chooser_result`. A GA4 sample, never compared with Search Console. Its `rank` split shows whether the first pick is the one people open.
- **What these events aren't**: a guide click isn't a decision to play, and a `store_button_click` isn't an install. Verified acquisition comes only from store or app attribution.

## Rules Center events and reporting definitions (#244)

Added with the Rules Center (`/rules`), live since 2026-11-07 (#269; the flag is in `lib/content/rules/launch.ts`). Nothing fires until a visitor has opted in. Every call goes through `track()` by way of `lib/rulesAnalytics.ts`, which types each event's params and checks the values the hub's `data-*` attributes carry against closed sets: a bucket, a match type, a topic id, a rule number from 1 to 25, a record id, glossary slug or site path, a document type, a CTA destination. A value outside its set sends nothing. **The search text is never sent**: not as a param, not in a URL (it never enters the URL), not in the console. The consent harness of 2026-11-07 checked that in every captured request (#244, recorded on #246).

| Event | Fires | Params |
|---|---|---|
| `rules_search` | Once per settled search: 600 ms after typing stops, and only if the normalised query or the topic changed since the last one reported. | `category` (`all` or a topic id), `result_bucket` (`0`, `1`, `2-5`, `6+`), `match_type` (`exact`, `alias`, `partial`, `fuzzy`, `none`) |
| `rules_filter` | The reader chose a topic: a chip, Clear, or "Search all". Not the initial read of `?category=` and not a deep link resetting it. | `category` (`all`, `foundations`, `playing`, `course-areas`, `relief`, `formats`) |
| `rules_rule_open` | A rule overview was shown. Once per rule per page load; the first open's source is the one reported. Nothing expands on the hub (docs/rules/ux.md D2), so "open" means the page moved to it. | `rule_number` (`1`–`25`), `source` |
| `rules_scenario_open` | A situation was shown, on the same terms. | `scenario_id` (`lost-ball`, `cart-path`, …), `source` |
| `rules_official_click` | A link to The R&A's or the USGA's pages was followed: an entry's source link, the edition notice, the sources panel or the no-results block. | `rule_number` (`1`–`25` for an entry's link, `none` for a page-level one), `document_type` (`rules`, `definitions`, `clarifications`, `local-rule`, `handicapping`) |
| `rules_related_click` | A related link was followed: inside an entry or in the Related section. | `destination_type` (`rule`, `situation`, `glossary`, `guide`, `post`, `page`), `content_id` (`rule-18`, a situation id, a glossary slug, or a path such as `/games/skins`) |
| `rules_cta_click` | A link in the closing band (`FinalCTA`, `#get`) was followed. | `placement` (`final_cta`), `destination_type` (`google_play`, `app_store`, `page`) |
| `share_click` | An entry's copy-link button copied its URL. | `channel` (`copy`), and `scenario_id` or `rule_number` |

`source` on the two open events:

- `browse`: the page's own navigation (quick cards, the number grid, previous/next, a heading's self-link) or Back and Forward between fragments.
- `search`: a search result.
- `related`: a related link inside another entry, which also sends `rules_related_click`.
- `deep_link`: the fragment the page was loaded with, from a shared link or a link on another page or site. Spec §10 lists the first three; without this one, arrivals would be counted as `browse`. As on the glossary, an arrival before any analytics choice isn't replayed after Allow.

Unchanged and reused: `store_button_click` (`placement: "final_cta"`) for the band's store buttons, so one store click sends both it and `rules_cta_click`; count one or the other, never the sum. `link_click` for internal links (an in-page jump reports as `/rules#lost-ball`). GA's own `click` for outbound links (the official sources' `link_domain`). `?category=` stays in `page_location` (`ROUTE_PARAMS` in `lib/analyticsPreference.ts`). `docs/seo-reports/leads.sql` counts `/rules` as a landing path; a topic view lands as `/rules`, since `landingPath` drops the query string.

Metric definitions (spec §10). Report each with its date range and its source. Search Console and GA4 are never combined into one rate: Search Console has the property's totals, GA4 a sample of visitors who chose analytics.

- **Non-brand organic clicks**: Search Console clicks to `/rules` from queries outside the Branded group (`scripts/gsc-groups.mjs`). The 37 entries are fragments of one URL in Release A, so Search Console can't split them by situation or rule; standalone pages are #249's question.
- **Rules queries**: Search Console's "Rules of Golf" query group, property-wide and on `/rules`.
- **Rules landing visits**: GA4 sessions whose landing page is `/rules`. A consented sample.
- **Qualified app-download clicks**: `store_button_click` events on `/rules` (page path `/rules`). Rate: consented sessions with one, divided by consented sessions with a `/rules` page view. A store click is not an install.
- **Rules-to-product CTR**: consented sessions on `/rules` with a `rules_cta_click` or `store_button_click`, divided by consented sessions on `/rules`.
- **Search success**: of the `rules_search` events whose `result_bucket` isn't `0`, the share followed by a `rules_rule_open` or `rules_scenario_open` with `source: search` before the next `rules_search` in the same session. Computed from event order within a session (`ga_session_id`, then `event_timestamp` in the BigQuery export, or a path exploration in GA4); no search text is sent or needed. An entry already opened earlier in the same page load sends no second open, so this undercounts slightly; it can't pass 100%, and a zero-result search never counts as a success.
- **No-result rate**: `rules_search` with `result_bucket` `0`, divided by all `rules_search`; also split by `category`. `match_type` is `none` exactly when there are no results (`rulesMatchType` in `lib/content/rules/search.ts`), so the two counts must be equal. If they differ, an event or a dimension is wrong.
- **Typo rescues**: `rules_search` with `match_type` `fuzzy`, divided by all `rules_search` with results.
- **Common situation and rule opens**: `rules_scenario_open` by `scenario_id` and by `source`; `rules_rule_open` by `rule_number`.
- **Source-link clicks**: `rules_official_click` by `document_type`, and by `rule_number` for entry links.
- **Related click-through**: `rules_related_click` by `destination_type` and `content_id`.
- **Page speed**: `web_vitals` events on `/rules` by `metric_name` and `metric_rating` (GA4 sample), against the Lighthouse baseline in #246's launch packet. Not a field p75.
- **Indexed URLs**: URL Inspection on `/rules`; in Release A the indexation rate is 0 of 1 or 1 of 1.
- **Referring domains**: Search Console → Links → Top linked pages, the `/rules` row's linking sites.
- **Reported inaccuracies**: corrections opened under `docs/rules/maintenance.md` § Correction procedure ("Correction: <record id>" issues), as a count. No reader names or addresses.
- **Verified acquisition**: only from store or app attribution where it exists. Never inferred from clicks.

GA4 reports a param only once it's registered as an event-scoped custom dimension, and doesn't backfill. Every Rules param is registered:
- `result_bucket`, `match_type`, `category`, `destination_type`, `placement` and `channel` were already there, under their earlier names.
- `rule_number` (Rule number), `source` (Opened from), `scenario_id` (Rules situation), `document_type` (Official document) and `content_id` (Related content) were registered on 2026-11-07 with the owner's yes. That made 29 of 50.

Rules splits are "not available before 2026-11-07". The full table is in `docs/seo-reports/rules-checkpoints.md` § GA4 custom definitions.

## Test traffic

Created while building and verifying #114 and #115 (October 19–20), and by later
verification runs for the marketing work in soleman23/golo#789 and #790
(October 21–23). None of it is a real visitor. Where an entry says requests were
*sent*, that was observed in the browser; whether GA4 processed them into
reports is stated separately.

**GA4**
- Hostname `localhost`: local production builds that used the real
  measurement ID, roughly 01:15–02:05 UTC and around 03:50 UTC on October 20.
  Recognizable by the hostname, and by `exception` events whose description
  starts "Uncaught Error: test error from verification" or is a run of "x".
- Production (`www.golo.golf`) test visits from the owner's Mac (city Bend):
  around 02:05, 04:15 and 15:00 UTC on October 20.
- **October 21, 18:11, 18:15 and 18:19 UTC (11:11–11:20 AM PDT): three
  consent-check runs.** These were automated runs of the consent check for
  soleman23/golo#789, in headless Chromium on the owner's Mac, each landing
  on `/` with no campaign tags and choosing "Allow analytics".
  - **What leaked:** the check blocked the copy of each hit sent to
    `www.google-analytics.com/g/collect`. It didn't watch the second copy
    gtag.js sends to `www.google.com/g/collect`, so that copy went out. Each
    run may have sent a `page_view` and possibly a `web_vitals` hit that way.
  - **Unverified:** whether GA4 counts hits arriving through that endpoint
    in the property's reports.
  - **Worst case in reports:** up to 3 extra desktop users and sessions on
    October 21, landing page `/`, source `(direct)`.
  - **Not filtered or deleted.**
  - **The fix:** the check now blocks every off-site request except gtag.js
    itself (soleman23/golo#868, `marketing/social/scripts/ga4-consent-check.mjs`).
    Its later runs sent no hits; an independent check behind a logging proxy
    confirmed it.
- **October 21, 18:57:28–18:57:47 UTC (11:57 AM PDT): one approved
  attribution diagnostic.** This is soleman23/golo#790's diagnostic, approved
  by the owner. It was one headless Chromium visit through the planned
  Instagram-bio link:
  - It landed on `/` with `utm_source=instagram`, `utm_medium=organic_social`,
    `utm_campaign=golo_prelaunch_2026q4` and `utm_content=bio`, chose "Allow
    analytics", went to `/blog` through the nav, and submitted the newsletter
    form once with a designated `qa+` test address on golo.golf.
  - **Requests the browser sent (observed):** `page_view` for `/` and
    `/blog`, `form_start` and `web_vitals`, plus batched requests whose event
    names travel in the request body and weren't recorded. `newsletter_signup`
    is expected among them but wasn't observed. A few requests also went to
    `www.google.com/g/collect`. Processed events in GA4 reports haven't been
    checked yet; they take 24 to 48 hours.
  - **Expected effect on reports (unverified):** 1 user and session
    attributed to `instagram / organic_social`, campaign
    `golo_prelaunch_2026q4`, on October 21, and possibly one
    `newsletter_signup` event if GA4 received and processed it (`seo-progress.md`
    still records that event as not yet seen). Nothing else used that campaign
    yet, so any count for it on that day is this test.
  - **Not filtered.**
  - **Elsewhere:** one internal sign-up notification email was sent, and one
    test `NewsletterLead` row was created at 18:57:40 UTC (`cmvih5f580000863usxb5rsfl`,
    deleted 2026-10-22 00:21 UTC along with the post-deploy diagnostic row
    `cmvikw6v60000b4xl2qb7y4q6`, which declined analytics and sent no GA4 hits).
    Because this run used Playwright's default headless user agent, GA4's
    known-bot filter most likely dropped the session (see the October 22 entry
    below).
- **October 22, 21:26–21:28 UTC (2:26–2:28 PM PDT): the golowebsite#119
  fallback test, owner-approved.** These were controlled visits tagged
  `utm_medium=qa`, `utm_campaign=golowebsite-119`, each choosing "Allow
  analytics":
  - **21:26 UTC (Playwright's headless user agent):** `qa119-ga-only`
    (/about), `qa119-google-only` (/contact) and `qa119-both` (/faq). GA4
    Realtime showed none of them, most likely because of known-bot filtering.
  - **21:27:57–21:28:27 UTC (normal Chrome user agent):** `qa119-ga-only-2`
    (/about), `qa119-google-only-2` (/contact) and `qa119-both-2` (/faq). GA4
    Realtime showed 3 users, one view each of About, Contact and FAQ, and
    `web_vitals` ×12.
  - **Reporting rule (raw data kept, no GA4 filter or deletion):** leave out
    sessions whose session source starts with `qa119`, or whose session
    medium is `qa`.
  - **Observed so far:**
    - At 2026-10-23 01:0x UTC, Traffic acquisition for Oct 22 ("mostly
      complete data") listed `qa119-google-only-2` with 1 session and 8 events.
    - The other two hadn't appeared yet.
    - GA4 showed an Oct 22 total of 3 sessions, with rows `(direct)` 2,
      `(not set)` 1 and `qa119-google-only-2` 1. The rows overlap, as GA4's own
      percentages show, so they don't add up to the total.
  - **Not yet reconciled:** final totals with and without the rule, once all
    three are processed. The scheduled task `golo-ga4-qa119-verify` (2026-10-24
    09:00 PDT) checks that and updates this entry.
- **October 23, 02:33:00–02:33:22 UTC (October 22, 7:33 PM PDT): one approved
  live-profile Instagram acceptance run (soleman23/golo#790).** Started on the
  signed-out public profile `https://www.instagram.com/gologolfapp/` in a clean
  browser context with a normal Chrome user agent and GPC off:
  - It clicked the live bio link (`l.instagram.com` → `https://www.golo.golf/?utm_source=instagram&utm_medium=organic_social&utm_campaign=golo_prelaunch_2026q4&utm_content=bio`),
    chose "Allow analytics" on `/`, navigated to `/blog` through the top nav,
    and submitted the newsletter form once with the designated test address
    `qa+utm-ig-web-20261022@golo.golf`.
  - **Requests the browser sent (observed):** `page_view` on `/` (02:33:08 UTC,
    `dl` carrying all four `utm_*` parameters and `dr=https://l.instagram.com/`),
    `link_click` (`/blog`, nav), `page_view` on `/blog` (02:33:13 UTC),
    `scroll_depth`, `form_start` (02:33:15 UTC), `newsletter_signup`
    (02:33:20 UTC), `user_engagement` and `web_vitals`.
  - **Expected effect on reports:** 1 desktop user and session on October 22
    (Pacific) attributed to `instagram / organic_social`, campaign
    `golo_prelaunch_2026q4`, and 1 `newsletter_signup` event.
  - **Not filtered.**
  - **Elsewhere:** one internal sign-up notification email was sent. The
    `NewsletterLead` row (`cmvkcv5kj0000k10h1xu3iu0m`, created 02:33:14.996 UTC)
    was verified with `source=blog`, `landingPath=/`,
    `referrerHost=l.instagram.com`, `landingSource=instagram`,
    `landingMedium=organic_social`, `landingCampaign=golo_prelaunch_2026q4` and
    `landingContent=bio`, then deleted at 02:34 UTC (`0` `qa+` rows remain).

**Clarity**
- Sessions whose entry URL is on `localhost`, about 02:20–05:30 UTC on
  October 20 (Clarity shows them as "Entry: localhost").
- Production test sessions: 02:03 UTC October 20 (`/games`), around 04:15 UTC,
  and 15:03–15:05 UTC October 20 (`/contact`, synthetic form entries, replay
  check).
- Clarity user ID `1mllpb1` is the owner's own Chrome. Its 02:37 UTC
  October 20 session (7:37 PM PDT October 19, 39 minutes on the home page),
  inside the no-consent window, is the owner's, not an outside visitor's.

## Options

### GA4

| Option | What it does | Reversible | Consequences |
| --- | --- | --- | --- |
| Leave it, filter in reports | Add a report filter or comparison "Hostname does not exactly match localhost"; compare date ranges around the window | Yes | No data loss; has to be applied per report or saved |
| Annotation | Mark Oct 19–20 in GA so anyone reading reports sees why | Yes | None |
| Web hostname data filter | Admin → Data filters → exclude hostname `localhost` | The filter can be turned off | Only affects data collected after it's active, and excluded data is never available later. Doesn't touch the existing test hits |
| Data deletion request | Admin → Data deletion requests: erase parameter values (optionally only values containing given text) for a date range | No, after a 7-day grace period | Erased text becomes "(data deleted)" but the events still count in report totals; can't target a hostname directly; data must be more than 12 days old (not before ~November 1); takes 7–63 days |
| Delete specific users | Explorations → User explorer → delete a user (by client ID) | No | Removes that browser's data from explorations within 24 hours and permanently within 63 days; the test browsers' client IDs would have to be found first; effect on aggregated reports isn't documented |

Recommendation: annotate the window, filter `localhost` in reports, and add the
hostname data filter for future builds. Don't use deletion requests for this:
they leave the counts in place and can't target the test hits cleanly.

### Microsoft Clarity

| Option | What it does | Reversible | Consequences |
| --- | --- | --- | --- |
| Let it expire | Recordings are kept 30 days (window data gone around November 19); heatmaps, dashboard data, saved recordings and a random sample Microsoft keeps last 9 months | — | No action; data stays visible until then |
| Filter dashboards | Filter by URL or entry page to hide `localhost` | Yes | Per view only |
| IP blocking | Settings → IP blocking: exclude the owner's IP | Yes | Future sessions only |
| Delete the project | Settings → delete project | No | Deletes everything in the project, including real sessions; Microsoft documents no other way to delete data. A new project means a new ID in `lib/siteConfig.ts`. Microsoft's handling of its own copies under its controller terms isn't documented |

Clarity was turned off on October 20, 2026. Deleting the project is the
cleanest way to end the window's data, at the cost of losing everything in it;
otherwise recordings expire around November 19 and the rest within 9 months.
