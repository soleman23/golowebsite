import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Handicaps, stacking games, settling up and where GoLo is today — answered by the people who built it.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <PageHero
      kicker="QUESTIONS FROM THE 19TH HOLE"
      title="Everything people ask before they trust an app with the bet."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
    />
  );
}
