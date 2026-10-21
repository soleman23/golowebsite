/**
 * Lets a plain Node (>= 24) script import the app's lib/*.ts modules, as
 * scripts/test-attribution.mjs does inline: Node strips the types, and this
 * maps the "@/" alias and extensionless "./sibling" imports to the .ts file.
 *
 * "server-only" (a Next.js build-time guard, resolved by Next and not
 * installed as a package) becomes an empty module, so the Reach scripts can
 * load lib/reach.ts outside Next.
 *
 * Import it first: `import "./register-ts.mjs";`
 */

import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const rootUrl = new URL("..", import.meta.url);
const EMPTY_MODULE = "data:text/javascript,export%20%7B%7D%3B";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") return nextResolve(EMPTY_MODULE, context);
    const base = specifier.startsWith("@/")
      ? new URL(specifier.slice(2), rootUrl)
      : specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)
        ? new URL(specifier, context.parentURL)
        : null;
    if (base) {
      for (const ext of [".ts", "/index.ts"]) {
        const url = new URL(base.href + ext);
        if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
