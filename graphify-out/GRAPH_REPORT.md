# Graph Report - web-falah  (2026-09-05)

## Corpus Check
- 60 files · ~5,129,835 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 260 nodes · 473 edges · 21 communities (12 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- home/shared.tsx
- layout.tsx
- devDependencies
- compilerOptions
- dependencies
- validate-product-category.mjs
- button.tsx
- eslint.config.mjs
- Todo List Immutability Rules (append-only, no restructure)
- app/page.tsx (entry page)
- next.config.ts
- postcss.config.mjs
- Next.js Project (bootstrapped with create-next-app)
- cn
- Todo Persistence via TODO.md (single source of truth)
- Development Workflow (understand, inspect, plan, implement, verify, fix, update, summarize)
- In-Progress Percentage Reporting ((XX%) suffix on in_progress todos)
- TODO List Task Management
- about/page.tsx
- OverviewSection.tsx
- contact/shared.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 25 edges
2. `Button()` - 16 edges
3. `compilerOptions` - 16 edges
4. `Glow()` - 11 edges
5. `Head()` - 11 edges
6. `A` - 9 edges
7. `A` - 8 edges
8. `SectionHeader()` - 8 edges
9. `Section()` - 7 edges
10. `useDelayedUnmount()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Card()` --calls--> `cn()`  [EXTRACTED]
  components/sections/solution/OverviewSection.tsx → lib/utils.ts
- `Glow()` --calls--> `cn()`  [EXTRACTED]
  components/common/section-ui.tsx → lib/utils.ts
- `Head()` --calls--> `cn()`  [EXTRACTED]
  components/common/section-ui.tsx → lib/utils.ts
- `LeadershipSection()` --calls--> `cn()`  [EXTRACTED]
  components/sections/about/LeadershipSection.tsx → lib/utils.ts
- `WorkflowSection()` --calls--> `cn()`  [EXTRACTED]
  components/sections/contact/WorkflowSection.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **TODO List Workflow Protocol (management, rules, persistence, progress reporting)** — agents_task_management, agents_todo_list_rules, agents_todo_persistence, agents_progress_reporting [INFERRED 0.85]

## Communities (21 total, 9 thin omitted)

### Community 0 - "home/shared.tsx"
Cohesion: 0.15
Nodes (20): FaqAccordion(), faqs, CertSection(), CtaSection(), DemoSection(), ExpertsSection(), FaqSection(), HeroSection() (+12 more)

### Community 1 - "layout.tsx"
Cohesion: 0.20
Nodes (7): metadata, oxanium, poppins, companyLinks, Footer(), socials, solutionLinks

### Community 2 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, tailwindcss (+11 more)

### Community 3 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 4 - "dependencies"
Cohesion: 0.08
Nodes (24): class-variance-authority, clsx, lucide-react, next, dependencies, class-variance-authority, clsx, lucide-react (+16 more)

### Community 5 - "validate-product-category.mjs"
Cohesion: 0.10
Nodes (14): categorySlugs, DATASETS, detailSlugs, errors, ICON_KEYS, JSON_MODE, ROOT, seen (+6 more)

### Community 6 - "button.tsx"
Cohesion: 0.23
Nodes (10): ChallengesSection(), ICONS, CtaSection(), HeroSection(), pill, ShowcaseSection(), Button(), ButtonProps (+2 more)

### Community 7 - "eslint.config.mjs"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 13 - "cn"
Cohesion: 0.21
Nodes (14): CertificateButton(), CERTS, A, Certification(), ISO_CARDS, featuredCard, Navbar(), navLinks (+6 more)

### Community 23 - "about/page.tsx"
Cohesion: 0.19
Nodes (16): Glow(), Head(), CtaSection(), A, EXPERTS, LEADERS, PARTNERS_ROW_1, PARTNERS_ROW_2 (+8 more)

### Community 24 - "OverviewSection.tsx"
Cohesion: 0.13
Nodes (14): A, CtaSection(), HeroSection(), Card(), OverviewSection(), solutionCategories, products, SolutionCategory (+6 more)

### Community 25 - "contact/shared.tsx"
Cohesion: 0.17
Nodes (11): FormSection(), MapSection(), A, Fields(), FLOWS, Head(), WHATSAPP_TEXT, WhatsAppButton() (+3 more)

## Knowledge Gaps
- **95 isolated node(s):** `oxanium`, `poppins`, `metadata`, `CERTS`, `A` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `home/shared.tsx`, `button.tsx`, `about/page.tsx`, `OverviewSection.tsx`, `contact/shared.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `home/shared.tsx`, `cn`, `about/page.tsx`, `OverviewSection.tsx`, `contact/shared.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `dependencies`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `oxanium`, `poppins`, `metadata` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `home/shared.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14516129032258066 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._