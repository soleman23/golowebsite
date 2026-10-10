/** Guests: Tom plays without the app. Copy left, the GuestCard mockup right. */

import { guestsSection } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CheckList } from "@/components/ui/CheckList";
import { GuestCard } from "@/components/mockups/GuestCard";
import styles from "./GuestsSection.module.css";

export function GuestsSection() {
  return (
    <section className={styles.section} aria-labelledby="guests-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <SectionHeader
            kicker={guestsSection.kicker}
            title={guestsSection.title}
            lead={guestsSection.lead}
            headingId="guests-heading"
            className={styles.header}
          />
          <CheckList items={[...guestsSection.points]} />
        </div>
        <div className={styles.visual}>
          <GuestCard />
        </div>
      </div>
    </section>
  );
}
