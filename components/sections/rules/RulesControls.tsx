"use client";

/**
 * Topic chips, the entry count, Clear, and while a query is active the
 * ranked results, grouped Situations then Rules (docs/rules/ux.md D4, D5,
 * § Flows and states). The hub itself stays server-rendered; this leaf only
 * reads the search index it's handed, so none of @/lib/content's page copy
 * ships to the client.
 *
 * Every topic's count is rendered and CSS shows the one matching
 * <html data-filter>, so a deep link to ?category= shows the right count
 * before hydration, as the glossary does.
 */

import { useEffect, useMemo, useState } from "react";
import { ChipFilter, type ChipItem } from "@/components/ui/ChipFilter";
import { FilterStatus } from "@/components/ui/FilterStatus";
import { prepareRulesSearch, searchRules, type RulesMatch } from "@/lib/content/rules/search";
import type { RulesCategoryId, RulesSearchEntry } from "@/lib/content/rules/types";
import { useRules } from "./RulesProvider";
import styles from "./RulesControls.module.css";

type Nouns = Record<"result" | "situation" | "rule" | "entry", readonly [string, string]>;

/** lib/content/rules/copy.ts's rulesControlsCopy, as the client needs it. */
export type RulesControlsCopy = {
  chipsLabel: string;
  clear: string;
  resultsLabel: string;
  situations: string;
  rules: string;
  showAll: string;
  closest: string;
  also: string;
  refs: string;
  nouns: Nouns;
  inTopic: string;
  noMatch: string;
  noMatchShort: string;
  noMatchHint: string;
  elsewhere: string;
  searchAll: string;
  rulesIndex: { label: string; href: string };
};

type RulesControlsProps = {
  /** "all" first, then the topics. */
  chips: ChipItem[];
  /** The count line for each chip id: "37 entries", "8 entries in Relief and penalties". */
  counts: Record<string, string>;
  /** Each topic's full name: "Relief and penalties". */
  topicLabels: Record<string, string>;
  entries: RulesSearchEntry[];
  copy: RulesControlsCopy;
};

/** Announcements wait for typing to settle: never one per keystroke. */
const ANNOUNCE_AFTER_MS = 600;
/** Results per group before "Show all n". */
const GROUP_LIMIT = 8;

const count = (n: number, [one, many]: readonly [string, string]) => `${n} ${n === 1 ? one : many}`;

