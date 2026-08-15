/**
 * Hero: full-bleed backdrop photo + scrim, live pill, three-line H1, lead,
 * store buttons, and the "text me the link" control, beside the live-leaderboard
 * phone mockup.
 */

import {
  siteConfig,
  heroBackdropClass,
  heroBackdropPreload,
} from "@/lib/siteConfig";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { TextMeLink } from "@/components/ui/TextMeLink";
import { HeroPhone } from "@/components/mockups/HeroPhone";
import styles from "./Hero.module.css";

export function Hero() {
  const bgClass = heroBackdropClass[siteConfig.heroBackdrop];
  const preload = heroBackdropPreload[siteConfig.heroBackdrop];
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-heading">
      {/* The backdrop is the LCP element. It's painted as a CSS background,
          which can't carry fetchpriority on its own, so preload it explicitly.
          One link per breakpoint, matching the media queries on .golo-bd-* in
          globals.css exactly — only one can ever match, so the browser fetches
          precisely the file the stylesheet will use.

          These live here rather than in the root layout because this is the
          only above-the-fold photo on the site; the text pages paint no
          backdrop at all, and a layout-level preload made every one of them
          fetch a high-priority AVIF they never used. Next hoists these into
          <head>. */}
      {preload.map((link) => (
        <link
          key={link.href}
          rel="preload"
          as="image"
          fetchPriority="high"
          type="image/avif"
          href={link.href}
          media={link.media}
        />
      ))}
      <div className={`${styles.bg} ${bgClass}`} aria-hidden="true" />
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
