"use client";

/**
 * The /how-it-works centrepiece: six steps down the left, a phone pinned on
 * the right that swaps to each step's screen as it crosses the middle of the
 * viewport.
 *
 * Works without JS: the server render is step 1 active, every step at full
 * opacity, and the chips and ticks are plain #step-0N fragment links. With JS
 * those same links are intercepted so the step lands centred under the sticky
 * nav and focus moves to its heading.
 *
 * Below 900px there's no sticky column — each step carries its own phone.
 * Both layouts are in the markup and CSS picks one, so there's no width state
 * to hydrate and nothing to swap on resize.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { RoundStep } from "@/lib/content";
import styles from "./RoundTimeline.module.css";

type RoundTimelineProps = {
  steps: RoundStep[];
  /** One rendered TimelineScreen per step, same order. */
  screens: React.ReactNode[];
};

type StepState = "active" | "done" | "upcoming";

function stepState(i: number, active: number): StepState {
  if (i === active) return "active";
  return i < active ? "done" : "upcoming";
}

function Frame({ children, size }: { children: React.ReactNode; size: "wide" | "inline" }) {
  return (
    <div className={`${styles.frame} ${size === "inline" ? styles.frameInline : ""}`}>
      <div className={styles.screen}>
        {children}
        <span className={styles.island} />
      </div>
    </div>
  );
}

export function RoundTimeline({ steps, screens }: RoundTimelineProps) {
  const [active, setActive] = useState(0);
  // Off in the server render, so a no-JS reader never gets dimmed steps.
  const [enhanced, setEnhanced] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  // Active step = the one under the viewport's centre line. Observing a
  // zero-height band there means no layout reads on scroll.
  useEffect(() => {
    setEnhanced(true);
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jump = useCallback(
    (i: number) => {
      const step = document.getElementById(steps[i].id);
      if (!step) return;
      const nav = document.querySelector('nav[aria-label="Primary"]');
      const navH = nav?.getBoundingClientRect().height ?? 0;
      const rect = step.getBoundingClientRect();
      const visible = window.innerHeight - navH;
      // Centre the step in the space under the nav; a step taller than that
      // (narrow screens, with its phone inline) lands with its top in view.
      const offset =
        rect.height < visible
          ? rect.top + rect.height / 2 - (navH + visible / 2)
          : rect.top - navH - 16;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: Math.max(0, window.scrollY + offset),
        behavior: reduce ? "auto" : "smooth",
      });
      history.replaceState(null, "", `#${steps[i].id}`);
      setActive(i);
      document
        .getElementById(`${steps[i].id}-title`)
        ?.focus({ preventScroll: true });
    },
    [steps],
  );

  // The hero chips (server-rendered) and the ticks below are all #step-0N
  // links; one delegated listener handles every one of them.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#step-"]');
      if (!link) return;
      const i = steps.findIndex((s) => `#${s.id}` === link.getAttribute("href"));
      if (i < 0) return;
      e.preventDefault();
      jump(i);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [steps, jump]);

  const fill = `${(active / (steps.length - 1)) * 100}%`;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={styles.root} data-enhanced={enhanced ? "" : undefined}>
      <div className={styles.stepsCol}>
        <span className={styles.railTrack} aria-hidden="true" />
        <span
          className={styles.railFill}
          style={{ height: fill }}
          aria-hidden="true"
        />
        <ol className={styles.steps} ref={listRef}>
          {steps.map((step, i) => (
            <li
              key={step.id}
              id={step.id}
              data-step={i}
              data-state={stepState(i, active)}
              className={styles.step}
            >
              <article
                className={styles.article}
                aria-labelledby={`${step.id}-title`}
              >
                <span className={styles.node} aria-hidden="true">
                  {step.n}
                </span>
                <p className={styles.meta}>
                  <span className={styles.place}>{step.place}</span>
                  <span className={styles.time}>{step.time}</span>
                </p>
                <h3
                  id={`${step.id}-title`}
                  className={styles.title}
                  tabIndex={-1}
                >
                  {step.title}
                </h3>
                <p className={styles.body}>{step.body}</p>
                <ul className={styles.bullets}>
                  {step.bullets.map((b) => (
                    <li key={b} className={styles.bullet}>
                      <span className={styles.check} aria-hidden="true">
                        ✓
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {step.link ? (
                  <a href={step.link.href} className={styles.stepLink}>
                    {step.link.label}
                  </a>
                ) : null}
                <div className={styles.inlinePhone} aria-hidden="true">
                  <Frame size="inline">{screens[i]}</Frame>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.aside}>
        {/* Decorative: each step's copy carries the meaning. Only the frame
            is hidden, so the ticks below stay reachable. */}
        <div className={styles.phoneWrap} aria-hidden="true">
          <span className={styles.halo} />
          <Frame size="wide">
            {screens.map((screen, i) => (
              <div
                key={steps[i].id}
                className={styles.screenLayer}
                data-active={i === active ? "" : undefined}
              >
                {screen}
              </div>
            ))}
          </Frame>
        </div>
        <div className={styles.progress}>
          <p className={styles.progressLabel} aria-hidden="true">
            <span className={styles.progressCount}>
              {pad(active + 1)} / {pad(steps.length)}
            </span>
            <span className={styles.progressName}>{steps[active].short}</span>
          </p>
          <nav aria-label="Round steps">
            <ul className={styles.ticks}>
              {steps.map((step, i) => (
                <li key={step.id}>
                  <a
                    href={`#${step.id}`}
                    className={styles.tick}
                    data-state={stepState(i, active)}
                    aria-label={`Step ${i + 1}: ${step.short}`}
                    aria-current={i === active ? "step" : undefined}
                  >
                    <span className={styles.tickBar} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
