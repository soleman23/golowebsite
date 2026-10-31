"use client";

/**
 * Category chips, the count, Clear, and while a query is active the ranked
 * search results (docs/glossary/ux.md D3, D4). The directory itself stays
 * server-rendered; this leaf only reads the search index it's handed, so
 * none of @/lib/content's page copy ships to the client.
 *
 * Every category's count is rendered and CSS shows the one matching
 * <html data-filter>, so a deep link to ?category= shows the right count
 * before hydration, as /blog does.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { ChipFilter, type ChipItem } from "@/components/ui/ChipFilter";
import { FilterStatus } from "@/components/ui/FilterStatus";
import {
  glossaryMatchType,
  glossaryResultBucket,
  normalizeGlossaryText,
  prepareGlossarySearch,
  searchGlossary,
} from "@/lib/content/glossary/search";
import type { GlossaryCategoryId, GlossarySearchEntry } from "@/lib/content/glossary/types";
import { useGlossary } from "./GlossaryProvider";
import styles from "./GlossaryControls.module.css";

export type GlossaryControlsCopy = {
  chipsLabel: string;
  clear: string;
  resultsLabel: string;
  also: string;
  noMatch: string;
  otherCategories: string;
  searchAll: string;
  missing: { label: string; href: string };
};

type GlossaryControlsProps = {
  /** "all" first, then the categories, each with its term count. */
  chips: ChipItem[];
  /** The count line for each chip id: "18 terms", "3 terms in Slang". */
  counts: Record<string, string>;
  categoryLabels: Record<string, string>;
  entries: GlossarySearchEntry[];
  copy: GlossaryControlsCopy;
};

/** Announcements wait for typing to settle: never one per keystroke. */
const ANNOUNCE_AFTER_MS = 600;

const plural = (n: number) => `${n} ${n === 1 ? "term matches" : "terms match"}`;

export function GlossaryControls({
  chips,
  counts,
  categoryLabels,
  entries,
  copy,
}: GlossaryControlsProps) {
  const { active, choose, query, clear, reveal } = useGlossary();
  const index = useMemo(() => prepareGlossarySearch(entries), [entries]);
  const category = (active ?? "all") as GlossaryCategoryId | "all";
  const searching = query.trim() !== "";
  const results = useMemo(
    () => (searching ? searchGlossary(index, query, category) : []),
    [index, query, category, searching],
  );
  const elsewhere = useMemo(
    () =>
      searching && category !== "all" && results.length === 0
        ? searchGlossary(index, query).length
        : 0,
    [index, query, category, searching, results.length],
  );

  const filterMessages = useMemo(
    () =>
      Object.fromEntries(
        chips.map((c) => [c.id, `${c.id === "all" ? c.label : categoryLabels[c.id]}: ${counts[c.id]}`]),
      ),
    [chips, counts, categoryLabels],
  );

  const resultLine = results.length
    ? `${plural(results.length)}${category === "all" ? "" : ` in ${categoryLabels[category]}`}`
    : copy.noMatch;

  // The search announcement and glossary_search, both once typing settles.
  // Neither carries the query: the event has the category, a result bucket
  // and the match type, and the last reported query stays in this ref only
  // to skip a repeat (#165).
  const [announced, setAnnounced] = useState("");
  const reported = useRef("");
  useEffect(() => {
    if (!searching) {
      setAnnounced("");
      reported.current = "";
      return;
    }
    const timer = setTimeout(() => {
      setAnnounced(resultLine);
      const settled = `${category}|${normalizeGlossaryText(query)}`;
      if (settled !== reported.current) {
        reported.current = settled;
        track("glossary_search", {
          category,
          result_bucket: glossaryResultBucket(results.length),
          match_type: glossaryMatchType(results),
        });
      }
    }, ANNOUNCE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [searching, resultLine, query, category, results]);

  // A–Z letters with nothing in the chosen category: CSS greys them from
  // first paint; this takes them out of the tab order and says why.
  useEffect(() => {
    document
      .querySelectorAll<HTMLAnchorElement>("#glossary-az a[data-cats]")
      .forEach((a) => {
        const off =
          active !== null && active !== "all" && !(a.dataset.cats ?? "").split(" ").includes(active);
        if (off) {
          a.setAttribute("aria-disabled", "true");
          a.tabIndex = -1;
        } else {
          a.removeAttribute("aria-disabled");
          a.removeAttribute("tabindex");
        }
      });
  }, [active]);

  return (
    <div className={styles.controls}>
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
          <button type="button" className={styles.clear} onClick={clear}>
            {copy.clear}
          </button>
        ) : null}
      </div>
      <FilterStatus active={active} messages={filterMessages} />
      <span className="sr-only" role="status">
        {announced}
      </span>

      <div id="glossary-results" className={styles.results} hidden={!searching}>
        {searching ? (
          <>
            {results.length ? <p className={styles.resultLine}>{resultLine}</p> : null}
            {results.length ? (
              <ol className={styles.resultList} aria-label={copy.resultsLabel}>
                {results.map(({ entry, alias }) => (
                  <li key={entry.id} className={styles.result}>
                    <a
                      href={`#${entry.slug}`}
                      className={styles.resultName}
                      onClick={(e) => {
                        // Same hash twice fires no hashchange; reveal directly.
                        if (window.location.hash === `#${entry.slug}`) {
                          e.preventDefault();
                          reveal(entry.slug, true);
                        }
                      }}
                    >
                      {entry.term}
                    </a>
                    <span className={styles.resultCategory}>
                      {categoryLabels[entry.category]}
                    </span>
                    {alias ? (
                      <span className={styles.resultAlias}>
                        {copy.also}: {alias}
                      </span>
                    ) : null}
                    <p className={styles.resultDefinition}>{entry.shortDefinition}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className={styles.empty}>
                <p>
                  {copy.noMatch} “{query.trim()}”.
                  {elsewhere ? ` ${plural(elsewhere)} ${copy.otherCategories}.` : null}
                </p>
                <div className={styles.emptyActions}>
                  {elsewhere ? (
                    <button type="button" className={styles.clear} onClick={() => choose("all")}>
                      {copy.searchAll}
                    </button>
                  ) : null}
                  <button type="button" className={styles.clear} onClick={clear}>
                    {copy.clear}
                  </button>
                  <a href={copy.missing.href} className={styles.missing}>
                    {copy.missing.label}
                  </a>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
