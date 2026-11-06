# Rules Center source map

Every official source the Rules Center cites, where it lives, how to link to it, and when it was last checked. Issue #231 (RULES-001); spec §3 and Amendments A6, A11–A13; tracking epic #230. `scripts/check-rules-sources.mjs` (#245) checks the R&A rows of this file automatically; the USGA rows are checked by hand.

**Checked:** November 6, 2026, by fetching each page (R&A with a script, USGA in a browser).

## Source hierarchy

As spec §3, unchanged:

1. The Rules of Golf and the Definitions (2023 edition, in force).
2. Official clarifications and Committee Procedures.
3. Model Local Rules, **only** where a Committee has adopted them. A record citing one must carry `localRuleCaveat` and `requiresCommitteeAdoption` (#233).
4. The Rules of Handicapping, a separate body of rules, cited only for handicap-posting caveats and never as a playing rule.
5. GoLo's own explanations and examples, which cite 1–4.

## Rights

- **R&A terms** (https://www.randa.org/sw/terms-and-conditions, read November 6, 2026): content on the site may be used "only for your personal, non-commercial use" with the copyright owner acknowledged; otherwise it may not be reproduced, modified or commercially exploited.
- **WHS terms** (https://www.whs.com/footer/terms-of-use.html): same position for Rules of Handicapping material.
- **What the Rules Center may do:** state facts and procedures in original words; use rule numbers, rule titles and Definition names as navigation references; link to the official pages.
- **What it may not do:** quote rule text beyond a few words of a defined term, reproduce or adapt official diagrams, videos, logos or marks, or imply endorsement ("official", "approved by", "partner").
- **Enforcement:** `scripts/check-rules-copy.mjs` (#245) flags any run of eight or more words shared with the cached official text. The page carries an independent-site note: GoLo isn't affiliated with or endorsed by The R&A or the USGA.

## R&A: Rules of Golf (primary)

- **Index:** https://www.randa.org/en/rog/the-rules-of-golf. The 25 titles in `inventory.md` match it.
- **Rule pages:** `https://www.randa.org/en/rog/the-rules-of-golf/rule-N`. All 25 return 200 to a script.
- **Subrule links:** `rule-N#N_xy`, e.g. `https://www.randa.org/en/rog/the-rules-of-golf/rule-18#18_2b`. Anchors use underscores. Sub-items such as 12.2b(1) have no anchor of their own: link the nearest subrule (`12_2b`) and name the sub-item in the text.

Every anchor on every rule page, as fetched November 6, 2026:

| Rule | Page | Subrule anchors (fragment ids) |
|---:|---|---|
| 1 | `rule-1` | `1_1` `1_2` `1_2a` `1_2b` `1_3` `1_3a` `1_3b` `1_3c` |
| 2 | `rule-2` | `2_1` `2_2` `2_2a` `2_2b` `2_2c` `2_3` `2_4` |
| 3 | `rule-3` | `3_1` `3_1a` `3_1b` `3_1c` `3_2` `3_2a` `3_2b` `3_2c` `3_2d` `3_3` `3_3a` `3_3b` `3_3c` |
| 4 | `rule-4` | `4_1` `4_1a` `4_1b` `4_1c` `4_2` `4_2a` `4_2b` `4_2c` `4_3` `4_3a` `4_3b` |
| 5 | `rule-5` | `5_1` `5_2` `5_2a` `5_2b` `5_3` `5_3a` `5_3b` `5_4` `5_4a` `5_4b` `5_5` `5_5a` `5_5b` `5_5c` `5_6` `5_6a` `5_6b` `5_7` `5_7a` `5_7b` `5_7c` `5_7d` |
| 6 | `rule-6` | `6_1` `6_1a` `6_1b` `6_2` `6_2a` `6_2b` `6_3` `6_3a` `6_3b` `6_3c` `6_3d` `6_4` `6_4a` `6_4b` `6_4c` `6_4d` `6_5` |
| 7 | `rule-7` | `7_1` `7_1a` `7_1b` `7_2` `7_3` `7_4` |
| 8 | `rule-8` | `8_1` `8_1a` `8_1b` `8_1c` `8_1d` `8_2` `8_2a` `8_2b` `8_3` `8_3a` `8_3b` |
| 9 | `rule-9` | `9_1` `9_1a` `9_1b` `9_2` `9_2a` `9_2b` `9_3` `9_4` `9_4a` `9_4b` `9_5` `9_5a` `9_5b` `9_6` `9_7` `9_7a` `9_7b` |
| 10 | `rule-10` | `10_1` `10_1a` `10_1b` `10_1c` `10_1d` `10_2` `10_2a` `10_2b` `10_3` `10_3a` `10_3b` `10_3c` |
| 11 | `rule-11` | `11_1` `11_1a` `11_1b` `11_2` `11_2a` `11_2b` `11_2c` `11_3` |
| 12 | `rule-12` | `12_1` `12_2` `12_2a` `12_2b` `12_3` |
| 13 | `rule-13` | `13_1` `13_1a` `13_1b` `13_1c` `13_1d` `13_1e` `13_1f` `13_2` `13_2a` `13_2b` `13_2c` `13_3` `13_3a` `13_3b` |
| 14 | `rule-14` | `14_1` `14_1a` `14_1b` `14_1c` `14_2` `14_2a` `14_2b` `14_2c` `14_2d` `14_2e` `14_3` `14_3a` `14_3b` `14_3c` `14_3d` `14_4` `14_5` `14_5a` `14_5b` `14_5c` `14_6` `14_6a` `14_6b` `14_6c` `14_7` `14_7a` `14_7b` |
| 15 | `rule-15` | `15_1` `15_1a` `15_1b` `15_2` `15_2a` `15_2b` `15_3` `15_3a` `15_3b` `15_3c` |
| 16 | `rule-16` | `16_1` `16_1a` `16_1b` `16_1c` `16_1d` `16_1e` `16_1f` `16_2` `16_2a` `16_2b` `16_3` `16_3a` `16_3b` `16_4` |
| 17 | `rule-17` | `17_1` `17_1a` `17_1b` `17_1c` `17_1d` `17_1e` `17_2` `17_2a` `17_2b` `17_3` |
| 18 | `rule-18` | `18_1` `18_2` `18_2a` `18_2b` `18_3` `18_3a` `18_3b` `18_3c` |
| 19 | `rule-19` | `19_1` `19_2` `19_2a` `19_2b` `19_2c` `19_3` `19_3a` `19_3b` |
| 20 | `rule-20` | `20_1` `20_1a` `20_1b` `20_1c` `20_2` `20_2a` `20_2b` `20_2c` `20_2d` `20_2e` `20_2f` `20_3` |
| 21 | `rule-21` | `21_1` `21_1a` `21_1b` `21_1c` `21_1d` `21_1e` `21_2` `21_2a` `21_2b` `21_2c` `21_2d` `21_2e` `21_3` `21_3a` `21_3b` `21_3c` `21_3d` `21_3e` `21_4` `21_4a` `21_4b` `21_4c` `21_5` |
| 22 | `rule-22` | `22_1` `22_2` `22_3` `22_4` `22_4a` `22_4b` `22_5` `22_6` |
| 23 | `rule-23` | `23_1` `23_2` `23_2a` `23_2b` `23_2c` `23_3` `23_3a` `23_3b` `23_3c` `23_4` `23_5` `23_5a` `23_5b` `23_6` `23_7` `23_8` `23_9` `23_9a` `23_9b` |
| 24 | `rule-24` | `24_1` `24_2` `24_3` `24_4` `24_4a` `24_4b` `24_4c` |
| 25 | `rule-25` | `25_1` `25_2` `25_2a` `25_2b` `25_2c` `25_2d` `25_2e` `25_2f` `25_2g` `25_2h` `25_3` `25_3a` `25_3b` `25_3c` `25_3d` `25_4` `25_4a` `25_4b` `25_4c` `25_4d` `25_4e` `25_4f` `25_4g` `25_4h` `25_4i` `25_4j` `25_4k` `25_4l` `25_4m` `25_4n` `25_5` `25_5a` `25_5b` `25_5c` `25_5d` `25_5e` `25_6` `25_6a` `25_6b` |

## R&A: Definitions, Clarifications, Committee Procedures

| Source | URL | Linking | Notes |
|---|---|---|---|
| Definitions | https://www.randa.org/en/rog/definitions | Page level, term named in the link text | Single-word terms have readable ids (`#lost`, `#moved`, `#drop`, `#embedded`, `#obstruction`, `#club-length`); multi-word terms have opaque ids (Penalty Area, Relief Area, Known or Virtually Certain, Nearest Point of Complete Relief…). Opaque ids aren't stable enough to promise, so Definitions are cited at page level (A12). The source check asserts the term name appears on the page. |
| Clarifications (R&A) | https://www.randa.org/en/rog/clarifications | Page level | Rendered client-side; a script sees only the shell. Checked by hand. |
| Committee Procedures, Section 8 (Model Local Rules) | https://www.randa.org/en/rog/committee-procedures/sections/8 | Page level, MLR named in the link text | E-5 ("Alternative to Stroke and Distance for Lost Ball or Ball Out of Bounds") and E-3 (preferred lies) sit in section 8E, a collapsed block with no stable anchor (rendered ids look like `8#8e`). The source check asserts "E-5" is present in the page data. |
| Player's Rule Finder | https://www.randa.org/players-rule-finder | Not cited | Competitor reference only (see `canonical-map.md`). |
| Announcement of the 2028 edition | https://www.randa.org/en/articles/new-and-updated-model-local-rules-for-2026 | Cited in `maintenance.md`, not on the page | 14 January 2026: next edition published 1 January 2028. |

## USGA (secondary, checked by hand)

Scripts get 403 from usga.org; a browser loads every page below.

| Source | URL | Checked | Notes |
|---|---|---|---|
| Rules hub | https://www.usga.org/content/usga/home-page/rules-hub.html | 2026-11-06 | Links to the Rules text, Rules app, workshops |
| Rules of Golf text | https://www.usga.org/rules/rules-and-clarifications/rules-and-clarifications.html | 2026-11-06 | Hash-routed (`#section=rules&…`); no deep link is promised |
| Additional Clarifications | https://www.usga.org/rules-hub/clarifications-of-the-rules-of-golf.html | 2026-11-06 | "Updated October 2, 2026"; no new clarifications in October 2026; next update early January 2027 |
| Rules of Handicapping 3.3 | https://www.usga.org/handicapping/roh/Content/rules/3%203%20WhenHoleStartedbutPlayerDoesNotHoleOut.htm | 2026-11-06 | For `conceded-putt`'s handicap caveat only |
| Rules of Handicapping, Definitions | https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm | 2026-11-06 | The hub's Official sources link (#234). The reader has no index (`/handicapping/roh/` is a 404); this is its first page and links every chapter |

## Citations by situation

The anchors each situation is expected to cite. Writers may add subrules; every addition must be an anchor in the table above.

| Situation | R&A anchors | Definitions | Other |
|---|---|---|---|
| `lost-ball` | `18_2a` `18_2b` `7_1` `7_2`; exceptions `17_1c` `16_1e` `9_6` | Lost; Known or Virtually Certain | MLR E-5 (if adopted) |
| `provisional-ball` | `18_3a` `18_3b` `18_3c` | Provisional Ball | |
| `out-of-bounds` | `18_2a` `18_2b` | Out of Bounds; Boundary Object | MLR E-5 (if adopted) |
| `red-vs-yellow-penalty-areas` | `17_1a` `17_1b` `17_1c` `17_1d` | Penalty Area | |
| `unplayable-ball` | `19_1` `19_2` `19_3a` `19_3b` | | |
| `bunker-sand` | `12_2a` `12_2b` `12_3` | Bunker; Loose Impediment | |
| `cart-path` | `16_1a` `16_1b` `14_3` | Immovable Obstruction; Nearest Point of Complete Relief; Relief Area | |
| `temporary-water` | `16_1a` `16_1b` `16_1c` `16_1d` `16_1e` | Abnormal Course Condition; Temporary Water; Ground Under Repair | |
| `ball-moved` | `9_2` `9_3` `9_4` `9_5` `9_6` | Moved | |
| `mark-lift-clean` | `14_1a` `14_1b` `14_1c` `14_2` `13_1b` | | MLR E-3 (if adopted) |
| `repairing-the-green` | `13_1c` | Putting Green | |
| `conceded-putt` | `3_2b` `3_3c` | | Rules of Handicapping 3.3 |

## Recheck triggers

Recorded in `docs/rules/maintenance.md` (#245): quarterly (January, April, July, October) after the clarifications update; any `check-rules-sources` failure; a reader's correction; the 2028 edition (#251). Each recheck updates the "Checked" date here and `checkedOn` on the records it touched.
