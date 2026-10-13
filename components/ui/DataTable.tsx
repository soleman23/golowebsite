/**
 * A plain data table from typed content: a header row and rows of text. Blog
 * posts and the legal pages both render their `table` blocks with this, so a
 * fix to how tables look or behave is made once.
 *
 * Server component. Its one client leaf is ScrollRegion, which only measures
 * whether the table overflows its column.
 */

import { ScrollRegion } from "@/components/ui/ScrollRegion";
import styles from "./DataTable.module.css";

export type TableData = { head: string[]; rows: string[][] };

type DataTableProps = {
  table: TableData;
  /** On the scroll box: the caller's spacing around the table. */
  className?: string;
  /** Smaller type and tighter cells, for a dense page like the legal docs. */
  compact?: boolean;
  /**
   * Lets body cells wrap. Off by default: short figures read best on one
   * line, and a table too wide for its column scrolls sideways instead.
   */
  wrap?: boolean;
};

export function DataTable({ table, className, compact = false, wrap = false }: DataTableProps) {
  const tableClass = [styles.table, compact ? styles.compact : styles.comfortable, wrap && styles.wrap]
    .filter(Boolean)
    .join(" ");

  return (
    <ScrollRegion
      className={className ? `${styles.scroll} ${className}` : styles.scroll}
      label={`Scrollable table: ${table.head.join(", ")}`}
    >
      <table className={tableClass}>
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}
