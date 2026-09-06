#!/usr/bin/env node
// Product / Category validation. READ-ONLY: reads, analyzes, reports, exits 0/1.
// Data files are loaded via typescript transpile + vm (no runtime .ts import,
// so the script works on any Node version without type stripping).
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const JSON_MODE = process.argv.includes("--json");

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ICON_KEYS = ["downtime", "cost", "error", "inconsistent"];

// Content baseline: slugs that must still exist (pre-refactor audit).
const BASELINE = {
  categories: [
    "virtual-training-suite",
    "simulation-training",
    "command-center",
    "advanced-education-system",
    "virtual-connect-suite",
  ],
  products: [
    "operational-training",
    "language-training",
    "maintenance-training",
    "troubleshooting-training",
    "medical-training",
  ],
};

const CANONICAL = {
  categories: "data/category/categories.ts",
  categoryDetails: "data/category/categoryDetails.ts",
  products: "data/product/products.ts",
};

const LEGACY_NAMES = ["SolutionCategory", "solutionCategories", "ProductDetail", "productDetails"];
const LEGACY_RE = new RegExp(`\\b(${LEGACY_NAMES.join("|")})\\b`);
const HREF_RE = /["'](\/solution\/[a-z0-9-]+)["']/g;
const PROP_RE = /\b(categorySlug|productSlug)\s*[:=]\s*["']([a-z0-9-]+)["']/g;
const INDEX_RE = /\b(categories|products|categoryDetails|productDetails)\s*\[\s*\d+\s*\]/g;
const DUPLICATE_DATA_RE = /(?:^|\n)\s*(?:export\s+)?const\s+(categories|products|categoryDetails|productDetails)\s*(?::[^=]*)?=\s*\[/g;
const DUPLICATE_TYPE_RE = /\b(interface|type)\s+(Category|Product|CategoryDetail|ProductDetail)\b/g;
const FROM_RE = /\bfrom\s*["']([^"']+)["']/g;
const DYNAMIC_IMPORT_RE = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
const SIDE_IMPORT_RE = /^\s*import\s*["']([^"']+)["']/gm;
const REQUIRE_RE = /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g;

const report = { errors: [], warnings: [] };
const fail = (code, message, extra = {}) => report.errors.push({ code, message, ...extra });
const warn = (code, message) => report.warnings.push({ code, message });

function loadData(relPath) {
  const src = readFileSync(join(ROOT, relPath), "utf8");
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const mod = { exports: {} };
  new vm.Script(outputText, { filename: relPath }).runInNewContext({
    exports: mod.exports,
    module: mod,
    require,
    console,
  });
  return mod.exports;
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".") || entry === "node_modules") continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|mjs)$/.test(entry)) out.push(p);
  }
  return out;
}

const rel = (p) => relative(ROOT, p).split("\\").join("/");
const sourceFiles = ["app", "components", "data", "lib", "types"].flatMap((d) => walk(join(ROOT, d)));

function importTargets(file, src) {
  const out = [];
  for (const re of [FROM_RE, DYNAMIC_IMPORT_RE, SIDE_IMPORT_RE, REQUIRE_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) out.push(m[1]);
  }
  return out;
}

function resolveTarget(file, target) {
  if (target.startsWith("@/")) return target.slice(2);
  if (target.startsWith(".")) return relative(ROOT, join(dirname(file), target)).split("\\").join("/");
  return null;
}

