import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { ContactForm } from "@/components/ui/ContactForm";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>SAY HELLO</p>
        <h1 className={styles.title}>Get in touch.</h1>
        <p className={styles.lead}>
          Questions, feedback, or a bug from the back nine? Send us a note and
          we&rsquo;ll get back to you at the email you provide.
        </p>

        <div className={styles.prose}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
