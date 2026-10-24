/**
 * Site footer: logo lockup + tagline + social icons, four link columns
 * (Product / Games / Legal / Company), and a bottom bar with copyright and a
 * side-games disclaimer. Edit footerLinks and socialLinks in
 * lib/content/nav.ts, not this file.
 */

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import {
  footerLinks,
  socialLinkName,
  socialLinks,
  socialLinksLabel,
} from "@/lib/content";
import styles from "./Footer.module.css";

const columns = [
  { heading: "PRODUCT", links: footerLinks.product },
  { heading: "GAMES", links: footerLinks.games },
  { heading: "LEGAL", links: footerLinks.legal },
  { heading: "COMPANY", links: footerLinks.company },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo tileSize={36} markSize={26} wordSize={20} glow={false} />
          <p className={styles.tagline}>
            Score it. Track it. Settle it. The scorekeeper that finally settles the
            side games.
          </p>
          <ul className={styles.social} aria-label={socialLinksLabel}>
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLinkName(link)}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.columns}>
          {columns.map((col) => (
            <div key={col.heading} className={styles.column}>
              {/* A label, not a heading: as h2s these four put PRODUCT, GAMES,
                  LEGAL and COMPANY into every page's outline. */}
              <p className={styles.columnHeading}>{col.heading}</p>
              <ul className={styles.columnLinks} aria-label={col.heading}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") && !/\.\w+$/.test(link.href) ? (
                      <Link href={link.href} className={styles.columnLink}>
                        {link.label}
                      </Link>
                    ) : (
                      // mailto:, files like the RSS feed, and other non-page
                      // hrefs — a plain anchor, so the router never tries to
                      // navigate to them.
                      <a href={link.href} className={styles.columnLink}>
                        {link.label}
                      </a>
                    )}
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
          GoLo keeps score and the tally for your group’s side games. Keep it
          friendly, settle up outside the app, and play your local rules.
        </span>
      </div>
    </footer>
  );
}
