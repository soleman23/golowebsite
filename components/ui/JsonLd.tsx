/**
 * Renders one structured-data block. Server component — the script tag ships
 * in the HTML, which is the only place a crawler will look for it.
 *
 * The escaping matters: JSON.stringify happily emits the literal characters
 * `</script>` if a headline or an answer ever contains them, which closes the
 * tag early and spills the rest of the graph into the document as text. Copy
 * on this site is hand-written, so it hasn't happened — but the blog is a data
 * file anyone can add a post to, so the guard belongs here rather than in a
 * reviewer's memory. Every "<" goes out as a unicode escape, which is still
 * valid JSON and parses back to the same string.
 */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
