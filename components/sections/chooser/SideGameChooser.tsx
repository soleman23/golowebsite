"use client";

/**
 * The side-game chooser's form and live results (#224). The leaf that owns
 * state: the five answers, what a shared link failed to say, and the polite
 * messages. Rules and card assembly are lib/chooser; every word arrives as
 * props from lib/content/chooser.ts, built on the server, so the capability
 * registry isn't shipped to the browser.
 *
 * The URL holds the answers, so a result can be shared, reloaded and come
 * back to with Back. The form is server-rendered with nothing chosen; on
 * mount a link's answers are read before paint, and a Link to this page with
 * other answers is picked up by the Suspense'd sync leaf, as FilterUrlSync
 * does. Each change goes into the address bar at once (writeNow), with the
 * browser's own replaceState, so a reload or a copied address never lags the
 * form and no history entry is added. Next's router, and GA4's history
 * listener with it, are told through window.history.replaceState once the
 * answers have stood for SETTLE_MS (flushUrl), and at once before a link is
 * followed or the page is hidden. That keeps the web stream's history page
 * views to one per settled answer set rather than one per tap
 * (docs/analytics-data-notes.md).
 * Parameters the chooser doesn't own (utm_source) are kept; a chooser
 * parameter it couldn't read is dropped from the address bar and reported.
 *
 * Announcements: a change the reader made is announced once its result has
 * stood a moment; arriving from a link isn't, since the page already shows it.
 */

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NO_ANSWERS, PLAYER_COUNTS, type Answers } from "@/lib/chooser/engine";
import {
  CHOOSER_PATH,
  answersKey,
  chooserQuery,
  parseAnswers,
  sameAnswers,
  serializeAnswers,
  type Question,
} from "@/lib/chooser/url";
import { chooserView, type ChooserCopy, type ChooserView, type PickView } from "@/lib/chooser/view";
import type { chooserQuestionNames, chooserQuestions, chooserUi } from "@/lib/content";
import { track } from "@/lib/analytics";
import { ChooserPickCard } from "./ChooserPickCard";
import styles from "./SideGameChooser.module.css";

type Ui = typeof chooserUi;

type SideGameChooserProps = {
  copy: ChooserCopy;
  questions: typeof chooserQuestions;
  questionNames: typeof chooserQuestionNames;
  ui: Ui;
};

/**
 * How long an answer set has to stand before it's settled: written to the
 * address bar and reported as chooser_result.
 */
const SETTLE_MS = 1500;
/**
 * How long a result has to stand before it's announced. Arrowing through the
 * eleven player counts changes the answer on every key, and each one would
 * otherwise queue its own message.
 */
const RESULT_ANNOUNCE_MS = 400;
/** Between clearing the live region and filling it, for one-off messages. */
const ANNOUNCE_MS = 60;


