import Link from "next/link";
import { notFoundContent } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.page} aria-labelledby="not-found-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.kicker}>{notFoundContent.kicker}</p>
        <p className={styles.code} aria-hidden="true">404</p>
        <h1 id="not-found-heading" className={styles.title}>
          {notFoundContent.title}<br />
          <span>{notFoundContent.accentTitle}</span>
        </h1>
        <p className={styles.lead}>{notFoundContent.lead}</p>
        <Link href="/" className={styles.home}>BACK TO THE CLUBHOUSE</Link>

        <ul className={styles.grid}>
          {notFoundContent.destinations.map((destination) => (
            <li key={destination.name}>
              <Link href={destination.href} className={styles.card}>
                <span className={styles.icon}><Icon name={destination.icon} size={24} /></span>
                <strong>{destination.name}</strong>
                <span className={styles.desc}>{destination.desc}</span>
                <span className={styles.cta}>{destination.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
