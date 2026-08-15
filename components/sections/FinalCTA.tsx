/**
 * The closing band. Two layouts off the same component rather than a fork:
 *
 * - "center" (home, /games, /games/*): radial green background, big heading,
 *   and the download row.
 * - "split" (the text pages): turf backdrop, kicker + heading left, link
 *   buttons right, each firing cta_click.
 *
 * The download row follows siteConfig.appLive the same way the hero's does:
 * store buttons once there's an app to install, the phone capture until then.
 * The fine print moves with it — "free to download" is not something to print
 * under a button that can't download anything.
 */

import { siteConfig } from "@/lib/siteConfig";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { TextMeLink } from "@/components/ui/TextMeLink";
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
  fine = siteConfig.appLive
    ? "Free to download · No card to start · iPhone & Android"
    : "In testing with real groups · Free while we’re in beta · iPhone & Android",
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
          ) : siteConfig.appLive ? (
            <StoreButtons size="lg" align="center" />
          ) : (
            <TextMeLink
              id={`cta-phone-${page}`}
              placement="final_cta"
              prompt="Text me the link when it's live:"
              align="center"
            />
          )}
          {fine && !split ? <p className={styles.fine}>{fine}</p> : null}
        </div>
      </div>
    </section>
  );
}
