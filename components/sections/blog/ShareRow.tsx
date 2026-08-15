"use client";

/**
 * Share controls under the body. Copy-link writes the canonical URL — not
 * whatever query string or hash the reader happens to be sitting on — and
 * confirms in the button itself. No toast library for one line of feedback.
 */

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";
import { Icon } from "@/components/ui/Icon";
import styles from "./ShareRow.module.css";

type ShareRowProps = {
  slug: string;
  title: string;
};

export function ShareRow({ slug, title }: ShareRowProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // A pending "Link copied" reset must not fire after the component is gone.
  useEffect(() => () => clearTimeout(timer.current), []);

  const url = `${siteConfig.url}/blog/${slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
      track("share_click", { post: slug, channel: "copy" });
    } catch {
      // Clipboard denied (insecure origin, or the user said no). Say nothing
      // rather than claiming a copy that didn't happen.
      setCopied(false);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      channel: "sms",
      label: "Text it",
      icon: "chat" as const,
      href: `sms:?&body=${encodedTitle}%20${encodedUrl}`,
    },
    {
      channel: "x",
      label: "Post on X",
      icon: "share" as const,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      channel: "email",
      label: "Email it",
      icon: "mail" as const,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="share-heading">
      <div className={styles.inner}>
        <h2 id="share-heading" className={styles.label}>
          SHARE THIS
        </h2>

        <div className={styles.row}>
          <button type="button" className={styles.button} onClick={copy}>
            <Icon name={copied ? "check" : "link"} size={16} />
            {copied ? "Link copied" : "Copy link"}
          </button>

          {links.map((link) => (
            <a
              key={link.channel}
              href={link.href}
              className={styles.button}
              target={link.channel === "x" ? "_blank" : undefined}
              rel={link.channel === "x" ? "noopener noreferrer" : undefined}
              onClick={() =>
                track("share_click", { post: slug, channel: link.channel })
              }
            >
              <Icon name={link.icon} size={16} />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