export function RulesControls({ chips, counts, topicLabels, entries, copy }: RulesControlsProps) {
  const { active, choose, query, clear, reveal } = useRules();
  const index = useMemo(() => prepareRulesSearch(entries), [entries]);
  const topic = (active ?? "all") as RulesCategoryId | "all";
  const searching = query.trim() !== "";
  const results = useMemo(
    () => (searching ? searchRules(index, query, topic) : []),
    [index, query, topic, searching],
  );
  const elsewhere = useMemo(
    () =>
      searching && topic !== "all" && results.length === 0 ? searchRules(index, query).length : 0,
    [index, query, topic, searching, results.length],
  );
  // Situations, then Rules, unless the best match is a rule: "18" puts
  // Rule 18's overview first (ux.md § Flows and states). searchRules already
  // breaks ties in situations' favour, so the first result picks the order.
  const groups = useMemo(() => {
    const situations = {
      id: "situations",
      title: copy.situations,
      items: results.filter((m) => m.entry.kind === "scenario"),
    };
    const rules = { id: "rules", title: copy.rules, items: results.filter((m) => m.entry.kind === "rule") };
    return results[0]?.entry.kind === "rule" ? [rules, situations] : [situations, rules];
  }, [results, copy.situations, copy.rules]);

  // "Show all n" per group, until the query or topic changes.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  useEffect(() => setExpanded({}), [query, topic]);

  const inTopic = topic === "all" ? "" : ` ${copy.inTopic.replace("{topic}", topicLabels[topic])}`;
  const fuzzy = results[0]?.tier === 5;
  const resultLine = fuzzy ? copy.closest : `${count(results.length, copy.nouns.result)}${inTopic}`;

  // The count, said once typing settles: "4 results: 2 situations, 2 rules".
  // #244 reports rules_search here too (category, rulesResultBucket,
  // rulesMatchType), once per changed topic and query, never the query.
  const [announced, setAnnounced] = useState("");
  useEffect(() => {
    if (!searching) {
      setAnnounced("");
      return;
    }
    const [situations, rules] = ["situations", "rules"].map(
      (id) => groups.find((g) => g.id === id)?.items.length ?? 0,
    );
    const kinds = [
      situations ? count(situations, copy.nouns.situation) : "",
      rules ? count(rules, copy.nouns.rule) : "",
    ].filter(Boolean);
    const text = results.length
      ? `${count(results.length, copy.nouns.result)}${inTopic}: ${kinds.join(", ")}`
      : `${copy.noMatchShort}${inTopic}`;
    const timer = setTimeout(() => setAnnounced(text), ANNOUNCE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [searching, results.length, groups, inTopic, copy]);

  const filterMessages = useMemo(
    () => Object.fromEntries(chips.map((c) => [c.id, counts[c.id]])),
    [chips, counts],
  );

  return (
    <div id="rules-controls" className={styles.controls} data-requires-js="">
      <ChipFilter
        items={chips}
        value={active}
        onChange={choose}
        label={copy.chipsLabel}
        className={styles.chips}
      />
      <div className={styles.bar}>
        <span className={styles.count}>
          {chips.map((c) => (
            <span key={c.id} data-for={c.id} hidden={c.id !== "all"}>
              {counts[c.id]}
            </span>
          ))}
        </span>
        {searching || (active !== null && active !== "all") ? (
          <button type="button" className={styles.button} onClick={clear}>
            {copy.clear}
          </button>
        ) : null}
      </div>
      <FilterStatus active={active} messages={filterMessages} />
      <span className="sr-only" role="status">
        {announced}
      </span>

      <div id="rules-results" className={styles.results} hidden={!searching}>
        {searching && results.length ? (
          <>
            <p className={styles.resultLine}>{resultLine}</p>
            {groups.map((g) =>
              g.items.length ? (
                <div key={g.id} className={styles.group}>
                  <h2 id={`rules-results-${g.id}`} className={styles.groupTitle}>
                    {g.title}
                  </h2>
                  <ol className={styles.list} aria-labelledby={`rules-results-${g.id}`}>
                    {(expanded[g.id] ? g.items : g.items.slice(0, GROUP_LIMIT)).map((m) => (
                      <Result key={m.entry.id} match={m} copy={copy} reveal={reveal} />
                    ))}
                  </ol>
                  {g.items.length > GROUP_LIMIT && !expanded[g.id] ? (
                    <button
                      type="button"
                      className={styles.button}
                      onClick={() => setExpanded((e) => ({ ...e, [g.id]: true }))}
                    >
                      {copy.showAll.replace("{n}", String(g.items.length))}
                    </button>
                  ) : null}
                </div>
              ) : null,
            )}
          </>
        ) : null}

        {searching && !results.length ? (
          <div className={styles.empty}>
            <p className={styles.emptyLine}>
              {copy.noMatch.replace("{query}", query.trim())}
              {elsewhere
                ? ` ${copy.elsewhere.replace("{n}", count(elsewhere, copy.nouns.result))}`
                : null}
            </p>
            <p className={styles.hint}>{copy.noMatchHint}</p>
            <div className={styles.actions}>
              {elsewhere ? (
                <button type="button" className={styles.button} onClick={() => choose("all")}>
                  {copy.searchAll}
                </button>
              ) : null}
              <button type="button" className={styles.button} onClick={clear}>
                {copy.clear}
              </button>
              <a href={copy.rulesIndex.href} className={styles.link} data-rules-official="rules">
                {copy.rulesIndex.label}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type ResultProps = {
  match: RulesMatch;
  copy: RulesControlsCopy;
  reveal: (id: string, announceOpen?: boolean) => void;
};

/** A situation lists the rules it cites; a rule's title already has its number. */
function Result({ match: { entry, alias }, copy, reveal }: ResultProps) {
  const refs =
    entry.kind === "scenario" && entry.ruleRefs.length
      ? copy.refs.replace(
          "{refs}",
          entry.ruleRefs.slice(0, 3).join(" · ") +
            (entry.ruleRefs.length > 3 ? ` +${entry.ruleRefs.length - 3}` : ""),
        )
      : null;
  return (
    <li className={styles.result} data-category={entry.category}>
      <a
        href={`#${entry.anchor}`}
        className={styles.resultName}
        onClick={(e) => {
          // Same hash twice fires no hashchange; reveal directly.
          if (window.location.hash === `#${entry.anchor}`) {
            e.preventDefault();
            reveal(entry.anchor, true);
          }
        }}
      >
        {entry.title}
      </a>
      {alias ? (
        <span className={styles.alias}>
          {copy.also}: {alias}
        </span>
      ) : null}
      {entry.snippet ? <p className={styles.snippet}>{entry.snippet}</p> : null}
      {refs ? <p className={styles.refs}>{refs}</p> : null}
    </li>
  );
}
