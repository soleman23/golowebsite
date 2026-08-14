/**
 * The top of every page: breadcrumb, kicker, the page's single <h1>, lead,
 * CTA row, status pills and an optional visual beside the copy.
 *
 * Server component — the CTAs are plain links. Pages that need a tracked CTA
 * pass their own client leaf as `visual` or wrap the hero, rather than making
 * this whole shell client-side.
 */

import Link from "next/link";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { StatusPill, type StatusVariant } from "./StatusPill";
import styles from "./PageHero.module.css";

export type HeroCta = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
};

type PageHeroProps = {
  kicker: string;
  title: string;
  /** Second line of the H1, broken onto its own line and set in the accent. */
  titleAccentLine?: string;
  lead?: string;
  breadcrumbs?: Crumb[];
  status?: { variant: StatusVariant; label: string };
  ctas?: HeroCta[];
  /** Small text row under the CTAs — availability notes, read time, dates. */
  meta?: React.ReactNode;
  visual?: React.ReactNode;
};

export function PageHero({
  kicker,
  title,
  titleAccentLine,
  lead,
  breadcrumbs,
  status,
  ctas,
  meta,
  visual,
}: PageHeroProps) {
  return (
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`${styles.inner} ${visual ? styles.withVisual : ""}`}>
        <div className={styles.copy}>
          {breadcrumbs?.length ? (
            <Breadcrumbs items={breadcrumbs} className={styles.crumbs} />
          ) : null}

          <div className={styles.kickerRow}>
            <p className={styles.kicker}>{kicker}</p>
            {status ? (
              <StatusPill variant={status.variant} label={status.label} />
            ) : null}
          </div>

          <h1 className={styles.title}>
            {title}
            {titleAccentLine ? (
              <>
                <br />
                <span className={styles.titleAccent}>{titleAccentLine}</span>
              </>
            ) : null}
          </h1>

          {lead ? <p className={styles.lead}>{lead}</p> : null}

          {ctas?.length ? (
            <div className={styles.ctaRow}>
              {ctas.map((cta) => (
                <Link
                  key={cta.href + cta.label}
                  href={cta.href}
                  className={`${styles.cta} ${
                    cta.variant === "primary" ? styles.primary : styles.ghost
                  }`}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          ) : null}

          {meta ? <div className={styles.meta}>{meta}</div> : null}
        </div>

        {visual ? <div className={styles.visual}>{visual}</div> : null}
      </div>
    </header>
  );
}