function layerOf(p) {
  const m = p.match(/^(types|data|lib|components|app)\//);
  return m ? m[1] : null;
}

// ── Load domain data ────────────────────────────────────────────────
let categories = [];
let categoryDetails = [];
let products = [];
for (const [relPath, key] of [
  ["data/category/categories.ts", "categories"],
  ["data/category/categoryDetails.ts", "categoryDetails"],
  ["data/product/products.ts", "products"],
]) {
  try {
    const mod = loadData(relPath);
    const value = mod[key];
    if (!Array.isArray(value)) fail("DATA_LOAD_FAILED", `${relPath}: export "${key}" is not an array`);
    else if (key === "categories") categories = value;
    else if (key === "categoryDetails") categoryDetails = value;
    else products = value;
  } catch (e) {
    fail("DATA_LOAD_FAILED", `${relPath}: ${e.message}`);
  }
}

const categorySlugs = new Set(categories.map((c) => c.slug));
const productSlugs = new Set(products.map((p) => p.slug));
const detailSlugs = new Set(categoryDetails.map((d) => d.slug));

// ── Category ────────────────────────────────────────────────────────
const catErrors = [];
categories.forEach((c, i) => {
  if (typeof c.slug !== "string" || !SLUG_RE.test(c.slug)) catErrors.push(`categories[${i}]: invalid slug "${c.slug}"`);
  if (typeof c.title !== "string" || !c.title.trim()) catErrors.push(`categories[${i}]: missing title`);
});
{
  const seen = new Set();
  for (const c of categories)
    if (seen.has(c.slug)) catErrors.push(`duplicate category slug "${c.slug}"`);
  else seen.add(c.slug);
}
for (const slug of BASELINE.categories)
  if (!categorySlugs.has(slug)) fail("MISSING_BASELINE_SLUG", `category slug "${slug}" is missing from ${CANONICAL.categories}`);
catErrors.forEach((m) => fail("CATEGORY_INVALID", m));

// ── CategoryDetail ──────────────────────────────────────────────────
const detailErrors = [];
categoryDetails.forEach((d, i) => {
  const at = `categoryDetails[${i}]`;
  if (typeof d.slug !== "string" || !SLUG_RE.test(d.slug)) detailErrors.push(`${at}: invalid slug "${d.slug}"`);
  else if (!categorySlugs.has(d.slug))
    fail("CATEGORY_DETAIL_ORPHAN_CATEGORY", `categoryDetail "${d.slug}" references unknown category`);
  if (!d.hero || typeof d.hero.title !== "string" || typeof d.hero.description !== "string" || typeof d.hero.image !== "string" || !Array.isArray(d.hero.recommendedFor))
    detailErrors.push(`${at}: invalid hero`);
  if (!Array.isArray(d.tabs) || d.tabs.length === 0) detailErrors.push(`${at}: missing tabs`);
  else
    d.tabs.forEach((t, j) => {
      if (typeof t.name !== "string" || typeof t.desc !== "string" || !Array.isArray(t.pills))
        detailErrors.push(`${at}.tabs[${j}]: invalid tab`);
    });
  if (!Array.isArray(d.challenges) || d.challenges.length === 0) detailErrors.push(`${at}: missing challenges`);
  else
    d.challenges.forEach((ch, j) => {
      if (!ICON_KEYS.includes(ch.icon) || typeof ch.title !== "string" || typeof ch.desc !== "string")
        detailErrors.push(`${at}.challenges[${j}]: invalid challenge (icon must be one of ${ICON_KEYS.join("|")})`);
    });
});
{
  const seen = new Set();
  for (const d of categoryDetails)
    if (seen.has(d.slug)) detailErrors.push(`duplicate categoryDetail slug "${d.slug}"`);
    else seen.add(d.slug);
}
detailErrors.forEach((m) => fail("CATEGORY_DETAIL_INVALID", m));

// ── Product ─────────────────────────────────────────────────────────
const prodErrors = [];
products.forEach((p, i) => {
  const at = `products[${i}]`;
  if (typeof p.slug !== "string" || !SLUG_RE.test(p.slug)) prodErrors.push(`${at}: invalid slug "${p.slug}"`);
  if (typeof p.title !== "string" || !p.title.trim()) prodErrors.push(`${at}: missing title`);
  if (typeof p.img !== "string" || !p.img.trim()) prodErrors.push(`${at}: missing img`);
  if (typeof p.categorySlug !== "string" || !categorySlugs.has(p.categorySlug))
    fail("PRODUCT_ORPHAN_CATEGORY", `product "${p.slug}" references unknown category "${p.categorySlug}"`);
});
{
  const seen = new Set();
  for (const p of products)
    if (seen.has(p.slug)) prodErrors.push(`duplicate product slug "${p.slug}"`);
    else seen.add(p.slug);
}
{
  const byTitle = new Map();
  for (const p of products) byTitle.set(p.title, (byTitle.get(p.title) || 0) + 1);
  for (const [title, n] of byTitle)
    if (n > 1) warn("POSSIBLE_DUPLICATE_PRODUCT", `product title "${title}" used ${n} times`);
}
for (const slug of BASELINE.products)
  if (!productSlugs.has(slug)) fail("MISSING_BASELINE_SLUG", `product slug "${slug}" is missing from ${CANONICAL.products}`);
prodErrors.forEach((m) => fail("PRODUCT_INVALID", m));

for (const c of categories)
  if (!detailSlugs.has(c.slug)) warn("CATEGORY_WITHOUT_DETAIL", `category ${c.slug} has no detail data`);

// ── Source scans (app/components/data/lib/types) ────────────────────
const scanErrors = { index: [], legacy: [], unknown: [] };
const dupData = [];
const dupTypes = [];
const boundary = [];
const typeDataMixed = [];

for (const file of sourceFiles) {
  const r = rel(file);
  const layer = layerOf(r);
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");

  lines.forEach((line, i) => {
    let m;
    HREF_RE.lastIndex = 0;
    while ((m = HREF_RE.exec(line))) {
      const slug = m[1].replace("/solution/", "");
      if (!categorySlugs.has(slug)) scanErrors.unknown.push(`UNKNOWN_CATEGORY_SLUG: ${r}:${i + 1} link ${m[1]} has no category`);
    }
    PROP_RE.lastIndex = 0;
    while ((m = PROP_RE.exec(line))) {
      const [key, slug] = [m[1], m[2]];
      const ok = key === "productSlug" ? productSlugs.has(slug) : categorySlugs.has(slug);
      if (!ok)
        scanErrors.unknown.push(
          `${key === "productSlug" ? "UNKNOWN_PRODUCT_SLUG" : "UNKNOWN_CATEGORY_SLUG"}: ${r}:${i + 1} ${key}="${slug}" not found`
        );
    }
    INDEX_RE.lastIndex = 0;
    while ((m = INDEX_RE.exec(line))) scanErrors.index.push(`INDEX_BASED_DOMAIN_LOOKUP: ${r}:${i + 1} ${m[0]}`);
    if (LEGACY_RE.test(line)) scanErrors.legacy.push(`LEGACY_SYMBOL_REFERENCE: ${r}:${i + 1} ${m0(line)}`);
  });

  function m0(line) {
    const m = line.match(LEGACY_RE);
    return m ? m[1] : "";
  }

  if (layer !== "data") {
    DUPLICATE_DATA_RE.lastIndex = 0;
    let m;
    while ((m = DUPLICATE_DATA_RE.exec(src))) {
      const body = src.slice(m.index, m.index + 4000);
      if (/\bslug\b/.test(body))
        dupData.push(`DUPLICATE_DOMAIN_DATA: entity "${m[1]}" canonical ${CANONICAL[m[1]] || "?"} duplicated at ${r}:${src.slice(0, m.index).split("\n").length}`);
    }
  }
  if (layer !== "types") {
    DUPLICATE_TYPE_RE.lastIndex = 0;
    let m;
    while ((m = DUPLICATE_TYPE_RE.exec(src)))
      dupTypes.push(`DUPLICATE_TYPE_DEFINITION: ${m[2]} defined at ${r}:${src.slice(0, m.index).split("\n").length}`);
  }

  if (layer === "types" && /(?:^|\n)\s*(?:export\s+)?const\s+\w+\s*[:=]/.test(src))
    typeDataMixed.push(`TYPE_DATA_MIXED: ${r} contains data (types/ must be contracts only)`);

  for (const target of importTargets(file, src)) {
    const resolved = resolveTarget(file, target);
    const targetLayer = resolved ? layerOf(resolved) : null;
    const pkg = target.startsWith("next/") ? "next" : target;
    if (layer === "types" && targetLayer && targetLayer !== "types")
      boundary.push(`ARCHITECTURE_BOUNDARY: ${r} imports ${target} (types/ must not import ${targetLayer}/)`);
    if (layer === "data" && (targetLayer === "components" || targetLayer === "app"))
      boundary.push(`ARCHITECTURE_BOUNDARY: ${r} imports ${target} (data/ must not import ${targetLayer}/)`);
    if (layer === "data" && ["react", "react-dom", "next", "next/", "lucide-react"].includes(pkg))
      boundary.push(`TYPE_DATA_MIXED: ${r} imports ${target} (data/ must stay framework-free)`);
    if (layer === "lib" && (targetLayer === "components" || targetLayer === "app"))
      boundary.push(`ARCHITECTURE_BOUNDARY: ${r} imports ${target} (lib/ must not import ${targetLayer}/)`);
    if ((layer === "components" || layer === "app") && targetLayer === "data")
      boundary.push(`ARCHITECTURE_BOUNDARY: ${r} imports ${target} (use lib/ as data bridge)`);
  }
}
scanErrors.index.forEach((m) => fail("INDEX_BASED_DOMAIN_LOOKUP", m));
scanErrors.legacy.forEach((m) => fail("LEGACY_SYMBOL_REFERENCE", m));
scanErrors.unknown.forEach((m) => fail(m.split(":")[0], m.slice(m.indexOf(": ") + 2)));
dupData.forEach((m) => fail("DUPLICATE_DOMAIN_DATA", m));
dupTypes.forEach((m) => fail("DUPLICATE_TYPE_DEFINITION", m));
typeDataMixed.forEach((m) => fail("TYPE_DATA_MIXED", m));
boundary.forEach((m) => fail("ARCHITECTURE_BOUNDARY", m));

// ── Route audit ─────────────────────────────────────────────────────
const dynamicFolders = [];
(function findDynamic(dir, prefix) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const p = join(dir, entry);
    if (!statSync(p).isDirectory()) continue;
    const path = prefix ? `${prefix}/${entry}` : entry;
    if (entry.startsWith("[")) dynamicFolders.push(path);
    findDynamic(p, path);
  }
})(join(ROOT, "app"), "app");
const productDetailRoute = dynamicFolders.filter((f) => f.split("/").filter((s) => s.startsWith("[")).length >= 2);

