# Rules Center editorial review

How a rule overview or situation gets from draft to published, who checks what, and the writing standards it's checked against. Issue #231 (RULES-001); spec §5, §7, §13 and Amendments A2, A5; tracking epic #230. Modelled on `docs/glossary/editorial-review.md`; where this file is silent, that one applies.

## Decisions already made

- The owner is reviewer of record (A2). Claude drafts; two independent reviewer agents check; the owner approves. `reviewedBy` and `reviewLog` stay internal and never reach a page, the client, `llms.txt` or JSON-LD.
- A page shows "Reviewed <date>" only for a published record whose approval really happened on that date.
- House voice over spec voice (A5). No humour anywhere near a penalty or Rule 25.
- Nothing is auto-published. An update drafted by an agent goes through the same stages as new copy.

## Lifecycle

`planned → draft → in-review → approved → published` (and `archived` for a retired record).

| Status | Meaning | Where it shows |
|---|---|---|
| `planned` | In `inventory.md`; skeleton record with id, number/slug, title and category only | Nowhere |
| `draft` | Copy written, not yet reviewed | Nowhere |
| `in-review` | Both reviewer agents have run and their findings are fixed | Nowhere |
| `approved` | Owner approved | `next dev` only, marked unpublished |
| `published` | Moved by the launch PR (#247) or a later reviewed change | `/rules`, search, sitemap, schema, llms.txt |
| `archived` | Retired; its fragment is listed in `canonical-map.md` §Retired fragments | Nowhere |

## Stages

Same four stages as the glossary, so `ReviewEntry` is shared in shape:

| Stage | Who | What is checked |
|---|---|---|
| `rules` | Reviewer agent A | Every factual sentence against the fetched R&A rule text and Definitions; caveats (below); citations resolve to anchors in `source-map.md` |
| `product` | Reviewer agent B | Voice, `NEVER_WORDS`, the claim guard (no GoLo claim outside `capabilities.ts`), copy distance (`check-rules-copy`), no endorsement wording |
| `seo` | Reviewer agent B | Fragment id per `canonical-map.md`, related links resolve, no intent taken from another owner |
| `approval` | Owner | The review packet entry for the record |

The two agents run in parallel and don't see each other's notes or the drafter's reasoning: they get the record, the sources and this file. Findings are fixed before the record moves to `in-review`. A finding the drafter disagrees with goes to the owner in the review packet, not into a silent edit.

## Roles

- **Drafter (Claude):** writes the record, fills `sources` with `checkedOn` for pages actually opened that day, and maps each factual sentence to a subrule in the review packet.
- **Reviewer agents:** independent; each opens the sources itself.
- **Owner:** approves or sends back. The owner may bring in a qualified rules official for any record; the review log then gets their entry under `rules`.

## Review record format

Implemented in #233 on `RuleOverview` and `RulesScenario`:

```ts
// public
reviewedOn?: string;   // ISO date of the latest approval; shown as "Reviewed <date>"
publishedOn?: string;  // set by the launch PR only
updatedOn?: string;    // a substantive change after publication

// internal (never public)
reviewedBy?: string;   // "owner"
reviewLog?: {
  stage: "rules" | "product" | "seo" | "approval";
  by: string;          // "owner", "agent", or a named rules official the owner approved
  on: string;          // ISO date the stage happened
  note?: string;
}[];
```

Each source carries `checkedOn` only if it was opened that day. Validation is in #233; it mirrors the glossary's (dates, ordering, all four stages before `approved`, `reviewedOn` = latest approval).

## Writing standards

### Every record

- **Answer first.** The first sentence answers the question or says what the rule covers.
- **Conditions before conclusions.** If the answer depends on where the ball is, who moved it, the form of play or a Local Rule, the record says so before giving the outcome. Situations do this in a "Before you decide" list.
- **Only sourced penalties.** A penalty is stated only where the cited subrule states it. "One-stroke penalty" and "general penalty (two strokes in stroke play, loss of hole in match play)" are fine when the rule says so; "you'll probably lose the hole" is not.
- **Original words.** Paraphrase the procedure; don't follow the rule's sentence order clause by clause. No run of eight or more words shared with the official text.
- **Defined terms as plain words.** Use the Definitions' names (relief area, nearest point of complete relief, known or virtually certain) without the official italics, and explain them in passing the first time.
- **Match play and stroke play.** Where they differ, say so in one line each.
- **Model Local Rules.** Always "if the Committee has adopted Model Local Rule E-5", never "you can drop near the fairway".
- **Handicapping.** A posting note cites the Rules of Handicapping by number and links to usga.org. It never sits in the answer as a Rule of Golf.
- **No "always" or "never"** unless the rule says so.
- **Examples** use hole numbers, clubs and distances a player recognises: "On the 7th your tee shot goes past the white stakes." No names of real players or courses, no money.
- **GoLo.** No claim that GoLo applies, enforces or tracks the Rules. A CTA goes through `capabilities.ts`.
- **House voice.** Plain, dry, specific. No hype, emoji or exclamation marks. Dry humour only after the answer, and never in a penalty, a Rule 25 context or a safety matter (dangerous animal condition).

### Overviews (25)

- 60–120 words. Covers what the rule is for and the two or three situations in it a casual group actually meets.
- Two to four "Look here when…" questions.
- One official link to the rule page, plus subrule anchors where the summary names a specific procedure.

### Situations (12)

- Question as written in `inventory.md`, refined for how a player would type it.
- Short answer (one to three sentences), then "Before you decide" (two to five conditions), options (when there are choices), penalty (when sourced), one example, caveats, citations, related links.
- Penalty-sensitive situations (lost ball, provisional, out of bounds, penalty areas, unplayable, bunker) are checked against both the rule and every Definition it leans on.

## Review packet

`docs/rules/review-packet.md` (created with the first content batch): one section per record, with each factual sentence mapped to its subrule anchor, the reviewer agents' findings and how each was resolved, the copy-distance result, and the owner's approval line with its date.

## Review triggers

A published record is rechecked, and its `reviewedOn` moves only on re-approval, when:

- the quarterly clarifications review (January, April, July, October) touches a rule it cites;
- `check-rules-sources` reports a broken anchor or a changed page it cites;
- a reader reports an error (the "Spot an error?" route, #245);
- the 2028 edition is published (#251).

## Release recheck

The launch PR (#247) rechecks every record's sources on the day, records the date in `source-map.md`, and holds back any record whose source changed since approval.
