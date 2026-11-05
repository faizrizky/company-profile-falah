import "server-only";

import type { CategoryEditorProps } from "@/components/studio/category-editor";
import type { ProductEditorProps } from "@/components/studio/product-editor";
import { getFooter, getNavigation, getSiteData } from "@/lib/cms/queries";
import { env } from "@/lib/env";
import { fontVariables } from "@/lib/fonts";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPublicUrl } from "@/lib/studio/auth";
import { buildLinkGroups } from "@/lib/studio/load";
import type { StudioLang } from "@/lib/studio/strings";
import { productCategoryId, type SiblingProduct } from "@/lib/studio/product";
import type { Product, SolutionCategory, User } from "@/types/cms";

/** The documents the editor opens besides pages. */
export type StudioDocumentCollection = "solution-categories" | "products";

export type StudioDocumentLoad =
  | { status: "ok"; collection: "solution-categories"; props: CategoryEditorProps }
  | { status: "ok"; collection: "products"; props: ProductEditorProps }
  | { status: "login" }
  | { status: "notFound" };

type Input = {
  collection: StudioDocumentCollection;
  id: number;
  locale: Locale;
  uiLang: StudioLang;
  embedded: boolean;
  authorization: string;
  user: User;
};

/** Everything the editor needs for one category or product, fetched with the editor's own session. */
export async function loadStudioDocument({
  collection,
  id,
  locale,
  uiLang,
  embedded,
  authorization,
  user,
}: Input): Promise<StudioDocumentLoad> {
  if (!Number.isInteger(id) || id <= 0 || !env.CMS_URL) return { status: "notFound" };

  // Latest draft, with the editor's own session so CMS access rules apply.
  const url = new URL(`/api/${collection}/${id}`, env.CMS_URL);
  url.search = new URLSearchParams({ draft: "true", depth: "2", locale, "fallback-locale": defaultLocale }).toString();
  const res = await fetch(url, { headers: { authorization }, cache: "no-store" });
  if (res.status === 401 || res.status === 403) return { status: "login" };
  if (!res.ok) return { status: "notFound" };
  const doc = await res.json();

  const [siteData, navigation, footer] = await Promise.all([
    getSiteData(locale),
    getNavigation(locale),
    getFooter(locale),
  ]);
  const shared = {
    locale,
    uiLang,
    embedded,
    user: { email: user.email, name: user.name },
    cmsUrl: cmsPublicUrl(),
    siteData,
    chrome: { navigation, footer },
    dictionary: getDictionary(locale),
    fontClass: fontVariables,
  };

  if (collection === "solution-categories") {
    const [linkGroups, firstProductId] = await Promise.all([
      buildLinkGroups(authorization, locale, uiLang, siteData.categories, navigation),
      firstProductOf(id, authorization),
    ]);
    return {
      status: "ok",
      collection,
      props: { ...shared, category: doc as SolutionCategory, linkGroups, firstProductId },
    };
  }
  const product = doc as Product;
  return {
    status: "ok",
    collection,
    props: { ...shared, product, category: await categoryShowcaseOf(product, locale, authorization) },
  };
}

/** The category's first product (drafts included), for Solution | Product; null when it has none. */
async function firstProductOf(categoryId: number, authorization: string): Promise<number | null> {
  const url = new URL("/api/products", env.CMS_URL);
  url.search = new URLSearchParams({
    "where[category][equals]": String(categoryId),
    sort: "_order",
    limit: "1",
    depth: "0",
    draft: "true",
    "select[id]": "true",
  }).toString();
  const res = await fetch(url, { headers: { authorization }, cache: "no-store" }).catch(() => null);
  if (!res?.ok) return null;
  const { docs } = (await res.json()) as { docs?: { id: number }[] };
  return docs?.[0]?.id ?? null;
}

/**
 * The product's category Showcase (latest draft) and the category's products
 * with their images (media populated for the previews, saved back as ids): the
 * product editor edits the tabs, and the images of each tab's product. Null
 * without a category.
 */
async function categoryShowcaseOf(
  product: Product,
  locale: Locale,
  authorization: string,
): Promise<{ id: number; showcase: NonNullable<SolutionCategory["showcase"]>; products: SiblingProduct[] } | null> {
  const id = productCategoryId(product);
  if (!id) return null;
  const get = (path: string, params: Record<string, string>) => {
    const url = new URL(path, env.CMS_URL);
    url.search = new URLSearchParams({
      draft: "true",
      depth: "1",
      locale,
      "fallback-locale": defaultLocale,
      ...params,
    }).toString();
    return fetch(url, { headers: { authorization }, cache: "no-store" }).catch(() => null);
  };
  const [categoryRes, productsRes] = await Promise.all([
    get(`/api/solution-categories/${id}`, { "select[showcase]": "true" }),
    get("/api/products", {
      "where[category][equals]": String(id),
      sort: "_order",
      limit: "100",
      "select[showcaseTab]": "true",
      "select[image]": "true",
      "select[imageMobile]": "true",
    }),
  ]);
  if (!categoryRes?.ok) return null;
  const category = (await categoryRes.json()) as Pick<SolutionCategory, "showcase">;
  const products = productsRes?.ok ? (((await productsRes.json()) as { docs?: SiblingProduct[] }).docs ?? []) : [];
  return { id, showcase: category.showcase ?? {}, products: products.filter((p) => p.id !== product.id) };
}
