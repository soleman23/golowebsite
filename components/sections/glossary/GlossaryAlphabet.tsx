/**
 * The A–Z bar (docs/glossary/ux.md D1): jump links to letter headings, not a
 * filter, so it works without JavaScript and never hides a term. A letter
 * with no term in the selection is plain text, kept in place. Each link
 * lists the categories under it in data-cats, so the hub's CSS can grey the
 * letters a category filter leaves empty.
 */

import {
  GLOSSARY_LETTERS,
  glossaryDirectoryCopy,
  glossaryLetterId,
  type GlossaryLetterGroup,
} from "@/lib/content";
import styles from "./GlossaryAlphabet.module.css";

export const GLOSSARY_AZ_ID = "glossary-az";

export function GlossaryAlphabet({ groups }: { groups: GlossaryLetterGroup[] }) {
  const byLetter = new Map(groups.map((g) => [g.letter, g]));
  return (
    <nav
      id={GLOSSARY_AZ_ID}
      className={styles.nav}
      aria-label={glossaryDirectoryCopy.alphabetLabel}
      tabIndex={-1}
    >
      <ul className={styles.list}>
        {GLOSSARY_LETTERS.map((letter) => {
          const group = byLetter.get(letter);
          return (
            <li key={letter}>
              {group ? (
                <a
                  href={`#${glossaryLetterId(letter)}`}
                  className={styles.letter}
                  data-cats={group.categories.join(" ")}
                  aria-label={letter === "#" ? "Numbers" : undefined}
                >
                  {letter}
                </a>
              ) : (
                <span className={`${styles.letter} ${styles.empty}`}>{letter}</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
