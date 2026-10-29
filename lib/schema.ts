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
