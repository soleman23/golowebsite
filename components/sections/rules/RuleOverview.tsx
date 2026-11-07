/**
 * One of the 25 rules (docs/rules/ux.md § Entry anatomy): its number and
 * official title, the summary, when to look it up, the situations on this
 * page that it governs or that cite it, the link to the rule on randa.org,
 * and previous/next links to its neighbours on the page.
 */

import {
  rulesDirectoryCopy as copy,
  rulesLinkText,
  rulesPathLink,
  rulesReadRule,
  rulesRuleLabel,
  type PublicRuleOverview,
  type PublicRulesScenario,
} from "@/lib/content";
import {
  RulesEntry,
  glossaryLinks,
  pathType,
  type EntryOfficialLink,
  type EntryRelatedLink,
  type GlossaryLinkTarget,
} from "./RulesEntry";
import styles from "./RuleOverview.module.css";

type RuleOverviewProps = {
  rule: PublicRuleOverview;
  /** The situations on the page, by id. */
  scenarios: ReadonlyMap<string, PublicRulesScenario>;
  glossary: ReadonlyMap<string, GlossaryLinkTarget>;
  /** Its neighbours among the overviews shown; absent when it's the only one. */
  previous?: PublicRuleOverview;
  next?: PublicRuleOverview;
};

export function RuleOverview({ rule: r, scenarios, glossary, previous, next }: RuleOverviewProps) {
  const label = rulesRuleLabel(r.number);
  const official: EntryOfficialLink[] = r.links.map((link) => ({
    href: link.href,
    text:
      link.document === "rules" && link.ruleRef === String(r.number)
        ? rulesReadRule(r.number)
        : rulesLinkText(link),
    document: link.document,
    rule: r.number,
  }));
  const related: EntryRelatedLink[] = [
    ...glossaryLinks(r.relatedGlossaryIds, glossary),
    ...r.relatedContentPaths.map((path) => ({
      href: path,
      text: rulesPathLink(path),
      type: pathType(path),
      contentId: path,
    })),
  ];
  const situations = r.scenarioIds
    .map((id) => scenarios.get(id))
    .filter((s): s is PublicRulesScenario => Boolean(s));

  return (
    <RulesEntry
      anchor={r.id}
      category={r.category}
      kind={{ rule: r.number }}
      level={4}
      heading={
        <>
          {/* Stacked visually; the colon keeps "Rule 18: Stroke-and-…" one
              phrase for a screen reader. */}
          <span className={styles.number}>{label}</span>
          <span className="sr-only">: </span>
          {r.title}
        </>
      }
      name={`${label}: ${r.title}`}
      unpublished={r.unpublished}
      official={official}
      related={related}
      reviewedOn={r.reviewedOn}
      footer={
        previous && next ? (
          <nav className={styles.pager} aria-label={label}>
            <a href={`#${previous.id}`} className={styles.step}>
              <span aria-hidden="true">←</span> {rulesRuleLabel(previous.number)}
            </a>
            <a href={`#${next.id}`} className={styles.step}>
              {rulesRuleLabel(next.number)} <span aria-hidden="true">→</span>
            </a>
          </nav>
        ) : null
      }
    >
      {r.summary ? <p>{r.summary}</p> : null}

      {r.commonQuestions.length ? (
        <>
          <h5 className={styles.label}>{copy.lookHereWhen}</h5>
          <ul className={styles.list}>
            {r.commonQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </>
      ) : null}

      {situations.length ? (
        <p>
          <span className={styles.inlineLabel}>{copy.situations}:</span>{" "}
          {situations.map((s, i) => (
            <span key={s.id}>
              {i ? " · " : null}
              <a
                href={`#${s.slug}`}
                className={styles.link}
                data-rules-related="situation"
                data-content-id={s.id}
              >
                {s.question}
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </RulesEntry>
  );
}
