# Newsletter welcome email

Source for the GoLo newsletter welcome email, sent through Hostinger Reach.
Not a page: nothing here is built or served. The images it loads are served
from `public/email/` at `https://www.golo.golf/email/<filename>`.

| File | What it is |
|---|---|
| `golo-newsletter-welcome.html` | The supplied design, byte-identical to the owner's handoff (2026-10-21). The reference; Reach can't send it as is (below). |
| `golo-newsletter-welcome.reach.html` | The **Reach edition**: same copy and links, rebuilt to survive Reach's HTML "fixing". The file to import into Reach. |
| `golo-newsletter-welcome.txt` | The plain-text version. Reach sends HTML only, so this is a reference. Its first two lines (Subject, Preheader) are setup notes, not body text. |

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
- Keep both HTML files and the TXT saying the same thing.

## Why there's a Reach edition

Reach rewrites custom HTML on every import and save, and not always the same way. It strips `<style>` (and
so the media queries), every `class`, background images, `<!--[if mso]>`/VML,
`height` attributes and the hidden preheader, and it **rewrites `<div>`s into
table cells** (inline-block "hybrid" columns end up side by side at any width).
Tables, inline styles and percentage widths survive. So the Reach edition is
tables only:

- the hero photo is an `<img>` (`golo-nl-hero-banner-1200x560.jpg`: the top of
  the hero, its bottom edge faded into `#0f2016`) above the text;
- each card and photo row is a two-cell table in **percentages**, the photo a
  tall crop (`golo-nl-*-tall-<w>x<h>.jpg`) written as
  `width:100%;max-width:<w>px;height:auto`. That's the form Reach's fixer turns
  images into anyway; pixel cell widths are not safe, because on some saves
  the fixer converts them to percentages and the photos shrink on a phone.
  Each crop's height matches its copy in Gmail on an iPhone, where the email
  is about 342px wide. Wider screens give the copy more room, so the photo is
  taller there. If the copy changes, re-measure and re-crop.
- Track / Bet / Settle is a stacked list; the games grid stays 3 across;
- the preheader is set in Reach's pre-header field, and unsubscribe is Reach's
  native `{{unsubscribe-link}}` merge tag.

Outlook for Windows loses its VML hero and button either way; the Reach
edition hasn't been checked there.

`public/email/golo-nl-logo-lockup-440.png` is the approved lockup ("Track it.
Score it. Settle it.") at the supplied logo's size, ready to replace
`golo-logo-440.png`, whose tagline still says "Bet it". Nothing references it
until the owner chooses it.

## Status

Not live. The welcome email is a proposal: the active production behaviour is
still "no welcome automation" (soleman23/golo#791) until the owner approves
and enables it. Copy flagged for review before enabling is tracked on the
linked golo issue.
