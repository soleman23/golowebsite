/**
 * Site footer: logo lockup + tagline, three link columns (Product / Games /
 * Company), and a bottom bar with copyright and a friendly-wager disclaimer.
 */

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { footerLinks } from "@/lib/content";
import styles from "./Footer.module.css";

const columns = [
  { heading: "PRODUCT", links: footerLinks.product },
  { heading: "GAMES", links: footerLinks.games },
  { heading: "COMPANY", links: footerLinks.company },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo tileSize={36} markSize={26} wordSize={20} glow={false} />
          <p className={styles.tagline}>
            Track it. Bet it. Settle it. The scorekeeper that finally settles the
            bet.
          </p>
        </div>

        <div className={styles.columns}>
          {columns.map((col) => (
            <div key={col.heading} className={styles.column}>
              <h2 className={styles.columnHeading}>{col.heading}</h2>
              <ul className={styles.columnLinks}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.columnLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.legal}>
          © 2026 GoLo Golf. All rights reserved.
        </span>
        <span className={styles.disclaimer}>
          GoLo helps you track friendly wagers between playing partners. Keep it
          friendly, settle up, and play your local rules.
        </span>
      </div>
    </footer>
  );
}
