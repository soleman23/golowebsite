import type { Metadata } from "next";
import Link from "next/link";
import { aboutContent as c } from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/siteConfig";
import {
  founderNode,
  organizationNode,
  organizationRef,
  websiteNode,
  websiteRef,
} from "@/lib/schema";
import { PageHero } from "@/components/ui/PageHero";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import styles from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: c.pageName,
  description:
    "Who makes GoLo, why it exists, where it is today, and what it doesn't do: GoLo Golf LLC in Bend, Oregon, founded in 2026.",
});

/**
 * The page is about the company, so its graph carries the full Organization
 * node (founder and founding date included) rather than the compact copy other
 * pages use.
 */
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteConfig.url}/about`,
      url: `${siteConfig.url}/about`,
      name: c.pageName,
      about: organizationRef,
      mainEntity: organizationRef,
      isPartOf: websiteRef,
    },
    organizationNode(),
    founderNode(),
    websiteNode(),
  ],
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker={c.kicker}
        title={c.title}
        lead={c.lead}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        visual={
          <span className={styles.heroIcon} aria-hidden="true">
            <Icon name="pin" size={58} />
          </span>
        }
      />

      <section className={styles.section} aria-labelledby="about-why">
        <div className={styles.inner}>
          <p className={styles.kicker}>{c.why.kicker}</p>
          <h2 id="about-why" className={styles.sectionTitle}>
            {c.why.title}
          </h2>
          <div className={styles.prose}>
            {c.why.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-company">
        <div className={styles.inner}>
          <h2 id="about-company" className={styles.kicker}>
            {c.panelsHeading}
          </h2>
          <div className={styles.grid}>
            <div className={styles.panel}>
              <h3 className={styles.kicker}>{c.who.kicker}</h3>
              <p className={styles.panelTitle}>{c.who.name}</p>
              <p className={styles.role}>{c.who.title}</p>
              <p>{c.who.body}</p>
            </div>

            <div className={styles.panel}>
              <h3 className={styles.kicker}>{c.status.kicker}</h3>
              <p>{c.status.body}</p>
              <Link href={c.status.link.href} className={styles.link}>
                {c.status.link.label}
              </Link>
            </div>

            <div className={styles.panel}>
              <h3 className={styles.kicker}>{c.money.kicker}</h3>
              <p>{c.money.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-honest">
        <div className={styles.inner}>
          <p className={styles.kicker}>{c.honesty.kicker}</p>
          <h2 id="about-honest" className={styles.sectionTitle}>
            {c.honesty.title}
          </h2>
          <div className={styles.prose}>
            {c.honesty.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link href={c.honesty.link.href} className={styles.link}>
            {c.honesty.link.label}
          </Link>

          <div className={styles.contact}>
            <div>
              <h2 className={styles.kicker}>{c.contact.kicker}</h2>
              <p className={styles.contactLine}>{c.contact.line}</p>
              <p>
                <a href={`mailto:${c.contact.email}`} className={styles.link}>
                  {c.contact.email}
                </a>
                {" · "}
                <a href={c.contact.instagram.url} className={styles.link}>
                  {c.contact.instagram.label}
                </a>
              </p>
            </div>
            <Link href={c.contact.formLink.href} className={styles.button}>
              {c.contact.formLink.label}
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={aboutJsonLd} />
    </>
  );
}
