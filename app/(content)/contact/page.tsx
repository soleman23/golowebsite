import type { Metadata } from "next";
import { appCtaLabel } from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/siteConfig";
import { PageHero } from "@/components/ui/PageHero";
import { ContactPanel } from "@/components/sections/contact/ContactPanel";
import { DirectContact } from "@/components/sections/contact/DirectContact";
import { ContactFaq } from "@/components/sections/contact/ContactFaq";
import { FinalCTA } from "@/components/sections/FinalCTA";
import styles from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact",
  description:
    "Support, feature requests, course-data fixes and press — every message lands in the inbox we read between rounds.",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="SAY HELLO"
        title="Talk to the people who built it."
        lead={`GoLo is a small shop in Bend, Oregon. Every message lands in the same inbox we read between rounds — no ticket robot, no tier-one script, no “your call is important to us.”`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        meta={
          <>
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className={`${styles.chip} ${styles.chipPrimary}`}
            >
              <span className={styles.dot} aria-hidden="true" />
              {siteConfig.supportEmail}
            </a>
            <a href={siteConfig.instagramUrl} className={styles.chip}>
              {siteConfig.instagramHandle} on Instagram
            </a>
            <span className={styles.chipStatic}>{siteConfig.addressShort}</span>
          </>
        }
      />

      <ContactPanel aside={<DirectContact />} />

      <ContactFaq />

      <FinalCTA
        layout="split"
        page="contact"
        kicker="TRACK IT. BET IT. SETTLE IT."
        title="Message sent. Now go take their money."
        buttons={[
          {
            label: appCtaLabel,
            href: "/#get",
            cta: "get_app",
            variant: "primary",
          },
          {
            label: "Browse the games",
            href: "/games",
            cta: "browse_games",
            variant: "ghost",
          },
        ]}
      />
    </>
  );
}
