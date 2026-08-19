import type { Metadata } from "next";
import Link from "next/link";
import { deleteAccountContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Icon } from "@/components/ui/Icon";
import styles from "./deleteAccount.module.css";

export const metadata: Metadata = {
  title: "Delete Your Account",
  description: "How to export your GoLo data and delete your account, including what is removed, retained, and de-identified.",
  alternates: { canonical: "/delete-account" },
};

export default function DeleteAccountPage() {
  return (
    <>
      <PageHero
        kicker={deleteAccountContent.kicker}
        title={deleteAccountContent.title}
        lead={deleteAccountContent.lead}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Delete account" }]}
        visual={<span className={styles.heroIcon} aria-hidden="true"><Icon name="shield" size={58} /></span>}
      />

      <section className={styles.section} aria-labelledby="delete-path-heading">
        <div className={styles.inner}>
          <div className={styles.introGrid}>
            <article className={styles.panel}>
              <p className={styles.kicker}>IN THE APP</p>
              <h2 id="delete-path-heading">You → Account → Delete Account</h2>
              <ol className={styles.steps}>
                {deleteAccountContent.inAppSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
            <article className={styles.panel}>
              <p className={styles.kicker}>EXPORT FIRST</p>
              <h2>Take your rounds with you</h2>
              <ol className={styles.steps}>
                {deleteAccountContent.exportSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
          </div>

          <div className={styles.fallback}>
            <div>
              <p className={styles.kicker}>LOCKED OUT?</p>
              <h2>Email a person, not a deletion form</h2>
              <p>Use the prefilled email and include what you remember. We verify the account before acting; this website does not sign you in or simulate a deletion.</p>
            </div>
            <a href={deleteAccountContent.mailto} className={styles.email}>EMAIL INFO@GOLO.GOLF <Icon name="arrowRight" size={15} /></a>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="deletion-details-heading">
        <div className={styles.inner}>
          <p className={styles.kicker}>EXACTLY WHAT HAPPENS</p>
          <h2 id="deletion-details-heading" className={styles.sectionTitle}>What goes, what stays, and why.</h2>
          <div className={styles.dataGrid}>
            <article className={`${styles.dataPanel} ${styles.deleted}`}>
              <h3>Deleted or disconnected</h3>
              <ul>{deleteAccountContent.deleted.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className={styles.dataPanel}>
              <h3>Retained or de-identified</h3>
              <ul>{deleteAccountContent.retained.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>

          <div className={styles.timingGrid}>
            {deleteAccountContent.timing.map((item) => (
              <article key={item.title} className={styles.timingCard}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>

          <p className={styles.policyNote}>For the governing language, read the <Link href="/privacy">Privacy Policy</Link>. This guide explains the path; the policy controls if wording ever differs.</p>
        </div>
      </section>
    </>
  );
}
