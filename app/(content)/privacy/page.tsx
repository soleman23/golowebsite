import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data.`,
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>LEGAL</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: July 14, 2026</p>

        <div className={styles.prose}>
          <p>
            This page is a starting template. Replace the sections below with your
            company&rsquo;s reviewed privacy policy before launch — the copy here is
            placeholder wording and should not be treated as legal advice.
          </p>

          <h2>What we collect</h2>
          <p>
            When you ask us to text you a download link, we collect the phone
            number you enter so we can send that message. When you contact us, we
            collect your name, email, and message so we can reply.
          </p>

          <h2>How we use it</h2>
          <ul>
            <li>To send the download link you requested.</li>
            <li>To respond to questions you send through the contact form.</li>
            <li>To understand aggregate interest in the app.</li>
          </ul>

          <h2>What we don&rsquo;t do</h2>
          <p>
            We don&rsquo;t sell your personal information. GoLo tracks friendly wagers
            between playing partners; it does not process payments or hold money.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Reach us through the{" "}
            <a href="/contact">contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
