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
    const linkGroups = await buildLinkGroups(authorization, locale, uiLang, siteData.categories, navigation);
    return {
      status: "ok",
      collection,
      props: { ...shared, category: doc as SolutionCategory, linkGroups },
    };
  }
  return { status: "ok", collection, props: { ...shared, product: doc as Product } };
}
