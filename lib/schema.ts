/**
 * The site's structured-data entities, defined once. Every JSON-LD block that
 * names the company, the website or the app refers to these by @id, so search
 * engines and AI systems see one GoLo Golf rather than a "GoLo" publisher on
 * the blog and a "GoLo Golf" organization on the home page.
 *
 * The home page carries the full Organization and WebSite nodes. Other pages
 * repeat a compact copy under the same @id: Google doesn't promise to resolve
 * an @id defined on another URL, so each page's graph has to stand on its own,
 * and the shared @id is what tells a parser the copies are one entity.
 */

import { organizationLogo, siteConfig } from "@/lib/siteConfig";

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;
export const APP_ID = `${siteConfig.url}/#app`;

export const FOUNDER_ID = `${siteConfig.url}/about#founder`;

export const organizationRef = { "@id": ORGANIZATION_ID } as const;

/** The founder, as /about names him. Embedded wherever the company is. */
export function founderNode() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.title,
    worksFor: organizationRef,
  };
}
export const websiteRef = { "@id": WEBSITE_ID } as const;

/**
 * The company, in full. Named "GoLo Golf" — the name searchers use, and the
 * one that separates this company from the GOLO dice game, putters and diet —
 * with the LLC as legalName. The address stops at the city: the street address
 * is a residence, and an app company has no storefront to find. /privacy keeps
 * the full mailing address of record.
 */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.supportEmail,
    logo: organizationLogo,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    foundingDate: siteConfig.foundingYear,
    founder: founderNode(),
    sameAs: siteConfig.sameAs,
  };
}

/** The same company, compact, for pages other than home. */
export function organizationSummary() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.brandName,
    url: siteConfig.url,
    logo: organizationLogo,
  };
}

/**
 * The website. Its name is what Google reads to pick the site name shown above
 * a result, so it matches the Organization's.
 */
export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.brandName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    publisher: organizationRef,
  };
}

/** The glossary's DefinedTermSet (#163). */
export const GLOSSARY_TERMSET_ID = `${siteConfig.url}/glossary#termset`;

type GlossarySchemaTerm = { slug: string; term: string; shortDefinition: string };

/**
 * The glossary hub as a DefinedTermSet, one DefinedTerm per published term.
 * Each term's name and description are the visible <dt> and short
 * definition, and its URL is its anchor on the hub, since that's where they
 * are visible (docs/glossary/canonical-map.md rule 4). No author, review or
 * rating fields: reviewedBy is internal and nothing else here is real.
 * Callers pass published terms only.
 */
export function glossaryTermSetNode(
  terms: readonly GlossarySchemaTerm[],
  copy: { name: string; description: string },
) {
  const hub = `${siteConfig.url}/glossary`;
  return {
    "@type": "DefinedTermSet",
    "@id": GLOSSARY_TERMSET_ID,
    name: copy.name,
    description: copy.description,
    url: hub,
    inLanguage: "en",
    publisher: organizationRef,
    isPartOf: websiteRef,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `${hub}#${t.slug}`,
      name: t.term,
      description: t.shortDefinition,
      url: `${hub}#${t.slug}`,
      inDefinedTermSet: { "@id": GLOSSARY_TERMSET_ID },
    })),
  };
}

/** The Rules Center hub's CollectionPage (#243). */
export const RULES_COLLECTION_ID = `${siteConfig.url}/rules#collection`;

type RulesSchemaHub = {
  scenarios: readonly { slug: string; question: string }[];
  overviews: readonly { id: string; number: number; title: string }[];
};

/**
 * The /rules hub as a CollectionPage whose ItemList is its situations, then
 * its rules, each by its fragment, in the order the page shows them
 * (docs/rules/product-spec.md Amendment A8). Published records only; the
 * caller passes publishedRules(). No FAQPage, ratings or authority claims:
 * the page explains the Rules, it doesn't rule. The BreadcrumbList comes
 * from the hero's Breadcrumbs, as on every page.
 */
export function rulesCollectionNode(
  hub: RulesSchemaHub,
  copy: { name: string; description: string; dateModified?: string },
) {
  const page = `${siteConfig.url}/rules`;
  const items = [
    ...hub.scenarios.map((s) => ({ name: s.question, url: `${page}#${s.slug}` })),
    ...hub.overviews.map((r) => ({ name: `Rule ${r.number}: ${r.title}`, url: `${page}#${r.id}` })),
  ];
  return {
    "@type": "CollectionPage",
    "@id": RULES_COLLECTION_ID,
    name: copy.name,
    description: copy.description,
    url: page,
    inLanguage: "en",
    isPartOf: websiteRef,
    publisher: organizationRef,
    ...(copy.dateModified ? { dateModified: copy.dateModified } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}
