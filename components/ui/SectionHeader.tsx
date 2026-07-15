/**
 * Reusable section header: lime kicker/eyebrow + H2 + optional lead paragraph.
 * Used by Features, Games, How-it-works, Testimonials and FAQ so heading
 * styling stays consistent in one place.
 */

import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  kicker: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
  headingId?: string;
  maxWidth?: number;
  className?: string;
};

export function SectionHeader({
  kicker,
  title,
  lead,
  align = "start",
  headingId,
  maxWidth,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={`${styles.header} ${align === "center" ? styles.center : ""} ${className ?? ""}`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      <p className={styles.kicker}>{kicker}</p>
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </div>
  );
}
