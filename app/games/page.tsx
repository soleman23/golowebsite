import type { Metadata } from "next";
import { gameFilters } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { FilterBoot } from "@/components/ui/FilterBoot";
import { GamesGrid } from "@/components/sections/games/GamesGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Golf Betting Games",
  description:
    "Skins, Nassau, Wolf, Bingo Bango Bongo and the junk board — how each game works and how GoLo scores them in one round.",
  alternates: { canonical: "/games" },
};

/**
 * Static, and deliberately so. Reading `searchParams` here would make the
 * route dynamic, and Next 15 streams metadata on dynamic routes — the title
 * and description end up in the body instead of <head>. See FilterBoot.
 *
 * Every card ships in the HTML on every request now, which is strictly better
 * for a crawler than the old behaviour of serving whatever subset the query
 * string asked for. The filter is presentation: FilterBoot sets it before
 * paint, CSS applies it, and the chips own it after hydration.
 */
export default function GamesPage() {
  return (
    <>
      <FilterBoot param="filter" ids={gameFilters.map((f) => f.id)} />

      <PageHero
        kicker="EVERY GAME, SCORED AUTOMATICALLY"
        title="Pick your poison."
        titleAccentLine="We'll keep the books."
        lead="Skins, Nassau, Wolf, the side pots your buddy always forgets to pay — GoLo runs every one, stacks them in a single round, and nets it all into one number per player. Browse the whole roster below."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Games" }]}
      />

      <GamesGrid />

      <FinalCTA
        page="games"
        title="Stack 'em all. Settle in seconds."
        lead="Set up every game before the first tee and let GoLo keep score. Download it, and never do parking-lot math again."
      />
    </>
  );
}
