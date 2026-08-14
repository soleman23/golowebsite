import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Golf Betting Games",
  description:
    "Skins, Nassau, Wolf, Bingo Bango Bongo and the junk board — how each game works and how GoLo scores them in one round.",
  alternates: { canonical: "/games" },
};

export default function GamesPage() {
  return (
    <PageHero
      kicker="EVERY GAME YOU ACTUALLY PLAY"
      title="Golf betting games, explained by people who play them."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Games" }]}
    />
  );
}
