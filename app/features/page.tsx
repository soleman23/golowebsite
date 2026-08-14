import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Every game scored, every press logged, every debt netted. What GoLo does today — round setup, live scoring, presses, handicaps and auto settle-up.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <PageHero
      kicker="EVERYTHING GOLO DOES"
      title="A scorecard that can do arithmetic, keep a bet straight, and remember who owes who."
      lead="Set the round, stack the games, tap in scores. GoLo handles the strokes, the presses, the junk and the math — and hands you one number per player before anyone leaves the lot."
      ctas={[
        { label: "Get the app", href: "/#get", variant: "primary" },
        { label: "Browse the games", href: "/games", variant: "ghost" },
      ]}
    />
  );
}
