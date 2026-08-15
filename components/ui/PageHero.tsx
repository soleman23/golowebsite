/**
 * The top of every page: breadcrumb, kicker, the page's single <h1>, lead,
 * CTA row, status pills and an optional visual beside the copy.
 *
 * Stays a server component. The CTA row renders TrackedCta, which is a client
 * leaf of its own — importing it here doesn't pull the shell across the
 * boundary, so the hero copy and the H1 still ship as static HTML.
 */

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { StatusPill, type StatusVariant } from "./StatusPill";
import { TrackedCta } from "./TrackedCta";
import styles from "./PageHero.module.css";

export type HeroCta = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  /**
   * Short slug for the cta_click param — "get_app", "browse_games", "ask_us".
   * Defaults from the href so an untagged CTA still reports something useful.
   */
  cta?: string;
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
  /** Names the page in the cta_click param. Required once `ctas` is set. */
  page?: string;
  /** Small text row under the CTAs — availability notes, read time, dates. */
  meta?: React.ReactNode;
  visual?: React.ReactNode;
};

/** "/games" → "games", "/#get" → "get", "/" → "home". */
function ctaSlug(href: string): string {
  const cleaned = href.replace(/^\/#?/, "").replace(/[#?].*$/, "");
  return cleaned === "" ? "home" : cleaned.replace(/\//g, "_");
}

export function PageHero({
  kicker,
  title,
  titleAccentLine,
  lead,
  breadcrumbs,
  status,
  ctas,
  page = "page",
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
                <TrackedCta
                  key={cta.href + cta.label}
                  href={cta.href}
                  page={page}
                  cta={cta.cta ?? ctaSlug(cta.href)}
                  className={`${styles.cta} ${
                    cta.variant === "primary" ? styles.primary : styles.ghost
                  }`}
                >
                  {cta.label}
                </TrackedCta>
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
