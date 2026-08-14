/**
 * Honest-status chip: where a feature actually is. Three variants, matching
 * the roadmap columns on /features — lime for shipped, yellow for in testing,
 * neutral glass for not built yet.
 */

import styles from "./StatusPill.module.css";

export type StatusVariant = "today" | "testing" | "planned";

const VARIANT_CLASS: Record<StatusVariant, string> = {
  today: styles.today,
  testing: styles.testing,
  planned: styles.planned,
};

type StatusPillProps = {
  variant: StatusVariant;
  label: string;
  className?: string;
};

export function StatusPill({ variant, label, className }: StatusPillProps) {
  return (
    <span className={`${styles.pill} ${VARIANT_CLASS[variant]} ${className ?? ""}`}>
      {label}
    </span>
  );
}