// ── Pipeline chain (only when domain checks pass) ───────────────────
const steps = {};
function runStep(name, args, timeout = 600000) {
  if (report.errors.length > 0) {
    steps[name] = "SKIPPED";
    return;
  }
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: "utf8", timeout });
  const out = `${r.stdout || ""}${r.stderr || ""}`.trim();
  if (r.status === 0) steps[name] = "PASS";
  else {
    steps[name] = "FAIL";
    const tail = out.split("\n").slice(-15).join("\n");
    fail(`${name.toUpperCase()}_FAILED`, tail || `exit ${r.status}`);
  }
}
runStep("typecheck", ["node_modules/typescript/lib/tsc.js", "--noEmit"]);
runStep("lint", ["node_modules/eslint/bin/eslint.js", "."]);
{
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  if (pkg.scripts && pkg.scripts.test) runStep("tests", ["npm", "test"]);
  else steps.tests = "SKIPPED";
}
runStep("build", ["node_modules/next/dist/bin/next", "build", "--turbopack"]);

// ── Report ──────────────────────────────────────────────────────────
const ok = report.errors.length === 0;
const summary = { categories: categories.length, categoryDetails: categoryDetails.length, products: products.length };

if (JSON_MODE) {
  console.log(
    JSON.stringify(
      { ok, errors: report.errors, warnings: report.warnings, summary, routes: { productDetailRoute: productDetailRoute[0] || null }, steps },
      null,
      2
    )
  );
  process.exit(ok ? 0 : 1);
}

