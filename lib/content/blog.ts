/**
 * Blog content. Post bodies are a typed block union rather than markup, so
 * ProseBlocks can render them and adding a post is a data edit — never a new
 * page file. Populated by prompts 06 and 07.
 */

export type Block =
  | { kind: "p"; html: string }
  | { kind: "h2"; text: string; id: string }
  | { kind: "atAGlance"; items: { label: string; value: string }[] }
  | { kind: "callout"; title: string; html: string }
  | { kind: "quote"; text: string; cite?: string }
  | { kind: "steps"; items: { title: string; body: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "keyStat"; value: string; label: string }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "summary"; title: string; items: string[] };

export type Post = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  /** ISO date — drives <time>, JSON-LD publishedTime and the sitemap. */
  date: string;
  readMins: number;
  hero?: { src: string; alt: string };
  body: Block[];
};

export type BlogCategory = { id: string; label: string };

export const blogCategories: BlogCategory[] = [];

export const posts: Post[] = [];

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
