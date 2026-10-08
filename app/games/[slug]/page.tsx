import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  findGameDetail,
  gameDetailSlugsWithContent,
  type GameDetail,
} from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { socialDefaults } from "@/lib/pageMetadata";
import { PageHero } from "@/components/ui/PageHero";
import { Icon } from "@/components/ui/Icon";
import { GameSteps } from "@/components/sections/gameDetail/GameSteps";
import { GameScoring } from "@/components/sections/gameDetail/GameScoring";
import { WorkedExample } from "@/components/sections/gameDetail/WorkedExample";
import { GameVariations } from "@/components/sections/gameDetail/GameVariations";
import { GameTips } from "@/components/sections/gameDetail/GameTips";
import { GameGlossary } from "@/components/sections/gameDetail/GameGlossary";
import { GameFaq } from "@/components/sections/gameDetail/GameFaq";
import { RelatedGames } from "@/components/sections/gameDetail/RelatedGames";
import { PrevNextGames } from "@/components/sections/gameDetail/PrevNextGames";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import styles from "./gameDetail.module.css";

type Params = { params: Promise<{ slug: string }> };

/** A game earns a route once it has written content in gameDetail.ts. */
export function generateStaticParams() {
  return gameDetailSlugsWithContent.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const game = findGameDetail(slug);
  if (!game) return {};

  const title = game.seoTitle;
  const description = game.metaDescription;

  return {
    title,
    description,
    alternates: { canonical: `/games/${game.slug}` },
    // Declaring `openGraph` replaces the layout's object, so the site-wide
    // defaults (siteName, the share card) are spread back in — these pages are
    // the most-linked on the site and can't share without an image.
    openGraph: {
      ...socialDefaults.openGraph,
      type: "article",
      url: `/games/${game.slug}`,
      title,
      description,
    },
  };
}

function jsonLd(game: GameDetail) {
  const base = `${siteConfig.url}/games/${game.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: game.howTitle,
      description: game.intro,
      step: game.steps.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: step.title,
        text: step.body,
        url: `${base}#how`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: game.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}

export default async function GameDetailPage({ params }: Params) {
  const { slug } = await params;
  const game = findGameDetail(slug);
  if (!game) notFound();

  return (
    <>
      <PageHero
        kicker={game.kicker}
        title={game.name}
        lead={game.tagline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/games" },
          { label: game.name },
        ]}
        meta={game.traits.map((trait) => (
          <span key={trait} className={styles.trait}>
            {trait}
          </span>
        ))}
        visual={
          <span className={styles.heroIcon} aria-hidden="true">
            <Icon name={game.icon} size={64} color="var(--accent)" />
          </span>
        }
      />

      <GameSteps game={game} />
      <GameScoring game={game} />
      <WorkedExample game={game} />
      <GameVariations game={game} />
      <GameTips game={game} />
      <GameGlossary game={game} />
      <GameFaq game={game} />
      <RelatedGames game={game} />
      <PrevNextGames game={game} />

      <FinalCTA
        page={`game_${game.slug}`}
        title={game.headings.cta.title}
        lead={game.headings.cta.lead}
      />

      {jsonLd(game).map((block) => (
        <JsonLd key={block["@type"]} data={block} />
      ))}
    </>
  );
}
