import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Game rules written by people who play them, betting etiquette, trip structures, and honest notes from building GoLo.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <PageHero
      kicker="FROM THE CART PATH"
      title="Rules, etiquette, and honest notes from building GoLo."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
    />
  );
}
