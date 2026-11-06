/**
 * The frame every situation and rule overview shares (docs/rules/ux.md
 * § Entry anatomy): an <article> with the record's fragment as its id, a
 * heading that links to itself and takes focus on a deep link, the copy-link
 * button, the entry's own text, then its official links, related links and
 * review date, and last an optional footer (an overview's previous/next).
 *
 * From 1100px the links and date move to a side column beside the 68ch
 * text, and the footer sits under the text. The DOM order stays the same,
 * so reading and tab order don't change.
 *
 * Server-rendered; the copy-link button is the only client leaf. The data-*
 * attributes are the hooks search, filtering (#236) and analytics (#244)
 * read: data-category on every entry, data-rules-official (with
 * data-official-rule) and data-rules-related on its links.
 */

import Link from "next/link";
import {
  rulesAnchorHref,
  rulesEntryCopy as copy,
  type RulesCategoryId,
  type RulesDocument,
} from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/components/sections/blog/PostCard";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import styles from "./RulesEntry.module.css";

export type EntryOfficialLink = {
  href: string;
  text: string;
  /** Plain text after the link: a Model Local Rule's "if adopted". */
  note?: string;
  document: RulesDocument;
  /** The rule the link is about, for rules_official_click. */
  rule: number;
};

/** The closed destination_type set for rules_related_click (#244). */
export type RelatedType = "rule" | "situation" | "glossary" | "guide" | "post" | "page";

export type EntryRelatedLink = {
  href: string;
  text: string;
  type: RelatedType;
  /** A record id, glossary slug or path. */
  contentId: string;
};

type RulesEntryProps = {
  /** The record's fragment on /rules: a situation's slug, or rule-N. */
  anchor: string;
  category: RulesCategoryId;
  /** data-scenario-id or data-rule-number, by kind. */
  kind: { scenario: string } | { rule: number };
  level: 3 | 4;
  heading: React.ReactNode;
  /** The heading as plain text, for the copy button. */
  name: string;
  unpublished?: boolean;
  official: EntryOfficialLink[];
  related: EntryRelatedLink[];
  reviewedOn?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const copyLabels = {
  copy: copy.copy,
  copied: copy.copied,
  failed: copy.copyFailed,
  copiedMessage: copy.copiedMessage,
  failedMessage: copy.failedMessage,
};

/** A published glossary term, as a related link needs it. */
export type GlossaryLinkTarget = { slug: string; term: string };

/** Related glossary terms that are published, as "Penalty area (glossary)". */
export function glossaryLinks(
  slugs: readonly string[],
  glossary: ReadonlyMap<string, GlossaryLinkTarget>,
): EntryRelatedLink[] {
  return slugs.flatMap((slug) => {
    const term = glossary.get(slug);
    return term
      ? [{
          href: `/glossary#${term.slug}`,
          text: `${term.term} (${copy.glossary})`,
          type: "glossary" as const,
          contentId: term.slug,
        }]
      : [];
  });
}

/** "/games/skins" → guide, "/blog/gimmes" → post. */
export function pathType(path: string): RelatedType {
  if (path.startsWith("/games/")) return "guide";
  if (path.startsWith("/blog/")) return "post";
  return "page";
}

export function RulesEntry({
  anchor,
  category,
  kind,
  level,
  heading,
  name,
  unpublished,
  official,
  related,
  reviewedOn,
  children,
  footer,
}: RulesEntryProps) {
  const Heading = level === 3 ? "h3" : "h4";
  const kindData =
    "scenario" in kind
      ? { "data-scenario-id": kind.scenario }
      : { "data-rule-number": String(kind.rule) };

  return (
    <article id={anchor} className={styles.entry} data-category={category} {...kindData}>
      <div className={styles.head}>
        <Heading className={styles.heading} tabIndex={-1}>
          <a href={`#${anchor}`} className={styles.self}>
            {heading}
          </a>
        </Heading>
        {unpublished ? <span className={styles.unpublished}>{copy.unpublished}</span> : null}
        <CopyLinkButton
          url={`${siteConfig.url}${rulesAnchorHref(anchor)}`}
          name={name}
          labels={copyLabels}
        />
      </div>

      <div className={styles.main}>{children}</div>

      <div className={styles.side}>
        {official.length ? (
          <div className={styles.group}>
            <p className={styles.label}>{copy.official}</p>
            <ul className={styles.links}>
              {official.map((link) => (
                <li key={link.href + link.text}>
                  <a
                    href={link.href}
                    className={styles.link}
                    data-rules-official={link.document}
                    data-official-rule={link.rule}
                  >
                    {link.text}
                  </a>
                  {link.note ? <span className={styles.note}>, {link.note}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {related.length ? (
          <div className={styles.group}>
            <p className={styles.label}>{copy.related}</p>
            <ul className={styles.links}>
              {related.map((link) => {
                const props = {
                  href: link.href,
                  className: styles.link,
                  "data-rules-related": link.type,
                  "data-content-id": link.contentId,
                };
                // In-page jumps stay plain fragments, so ?category= survives
                // and the page doesn't reload.
                return (
                  <li key={link.href}>
                    {link.href.startsWith("#") ? (
                      <a {...props}>{link.text}</a>
                    ) : (
                      <Link {...props}>{link.text}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {reviewedOn && !unpublished ? (
          <p className={styles.reviewed}>
            {copy.reviewed} <time dateTime={reviewedOn}>{formatDate(reviewedOn)}</time>
          </p>
        ) : null}
      </div>

      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </article>
  );
}
