# SEO + AIO Phase 3 backlog

> **Archived October 28, 2026.** This is the plan as written on October 14. Every item in section 4 was filed as an issue, and the issues are where the work is tracked. 21 of the 24 are closed; still open: SEO-07 [#65](https://github.com/soleman23/golowebsite/issues/65), SEO-10 [#68](https://github.com/soleman23/golowebsite/issues/68) and SEO-20 [#78](https://github.com/soleman23/golowebsite/issues/78).
>
> The findings describe the site and the app as they were on October 14, and several are no longer true: claims now follow the capability registry in `lib/content/capabilities.ts`, which `npm run lint` enforces; Wolf, Bingo Bango Bongo, saved groups and the share card are live; and GoLo has been on Google Play since October 26. Check the registry and the issue, not this file, before acting on anything below.
>
> | Item | Issue | State |
> | --- | --- | --- |
> | SEO-01 to SEO-06 | #59–#64 | closed |
> | SEO-07 Search Console revalidation | #65 | open |
> | SEO-08, SEO-09 | #66, #67 | closed |
> | SEO-10 Monthly SEO/AIO report | #68 | open |
> | SEO-11 to SEO-13 | #69–#71 | closed |
> | SEO-14 Authorship | #72 | closed, not planned |
> | SEO-15 to SEO-19 | #73–#77 | closed |
> | SEO-20 Query-led content plan | #78 | open |
> | SEO-21 to SEO-24 | #79–#82 | closed |

Prepared October 14, 2026, against `main` at acd8cee (PR #58) and the live site. Planning only: no code changed.

Sources checked: `docs/seo-progress.md`; `app/{layout,page,robots,sitemap}.ts(x)`; `app/faq`, `app/games/[slug]`, `app/blog/[slug]`; `lib/siteConfig.ts`, `lib/pageMetadata.ts`, `lib/attribution.ts`, `lib/analytics.ts`; every file in `lib/content/`; `components/ui/{Breadcrumbs,JsonLd}.tsx`, `components/sections/FinalCTA.tsx`, `components/sections/blog/KeepReadingPosts.tsx`; merged PRs #1–#58 (PR #27 in full, because it was the last product-claim audit); the live `robots.txt`, `sitemap.xml`, `/`, `/faq`, `/features`, `/blog` and `/blog/pressing` (JSON-LD). The repo has no open or closed issues and no milestones, so there was nothing to de-duplicate against.

This session did not read the app repo (soleman23/golo); see the "stay in this repo" rule. App behaviour is taken from PR #27, which was checked against golo `main` 291c545 (0.6.2), and from the code comments that cite it. Wherever the site alone can't settle what the app does, the issue says the owner has to confirm it.

---

## 1. Current state

**What's already in place:**

- Technical crawl basics are done and live: `robots.txt` allows everything and names the sitemap; the sitemap is generated from the content layer (29 URLs live, `/terms` included); apex→www is a 308; every route sets its own canonical, title, description and Open Graph tags (`lib/pageMetadata.ts`, `generateMetadata`).
- The home page carries a connected graph (`Organization` `#organization`, `WebSite` `#website`, `SoftwareApplication` `#app`), with "GoLo Golf" as the name, "GoLo Golf LLC" as legalName and Instagram as sameAs. There's no invented rating and no `datePublished`.
- Game guides emit `HowTo` + `FAQPage`; `/faq` emits a full `FAQPage`; articles emit `Article`; `Breadcrumbs` emits `BreadcrumbList` from the same data as the visible trail. `JsonLd` escapes `<`.
- Content is typed data: posts, guides and FAQ in `lib/content/`, so the sitemap, schema, index pages and filters all derive from it.
- The prelaunch posture (`siteConfig.appLive`) drives CTA labels, status pills, store buttons and closing-band copy from one flag.
- `/features` is the most careful page on the site: its header comment and PR #27 tie each claim to GoLo 0.6.2, and it has a three-column roadmap (today / testing / not built).
- The game guides state GoLo's real limits (no Nassau presses, no auto-press, gross birdies only, no cap setting, no 70/30 purse split).
- `/how-it-works` is a real round played through 0.6.2 at Tetherow, using the app's own screens. That's first-party evidence nobody else can publish.
- Leads record `landingPath` and `referrerHost` (PR #23), so conversion attribution doesn't rely on GA4, which only sees visitors who opt in.
- Images are done: AVIF/WebP tiers, art-directed hero `<picture>`s, phone frames and an OG card for every published post (#56–#58).

**What's left:**

- **Product truth is inconsistent, and it shows on the live home page.** The FAQ describes a Trip mode that `/features`, the Scottsdale post and PR #27 all say isn't built. There are a dozen smaller contradictions too (section 2).
- Unpublished drafts show on `/blog` as "Coming soon" cards, and they carry unverified claims ("We tested GoLo on 40 rounds", "the three features we cut").
- Article schema is disconnected from the entity graph: the publisher is named "GoLo" (not "GoLo Golf"), it has no `@id`, the author is an anonymous Organization, and there's no `dateModified`.
- There's no About page, no named authorship, and no external citations, even on the WHS handicap content.
- Measurement: `generate_lead` isn't yet a GA4 key event. AI referrals are only partly visible, because `utm_source` (which ChatGPT appends) is thrown away by design.
- Internal linking is uneven: three published posts contain no in-body links, and four of the eight guides have no "Deeper reading" link.
- Search Console has only the October 8 baseline. The post-deploy re-check is due October 22 – November 5.

---

## 2. Findings that need action

Each one is tagged **Confirmed** (a defect, with evidence), **Opportunity** (a gap worth closing), or **Hypothesis** (needs data before anyone acts).

### P0

1. **Confirmed — Trip mode is described as live but isn't built.** `lib/content/faq.ts` `q-trips`: "Trip mode keeps a running tally across every round…". `q-roster` and `q-games-per-day` describe a trip tally that "nets all of it". Against that: `/features` roadmap, "ON THE LIST, NOT BUILT" → "Multi-day trip tallies" (`features.ts:289`); the Scottsdale post: "GoLo does not carry a ledger across rounds yet; a trip tally is on the list, not built"; PR #27: "Each round settles on its own." `q-trips` is one of the six `mostAskedFaqIds`, so it renders on the **home page** as well as `/faq`, and it goes into the `/faq` FAQPage JSON-LD. Verified live.
2. **Confirmed — the `/blog` index publishes unverified research claims.** The coming-soon cards for `forty-rounds` and `settle-up-screen` render their title and excerpt ("We tested GoLo on 40 rounds…", "the three features we cut"). The count line reads "13 posts", but only 11 can be opened. Verified live.
3. **Confirmed — other capability contradictions** (each with its location):
   - Wolf and Bingo Bango Bongo are "IN TESTING" on the `/features` roadmap. They're offered without qualification in FAQ `q-which-games` ("Stack as many as you want…"), on the home stats band ("8 games scored automatically · Skins, Nassau, Wolf & more"), and in the Wolf and BBB guide CTAs ("GoLo handles every partner pick, Lone Wolf, and settlement").
   - Saved groups: the `/features` Round Setup block, marked IN THE APP TODAY, says "Save your Saturday crew as a group and next week they're in with one tap". The same page's roadmap lists "Saved groups, teams included" as IN TESTING.
   - The group-chat share card is IN TESTING (`/features` roadmap and the "Receipts for the group chat" card). The home Auto Settle-Up checklist presents it as current: "Drop it in the group chat — receipts for the whole crew".
   - Platform: FAQ `q-devices` says "It runs in a browser". `FinalCTA.tsx` says "iPhone & Android" (inline copy, against the house rule). `SoftwareApplication.operatingSystem` says "iOS, Android". The web app is noindexed and not public.
   - Live sharing: FAQ `q-everyone` says "Share the live link…". `/features` says signed-in players can join and follow live. A link anyone can open and live follow for signed-in players aren't the same capability.
   - GPS: `/features` says "Live GPS yardages are the next thing we're building". The `forty-rounds` draft says "GPS yardages … Cut."
   - Notifications: FAQ `q-sell` lists "time to settle up" notifications. The `settle-up-screen` draft says "No in-app notifications about money."
   - Locker: the status pill uses variant `planned` with the label "HISTORY LIVE · STATS EXPANDING", one pill carrying two statuses.
   - Money language: the Closest to Pin guide, step 5, has the heading "GoLo holds the pot", and GoLo doesn't hold money.
   - Unsubstantiated stat: the home stats band says "<30s from last putt to settled". Nothing on the site supports it.
   - Launch-day copy decides pricing early: with `appLive` true, `FinalCTA` says "Free to download · No card to start", while FAQ `q-cost` says "We haven't set pricing."
4. **Confirmed — `SoftwareApplication` overstates availability.** It has an `Offer` at price 0 and `operatingSystem: "iOS, Android"` while the app can't be downloaded anywhere. The note in `app/page.tsx` already says to revisit this at launch.
5. **Opportunity (time-gated) — the Search Console re-check** against the October 8 baseline, in the October 22 – November 5 window.

### P1

6. **Confirmed — Article schema isn't connected to the entity graph.** On the live `/blog/pressing`: `publisher` is `{"@type":"Organization","name":"GoLo"}` with no `@id`; `author` is `{"@type":"Organization","name":"GoLo Golf"}`; there's no `dateModified` and no `isPartOf`; `image` is one 21:9 WebP. The visible byline says "From the GoLo team". `og:site_name` is "GoLo", while the WebSite node says "GoLo Golf".
7. **Confirmed — no revision dates.** `Post` has `date` only. PR #27 edited claims in live posts (Nassau, pressing) without any visible "updated" signal. Guides have no dates at all.
8. **Confirmed — a factual error on handicap content.** FAQ `q-pickup` says "most groups use double par or the ESC cap". Equitable Stroke Control was replaced by net double bogey when the World Handicap System arrived in 2020, and the site's own sandbagging post already uses "Net double bogey". The handicap article states the WHS Course Handicap formula, "best 8 of 20" and daily revision without citing anything. The only external link anywhere in `lib/content` is zero.
9. **Opportunity — no About page or verifiable authorship.** There's no `/about`, no `Person`, no founder reference. `docs/seo-progress.md` lists this under Remaining.
10. **Opportunity — original evidence is sitting unpublished.** The `forty-rounds` and `settle-up-screen` drafts are the site's most citable pages. The first can't ship until its numbers are verified. The second mostly needs its claims reconciled.
11. **Confirmed (measurement) — `generate_lead` isn't a GA4 key event** (`docs/seo-progress.md`, Remaining).

### P2

12. **Confirmed (measurement gap) — AI referral attribution drops `utm_source`.** `lib/attribution.ts` keeps the path only, by design. ChatGPT search links append `utm_source=chatgpt.com`, and many AI surfaces strip the referrer, so those leads look like direct visits.
13. **Confirmed — weak internal linking.** `who-pays-first`, `rangefinder` and `scottsdale-trip-structure` have no in-body internal links. Best Score, Closest to Pin, Longest Drive and Birdies have no `deeperReading`. No article links `/how-it-works`. `KeepReadingPosts` ranks "same category, then newest", so the oldest posts get the fewest rail links.
14. **Hypothesis — query-led expansion.** 92 queries and 347 impressions is too little data to plan a cluster around. Nassau demand is real, but positions are 40–73. "mongolian reversal" (6 impressions) and "golo board" (6) don't match any content on the site, which needs explaining before anyone writes for them.
15. **Opportunity — a reporting framework.** No monthly report, no AI-answer spot check, no fixed query groups.

### P3

16. **Opportunity — distribution:** an RSS feed for `/blog`, an off-site entity profile plan (which matters most at launch), outreach for the research post, and an optional `llms.txt` experiment.

---

## 3. Milestones

| # | Milestone | Goal | Success condition | Issues, in order |
|---|---|---|---|---|
| M1 | Product truth | Every public claim about GoLo matches what the app does, and new drift fails the build | No page, schema block or metadata describes a non-live capability as live; `npm run lint` catches the known phrases | SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06 |
| M2 | Search validation & measurement | Know what's indexed, what's working, and where leads come from, including AI surfaces | GSC re-check written up; `generate_lead` a key event; AI hosts identifiable in GA4 and the lead table; first monthly report filed | SEO-07, SEO-08, SEO-09, SEO-10 |
| M3 | Entity & trust | One consistent GoLo Golf entity, real authorship, dated revisions, cited facts | Every page's JSON-LD references `#organization`; articles carry `dateModified`; `/about` live; handicap content cites WHS sources | SEO-11, SEO-12, SEO-13, SEO-14, SEO-15 |
| M4 | Original evidence | Publish first-party material others can cite | Testing log exists; the testing study and settle-up build note are live with only verified claims | SEO-16, SEO-17, SEO-18 |
| M5 | Query-led growth | Grow from real Search Console demand, linked as clusters | Content plan grounded in GSC data; no orphan posts; every guide has a deeper-reading link where one exists | SEO-19, SEO-20 |
| M6 | Authority & distribution | Authentic external references, ready for launch | Entity boilerplate and profile list maintained; launch-day SEO checklist ready; feed live | SEO-21, SEO-22, SEO-23, SEO-24 |

M1 is the only milestone that blocks others. M2's GSC work is date-gated and runs in parallel.

---

## 4. Issue backlog

The standard gates (from CLAUDE.md) apply to every code issue and aren't repeated below: `npm run lint && npm run typecheck && npm run build`, a check at 320/760/1100/1440 px, and a Tab walk for the lime focus ring. Schema changes also get Google's Rich Results Test and the Schema.org validator on the built page source.

---

### SEO-01 · Content: correct the Trip mode answers to "planned"

- **Priority:** P0 · **Milestone:** M1 · **Impact** 5 · **Effort** XS · **Confidence** High
- **Problem:** Three FAQ answers describe multi-day trip tallies as a working feature. They aren't built.
- **Evidence:** `lib/content/faq.ts` `q-trips`, `q-roster`, `q-games-per-day`, against `lib/content/features.ts` roadmap ("Multi-day trip tallies", "ON THE LIST, NOT BUILT"), the `scottsdale-trip-structure` post ("a trip tally is on the list, not built"), and PR #27's app check ("Each round settles on its own"). `q-trips` is in `mostAskedFaqIds`, so it renders on `/` and `/faq` and goes into the `/faq` FAQPage JSON-LD. Confirmed on the live site October 14.
- **Why it matters:** This is the most-asked question, and the answer is false on the highest-authority page. AI answer engines quote FAQ answers almost verbatim, so it's likely to spread as "GoLo has a Trip mode". It also contradicts the site's own `/features`, which hurts trust with anyone who reads both.
- **Scope:**
  - Rewrite `q-trips` to say what's true today: each round settles on its own; a cross-round trip tally is planned and not built; until then, settle each round, or keep one number per player by hand (link `/blog/scottsdale-trip-structure`).
  - Rewrite or remove `q-roster` and `q-games-per-day`. Keep only what's true per round: a different roster and different games each day are both possible, because each round is set up on its own.
  - Change the category blurb "Four days, five guys, one settle-up." so it doesn't promise a trip settle-up.
  - Keep `q-trips` in the most-asked six. The honest answer is useful, and the question is real.
- **Out of scope:** the capability registry (SEO-03); any other claim; the Scottsdale and Bandon posts (already accurate).
- **Acceptance criteria:**
  - [ ] No string in `lib/content/` or `components/` presents "Trip mode" or a cross-round tally as existing.
  - [ ] `/faq` JSON-LD `q-trips` text matches the new visible answer.
  - [ ] The home FAQ shows the corrected answer.
  - [ ] Voice rules hold: no exclamation marks, plain and specific.
- **Verification:** `grep -rniE "trip mode|trip tally|trip total" lib/content components` returns only planned or "not built" phrasings. `npm run build`, then check the `/faq` page source for the JSON-LD. View `/` and `/faq` at 320 and 1440.
- **Dependencies:** none. Ship first, as a hotfix.

---

### SEO-02 · Blog: stop the index publishing unverified draft claims

- **Priority:** P0 · **Milestone:** M1 · **Impact** 4 · **Effort** XS · **Confidence** High
- **Problem:** Unpublished posts render on `/blog` as "Coming soon" cards with their full title and excerpt. One asserts testing volume nobody has substantiated, and the count line includes posts that can't be read.
- **Evidence:** `lib/content/blog.ts`: `forty-rounds` (`published: false`; title "We tested GoLo on 40 rounds before writing any marketing"; excerpt "…the three features we cut…") and `settle-up-screen`. `blogCountLine` counts `postsByDate` (13) rather than `publishedPosts` (11). Live `/blog` shows "13 posts · 7 topics" and both cards. The drafts are dated April 2026, so the "Coming soon" cards also carry past dates.
- **Why it matters:** A crawler indexes an unverified "40 rounds" claim as a GoLo statement on a canonical URL. The research post's credibility depends on not pre-announcing numbers that may change.
- **Scope:**
  - Pick one with the owner (recommended first): (a) render no card for unpublished posts; or (b) render title only, with no excerpt or date and a neutral title the owner approves.
  - `blogCountLine` and the topic-chip counts count only what the grid renders.
  - Update the comment at the top of `blog.ts` that describes coming-soon behaviour.
- **Out of scope:** rewriting either draft (SEO-17, SEO-18).
- **Acceptance criteria:**
  - [ ] Live `/blog` HTML contains no text from an unpublished post's excerpt or dek.
  - [ ] The count line equals the number of readable posts.
  - [ ] Filter chips show no counts for cards that aren't there; the `lint:filters` check still passes.
- **Verification:** `curl -s localhost:3000/blog | grep -c "40 rounds"` returns 0. Filter chips checked at 320 and 1100.
- **Dependencies:** none.

---

### SEO-03 · Content: add a public capability registry with owner-confirmed status

- **Priority:** P0 · **Milestone:** M1 · **Impact** 5 · **Effort** M · **Confidence** High
- **Problem:** Capability status lives in prose across eight content files and two components. `/features` has a status model (`StatusPill` variants `today`/`testing`/`planned`), but nothing else reads it, so FAQ, home and guide copy drift.
- **Evidence:** Findings 1 and 3. PR #27 fixed `/features` and the guides, but missed the FAQ Trips category, the home features and stats, and `FinalCTA`.
- **Why it matters:** One source of truth for what GoLo does is the root fix for user trust, AI retrieval accuracy and entity understanding. It's also what makes SEO-06's automated check possible.
- **Scope:**
  - `lib/content/capabilities.ts`, typed:
    ```ts
    type CapabilityStatus = "live" | "testing" | "planned" | "dropped";
    type Capability = {
      id: CapabilityId;            // "trip-tally", "wolf", "auto-press", …
      label: string;               // public name, as on the roadmap
      status: CapabilityStatus;
      verified: { appVersion: string; date: string }; // e.g. 0.6.2, 2026-10-11
      summary: string;             // approved one-line public description
      limits?: string[];           // "Presses only on Overall Match", …
      claimPhrases?: string[];     // phrases that imply it's live (used by SEO-06)
      inMetadata: boolean;         // may it appear in titles/descriptions/schema
    };
    ```
  - Starting entries, from site evidence. The **owner confirms or corrects every row** against the current app build before merge. This session can't read the app repo.

    | Capability | Proposed status | Source |
    |---|---|---|
    | Hole-by-hole net/gross scoring; Nassau, Skins, Best Score, Overall Match; ~~junk board~~ | live | `/features` "today", PR #27. **Wrong: there is no junk board** (owner, 2026-10-29, soleman23/golowebsite#172). Bounties exist only as Skins settings. |
    | Called presses on Overall Match (≤2 live, 2–4×) | live | PR #27 |
    | Full course handicap by stroke index; one tee set per group | live | PR #27 |
    | Netted settle-up, mark paid, round history | live | `/features` |
    | Signed-in players follow live; one scorer (per team in a scramble); guests without accounts | live | PR #27 |
    | Birdie/Eagle Skin (gross only) | live | PR #27 |
    | Wolf; Bingo Bango Bongo | testing | `/features` roadmap |
    | Saved groups; share card; season stats; dead-spot/offline sync | testing | `/features`, FAQ `q-offline` |
    | Everyone enters own scores; multi-day trip tally; watch app; auto-press; Nassau presses; allowances/off the low man; mixed tees; quota | planned | `/features`, PR #27 |
    | GPS yardages | **owner decides**: planned or dropped | `/features` vs `forty-rounds` draft |
    | Platform (browser vs native iOS/Android), public live link, notifications, Venmo handle display, CTP/LD distance logging | **owner confirms** | FAQ vs `FinalCTA` vs schema |
  - Derive the `/features` `roadmap` columns from the registry; nothing else on `/features` changes in this issue.
  - Add a `docs/` note (or a header comment) giving the update rule: when an app release changes a status, edit the registry first, then the copy.
- **Out of scope:** rewriting FAQ, home or guide copy (SEO-04); the lint check (SEO-06); a CMS.
- **Acceptance criteria:**
  - [ ] The registry exists, is typed, and every entry has `verified.appVersion` and `verified.date`.
  - [ ] The `/features` roadmap renders from the registry with no visible change, apart from corrections the owner approves.
  - [ ] The PR description links the owner's confirmation of every row, written in the PR or as an issue comment.
- **Verification:** Diff the rendered `/features` roadmap before and after (it should be identical unless a row changed). Typecheck proves every `CapabilityId` reference resolves.
- **Dependencies:** owner input. SEO-01 doesn't depend on this.

---

### SEO-04 · Content: reconcile remaining product claims with the registry

- **Priority:** P0 · **Milestone:** M1 · **Impact** 5 · **Effort** M · **Confidence** High (on the defects); Medium (on the wording, which depends on owner answers)
- **Problem:** About a dozen claims contradict `/features` or each other (finding 3).
- **Evidence:** In `lib/content/faq.ts`: `q-which-games`, `q-everyone`, `q-devices`, `q-sell`. In `lib/content/home.ts`: `stats` (8 games, "<30s"), `features[2].checklist` ("Drop it in the group chat"). In `lib/content/features.ts`: the round-setup lead (saved groups), the `history-locker` status pill, the `alsoInThere` course database card (GPS). In `lib/content/gameDetail.ts`: the Closest to Pin step 5 ("GoLo holds the pot"), the Wolf and BBB CTAs, and the CTP/LD "log the distance" steps. `components/sections/FinalCTA.tsx` lines 46–51 (inline "iPhone & Android", "Free to download · No card to start").
- **Why it matters:** These are the claims AI systems will repeat as GoLo's feature list. The money-language fix also protects the "doesn't hold money" positioning.
- **Scope:**
  - Each claim matches its registry status. Testing and planned capabilities are named as such, or left out. Wolf and BBB guides keep their golf-education content in full, and their GoLo CTA and claims say "in testing".
  - "GoLo holds the pot" becomes something like "GoLo tracks the pot". Audit the other "hold/holds" phrasings (`blog.ts:285` "let GoLo hold the card" is fine: it's the scorecard).
  - Home stats: remove "<30s from last putt to settled" unless the owner has a measurement behind it. Make "8 games" either count live games or say "8 formats explained". The other two stats are obviously rhetorical; keep them only if the owner wants them.
  - Move the `FinalCTA` fine print into `lib/content`. Neither branch states platform or price until those are set in the registry and in pricing.
  - Fix the Locker pill: one status per pill.
- **Out of scope:** schema (SEO-05); the drafts (SEO-17, SEO-18); FAQ factual and handicap fixes (SEO-15).
- **Acceptance criteria:**
  - [ ] Every claim listed in Evidence is either removed or matches its capability's status, and the PR has a before/after table.
  - [ ] No component holds product-claim copy inline.
  - [ ] `/faq` JSON-LD matches the visible answers.
- **Verification:** The before/after table in the PR. The standard gates. The pages `/`, `/faq`, `/features`, `/games/wolf`, `/games/bingo-bango-bongo` and `/games/closest-to-pin` checked at all four widths.
- **Dependencies:** SEO-03.

---

### SEO-05 · Schema: align SoftwareApplication with real availability

- **Priority:** P0 · **Milestone:** M1 · **Impact** 4 · **Effort** XS · **Confidence** High
- **Problem:** The home `SoftwareApplication` node asserts an iOS/Android app with a $0 Offer. Nobody can download one.
- **Evidence:** `app/page.tsx` `homeJsonLd` `@graph[2]`: `operatingSystem: "iOS, Android"`, `offers: { price: "0" }`. `siteConfig.appLive` is false. FAQ `q-devices` says "runs in a browser".
- **Why it matters:** Structured data that contradicts the visible page is a reliability signal against the whole graph. An Offer implies you can get the product now.
- **Scope:**
  - While `!appLive`, drop `offers`, and set `operatingSystem` to whatever the registry's platform entry says (or omit it). Keep the node, so the entity exists and is linked to `#organization`.
  - Take `description` from the approved registry summary or `siteConfig.description`, not marketing superlatives.
  - When `appLive` is true, emit `offers` and the OS from data set at launch (feeds SEO-21's launch checklist).
- **Out of scope:** `aggregateRating` (never, until real ratings exist); the Article graph (SEO-11).
- **Acceptance criteria:**
  - [ ] With the production env (`appLive` false), the built `/` has no `offers`, and the OS matches the registry.
  - [ ] Rich Results Test and Schema.org validator show no errors. (A "missing offers" warning for app rich results is expected, and fine: that rich result needs ratings anyway.)
- **Verification:** View source on the built `/`; run the validators.
- **Dependencies:** SEO-03 (platform row).

---

### SEO-06 · Tooling: add content checks to `npm run lint`

- **Priority:** P1 · **Milestone:** M1 · **Impact** 4 · **Effort** S · **Confidence** High
- **Problem:** Nothing stops the next PR from bringing back a contradiction or a broken internal link. Copy checks rely on reviewers.
- **Evidence:** Findings 1 and 3 reached production after a dedicated claims audit (PR #27). There's already a precedent for a custom check: `scripts/check-filter-css.mjs` runs inside `npm run lint`.
- **Scope:** `scripts/check-content.mjs`, wired into `lint`, with three checks:
  1. **Claims:** for every capability whose status isn't `live`, fail if any of its `claimPhrases` appears in `lib/content/**` or `components/**`, unless it appears with an allowed qualifier, or the line carries an explicit `// claim-ok: <reason>` marker.
  2. **Metadata:** fail if a non-live capability's label or claim phrases appear in any `seoTitle`, `metaDescription`, `pageMetadata` title or description, or `siteConfig.description`.
  3. **Internal links:** every `href="/…"` in content HTML, every `href:` field, and every `deeperReading.href` resolves to a route in the sitemap set or a known non-sitemap route (`/privacy#…`, `/#get`).
  - The output names the file, line, phrase and capability. It runs in CI through the existing lint step.
- **Out of scope:** natural-language claim detection; external link checking (flaky in CI).
- **Acceptance criteria:**
  - [ ] Bringing back the old `q-trips` text makes `npm run lint` fail, naming `trip-tally`.
  - [ ] Pointing a link at `/blog/does-not-exist` makes it fail.
  - [ ] `main` passes after SEO-04.
- **Verification:** Run both deliberate failures locally (include the output in the PR), then revert them. CI goes green.
- **Dependencies:** SEO-03, SEO-04.

---

### SEO-07 · Search Console: post-deploy revalidation against the October 8 baseline

- **Priority:** P0 · **Milestone:** M2 · **Impact** 5 · **Effort** S · **Confidence** High
- **Problem:** The phase-1 titles and canonicals went live October 8; six posts and `/how-it-works` followed on October 10–11. Their effect hasn't been measured.
- **Evidence:** The baseline in `docs/seo-progress.md`: 347 impressions, 2 clicks, 0.6% CTR, position 45.8, 92 queries, 16 indexed / 11 not (6 discovered-not-indexed, 3 redirect, 1 alternate canonical, 1 crawled-not-indexed). The live sitemap now has 29 URLs.
- **Window:** run between October 22 and November 5, 2026, and record the run date. Compare 28-day windows: the 28 days before the deploy against the 28 days ending on the run date, noting the overlap.
- **Scope:** done by the owner, or by an agent with GSC access. The output is a new dated section in `docs/seo-progress.md` covering:
  - Page indexing totals and each reason, with URLs. Explain each non-indexed URL. Expected-and-fine: the 3 redirects (apex, http, trailing slash: `http://www.golo.golf/blog/` takes two hops, 301 to the https URL with the slash, then 308 to `/blog`) and the alternate-with-canonical.
  - URL Inspection on all 8 guides and 11 posts: indexed? Google-selected canonical equals the declared one? Last crawl date?
  - Sitemap: submitted vs indexed count.
  - Queries, in groups (Branded: golo golf / go lo golf / golo; Nassau; other games; handicap; trips; settle-up): impressions, clicks and position against the baseline.
  - Pages: impressions per guide and per post.
  - The CWV report, if field data exists; if not, say so. Don't substitute lab numbers.
  - Whether "golo board" and "mongolian reversal" still show, and on which landing page.
- **Decision rules:** don't rewrite content on this data. Act only on indexation defects: a wrong canonical, a soft 404, a sitemap URL that isn't indexed after 21+ days with no reason. Open a separate issue for each.
- **Out of scope:** content changes; Bing Webmaster Tools (optional extra).
- **Acceptance criteria:**
  - [ ] The dated section is in `docs/seo-progress.md` with every item above.
  - [ ] Every non-indexed URL has a reason and either "expected" or a linked issue.
  - [ ] The query groups are written down, so SEO-10 reuses the same ones.
- **Verification:** A reviewer can reproduce any number from the date ranges given.
- **Dependencies:** none (date-gated).
- **Follow-ups:** SEO-20 consumes this.

---

### SEO-08 · GA4: make `generate_lead` a key event and group AI referrals

- **Priority:** P1 · **Milestone:** M2 · **Impact** 3 · **Effort** XS · **Confidence** High
- **Problem:** GA4 counts leads but doesn't treat them as conversions. AI assistants sit inside "Referral".
- **Evidence:** `docs/seo-progress.md` Remaining; the `lib/analytics.ts` union already has `generate_lead` and `newsletter_signup`.
- **Scope:** owner action in the GA4 admin UI; no code.
  - Mark `generate_lead` as a key event. Mark `newsletter_signup` too, if wanted (recommended: yes, as a secondary).
  - Add a custom channel group: "AI assistants" = session source matching `chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com`, placed above Referral.
  - Save an exploration: landing page × channel group × key events.
- **Caveat to record:** GA4 sees only visitors who opt in (no banner, GPC respected), so treat it as a sample. The lead table is the volume source.
- **Acceptance criteria:**
  - [ ] Both settings are visible in GA4 admin; there's a screenshot or note in `docs/seo-progress.md`.
  - [ ] The channel group shows in the Traffic acquisition report.
- **Verification:** A test lead on production from an opted-in browser shows as a key event in DebugView or Realtime. Use a real test number per the owner's process; the test-row cleanup is the owner's call.
- **Dependencies:** none.

---

### SEO-09 · Attribution: record an allowlisted `utm_source` on leads

- **Priority:** P2 · **Milestone:** M2 · **Impact** 3 · **Effort** S · **Confidence** Medium
- **Problem:** Leads from AI surfaces that strip the referrer but append `utm_source` (ChatGPT search appends `utm_source=chatgpt.com`) get recorded as direct.
- **Evidence:** `lib/attribution.ts` keeps `window.location.pathname` only, on purpose. `PhoneLead` and `NewsletterLead` have `landingPath` and `referrerHost`.
- **Scope:**
  - Add a nullable `landingSource` column on both tables: the `utm_source` value only, lower-cased, matched against `^[a-z0-9.\-_]{1,64}$`, dropped otherwise. Never the rest of the query string.
  - Capture it in `captureLanding()`, send it with the lead, and validate it in `lib/validation.ts` the way `referrerHost` is (a malformed value is dropped, not rejected).
  - Follow the deploy order in `docs/seo-progress.md`: apply the column to the "golowebsite" Supabase project **before** merging, because Hostinger builds `main` automatically.
- **Out of scope:** other UTM parameters; cookies or storage (the cookie policy inventory stays unchanged); GA4.
- **Acceptance criteria:**
  - [ ] Landing on `/?utm_source=chatgpt.com` and submitting the newsletter form stores `chatgpt.com`. Run this with fetch stubbed or a dev database, so no production rows get written.
  - [ ] `utm_source=<script>` or a 200-character value stores null.
  - [ ] The PR body names the SQL and confirms the production column was applied before the merge.
- **Verification:** Payload inspection in the dev server; Prisma typecheck.
- **Dependencies:** none technical. Counsel note: the existing Remaining item about the privacy policy covering landing page and referrer host should also cover this field.

---

### SEO-10 · Reporting: monthly SEO/AIO report and an AI-answer spot check

- **Priority:** P2 · **Milestone:** M2 · **Impact** 3 · **Effort** S · **Confidence** Medium
- **Problem:** There's no repeatable report, and no way to tell whether AI answers about GoLo are accurate.
- **Scope:**
  - `docs/seo-reports/TEMPLATE.md`, with these sections:
    1. **Search visibility:** GSC impressions, clicks, CTR and position, by the SEO-07 query groups and page groups (guides, posts, core pages); indexed count.
    2. **Branded demand:** branded impressions and clicks over time.
    3. **Content discovery:** new pages' first impressions and days to index.
    4. **AI referral visibility:** leads by `referrerHost` and `landingSource` that match AI hosts (SQL in the template); the GA4 "AI assistants" channel, read as a sample; the GSC AI-surface report, if Google exposes one by then (as of writing, AI Overviews and AI Mode traffic is folded into Web totals).
    5. **AI answer accuracy:** a fixed prompt set, run monthly by hand in ChatGPT (search on), Perplexity, Gemini and Google AI Mode. Record whether golo.golf is cited, whether the answer describes GoLo correctly (scorekeeper, doesn't move money, current status), and which page was cited. Starter prompts: "What is GoLo Golf?", "app to track golf side bets like Nassau and skins", "how do you settle a Nassau with presses", "golf trip betting structure for 8 players", "handicap index vs course handicap".
    6. **Conversions:** leads by landing path and source placement.
  - The first report: `docs/seo-reports/2026-11.md`.
  - Rule: an inaccurate AI answer about GoLo becomes a content issue against the page it cited, never hidden "AI text".
- **Out of scope:** paid rank trackers; automated scraping of AI answers.
- **Acceptance criteria:**
  - [ ] The template is committed; the first report is filed after SEO-07.
  - [ ] The SQL runs read-only against the website database. The owner runs it; credentials are never committed.
- **Dependencies:** SEO-07, SEO-08; SEO-09 (soft).

---

### SEO-11 · Schema: shared entity builders and a connected Article graph

- **Priority:** P1 · **Milestone:** M3 · **Impact** 4 · **Effort** S · **Confidence** High
- **Problem:** Article JSON-LD invents its own publisher ("GoLo", no `@id`, which isn't the Organization's name), names an anonymous Organization as author, and doesn't link to the WebSite. `og:site_name` uses a different name from the WebSite node.
- **Evidence:** `app/blog/[slug]/page.tsx` `articleJsonLd`; live `/blog/pressing` source; `lib/pageMetadata.ts` `siteName: siteConfig.name`; the `app/page.tsx` graph.
- **Scope:**
  - `lib/schema.ts`: `ORG_ID`, `WEBSITE_ID` and `APP_ID` constants; `organizationNode()` (the full node, used on `/`); `organizationRef()` (a compact node with `@id`, name, url and logo, so pages other than home are self-contained, because cross-page `@id` resolution isn't guaranteed); `websiteRef()`.
  - Article becomes a `@graph`: `Article` + `WebPage`. Article `publisher` points to `{ "@id": ORG_ID }`. `author` points to `{ "@id": ORG_ID }` until SEO-14 lands. `isPartOf` points to `WEBSITE_ID`. `description` is the same string as the meta description. `image` is `[og 1200×630, hero]` when both exist. `inLanguage` is `en-US`.
  - The home graph uses the builders, so the output stays the same.
  - `og:site_name` becomes "GoLo Golf". Title suffixes stay "· GoLo"; changing them is out of scope because of title length.
  - Breadcrumb "Home" item uses `siteConfig.url` without the trailing slash, to match the declared canonical.
- **Out of scope:** Person (SEO-14); dateModified (SEO-12); adding schema to game guides beyond the existing HowTo and FAQPage.
- **Acceptance criteria:**
  - [ ] Every article page's JSON-LD names publisher "GoLo Golf" by `#organization`, with no free-floating Organization.
  - [ ] The home graph is byte-equivalent apart from key order (diff the JSON in the PR).
  - [ ] The validators are clean on `/` and two posts.
- **Verification:** Parse the built HTML's JSON-LD with a short script and print the `@id` graph for `/` and `/blog/pressing`.
- **Dependencies:** none. Can run alongside M1.

---

### SEO-12 · Content: revision dates for posts and guides

- **Priority:** P1 · **Milestone:** M3 · **Impact** 3 · **Effort** S · **Confidence** High
- **Problem:** When a post or guide changes substantively, nothing tells readers, crawlers or AI systems.
- **Evidence:** The `Post` type has `date` only. PR #27 changed product claims in live posts. Guides have no date, so the sitemap omits `lastmod` (`app/sitemap.ts`).
- **Scope:**
  - `Post.updated?: string` (ISO). When it's set: a visible "Updated <date>" next to the publish date in `PostHero`; `dateModified` in Article; `og:article:modified_time`; sitemap `lastModified = updated ?? date`.
  - `GameDetail.updated?: string`, which drives the sitemap `lastModified`. A visible line only if design approves.
  - Rule, documented in the type comment: set it only for substantive changes (facts, rules, product claims, examples), never for typos, photos or layout.
  - Backfill: the owner decides whether PR #27's claim edits count. The recommendation is yes for `/blog/nassau` and `/blog/pressing`, dated 2026-10-11, the date the claims were corrected.
- **Out of scope:** a revision-history UI.
- **Acceptance criteria:**
  - [ ] A post with `updated` shows both dates, and its JSON-LD and sitemap agree.
  - [ ] A post without it renders exactly as it does today.
- **Dependencies:** SEO-11 (same function).

---

### SEO-13 · Content: an `/about` page built from verifiable facts

- **Priority:** P1 · **Milestone:** M3 · **Impact** 4 · **Effort** M · **Confidence** Medium (depends on the owner's facts)
- **Problem:** The site has nowhere that says who makes GoLo, where it's made, and how its claims are checked. Search and AI systems have only the Organization schema to go on.
- **Evidence:** No route; `docs/seo-progress.md` lists "Verifiable authorship / reviewer information; do not invent credentials or people." The facts that do exist: GoLo Golf LLC, Bend, Oregon; Instagram @gologolfapp; testing with real groups; the `/how-it-works` round played through 0.6.2.
- **Scope:**
  - Owner questionnaire first. Every sentence on the page must trace to an answer: founding year; who builds it (name and role, if the owner agrees); why it exists; first-hand golf context the owner is willing to state; app status (from the registry); what GoLo doesn't do (hold or move money, process wagers); how claims are verified (app version check, real rounds); contact.
  - `app/about/page.tsx` with copy in `lib/content/about.ts`; `pageMetadata`; breadcrumbs; sitemap entry; a footer link (and a nav link if design agrees).
  - JSON-LD: `AboutPage` with `about` and `mainEntity` pointing to `#organization`. Organization gains `foundingDate`, plus `founder` (by Person `@id`, coordinated with SEO-14) only if the owner provides them.
  - A short canonical boilerplate paragraph, also used by SEO-21: "GoLo Golf makes GoLo, a golf scorekeeping app that runs side games, applies handicaps and calculates who owes whom. It does not hold, move or process money."
- **Out of scope:** team photos (only if real and provided); press logos; any count of users or rounds unless SEO-16 backs it.
- **Acceptance criteria:**
  - [ ] Every factual sentence maps to the owner's answers, kept as a checklist in the PR.
  - [ ] No credential, award, user count or reviewer appears unless it's sourced.
  - [ ] The page is linked from the footer, in the sitemap, and in schema.
- **Dependencies:** SEO-03 (status line), SEO-11.

---

### SEO-14 · Authorship: an author model, a visible byline and Person schema

- **Priority:** P1 · **Milestone:** M3 · **Impact** 3 · **Effort** M · **Confidence** Medium
- **Problem:** Every post is "From the GoLo team". The first-hand experience behind the posts isn't attributable to anyone.
- **Gate:** the owner has to agree to named authorship. If they decline, close this as won't-do and keep Organization authorship. SEO-11 already makes that consistent.
- **Scope:**
  - `lib/content/authors.ts`: `{ id, name, role, bio (≤50 words, owner-written or owner-approved), sameAs: string[] (owner-provided profiles only), image? }`.
  - `Post.author` becomes `authorId` (keep "GoLo team" as an Organization option for team-written posts).
  - The `PostHero` byline links to `/about#<id>`. A separate author page is only worth it once there's more than one author or more than about ten signed posts.
  - Person JSON-LD with `@id` `${url}/about#<id>`, `worksFor` pointing to `#organization`. Article `author` points to the Person `@id` for signed posts.
  - No `reviewedBy` field until a real reviewer exists; leave a type comment saying why.
- **Out of scope:** re-attributing existing posts without the owner confirming who wrote them.
- **Acceptance criteria:**
  - [ ] Signed posts show the byline and link to the bio; unsigned posts render as they do today.
  - [ ] Person `sameAs` contains only URLs the owner listed.
  - [ ] The validators are clean.
- **Dependencies:** SEO-11, SEO-13.

---

### SEO-15 · Content: fix the ESC reference and cite WHS sources on handicap content

- **Priority:** P1 · **Milestone:** M3 · **Impact** 3 · **Effort** S · **Confidence** High
- **Problem:** One handicap answer is out of date, and the formula-level claims have no citations.
- **Evidence:** FAQ `q-pickup`: "most groups use double par or the ESC cap". ESC was replaced by net double bogey under the WHS in 2020; the sandbagging post (`blog.ts`) already says "Net double bogey". `index-vs-course-handicap` states Course Handicap = Index × (Slope ÷ 113) + (Course Rating − Par), "best 8 of the most recent 20", and daily revision, with no source. There are no external links anywhere in `lib/content`.
- **Why it matters:** These are the passages most likely to be extracted as answers. Citing the governing body helps readers and grounds AI systems, and the ESC fix removes a visible error.
- **Scope:**
  - `q-pickup`: "net double bogey (the handicap-posting maximum) or double par, whatever the group agreed". This also flows into the FAQPage JSON-LD.
  - Add a `sources` block kind to `Block` (a short list of `{ label, href }`) rendered by `ProseBlocks` as "Sources" at the end. Use it on `index-vs-course-handicap` and `sandbagging`, and wherever else a post states a WHS or Rules of Golf rule. Link USGA / WHS pages; the implementer checks each URL is live and says what it claims.
  - Audit the guides for WHS-rule statements (stroke index allocation, net double bogey) and add sources where a rule is asserted, not where an opinion or house rule is.
  - External links: `rel="noopener"`, opening in the same tab, styled like existing prose links.
- **Out of scope:** citing opinion or etiquette content; links to non-governing-body sites.
- **Acceptance criteria:**
  - [ ] No "ESC" remains in content unless it's described historically.
  - [ ] Each cited rule has a governing-body link that resolves (the PR lists the HTTP status for each).
  - [ ] The SEO-06 link check ignores external links.
- **Dependencies:** none.

---

### SEO-16 · Research: build the testing evidence log

- **Priority:** P1 · **Milestone:** M4 · **Impact** 4 · **Effort** M (owner time) · **Confidence** Medium
- **Problem:** The `forty-rounds` draft claims 40 rounds, 11 groups, 6 formats, 31 finished, "nine of forty groups changed the wager", three features cut, and "rebuilt scoring twice". None of it is documented anywhere in this repo.
- **Scope:**
  - The owner compiles a per-round log from whatever records exist (app round history, notes, messages): date, course, group size, formats, app version, finished (y/n), the hole where it stopped, notable issues, and changes made afterwards.
  - Then a separate list of product decisions with dates: features cut or added, and why. Note that GPS appears as "cut" in the draft and "next" on `/features`; this settles the SEO-03 GPS row.
  - **The repo is public.** Commit only an aggregated, de-identified summary (`docs/research/testing-summary.md`) with no player names, phone numbers or group identifiers. The raw log stays private, outside the repo.
  - A framing decision follows from the log. If it supports 40 rounds, keep the title. If not, retitle to what it does support ("What N real rounds taught us…"), or drop the numbers and write it as qualitative build notes.
- **Out of scope:** writing the article (SEO-17).
- **Acceptance criteria:**
  - [ ] Every number in the draft is marked supported (with its source), changed (with the new value), or removed.
  - [ ] The summary contains no personal data.
- **Dependencies:** none (owner work).

---

### SEO-17 · Content: publish the testing study from verified data

- **Priority:** P1 · **Milestone:** M4 · **Impact** 4 · **Effort** M · **Confidence** Medium
- **Problem:** The most citable post the site could have is unpublished, and in its current form it's unverifiable.
- **Scope:**
  - Rewrite the `forty-rounds` record using only SEO-16's supported claims. Add a short methodology section (date range, how rounds were recorded, app versions, what counted as "finished") and a data table. Keep the honest "what we got wrong" voice.
  - Reconcile it with the registry: anything described as cut, kept or added must match `/features`.
  - Use the real publication date, not the April draft date. Byline per SEO-14 if it's merged. Real screenshots or photos only: the current hero alt ("Golfers testing a scoring app during a real round") describes a stock course photo, so either replace the image or rewrite the alt. Hero, phone frame and OG card go through `scripts/generate-blog-images.mjs`.
  - Links: to `/how-it-works` (the real round), `/features`, and the settle-up post if it's live.
- **Acceptance criteria:**
  - [ ] Every number in the post appears in `docs/research/testing-summary.md`.
  - [ ] The SEO-06 check passes; no capability is contradicted.
  - [ ] Article JSON-LD is connected (SEO-11), with an accurate `datePublished`.
- **Verification:** A reviewer checks each figure against the summary. Standard gates.
- **Dependencies:** SEO-16, SEO-04, SEO-11; SEO-12 and SEO-14 (soft).

---

### SEO-18 · Content: publish the settle-up build note with a checkable example

- **Priority:** P1 · **Milestone:** M4 · **Impact** 3 · **Effort** S · **Confidence** High
- **Problem:** The `settle-up-screen` draft explains how GoLo nets debts. Its worked example adds up, and the "at most n − 1 payments" claim is correct. It's a strong primary source for "how to settle golf bets", but it contradicts current status in two places.
- **Evidence:** In the draft, "One tap sends the settled summary to the text thread" (the share card is in testing) and "No in-app notifications about money" (FAQ `q-sell` lists "time to settle up" notifications). "It took four tries" is a dated build claim the owner should confirm.
- **Scope:**
  - Reconcile both claims with the registry, and resolve `q-sell` versus the draft with the owner.
  - Re-check the table arithmetic and keep the "Check it" line.
  - Link `/features#auto-settle-up`, `/blog/who-pays-first` and `/how-it-works`, and give it a real publication date.
  - Add a plain explanation of the netting method (net each player, match the largest debtor to the largest creditor) in prose under a heading like "How GoLo works out who pays whom". That's the passage most likely to be quoted.
- **Acceptance criteria:**
  - [ ] The draft doesn't contradict the registry or the FAQ.
  - [ ] The table reconciles to $0.
  - [ ] The owner confirms "four tries" in the PR.
- **Dependencies:** SEO-03, SEO-04.

---

### SEO-19 · Internal linking: contextual links for orphaned posts and guides

- **Priority:** P2 · **Milestone:** M5 · **Impact** 3 · **Effort** S · **Confidence** High
- **Problem:** Several pages get links only from the index and the "Keep reading" rail. The rail favours the newest posts.
- **Evidence:** No in-body internal links in `who-pays-first`, `rangefinder` or `scottsdale-trip-structure`. No `deeperReading` on the Best Score, Closest to Pin, Longest Drive or Birdies guides. No article links `/how-it-works`. `KeepReadingPosts.relatedTo` = same category, then newest.
- **Scope:**
  - Add one to three contextual in-body links per orphaned post, each in a sentence that's already about the target, with descriptive anchors (not "click here", not exact-match keywords). Candidates:
    - Scottsdale → Nassau, Skins and Best Score guides; Bandon
    - who-pays-first → the settle-up build note (once live), `/how-it-works`
    - rangefinder → Closest to Pin and Longest Drive guides
  - `deeperReading` where a genuinely related post exists (e.g. Birdies → skins-carryover; Best Score → sandbagging or the handicap post). Leave it empty where nothing fits.
  - `Post.related?: string[]` (explicit slugs), used by `KeepReadingPosts` before the category fallback.
  - One link from a relevant post into `/how-it-works`, the site's strongest product-proof page.
- **Out of scope:** sitewide footer or nav link blocks; links in every paragraph.
- **Acceptance criteria:**
  - [ ] Every published post has at least one in-body link in and one out (the PR includes a small link map).
  - [ ] The SEO-06 link check passes.
- **Dependencies:** SEO-06 (for validation); SEO-18 (for one target).

---

### SEO-20 · Content plan: query-led clusters from Search Console data

- **Priority:** P2 · **Milestone:** M5 · **Impact** 4 · **Effort** S · **Confidence** Medium
- **Problem:** The next pieces of content should follow demand that actually shows up in Search Console, not tool estimates.
- **Scope:**
  - `docs/content-plan.md`, built from SEO-07's data, with a table of query group → current ranking URL → position → intent → action (improve existing / new page / no action). Every new page needs at least one observed query, or a clear first-party angle, behind it.
  - Look into "mongolian reversal" and "golo board": what result GoLo appears for, and whether it's relevant. Don't write for a query just because it has impressions.
  - Nassau: decide whether the guide (`/games/nassau`) and the post (`/blog/nassau`) are splitting impressions for the same queries. Record which URL ranks for which query, and adjust titles or links only if there's real cannibalization.
  - Candidate pieces, each gated on data: handicaps in Nassau and Skins (stroke allocation in match play); mixed-handicap groups; how to settle multiple side games; a Ryder Cup-style trip format; an Overall Match explainer (GoLo's press-carrying game, which has no guide). Up to two get full briefs (angle, first-party evidence, required sources, internal links).
  - Comparison pages ("best golf side-game apps") are explicitly deferred until after launch, and then only as transparent comparisons with criteria and competitors' real strengths.
- **Out of scope:** writing the pieces. Each approved brief becomes its own issue.
- **Acceptance criteria:**
  - [ ] Every row cites GSC numbers and a date range.
  - [ ] No more than two new briefs per month.
- **Dependencies:** SEO-07.

---

### SEO-21 · Entity: off-site profile plan and a launch-day SEO checklist

- **Priority:** P2 · **Milestone:** M6 · **Impact** 4 · **Effort** S · **Confidence** Medium
- **Problem:** "GoLo" collides with GOLO (the diet), a dice game and putters. The only `sameAs` today is Instagram. The appLive flip will change availability claims, schema and CTAs all at once, with no checklist.
- **Scope:**
  - `docs/entity.md`:
    - The canonical boilerplate (from SEO-13) and a 160-character version.
    - The naming rule: "GoLo Golf" for the company and website; "GoLo" for the app.
    - A profile table (platform, URL, owner, status, in `sameAs`?). Candidates: App Store, Google Play (both at launch), Instagram (live), founder profile (if SEO-14), Product Hunt at launch (optional), relevant golf communities where the owner already takes part.
    - `sameAs` includes only live, GoLo-controlled profiles.
  - The launch checklist: set `NEXT_PUBLIC_APP_LIVE` and the store URLs (memory: env flags are build-time, so merge first and then Apply in hPanel); registry statuses; `SoftwareApplication` offers and OS (SEO-05); `sameAs` gets the store URLs; `FinalCTA` fine print; a GSC URL Inspection of `/`; an Instagram bio link; a product-update post.
- **Out of scope:** creating accounts (the owner does that); paid listings.
- **Acceptance criteria:**
  - [ ] The doc is committed. `siteConfig` gains a `sameAs` array fed from it, so Organization `sameAs` isn't hard-coded in `app/page.tsx`.
- **Dependencies:** SEO-05, SEO-13.

---

### SEO-22 · Outreach: authentic citation targets for the original research

- **Priority:** P3 · **Milestone:** M6 · **Impact** 3 · **Effort** S · **Confidence** Low
- **Scope:** `docs/outreach.md`: 10–20 specific, relevant targets (golf podcasts that cover betting games, golf-trip planners and newsletters, build-in-public and indie-app writers, golf subreddits where the owner is already an active participant), each with the angle, which GoLo page is the source, and the contact route. The owner sends every message personally. No templated mass mail, no paid links, no link swaps, no posting under fake personas.
- **Acceptance criteria:**
  - [ ] Each target has a reason it would care, tied to SEO-17 or SEO-18.
  - [ ] Results get logged in the monthly report.
- **Dependencies:** SEO-17 or SEO-18 live.

---

### SEO-23 · Feed: RSS for `/blog`

- **Priority:** P3 · **Milestone:** M6 · **Impact** 2 · **Effort** S · **Confidence** High
- **Scope:** `app/blog/feed.xml/route.ts` (static), generated from `publishedPosts`: title, link, guid = canonical URL, pubDate, the excerpt as the description, an author per SEO-14 if present. Add `<link rel="alternate" type="application/rss+xml">` through `/blog` and article metadata `alternates.types`. Put it in the footer next to the newsletter link.
- **Acceptance criteria:**
  - [ ] The feed validates (W3C Feed Validator).
  - [ ] Unpublished posts are absent.
  - [ ] It isn't added to the sitemap.
- **Dependencies:** none.

---

### SEO-24 · Experiment: `llms.txt` generated from existing content

- **Priority:** P3 · **Milestone:** M6 · **Impact** 1 · **Effort** XS · **Confidence** Low
- **Framing (put this in the issue body):** no major search engine has confirmed any ranking or citation benefit. It doesn't replace crawlable HTML. It must contain nothing that isn't on the site. Time-box it to an hour.
- **Scope:** `app/llms.txt/route.ts`: the boilerplate, plus links to `/about`, `/features`, `/how-it-works`, `/faq`, the guides and the posts, generated from the content layer so it can't drift. Do it only after M1, so it reflects the registry. Record server-log hits from AI user agents for 60 days (if Hostinger logs are available), then keep or remove it.
- **Dependencies:** SEO-03, SEO-04.

---

## 5. Dependency map

```
SEO-01 Trip mode hotfix ─────────────────────────────── (none; ship first)
SEO-02 Blog index drafts ────────────────────────────── (none)

SEO-03 Capability registry (needs owner status table)
  ├─→ SEO-04 Reconcile claims ─┬─→ SEO-06 Content checks in lint ─→ SEO-19 Internal links
  │                            ├─→ SEO-17 Testing study (also ← SEO-16 evidence log)
  │                            ├─→ SEO-18 Settle-up build note ─→ SEO-19
  │                            └─→ SEO-24 llms.txt
  ├─→ SEO-05 SoftwareApplication ─→ SEO-21 Entity profiles + launch checklist
  └─→ SEO-13 /about

SEO-11 Entity builders ─┬─→ SEO-12 dateModified
                        ├─→ SEO-13 /about ─→ SEO-14 Authorship ─→ (SEO-17, SEO-23 soft)
                        └─→ SEO-17

SEO-07 GSC revalidation (Oct 22–Nov 5) ─┬─→ SEO-10 Monthly report (also ← SEO-08, SEO-09 soft)
                                        └─→ SEO-20 Content plan
SEO-08 GA4 key event ─────────────────────→ SEO-10
SEO-15 ESC fix + WHS sources ────────────── (none)
SEO-16 Evidence log ─────────────────────────→ SEO-17 ─→ SEO-22 Outreach
```

The chain the brief asked about: **registry (03) → copy reconciliation (04) → schema reconciliation (05) → content QA automation (06).**

---

## 6. Execution order

Run one issue at a time: issue → branch → PR → review → merge → verify live.

1. **SEO-01** Trip mode hotfix (no dependencies, live on `/`)
2. **SEO-02** Blog index drafts
3. **SEO-08** GA4 key event: an owner task in the GA4 UI, can happen today
4. **SEO-03** Capability registry. Start the owner status questionnaire on day 1, because this is the critical path.
5. **SEO-11** Entity builders. Doesn't touch copy, so it can run while the owner answers SEO-03.
6. **SEO-15** ESC fix + sources. Independent.
7. **SEO-04** Reconcile claims
8. **SEO-05** SoftwareApplication
9. **SEO-06** Content checks in lint
10. **SEO-07** GSC revalidation: run on or after October 22, whatever else is in flight
11. **SEO-12** dateModified
12. **SEO-13** /about
13. **SEO-14** Authorship, if the owner agrees
14. **SEO-09** utm_source attribution (database column first)
15. **SEO-10** First monthly report (November)
16. **SEO-18** Settle-up build note
17. **SEO-16** Evidence log (owner; start early, it takes calendar time)
18. **SEO-17** Testing study
19. **SEO-19** Internal linking
20. **SEO-20** Content plan
21. **SEO-21** Entity profiles + launch checklist
22. **SEO-23** RSS
23. **SEO-22** Outreach
24. **SEO-24** llms.txt (optional)

**Owner decisions that unblock the most work:** the SEO-03 status table (platform, GPS, Wolf/BBB, share card, live link, notifications, saved groups); the blog draft-card treatment (SEO-02); named authorship yes or no (SEO-14); whether "<30s" stays (SEO-04).

---

## 7. Deferred or rejected

| Recommendation | Decision | Why |
|---|---|---|
| Add or regenerate sitemap, robots.txt, canonicals, titles, OG | Rejected | Done and verified live (October 4–8 work) |
| Broad image optimization or new hero work | Rejected | AVIF/WebP tiers, art-directed heroes, phone frames and OG cards shipped (#17–#58). Performance re-evaluation waits for CWV field data (SEO-07) |
| More FAQPage/HowTo markup for rich results | Rejected | Google limits FAQ rich results to authoritative government/health sites and has deprecated HowTo results. Keep the existing semantic markup; add none |
| `aggregateRating` / `Review` schema | Rejected | No real ratings exist; fabricated ratings are a manual-action risk |
| Schema expansion (Product, Event, SportsActivity, Speakable) | Rejected | No user or search benefit; adds surface that can drift |
| Programmatic city/course pages ("golf betting in Scottsdale") | Rejected | Thin doorway pages; the trip posts already cover destinations with real content |
| "Best golf betting apps" comparison now | Deferred to post-launch | Ranking a pre-release app first is self-serving; revisit with transparent criteria (SEO-20) |
| Changing title suffix "· GoLo" → "· GoLo Golf" | Deferred | Adds 5 characters to titles that are already at the limit; `og:site_name` and WebSite name carry the brand (SEO-11) |
| A consent banner to raise the GA4 sample | Not an SEO task | Product/counsel decision (already noted in `docs/seo-progress.md`) |
| A CMS for content | Rejected | Typed `lib/content` plus the registry and lint covers the need |
| Dedicated per-guide OG cards | Deferred (P3, unscheduled) | Guides share the default card; worth doing only if social referrals to guides show up in reports |
| `llms.txt` as a priority | Rejected (kept as a P3 time-boxed experiment, SEO-24) | No confirmed benefit |
| "Optimize for ChatGPT" copy rewrites | Rejected | Answer readiness comes from the factual fixes, citations and original evidence above, measured by the SEO-10 spot check |
| Redirect-chain fix for `http://…/path/` (two hops) | Deferred | Harmless; reported as expected in SEO-07. Fix only if GSC flags it |

---

## 8. 30 / 60 / 90 days

**Days 1–30 (October 14 – November 13): integrity, indexation, entity basics, measurement**
- Merge SEO-01 and SEO-02 this week.
- The owner completes the SEO-03 table. SEO-03, -04, -05 and -06 merge, so the site states one consistent capability set and the lint enforces it.
- SEO-11 and SEO-15 merge (the connected graph, the ESC fix, the WHS citations).
- SEO-08 done in GA4. SEO-07 run between October 22 and November 5 and written up.
- The owner starts the SEO-16 evidence log.

**Days 31–60 (November 14 – December 13): original content, linking, query-led planning**
- SEO-12, SEO-13 and SEO-14 (if agreed) merge: dates, /about, bylines.
- SEO-18 publishes, then SEO-17 once SEO-16 is complete.
- SEO-19 internal-link pass. SEO-20 content plan from the November data, with up to two briefs.
- SEO-09 lands (column first). The first monthly report (SEO-10) is filed with the AI-answer spot check.

**Days 61–90 (December 14 – January 12): authority, distribution, AI citation monitoring**
- SEO-21 entity doc and launch checklist ready before any appLive flip.
- SEO-22 outreach for the research posts, sent by the owner.
- SEO-23 RSS; SEO-24 only if everything above is done.
- The second monthly report: compare AI-answer accuracy and citations with month one; open content issues for any AI answer that misstates GoLo, against the page it cited.
- Re-check GSC at roughly 90 days after the deploy (January 6) against both the October 8 baseline and the SEO-07 data.
