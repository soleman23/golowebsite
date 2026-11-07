# Rules Center maintenance

How the Rules Center stays right after launch: who owns it, when it's checked, what to do when a check fails or a reader reports an error, and how the 2028 edition is handled. Issue #245 (RULES-012); spec §3 "Dates and monitoring" and §12; tracking epic #230. The review stages themselves are in `editorial-review.md`; the sources, anchors and their rights are in `source-map.md`.

Nothing here publishes anything. Monitoring opens issues; a person reads the change; any fix goes through the same review as new copy, including a fix an agent drafted.

## Owner

**The site owner.** The owner is reviewer of record (spec Amendment A2), approves every change to a published record, works the issues the monitoring opens, and does the quarterly review. Claude drafts fixes and runs the checks; two independent reviewer agents check each fix (`editorial-review.md` § Stages); the owner approves or sends it back.

## Cadence

| When | What | Started by |
|---|---|---|
| Monthly, on the 8th | Source check against the live R&A pages | `.github/workflows/rules-sources.yml` (schedule) |
| January, April, July, October | Quarterly clarifications review (below) | The same run opens a "Quarterly clarifications review: <Month Year>" issue |
| Any source-check failure | Read the change; fix or accept it (below) | The run opens "Rules sources check: problems found", or comments on the open one |
| Any reader correction | Correction procedure (below) | A message through "Spot an error?" |
| The 2028 edition | 2028 readiness checklist (below), then #251 | The R&A publishing the text; `lint:content` fails from 1 January 2028 |
| Before launch (#247) and any release that touches records | Release recheck (`editorial-review.md`) | The release PR |

The workflow can also be run by hand: Actions → Rules sources → Run workflow, or `gh workflow run rules-sources.yml`. GitHub turns off scheduled workflows in a repository with no activity for 60 days; if the monthly runs stop appearing, re-enable it on the Actions tab.

## The tools

- **`npm run check:rules-sources`** (`scripts/check-rules-sources.mjs`). Fetches the R&A rules index, the 25 rule pages, the Definitions, the Model Local Rules page and every R&A URL a record cites. It checks that:
  - each page answers 200;
  - each title in `lib/content/rules/official.ts` matches the index, and no rule was added;
  - every subrule anchor in `official.ts` is an `id` on its page, and no new one has appeared;
  - each anchor a record cites is on its page;
  - each cited Definition's term is a defined term;
  - each cited Model Local Rule ("E-5", "E-3") is an item in the Model Local Rules page data.

  Then it hashes the text of each rule, the Definitions and each cited Model Local Rule and compares the hashes with `lib/content/rules/source-hashes.json`. The text is read from the data the R&A ships with each page, so it includes Interpretations and the definitions' wording. It's each item's own text: not the neighbouring rules, menus, shared diagrams or list of all 25 rules the page also carries, so an edit to Rule 19 reports Rule 19 only. One line per problem, exit 1 on any. Needs the network, so it isn't in CI.
  - `-- --update` writes the live hashes to `source-hashes.json` with today's `acceptedOn`. Use it only after someone has read what changed. It refuses while any other problem stands, so a broken or placeholder page can't be accepted as the new text. A PR that starts citing a new Model Local Rule runs it too, after reading that rule.
  - `-- --fixture scripts/fixtures/rules-sources-broken.json` runs offline against synthetic pages with known faults. It must fail.
- **`npm run test:rules-sources`** (`scripts/test-rules-sources.mjs`, part of `npm test`, and run by the workflow after each live check). Hermetic:
  - the broken fixture fails with exactly its ten lines, and the same pages with the faults fixed pass;
  - a neighbouring rule's edit doesn't move a rule's hash, and a retitled Interpretation does;
  - `--update` refuses anything but text changes;
  - the parsing and copy-distance rules hold.
- **`npm run check:rules-copy`** (`scripts/check-rules-copy.mjs`). Review-time, not CI. Caches the official text in `.cache/rules-official/`, which is git-ignored because the R&A's terms allow personal use only. The cache holds one file per page with one item per line, plus `manifest.json` with each file's sha256. The tool flags any run of eight or more consecutive words a record's copy shares with that text, naming the record, the field and the page. It checks every record whatever its status.
  - `-- --refresh` fetches the text again and moves the old copy to `.cache/rules-official/previous/`.
  - `-- --text "<copy>"` checks a sentence before it goes into a record.

## When the source check fails

The issue lists one line per problem. Work through them in a branch; the issue closes with the PR that resolves it.

| Line says | What it means | What to do |
|---|---|---|
| `<url>: HTTP 404` (or another status), `fetch failed` | The page moved, is down or refused the request | Re-run the workflow. If it persists, find the page in a browser. A moved page gets its new URL in `official.ts` (`RULES_INDEX_URL`, `ruleUrl`, the other constants) or the record's source, and every record citing it is rechecked. |
| `Rule N: title is now "…"` | The R&A renamed a rule | Update the title in `official.ts`, the `TITLES` list in `scripts/test-rules.mjs` and `inventory.md`. Recheck the overview for that rule. |
| `Rule N: anchor … gone from …` / `new anchor … on …` | A subrule was removed, renumbered or added | Read the rule page. Update `subrules` in `official.ts`, the anchor table in `source-map.md` and the anchor digest in `scripts/test-rules.mjs`. Every record citing a gone anchor goes back through review. |
| `<url>#N_xy: not on the page (cited by …)` | A record cites an anchor that no longer exists | As above, then fix the named records' sources. |
| `Definitions: "…" not found` | A defined term was renamed or removed | Read the Definitions page; fix the named records' sources and copy. |
| `Model Local Rules: "E-5" not found` | A Model Local Rule was renumbered or withdrawn | Read Committee Procedures Section 8; fix the named records, including their `localRuleCaveat`. |
| `<url>: no rule text in the page data` / `no defined terms in the page data`, `no rule titles found` | The R&A changed how its pages are built, so the check can't read them | Look at the page source and update the parsing in `scripts/rules-sources.mjs`, with a test in `scripts/test-rules-sources.mjs`. Until then the check can't see changes to that page. |
| `<url>: text changed since the accepted hash` (a rule page or the Definitions), `…/sections/8#E-5: text changed…` (that Model Local Rule) | The item's text changed: a clarification, a new or reworded Interpretation, a typo fix | See below. |
| `…: no accepted hash` / `…: has an accepted hash but isn't checked any more` | A record started or stopped citing a Model Local Rule, or a rule was added or removed | Read the item, then `--update`. |

**A text change.** The hash says that an item changed, not what changed. To see it:

1. If `.cache/rules-official/manifest.json` exists and its `sha256` for the page equals the page's hash in `source-hashes.json`, the cached file is the accepted text. Run `npm run check:rules-copy -- --refresh`, then compare the two copies, e.g. `git diff --no-index --word-diff .cache/rules-official/previous/rule-18.txt .cache/rules-official/rule-18.txt`. For a Model Local Rule, compare the `committee-procedures-sections-8.txt` copies and look at that rule's lines.
2. Otherwise, there's no copy of the accepted text to compare with. Read the page, and the R&A and USGA clarifications pages, for anything dated since `acceptedOn` in `source-hashes.json`.
3. Decide, for each record that cites the page (search `lib/content/rules/` for the rule number):
   - **No effect on what the record says:** nothing to change in the record.
   - **It changes what the record says:** re-review the record (`editorial-review.md` § Review triggers). If the change makes a published answer wrong, take the record off the page until the fix is approved, rather than leave wrong advice up.
4. Run `npm run check:rules-sources -- --update`, commit `source-hashes.json` with any record fixes, and say in the PR what changed on each page and what you did about it.

## Quarterly review

The governing bodies publish clarifications quarterly. The USGA's page read "Updated October 2, 2026" on November 6, 2026, and again on launch day, November 7, with the next update due in early January 2027. The monthly run on the 8th of January, April, July and October opens an issue with the checklist below. The workflow copies the block between the `quarterly-review` markers into the issue, so edit the checklist here and nowhere else.

<!-- quarterly-review:start -->
### Clarifications

- [ ] Open the R&A's Clarifications page (https://www.randa.org/en/rog/clarifications) in a browser. List each clarification added or changed since the last review and the rules it touches.
- [ ] Open the USGA's Additional Clarifications page (https://www.usga.org/rules-hub/clarifications-of-the-rules-of-golf.html) in a browser. Note its "Updated" date and compare its list with the R&A's.
- [ ] For each rule touched, find the records that cite it in `lib/content/rules/overviews.ts` and `scenarios.ts`, and re-review any whose copy the clarification affects (`docs/rules/editorial-review.md` § Review triggers).
- [ ] Note any official notice about the next edition, due on 1 January 2028 (#251).

### Manual USGA checklist

usga.org answers scripts with 403, so these are opened by hand in a browser.

- [ ] Rules hub (https://www.usga.org/content/usga/home-page/rules-hub.html) loads and still links to the Rules text.
- [ ] Rules of Golf text (https://www.usga.org/rules/rules-and-clarifications/rules-and-clarifications.html) loads.
- [ ] Additional Clarifications loads, with the date noted above.
- [ ] Rules of Handicapping 3.3 (https://www.usga.org/handicapping/roh/Content/rules/3%203%20WhenHoleStartedbutPlayerDoesNotHoleOut.htm) loads, and the `conceded-putt` handicap caveat still matches it.
- [ ] Any other usga.org URL a record cites (search `lib/content/rules/` for `usga.org`) loads and still says what the record relies on.

### Record it

- [ ] Run `npm run check:rules-sources` and resolve any problem it reports.
- [ ] In `lib/content/rules/edition.ts`, set `clarificationsUpdated` to the USGA page's "Updated" date and `clarificationsCheckedOn` to today.
- [ ] In `docs/rules/source-map.md`, update the "Checked" date and the USGA table's Checked column.
- [ ] Merge the PR with those changes and any record fixes, then close this issue with one line: what changed, which records were rechecked, and the PR.
<!-- quarterly-review:end -->

`lint:content` warns when `clarificationsCheckedOn` is more than 100 days old, so a missed quarter shows up in every build.

## Correction procedure

1. **Report.** The hub's Official sources panel has a "Spot an error?" link to the contact form (built by #234). A report arrives like any contact message: in the support inbox and as a `ContactMessage` row.
2. **Triage.** The owner reads it against the record and its cited sources. A report that a published answer gives the wrong procedure or penalty goes first.
   - **Not an error:** reply with the rule and subrule that cover it. Nothing else changes.
   - **An error, or a fair point about clarity:** open an issue labelled `rules-center` and `owner-review`, titled "Correction: <record id>". Name the record, the field and the claimed problem. The reader's name and email stay in the inbox, never in the issue or the repo.
   - **A wrong published answer:** as above, and take the record off the page until the fix is approved.
3. **Fix and re-review.** Draft the fix, run `npm run check:rules-copy`, then the full review in `editorial-review.md`: both reviewer agents, then the owner's approval. A fix an agent drafted gets no shortcut.
4. **Record it.** Update the record's dates as in the table below, add the `reviewLog` entries and add the entry to the record's review packet (`docs/rules/review-packet-overviews.md` or `docs/rules/review-packet-situations.md`).
5. **Reply** to the reader once the fix is live, and close the issue with the PR.

## What changes where

| Field or file | Changes when | Notes |
|---|---|---|
| `reviewedOn` (record) | Only when the owner re-approves the record | Always the latest `approval` entry in `reviewLog`; `validateRules` enforces it. A recheck that finds nothing to change doesn't move it. |
| `updatedOn` (record) | A substantive change to a published record: its answer, a condition, an option, a penalty, a caveat or a citation | Not for typo or style fixes. Never before `publishedOn`. |
| `checkedOn` (each source) | The day someone actually opened that source for that record | Set during drafting, review and rechecks; never copied from another record. |
| `reviewLog` (record, internal) | Every review stage of every re-review | Entries for `rules`, `product`, `seo`, then `approval` (`editorial-review.md`). |
| `lib/content/rules/edition.ts` | `clarificationsUpdated` and `clarificationsCheckedOn` at each quarterly review; `id`, `label`, `effectiveFrom` and `supersededOn` only for a new edition (#251) | |
| `lib/content/rules/source-hashes.json` | After someone has read a reported text change, or when a record starts citing a new Model Local Rule: `check:rules-sources -- --update` | `acceptedOn` is the day of that reading. Hashes only; no rule text is stored. |
| `lib/content/rules/official.ts` | A title or anchor change the check reports | With the `TITLES` list or the anchor digest in `scripts/test-rules.mjs` and the anchor table in `source-map.md`. |
| `docs/rules/source-map.md` | Any recheck: the "Checked" date, the USGA table's Checked column, the anchor table | |
| `docs/rules/review-packet-overviews.md`, `docs/rules/review-packet-situations.md` | Every re-review | One entry per record, as for new copy. |

## 2028 readiness checklist

The R&A said on 14 January 2026 that the next edition of the Rules arrives on 1 January 2028 (`source-map.md`). `edition.ts` has `supersededOn: "2028-01-01"`, and from that day `lint:content` fails, so every pull request fails CI until #251 has moved the records. The new text may be published before then; don't assume a date.

- [ ] Each quarterly review in 2027 notes any announcement about the 2028 text, its publication date and any change to the R&A's URLs.
- [ ] When the text is published, run `npm run check:rules-sources`. Expect titles, anchors, definitions, Model Local Rule codes and every hash to be reported; save the output in #251.
- [ ] Rights review of the new material (`source-map.md` § Rights) before anything cites it.
- [ ] Rule-by-rule diff of 2023 against 2028: titles, subrules, Definitions added, renamed or removed, Model Local Rules renumbered (E-5, E-3).
- [ ] Add the 2028 edition: `RulesEditionId`, a new `edition.ts` record with the next `supersededOn` if one is announced, and a dated note on the page that it moved to the 2028 edition, rather than overwriting silently.
- [ ] Update `official.ts`, the `TITLES` list and anchor digest in `scripts/test-rules.mjs`, the anchor table in `source-map.md` and the titles in `inventory.md`.
- [ ] Re-review every overview and situation against the 2028 text: new `checkedOn` dates, `reviewLog` entries, owner approval, then `reviewedOn` and `updatedOn`.
- [ ] Run `npm run check:rules-copy -- --refresh` on every record.
- [ ] Run `npm run check:rules-sources -- --update` once the new pages have been read, and commit the hashes.
- [ ] Glossary entries that cite the Rules of Golf get the same pass (`docs/glossary/editorial-review.md`).
- [ ] Land #251 before 1 January 2028. If the review can't finish in time, the owner decides what the page says until it does; it doesn't keep presenting 2023 answers as current.
