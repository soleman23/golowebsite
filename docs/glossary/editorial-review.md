# Glossary editorial review

How a glossary term goes from draft to published, who checks what, and what counts as evidence. Issue #152 (GLS-001); spec §10.1–10.4. Every content batch (#158–#162) and every expansion batch (#168) follows this file.

**Status:** prepared October 28, 2026. The two decisions recorded below are the owner's (#152, October 28, 2026). The role assignments under [Roles](#roles) are a proposal (`inventory.md` Q5).

## Decisions already made

- **Voice: house tone.** CLAUDE.md governs: plain, dry, specific; no hype, no emoji, no exclamation marks. The spec's "funny, irreverent" means dry humour, optional, after the answer. (Owner, October 28, 2026.)
- **Reviewer of record** for the rules and WHS fact-check: **the owner**. (Owner, October 28, 2026.)
- **`reviewedBy` is internal.** It never renders on a page, never goes into the client payload or structured data. The only review signal a visitor sees is "Reviewed <date>" from `reviewedOn`, and only on a term with a real review record. (Owner, October 28, 2026.)

## Lifecycle

| Status | Meaning | Where it can appear |
|---|---|---|
| `planned` | In `inventory.md`, no record written | Nowhere |
| `draft` | Record written, not yet through every review stage | Tests and fixtures only. Never public HTML, search payload, sitemap, schema, `llms.txt`, or links |
| `in-review` | Draft finished, review stages in progress | Same as draft |
| `approved` | Every stage passed and recorded, owner approval recorded | Local review only: `next dev`, or a local build with the launch constant flipped, clearly marked as not published. Never production, never a Hostinger preview (`glossaryLive` has no preview override) |
| `published` | Set only by the launch PR (#166) or a later release PR | Public, once `glossaryLive` is true |
| `archived` | Removed from the glossary | Nowhere public. Inbound links to it fail `lint:content` |

Records merge at `approved` in the content PRs (#158–#162). Only the launch PR moves `approved` to `published`, and it sets `publishedOn` to the real date that PR merges and deploys. No agent sets `approved` or `published` on its own say-so.

## Stages

Spec §10.1, in order. One person may fill several roles; no stage is skipped, and a stage done by an agent is labelled as such.

| # | Stage | What's checked | Evidence recorded |
|---|---|---|---|
| 1 | **Draft** | Original wording; the [definition standards](#definition-standards) | The record itself, at `draft` |
| 2 | **Rules fact-check** | Every statement about the Rules of Golf or the WHS against the current primary text; examples recomputed | For each source: title, URL, rule or definition number, **the date the reviewer actually opened it**. Recomputed numbers in the PR |
| 3 | **GoLo product audit** | Every sentence about GoLo against `lib/content/capabilities.ts`; every `capabilityIds` entry is the right one and `live` where the copy leans on it | The capability ids and their `verified` dates at the time of the audit |
| 4 | **SEO/canonical review** | Canonical matches `canonical-map.md`; no competing intent; related links resolve; anchor text is descriptive | Canonical target and related paths in the record; `lint:content` passing |
| 5 | **Approval** | The whole record, stages 1–4 present | `reviewedOn` set to the approval date; status `approved` |

A record moves from `in-review` to `approved` only when stages 2–5 each have a dated entry in its review log.

## Roles

| Role | Who | Basis |
|---|---|---|
| Writer (stage 1) | An agent or the owner | — |
| Rules fact-check (stage 2) | **The owner** | Owner decision, October 28, 2026. An agent may prepare the check (source links, rule numbers, recomputed examples), but the owner signs it |
| GoLo product audit (stage 3) | The owner (proposed) | `capabilities.ts` changes only on an app check or the owner's word; this repo doesn't read the app repo |
| SEO/canonical review (stage 4) | An agent prepares it, the owner confirms (proposed) | Mechanical checks are in `lint:content`; the judgement calls are in `canonical-map.md` |
| Approval (stage 5) | **The owner** | Content owner |

Never invent a reviewer, credential, review date or source check. If a stage hasn't happened, the record says so by not having that entry.

## Review record format

Implemented in #155 as part of `GlossaryTerm`. Internal fields are stripped by every public selector and never reach a page, the client, `llms.txt` or JSON-LD.

```ts
// public
reviewedOn?: string;   // ISO date of approval; shown as "Reviewed <date>"
publishedOn?: string;  // set by the launch PR only
updatedOn?: string;    // only for a substantive editorial change

// internal (never public)
reviewedBy?: string;   // who approved; "owner" for the owner
reviewLog?: {
  stage: "rules" | "product" | "seo" | "approval";
  by: string;          // "owner", or "agent" for prepared work the owner then signed
  on: string;          // ISO date the stage actually happened
  note?: string;       // e.g. "RoH Appendix C recomputed: 14 × 90% = 12.6 → 13"
}[];
```

Each source in `sources` carries `accessedOn` only if someone actually opened it that day. A source without `accessedOn` is a reference to check, not a check.

Validation (#155):

- dates are ISO `YYYY-MM-DD`, and `reviewedOn ≤ publishedOn ≤ updatedOn`;
- an `approved` or `published` record has `reviewedOn`, `reviewedBy` and a log entry for each of `rules`, `product`, `seo`, `approval`;
- a `published` record has `publishedOn`;
- a record whose category is `handicaps`, or whose inventory row cites RoG or RoH, has at least one `official-rules` or `handicapping` source with `accessedOn` before it can be `approved`.

## Definition standards

Spec §10.2, the house rules, and what the claim and vocabulary checks enforce. The writer and every reviewer use it.

**Answer**
- [ ] The first sentence is the definition. Normally 20–45 words for the short definition; accuracy wins over length.
- [ ] Original wording. Not adapted from Sunday Golf or any other glossary; competitor pages are for spotting gaps only.
- [ ] Agrees with the site's existing wording (`inventory.md` § Existing site definitions), or the conflict is listed there.

**Example**
- [ ] Priority terms (P0, P1) have one concrete example with real numbers: a hole number, a score, an index, a dollar amount.
- [ ] Every number in the example is recomputed by the reviewer, inputs shown so a reader can redo it (#160).
- [ ] Amounts are small and agreed in advance ("$5 a side", "$2 skins"), as on the rest of the site.

**Rules, conventions, house rules**
- [ ] Says which it is where it matters: an **official rule** (cite it), a **common convention**, or a **house rule** that groups set differently.
- [ ] Modern Rules terms (teeing area, penalty area, general area), with the colloquial or pre-2019 term as an alias and one plain line about it.
- [ ] Handicap entries keep the WHS and GoLo apart. Allowances, low-man play and mixed tees are explained as golf, never as a GoLo setting.

**GoLo**
- [ ] GoLo is mentioned only where it helps the reader, and only for what the registry marks `live`.
- [ ] GoLo statements reference `capabilityIds`, never a literal status ("live", "coming soon") typed into the record.
- [ ] Never implies:
  - automatic presses, or presses on a Nassau;
  - allowances, playing off the low man, or mixed tees;
  - holding, moving, sending or processing money;
  - always the fewest payments;
  - a measured distance for Closest to the Pin or Longest Drive;
  - a trip tally;
  - Wolf or Bingo Bango Bongo in a scramble;
  - a Texas scramble drive count, or a shamble.
- [ ] Unsupported formats carry no GoLo badge or note. Stableford, Quota and Vegas are golf, full stop.

**Voice**
- [ ] Plain, dry, specific. No hype, no emoji, no exclamation marks.
- [ ] Humour, if any, comes after the answer and doesn't bend a fact.
- [ ] Doesn't make a beginner the joke.
- [ ] Explains any jargon it uses, or links the term that does.

**Vocabulary** (`scripts/check-content.mjs`, `NEVER_WORDS`)
- [ ] None of: gamble, wager, stake(s), odds, bet(s), betting, pot(s), pool(s), purse(s), winnings, payout(s), "pay out", cash, "money on the line", "who pays whom". Use "match", "amount", "what each player plays for", "settle up", "who owes whom".
- [ ] Golf's own uses are fine: a pot bunker, white or red stakes.

**Links**
- [ ] `relatedTermIds` reference ids in `inventory.md`.
- [ ] `relatedContentPaths` and an `existing` canonical are served pages (checked by `lint:content`).
- [ ] Anchor text describes the destination: "the Nassau guide", not "read more".

## Source hierarchy

Spec §10.3, highest first. A lower source never overrides a higher one on the same point.

1. Current R&A / USGA **Rules of Golf** (and Committee Procedures, Equipment Rules) for definitions and procedures.
2. Current USGA **Rules of Handicapping** (WHS) for handicaps, ratings and posting.
3. Reputable instruction and specialist golf sources for terminology and general practice, cross-checked against a second source.
4. Verified GoLo code and the capability registry for product behaviour.
5. Golf community usage for slang and informal house rules, labelled as such.

`inventory.md` § Source map names the source for each record, with the edition caveats. In particular, a Rules of Golf revision may take effect January 1, 2027, before or near launch.

## Review triggers

Spec §10.4. Any of these reopens the affected records (status back to `in-review` until re-approved):

- A Rules of Golf or Rules of Handicapping revision, or a governing-body clarification that touches a cited rule. At minimum, an annual source review of every `official-rules` and `handicapping` source.
- A change to a capability a record references (status, `limits`, or a new `verified` entry), or an app release that changes behaviour the registry describes.
- A reported error or ambiguity, from anyone.
- Repeated failed searches or "term missing" requests once #165's measurement exists.
- Search Console evidence that a glossary anchor competes with a guide or post (#167, #169).

`updatedOn` changes only with a substantive editorial change, never for a typo or formatting fix.

## Release recheck

Before the launch PR (#166) moves anything to `published`:

1. Every `official-rules` / `handicapping` source is reopened. If the edition changed since `accessedOn`, the entry is rechecked against the new text and its log gets a new `rules` entry.
2. Every `capabilityIds` reference is rechecked against the registry. The registry is rechecked against the app through #154's follow-ups.
3. The owner approves the release in #166.
