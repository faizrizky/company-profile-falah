/** Cache tags shared with the CMS revalidation hook (CMS `hooks/revalidateFrontend.ts`). */
export const CMS_TAGS = [
  "pages",
  "media",
  "partners",
  "certifications",
  "solution-categories",
  "products",
  "site-settings",
  "navigation",
  "footer",
] as const;

export type CmsTag = (typeof CMS_TAGS)[number];

export const isCmsTag = (value: unknown): value is CmsTag =>
  typeof value === "string" && (CMS_TAGS as readonly string[]).includes(value);
