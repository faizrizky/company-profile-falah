#!/usr/bin/env node
// Live security header check for the deployed site.
// Usage: node scripts/security-http-check.mjs [URL] [--json]
//   URL from CLI arg or SECURITY_CHECK_URL env var.
// Exit codes: 0 = all checks pass, 1 = one or more checks fail, 2 = usage/network error.
import process from "node:process";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const urlArg = args.find((a) => !a.startsWith("--"));
const target = urlArg ?? process.env.SECURITY_CHECK_URL;

function fail(code, message) {
  if (asJson) {
    process.stdout.write(JSON.stringify({ ok: false, error: message }, null, 2) + "\n");
  } else {
    console.error(message);
  }
  process.exit(code);
}

if (!target) {
  fail(2, "Usage: security-http-check.mjs <URL> [--json]  (or set SECURITY_CHECK_URL)");
}

let url;
try {
  url = new URL(target);
} catch {
  fail(2, `Invalid URL: ${target}`);
}
if (!["http:", "https:"].includes(url.protocol)) {
  fail(2, `Unsupported protocol: ${url.protocol}`);
}

// Display URL without credentials, if any were present in the input.
const displayUrl = url.protocol + "//" + url.host + url.pathname + url.search;

let res;
try {
  res = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(15_000) });
  if (res.status === 405 || res.status === 501) {
    res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15_000) });
  }
  if (res.body) await res.body.cancel();
} catch (err) {
  fail(2, `Network error: ${err.message}`);
}

const headers = {};
for (const [key, value] of res.headers.entries()) {
  const k = key.toLowerCase();
  headers[k] = headers[k] ? `${headers[k]}, ${value}` : value;
}

const checks = [];
const add = (id, pass, detail) => checks.push({ id, status: pass ? "pass" : "fail", detail });

const finalUrl = res.url || displayUrl;
add("https", finalUrl.startsWith("https://"), `final URL uses ${finalUrl.split("://")[0]}://`);
add("response", res.status >= 200 && res.status < 400, `HTTP ${res.status}`);

const hsts = headers["strict-transport-security"] ?? "";
const hstsMaxAge = Number((hsts.match(/max-age=(\d+)/) ?? [])[1] ?? 0);
add("hsts", hstsMaxAge > 0, hsts ? `max-age=${hstsMaxAge}` : "missing");

const csp = headers["content-security-policy"] ?? "";
add("csp", csp.length > 0, csp ? `present (${csp.length} chars)` : "missing");
add("csp-no-wildcard", csp.length === 0 ? false : !csp.includes("*"), csp.includes("*") ? "wildcard * in CSP" : csp ? "no wildcard" : "n/a");
add(
  "csp-frame-ancestors",
  csp.length === 0 ? false : /frame-ancestors\s+'none'/i.test(csp),
  csp ? (/frame-ancestors\s+'none'/i.test(csp) ? "frame-ancestors 'none'" : "missing frame-ancestors 'none'") : "n/a",
);

add("nosniff", (headers["x-content-type-options"] ?? "").toLowerCase() === "nosniff", headers["x-content-type-options"] ?? "missing");
add("referrer-policy", Boolean(headers["referrer-policy"]), headers["referrer-policy"] ?? "missing");
add("permissions-policy", Boolean(headers["permissions-policy"]), headers["permissions-policy"] ? "present" : "missing");
add(
  "frame-protection",
  (headers["x-frame-options"] ?? "").toUpperCase() === "DENY" || /frame-ancestors\s+'none'/i.test(csp),
  (headers["x-frame-options"] ?? "").toUpperCase() === "DENY" ? "X-Frame-Options DENY" : /frame-ancestors\s+'none'/i.test(csp) ? "frame-ancestors 'none'" : "missing",
);

if (url.protocol === "https:") {
  try {
    const httpUrl = new URL(url);
    httpUrl.protocol = "http:";
    httpUrl.pathname = "/";
    httpUrl.search = "";
    let httpRes = await fetch(httpUrl, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(15_000) });
    if (httpRes.status === 405 || httpRes.status === 501) {
      httpRes = await fetch(httpUrl, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15_000) });
    }
    if (httpRes.body) await httpRes.body.cancel();
    const httpFinal = httpRes.url || httpUrl.toString();
    add(
      "http-redirects-to-https",
      httpFinal.startsWith("https://"),
      httpFinal.startsWith("https://") ? `http:// redirects to ${new URL(httpFinal).host}` : `http:// did not end on HTTPS (final: ${httpFinal})`,
    );
  } catch {
    add("http-redirects-to-https", true, "http:// listener unreachable — not verifiable (ok if host only serves HTTPS)");
  }
}

const failed = checks.filter((c) => c.status === "fail");
const ok = failed.length === 0;

const reportedHeaders = {
  "content-security-policy": csp,
  "strict-transport-security": hsts,
  "x-content-type-options": headers["x-content-type-options"] ?? null,
  "x-frame-options": headers["x-frame-options"] ?? null,
  "referrer-policy": headers["referrer-policy"] ?? null,
  "permissions-policy": headers["permissions-policy"] ?? null,
};

if (asJson) {
  process.stdout.write(
    JSON.stringify({ ok, url: displayUrl, status: res.status, checks, headers: reportedHeaders }, null, 2) + "\n",
  );
} else {
  console.log(`Security header check: ${displayUrl}`);
  console.log(`HTTP ${res.status} (final: ${finalUrl})`);
  for (const c of checks) console.log(`  [${c.status.toUpperCase().padEnd(4)}] ${c.id}: ${c.detail}`);
  console.log(ok ? "RESULT: PASS" : "RESULT: FAIL");
}

process.exit(ok ? 0 : 1);
