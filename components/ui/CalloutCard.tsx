/**
 * Lime-tint glass card. Carries the "in plain English" notes beside legal
 * sections and the asides inside blog prose.
 */

import styles from "./CalloutCard.module.css";

type CalloutCardProps = {
  /** Short uppercase label, e.g. "IN PLAIN ENGLISH". */
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function CalloutCard({ title, children, className }: CalloutCardProps) {
  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      {title ? <span className={styles.title}>{title}</span> : null}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
