#!/usr/bin/env node
// Copies the CMS's generated Payload types into this repo so the frontend is
// typed against the exact content schema.
//
//   npm run sync:cms-types            (CMS repo checked out next to this one)
//   CMS_REPO=/path/to/cms npm run sync:cms-types
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CMS_REPO = resolve(process.env.CMS_REPO ?? join(ROOT, "..", "company-profile-falah-cms"));
const SOURCE = join(CMS_REPO, "src", "payload-types.ts");
const TARGET = join(ROOT, "types", "cms.ts");

if (!existsSync(SOURCE)) {
  console.error(`payload-types.ts not found at ${SOURCE}. Run "npm run generate:types" in the CMS first.`);
  process.exit(1);
}

copyFileSync(SOURCE, TARGET);
// The generated file augments the `payload` module, which the frontend doesn't install.
const source = readFileSync(TARGET, "utf8").replace(/\ndeclare module 'payload' \{[\s\S]*?\n\}\n?/, "\n");
writeFileSync(TARGET, `// AUTO-GENERATED from the CMS by scripts/sync-cms-types.mjs — do not edit.\n${source}`);
console.log(`Synced ${SOURCE} -> ${TARGET}`);
