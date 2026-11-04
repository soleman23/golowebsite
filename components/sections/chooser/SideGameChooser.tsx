"use client";

/**
 * The side-game chooser's form and live results (#224). The leaf that owns
 * state: the five answers, what a shared link failed to say, and the polite
 * messages. Rules and card assembly are lib/chooser; every word arrives as
 * props from lib/content/chooser.ts, built on the server, so the capability
 * registry isn't shipped to the browser.
 *
 * The URL is read, not followed. The form is server-rendered with nothing
 * chosen; on mount a shared link's answers are read before paint, and a Link
 * to this page with other answers is picked up by the Suspense'd sync leaf,
 * as FilterUrlSync does. Answering doesn't rewrite the address bar: GA4's
 * enhanced measurement counts every history change as a page view, so a
 * write per answer would add a page view per tap. "Copy link" builds the
 * link from the answers instead. If the reader changes anything while the
 * address bar still holds a link's answers, those are cleared once, so the
 * bar never shows answers the page no longer has. Parameters the chooser
 * doesn't own (utm_source) are kept.
 *
 * Announcements: a change the reader made is announced once its result has
 * stood a moment; arriving from a link isn't, since the page already shows it.
 */

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NO_ANSWERS, PLAYER_COUNTS, type Answers } from "@/lib/chooser/engine";
import {
  answersKey,
  hasChooserParams,
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

/** How long an answer set has to stand before chooser_result reports it. */
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
  const pathname = usePathname();
  const [answers, setAnswers] = useState<Answers>(NO_ANSWERS);
  const [dropped, setDropped] = useState<Question[]>([]);
  const [message, setMessage] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [failedLink, setFailedLink] = useState("");
  // Becomes true once the URL has been read; analytics waits for it.
  const [ready, setReady] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  // Whether the address bar still carries chooser answers from a link.
  const urlHasAnswers = useRef(false);
  // The query this component last wrote, so the sync leaf doesn't adopt it.
  const ownWrite = useRef<string | null>(null);
  // Set by a change the reader made, so the next result is announced.
  const announceNext = useRef(false);
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

  const adoptUrl = useCallback((search: string) => {
    const normalized = new URLSearchParams(search).toString();
    if (ownWrite.current !== null && normalized === ownWrite.current) return;
    urlHasAnswers.current = hasChooserParams(search);
    const parsed = parseAnswers(search);
    if (sameAnswers(parsed.answers, answersRef.current) && !parsed.dropped.length) return;
    setAnswers(parsed.answers);
    setDropped(parsed.dropped);
  }, []);

  // A shared link's answers, before the first paint after hydration.
  useLayoutEffect(() => {
    adoptUrl(window.location.search);
    setReady(true);
  }, [adoptUrl]);

  /** Once the reader changes something, a link's answers in the address bar are out of date: clear them, once. */
  const clearStaleUrl = useCallback(() => {
    if (!urlHasAnswers.current) return;
    urlHasAnswers.current = false;
    const query = serializeAnswers(NO_ANSWERS, window.location.search);
    ownWrite.current = new URLSearchParams(query).toString();
    window.history.replaceState(null, "", `${pathname}${query}${window.location.hash}`);
  }, [pathname]);

  // Announce a change the reader made, once its result has stood a moment.
  useEffect(() => {
    if (!announceNext.current) return;
    announceNext.current = false;
    announce(summaryOf(view, ui), RESULT_ANNOUNCE_MS);
  }, [announce, view, ui]);

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
      announceNext.current = true;
      setCopyState("idle");
      setDropped([]);
      clearStaleUrl();
      setAnswers((current) => ({ ...current, [question]: value }));
    },
    [clearStaleUrl],
  );

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setDropped([]);
    setCopyState("idle");
    clearStaleUrl();
    announce(ui.resetDone);
    formHeading.current?.focus();
  }, [announce, clearStaleUrl, ui.resetDone]);

  const relax = useCallback(
    <Q extends Question>(question: Q, value: Answers[Q]) => {
      answer(question, value);
      // The button that was pressed is about to go; the results are what
      // changed. After the commit that removes it.
      window.setTimeout(() => resultsHeading.current?.focus(), 0);
    },
    [answer],
  );

  const copyLink = useCallback(async () => {
    const link = `${window.location.origin}${pathname}${serializeAnswers(answersRef.current)}`;
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
  }, [announce, pathname, ui.copied, ui.copyFailed]);

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
          <a href="#chooser-results" className={styles.jump}>
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
