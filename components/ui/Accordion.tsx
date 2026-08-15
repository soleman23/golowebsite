"use client";

/**
 * Accessible disclosure list. Each question is a <button aria-expanded> inside
 * a heading; its panel is a labelled region. Multiple items can be open at
 * once and item 0 starts open, matching the home FAQ this generalizes.
 *
 * The client boundary stops here — pages stay server components and pass the
 * items in.
 */

import { useEffect, useState } from "react";
import styles from "./Accordion.module.css";

export type AccordionItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Ids open on first render. Defaults to the first item. */
  defaultOpen?: string[];
  /** Fires when an item opens — not when it closes. */
  onOpen?: (id: string) => void;
  /** Heading level wrapping each question button. */
  headingLevel?: 2 | 3 | 4;
  /** Panel height cap for the open transition. */
  maxPanelHeight?: number;
  /** Prefix for the generated button/panel ids, so two accordions can coexist. */
  idPrefix?: string;
  /**
   * Makes each item addressable as `#<item.id>`: puts the id on the item's
   * wrapper, and opens + scrolls the matching item on load and on every later
   * hash change. Off by default — item ids only have to be unique within an
   * accordion, so an anchor is only safe where the caller says it is.
   */
  deepLink?: boolean;
};

export function Accordion({
  items,
  defaultOpen,
  onOpen,
  headingLevel = 3,
  maxPanelHeight = 320,
  idPrefix = "accordion",
  deepLink = false,
}: AccordionProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial = defaultOpen ?? (items[0] ? [items[0].id] : []);
    return Object.fromEntries(initial.map((id) => [id, true]));
  });

  // Joined rather than passing `items` straight into the dep array: the array
  // is rebuilt on every parent render, which would re-run the effect and yank
  // the reader back to the anchor mid-scroll.
  const idKey = items.map((item) => item.id).join("|");

  useEffect(() => {
    if (!deepLink) return;
    const ids = new Set(idKey.split("|"));

    function openFromHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id || !ids.has(id)) return;

      setOpen((state) => (state[id] ? state : { ...state, [id]: true }));

      // Scroll straight away rather than waiting a frame for the open to
      // commit: only the target item expands, and it expands downward, so
      // nothing above it moves and its top is already in its final place.
      // (A rAF here would also never fire in a backgrounded tab.)
      // .anchored's scroll-margin-top is what clears the sticky nav.
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [deepLink, idKey]);

  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";

  function toggle(id: string) {
    // Fire the callback here, not inside the updater: React can invoke a state
    // updater more than once for a single event (it does under StrictMode),
    // which would double-count every open.
    const willOpen = !open[id];
    setOpen((state) => ({ ...state, [id]: !state[id] }));
    if (willOpen) onOpen?.(id);
  }

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const isOpen = Boolean(open[item.id]);
        const buttonId = `${idPrefix}-button-${item.id}`;
        const panelId = `${idPrefix}-panel-${item.id}`;
        return (
          <div
            key={item.id}
            id={deepLink ? item.id : undefined}
            className={`${styles.item} ${deepLink ? styles.anchored : ""}`}
          >
            <Heading className={styles.questionHeading}>
              <button
                type="button"
                id={buttonId}
                className={styles.question}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span
                  className={`${styles.plus} ${isOpen ? styles.plusOpen : ""}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={styles.panel}
              style={{ maxHeight: isOpen ? maxPanelHeight : 0 }}
            >
              <div className={styles.answer}>{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
