/**
 * The claim rules behind scripts/check-content.mjs §1, as functions, so the
 * content check runs them on the site's files and scripts/test-glossary.mjs
 * runs them on fixtures. Moved here unchanged from check-content.mjs, plus
 * one addition: in an education file, a string that is the value of a
 * product field (PRODUCT_FIELDS) is always checked in full, whether or not it
 * names GoLo. That's how a glossary term's `goloNote` gets the full check
 * while its golf definition only counts when it's about GoLo.
 */

/**
 * Comments blanked out, line numbers kept. A small scanner rather than a
 * regex, so a trailing `// note` goes but the "//" inside a URL string stays.
 * In .tsx files an apostrophe in JSX text ("don't") isn't a string quote, so
 * only " and ` open strings there; the project writes strings with "" anyway.
 */
export function scan(source, file) {
  const quotes = file.endsWith(".tsx") ? "\"`" : "\"'`";
  let out = "";
  let i = 0;
  let quote = null;
  let opened = 0;
  /** [start, end) of each string literal's contents, quotes excluded. */
  const literals = [];
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") {
        out += next ?? "";
        i += 2;
        continue;
      }
      if (c === quote || (c === "\n" && quote !== "`")) {
        literals.push([opened, i]);
        quote = null;
      }
      i += 1;
    } else if (c === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") {
        out += " ";
        i += 1;
      }
    } else if (c === "/" && next === "*") {
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? source.length : end + 2;
      out += source.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop;
    } else {
      if (quotes.includes(c)) {
        quote = c;
        opened = i + 1;
      }
      out += c;
      i += 1;
    }
  }
  return { text: out, literals };
}

export const stripComments = (source, file) => scan(source, file).text;

/** The literal span holding `index`, if any. */
export function literalAt(literals, index) {
  let lo = 0;
  let hi = literals.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [start, end] = literals[mid];
    if (index < start) hi = mid - 1;
    else if (index >= end) lo = mid + 1;
    else return literals[mid];
  }
  return undefined;
}

export const lineAt = (text, index) => text.slice(0, index).split("\n").length;

/**
 * The sentence around a match: bounded by . ! ? quotes or newlines, and by a
 * colon or a comma only for negations (see denied()).
 */
