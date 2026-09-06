# TODO

## Phase 1 — Domain refactor (Category → Product / CategoryDetail)

- [x] 1. Audit domain relations (Category → Product → ProductDetail) — result: productDetails[0] is the CATEGORY detail of virtual-training-suite (slug = category slug, tabs = product names), consumed only on /solution/virtual-training-suite
- [x] 2. types/category.ts: SolutionCategory → Category; move detail contracts (CategoryDetail/Hero/Tab/Challenge) here; strip them from types/product.ts
- [x] 3. data/category: solutionCategories.ts → categories.ts, export `categories`
- [x] 4. data: product/productDetails.ts → category/categoryDetails.ts, export `categoryDetails`, drop redundant categorySlug field
- [x] 5. lib: lib/category.ts (getCategoryDetailBySlug + categories), lib/product.ts (products) as data bridge
- [x] 6. components: vts Hero/Challenges/Showcase take categorySlug prop + lookup via lib; page passes slug; OverviewSection consumes via lib
- [x] 7. scripts/validate-product-category.mjs: validate new domain model, specific error codes, index-lookup + legacy-name scans, boundaries, --json
- [x] 8. Run pipeline: validate:product-category, typecheck, lint, build; fix issues
- [x] 9. Final report (before/after domain model, file/type/data/component changes, validation results)

## Final pass (no re-refactor: fix validator, audit, verify, pipeline)

- [x] 10. Audit final state: node version, node_modules, product detail route presence, domain relations
- [x] 11. Fix validator: remove runtime .ts import (stable across node versions, no new deps), read-only, --json clean stdout
- [x] 12. Align validator to spec: LEGACY_SYMBOL_REFERENCE, structured output, content baseline (slugs), route relations
- [x] 13. Run complete pipeline: validate:product-category, typecheck, lint, test, build
- [x] 14. Final report: files changed, structure, domain model, validation results, warnings, remaining issues

## Final verification pass (npm ci → validate → typecheck → lint → test → build)

- [x] 15. Restore dependencies via npm ci (lockfile present); verify tsc/eslint/next versions available
- [x] 16. Run validator (human + --json), both exit 0; verify read-only (no data/types/components/app/lockfile changes)
- [x] 17. Run typecheck (npx tsc --noEmit, no typecheck script), lint, tests (check availability), production build
- [x] 18. Final verification report (spec #22) + definition of done (spec #24)
