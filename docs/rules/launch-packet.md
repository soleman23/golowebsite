# Rules Center: launch packet (#246 QA, #247 go/no-go)

Prepared on November 7, 2026 for launch PR #269 (branch `launch/242-rules-inbound-links`). It's modelled on `docs/glossary/launch-packet.md`. The numbers below are what was measured, on the date shown. The evidence files are listed at the end.

**Released 2026-11-07, 11:04 PST.** The owner said "Go" in chat at 11:03 PST, recorded in #247 before the merge. #269 merged as `f27675b` at 11:04:03 PST, and `/rules` first returned 200 on www.golo.golf at 11:05:53 PST. The live results are in § Live results.

**State:** Live since 2026-11-07. The live checks pass, and the Search Console steps are done. The owner waived the VoiceOver check (RL-QA-14) on 2026-11-09, so no QA row is open.

## Go/no-go

| Gate | State on 2026-11-07 | Go needed |
|---|---|---|
| Content | 37 of 37 records approved by the owner in chat: 25 overviews on 2026-11-06 ("Approve all three", `review-packet-overviews.md`), 12 situations on 2026-11-06 (`review-packet-situations.md`). Each has a rules, product, seo and approval entry in its review log. All 37 move to `published` in the launch PR | merge |
| Glossary edits | 10 records each gain one `/rules#…` link, approved by the owner in chat on 2026-11-07 ("Approve all 10") and cross-checked by the coordinator. One `seo` review-log entry each; `reviewedOn`, `updatedOn` and copy unchanged (`canonical-map.md` § Inbound: glossary records) | merge |
| Rights | `check:rules-copy`: no run of 8 or more words shared with 27 official pages, across 342 fields in 37 records. No official media: the only image is GoLo's own hero, and the SVGs are GoLo's logo, store glyphs and social icons. The independence disclaimer is on the page twice (RL-QA-23) | — |
| Sources | `check:rules-sources` green: 28 R&A pages, 25 titles, 336 anchors, hashes accepted 2026-11-06 unchanged. USGA clarifications page re-read in a browser on 2026-11-07: still "Updated October 2, 2026", so `clarificationsCheckedOn` is 2026-11-07. Every official link opened once (RL-QA-22) | — |
| QA | RL-QA-01–25 below: 24 pass, and RL-QA-14 was waived by the owner on 2026-11-09 | — |
| Performance | `/rules` lab LCP median 2,490 ms (target ≤ 2.5 s), CLS 0, score 97. `/glossary`, `/blog/gimmes` and `/` measure the same before and after (RL-QA-19) | — |
| GA4 | The five Rules dimensions (Rule number, Opened from, Rules situation, Official document, Related content) were registered on 2026-11-07, and a read-only check the same day found all five still listed (29 of 50) | — |
| Screen reader | **Waived by the owner.** Moved to after deploy on 2026-11-07 ("Do it after deploy"), then waived on 2026-11-09 ("We don't need to run the voice over"). The release stands on the automated evidence: axe 0 violations (RL-QA-12), the accessibility tree (RL-QA-13) and the Tab walk (RL-QA-09–11) | owner exception |
| Launch PR | Head `5c9493a`: CI `lint · typecheck · build` success, and Codex's review completed with no findings (`codex-review-state` at 5c9493a6f8, plus a 👍). Quoted in #247 with the owner's go | — |
| Owner go | **"Go"**, in chat on 2026-11-07 at 11:03 PST. One request covered the merge, URL Inspection plus Request indexing, the sitemap resubmission, the Rich Results Test, the #248 dates and this follow-up record | given |

**Outcome: go.** Merged the same Pacific day as `RULES_LAUNCHED_ON`, so `publishedOn` 2026-11-07 stands.

## QA results (the launch build, 2026-11-07)

**The build.** A production build of the launch branch with `NEXT_PUBLIC_ANALYTICS_ENABLED=true`, as production has it, served by `next start`. It has `rulesLive = true` and all 37 records `published` (`publishedOn` 2026-11-07), exactly as they'll ship.

**Isolation.** Every request to Google was answered locally or aborted, so nothing reached GA4. The baseline is `main` at 7302672, built the same way.

**Machine.** Local runs used Node 26.10.0. CI runs Node 24 (`.nvmrc`).

