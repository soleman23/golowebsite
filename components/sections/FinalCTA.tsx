/**
 * The closing band. Two layouts off the same component rather than a fork:
 *
 * - "center" (home): radial green background, big heading, store buttons.
 * - "split" (inner pages): turf backdrop, kicker + heading left, link buttons
 *   right, each firing cta_click.
 */

import { StoreButtons } from "@/components/ui/StoreButtons";
import { TrackedCta } from "@/components/ui/TrackedCta";
import styles from "./FinalCTA.module.css";

export type FinalCtaButton = {
  label: string;
  href: string;
  /** Short slug for the cta_click param. */
  cta: string;
  variant: "primary" | "ghost";
};

type FinalCTAProps = {
  kicker?: string;
  title?: string;
  lead?: string;
  fine?: string;
  /** When set, these links replace the store buttons. */
  buttons?: FinalCtaButton[];
  /** Names the page in the cta_click param. */
  page?: string;
  layout?: "center" | "split";
};

export function FinalCTA({
  kicker,
  title = "Stop doing math in the parking lot.",
  lead = "Download GoLo, set up your games before the first tee, and let the app keep the books. Your buddies’ excuses end here.",
  fine = "Free to download · No card to start · iPhone & Android",
  buttons,
  page = "home",
  layout = "center",
}: FinalCTAProps) {
  const split = layout === "split";

  return (
    <section
      id="get"
      className={`${styles.section} ${split ? styles.split : ""}`}
      aria-labelledby="cta-heading"
    >
      {split ? (
        <>
          <div
            className={`${styles.turf} golo-bd-turf`}
            aria-hidden="true"
          />
          <div className={styles.turfScrim} aria-hidden="true" />
        </>
      ) : (
        <>
          <div className={styles.bg} aria-hidden="true" />
          <div className={styles.glow} aria-hidden="true" />
        </>
      )}

      <div className={styles.inner}>
        <div className={styles.copy}>
          {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
          <h2 id="cta-heading" className={styles.title}>
            {title}
          </h2>
          {lead && !split ? <p className={styles.lead}>{lead}</p> : null}
        </div>

        <div className={styles.actions}>
          {buttons?.length ? (
            <div className={styles.buttonRow}>
              {buttons.map((b) => (
                <TrackedCta
                  key={b.cta}
                  href={b.href}
                  page={page}
                  cta={b.cta}
                  className={`${styles.button} ${
                    b.variant === "primary" ? styles.primary : styles.ghost
                  }`}
                >
                  {b.label}
                </TrackedCta>
              ))}
            </div>
          ) : (
            <StoreButtons size="lg" align="center" />
          )}
          {fine && !split ? <p className={styles.fine}>{fine}</p> : null}
        </div>
      </div>
    </section>
  );
}
