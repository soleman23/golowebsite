/**
 * The full directory, grouped by letter (docs/glossary/ux.md D2): an <h3>
 * and a <dl> per letter, in the server HTML, so every shown term is readable
 * and linkable without JavaScript. Each group lists its categories in
 * data-cats for the hub's CSS category filter.
 */

import {
  glossaryDirectoryCopy as copy,
  glossaryLetterId,
  type GlossaryLetterGroup,
  type PublicGlossaryTerm,
} from "@/lib/content";
import { GlossaryEntry } from "./GlossaryEntry";
import { GLOSSARY_AZ_ID } from "./GlossaryAlphabet";
import styles from "./GlossaryDirectory.module.css";

type GlossaryDirectoryProps = {
  groups: GlossaryLetterGroup[];
  byId: ReadonlyMap<string, PublicGlossaryTerm>;
  /** Per-term client controls (the copy-link button), keyed by id. */
  actions?: (term: PublicGlossaryTerm) => React.ReactNode;
};

export function GlossaryDirectory({ groups, byId, actions }: GlossaryDirectoryProps) {
  if (!groups.length) return <p className={styles.empty}>{copy.empty}</p>;
  return (
    <div className={styles.directory}>
      {groups.map((group) => {
        const id = glossaryLetterId(group.letter);
        return (
          <section
            key={group.letter}
            className={styles.group}
            aria-labelledby={id}
            data-cats={group.categories.join(" ")}
          >
            <h3 id={id} className={styles.letter} tabIndex={-1}>
              {group.letter === "#" ? (
                <>
                  <span aria-hidden="true">#</span>
                  <span className="sr-only">Numbers</span>
                </>
              ) : (
                group.letter
              )}
            </h3>
            <dl className={styles.list}>
              {group.terms.map((term) => (
                <GlossaryEntry
                  key={term.id}
                  term={term}
                  byId={byId}
                  actions={actions?.(term)}
                />
              ))}
            </dl>
            <a href={`#${GLOSSARY_AZ_ID}`} className={styles.top}>
              {copy.backToTop} ↑
            </a>
          </section>
        );
      })}
    </div>
  );
}