**Which commit.** Most rows ran on the launch commit cfab867. The QA-fix commit 2a43b25 changes only:
- the store buttons' `aria-label` and a space between their label spans;
- the clarifications check date;
- one test.

The project checks, axe, the accessibility tree and Lighthouse ran again on 2a43b25. Before the go, the VoiceOver check was planned on that build. The owner moved it to after deploy, then waived it (RL-QA-14).

| ID | Check | Result | Evidence |
|---|---|---|---|
| RL-QA-01 | Project checks | **pass** at cfab867 and again at 2a43b25: `lint` (including `lint:content`: 37 rules records valid, 37 published; 56 glossary records), `typecheck`, `test` (rules 165, glossary 140, rules sources 40, attribution 96, guard 59 cases), `build` | checks-launch.log, checks-final.log, build-launch.log, build-final.log |
| RL-QA-02 | Exclusion: one record held `in-review` | **pass**: a second build with `mark-lift-clean` at `in-review` and no `publishedOn`. Its id, question and two unique phrases are absent from the `/rules` HTML, the RSC payload (fetched with `RSC: 1`), `.next/static`, the sitemap and `llms.txt`. The schema lists 36 items instead of 37, and the page shows 11 situations. The only build file still naming it is a server chunk holding the source records, which is never served | exclusion.txt |
| RL-QA-03 | Search fixtures | **pass** (table below) | qa-b.txt |
| RL-QA-04 | Search within a topic | **pass**: Formats + "OB" gives "No match for “OB”. 2 results in other topics."; "Search all" returns to All with 2 results and focus in the field; Escape empties the field and shows all 37 entries | qa-b.txt |
| RL-QA-05 | No-JS render (390px) | **pass**: 37 articles, all visible; one H1; search field and topic chips hidden (`[data-requires-js]`); copy buttons hidden; 300 official links, 8 quick cards and 25 grid links present; no horizontal overflow | qa-b.txt, shots/nojs-390.png |
| RL-QA-06 | Deep links, cold arrival | **pass**: `#lost-ball`, `#rule-18` (390px) and `#out-of-bounds` (1440px) each land below the sticky nav with the heading focused. `?category=relief#lost-ball` keeps Relief. `?category=relief#cart-path` (a Course areas entry) resets to All and drops `category` from the URL. `#no-such-id` and `#%` leave the page as it was, with no script error | qa-b.txt, qa-b2.txt |
| RL-QA-07 | Back/forward with an active filter | **pass**: Relief → Formats → Back restores Relief (8 entries) → Forward restores Formats (6) → reload keeps Formats. Under Relief, a link to `#rule-18` (also Relief) keeps the topic; Back returns to `?category=relief`. A hash change during a search clears it and announces "Search cleared to show Rule 19: Unplayable Ball" | qa-b.txt, qa-b2.txt |
| RL-QA-08 | 320 / 760 / 1100 / 1440 | **pass**: no horizontal overflow and no element past the right edge at any width; screenshots of the top, `#lost-ball` and `#rule-18` at each | qa-b.txt, shots/ |
| RL-QA-09 | Keyboard: Tab walk | **pass**: headless Chrome, real Tab presses from load until focus returns to the body, at 320×800, 760×1000, 1100×900 and 1440×900. That's 573, 573, 578 and 578 stops; the 5-stop gap is the collapsed nav. Every stop draws the 2px lime ring (`rgb(212, 242, 58)`) and matches `:focus-visible`. None is clipped, under the sticky nav or past the viewport edge. A self-test that forced each failure (under the nav, clipped in a chip strip, past the edge, non-lime, no ring, the accordion's `::after` ring) caught all six | tabwalk/summary.txt, job1-rules.json, selftest.json |
| RL-QA-10 | Short viewports (560–700px tall) | **pass**: 320×560, 1100×560, 1100×700 and 1440×640, with 573–578 stops each. All lime, none clipped or under the nav. `/rules` has no sticky rail of its own | tabwalk/summary.txt |
| RL-QA-11 | Paired against `main` | **pass**, at 320, 760, 1100 and 1440 on `/`, `/glossary`, three posts, `/games/overall-match`, `/games` and `/faq`. Launch adds exactly these stops, each lime and clean: the footer's "Golf rules" on every page, the 10 glossary entry links, and one link in each post. No stop exists only on `main`. No stop moved without an explanation: each moved stop comes after an added one, or cascades from one. Before the first added element nothing moves, and after it everything shifts straight down with no reflow. The footer grows 28px at 320 and 760; on `/faq` at 1100 and 1440, focusing "Golf rules" scrolls 10px further, and the 8 footer stops after it follow. The `/games/overall-match` FAQ 8 link is `visibility: hidden` while its item is closed. Opened, it takes one Tab and draws a 2px lime ring at six viewports. Already on `main`, identical alone: at 320×800, the `/games` Overall Match and Scramble cards and the match-play post's table scroller are taller than the space between the nav and the open consent banner, so their rings run under both | tabwalk/summary.txt, job2-paired-diff.json, job3-faq-link.json |
| RL-QA-12 | axe-core (WCAG 2.1 AA + best practice), 320 and 1280px | **pass after a fix**: 0 violations on the final build. The first run found one, `label-content-name-mismatch` on the closing band's Google Play button, and it's on `main` too, on every page with that button (`regression.txt`). The cause was a label of "Get GoLo on Google Play" over visible text that read "Get it on" + "Google Play" with no space between the spans. Fixed in the launch PR (RL-QA fix below). Button rects are unchanged at 320 and 1440px, and the violation clears on `/` and `/rules`. `color-contrast` is "incomplete" for 66–67 nodes on the glass and photo backgrounds, where axe can't compute a background. That isn't a violation, and the hero's per-pixel contrast was measured in #235 | a11y-tree-final.txt, store-space.txt |
| RL-QA-13 | Accessibility tree | **pass** (details below) | a11y-tree.txt, ax-entries.txt |
| RL-QA-14 | Screen reader: owner's VoiceOver check | **Waived by the owner** (an owner-approved exception, not a pass). On 2026-11-07 the owner chose "Do it after deploy". On 2026-11-09 the owner decided not to run it: "We don't need to run the voice over". No human screen-reader pass was made. Claude can't run one: turning VoiceOver on is a system setting, and Safari is read-only to it. What stands in its place is supplementary and automated: RL-QA-09–13 and the live Tab walk. The script below is kept for any later check | — |
| RL-QA-15 | Consent harness (#244), rerun on the launch build | **pass**: identical to the #244 run at df2e315 in all five scenarios: denied, granted, no choice then Allow, withdrawn in the same tab, withdrawn from another tab. The same event sequences in each, and no typed query text in any request, param or console line. Denied sends 0 requests to Google. After a withdrawal, no Rules events; the 1–2 hits captured just after a decline carry `_p` page ids from before it, so they're flushes from pages loaded under consent | consent-launch.json |
| RL-QA-16 | Analytics: inbound links | **pass**, consent granted, one event per action: a glossary link to `/rules#rule-6` sends `glossary_cta_click {teeing-area, rules}` and `/rules#conceded-putt` sends `{gimme, rules}`; a guide link still sends `guide`. The footer link sends `link_click {/rules, footer}`, the `/blog/gimmes` link `link_click {/rules#conceded-putt, main}`, and the home hero's Google Play `store_button_click` | analytics-regression.txt |
| RL-QA-17 | Schema | **pass**: validator.schema.org, with the page's two JSON-LD blocks pasted, found 0 errors and 0 warnings: CollectionPage (an ItemList of 37, `dateModified` 2026-11-07) and BreadcrumbList. No review records, sources or check dates in the JSON-LD (`test-rules` schema cases) | jsonld-blocks.html |
| RL-QA-18 | Metadata, sitemap, `llms.txt`, robots | **pass**: title "Golf Rules Explained: Penalties, Relief & Questions · GoLo", its own description and canonical. The sitemap gains exactly `/rules` with lastmod 2026-11-07. `llms.txt` gains a "Rules of Golf" section with one entry. `robots.txt` is unchanged. No other page's title, description, canonical, robots or JSON-LD changes | regression.txt |
| RL-QA-19 | Lighthouse mobile, median of 5 | **pass, narrowly**: `/rules` LCP 2,490 ms against the 2.5 s target, CLS 0 (table below) | lighthouse.txt |
| RL-QA-20 | `npm run check:rules-sources` | **pass**: 28 R&A pages answer, 25 titles and 336 anchors match, cited Definitions and Model Local Rules found, 28 texts match the hashes accepted 2026-11-06 | rules-checks.log |
| RL-QA-21 | `npm run check:rules-copy` | **pass**: 342 fields of copy in 37 records, no run of 8 or more words shared with 27 official pages | rules-checks.log |
| RL-QA-22 | Every official link opened once | **pass**: 300 official links, 194 distinct hrefs, 33 distinct pages. Each of the 29 randa.org pages fetched once: all 200, and all 165 fragments found as ids on their pages. The 4 usga.org pages (rules hub, clarifications, RoH 3.3, RoH Definitions) opened in the browser pane, each with its expected title | official-links.txt |
| RL-QA-23 | Rights | **pass**: copy distance clean (RL-QA-21); no iframe, video or embed; no R&A or USGA logo or diagram. "GoLo is an independent site, not affiliated with or endorsed by The R&A or the USGA" appears twice, and the Official sources section says the explanations are GoLo's own | rights in qa notes |
| RL-QA-24 | Regression: other pages | **pass**, launch against `main` at 320 and 1440px. 16 pages: home, `/glossary`, `/games`, three guides, `/blog`, four posts, `/faq`, `/how-it-works`, `/features`, `/contact`, `/privacy`. All 200, no overflow, no console errors, nav and footer present. The only differences are the footer's "Golf rules" link (every page) and the 14 in-page inbound links (10 on `/glossary`, 1 in each of three posts, and `/games/overall-match` FAQ 8); every `/rules#…` link resolves to an id on `/rules`. axe on main and launch matched page for page | regression.txt |
| RL-QA-25 | Hero | **pass**: the `/rules` hero `<img>` has `alt=""` inside an `aria-hidden` frame, and no image node is in the accessibility tree. Served bytes per viewport: see RL-QA-19 | a11y-tree.txt |

### Search fixtures (RL-QA-03)

At 1280px, topic All. The field keeps focus throughout, and the URL never changes.

| Query | Results, in order | Announced |
|---|---|---|
| `18.2b` | Rule 18; Lost ball; Out of bounds | "3 results: 2 situations, 1 rule" |
| `OB` | Out of bounds (alias); Rule 18 | "2 results: 1 situation, 1 rule" |
| `white stakes` | Out of bounds | "1 result: 1 situation" |
| `casul water` | Puddle or ground under repair; Rule 16 | "Closest matches: 2 results: 1 situation, 1 rule" |
| `bunkre` | Can I touch the sand in a bunker?; Unplayable ball; Rule 12 | "Closest matches: 3 results: 2 situations, 1 rule" |
| `zzz` | "No match for “zzz”." with the hint and the randa.org browse link | "No match." |
| (empty) | results hidden, all 37 entries back | nothing |

### Lighthouse (RL-QA-19)

Lighthouse 12.8.2, default mobile throttling, local `next start`, 5 runs per page. The runs alternated between the final launch build (2a43b25) and `main` (7302672). Medians:

| Page | Build | LCP (runs) | CLS | TBT | Score | HTML transferred |
|---|---|---|---|---|---|---|
| `/rules` | launch | **2,490 ms** (2,488–2,654) | 0 | 34 ms | 97 | 88 KB |
| `/glossary` | launch / main | 2,487 / 2,487 ms | 0 / 0 | 14 / 12 ms | 97 / 97 | 60 / 59 KB |
| `/blog/gimmes` | launch / main | 2,565 / 2,567 ms | 0 / 0 | 15 / 16 ms | 97 / 97 | 21 / 21 KB |
| `/` | launch / main | 2,710 / 2,707 ms | 0 / 0 | 13 / 11 ms | 96 / 96 | 28 / 28 KB |

**`/rules`:**
- The LCP element is the hero `<picture>`, served as `rules-mobile-768.avif` (15 KB).
- It's inside the 2.5 s target by 10 ms. That's about the glossary's margin at its launch (15 ms).
- #235 measured 2.35 s before #242 and #244 added the related reading and the analytics code. The HTML is now 88 KB compressed, against the glossary's 60 KB, and that pushes FCP to 1,505 ms. Lab numbers only: not field Core Web Vitals, and TBT isn't INP.

**The other pages** measure the same before and after, within 3 ms. `/blog/gimmes` and `/` are over 2.5 s on `main` too. Neither is a Rules Center page, and neither moved.

### Accessibility tree (RL-QA-13)

This supplements the owner's check and doesn't replace it.

- **Title and language:** "Golf Rules Explained: Penalties, Relief & Questions · GoLo", `lang="en"`.
- **Headings (93):**
  - one H1, "Golf Rules Explained";
  - five H2s: Common situations, All 25 rules, Official sources, Related, and the closing band;
  - 17 H3s: the 12 questions and the 5 topic groups;
  - 45 H4s: 25 rules and the answers' sub-labels;
  - 25 H5s ("Look here when").
- **Landmarks, in order:**
  - Primary navigation, main, Breadcrumb navigation;
  - "Jump to a situation" navigation;
  - regions "Common situations" and "All 25 rules";
  - "Rules 1 to 25" navigation;
  - 25 "Rule N" navigations, each rule's previous/next pair;
  - regions "Official sources", "Related" and the closing band;
  - contentinfo.
- **Search field:** a searchbox named "What happened to your ball?", with placeholder "Lost ball, white stakes, Rule 18.2…" and `aria-controls="rules-results"`.
- **Status regions:** three polite `role="status"` regions: the provider's, the topic count's and the search result's.
  - Typing "OB" announces "2 results: 1 situation, 1 rule".
  - "zzz" announces "No match.".
  - Choosing Relief announces "8 entries in Relief and penalties".
- **Chips:** buttons in a group named "Filter by topic"; the active one has `aria-current="true"`.
- **Entries:**
  - Each heading carries `tabindex="-1"` and links to itself.
  - The copy button is named "Copy link: <heading>". Pressing it announces "Link to Lost ball: what happens next? copied", and the clipboard holds `https://www.golo.golf/rules#lost-ball`.
  - Official links read "Rule 18.2a on randa.org" or "Definition of “Lost” on randa.org".
  - Previous/next links read "Rule 17" and "Rule 19"; the arrows are `aria-hidden`.
- **Hero:** hidden, as RL-QA-25 says.

## Live results (2026-11-07)

Checked on `https://www.golo.golf`, from about 11:06 PST, against `main` at `f27675b`. The apex 308s, so every fetch followed redirects. The headless runs aborted every request to another host, and the consent run answered GA's requests locally, so nothing reached GA4.

| Check | Result | Evidence |
|---|---|---|
| Deploy | First 200 at 11:05:53 PST, 1 min 50 s after the merge. LiteSpeed serves the page | live/live-checks.txt |
| Status and redirects | `/rules` 200, 608,768 bytes. `https://golo.golf/rules` returns 308 → `https://www.golo.golf/rules`. `/rules/lost-ball` returns 404 | live/live-checks.txt |
| Sitemap | One `/rules` entry, lastmod 2026-11-07, with no fragment or `?category=` URLs; 48 `<loc>`s in all | live/live-checks.txt, ~/gsc/sitemap-2026-11-07.xml |
| `llms.txt` | A "Rules of Golf" section with one entry for `/rules` | live/live-checks.txt |
| Schema and metadata | JSON-LD: BreadcrumbList, then CollectionPage (37 items, `dateModified` 2026-11-07), Organization, WebSite. Title "Golf Rules Explained: Penalties, Relief & Questions · GoLo", self-canonical, no robots meta. 37 articles, and no review records or check dates in the HTML | live/live-checks.txt |
| Footer and inbound links | Footer "Golf rules" on `/`, `/glossary`, the three posts and `/games/overall-match`. 10 `/rules#…` links on `/glossary`, and 1 each in the three posts and the guide FAQ. Every fragment resolves to an id on the live `/rules` | live/live-checks.txt |
| Hero bytes | The served image matches the build's SHA-256 at 390×844@3x (`rules-mobile-1080.avif`), 600×900@1x (`-768`), 768×1024@2x and 1920×1080@1x (`rules-desktop-1920.avif`), and 1440×900@2x (`-2560`). No purge was needed | live/live-checks.txt |
| Consent | The #244 harness, denied and granted, against the live site. Denied: 0 Google requests, no `gtag`, no `_ga` cookies. Granted: the same 20 Rules events, the same deep-link and outbound events, and the same 16 event names as on the launch build, with closed-set params only. No typed query text in any request | live/consent-live.json |
| Tab walk | `/rules` at 320×800, 760×1000, 1100×900 and 1440×900: 574, 574, 579 and 579 stops. All draw the lime ring; none is clipped or under the nav. One stop more than the launch build: production has the Terms of Service footer link, set by its environment, which the local build didn't have | tabwalk-live/live-rules.json |
| Lighthouse | Live `/rules`, 5 runs, default mobile throttling: median LCP **2,188 ms** (2,151–2,787), CLS 0, TBT 14 ms, score 98. The LCP element is the hero (`rules-mobile-768.avif`, 14 KB). Live lab data, not field Core Web Vitals | live/lighthouse-live.txt |
| Official links | `check:rules-sources` green and every randa.org page fetched on 2026-11-07 (RL-QA-20, RL-QA-22). The 4 usga.org pages were opened in a browser the same day | official-links.txt |

### Search Console (the owner's Chrome, `sc-domain:golo.golf`)

| Step | Result (2026-11-07, PST) |
|---|---|
| URL Inspection, `https://www.golo.golf/rules` | "URL is not on Google: URL is unknown to Google", with no referring sitemap. Expected for a page live for 2 minutes |
| Test live URL | 11:08: "URL is available to Google", "Page can be indexed", Breadcrumbs 1 valid item |
| Request indexing | About 11:09: "Indexing requested. URL was added to a priority crawl queue." Clicked by coordinates from a fresh screenshot |
| Sitemap | `https://www.golo.golf/sitemap.xml` resubmitted: "Sitemap submitted successfully". The row now reads Submitted Nov 7, 2026 and Last read Nov 5, 2026, with 47 pages discovered at that read. L+7 checks for a read after L |
| Rich Results Test, `/rules` | Crawled successfully at 11:09:47 AM: "1 valid item detected", Breadcrumbs. CollectionPage isn't a Google rich-result type |
| Prelaunch baseline (L-28 – L-1, Oct 10 – Nov 6) | **Provisional on 2026-11-07; complete days confirmed on 2026-11-09 with the same totals** (`rules-checkpoints.md` § Baseline). Saved to `~/gsc/rules-baseline/` (Web, no other filters). Totals: 6 clicks, 684 impressions, CTR 0.9%, position 28.6. Rules of Golf group: 0 queries, 0 impressions. Search Console still marked Nov 5 and Nov 6 "Data is still being collected", so re-export the same window once they're complete, at the latest with the L+7 run (`docs/seo-reports/rules-checkpoints.md` § Baseline) |

### Still open after the release

- **#248:**
  - L+7 on 2026-11-14;
  - L+28 on 2026-12-05;
  - L+56 on 2027-01-02;
  - L+90 on 2027-02-05.
- **The baseline:** re-export it, as above.

## VoiceOver script (RL-QA-14)

Not run: the owner waived the check on 2026-11-09. Kept for a later screen-reader pass. The owner's copy is `246-voiceover-script.md` in the coordinator's notes folder, the same text as below. VO means Control + Option.

**Before you start**

- The page is at **https://www.golo.golf/rules** once it's live. Before the deploy, the same build was served at http://localhost:3000/rules.
- **VO** means **Control + Option**, held together.
- Wording can differ slightly by macOS version, and capitals don't matter. What matters is that the information comes through.
- If the analytics notice appears, choose **Decline**, so the check isn't counted in GA4.

For each step, note pass or fail and anything odd.

**1. Start**

Open Safari at https://www.golo.golf/rules and press **Cmd + F5** to turn VoiceOver on. On most MacBooks that's **Fn + Cmd + F5**.

Expect: the page title, "Golf Rules Explained: Penalties, Relief & Questions · GoLo".

**2. Heading list**

Press **VO + U** to open the rotor. Press Left or Right Arrow until **Headings** shows, then Up and Down to scroll. **Escape** closes it.

Expect:
- one level-1 heading, "Golf Rules Explained", at the top;
- level 2: "Common situations", "All 25 rules", "Official sources", "Related", "Know the rule. Let GoLo keep the score.";
- level 3: the 12 questions (such as "Lost ball: what happens next?") and the 5 topic groups (such as "Relief and penalties");
- level 4: each rule, such as "Rule 18: Stroke-and-Distance Relief, Ball Lost or Out of Bounds, Provisional Ball".

**3. Landmarks**

In the rotor (**VO + U**), move to **Landmarks**.

Expect, in this order:
- "Primary" navigation
- main
- "Breadcrumb" navigation
- "Jump to a situation" navigation
- "Common situations"
- "All 25 rules"
- "Rules 1 to 25" navigation
- "Rule 1" to "Rule 25" navigation: each rule's previous/next links
- "Official sources"
- "Related"
- "Know the rule. Let GoLo keep the score."
- content information (the footer)

If you haven't answered the analytics notice yet, an "Analytics choice" entry shows too.

Please say whether the 25 "Rule N" entries get in the way.

**4. The search field**

Press **VO + Command + J**, which jumps to the next form control.

Expect: "What happened to your ball?, search text field". Safari may also read the hint "Lost ball, white stakes, Rule 18.2…".

**5. A search with results**

Type **OB** and wait a second.

Expect: "2 results: 1 situation, 1 rule". VoiceOver stays in the field.

**6. A search with no results**

Press **Cmd + A**, type **zzz** and wait a second.

Expect: "No match."

Then press **Escape**. The field empties, and VoiceOver stays in it.

**7. Topic chips**

Press **Tab** once.

Expect: "All, current, button", or "current item". The group is "Filter by topic".

Press **Tab** until you hear "Relief, button", then press **Space**.

Expect: "8 entries in Relief and penalties". Relief now reads as current.

Then **Shift + Tab** back to "All" and press **Space**.

Expect: "37 entries".

**8. A deep link**

Press **Cmd + L**, type **www.golo.golf/rules#lost-ball** and press **Return**.

Expect: VoiceOver lands on the answer and reads "Lost ball: what happens next?, heading level 3". It may say "link" too, because the heading links to itself.

**9. Copy link**

Press **VO + Right Arrow** until you hear "Copy link: Lost ball: what happens next?, button", then press **VO + Space**.

Expect: "Link to Lost ball: what happens next? copied". The button then reads "Copied".

**10. An official link**

Keep pressing **VO + Right Arrow** through the answer.

Expect links read as, for example, "Rule 18.2a on randa.org, link" and "Definition of “Lost” on randa.org, link". Each one says it goes to randa.org. You don't need to open one.

**11. Previous and next rule**

Open the rotor (**VO + U**), go to **Landmarks**, choose "Rule 18" and press **Return**. Then **VO + Right Arrow**.

Expect: "Rule 17, link", then "Rule 19, link". The arrows aren't read.

On "Rule 19", press **VO + Space**.

Expect: "Rule 19: Unplayable Ball, heading level 4".

**12. The photo is skipped**

Press **VO + Fn + Left Arrow** (VO + Home) to go to the top of the page. Then step with **VO + Right Arrow** from the navigation down to the "Golf Rules Explained" heading and the search field.

Expect: the hero photo of white stakes is never mentioned. No "image" or picture is read.

**13. Finish**

Press **Cmd + F5** to turn VoiceOver off.

**The owner replies with** pass or fail for steps 1–12 and anything odd, plus the macOS, Safari and VoiceOver versions. That reply is recorded in RL-QA-14 as given.

## Launch diff (PR #269)

**From #242** (commits 14c299c and 181e15e):
- the footer link "Golf rules";
- 10 glossary records, each with one link and one review-log entry;
- links in 3 posts;
- the `/games/overall-match` FAQ 8 link.

`canonical-map.md` § Link map has every link with its reason.

**Merged from `main`:** #267 (analytics) and #268.

**Launch commit (cfab867):**
- `rulesLive = true`, and `RULES_LAUNCHED_ON = "2026-11-07"` in `lib/content/rules/launch.ts`;
- all 37 records `published` with `publishedOn: RULES_LAUNCHED_ON`;
- the scenarios' approval `Pick<>` gains `publishedOn`;
- the two pre-launch `test-rules` cases now state the launch;
- the glossary's `/rules#…` links report `destination_type: "rules"`.

**QA fixes (2a43b25):**
- The store buttons' accessible names are now their visible text: "Get it on Google Play" and "Download on the App Store". There's a space between the two label spans. axe flagged `label-content-name-mismatch` sitewide, on `main` too.
- `clarificationsCheckedOn` is 2026-11-07. The `test-rules` staleness case now reads the date from `rulesEdition` instead of hard-coding it.

**Docs:** this file, and `canonical-map.md` § Analytics and § Launch check.

### `destination_type: "rules"` (the 242-discovery question)

**Chosen: add it.** It was a one-line change in `GlossaryEntry.destinationType()`.

- Before it, a glossary link into `/rules` reported `page`, the same value as the product links (`/games`, `/features`, `/how-it-works`). Glossary-to-Rules traffic couldn't be separated from them.
- `destination_type` is already a registered GA4 dimension ("Glossary destination"), so the new value needs no admin change.
- Optional, for the owner: that dimension's description in GA4 still says "guide, post or page". Adding "or rules" is a label edit in GA4 Admin, and nothing depends on it.

## Release steps (after the owner's go)

Done on 2026-11-07, except step 6 and the part of step 7 that waits on it. Step 1 wasn't needed, because the merge was on the launch date.

1. If the merge won't happen on 2026-11-07 (Pacific), change `RULES_LAUNCHED_ON` in `lib/content/rules/launch.ts` to the merge date. That one constant sets every record's `publishedOn` and the sitemap's lastmod. Also move `TODAY` in `scripts/test-rules.mjs` if the validator rejects the new date as being in the future. Rerun `npm run lint:content` and `npm test`, push, wait for CI, and get Codex's 👍 at the new head.
2. Mark the PR ready, then merge it with a merge commit: `gh pr merge 269 --merge --match-head-commit <sha>`, without `--delete-branch`. Hostinger deploys `main` in about 2 minutes. LiteSpeed serves `public/` with `max-age=0`, so there's no purge.
3. Run the live checks on `https://www.golo.golf` (the apex 308s, so use `curl -L`):
   - `/rules` returns 200;
   - the sitemap lists `/rules` with lastmod;
   - `llms.txt` has its Rules of Golf section;
   - the schema is in the live source;
   - the footer link and all 14 in-page inbound links are present;
   - the hero bytes match the build per viewport;
   - consent: one event per action with consent, none without;
   - a live Tab walk;
   - Lighthouse on the live URL, recorded as live lab data.
4. Search Console, in the owner's Chrome, on `sc-domain:golo.golf`:
   - URL Inspection of `https://www.golo.golf/rules`, then Test live URL, then Request indexing. Click it by coordinates from a fresh screenshot.
   - Resubmit the sitemap.
   - Run the Rich Results Test on `/rules`; expect Breadcrumbs.

   Record each with its date.
5. Save the Search Console baseline for L-28 – L-1 to `~/gsc/rules-baseline/` and run `scripts/gsc-groups.mjs`, per `docs/seo-reports/rules-checkpoints.md` § Before launch. Set L and the L+7/28/56/90 dates there and in #248.
6. The owner's VoiceOver check (RL-QA-14) on the live page, using the script below. **Waived by the owner on 2026-11-09**, so it wasn't run.
7. Record the live results here and in #247. #247 closed with the #269 merge, and #246 with the #270 merge. Both are ticked in #230, with RL-QA-14 recorded as waived. Keep #248 open.

## Rollback

Revert the launch merge commit, `git revert -m 1 f27675b`, then open a PR and merge it; Hostinger redeploys in about 2 minutes.

Setting `rulesLive = false` on its own isn't enough. It 404s `/rules` and takes it out of the sitemap, `llms.txt`, the footer and the schema, but all 15 inbound links (the footer, 10 glossary records, 3 posts and the guide FAQ) then fail `lint:content`. The revert removes the whole launch at once.

Nothing is in the database, so there's nothing to migrate back. After a rollback, remove the URL in Search Console only if Google had indexed it.

## Evidence files

All in this session's scratchpad (`evidence/`), not committed:

- `checks-launch.log`, `build-launch.log`, `build-main.log`, `build-excl.log`
- `exclusion.txt`
- `qa-b.txt`, `qa-b2.txt`
- `a11y-tree.txt`, `ax-entries.txt`
- `consent-launch.json`
- `analytics-regression.txt`
- `jsonld-blocks.html`
- `official-links.txt`
- `rules-checks.log`
- `regression.txt`
- `tabwalk/`
- `lighthouse.txt`
- `shots/`
- After the release:
  - `live/live-checks.txt`, `live/consent-live.json`, `live/lighthouse-live.txt`
  - `tabwalk-live/`
  - the Search Console baseline in `~/gsc/rules-baseline/`, with its groups in `~/gsc/rules-baseline-groups.md`
  - the live sitemap in `~/gsc/sitemap-2026-11-07.xml`

The scripts are in `qa/` beside them, and the consent harness is in `consent/`.
