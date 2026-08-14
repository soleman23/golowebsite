/**
 * Reusable alternating feature row: a copy column (kicker badge, heading, lead
 * and a lime circled-check checklist) beside a visual. `visualSide` controls
 * desktop placement; on mobile the copy always stacks above the visual (order
 * rules in CSS), per the design handoff.
 *
 * The home page and /features share this: home passes an icon and keeps the
 * h3 default, /features adds a status pill, a closing link, and h2 headings
 * because its own h1 is in the PageHero.
 */

import type { IconName } from "./Icon";
import type { CheckListItem } from "./CheckList";
import { Icon } from "./Icon";
import { CheckList } from "./CheckList";
import { StatusPill, type StatusVariant } from "./StatusPill";
import styles from "./FeatureRow.module.css";

/** The shape FeatureRow actually reads — both Feature and FeatureBlock fit. */
export type FeatureRowContent = {
  icon?: IconName;
  kicker: string;
  title: string;
  bodyHtml?: string;
  lead?: string;
  checklist: CheckListItem[];
  visualSide: "left" | "right";
};

type FeatureRowProps = {
  feature: FeatureRowContent;
  status?: { variant: StatusVariant; label: string };
  headingLevel?: 2 | 3;
  /** True when the visual is a flexible card rather than a fixed-width phone. */
  visualFill?: boolean;
  /** Rendered under the checklist — the lime "See every format →" links. */
  footer?: React.ReactNode;
  children: React.ReactNode; // the phone/card visual
};

export function FeatureRow({
  feature,
  status,
  headingLevel = 3,
  visualFill = false,
  footer,
  children,
}: FeatureRowProps) {
  const visualLeft = feature.visualSide === "left";
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className={`${styles.row} ${visualLeft ? styles.visualLeft : ""}`}>
      <div className={styles.copy}>
        <div className={styles.badgeRow}>
          <div className={styles.badge}>
            {feature.icon ? (
              <Icon name={feature.icon} size={16} color="var(--accent)" />
            ) : null}
            <span className={styles.badgeLabel}>{feature.kicker}</span>
          </div>
          {status ? (
            <StatusPill variant={status.variant} label={status.label} />
          ) : null}
        </div>

        <Heading className={styles.title}>{feature.title}</Heading>

        {feature.bodyHtml ? (
          <p
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: feature.bodyHtml }}
          />
        ) : (
          <p className={styles.body}>{feature.lead}</p>
        )}

        <CheckList items={feature.checklist} />

        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
      <div className={`${styles.visual} ${visualFill ? styles.visualFill : ""}`}>
        {children}
      </div>
    </div>
  );
}
