import "server-only";

import { cache } from "react";

import { cmsConfigured, cmsFetch, type PaginatedDocs } from "@/lib/cms/client";
import type { CmsTag } from "@/lib/cms/tags";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type {
  Certification,
  Footer,
  Navigation,
  Page,
  Partner,
  Product,
  SiteSetting,
  SolutionCategory,
} from "@/types/cms";

// Pages embed media, partners and certifications; any of them changing must
// refresh the page.
const PAGE_TAGS: CmsTag[] = ["pages", "media", "partners", "certifications"];

const published = { "where[_status][equals]": "published" };
const inLocale = (locale: Locale) => ({ locale, "fallback-locale": defaultLocale });

export const getPage = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  if (!cmsConfigured) return null;
  const { docs } = await cmsFetch<PaginatedDocs<Page>>("/api/pages", {
    query: { ...published, ...inLocale(locale), "where[slug][equals]": slug, depth: 2, limit: 1 },
    tags: PAGE_TAGS,
  });
  return docs[0] ?? null;
});

export async function getPageSlugs(): Promise<string[]> {
  if (!cmsConfigured) return [];
  const { docs } = await cmsFetch<PaginatedDocs<Pick<Page, "slug">>>("/api/pages", {
    query: { ...published, "select[slug]": true, depth: 0, limit: 200 },
    tags: ["pages"],
  });
  return docs.map((d) => d.slug);
}

export const getSolutionCategories = cache(async (locale: Locale): Promise<SolutionCategory[]> => {
  if (!cmsConfigured) return [];
  const { docs } = await cmsFetch<PaginatedDocs<SolutionCategory>>("/api/solution-categories", {
    query: { ...published, ...inLocale(locale), sort: "_order", depth: 1, limit: 50 },
    tags: ["solution-categories", "media"],
  });
  return docs;
});

export const getSolutionCategory = cache(async (slug: string, locale: Locale) => {
  const categories = await getSolutionCategories(locale);
  return categories.find((c) => c.slug === slug) ?? null;
});

export const getProducts = cache(async (locale: Locale): Promise<Product[]> => {
  if (!cmsConfigured) return [];
  const { docs } = await cmsFetch<PaginatedDocs<Product>>("/api/products", {
    query: { ...inLocale(locale), sort: "_order", depth: 1, limit: 200 },
    tags: ["products", "solution-categories", "media"],
  });
  return docs;
});

export const getPartners = cache(async (): Promise<Partner[]> => {
  if (!cmsConfigured) return [];
  const { docs } = await cmsFetch<PaginatedDocs<Partner>>("/api/partners", {
    query: { sort: "_order", depth: 1, limit: 100 },
    tags: ["partners", "media"],
  });
  return docs;
});

export const getCertifications = cache(async (locale: Locale): Promise<Certification[]> => {
  if (!cmsConfigured) return [];
  const { docs } = await cmsFetch<PaginatedDocs<Certification>>("/api/certifications", {
    query: { ...inLocale(locale), sort: "_order", depth: 1, limit: 50 },
    tags: ["certifications", "media"],
  });
  return docs;
});

export const getSiteSettings = cache(async (locale: Locale): Promise<SiteSetting | null> => {
  if (!cmsConfigured) return null;
  return cmsFetch<SiteSetting>("/api/globals/site-settings", {
    query: { ...inLocale(locale), depth: 1 },
    tags: ["site-settings", "media"],
  });
});

export const getNavigation = cache(async (locale: Locale): Promise<Navigation | null> => {
  if (!cmsConfigured) return null;
  return cmsFetch<Navigation>("/api/globals/navigation", {
    query: { ...inLocale(locale), depth: 1 },
    tags: ["navigation", "media"],
  });
});

export const getFooter = cache(async (locale: Locale): Promise<Footer | null> => {
  if (!cmsConfigured) return null;
  return cmsFetch<Footer>("/api/globals/footer", {
    query: { ...inLocale(locale), depth: 0 },
    tags: ["footer"],
  });
});

/** Shared data some blocks need besides their own fields (logos, categories, contact info…). */
export async function getSiteData(locale: Locale) {
  const [partners, certifications, categories, products, settings] = await Promise.all([
    getPartners(),
    getCertifications(locale),
    getSolutionCategories(locale),
    getProducts(locale),
    getSiteSettings(locale),
  ]);
  return { partners, certifications, categories, products, settings };
}
