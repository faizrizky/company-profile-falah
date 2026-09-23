# Falah Company Profile

Official company profile website for Falah, built with Next.js and TypeScript.

The website presents Falah's company information, solutions, products, expertise, and contact channels through a modern responsive interface.

## Overview

This project is the public-facing company profile website for Falah.

It is designed to provide:

- Company information
- Solutions and categories
- Product information
- Product and category details
- Company expertise and certifications
- Contact form
- Responsive desktop and mobile experience

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint
- Node.js

## Content (CMS)

All page content — text, images, section order, navigation, footer, solutions,
products, partners and certifications — is managed in the headless CMS
([`company-profile-falah-cms`](../company-profile-falah-cms), Payload CMS).
This repo only renders it.

- Pages are built from **blocks**: the CMS stores an ordered list of sections
  per page and `components/blocks/RenderBlocks.tsx` maps each block type to a
  React component. Editors can add, remove, reorder and restyle sections
  without a deploy.
- Pages are statically generated and cached. When content is published the
  CMS calls `POST /api/revalidate`, which purges only the affected cache tags,
  so changes go live within seconds.
- The browser never talks to the CMS API. The contact form posts to
  `/api/contact`, which validates, rate-limits and spam-filters the
  submission before forwarding it server-to-server.

### Local development

```bash
cp .env.example .env.local   # fill in the secrets shared with the CMS
npm install
npm run dev -- --port 3002    # CMS runs on 3001
```

After changing the CMS schema, regenerate types in the CMS and sync them:

```bash
npm run sync:cms-types
```

Without `CMS_URL` the site still builds (CI), with pages rendered on demand.

## Project Structure

```text
app/
├── [[...slug]]/          # every CMS page ("/" = slug "home")
├── solution/[category]/  # solution category detail pages
└── api/
    ├── contact/          # contact form → CMS inbox
    └── revalidate/       # cache purge webhook called by the CMS

components/
├── blocks/               # one component per CMS block + RenderBlocks
├── solution-category/    # category detail page sections
├── contact/ about/ home/ solution/ common/ layout/ ui/

lib/
├── cms/                  # server-only CMS client, queries, cache tags, media helpers
├── server/               # rate limiting, timing-safe compare
├── contact-schema.ts     # form validation shared by client and server
└── env.ts                # validated environment

types/cms.ts              # generated from the CMS (npm run sync:cms-types)

scripts/
├── sync-cms-types.mjs
├── security-audit.mjs
└── security-http-check.mjs
```

## Branch & Release Policy

- All changes are merged to `main` **via pull request** — direct pushes to `main` are not allowed.
- A PR is only mergeable when **all CI checks pass** (lint, typecheck, security audit, production build). See `.github/workflows/ci.yml`.
- **Force push to `main` is disabled** on the remote; **deletion of `main` is disabled**.
- The production site is built and deployed from `main` only.
- Security reporting and scope: see [SECURITY.md](./SECURITY.md).
