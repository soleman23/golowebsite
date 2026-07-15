/**
 * Features section: header + three alternating feature rows. Each row's visual
 * is chosen by `feature.visual` so content data drives which mockup renders.
 */

import { features } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureRow } from "@/components/ui/FeatureRow";
import { ScoringPhone } from "@/components/mockups/ScoringPhone";
import { MoneyCard } from "@/components/mockups/MoneyCard";
import { SettlePhone } from "@/components/mockups/SettlePhone";
import styles from "./Features.module.css";

const visuals = {
  scoring: ScoringPhone,
  money: MoneyCard,
  settle: SettlePhone,
} as const;

export function Features() {
  return (
    <section id="features" className={styles.section} aria-labelledby="features-heading">
      <div className={styles.head}>
        <SectionHeader
          kicker="WHAT GOLO DOES"
          title="Three taps to score. Zero math to settle."
          headingId="features-heading"
        />
      </div>

      {features.map((feature) => {
        const Visual = visuals[feature.visual];
        return (
          <FeatureRow key={feature.id} feature={feature}>
            <Visual />
          </FeatureRow>
        );
      })}
    </section>
  );
}
