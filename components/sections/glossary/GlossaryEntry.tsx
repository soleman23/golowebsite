/**
 * One term: a <dt> with the slug as its id and a self-link, and a <dd> with
 * the definition and whatever else the record has (docs/glossary/ux.md
 * § Entry anatomy). Server-rendered; everything here works without
 * JavaScript. The div wrapping each dt/dd pair is valid inside a <dl> and
 * carries the category for the hub's CSS filter.
 */

import Link from "next/link";
import {
  glossaryCategory,
  glossaryDirectoryCopy as copy,
  glossaryNoteLabels,
  glossaryPathLink,
  type PublicGlossaryTerm,
} from "@/lib/content";
import { formatDate } from "@/components/sections/blog/PostCard";
import styles from "./GlossaryEntry.module.css";

type GlossaryEntryProps = {
  term: PublicGlossaryTerm;
  /** Every term in the selection, for related-term names. */
  byId: ReadonlyMap<string, PublicGlossaryTerm>;
  /** Client controls for the entry's heading row (the copy-link button). */
  actions?: React.ReactNode;
};

export function GlossaryEntry({ term, byId, actions }: GlossaryEntryProps) {
  const related = term.relatedTermIds
    .map((id) => byId.get(id))
    .filter((t): t is PublicGlossaryTerm => Boolean(t));
  const guide = term.canonical.kind === "existing" ? term.canonical.path : null;
  const reading = term.relatedContentPaths.filter((p) => p !== guide);

  return (
    <div className={styles.entry} data-category={term.primaryCategory}>
      <dt id={term.slug} className={styles.head} tabIndex={-1}>
        <a href={`#${term.slug}`} className={styles.name}>
          {term.term}
        </a>
        <span className={styles.category}>
          {glossaryCategory(term.primaryCategory).label}
        </span>
        {term.unpublished ? (
          <span className={styles.unpublished}>{copy.unpublished}</span>
        ) : null}
        {actions}
      </dt>
      <dd className={styles.body}>
        <p className={styles.definition}>{term.shortDefinition}</p>
        {term.explanation ? <p>{term.explanation}</p> : null}
        {term.example ? (
          <p>
            <span className={styles.label}>{copy.example}</span> {term.example}
          </p>
        ) : null}
        {term.ruleNote ? (
          <p>
            <span className={styles.label}>{glossaryNoteLabels[term.ruleNote.kind]}</span>{" "}
            {term.ruleNote.text}
          </p>
        ) : null}
        {term.goloNote ? (
          <p>
            <span className={styles.label}>{copy.golo}</span> {term.goloNote}
          </p>
        ) : null}
        {related.length ? (
          <p>
            <span className={styles.label}>{copy.related}</span>{" "}
            {related.map((t, i) => (
              <span key={t.id}>
                {i ? ", " : null}
                <a href={`#${t.slug}`} className={styles.link}>
                  {t.term}
                </a>
              </span>
            ))}
          </p>
        ) : null}
        {guide || reading.length ? (
          <ul className={styles.guides}>
            {[...(guide ? [guide] : []), ...reading].map((path) => (
              <li key={path}>
                <Link href={path} className={styles.link}>
                  {glossaryPathLink(path)}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        {term.reviewedOn && !term.unpublished ? (
          <p className={styles.reviewed}>
            {copy.reviewed}{" "}
            <time dateTime={term.reviewedOn}>{formatDate(term.reviewedOn)}</time>
          </p>
        ) : null}
      </dd>
    </div>
  );
}
