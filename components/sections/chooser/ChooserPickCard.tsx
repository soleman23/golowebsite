/**
 * One recommended format: rank, name, why it fits, the trade-off, the house
 * rules to agree and, kept apart, what GoLo scores. Plain markup with no
 * state, so the live chooser and the server-rendered worked example share it.
 */

import Link from "next/link";
import type { Line, PickView } from "@/lib/chooser/view";
import type { chooserUi } from "@/lib/content";
import styles from "./ChooserPickCard.module.css";

type Ui = typeof chooserUi;

type ChooserPickCardProps = {
  pick: PickView;
  ui: Ui;
  /** Heading level for the format name. */
  level?: 3 | 4;
  /** Keeps heading ids unique when the live results and the worked example show the same format. */
  idPrefix: string;
  /** The live chooser reports guide clicks; the static example doesn't. */
  onGuideClick?: (pick: PickView) => void;
};

function LineText({ line }: { line: Line }) {
  return (
    <>
      {line.text}
      {line.links?.map((link, i) => (
        <span key={link.href}>
          {i ? <span aria-hidden="true"> · </span> : " "}
          <Link href={link.href} className={styles.inlineLink}>
            {link.label}
          </Link>
        </span>
      ))}
    </>
  );
}

export function ChooserPickCard({ pick, ui, level = 3, idPrefix, onGuideClick }: ChooserPickCardProps) {
  const Heading = level === 3 ? "h3" : "h4";
  const Label = level === 3 ? "h4" : "h5";
  const report = onGuideClick ? () => onGuideClick(pick) : undefined;

  return (
    <article className={styles.card} aria-labelledby={`${idPrefix}-${pick.id}`}>
      <div className={styles.head}>
        <span className={styles.rank} aria-hidden="true">
          {pick.rank}
        </span>
        <div>
          <Heading id={`${idPrefix}-${pick.id}`} className={styles.name}>
            <span className="sr-only">{ui.rankLabel.replace("{n}", String(pick.rank))}: </span>
            {pick.name}
          </Heading>
          <p className={styles.summary}>{pick.summary}</p>
        </div>
      </div>

      <div className={styles.body}>
        {pick.why.length ? (
          <section className={styles.block}>
            <Label className={styles.label}>{ui.why}</Label>
            <ul className={styles.list}>
              {pick.why.map((line) => (
                <li key={line.text}>
                  <LineText line={line} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {pick.tradeoff ? (
          <section className={styles.block}>
            <Label className={styles.label}>{ui.tradeoff}</Label>
            <p className={styles.text}>
              <LineText line={pick.tradeoff} />
            </p>
          </section>
        ) : null}

        <section className={styles.block}>
          <Label className={styles.label}>{ui.agree}</Label>
          <ul className={styles.list}>
            {pick.agree.map((line) => (
              <li key={line.text}>
                <LineText line={line} />
              </li>
            ))}
          </ul>
          <p className={styles.note}>{ui.agreeNote}</p>
        </section>

        <section className={`${styles.block} ${styles.golo}`}>
          <Label className={styles.label}>{ui.golo}</Label>
          <p className={pick.golo.scored ? styles.verdictYes : styles.verdictNo}>{pick.golo.label}</p>
          {pick.golo.lines.map((line) => (
            <p key={line.text} className={styles.goloLine}>
              {line.text}
            </p>
          ))}
        </section>
      </div>

      <div className={styles.links}>
        <Link href={pick.guide.href} className={styles.guide} onClick={report}>
          {pick.guide.label} →
        </Link>
        {pick.more ? (
          <Link href={pick.more.href} className={styles.more} onClick={report}>
            {pick.more.label} →
          </Link>
        ) : null}
      </div>
    </article>
  );
}