const item = (good, text) => `${good ? "✓" : "✗"} ${text}`;
const nl = (text) => `- ${text}`;

console.log("Product / Category Validation");
console.log("────────────────────────────────\n");

console.log("Category");
console.log(item(report.errors.every((e) => !e.code.startsWith("CATEGORY") && e.code !== "MISSING_BASELINE_SLUG") && categories.length > 0, `${categories.length} categories`));
console.log(item(!report.errors.some((e) => /duplicate category slug/.test(e.message)), "unique category slugs"));
console.log(item(!report.errors.some((e) => e.code === "CATEGORY_INVALID"), "all categories valid (slug + title)"));
console.log(item(!report.errors.some((e) => e.code === "MISSING_BASELINE_SLUG" && /category/.test(e.message)), "baseline category slugs present"));
console.log("");

console.log("Category Detail");
console.log(item(!report.errors.some((e) => e.code === "CATEGORY_DETAIL_INVALID" || e.code === "CATEGORY_DETAIL_ORPHAN_CATEGORY") && categoryDetails.length > 0, `${categoryDetails.length} category detail(s)`));
console.log(item(!report.errors.some((e) => e.code === "CATEGORY_DETAIL_ORPHAN_CATEGORY"), "all details reference valid categories"));
console.log("");

console.log("Product");
console.log(item(!report.errors.some((e) => e.code === "PRODUCT_INVALID") && products.length > 0, `${products.length} products`));
console.log(item(!report.errors.some((e) => /duplicate product slug/.test(e.message)), "unique product slugs"));
console.log(item(!report.errors.some((e) => e.code === "PRODUCT_ORPHAN_CATEGORY"), "all products reference valid categories"));
console.log(item(!report.errors.some((e) => e.code === "MISSING_BASELINE_SLUG" && /product/.test(e.message)), "baseline product slugs present"));
console.log("");

