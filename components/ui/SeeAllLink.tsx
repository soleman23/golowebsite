/**
 * Lime-tint pill link that sends a home-page teaser section to its full page
 * ("See everything GoLo does →"). Shared so the three teasers can't drift.
 */

import Link from "next/link";
import styles from "./SeeAllLink.module.css";

type SeeAllLinkProps = {
  href: string;
  children: React.ReactNode;
  align?: "start" | "center";
};

export function SeeAllLink({ href, children, align = "start" }: SeeAllLinkProps) {
  return (
    <div className={`${styles.wrap} ${align === "center" ? styles.center : ""}`}>
      <Link href={href} className={styles.link}>
        {children}
      </Link>
    </div>
  );
}
