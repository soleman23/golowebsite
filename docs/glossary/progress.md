# Glossary MVP: working progress

A short record so the next session can pick up without redoing the research. Not a status report for visitors, and not a substitute for the issues: #151 is the source of truth for status and order.

Gates are separate and never implied by each other: **implemented locally** → **pushed / PR open** → **CI green** → **editorially approved** → **released**.

## Session 1, October 28, 2026

Started from `main` at ba08106 (the spec, #150). No glossary branches or PRs existed. Draft PR #124 (newsletter Reach sync) is on hold for #121 and is untouched.

### Reconciliation

Material findings not already in the epic's reconciliation list:

- **Vocabulary rule.** `scripts/check-content.mjs` `NEVER_WORDS` bans "wager", "stakes", "bet(s)", "pot(s)", "payout(s)" and more from all site copy. This affects the spec's category name, its Press draft and aliases, and three expansion term names. MVP unaffected. See `inventory.md` Q1, Q2.
- **Existing-site conflicts:**
  - Wolf tee order (guide: last; post: first);
  - skins validation wording;
  - a possible overclaim in the skins guide CTA ("tracks … every validation").
  Details in `inventory.md` § Existing site definitions. No issues were filed (not authorised).
- **Primary sources unreachable from the cloud container.** `www.usga.org` and `www.randa.org` fail (proxy 403 / DNS) even after the owner changed network settings mid-session. Rules/WHS checks are not done; no `accessedOn` dates are recorded anywhere.
- **#65** hasn't run; the only query data is the October 8 baseline (`inventory.md` § Search evidence).
- **#165 depends on #164, and #164 ships with the launch.** Resolution: prepare the CTA copy contracts, the gated discovery code and the analytics events before launch, all behind `glossaryLive`; the public exposure (footer link, inbound links, flag flip) ships in the combined #164 + #166 launch change. Acceptance criteria unchanged; #165's live verification (consent on and off in DebugView) runs against the local launch simulation first and the live site after launch.

### Work

| Issue | Branch | State |
|---|---|---|
| #152 | `glossary/152-inventory` (pushed) | Implemented: `inventory.md`, `canonical-map.md`, `editorial-review.md`. Awaiting owner review (Q1–Q4 in `inventory.md`; Q5 roles decided). |
| #153 | `glossary/153-ux` (pushed, stacked on 152) | Implemented: `ux.md`. Awaiting owner review of decisions D1–D8. |

### Owner answers this session (October 29, 2026)

- Push authorised for glossary task branches only: no PRs, nothing to `main`, no issue changes.
- Review roles as proposed in `editorial-review.md`: the owner signs rules, product and approval; an agent prepares the SEO/canonical review for the owner to confirm.

### Next ready

#155 (model, launch flag, validation) depends only on #152's ids and categories, which are fixed unless the owner changes Q4.