console.log("Route Relations");
console.log(productDetailRoute.length === 0
  ? nl("product detail route: NOT PRESENT (no dynamic route under app/) — no ProductDetail data model required")
  : item(true, `product detail route: ${productDetailRoute.join(", ")}`));
console.log(item(scanErrors.index.length === 0, "no index-based domain lookup"));
console.log(item(scanErrors.unknown.length === 0, "no unknown slugs in links/props"));
console.log("");

console.log("Architecture");
console.log(item(typeDataMixed.length === 0, "type/data separation"));
console.log(item(dupData.length === 0, "no duplicate canonical domain data"));
console.log(item(dupTypes.length === 0, "no duplicate domain types"));
console.log(item(boundary.length === 0, "architecture boundaries valid"));
console.log("");

console.log("Legacy");
console.log(item(scanErrors.legacy.length === 0, "no legacy production references"));
console.log("");

console.log("Pipeline");
for (const [name, status] of Object.entries(steps)) {
  if (status === "PASS") console.log(item(true, name));
  else if (status === "SKIPPED") console.log(nl(`${name}: SKIPPED${name === "tests" ? " (no test script configured)" : ""}`));
  else console.log(item(false, `${name}: FAIL`));
}
console.log("");

if (report.errors.length > 0) {
  console.log("Errors:");
  for (const e of report.errors) console.log(`\nERROR ${e.code}\n${e.message}`);
  console.log("");
}

if (report.warnings.length > 0) {
  console.log("Warnings:");
  for (const w of report.warnings) console.log(`⚠ ${w.code}: ${w.message}`);
  console.log("");
}

console.log("────────────────────────────────");
console.log(`RESULT: ${ok ? "PASS" : "FAIL"} (${report.errors.length} errors, ${report.warnings.length} warnings)`);
process.exit(ok ? 0 : 1);
