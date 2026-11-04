"use client";

/**
 * The side-game chooser's form and live results (#224). The leaf that owns
 * state: the five answers, what a shared link failed to say, and the polite
 * messages. Rules and card assembly are lib/chooser; every word arrives as
 * props from lib/content/chooser.ts, built on the server, so the capability
 * registry isn't shipped to the browser.
 *
 * The form is server-rendered with nothing chosen. On mount the URL's answers
 * (a shared link) are read before paint, and from then on every change is
 * written back with replaceState: the address bar always holds a link to
 * these answers, and answering doesn't fill the history. Parameters the
 * chooser doesn't own (utm_source) are kept. A Link to this page with other
 * answers is picked up by the Suspense'd sync leaf, as FilterUrlSync does.
 *
 * Announcements: a change the reader made is announced once it renders
 * ("3 games fit. First: Scramble."); arriving from a link isn't, since the
 * page already shows it.
 */

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NO_ANSWERS, PLAYER_COUNTS, type Answers } from "@/lib/chooser/engine";
import { answersKey, parseAnswers, sameAnswers, serializeAnswers, type Question } from "@/lib/chooser/url";
import { chooserView, type ChooserCopy, type ChooserView, type PickView } from "@/lib/chooser/view";
import type { chooserQuestionNames, chooserQuestions, chooserUi } from "@/lib/content";
import { track } from "@/lib/analytics";
import { ChooserPickCard } from "./ChooserPickCard";
import styles from "./SideGameChooser.module.css";

type SideGameChooserProps = {
  copy: ChooserCopy;
  questions: typeof chooserQuestions;
  questionNames: typeof chooserQuestionNames;
  ui: typeof chooserUi;
};

/** How long an answer set has to stand before chooser_result reports it. */
const SETTLE_MS = 1500;
/** Between clearing the live region and filling it. */
const ANNOUNCE_MS = 60;

function listOf(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

/** "3 games fit these answers." Every format that fits, the three picks and the rest. */
function countOf(view: Extract<ChooserView, { status: "ok" }>, ui: SideGameChooserProps["ui"]): string {
  const count = view.picks.length + view.alsoFits.length;
  return count === 1 ? ui.fitsOne : ui.fitsMany.replace("{n}", String(count));
}

function summaryOf(view: ChooserView, ui: SideGameChooserProps["ui"]): string {
  if (view.status === "needs-players") return ui.needsPlayers;
  if (view.status === "empty") return `${ui.emptyTitle}. ${view.message}`;
  return `${countOf(view, ui)} ${listOf(view.picks.map((p) => p.name))}.`;
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
  // Becomes true once the URL has been read; until then nothing is written back.
  const [ready, setReady] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  // Set by a change the reader made, so the next render is announced.
  const announceNext = useRef(false);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const formHeading = useRef<HTMLHeadingElement>(null);
  const reported = useRef(new Set<string>());

  const view = useMemo(() => chooserView(answers, copy), [answers, copy]);

  /** Polite, one-off. Cleared first, so the same text twice is read twice. */
  const announce = useCallback((text: string) => {
    setMessage("");
    window.setTimeout(() => setMessage(text), ANNOUNCE_MS);
  }, []);

  const adoptUrl = useCallback((search: string) => {
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

  // The address bar follows the answers. Dropped parameters go with the first write.
  useEffect(() => {
    if (!ready) return;
    const query = serializeAnswers(answers, window.location.search);
    if (query !== window.location.search) {
      window.history.replaceState(null, "", `${pathname}${query}${window.location.hash}`);
    }
  }, [answers, pathname, ready]);

  // Announce a change the reader made, once its result has rendered.
  useEffect(() => {
    if (!announceNext.current) return;
    announceNext.current = false;
    // A timeout, not a frame, in announce(): frames don't run in a
    // background tab.
    announce(summaryOf(view, ui));
  }, [announce, view, ui]);

  // "Link copied" goes back to the button's label, as the glossary's does. A
  // failure note stays until the next answer, since it says where the link is.
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

  const answer = useCallback(<Q extends Question>(question: Q, value: Answers[Q]) => {
    announceNext.current = true;
    setCopyState("idle");
    setDropped([]);
    setAnswers((current) => ({ ...current, [question]: value }));
  }, []);

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setDropped([]);
    setCopyState("idle");
    announce(ui.resetDone);
    formHeading.current?.focus();
  }, [announce, ui.resetDone]);

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
      setCopyState("failed");
      announce(ui.copyFailed);
    }
  }, [announce, pathname, ui.copied, ui.copyFailed]);

  const onGuideClick = useCallback((pick: PickView) => {
    track("chooser_guide_click", { format: pick.id, rank: pick.rank });
  }, []);

  const answered = Object.values(answers).some((v) => v !== null);
  const droppedText = dropped.length
    ? ui.dropped
        .replace("{questions}", listOf(dropped.map((q) => questionNames[q])))
        .replace("{verb}", dropped.length === 1 ? "was" : "were")
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
        {copyState === "failed" ? <p className={styles.hint}>{ui.copyFailed}</p> : null}

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
              {view.alsoFits.length ? ` ${ui.showingTop}` : view.picks.length > 1 ? ` ${ui.inOrder}` : ""}
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
