# Security Policy

## Scope

`web-falah` is a **fully static, prerendered company profile site** (Next.js, `output: "export"`). It contains:

- No backend, no API routes, no server actions
- No database, no authentication, no user sessions
- No third-party scripts, analytics, or external origins
- A decorative contact form that does not transmit data

Security-relevant surface is therefore limited to: static asset integrity, security headers (HSTS, CSP, frame protection), dependency versions, and the build pipeline.

## Supported Versions

Only the latest commit on `main` is considered supported.

## Reporting a Vulnerability

Please report security issues **privately** — do not open a public issue.

- Preferred: report privately to the repository maintainer (see repository settings).
- A dedicated security contact address is not yet configured. **This is a placeholder — no active security email exists.** Until one is set, use private reporting through the repository owner.

We do not offer a bug bounty and make no SLA on response time. Once a valid report is received we will acknowledge it and communicate a fix timeline where possible.

## Branch Policy

- All changes go through a **pull request** against `main`; direct pushes to `main` are not allowed.
- A PR must pass **all CI checks** (lint, typecheck, product-category validation, security audit, production build) before merge.
- **Force push to `main` is disabled** on the remote; branch deletion on `main` is disabled.
- After merging, the production build is generated from `main`.