function listOf(items: string[], ui: Ui): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${ui.listAnd} ${items.at(-1)}`;
}

/** "3 games fit these answers." Every format that fits, the picks and the rest. */
function countOf(view: Extract<ChooserView, { status: "ok" }>, ui: Ui): string {
  const count = view.picks.length + view.alsoFits.length;
  return count === 1 ? ui.fitsOne : ui.fitsMany.replace("{n}", String(count));
}

/** The words that lead into the ordered picks, if there's more than one. */
function orderOf(view: Extract<ChooserView, { status: "ok" }>, ui: Ui): string {
  if (view.alsoFits.length) return ui.showingTop;
  return view.picks.length > 1 ? ui.inOrder : "";
}

function summaryOf(view: ChooserView, ui: Ui): string {
  if (view.status === "needs-players") return ui.needsPlayers;
  if (view.status === "empty") return `${ui.emptyTitle}. ${view.message}`;
  const order = orderOf(view, ui);
  return `${countOf(view, ui)} ${order ? `${order} ` : ""}${listOf(view.picks.map((p) => p.name), ui)}.`;
}

/** Re-reads the URL when it changes under the page (a Link to other answers). */
function ChooserUrlSync({ onUrl }: { onUrl: (search: string) => void }) {
  const search = useSearchParams().toString();
  useLayoutEffect(() => {
    onUrl(search);
  }, [search, onUrl]);
  return null;
}

export function SideGameChooser({ copy, questions, questionNames, ui }: SideGameChooserProps) {
  const [answers, setAnswers] = useState<Answers>(NO_ANSWERS);
  const [dropped, setDropped] = useState<Question[]>([]);
  const [message, setMessage] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [failedLink, setFailedLink] = useState("");
  // Becomes true once the URL has been read; analytics waits for it.
  const [ready, setReady] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  // The chooser part of the last URL adopted (chooserQuery), so a URL change
  // that leaves it alone (the analytics cleaner) is ignored.
  // null until the first read, so a link whose only chooser-like keys are
  // misspelt is still parsed (and reported) on arrival.
  const seenQuery = useRef<string | null>(null);
  // The chooser part of each URL this component wrote and the sync leaf
  // hasn't seen yet, oldest first. Seeing one retires it and any older.
  const ownWrites = useRef<string[]>([]);
  // The query string Next's router (and GA's history listener) last saw for
  // this page, normalised. The address bar can be ahead of it: see writeNow.
  const routerSearch = useRef("");
  // Answers waiting to be written through Next, and the timer that writes them.
  const pendingUrl = useRef<Answers | null>(null);
  const urlTimer = useRef<number | undefined>(undefined);
  // A link's unreadable parameters, removed from the address bar after mount.
  const cleanOnMount = useRef<Answers | null>(null);
  // Set by a change the reader made: the answers (answersKey) whose result is
  // announced once it renders. Keyed, not a flag, because a Link to other
  // answers also re-renders with new props first, and that render still shows
  // the old answers.
  const announceFor = useRef<string | null>(null);
  const announceTimer = useRef<number | undefined>(undefined);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const formHeading = useRef<HTMLHeadingElement>(null);
  const reported = useRef(new Set<string>());

  const view = useMemo(() => chooserView(answers, copy), [answers, copy]);

  /** Polite. Cleared first, so the same text twice is read twice; a newer message cancels an older one still waiting. */
  const announce = useCallback((text: string, delay = ANNOUNCE_MS) => {
    window.clearTimeout(announceTimer.current);
    setMessage("");
    // A timeout, not a frame: frames don't run in a background tab.
    announceTimer.current = window.setTimeout(() => setMessage(text), delay);
  }, []);
  useEffect(() => () => window.clearTimeout(announceTimer.current), []);

  // Becomes true after the first read of the URL. A URL adopted after that
  // (a Link to other answers, Back or Forward) is the reader's doing, so its
  // result is announced; a shared link's answers on arrival are not.
  const mounted = useRef(false);

  const adoptUrl = useCallback((search: string) => {
    // Every call carries a URL Next's router holds (the first read, or the
    // sync leaf's useSearchParams).
    routerSearch.current = new URLSearchParams(search).toString();
    const query = chooserQuery(search);
    const own = ownWrites.current.lastIndexOf(query);
    if (own !== -1) {
      ownWrites.current.splice(0, own + 1);
      seenQuery.current = query;
      return;
    }
    ownWrites.current = [];
    if (query === seenQuery.current) return;
    seenQuery.current = query;
    // Another set of answers arrived (a Link, Back): it replaces any change
    // still waiting to be written.
    window.clearTimeout(urlTimer.current);
    pendingUrl.current = null;
    const parsed = parseAnswers(search);
    if (parsed.dropped.length) cleanOnMount.current = parsed.answers;
    if (sameAnswers(parsed.answers, answersRef.current) && !parsed.dropped.length) return;
    if (mounted.current) announceFor.current = answersKey(parsed.answers);
    setAnswers(parsed.answers);
    setDropped(parsed.dropped);
  }, []);

  // A shared link's answers, before the first paint after hydration.
  useLayoutEffect(() => {
    adoptUrl(window.location.search);
    mounted.current = true;
    setReady(true);
  }, [adoptUrl]);

  /** Writes the waiting answers into the address bar, if they differ from it. */
  const flushUrl = useCallback(() => {
    window.clearTimeout(urlTimer.current);
    const next = pendingUrl.current;
    pendingUrl.current = null;
    // Not after leaving: Back can change the URL before this page unmounts.
    if (!next || window.location.pathname !== CHOOSER_PATH) return;
    const search = serializeAnswers(next, window.location.search);
    // Compared with what the router holds, not the address bar, which
    // writeNow has usually updated already.
    const normalised = new URLSearchParams(search).toString();
    if (normalised === routerSearch.current) return;
    routerSearch.current = normalised;
    ownWrites.current.push(chooserQuery(search));
    // null state, as dropUnusedQueryParams does: Next's patched replaceState
    // then moves its router to the new URL, and Back returns to it. GA4's
    // history listener counts this one as a page_view: one per settled set.
    window.history.replaceState(null, "", `${CHOOSER_PATH}${search}${window.location.hash}`);
  }, []);

  /**
   * The answers into the address bar straight away, so a reload or a copied
   * address never lags the form. It goes through the browser's own
   * History.prototype.replaceState with the entry's existing state: gtag.js
   * wraps window.history.replaceState and would count every tap as a
   * page_view, and Next's wrapper passes an entry with its own state through
   * untouched. Measured 2026-11-09 with the live gtag.js (every hit answered
   * locally): this write sends no page_view, and the later write through
   * flushUrl still sends one. The router catches up in flushUrl.
   */
  const writeNow = useCallback((next: Answers) => {
    if (window.location.pathname !== CHOOSER_PATH) return;
    const search = serializeAnswers(next, window.location.search);
    if (new URLSearchParams(search).toString() === new URLSearchParams(window.location.search).toString()) return;
    // Seen as this component's own if the router picks it up first (the
    // analytics cleaner rewrites the URL through Next).
    ownWrites.current.push(chooserQuery(search));
    History.prototype.replaceState.call(window.history, window.history.state, "", `${CHOOSER_PATH}${search}${window.location.hash}`);
  }, []);

  const writeUrlSoon = useCallback(
    (next: Answers, delay = SETTLE_MS) => {
      window.clearTimeout(urlTimer.current);
      writeNow(next);
      pendingUrl.current = next;
      urlTimer.current = window.setTimeout(flushUrl, delay);
    },
    [flushUrl, writeNow],
  );

  // Drop a link's unreadable parameters once Next has patched the history
  // API: its effect runs after this one, so wait a task (AnalyticsLoader does
  // the same).
  useEffect(() => {
    if (!cleanOnMount.current) return;
    const next = cleanOnMount.current;
    cleanOnMount.current = null;
    writeUrlSoon(next, 0);
  }, [writeUrlSoon, dropped]);

  // Write a waiting change before anything leaves the page or the tab.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a[href]")) flushUrl();
    };
    const onHidden = () => {
      if (document.visibilityState === "hidden") flushUrl();
    };
    // Back or Forward: the waiting answers belong to the entry being left.
    const onPopState = () => {
      window.clearTimeout(urlTimer.current);
      pendingUrl.current = null;
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onHidden);
    // For Back and the bfcache. A reload needs nothing here: writeNow has
    // already put every answer in the address bar.
    window.addEventListener("pagehide", flushUrl);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", flushUrl);
      window.removeEventListener("popstate", onPopState);
      // Unmounting means the page has already changed: write nothing.
      window.clearTimeout(urlTimer.current);
      pendingUrl.current = null;
    };
  }, [flushUrl]);

  // Announce a change the reader made, once its result has stood a moment.
  useEffect(() => {
    if (announceFor.current === null || announceFor.current !== answersKey(answers)) return;
    announceFor.current = null;
    announce(summaryOf(view, ui), RESULT_ANNOUNCE_MS);
  }, [announce, answers, view, ui]);

  // "Link copied" goes back to the button's label, as the glossary's does. A
  // failure note stays until the next answer, since it holds the link.
  useEffect(() => {
    if (copyState !== "copied") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  // chooser_result: once per distinct answer set, after it has stood a moment.
  useEffect(() => {
    if (!ready || answers.players === null) return;
    const key = answersKey(answers);
    if (reported.current.has(key)) return;
    const timer = window.setTimeout(() => {
      reported.current.add(key);
      track("chooser_result", {
        group: key,
        result_count: view.status === "ok" ? view.picks.length : 0,
        top_pick: view.status === "ok" ? view.picks[0].id : "none",
      });
    }, SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [answers, ready, view]);

  const answer = useCallback(
    <Q extends Question>(question: Q, value: Answers[Q]) => {
      announceFor.current = answersKey({ ...answersRef.current, [question]: value });
      setCopyState("idle");
      setDropped([]);
      const next = { ...answersRef.current, [question]: value };
      answersRef.current = next;
      setAnswers(next);
      writeUrlSoon(next);
    },
    [writeUrlSoon],
  );

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setDropped([]);
    setCopyState("idle");
    // One deliberate action: written straight away.
    pendingUrl.current = NO_ANSWERS;
    flushUrl();
    announce(ui.resetDone);
    formHeading.current?.focus();
  }, [announce, flushUrl, ui.resetDone]);

  const relax = useCallback(
    <Q extends Question>(question: Q, value: Answers[Q]) => {
      answer(question, value);
      // The button that was pressed is about to go; the results are what
      // changed. After the commit that removes it.
      window.setTimeout(() => resultsHeading.current?.focus(), 0);
    },
    [answer],
  );

  // The jump link moves to the results without a #chooser-results history
  // entry, which Back would otherwise restore with older answers. The href
  // stays for a plain link's behaviour without script.
  const jumpToResults = useCallback((event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    // Scroll as the anchor did (under the nav's scroll-padding, smooth unless
    // reduced motion), then focus without a second, centring scroll.
    document.getElementById("chooser-results")?.scrollIntoView({ block: "start" });
    resultsHeading.current?.focus({ preventScroll: true });
  }, []);

  const copyLink = useCallback(async () => {
    const link = `${window.location.origin}${CHOOSER_PATH}${serializeAnswers(answersRef.current)}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopyState("copied");
      announce(ui.copied);
      // The blog's and glossary's share event, so every share is in one report.
      track("share_click", { channel: "copy", page: "chooser" });
    } catch {
      setFailedLink(link);
      setCopyState("failed");
      announce(ui.copyFailed);
    }
  }, [announce, ui.copied, ui.copyFailed]);

  const onGuideClick = useCallback((pick: PickView) => {
    track("chooser_guide_click", { format: pick.id, rank: pick.rank });
  }, []);

  const answered = Object.values(answers).some((v) => v !== null);
  const droppedText = dropped.length
    ? (dropped.length === 1 ? ui.droppedOne : ui.droppedMany).replace(
        "{questions}",
        listOf(dropped.map((q) => questionNames[q]), ui),
      )
    : "";

  const radio = <Q extends Question>(question: Q, value: string, label: string, parse: (v: string) => Answers[Q]) => {
    const id = `chooser-${question}-${value}`;
    return (
      <label key={value} className={styles.option} htmlFor={id}>
        <input
          id={id}
          className={styles.input}
          type="radio"
          name={`chooser-${question}`}
          value={value}
          checked={answers[question] !== null && String(answers[question]) === value}
          onChange={() => answer(question, parse(value))}
        />
        <span className={styles.optionLabel}>{label}</span>
      </label>
    );
  };

  return (
    <div className={styles.chooser}>
      <Suspense fallback={null}>
        <ChooserUrlSync onUrl={adoptUrl} />
      </Suspense>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()} aria-labelledby="chooser-form-heading">
        <h2 id="chooser-form-heading" ref={formHeading} tabIndex={-1} className={styles.formTitle}>
          {ui.formTitle}
        </h2>

        {droppedText ? (
          <p className={styles.dropped} role="note">
            {droppedText}
          </p>
        ) : null}

        <fieldset className={styles.fieldset} aria-describedby="chooser-players-hint">
          <legend className={styles.legend}>{questions.players.legend}</legend>
          <p id="chooser-players-hint" className={styles.hint}>
            {questions.players.hint}
          </p>
          <div className={`${styles.options} ${styles.numbers}`}>
            {PLAYER_COUNTS.map((n) => radio("players", String(n), String(n), Number))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{questions.partners.legend}</legend>
          <div className={styles.options}>
            {questions.partners.options.map((o) => radio("partners", o.value, o.label, (v) => v as Answers["partners"]))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset} aria-describedby="chooser-handicaps-hint">
          <legend className={styles.legend}>{questions.handicaps.legend}</legend>
          <p id="chooser-handicaps-hint" className={styles.hint}>
            {questions.handicaps.hint}
          </p>
          <div className={styles.options}>
            {questions.handicaps.options.map((o) => radio("handicaps", o.value, o.label, (v) => v as Answers["handicaps"]))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{questions.scoring.legend}</legend>
          <div className={styles.options}>
            {questions.scoring.options.map((o) => radio("scoring", o.value, o.label, (v) => v as Answers["scoring"]))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{questions.holes.legend}</legend>
          <div className={styles.options}>
            {questions.holes.options.map((o) => radio("holes", o.value, o.label, (v) => v as Answers["holes"]))}
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="button" className={styles.action} onClick={copyLink} disabled={answers.players === null}>
            {copyState === "copied" ? ui.copied : ui.copy}
          </button>
          <button type="button" className={styles.action} onClick={reset} disabled={!answered}>
            {ui.reset}
          </button>
        </div>
        {copyState === "failed" ? (
          <div className={styles.copyFailed}>
            <label htmlFor="chooser-link" className={styles.hint}>
              {ui.copyFailed}
            </label>
            <input
              id="chooser-link"
              className={styles.linkField}
              type="text"
              readOnly
              value={failedLink}
              onFocus={(e) => e.currentTarget.select()}
            />
          </div>
        ) : null}

        {/* Narrow screens: the results are below the form, so say so. */}
        {view.status !== "needs-players" ? (
          <a href="#chooser-results" className={styles.jump} onClick={jumpToResults}>
            {summaryOf(view, ui)} <span aria-hidden="true">↓</span>
          </a>
        ) : null}
      </form>

      <section id="chooser-results" className={styles.results} aria-labelledby="chooser-results-heading">
        <h2 id="chooser-results-heading" ref={resultsHeading} tabIndex={-1} className={styles.resultsTitle}>
          {view.status === "empty" ? ui.emptyTitle : ui.resultsTitle}
        </h2>

        {view.status === "needs-players" ? <p className={styles.placeholder}>{ui.needsPlayers}</p> : null}

        {view.status === "empty" ? (
          <div className={styles.empty}>
            <p className={styles.emptyMessage}>{view.message}</p>
            {view.relaxations.length ? (
              <>
                <p className={styles.emptyHelp}>{ui.emptyHelp}</p>
                <div className={styles.relaxations}>
                  {view.relaxations.map((r) => (
                    <button
                      key={`${r.question}-${r.value}`}
                      type="button"
                      className={styles.relax}
                      onClick={() => relax(r.question, r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {view.status === "ok" ? (
          <>
            <p className={styles.count}>
              {countOf(view, ui)}
              {orderOf(view, ui) ? ` ${orderOf(view, ui)}` : ""}
            </p>
            <ol className={styles.picks}>
              {view.picks.map((pick) => (
                <li key={pick.id}>
                  <ChooserPickCard pick={pick} ui={ui} idPrefix="chooser-pick" onGuideClick={onGuideClick} />
                </li>
              ))}
            </ol>
            {view.alsoFits.length ? (
              <p className={styles.also}>
                {ui.alsoFits}{" "}
                {view.alsoFits.map((f, i) => (
                  <span key={f.id}>
                    {i ? ", " : ""}
                    <Link href={f.href}>{f.name}</Link>
                  </span>
                ))}
              </p>
            ) : null}
          </>
        ) : null}

        {view.status !== "needs-players" && view.ruledOut.length ? (
          <details className={styles.ruledOut}>
            <summary>
              {ui.ruledOut} ({view.ruledOut.length})
            </summary>
            <ul>
              {view.ruledOut.map((r) => (
                <li key={r.id}>
                  <strong>{r.name}:</strong> {r.reasons.join(" ")}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      <span className="sr-only" role="status">
        {message}
      </span>
    </div>
  );
}
