"use client";

/**
 * Owns the selected topic, which is the one piece of state the route cards and
 * the form share — clicking "Report a bug" has to arrive in the picker below.
 *
 * The aside comes in as a prop rather than being rendered here, so the
 * direct-contact cards and fine print stay server components and never reach
 * the client bundle.
 */

import { useEffect, useState } from "react";
// The modules, not the @/lib/content barrel: this is a client component, and
// the barrel would ship every page's copy to the browser with it.
import { contactRoutes } from "@/lib/content/contact";
import {
  contactTopicIds,
  type ContactTopicId,
} from "@/lib/content/contactTopics";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/ui/ContactForm";
import styles from "./ContactPanel.module.css";

function isTopicId(value: string | null): value is ContactTopicId {
  return Boolean(value) && (contactTopicIds as readonly string[]).includes(value!);
}

export function ContactPanel({ aside }: { aside: React.ReactNode }) {
  const [topic, setTopic] = useState<ContactTopicId | "">("");

  // `/contact?topic=press` lands with Press picked. Read once on mount from
  // the URL rather than through useSearchParams: that hook would force this
  // page behind a Suspense boundary, which would keep the form out of the
  // prerendered HTML.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("topic");
    if (isTopicId(param)) setTopic(param);
  }, []);

  function pickFromCard(next: ContactTopicId) {
    setTopic(next);
    document.getElementById("form")?.scrollIntoView({ block: "start" });
  }

  return (
    <>
      <section className={styles.routes} aria-label="Common reasons to write">
        <div className={styles.routesInner}>
          {contactRoutes.map((route) => (
            <button
              key={route.topic}
              type="button"
              className={styles.route}
              onClick={() => pickFromCard(route.topic)}
            >
              <span className={styles.routeIcon} aria-hidden="true">
                <Icon name={route.icon} size={20} color="var(--accent)" />
              </span>
              <span className={styles.routeKicker}>{route.kicker}</span>
              <span className={styles.routeTitle}>{route.title}</span>
              <span className={styles.routeBlurb}>{route.blurb}</span>
              <span className={styles.routeCta}>{route.cta} →</span>
            </button>
          ))}
        </div>
      </section>

      <section id="form" className={styles.formSection}>
        <div className={styles.grid}>
          <ContactForm topic={topic} onTopicChange={setTopic} />
          {aside}
        </div>
      </section>
    </>
  );
}
