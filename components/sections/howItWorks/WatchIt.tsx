/**
 * #watch — the ninety-second walkthrough. Rendered only while
 * siteConfig.showHowItWorksVideo is on; the page checks the flag, so this
 * component assumes the files in hiwVideo exist.
 */

import { hiwVideo } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./WatchIt.module.css";

export function WatchIt() {
  return (
    <section id="watch" className={styles.section} aria-labelledby="watch-heading">
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.inner}>
        <SectionHeader
          kicker={hiwVideo.kicker}
          title={hiwVideo.title}
          lead={hiwVideo.lead}
          headingId="watch-heading"
          align="center"
          className={styles.header}
        />
        <div className={styles.frame}>
          <video
            className={styles.video}
            controls
            preload="none"
            playsInline
            poster={hiwVideo.poster}
            aria-labelledby="watch-heading"
          >
            <source src={hiwVideo.src} type="video/mp4" />
            <track
              kind="captions"
              src={hiwVideo.captions}
              srcLang="en"
              label="English"
              default
            />
          </video>
        </div>
      </div>
    </section>
  );
}
