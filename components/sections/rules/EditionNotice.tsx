/**
 * Which edition every answer is written against, when it gives way to the
 * next, and when the official clarifications were last read (docs/rules/ux.md
 * D6). It sits under the hero rather than in a footnote, with the
 * independent-site line beside it.
 */

import {
  RULES_INDEX_URL,
  USGA_RULES_HUB_URL,
  rulesEdition,
  rulesEditionCopy as copy,
} from "@/lib/content";
import { formatDate } from "@/components/sections/blog/PostCard";
import styles from "./EditionNotice.module.css";

export function EditionNotice() {
  const { label, supersededOn, clarificationsCheckedOn } = rulesEdition;
  return (
    <aside className={styles.notice} aria-label={copy.label}>
      <p className={styles.edition}>
        {copy.basedOn.replace("{edition}", label)} {copy.nextEdition}{" "}
        <time dateTime={supersededOn}>{formatDate(supersededOn)}</time>. {copy.checked}{" "}
        <time dateTime={clarificationsCheckedOn}>{formatDate(clarificationsCheckedOn)}</time>.
      </p>
      <p className={styles.links}>
        <span className={styles.lead}>{copy.officialText}</span>{" "}
        <a href={RULES_INDEX_URL} className={styles.link} data-rules-official="rules">
          {copy.randa}
        </a>
        <span aria-hidden="true"> · </span>
        <a href={USGA_RULES_HUB_URL} className={styles.link} data-rules-official="rules">
          {copy.usga}
        </a>
      </p>
      <p className={styles.independent}>{copy.independent}</p>
    </aside>
  );
}
