"use client";

/**
 * Accordion that reports opens to analytics. Kept separate from Accordion so
 * pages that don't need tracking stay free of a client callback, and so server
 * components can render it without passing a function across the boundary.
 *
 * Only the question id is sent — never anything a visitor typed.
 */

import { Accordion, type AccordionItem } from "./Accordion";
import { track } from "@/lib/analytics";

type TrackedAccordionProps = {
  items: AccordionItem[];
  /** Goes out as the `page` param, e.g. "features" or "faq". */
  page: string;
  defaultOpen?: string[];
  headingLevel?: 2 | 3 | 4;
  maxPanelHeight?: number;
  idPrefix?: string;
};

export function TrackedAccordion({ page, ...rest }: TrackedAccordionProps) {
  return (
    <Accordion
      {...rest}
      onOpen={(id) => track("faq_open", { page, question_id: id })}
    />
  );
}
