"use client";

/**
 * Copies a term's stable URL (https://www.golo.golf/glossary#<slug>). The
 * term name beside it is a plain self-link, so the link is still there to
 * copy without JavaScript or clipboard access; this button is hidden
 * without JavaScript (data-requires-js).
 */

import { useEffect, useState } from "react";
import { useGlossary } from "./GlossaryProvider";
import styles from "./CopyLinkButton.module.css";

type CopyLinkButtonProps = {
  url: string;
  term: string;
  labels: { copy: string; copied: string; failed: string };
};

export function CopyLinkButton({ url, term, labels }: CopyLinkButtonProps) {
  const { announce } = useGlossary();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      announce(`Link to ${term} copied`);
      // #165: the share event fires here.
    } catch {
      setState("failed");
      announce(`Couldn't copy. The term name ${term} is a link you can copy instead.`);
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={copy}
      aria-label={`${labels.copy}: ${term}`}
      data-requires-js=""
    >
      {state === "copied" ? labels.copied : state === "failed" ? labels.failed : labels.copy}
    </button>
  );
}
