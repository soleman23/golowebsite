import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findGame, gameDetailSlugs } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";

type Params = { params: Promise<{ slug: string }> };

/**
 * Only games with written detail content get a route — see lib/content/games.ts.
 * Everything else stays a section on /games.
 */
export function generateStaticParams() {
  return gameDetailSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const game = findGame(slug);
  if (!game) return {};

  return {
    title: `${game.name}, Explained`,
    description:
      "Front, back and total, plus the press. How a Nassau works, what a press really costs, and the terms you'll hear on the tee.",
    alternates: { canonical: `/games/${game.slug}` },
  };
}

export default async function GameDetailPage({ params }: Params) {
  const { slug } = await params;
  const game = findGame(slug);
  if (!game || !game.hasDetail) notFound();

  return (
    <PageHero
      kicker={game.name.toUpperCase()}
      title={`${game.name}, explained.`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Games", href: "/games" },
        { label: game.name },
      ]}
    />
  );
}
