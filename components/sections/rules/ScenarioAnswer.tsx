/**
 * One common situation (docs/rules/ux.md § Entry anatomy): the short answer,
 * what has to be true for it to hold, the choices, the penalty and an
 * example where the record has them, any Local Rule, match/stroke or
 * handicap caveat, then the official links and related links.
 *
 * Every part is open in the server HTML (D2): no disclosure, nothing that
 * needs JavaScript but the copy-link button.
 */

import {
  rulesEntryCopy,
  rulesLinkText,
  rulesPathLink,
  rulesRuleLabel,
  rulesSituationsCopy as copy,
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
import styles from "./ScenarioAnswer.module.css";

type ScenarioAnswerProps = {
  scenario: PublicRulesScenario;
  /** The overviews on the page, by rule number, for the related rule link. */
  rules: ReadonlyMap<number, PublicRuleOverview>;
  /** Published glossary terms, by slug. */
  glossary: ReadonlyMap<string, GlossaryLinkTarget>;
};

export function ScenarioAnswer({ scenario: s, rules, glossary }: ScenarioAnswerProps) {
  const official: EntryOfficialLink[] = s.links.map((link) => ({
    href: link.href,
    text: rulesLinkText(link),
    note: link.localRule ? rulesEntryCopy.ifAdopted : undefined,
    document: link.document,
    rule: link.document === "rules" ? Number.parseInt(link.ruleRef, 10) : s.primaryRule,
  }));

  const rule = rules.get(s.primaryRule);
  const related: EntryRelatedLink[] = [
    ...(rule
      ? [{ href: `#${rule.id}`, text: rulesRuleLabel(rule.number), type: "rule" as const, contentId: rule.id }]
      : []),
    ...glossaryLinks(s.relatedGlossaryIds, glossary),
    ...s.relatedContentPaths.map((path) => ({
      href: path,
      text: rulesPathLink(path),
      type: pathType(path),
      contentId: path,
    })),
  ];

  const caveats = [
    { label: copy.localRule, text: s.localRuleCaveat },
    { label: copy.matchVsStroke, text: s.matchVsStrokeCaveat },
    { label: copy.handicap, text: s.handicapCaveat },
  ].filter((c): c is { label: string; text: string } => Boolean(c.text));

  return (
    <RulesEntry
      anchor={s.slug}
      category={s.category}
      kind={{ scenario: s.id }}
      level={3}
      heading={s.question}
      name={s.question}
      unpublished={s.unpublished}
      official={official}
      related={related}
      reviewedOn={s.reviewedOn}
    >
      {s.answer ? <p className={styles.answer}>{s.answer}</p> : null}

      {s.conditions.length ? (
        <>
          <h4 className={styles.label}>{copy.conditions}</h4>
          <ul className={styles.list}>
            {s.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      ) : null}

      {s.options.length ? (
        <>
          <h4 className={styles.label}>{copy.options}</h4>
          <ol className={styles.list}>
            {s.options.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ol>
        </>
      ) : null}

      {s.penalty ? (
        <p>
          <strong className={styles.inline}>{copy.penalty}:</strong> {s.penalty}
        </p>
      ) : null}

      {s.example ? (
        <p>
          <strong className={styles.inline}>{copy.example}:</strong> {s.example}
        </p>
      ) : null}

      {caveats.length ? (
        // Unnamed and inside the article, so not a landmark of its own.
        <aside className={styles.caveats}>
          {caveats.map((c) => (
            <p key={c.label}>
              <strong className={styles.inline}>{c.label}:</strong> {c.text}
            </p>
          ))}
        </aside>
      ) : null}
    </RulesEntry>
  );
}
