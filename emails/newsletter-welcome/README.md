# Newsletter welcome email

Source for the GoLo newsletter welcome email, sent through Hostinger Reach.
Not a page: nothing here is built or served. The images it loads are served
from `public/email/` at `https://www.golo.golf/email/<filename>`.

| File | What it is |
|---|---|
| `golo-newsletter-welcome.html` | The production HTML to import into Reach. Byte-identical to the owner-supplied design handoff (2026-10-21). |
| `golo-newsletter-welcome.txt` | The plain-text alternative. Its first two lines (Subject, Preheader) are notes for the person setting up Reach, not body text. |

**Subject:** Welcome to the GoLo newsletter

## Editing rules

- The HTML is hand-built for email clients: table layout, inline styles,
  `<!--[if mso]>` blocks and VML for Outlook's hero and button. Edit copy and
  links in place only. Don't reformat, prettify, or move styles into `<style>`.
- `public/email/*` filenames are referenced verbatim by the HTML. To change an
  image, add it under a **new** filename and update the HTML; don't overwrite
  a file a sent email may still load.
- `{{REACH_UNSUBSCRIBE_URL}}` (once in the HTML footer, once in the TXT) is a
  placeholder. Reach's own unsubscribe merge tag replaces it in the copy that
  lives in Reach; the repository keeps the placeholder.
- Keep the HTML and TXT saying the same thing.

## Status

Not live. The welcome email is a proposal: the active production behaviour is
still "no welcome automation" (soleman23/golo#791) until the owner approves
and enables it. Copy flagged for review before enabling is tracked on the
linked golo issue.
