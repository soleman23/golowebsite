/**
 * The shared legal template. /privacy and /terms are the same page with
 * different data — one component, one stylesheet.
 *
 * Server component throughout except the TOC rail, which owns the scroll-spy.
 * Note the reading order: the plain-English gloss comes AFTER its section's
 * legal text in the DOM and is placed beside it with CSS, so a screen reader
 * and a no-CSS render both hit the governing words first.
 */

import Link from "next/link";
import {
  legalDocs,
  legalReadMinutes,
  type LegalBlock,
  type LegalDoc,
} from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WarnIcon } from "@/components/ui/Icon";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { TocRail } from "./TocRail";
import styles from "./legal.module.css";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const minutes = legalReadMinutes(doc);
  const others = legalDocs.filter((d) => d.slug !== doc.slug);

  return (
    <>
      {/* 1. sticky legal sub-nav */}
      <nav className={styles.subNav} aria-label="Legal documents">
        <div className={styles.subNavInner}>
          <span className={styles.subNavLabel}>LEGAL</span>
          <ul className={styles.subNavLinks}>
            {legalDocs.map((d) => {
              const active = d.slug === doc.slug;
              return (
                <li key={d.slug}>
                  <Link
                    href={`/${d.slug}`}
                    className={`${styles.subNavLink} ${active ? styles.subNavActive : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {d.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 2. hero */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Breadcrumbs
            className={styles.crumbs}
            items={[{ label: "Home", href: "/" }, { label: doc.title }]}
          />
          <p className={styles.kicker}>{doc.kicker}</p>
          <h1 className={styles.title}>{doc.title}</h1>
          <p className={styles.lead}>{doc.lead}</p>

          <div className={styles.meta}>
            <span className={styles.metaChip}>
              {doc.dateLabel}: {doc.effective}
            </span>
            <span className={styles.metaChip}>{doc.entity}</span>
            <span className={styles.metaChip}>
              {doc.sections.length} sections · ~{minutes} min read
            </span>
          </div>
        </div>
      </header>

      {/* 3. short version */}
      <section className={styles.shortSection} aria-labelledby="short-heading">
        <div className={styles.shortInner}>
          <div className={styles.shortCard}>
            <div className={styles.shortHead}>
              <span className={styles.shortIcon} aria-hidden="true">
                <WarnIcon size={22} />
              </span>
              <p className={styles.shortTag}>{doc.short.tag}</p>
            </div>
            <h2 id="short-heading" className={styles.shortTitle}>
              {doc.short.title}
            </h2>
            <p className={styles.shortSub}>{doc.short.sub}</p>
            <ul className={styles.shortLines}>
              {doc.short.lines.map((line) => (
                <li key={line.tag} className={styles.shortLine}>
                  <span className={styles.shortLineTag}>{line.tag}</span>
                  <span className={styles.shortLineText}>{line.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. TOC + body */}
      <section className={styles.body}>
        <div className={styles.grid}>
          <TocRail
            items={doc.sections.map((s) => ({
              id: s.id,
              num: s.num,
              title: s.title,
            }))}
          />

          <div className={styles.doc} data-legal-body>
            {doc.intro.length > 0 ? (
              <div className={styles.intro}>
                {doc.intro.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            ) : null}

            {doc.sections.map((section) => (
              <section key={section.id} className={styles.section}>
                <h2 id={section.id} className={styles.sectionHeading}>
                  <span className={styles.sectionNum} aria-hidden="true">
                    {section.num}
                  </span>
                  {section.title}
                </h2>

                <div className={styles.sectionBody}>
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>

                {section.plain ? (
                  <aside className={styles.plain}>
                    <p className={styles.plainTag}>IN PLAIN ENGLISH</p>
                    <p className={styles.plainText}>{section.plain}</p>
                  </aside>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* 5. contact */}
      <section className={styles.contact} aria-labelledby="legal-contact-heading">
        <div className={styles.contactInner}>
          <div className={styles.contactCard}>
            <div>
              <p className={styles.contactKicker}>{doc.contact.kicker}</p>
              <h2 id="legal-contact-heading" className={styles.contactTitle}>
                {siteConfig.legalName}
              </h2>
              <address className={styles.contactAddress}>
                <span>{siteConfig.address.street}</span>
                <span>
                  {siteConfig.address.city}, {siteConfig.address.region}{" "}
                  {siteConfig.address.postalCode}
                </span>
                <span>{siteConfig.address.country}</span>
              </address>
              <p className={styles.contactBlurb}>{doc.contact.blurb}</p>
            </div>

            <div className={styles.contactActions}>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className={styles.contactEmail}
              >
                {siteConfig.supportEmail}
              </a>
              <Link href="/contact" className={styles.contactLink}>
                Questions? Talk to a human →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. the rest of the shelf */}
      {others.length > 0 ? (
        <section className={styles.shelf} aria-labelledby="shelf-heading">
          <div className={styles.shelfInner}>
            <h2 id="shelf-heading" className={styles.shelfLabel}>
              MORE FROM THE LEGAL SHELF
            </h2>
            <ul className={styles.shelfGrid}>
              {others.map((other) => (
                <li key={other.slug}>
                  <Link href={`/${other.slug}`} className={styles.shelfCard}>
                    <span className={styles.shelfName}>{other.title}</span>
                    <span className={styles.shelfBlurb}>{other.lead}</span>
                    <span className={styles.shelfCta}>READ IT →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <FinalCTA
        layout="split"
        page={doc.slug}
        kicker="TRACK IT. BET IT. SETTLE IT."
        title={doc.cta.title}
        buttons={[
          {
            label: "Get the app",
            href: "/#get",
            cta: "get_app",
            variant: "primary",
          },
          {
            label: "Browse the games",
            href: "/games",
            cta: "browse_games",
            variant: "ghost",
          },
        ]}
      />
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "p":
      // The source is our own content module — legal copy with inline
      // <strong>/<em>/<a>, never user input.
      return (
        <p className={styles.p} dangerouslySetInnerHTML={{ __html: block.html }} />
      );

    case "h3":
      return <h3 className={styles.h3}>{block.text}</h3>;

    case "ul":
      return (
        <ul className={styles.ul}>
          {block.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );

    case "dl":
      return (
        <dl className={styles.dl}>
          {block.items.map((item) => (
            <div key={item.term} className={styles.dlRow}>
              <dt className={styles.dt}>{item.term}</dt>
              <dd
                className={styles.dd}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </div>
          ))}
        </dl>
      );

    case "table":
      return (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "address":
      // innerHTML, not text: the policy's address block bolds the entity name
      // and links the support address, and both have to survive the migration.
      return (
        <address className={styles.address}>
          {block.lines.map((line, i) => (
            <span key={i} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </address>
      );

    default:
      return assertNever(block);
  }
}

/** A block kind with no case above — loud in dev, skipped in prod. */
function assertNever(block: never): null {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      `LegalPage: no renderer for block kind "${(block as LegalBlock).kind}"`,
    );
  }
  return null;
}
