/**
 * Once-per-load "open" events for a hub's entries: glossary_term_open as
 * docs/glossary/ux.md D5 defines it (a search result or related-term link
 * opened, or arrival on /glossary#<slug>), and the Rules Center's rule and
 * situation opens (docs/rules/ux.md § Analytics hooks). Once per entry per
 * page load.
 *
 * An entry counts as reported only once the event could be sent. An open
 * made before any analytics choice isn't replayed after Allow; a later open
 * of the same entry, under consent, is reported.
 *
 * Arrival waits two tasks. AnalyticsLoader applies the saved choice one task
 * after mount, from an effect that runs after the hub's (it sits after
 * <main> in the layout), so a report sent at once would be dropped.
 */

export type OpenReporter = {
  open: (id: string, category: string) => void;
  arrive: (id: string, category: string) => void;
};

export function createOpenReporter(
  send: (id: string, category: string) => void,
  allowed: () => boolean,
  nextTask: (run: () => void) => void = (run) => setTimeout(run, 0),
): OpenReporter {
  const reported = new Set<string>();
  const open = (id: string, category: string) => {
    if (reported.has(id) || !allowed()) return;
    reported.add(id);
    send(id, category);
  };
  return {
    open,
    arrive: (id, category) => nextTask(() => nextTask(() => open(id, category))),
  };
}
