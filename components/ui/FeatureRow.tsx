/**
 * Reusable alternating feature row: a copy column (icon pill, H3, lead, and a
 * lime circled-check checklist) beside a visual. `visualSide` controls desktop
 * placement; on mobile the copy always stacks above the visual (order rules in
 * CSS), per the design handoff.
 */

import type { Feature } from "@/lib/content";
import { Icon } from "./Icon";
import { CheckList } from "./CheckList";
import styles from "./FeatureRow.module.css";

type FeatureRowProps = {
  feature: Feature;
  children: React.ReactNode; // the phone/card visual
};

export function FeatureRow({ feature, children }: FeatureRowProps) {
  const visualLeft = feature.visualSide === "left";
  return (
    <div className={`${styles.row} ${visualLeft ? styles.visualLeft : ""}`}>
      <div className={styles.copy}>
        <div className={styles.badge}>
          <Icon name={feature.icon} size={16} color="var(--accent)" />
          <span className={styles.badgeLabel}>{feature.kicker}</span>
        </div>
        <h3 className={styles.title}>{feature.title}</h3>
        <p
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: feature.bodyHtml }}
        />
        <CheckList items={feature.checklist} />
      </div>
      <div className={styles.visual}>{children}</div>
    </div>
  );
}
