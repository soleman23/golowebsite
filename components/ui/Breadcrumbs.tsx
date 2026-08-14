/**
 * Breadcrumb trail — `Home / Blog / Settling up`. The last crumb is the
 * current page: rendered as plain text, marked aria-current, never a link.
 *
 * Emits a BreadcrumbList server-side alongside the visible trail so the two
 * can't drift apart.
 */

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import styles from "./Breadcrumbs.module.css";

export type Crumb = { label: string; href?: string };

type BreadcrumbsProps = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className={`${styles.nav} ${className ?? ""}`}>
        <ol className={styles.list}>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className={styles.item}>
                {item.href && !isLast ? (
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.current} aria-current="page">
                    {item.label}
                  </span>
                )}
                {isLast ? null : (
                  <span className={styles.sep} aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
