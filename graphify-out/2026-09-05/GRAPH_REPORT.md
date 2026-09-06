# Graph Report - web-falah  (2026-09-03)

## Corpus Check
- 18 files · ~4,855,680 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 184 nodes · 200 edges · 26 communities (13 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- app/page.tsx
- footer.tsx
- devDependencies
- compilerOptions
- dependencies
- package.json
- include
- eslint.config.mjs
- TODO.md (project task list, single source of truth)
- Home Page (desktop + mobile per Figma 968-2924 / 1621-10062)
- next.config.ts
- postcss.config.mjs
- Next.js Project (bootstrapped with create-next-app)
- Design System Tokens in tailwind.config + globals
- Graphify Project Mapping (/graphify .)
- Development Workflow (understand, inspect, plan, implement, verify, fix, update, summarize)
- In-Progress Percentage Reporting ((XX%) suffix on in_progress todos)
- TODO List Task Management
- About Page (desktop + mobile per Figma 866-6849 / 1621-12068)
- Contact Page (desktop + mobile per Figma 866-8712 / 1621-10588)
- Shared Layout Components (header, footer, button)
- Solution Page (desktop + mobile per Figma 866-6466 / 1621-12889)
- Verification: build + lint pass
- about/page.tsx
- solution/page.tsx
- contact/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 22 edges
2. `compilerOptions` - 16 edges
3. `Button()` - 8 edges
4. `scripts` - 5 edges
5. `include` - 5 edges
6. `lib` - 4 edges
7. `Footer()` - 3 edges
8. `Glow()` - 2 edges
9. `Head()` - 2 edges
10. `Leadership()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Head()` --calls--> `cn()`  [EXTRACTED]
  app/about/page.tsx → lib/utils.ts
- `ContactPage()` --calls--> `cn()`  [EXTRACTED]
  app/contact/page.tsx → lib/utils.ts
- `Head()` --calls--> `cn()`  [EXTRACTED]
  app/solution/page.tsx → lib/utils.ts
- `Card()` --calls--> `cn()`  [EXTRACTED]
  app/solution/page.tsx → lib/utils.ts
- `Overview()` --calls--> `cn()`  [EXTRACTED]
  app/solution/page.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Figma-Driven Site Pages (home, solution, about, contact)** — todo_home_page, todo_solution_page, todo_about_page, todo_contact_page [INFERRED 0.75]
- **TODO List Workflow Protocol (management, rules, persistence, progress reporting)** — agents_task_management, agents_todo_list_rules, agents_todo_persistence, agents_progress_reporting [INFERRED 0.85]

## Communities (26 total, 13 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.09
Nodes (18): Certification(), Glow(), Leadership(), A, CERTS, EXPERTS, Glow(), PartnerMarquee() (+10 more)

### Community 1 - "footer.tsx"
Cohesion: 0.14
Nodes (11): metadata, oxanium, poppins, companyLinks, contactInfo, Footer(), socials, solutionLinks (+3 more)

### Community 2 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, tailwindcss (+11 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "dependencies"
Cohesion: 0.13
Nodes (15): class-variance-authority, clsx, lucide-react, next, dependencies, class-variance-authority, clsx, lucide-react (+7 more)

### Community 5 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 6 - "include"
Cohesion: 0.25
Nodes (7): next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

### Community 7 - "eslint.config.mjs"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 8 - "TODO.md (project task list, single source of truth)"
Cohesion: 0.67
Nodes (3): Todo List Immutability Rules (append-only, no restructure), Todo Persistence via TODO.md (single source of truth), TODO.md (project task list, single source of truth)

### Community 9 - "Home Page (desktop + mobile per Figma 968-2924 / 1621-10062)"
Cohesion: 0.67
Nodes (3): app/page.tsx (entry page), Figma Assets Download for Home Page (35 images + 8 crops + SVGs), Home Page (desktop + mobile per Figma 968-2924 / 1621-10062)

### Community 23 - "about/page.tsx"
Cohesion: 0.12
Nodes (9): A, EXPERTS, Head(), ISO_CARDS, LEADERS, PARTNERS_ROW_1, PARTNERS_ROW_2, PROBLEM_CARDS (+1 more)

### Community 24 - "solution/page.tsx"
Cohesion: 0.18
Nodes (7): A, Card(), CARDS, CardType, Head(), Overview(), TABS

### Community 25 - "contact/page.tsx"
Cohesion: 0.18
Nodes (6): A, ContactPage(), FLOWS, Button(), ButtonProps, buttonVariants

## Knowledge Gaps
- **101 isolated node(s):** `A`, `PARTNERS_ROW_1`, `PARTNERS_ROW_2`, `PROBLEM_CARDS`, `VM_CARDS` (+96 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `app/page.tsx` to `solution/page.tsx`, `contact/page.tsx`, `footer.tsx`, `about/page.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `A`, `PARTNERS_ROW_1`, `PARTNERS_ROW_2` to the rest of the system?**
  _101 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._
- **Should `footer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._