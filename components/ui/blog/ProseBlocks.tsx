/**
 * Renders a post body from its typed blocks. Every kind in the Block union has
 * a case here — post prose never lives in a page file.
 *
 * Server component: nothing in a post body is interactive.
 */

import Image from "next/image";
import type { Block } from "@/lib/content";
import styles from "./ProseBlocks.module.css";

export function ProseBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, i) => (
        <ProseBlock key={`${block.kind}-${i}`} block={block} />
      ))}
    </div>
  );
}

function ProseBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "p":
      // dangerouslySetInnerHTML because copy carries inline <strong>/<em>/<a>.
      // The source is our own typed content module, never user input.
      return (
        <p
          className={styles.p}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "h2":
      return (
        <h2 id={block.id} className={styles.h2}>
          {block.text}
        </h2>
      );

    case "atAGlance":
      return (
        <aside className={styles.glance}>
          {block.title ? (
            <p className={styles.glanceTitle}>{block.title}</p>
          ) : null}
          <dl className={styles.glanceGrid}>
            {block.items.map((item) => (
              <div key={item.label} className={styles.glanceItem}>
                <dt className={styles.glanceLabel}>{item.label}</dt>
                <dd className={styles.glanceValue}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      );

    case "callout":
      return (
        <aside className={styles.callout}>
          <span className={styles.calloutMark} aria-hidden="true">
            !
          </span>
          <div>
            <p className={styles.calloutTitle}>{block.title}</p>
            <p
              className={styles.calloutBody}
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          </div>
        </aside>
      );

    case "quote":
      return (
        <figure className={styles.quoteWrap}>
          <blockquote className={styles.quote}>{block.text}</blockquote>
          {block.cite ? (
            <figcaption className={styles.quoteCite}>{block.cite}</figcaption>
          ) : null}
        </figure>
      );

    case "steps":
      return (
        <ol className={styles.steps}>
          {block.items.map((item, i) => (
            <li key={item.id ?? item.title} id={item.id} className={styles.step}>
              <span className={styles.stepNum} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.stepBody}>
                {item.tag ? <span className={styles.stepTag}>{item.tag}</span> : null}
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepText}>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "keyStat":
      return (
        <aside className={styles.keyStat}>
          <span className={styles.keyStatValue}>{block.value}</span>
          <span className={styles.keyStatLabel}>{block.label}</span>
        </aside>
      );

    case "image":
      return (
        <figure className={styles.figure}>
          <span className={styles.figureFrame}>
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(min-width: 820px) 760px, 92vw"
              className={styles.figureImage}
              style={{ objectPosition: block.position }}
            />
          </span>
          {block.caption ? (
            <figcaption className={styles.caption}>{block.caption}</figcaption>
          ) : null}
        </figure>
      );

    case "cardGrid":
      return (
        <aside className={styles.cardGrid}>
          {block.title ? <p className={styles.cardGridTitle}>{block.title}</p> : null}
          <div className={styles.cardGridItems}>
            {block.items.map((item) => (
              <section key={item.title} className={styles.observationCard}>
                {item.eyebrow ? <p className={styles.cardEyebrow}>{item.eyebrow}</p> : null}
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </section>
            ))}
          </div>
        </aside>
      );

    case "summary":
      return (
        <aside className={styles.summary}>
          <p className={styles.summaryTitle}>{block.title}</p>
          <ul className={styles.summaryList}>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      );

    default:
      return assertNever(block);
  }
}

/**
 * A block kind with no case above. Throwing in development turns a typo into
 * an immediate, obvious failure; in production a missing renderer shouldn't
 * take the whole page down, so the block is skipped.
 */
function assertNever(block: never): null {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      `ProseBlocks: no renderer for block kind "${(block as Block).kind}"`,
    );
  }
  return null;
}
