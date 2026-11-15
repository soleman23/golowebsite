// ESLint 9 flat config. eslint-config-next 15 still ships eslintrc-style
// presets, so FlatCompat wraps them; the rule set is the same one the old
// .eslintrc.json ({ "extends": "next/core-web-vitals" }) produced.
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "public/**"] },
  // With a flat config, `next lint` drops its extensions list and ESLint 9
  // would skip .jsx/.mts/.cts. Name every extension ESLint 8 covered, plus
  // the module/commonjs TypeScript ones.
  { files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"] },
  ...compat.extends("next/core-web-vitals"),
  // ESLint 9 turns this on by default; 8 had it off. Keep 8's behaviour so
  // the upgrade doesn't change lint output.
  { linterOptions: { reportUnusedDisableDirectives: "off" } },
];

export default eslintConfig;
