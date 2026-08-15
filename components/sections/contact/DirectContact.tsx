/**
 * The aside beside the form: the ways in that aren't the form, plus the fine
 * print. Server component — it's passed into ContactPanel as a prop so none of
 * this static markup ends up in the client bundle.
 *
 * Sticky at wide; below 1100px it falls under the form as full-width cards.
 */

import Link from "next/link";
import { contactChannels, contactLegalLinks } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import styles from "./DirectContact.module.css";

export function DirectContact() {
  return (
    <aside className={styles.aside} aria-labelledby="direct-heading">
      <h2 id="direct-heading" className={styles.label}>
        OR REACH US DIRECTLY
      </h2>

      {contactChannels.map((channel) => {
        const body = (
          <>
            <span className={styles.icon} aria-hidden="true">
              <Icon name={channel.icon} size={20} color="var(--accent)" />
            </span>
            <span className={styles.copy}>
              <span className={styles.title}>{channel.title}</span>
              <span className={styles.blurb}>{channel.blurb}</span>
              {channel.lines ? (
                <address className={styles.address}>
                  {channel.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              ) : null}
              {channel.cta ? (
                <span className={styles.cta}>{channel.cta} →</span>
              ) : null}
            </span>
          </>
        );

        // The postal card has nowhere to link to, so it's a plain card.
        return channel.href ? (
          <a key={channel.id} href={channel.href} className={styles.card}>
            {body}
          </a>
        ) : (
          <div key={channel.id} className={styles.card}>
            {body}
          </div>
        );
      })}

      <div className={styles.fineprint}>
        <p className={styles.fineLabel}>THE FINE PRINT</p>
        <div className={styles.fineRow}>
          {contactLegalLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.finePill}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
