/**
 * The lime-bordered "six we get most" panel. Every tile is a plain same-page
 * anchor: clicking one changes the hash, and the deep-linked Accordion below
 * picks that up on `hashchange` and opens the answer. One mechanism serves
 * both this panel and a cold load of /faq#q-settle.
 */

import { mostAskedFaqs } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import styles from "./MostAsked.module.css";

export function MostAsked() {
  if (mostAskedFaqs.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="most-asked-heading">
      <div className={styles.inner}>
        <div className={styles.panel}>
          <div className={styles.head}>
            <span className={styles.iconTile}>
              <Icon name="star" size={18} color="var(--accent)" />
            </span>
            <h2 id="most-asked-heading" className={styles.label}>
              THE SIX WE GET MOST
            </h2>
          </div>

          <ul className={styles.grid}>
            {mostAskedFaqs.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={styles.tile}>
                  <span className={styles.num} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.question}>{item.q}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
