"use client";

/**
 * The search field in the hero's search slot (docs/rules/ux.md § Page
 * structure). Its text lives in RulesProvider and goes nowhere else: not the
 * URL, not history, not analytics, not the console. Escape empties it and
 * keeps focus here. Hidden without JavaScript (data-requires-js), where it
 * couldn't do anything.
 */

import { RULES_SEARCH_ID, useRules } from "./RulesProvider";
import styles from "./RulesSearchField.module.css";

type RulesSearchFieldProps = {
  label: string;
  placeholder: string;
};

export function RulesSearchField({ label, placeholder }: RulesSearchFieldProps) {
  const { query, setQuery } = useRules();
  return (
    <div className={styles.field} data-requires-js="">
      <label htmlFor={RULES_SEARCH_ID} className={styles.label}>
        {label}
      </label>
      <input
        id={RULES_SEARCH_ID}
        className={styles.input}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        aria-controls="rules-results"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && query) {
            e.preventDefault();
            setQuery("");
          }
        }}
      />
    </div>
  );
}
