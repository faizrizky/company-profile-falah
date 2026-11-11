"use client";

import { useMemo, useRef } from "react";

import type { SiteData } from "@/components/blocks/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createProductConfig, type ProductStudioMetadata } from "@/lib/studio/blocks/product";
import {
  productCategoryId,
  productToPuck,
  puckToCategoryShowcase,
  puckToProduct,
  puckToSiblings,
  type SiblingProduct,
} from "@/lib/studio/product";
import type { StudioLang } from "@/lib/studio/strings";
import type { Footer, Navigation, Product, SolutionCategory, User } from "@/types/cms";

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
  /** Its category's Showcase (latest draft): the tabs are edited here too, one per product. */
  category: {
    id: number;
    showcase: NonNullable<SolutionCategory["showcase"]>;
    /** The category's other products: the tab list edits their images. */
    products: Product[];
  } | null;
};

/** The visual editor of a product: its card, among the others of its category. */
export function ProductEditor(props: ProductEditorProps) {
  const hydrated = useHydrated();
  if (!hydrated) return <StudioSkeleton embedded={props.embedded} />;
  return <ProductEditorClient {...props} />;
}

function ProductEditorClient(props: ProductEditorProps) {
  const { product, locale, uiLang, embedded, cmsUrl, siteData, chrome, dictionary, fontClass, category } = props;
  // The category's Showcase and the other products' images as last saved from
  // here: what the tab list is compared with.
  const showcaseRef = useRef(category?.showcase ?? {});
  const siblingsRef = useRef<SiblingProduct[]>(category?.products ?? []);

  const document = useMemo<StudioDocument>(() => {
    const tabsBefore = category?.showcase.tabs ?? [];
    const initialData = productToPuck(product, tabsBefore, category?.products);
    const toProduct = (data: typeof initialData) => puckToProduct(data, product, tabsBefore);
    const snapshot = (data: typeof initialData) =>
      JSON.stringify([
        toProduct(data),
        category && puckToCategoryShowcase(data, category.showcase),
        category && puckToSiblings(data, product, category.products),
      ]);
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
        tabsCategoryId: category?.id ?? null,
        ownTabId: product.showcaseTab ?? null,
      }),
      metadata: {
        ctx: { locale, t: dictionary, data: siteData },
        fontClass,
        chrome,
        product,
        // The cards around this one: the category's products as they are now, drafts included.
        siblings: category?.products ?? [],
      } satisfies ProductStudioMetadata,
      initialData,
      snapshot,
      initialSnapshot: snapshot(initialData),
      changes: toProduct,
      alsoSave: (data) => {
        if (!category) return [];
        const items: ReturnType<NonNullable<StudioDocument["alsoSave"]>> = [];
        const showcase = puckToCategoryShowcase(data, showcaseRef.current);
        if (showcase) {
          items.push({
            collection: "solution-categories",
            id: category.id,
            changes: showcase,
            saved: () => {
              showcaseRef.current = showcase.showcase as typeof showcaseRef.current;
            },
          });
        }
        // The other products whose card was changed in the tab list.
        for (const { id, changes } of puckToSiblings(data, product, siblingsRef.current)) {
          items.push({
            collection: "products",
            id,
            changes,
            saved: () => {
              siblingsRef.current = siblingsRef.current.map((p) =>
                p.id === id ? { ...p, ...changes } : p,
              ) as SiblingProduct[];
            },
          });
        }
        return items;
      },
      livePath: (code) => `/${code}/solution`,
      // One card: nothing to add, move or remove.
      permissions: { insert: false, drag: false, delete: false, duplicate: false },
      leftPanel: false,
      switcher: {
        current: "solution",
        other: (() => {
          const categoryId = productCategoryId(product);
          return categoryId ? { collection: "solution-categories" as const, id: categoryId } : null;
        })(),
      },
    };
  }, [product, uiLang, locale, cmsUrl, siteData, embedded, dictionary, fontClass, chrome, category]);

  return <StudioShell document={document} locale={locale} uiLang={uiLang} embedded={embedded} cmsUrl={cmsUrl} />;
}
