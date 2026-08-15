import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories, faqCountLine, faqItems } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { StatusPill } from "@/components/ui/StatusPill";
import { MostAsked } from "@/components/sections/faq/MostAsked";
import { CategoryRail } from "@/components/sections/faq/CategoryRail";
import { CategoryAnswers } from "@/components/sections/faq/CategoryAnswers";
import { TalkToHuman } from "@/components/sections/faq/TalkToHuman";
import { KeepReading } from "@/components/sections/faq/KeepReading";
import { FinalCTA } from "@/components/sections/FinalCTA";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Handicaps, stacking games, settling up and where GoLo is today — answered by the people who built it.",
  alternates: { canonical: "/faq" },
};

/**
 * The highest-value structured data on the site: every question on the page,
 * not just a sample. Answers go out as plain text — a note is appended to its
 * answer rather than dropped, since it's part of the honest answer.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.note ? `${item.a} ${item.note}` : item.a,
    },
  })),
};

const railCategories = faqCategories.map((category) => ({
  id: category.id,
  short: category.short,
  label: category.label,
  count: category.items.length,
}));

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="QUESTIONS FROM THE 19TH HOLE"
        title="Good question."
        lead="Everything we get asked about scoring a round, running the games, and settling the bet — plus the honest answers about where GoLo is today."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        meta={
          <>
            <StatusPill
              variant="testing"
              label="Not live yet — in testing with real groups"
              className={styles.heroPill}
            />
            <span className={styles.metaChip}>{faqCountLine}</span>
            <Link href="/contact" className={styles.metaLink}>
              Not here? Ask us →
            </Link>
          </>
        }
      />

      <MostAsked />

      <section className={styles.body} aria-label="All questions by category">
        <div className={styles.grid}>
          <CategoryRail categories={railCategories} />
          <CategoryAnswers />
        </div>
      </section>

      <TalkToHuman />
      <KeepReading />

      <FinalCTA
        layout="split"
        page="faq"
        kicker="TRACK IT. BET IT. SETTLE IT."
        title="That's every question. Now go win the back nine."
        buttons={[
          {
            label: "Get the app",
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
