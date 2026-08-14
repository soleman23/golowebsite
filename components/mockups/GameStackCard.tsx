/**
 * /features block 2: the game library — six tiles, each a game and its
 * one-line rule. Decorative marketing content.
 */

import { gameTiles } from "@/lib/mockData";
import styles from "./mockups.module.css";

export function GameStackCard() {
  return (
    <div
      className={styles.gameTiles}
      role="img"
      aria-label="The GoLo game library: Nassau, skins, Wolf, stroke purse, Bingo Bango Bongo and the junk board, each with its scoring rule."
    >
      {gameTiles.map((tile) => (
        <div
          key={tile.name}
          className={`${styles.gameTile} ${tile.highlight ? styles.gameTileLime : ""}`}
          aria-hidden="true"
        >
          <span className={styles.gameTileName}>{tile.name}</span>
          <span className={styles.gameTileRule}>{tile.rule}</span>
        </div>
      ))}
    </div>
  );
}
