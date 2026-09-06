#!/usr/bin/env node
// Security audit for web-falah. Static source/config checks + npm audit.
// Usage: node scripts/security-audit.mjs [--json]
// Exit: 0 = no errors (warnings allowed), 1 = at least one error.
//
// False-positive policy:
// - `process.env.X` references are env indirection, not hardcoded credentials.
// - Quoted values that read as placeholders (your..., xxx, example, changeme,
//   lorem, placeholder, TODO) are not reported.
// - Dependency vulns whose only fix is a breaking change (npm audit fix --force)
//   are reported as warnings (residual risk), never force-fixed.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SRC_DIRS = ["app", "components", "lib", "data", "types", "scripts"];
const ROOT_FILES = [
  "next.config.ts",
  "package.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "tsconfig.json",
];
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".next", "public", "graphify-out", ".git"]);
const asJson = process.argv.includes("--json");

const SECRET_PATTERNS = [
  { id: "aws-access-key", re: /\bAKIA[0-9A-Z]{16}\b/, severity: "high" },
  {
    id: "github-token",
    re: /\b(ghp_[A-Za-z0-9]{36,}|gho_[A-Za-z0-9]{36,}|ghu_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{20,})\b/,
    severity: "high",
  },
  { id: "openai-key", re: /\bsk-[A-Za-z0-9]{20,}\b/, severity: "high" },
  { id: "stripe-key", re: /\b(sk|pk)_(live|test)_[0-9a-zA-Z]{10,}\b/, severity: "high" },
  { id: "slack-token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, severity: "high" },
  { id: "google-api-key", re: /\bAIza[0-9A-Za-z_-]{35}\b/, severity: "high" },
  { id: "private-key-block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, severity: "high" },
  {
    id: "generic-credential-assignment",
    re: /\b(api[_-]?key|apikey|secret[_-]?key|auth[_-]?token|access[_-]?token|client[_-]?secret|password|passwd|pwd)\b\s*[:=]\s*["'`]([A-Za-z0-9+/=_-]{12,})["'`]/i,
    severity: "high",
  },
];
const PLACEHOLDER_RE =
  /(your|xxx|example|changeme|lorem|placeholder|todo|fixme|dummy|sample|<[^>]*>|\.\.\.|_+)$/i;

function collectFiles() {
  const files = [];
  for (const dir of SRC_DIRS) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    const stack = [abs];
    while (stack.length) {
      const cur = stack.pop();
      for (const name of readdirSync(cur)) {
        const p = join(cur, name);
        const st = statSync(p);
        if (st.isDirectory()) {
          if (!SKIP_DIRS.has(name)) stack.push(p);
        } else if (SCAN_EXT.has(extname(name))) {
          files.push(p);
        }
      }
    }
  }
  for (const name of ROOT_FILES) {
    const p = join(ROOT, name);
    if (existsSync(p)) files.push(p);
  }
  return files;
}

function rel(p) {
  return relative(ROOT, p).split("\\").join("/");
}

function scanLines(files) {
  const out = [];
  for (const p of files) {
    const lines = readFileSync(p, "utf8").split(/\r?\n/);
    out.push({ file: rel(p), lines });
  }
  return out;
}

function checkHeaders() {
  const cfg = readFileSync(join(ROOT, "next.config.ts"), "utf8");
  const required = [
    ["Strict-Transport-Security", /Strict-Transport-Security/],
    ["Content-Security-Policy", /Content-Security-Policy/],
    ["X-Content-Type-Options", /X-Content-Type-Options/],
    ["Referrer-Policy", /Referrer-Policy/],
    ["Permissions-Policy", /Permissions-Policy/],
    ["frame protection (frame-ancestors / X-Frame-Options)", /frame-ancestors|X-Frame-Options/],
  ];
  const missing = required.filter(([, re]) => !re.test(cfg)).map(([name]) => name);
  const forbidden = [];
  if (/default-src\s+['"]?\*/.test(cfg)) forbidden.push("wildcard default-src");
  if (/unsafe-eval/.test(cfg)) forbidden.push("unsafe-eval in CSP");
  if (/(script|img|font|connect|style)-src[^;\n]*['"]?\*/.test(cfg))
    forbidden.push("wildcard source in CSP");
  const hstsGated = /NODE_ENV\s*===?\s*["']production["']/.test(cfg);
  const status = missing.length || forbidden.length ? "fail" : "pass";
  const details = [];
  for (const [name] of required) details.push(`${name}: ${missing.includes(name) ? "missing" : "present"}`);
  for (const f of forbidden) details.push(`forbidden value found: ${f}`);
  details.push(`HSTS production-gated: ${hstsGated ? "yes" : "no"}`);
  return { status, details, missing, forbidden, hstsGated };
}

function checkSecrets(files) {
  const findings = [];
  for (const { file, lines } of files) {
    lines.forEach((line, i) => {
      for (const { id, re, severity } of SECRET_PATTERNS) {
        const m = line.match(re);
        if (!m) continue;
        if (line.includes("process.env")) continue;
        const value = m[2] ?? m[0];
        if (PLACEHOLDER_RE.test(value)) continue;
        findings.push({ file, line: i + 1, pattern: id, severity });
      }
    });
  }
  const envFiles = readdirSync(ROOT).filter((n) => /^\.?env(\..+)?$/.test(n) && !n.endsWith(".example"));
  for (const f of envFiles) findings.push({ file: f, line: 0, pattern: "env-file-present", severity: "warn" });
  const hardFail = findings.filter((f) => f.severity === "high");
  const status = hardFail.length ? "fail" : findings.length ? "warn" : "pass";
  const details = findings.length
    ? findings.map((f) => `${f.file}${f.line ? `:${f.line}` : ""} ${f.pattern}`)
    : ["no hardcoded credentials found"];
  return { status, details, findings };
}

function checkDebug(cfgPath, files) {
  const cfg = readFileSync(cfgPath, "utf8");
  const details = [];
  let status = "pass";
  const fail = (d) => {
    status = "fail";
    details.push(d);
  };
  const warn = (d) => {
    if (status !== "fail") status = "warn";
    details.push(d);
  };
  if (/debug\s*:\s*true/.test(cfg)) fail("next.config: debug: true");
  if (/sourceMap\s*:\s*true/.test(cfg)) warn("next.config: sourceMap: true");
  if (/NODE_ENV\s*===?\s*["']development["']/.test(cfg))
    warn("next.config: hardcoded development mode check");
  for (const { file, lines } of files) {
    if (!file.startsWith("app/") && !file.startsWith("lib/")) continue;
    lines.forEach((line, i) => {
      if (/console\.(log|debug|info)\s*\(/.test(line))
        warn(`${file}:${i + 1} console output in server code`);
    });
  }
  if (!details.length) details.push("no debug/legacy patterns found");
  return { status, details };
}

function checkPublicEnv(files) {
  const found = new Map();
  for (const { file, lines } of files) {
    for (const line of lines) {
      for (const m of line.matchAll(/NEXT_PUBLIC_([A-Z0-9_]+)/g)) {
        found.set(m[1], file);
      }
    }
  }
  const details = [...found.entries()].map(([name, file]) => `NEXT_PUBLIC_${name} in ${file}`);
  const sensitive = [...found.keys()].filter((n) => /(KEY|TOKEN|SECRET|PASSWORD)/.test(n));
  const status = sensitive.length ? "fail" : found.size ? "warn" : "pass";
  if (!details.length) details.push("no NEXT_PUBLIC_* variables");
  for (const n of sensitive) details.push(`SENSITIVE name: NEXT_PUBLIC_${n}`);
  return { status, details, count: found.size, sensitive };
}

function checkApi() {
  const appDir = join(ROOT, "app");
  const endpoints = [];
  const serverActions = [];
  if (existsSync(appDir)) {
    const stack = [appDir];
    while (stack.length) {
      const cur = stack.pop();
      for (const name of readdirSync(cur)) {
        const p = join(cur, name);
        const st = statSync(p);
        if (st.isDirectory()) {
          if (!SKIP_DIRS.has(name)) stack.push(p);
        } else if (name === "route.ts" || name === "route.tsx") {
          endpoints.push(rel(p));
        } else if (/\.(ts|tsx)$/.test(name)) {
          if (/^["']use server["']/.test(readFileSync(p, "utf8").trim()))
            serverActions.push(rel(p));
        }
      }
    }
  }
  const notes = [];
  let status = "pass";
  if (!endpoints.length && !serverActions.length) {
    notes.push("no server API endpoints (static prerendered site) — no rate-limit/CSRF/CORS surface");
  } else {
    status = "warn";
    for (const e of endpoints) notes.push(`route handler: ${e} (manual review: validation, rate limit, content-type)`);
    for (const a of serverActions) notes.push(`server action: ${a} (manual review: validation, rate limit)`);
  }
  return { status, details: notes, endpoints: endpoints.length, serverActions: serverActions.length };
}

const DANGEROUS_HTML = [
  ["dangerouslySetInnerHTML", /dangerouslySetInnerHTML/],
  ["innerHTML assignment", /\.innerHTML\s*=/],
  ["document.write", /document\.write\s*\(/],
  ["eval()", /\beval\s*\(/],
  ["new Function()", /new\s+Function\s*\(/],
];
const REDIRECT_SINKS = [
  /redirect\s*\(([^)\n]*)\)/g,
  /router\.(push|replace)\s*\(([^)\n]*)\)/g,
  /window\.open\s*\(([^)\n]*)\)/g,
  /location\.href\s*=\s*([^\n;]+)/g,
  /window\.location\s*=\s*([^\n;]+)/g,
];

function checkDangerousHtml(files) {
  const details = [];
  for (const { file, lines } of files) {
    lines.forEach((line, i) => {
      for (const [name, re] of DANGEROUS_HTML) {
        if (re.test(line)) details.push(`${file}:${i + 1} ${name}`);
      }
    });
  }
  const status = details.length ? "fail" : "pass";
  if (!details.length) details.push("no dangerous HTML APIs found");
  return { status, details };
}

function checkOpenRedirects(files) {
  const findings = [];
  let sinks = 0;
  for (const { file, lines } of files) {
    lines.forEach((line, i) => {
      for (const re of REDIRECT_SINKS) {
        re.lastIndex = 0;
        for (const m of line.matchAll(re)) {
          sinks++;
          const arg = m[1].trim();
          if (arg.startsWith("`") || arg.includes("+") || /^[$a-zA-Z_]/.test(arg))
            findings.push(`${file}:${i + 1} dynamic redirect target: ${arg.slice(0, 60)}`);
        }
      }
    });
  }
  const details = findings.length
    ? findings
    : sinks
      ? ["redirect sinks use static literals"]
      : ["no redirect sinks found"];
  return { status: findings.length ? "fail" : "pass", details };
}

function checkCors(files) {
  const details = [];
  for (const { file, lines } of files) {
    lines.forEach((line, i) => {
      if (/Access-Control-Allow-Origin["']?\s*[:=]\s*["']\*["']/i.test(line))
        details.push(`${file}:${i + 1} wildcard CORS`);
    });
  }
  const status = details.length ? "fail" : "pass";
  if (!details.length) details.push("no wildcard CORS found");
  return { status, details };
}

function readRootFile(name) {
  const p = join(ROOT, name);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function checkGraphifyIsolation(files) {
  const details = [];
  let status = "pass";
  const gitignore = readRootFile(".gitignore") ?? "";
  if (!/^\s*graphify-out\//m.test(gitignore)) {
    status = "fail";
    details.push(".gitignore missing graphify-out/ entry");
  } else {
    details.push(".gitignore ignores graphify-out/");
  }
  // Regression: .gitignore only prevents future additions; files committed
  // before the ignore rule existed would still be tracked.
  let tracked = "";
  try {
    tracked = execFileSync("git", ["ls-files", "graphify-out"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    tracked = "";
  }
  if (tracked) {
    status = "fail";
    details.push(
      `graphify-out tracked by git (${tracked.split("\n").length} file(s)) — run: git rm -r --cached graphify-out`,
    );
  } else {
    details.push("no graphify-out files tracked by git");
  }
  const refs = [];
  for (const { file, lines } of files) {
    if (file === "scripts/security-audit.mjs") continue;
    lines.forEach((line, i) => {
      if (/graphify-out/.test(line)) refs.push(`${file}:${i + 1}`);
    });
  }
  if (refs.length) {
    status = "fail";
    details.push(`source references graphify-out: ${refs.join(", ")}`);
  } else {
    details.push("no source references to graphify-out");
  }
  return { status, details };
}

const DEPLOY_FILES = [
  "vercel.json",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  "nginx.conf",
];

function checkDeploymentConfig() {
  const found = DEPLOY_FILES.filter((n) => existsSync(join(ROOT, n)));
  for (const n of readdirSync(ROOT)) {
    if (/^nginx.*\.conf$/.test(n) && !found.includes(n)) found.push(n);
  }
  if (!found.length) {
    return { status: "pass", details: ["no explicit deployment config — platform-managed static host"] };
  }
  const details = [];
  let status = "pass";
  for (const n of found) {
    const content = readFileSync(join(ROOT, n), "utf8");
    const bad = [];
    if (/graphify/.test(content)) bad.push("references graphify-out");
    if (/\.env\b/.test(content)) bad.push("references .env");
    if (bad.length) {
      status = "fail";
      details.push(`${n}: ${bad.join("; ")}`);
    } else {
      details.push(`${n}: present, no graphify/.env references`);
    }
  }
  return { status, details };
}

function checkEnvTracking() {
  const gitignore = readRootFile(".gitignore");
  if (gitignore === null) return { status: "fail", details: [".gitignore missing"] };
  if (/^\s*\.env\*/m.test(gitignore)) {
    return { status: "pass", details: [".gitignore covers all .env* variants"] };
  }
  const required = [".env", ".env.local", ".env.development.local", ".env.test.local", ".env.production.local"];
  const missing = required.filter(
    (e) => !new RegExp(`^\\s*${e.replace(/\./g, "\\.")}(\\s|$)`, "m").test(gitignore),
  );
  if (missing.length) {
    return { status: "fail", details: [`.gitignore does not cover: ${missing.join(", ")}`] };
  }
  return { status: "pass", details: [".gitignore covers env files (explicit list)"] };
}

function checkPublicHygiene() {
  const pub = join(ROOT, "public");
  if (!existsSync(pub)) return { status: "warn", details: ["public/ directory missing"] };
  const details = [];
  let status = "pass";
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) {
        if (!SKIP_DIRS.has(name)) walk(p);
        continue;
      }
      const relp = rel(p);
      const secretLike =
        /\.(pem|key|p12)$/i.test(name) ||
        /id_rsa/.test(name) ||
        (/^\.env/.test(name) && !name.endsWith(".example")) ||
        /(secret|credential)/i.test(name);
      if (secretLike) {
        status = "fail";
        details.push(`${relp}: secret-like file in public/`);
        continue;
      }
      if ([".DS_Store", "Thumbs.db"].includes(name) || /\.log$/i.test(name)) {
        if (status !== "fail") status = "warn";
        details.push(`${relp}: junk file in public/`);
      }
    }
  };
  walk(pub);
  if (!details.length) details.push("public/ clean");
  return { status, details };
}

function checkHeaderPolicy() {
  const cfg = readFileSync(join(ROOT, "next.config.ts"), "utf8").split(/\r?\n/);
  const gateIdx = cfg.findIndex((l) => /if\s*\(\s*isProduction\s*\)/.test(l));
  if (gateIdx === -1) {
    return { status: "fail", details: ["production gate (if (isProduction)) not found in next.config.ts"] };
  }
  const before = cfg.slice(0, gateIdx).join("\n");
  const after = cfg.slice(gateIdx).join("\n");
  const details = [];
  let status = "pass";
  for (const name of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]) {
    if (!before.includes(name)) {
      status = "fail";
      details.push(`${name} must be always-on (outside production gate)`);
    }
  }
  for (const name of ["Strict-Transport-Security", "Content-Security-Policy"]) {
    if (!after.includes(name)) {
      status = "fail";
      details.push(`${name} must be production-gated`);
    }
  }
  if (!details.length) details.push("safe headers always-on, HSTS/CSP production-gated");
  return { status, details };
}

function checkCspQuality() {
  const cfg = readFileSync(join(ROOT, "next.config.ts"), "utf8");
  const m = cfg.match(/Content-Security-Policy"[\s\S]*?\]\.join/);
  if (!m) return { status: "fail", details: ["CSP block not found in next.config.ts"] };
  const csp = m[0];
  const details = [];
  let status = "pass";
  const fail = (d) => {
    status = "fail";
    details.push(d);
  };
  const warn = (d) => {
    if (status !== "fail") status = "warn";
    details.push(d);
  };
  if (/unsafe-eval/.test(csp)) fail("unsafe-eval in CSP");
  if (csp.includes("*")) fail("wildcard source in CSP");
  if (!/frame-ancestors\s+'none'/.test(csp)) fail("missing frame-ancestors 'none'");
  if (!/form-action\s+'self'/.test(csp)) fail("missing form-action 'self'");
  if (!/base-uri\s+'self'/.test(csp)) fail("missing base-uri 'self'");
  if (!/object-src\s+'none'/.test(csp)) fail("missing object-src 'none'");
  if (/unsafe-inline/.test(csp)) warn("unsafe-inline present (documented: RSC flight scripts + style attributes)");
  if (!details.length) details.push("CSP strict: no wildcards, no unsafe-eval, framing denied");
  return { status, details };
}

function checkToolingPresence() {
  const required = [
    ["scripts/security-http-check.mjs", "live header checker"],
    [".github/workflows/ci.yml", "CI workflow"],
    ["SECURITY.md", "security policy"],
  ];
  const details = [];
  let missing = 0;
  for (const [path, label] of required) {
    if (existsSync(join(ROOT, path))) {
      details.push(`${path}: present (${label})`);
    } else {
      missing++;
      details.push(`${path}: missing (${label})`);
    }
  }
  return { status: missing ? "warn" : "pass", details };
}

function checkExternalOrigins(files) {
  const hosts = new Map();
  for (const { file, lines } of files) {
    lines.forEach((line, i) => {
      for (const m of line.matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) {
        const host = m[1].toLowerCase();
        if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|schema\.org|www\.w3\.org|w3\.org)$/.test(host)) continue;
        if (!hosts.has(host)) hosts.set(host, `${file}:${i + 1}`);
      }
    });
  }
  if (!hosts.size) return { status: "pass", details: ["no external origins referenced in source"] };
  return {
    status: "warn",
    details: [...hosts.entries()].map(
      ([h, at]) => `external origin ${h} (${at}) — review against CSP allowlist`,
    ),
  };
}

const ASSET_EXT_RE = /["'`]([^"'`\s]*?\.(?:webp|svg|ico))["'`]/g;

function checkStaticAssets(files) {
  const details = [];
  let status = "pass";
  const refs = new Set();
  for (const { lines } of files) {
    for (const m of lines.join("\n").matchAll(ASSET_EXT_RE)) {
      const ref = m[1];
      if (ref.includes("://")) continue;
      refs.add(ref.replace(/^\.?\//, ""));
    }
  }
  for (const ref of [...refs].sort()) {
    if (/\.(png|jpe?g)$/i.test(ref)) {
      status = "fail";
      details.push(`forbidden image format referenced: ${ref}`);
      continue;
    }
    if (!existsSync(join(ROOT, "public", ref))) {
      status = "fail";
      details.push(`public/${ref} referenced but missing`);
    }
  }
  if (!details.length) details.push("all referenced static assets exist in public/");
  if (existsSync(join(ROOT, ".next"))) {
    let contaminated = false;
    const stack = [join(ROOT, ".next")];
    while (stack.length && !contaminated) {
      const cur = stack.pop();
      for (const name of readdirSync(cur)) {
        const p = join(cur, name);
        const st = statSync(p);
        if (st.isDirectory()) stack.push(p);
        else if (/graphify/i.test(name)) {
          contaminated = true;
          details.push(`graphify artifact in build output: ${rel(p)}`);
        }
      }
    }
    if (contaminated) status = "fail";
    else details.push("no graphify artifacts in .next build output");
  } else {
    details.push("no .next build output to verify (run build first)");
  }
  return { status, details };
}

function checkWorkspaceLockfile() {
  let dir = join(ROOT, "..");
  for (let i = 0; i < 4 && existsSync(dir); i++) {
    const lock = [
      "package.json",
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "bun.lockb",
    ].find((n) => existsSync(join(dir, n)));
    if (lock) {
      return {
        status: "warn",
        details: [
          `parent workspace file at ${"../".repeat(i + 1)}${lock} — Next.js may treat this as a workspace (non-security, informational)`,
        ],
      };
    }
    dir = join(dir, "..");
  }
  return { status: "pass", details: ["no parent workspace/lockfile found"] };
}

function runNpm(cmdArgs) {
  try {
    return execFileSync("npm", cmdArgs, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch (e) {
    return String(e.stdout ?? "");
  }
}

function checkDependencies() {
  const human = runNpm(["audit"]);
  const forceRequired = /audit fix --force/.test(human);
  let json = null;
  try {
    json = JSON.parse(runNpm(["audit", "--json"]));
  } catch {
    return {
      status: "warn",
      details: ["npm audit could not be parsed — run `npm audit` manually"],
      vulnerabilities: null,
      advisories: [],
      forceRequired,
    };
  }
  const counts = json.metadata?.vulnerabilities ?? {
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
  };
  const total =
    counts.info + counts.low + counts.moderate + counts.high + counts.critical;
  const advisories = [];
  const seen = new Set();
  for (const v of Object.values(json.vulnerabilities ?? {})) {
    for (const via of v.via ?? []) {
      if (typeof via !== "object" || !via.url || seen.has(via.url)) continue;
      seen.add(via.url);
      advisories.push({
        module: v.name,
        severity: via.severity,
        title: via.title,
        url: via.url,
        range: via.range,
      });
    }
  }
  const details = [];
  let status = "pass";
  if (total === 0) {
    details.push("no known vulnerabilities");
  } else {
    details.push(
      `${total} vulnerable package(s) (${counts.critical} critical, ${counts.high} high, ${counts.moderate} moderate, ${counts.low} low)`,
    );
    for (const name of Object.keys(json.vulnerabilities ?? {})) {
      const v = json.vulnerabilities[name];
      details.push(
        `${name} ${v.range ?? ""} (severity: ${v.severity})${v.fixAvailable ? ` — fix: ${v.fixAvailable.name ?? name} ${typeof v.fixAvailable === "string" ? "" : v.fixAvailable.version ?? ""}${v.fixAvailable.isSemVerMajor ? " (major)" : ""}` : " — no fix available"}`,
      );
    }
    if (counts.critical + counts.high > 0) {
      if (forceRequired) {
        status = "warn";
        details.push(
          "high/critical fix requires breaking change (npm audit fix --force) — residual risk, not force-upgraded",
        );
      } else {
        status = "fail";
        details.push("high/critical fix available without breaking change — run npm audit fix");
      }
    } else {
      status = "warn";
    }
  }
  return { status, details, vulnerabilities: counts, advisories, forceRequired };
}

const files = collectFiles();
const scanned = scanLines(files);
const runtime = scanned.filter(
  (e) =>
    e.file.startsWith("app/") ||
    e.file.startsWith("components/") ||
    e.file.startsWith("lib/"),
);
const cfgPath = join(ROOT, "next.config.ts");

const checks = [
  { id: "security-headers", ...checkHeaders() },
  { id: "secrets", ...checkSecrets(scanned) },
  { id: "debug-legacy", ...checkDebug(cfgPath, scanned) },
  { id: "public-env", ...checkPublicEnv(scanned) },
  { id: "api-security", ...checkApi() },
  { id: "dangerous-html", ...checkDangerousHtml(runtime) },
  { id: "open-redirect", ...checkOpenRedirects(runtime) },
  { id: "cors", ...checkCors(runtime) },
  { id: "dependencies", ...checkDependencies() },
  { id: "graphify-isolation", ...checkGraphifyIsolation(scanned) },
  { id: "deployment-config", ...checkDeploymentConfig() },
  { id: "env-tracking", ...checkEnvTracking() },
  { id: "public-hygiene", ...checkPublicHygiene() },
  { id: "header-policy", ...checkHeaderPolicy() },
  { id: "csp-quality", ...checkCspQuality() },
  { id: "tooling-presence", ...checkToolingPresence() },
  { id: "external-origins", ...checkExternalOrigins(scanned) },
  { id: "static-assets", ...checkStaticAssets(scanned) },
  { id: "workspace-lockfile", ...checkWorkspaceLockfile() },
];

const errors = checks.filter((c) => c.status === "fail").length;
const warnings = checks.filter((c) => c.status === "warn").length;
const ok = errors === 0;

if (asJson) {
  const result = {
    ok,
    errors,
    warnings,
    checks: checks.map((c) => ({ id: c.id, status: c.status, details: c.details })),
    summary: {
      headers: {
        status: checks[0].status,
        missing: checks[0].missing,
        forbidden: checks[0].forbidden,
        hstsProductionGated: checks[0].hstsGated,
      },
      secrets: { status: checks[1].status, findings: checks[1].findings },
      api: {
        status: checks[4].status,
        endpoints: checks[4].endpoints,
        serverActions: checks[4].serverActions,
        notes: checks[4].details,
      },
      dependencies: {
        status: checks[8].status,
        vulnerabilities: checks[8].vulnerabilities,
        advisories: checks[8].advisories,
        forceRequired: checks[8].forceRequired,
      },
    },
  };
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
} else {
  const lines = [
    "SECURITY AUDIT — web-falah",
    "========================================",
    "",
  ];
  for (const c of checks) {
    lines.push(`[${c.status.toUpperCase()}] ${c.id}`);
    for (const d of c.details) lines.push(`      ${d}`);
    lines.push("");
  }
  lines.push("----------------------------------------");
  lines.push(
    `Result: ${ok ? "OK" : "FAIL"} — ${errors} error(s), ${warnings} warning(s)`,
  );
  process.stdout.write(lines.join("\n") + "\n");
}

process.exitCode = ok ? 0 : 1;
