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

## Project Structure

```text
app/
├── about/
├── contact/
├── solution/
└── ...

components/
├── about/
├── common/
├── contact/
├── home/
├── layout/
├── product/
├── sections/
└── ui/

data/
├── category/
│   ├── categories.ts
│   └── categoryDetails.ts
└── product/
    └── products.ts

types/
├── category.ts
├── product.ts
└── ...

lib/
├── category.ts
├── product.ts
└── ...

scripts/
├── validate-product-category.*
├── security-audit.*
└── security-http-check.*
```

## Branch & Release Policy

- All changes are merged to `main` **via pull request** — direct pushes to `main` are not allowed.
- A PR is only mergeable when **all CI checks pass** (lint, typecheck, product-category validation, security audit, production build). See `.github/workflows/ci.yml`.
- **Force push to `main` is disabled** on the remote; **deletion of `main` is disabled**.
- The production site is built and deployed from `main` only.
- Security reporting and scope: see [SECURITY.md](./SECURITY.md).
