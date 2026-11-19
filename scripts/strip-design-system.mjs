// Writes a public copy of the design system build: comments and package headers removed, should brand only.
//   node scripts/strip-design-system.mjs <dist> <out>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BRAND = "should";
const [from, to] = process.argv.slice(2);
const read = (f) => readFileSync(join(from, f), "utf8");
const blockComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");
const lineComments = (s) => s.split("\n").filter((l) => !/^\s*\/\/(?!\/)/.test(l) || l.startsWith("#!")).join("\n");
const tidy = (s) => s.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trimStart();

// Brand blocks look like "/* Brand: … */\n<selector> {\n…\n}". Keep this site's, on :root too.
const oneBrand = (css) => css.replace(/\/\* Brand: [^*]*\*\/\n([^{]*)\{[^}]*\}\n?/g, (block, sel) =>
  sel.includes(`"${BRAND}"`) ? block.replace(sel, `:root,\n[data-brand="${BRAND}"] `) : "");

const out = {
  "design-system.css": tidy(blockComments(oneBrand(read("design-system.css")))),
  "i18n.js": tidy(lineComments(blockComments(read("i18n.js")))),
  "check-i18n.mjs": tidy(lineComments(blockComments(read("check-i18n.mjs")))),
};
const leak = new RegExp(`@[\\w-]+\\/design-system|data-brand="(?!${BRAND}")`);
for (const [f, body] of Object.entries(out)) {
  if (leak.test(body)) throw new Error(`${f}: still has a package header or another brand`);
  writeFileSync(join(to, f), body);
}
console.log(`design system copied (stripped, ${BRAND} only) into ${to}`);
