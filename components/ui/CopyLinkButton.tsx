"use client";

/**
 * Copies an entry's stable URL (https://www.golo.golf/glossary#<slug>,
 * /rules#<id>). The entry's name beside it is a plain self-link, so the
 * link is still there to copy without JavaScript or clipboard access; this
 * button is hidden without JavaScript (data-requires-js).
 *
 * The confirmation goes to the page's status region (AnnounceContext) when
 * there is one, otherwise to a region of the button's own.
 */

import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { useAnnounce } from "./announce";
import styles from "./CopyLinkButton.module.css";

type CopyLinkButtonProps = {
  url: string;
  /** The entry's name, for the accessible name and the announcements. */
  name: string;
  labels: { copy: string; copied: string; failed: string };
  /**
   * share_click params besides `channel` ({ term_id } on the glossary).
   * Without them the copy isn't reported.
   */
  share?: Record<string, string>;
};

export function CopyLinkButton({ url, name, labels, share }: CopyLinkButtonProps) {
  const pageAnnounce = useAnnounce();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const [message, setMessage] = useState("");

  const announce = useCallback(
    (text: string) => {
      if (pageAnnounce) return pageAnnounce(text);
      // Clear first, so the same message twice is announced twice.
      setMessage("");
      requestAnimationFrame(() => setMessage(text));
    },
    [pageAnnounce],
  );

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      announce(`Link to ${name} copied`);
      // The blog's share event, so every share lands in one report (#165).
      if (share) track("share_click", { channel: "copy", ...share });
    } catch {
      setState("failed");
      announce(`Couldn't copy. ${name} is itself a link you can copy instead.`);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={copy}
        aria-label={`${labels.copy}: ${name}`}
        data-requires-js=""
      >
        {state === "copied" ? labels.copied : state === "failed" ? labels.failed : labels.copy}
      </button>
      {pageAnnounce ? null : (
        <span className="sr-only" role="status">
          {message}
        </span>
      )}
    </>
  );
}
