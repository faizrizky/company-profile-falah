# Security Policy

## Scope

`web-falah` is the public, CMS-driven company profile site (Next.js App Router).
Pages are statically generated from content in the headless CMS
(`company-profile-falah-cms`) and revalidated on demand.

Server-side surface:

- `POST /api/revalidate` — cache purge webhook. Requires `Authorization: Bearer <REVALIDATE_SECRET>`
  (timing-safe compare); only known cache tags are accepted.
- `POST /api/contact` — contact form. Same-origin only, 5 requests / 10 min per IP,
  10 KB body limit, schema validation, honeypot + minimum fill time. Submissions are
  forwarded server-to-server to the CMS with `CMS_CONTACT_API_KEY`; the browser never
  talks to the CMS API.

Content safety:

- CMS content is rendered as text only (no `dangerouslySetInnerHTML`).
- Links are validated in the CMS (only `/path`, `#anchor`, `https:`, `mailto:`, `tel:`),
  which blocks `javascript:` URLs.
- CSP allows images only from this origin and the CMS media origin, and frames only
  from Google Maps.

## Supported Versions

Only the latest commit on `main` is considered supported.

## Reporting a Vulnerability

Please report security issues **privately** — do not open a public issue.

- Preferred: report privately to the repository maintainer (see repository settings).
- A dedicated security contact address is not yet configured. **This is a placeholder — no active security email exists.** Until one is set, use private reporting through the repository owner.

We do not offer a bug bounty and make no SLA on response time. Once a valid report is received we will acknowledge it and communicate a fix timeline where possible.

## Branch Policy

- All changes go through a **pull request** against `main`; direct pushes to `main` are not allowed.
- A PR must pass **all CI checks** (lint, typecheck, security audit, production build) before merge.
- **Force push to `main` is disabled** on the remote; branch deletion on `main` is disabled.
- After merging, the production build is generated from `main`.
