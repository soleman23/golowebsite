/**
 * glossary_term_open as docs/glossary/ux.md D5 defines it: a search result or
 * related-term link opened, or arrival on /glossary#<slug>; once per term per
 * page load.
 *
 * A term counts as reported only once the event could be sent. An open made
 * before any analytics choice isn't replayed after Allow; a later open of the
 * same term, under consent, is reported.
 *
 * Arrival waits two tasks. AnalyticsLoader applies the saved choice one task
 * after mount, from an effect that runs after the hub's (it sits after
 * <main> in the layout), so a report sent at once would be dropped.
 */

export type OpenReporter = {
  open: (termId: string, category: string) => void;
  arrive: (termId: string, category: string) => void;
};

export function createOpenReporter(
  send: (termId: string, category: string) => void,
  allowed: () => boolean,
  nextTask: (run: () => void) => void = (run) => setTimeout(run, 0),
): OpenReporter {
  const reported = new Set<string>();
  const open = (termId: string, category: string) => {
    if (reported.has(termId) || !allowed()) return;
    reported.add(termId);
    send(termId, category);
  };
  return {
    open,
    arrive: (termId, category) => nextTask(() => nextTask(() => open(termId, category))),
  };
}
