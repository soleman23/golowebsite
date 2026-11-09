/**
 * The /games hub's pointer to the side-game chooser (#224): one line and a
 * link, under the hero and above the roster.
 */

import Link from "next/link";
import { chooserTeaser } from "@/lib/content";
import styles from "./ChooserTeaser.module.css";

export function ChooserTeaser() {
  return (
    <aside className={styles.band} aria-labelledby="chooser-teaser-heading">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div>
            <h2 id="chooser-teaser-heading" className={styles.title}>
              {chooserTeaser.title}
            </h2>
            <p className={styles.body}>{chooserTeaser.body}</p>
          </div>
          <Link href={chooserTeaser.href} className={styles.cta}>
            {chooserTeaser.cta} →
          </Link>
        </div>
      </div>
    </aside>
  );
}
