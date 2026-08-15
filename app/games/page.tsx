import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GamesGrid, GAME_FILTER_IDS } from "@/components/sections/games/GamesGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Golf Betting Games",
  description:
    "Skins, Nassau, Wolf, Bingo Bango Bongo and the junk board — how each game works and how GoLo scores them in one round.",
  alternates: { canonical: "/games" },
};

/**
 * The filter lives in the URL and is resolved here, on the server, so every
 * card ships in the HTML. Reading it in a client hook instead would hand
 * crawlers a games page with no games on it.
 */
type GamesPageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const { filter } = await searchParams;
  const active = filter && GAME_FILTER_IDS.has(filter) ? filter : "all";

  return (
    <>
      <PageHero
        kicker="EVERY GAME, SCORED AUTOMATICALLY"
        title="Pick your poison."
        titleAccentLine="We'll keep the books."
        lead="Skins, Nassau, Wolf, the side pots your buddy always forgets to pay — GoLo runs every one, stacks them in a single round, and nets it all into one number per player. Browse the whole roster below."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Games" }]}
      />

      <GamesGrid active={active} />

      <FinalCTA
        page="games"
        title="Stack 'em all. Settle in seconds."
        lead="Set up every game before the first tee and let GoLo keep score. Download it, and never do parking-lot math again."
      />
    </>
  );
}
