"use client";

import { useMemo } from "react";

import type { SiteData } from "@/components/blocks/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createProductConfig, type ProductStudioMetadata } from "@/lib/studio/blocks/product";
import { productToPuck, puckToProduct } from "@/lib/studio/product";
import type { StudioLang } from "@/lib/studio/strings";
import type { Footer, Navigation, Product, User } from "@/types/cms";

import { StudioShell, useHydrated, type StudioDocument } from "./studio-shell";
import { StudioSkeleton } from "./studio-skeleton";

export type ProductEditorProps = {
  product: Product;
  locale: Locale;
  uiLang: StudioLang;
  embedded: boolean;
  user: Pick<User, "email" | "name">;
  cmsUrl: string;
  siteData: SiteData;
  chrome: { navigation: Navigation | null; footer: Footer | null };
  dictionary: Dictionary;
  fontClass: string;
};

/** The visual editor of a product: its card, among the others of its category. */
export function ProductEditor(props: ProductEditorProps) {
  const hydrated = useHydrated();
  if (!hydrated) return <StudioSkeleton embedded={props.embedded} />;
  return <ProductEditorClient {...props} />;
}

function ProductEditorClient(props: ProductEditorProps) {
  const { product, locale, uiLang, embedded, cmsUrl, siteData, chrome, dictionary, fontClass } = props;

  const document = useMemo<StudioDocument>(() => {
    const initialData = productToPuck(product);
    const snapshot = (data: typeof initialData) => JSON.stringify(puckToProduct(data, product));
    return {
      collection: "products",
      id: product.id,
      title: product.title,
      status: product._status,
      config: createProductConfig({
        lang: uiLang,
        locale,
        cmsUrl,
        data: siteData,
        pageId: product.id,
        embedded,
        linkGroups: [],
        backPath: `/admin/collections/products/${product.id}/form`,
      }),
      metadata: {
        ctx: { locale, t: dictionary, data: siteData },
        fontClass,
        chrome,
        product,
      } satisfies ProductStudioMetadata,
      initialData,
      snapshot,
      initialSnapshot: snapshot(initialData),
      changes: (data) => puckToProduct(data, product),
      livePath: (code) => `/${code}/solution`,
      // One card: nothing to add, move or remove.
      permissions: { insert: false, drag: false, delete: false, duplicate: false },
      leftPanel: false,
    };
  }, [product, uiLang, locale, cmsUrl, siteData, embedded, dictionary, fontClass, chrome]);

  return <StudioShell document={document} locale={locale} uiLang={uiLang} embedded={embedded} cmsUrl={cmsUrl} />;
}
