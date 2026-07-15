/**
 * Hero: full-bleed backdrop photo + scrim, live pill, three-line H1, lead,
 * store buttons, and the "text me the link" control, beside the live-leaderboard
 * phone mockup.
 */

import { siteConfig, heroBackdropSrc } from "@/lib/siteConfig";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { TextMeLink } from "@/components/ui/TextMeLink";
import { HeroPhone } from "@/components/mockups/HeroPhone";
import styles from "./Hero.module.css";

export function Hero() {
  const bg = heroBackdropSrc[siteConfig.heroBackdrop];
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-heading">
      <div
        className={styles.bg}
        style={{ backgroundImage: `url('${bg}')` }}
        aria-hidden="true"
      />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.livePill}>
            <span className={styles.pulseDot}>
              <span className={styles.pulseCore} />
              <span className={styles.pulseRing} />
            </span>
            <span className={styles.livePillText}>
              THE SCOREKEEPER THAT SETTLES THE BET
            </span>
          </div>

          <h1 id="hero-heading" className={styles.h1}>
            Bet it.
            <br />
            Track it.
            <br />
            <span className={styles.accent}>Settle it.</span>
          </h1>

          <p className={styles.lead}>
            Skins, Nassau, the press on the back nine — GoLo runs every side-game,
            does the math you hate, and tells everyone{" "}
            <strong>exactly who owes who</strong> before you hit the parking lot.
          </p>

          <StoreButtons size="md" />
          <TextMeLink />
        </div>

        <div className={styles.phone}>
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}