export function sentenceAt(text, index, length) {
  const stops = /[.!?"`\n]/;
  let start = index;
  while (start > 0 && !stops.test(text[start - 1])) start -= 1;
  let end = index + length;
  while (end < text.length && !stops.test(text[end])) end += 1;
  return { text: text.slice(start, end), offset: index - start };
}

export const ABOUT_GOLO = /\bGoLo\b|\bthe app\b/i;

/**
 * A status anywhere in the phrase's clause says it isn't working. A
 * capability's own `statusPhrases` add to it for that capability only:
 * "coming soon" excuses the iPhone app, which is built and waiting on the
 * store, but never a planned or cut feature ("auto-presses coming soon").
 */
export const STATUS =
  /\b(not built|isn['’]t built|aren['’]t built|on the list|not in the app|isn['’]t in the app|aren['’]t in the app|in testing|not yet|we cut|was cut|were cut|been cut|cut from|(does not|doesn['’]t) track)\b/i;

export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const statusFor = (cap) =>
  cap.statusPhrases?.length
    ? new RegExp(
        STATUS.source.replace(/\)\\b$/, `|${cap.statusPhrases.map(escapeRegex).join("|")})\\b`),
        "i",
      )
    : STATUS;

/** A negation counts only before the phrase, in the same clause. */
export const NEGATION =
  /\b(no|not|never|without|nor|doesn['’]t|does not|don['’]t|do not|isn['’]t|aren['’]t|won['’]t|can['’]t|cannot)\b/gi;
/**
 * Where a negation's reach ends: any comma or colon too, so "no paper, no
 * pencil, GoLo works offline" isn't excused. A denied list after a colon
 * ("What it doesn't do today: a, b, c") carries a claim-ok marker instead.
 */
export const NEGATION_BREAK = /\b(?:and|but|so|while|though|although)\b|[;—–,:]/gi;
/** Where a status's reach ends. */
export const STATUS_BREAK = /\bbut\b|[;—–]/gi;

/** The stretch of `sentence` around [offset, offset + length) between breaks. */
export function clauseAt(sentence, offset, length, breaks) {
  let start = 0;
  let end = sentence.length;
  for (const m of sentence.matchAll(breaks)) {
    if (m.index + m[0].length <= offset) start = m.index + m[0].length;
    else if (m.index >= offset + length) {
      end = m.index;
      break;
    }
  }
  return { text: sentence.slice(start, end), offset: offset - start };
}

export function denied(sentence, offset, length, status = STATUS) {
  // "GoLo works offline; trip mode is not built" denies only trip mode, and
  // "no setup required and GPS yardages" doesn't deny the yardages.
  if (status.test(clauseAt(sentence, offset, length, STATUS_BREAK).text)) {
    return true;
  }
  const clause = clauseAt(sentence, offset, length, NEGATION_BREAK);
  NEGATION.lastIndex = 0;
  return NEGATION.test(clause.text.slice(0, clause.offset));
}

export function phraseRegex(phrase) {
  const escaped = phrase
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    // A phrase wrapped across lines (Prettier-wrapped JSX, a long template).
    .replace(/ /g, "\\s+");
  // Word edges only where the phrase starts or ends with a word character,
  // and a plural counts: "auto-presses", "Nassau presses", "allowances".
  const lead = /^\w/.test(phrase) ? "\\b" : "";
  const tail = /\w$/.test(phrase) ? "(?:e?s)?\\b" : "";
  return new RegExp(`${lead}${escaped}${tail}`, "gi");
}

/**
 * Fields whose string value is always about GoLo, in an education file too:
 * a glossary term's note on what GoLo does.
 */
export const PRODUCT_FIELDS = new Set(["goloNote"]);

/**
 * The object key a string literal is the value of, following `+` back
 * through a concatenation ("…" +\n "…"), or null if it isn't a key's value.
 */
export function fieldOf(text, literals, literal) {
  let quote = literal[0] - 1;
  for (;;) {
    let j = quote - 1;
    while (j >= 0 && /\s/.test(text[j])) j -= 1;
    if (text[j] === "+") {
      j -= 1;
      while (j >= 0 && /\s/.test(text[j])) j -= 1;
      const previous = literals.find(([, end]) => end === j);
      if (!previous) return null;
      quote = previous[0] - 1;
      continue;
    }
    const key = text.slice(Math.max(0, j - 80), j + 1).match(/(\w+)\s*:$/);
    return key ? key[1] : null;
  }
}

/**
 * Claims and overclaims in one file's source (check-content.mjs §1).
 * `education`: only strings about GoLo, or product fields, count as claims.
 * Returns { line, message } for each problem.
 */
export function claimProblems(file, raw, { notLive, overclaimed, education }) {
  const problems = [];
  const report = (line, message) => problems.push({ line, message });
  const { text, literals } = scan(raw, file);
  const rawLines = raw.split("\n");
  // Copy in a .ts file lives in string literals; anything else is code. A
  // .tsx file also has JSX text, which isn't a literal, so there only the
  // obvious code shapes are skipped: `styles.quota`, `quota: …`, `quota(…)`.
  const isCode = (index, length) =>
    file.endsWith(".tsx")
      ? text[index - 1] === "." || /^\s*[:(=]/.test(text.slice(index + length))
      : !literalAt(literals, index);

  for (const cap of notLive) {
    for (const phrase of cap.claimPhrases) {
      for (const m of text.matchAll(phraseRegex(phrase))) {
        const line = lineAt(text, m.index);
        if (
          rawLines[line - 1]?.includes("claim-ok:") ||
          rawLines[line - 2]?.includes("claim-ok:")
        ) {
          continue;
        }
        if (isCode(m.index, m[0].length)) continue;
        if (education) {
          const literal = literalAt(literals, m.index);
          const [start, end] = literal ?? [0, 0];
          const product = literal && PRODUCT_FIELDS.has(fieldOf(text, literals, literal));
          if (!product && !ABOUT_GOLO.test(text.slice(start, end))) continue;
        }
        const { text: sentence, offset } = sentenceAt(
          text,
          m.index,
          m[0].length,
        );
        if (denied(sentence, offset, m[0].length, statusFor(cap))) continue;
        report(
          line,
          `"${m[0]}" presents ${cap.id} (${cap.status}) as working: "${sentence.trim().slice(0, 140)}"`,
        );
      }
    }
  }

  // Overclaims count in blog posts and guides too: no golf advice says
  // "fewest payments" without meaning the app. Only claim-ok excuses one:
  // the clause-level denial logic is too loose for this ("don't send ten
  // Venmos when GoLo finds the fewest payments" reads as a denial).
  for (const cap of overclaimed) {
    for (const phrase of cap.overclaims) {
      for (const m of text.matchAll(phraseRegex(phrase))) {
        const line = lineAt(text, m.index);
        if (
          rawLines[line - 1]?.includes("claim-ok:") ||
          rawLines[line - 2]?.includes("claim-ok:")
        ) {
          continue;
        }
        if (isCode(m.index, m[0].length)) continue;
        const { text: sentence } = sentenceAt(text, m.index, m[0].length);
        report(
          line,
          `"${m[0]}" overstates ${cap.id}: "${sentence.trim().slice(0, 140)}"`,
        );
      }
    }
  }
  return problems;
}
