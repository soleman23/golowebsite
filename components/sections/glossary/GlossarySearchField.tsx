"use client";

/**
 * The search field in the hero (owner decision on #153: the search sits on
 * the photo). Its text lives in GlossaryProvider and goes nowhere else: not
 * the URL, not history, not analytics, not the console. Hidden without
 * JavaScript (data-requires-js), where it couldn't do anything.
 */

import { useGlossary } from "./GlossaryProvider";
import styles from "./GlossarySearchField.module.css";

type GlossarySearchFieldProps = {
  label: string;
  placeholder: string;
};

export function GlossarySearchField({ label, placeholder }: GlossarySearchFieldProps) {
  const { query, setQuery, clear } = useGlossary();
  return (
    <div className={styles.field} data-requires-js="">
      <label htmlFor="glossary-search" className={styles.label}>
        {label}
      </label>
      <input
        id="glossary-search"
        className={styles.input}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        aria-controls="glossary-results"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            clear();
          }
        }}
      />
    </div>
  );
}
