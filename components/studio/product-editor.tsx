"use client";

import { useMemo, useRef } from "react";

import type { SiteData } from "@/components/blocks/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createProductConfig, type ProductStudioMetadata } from "@/lib/studio/blocks/product";
import {
  productCategoryId,
  productProps,
  productToPuck,
  tabRowsOf,
  type TabRow,
  puckToCategoryShowcase,
  puckToProduct,
  hasWaitingDrafts,
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
  /** Every product as it is now (drafts too): the cards of the category it is moved to. */
  allProducts: Product[];
  /** Every category's Showcase (latest draft): its tabs, when the product is moved to it. */
  allShowcases: { id: number; showcase: NonNullable<SolutionCategory["showcase"]> }[];
};

/** The visual editor of a product: its card, among the others of its category. */
export function ProductEditor(props: ProductEditorProps) {
  const hydrated = useHydrated();
  if (!hydrated) return <StudioSkeleton embedded={props.embedded} />;
  return <ProductEditorClient {...props} />;
}

function ProductEditorClient(props: ProductEditorProps) {
  const {
    product,
    locale,
    uiLang,
    embedded,
    cmsUrl,
    siteData,
    chrome,
    dictionary,
    fontClass,
    category,
    allProducts,
    allShowcases,
  } = props;
  // The category's Showcase and the other products' images as last saved from
  // here: what the tab list is compared with.
  // Per category: the card can be moved to another one, whose tabs are then edited here.
  const showcaseRef = useRef<Record<number, NonNullable<SolutionCategory["showcase"]>>>({});
  const siblingsRef = useRef<Record<number, SiblingProduct[]>>({});

  const document = useMemo<StudioDocument>(() => {
    const tabsBefore = category?.showcase.tabs ?? [];
    const initialData = productToPuck(product, tabsBefore, category?.products);
    // The category the card is in: loaded, or the one it was moved to in the editor.
    const chosen = (data: typeof initialData) => {
      const picked = productProps(data).category;
      return typeof picked === "number" ? picked : (category?.id ?? null);
    };
    const showcaseAt = (id: number) =>
      id === category?.id ? category.showcase : (allShowcases.find((c) => c.id === id)?.showcase ?? {});
    const productsAt = (id: number): SiblingProduct[] =>
      id === category?.id
        ? category.products
        : allProducts.filter((p) => p.id !== product.id && productCategoryId(p) === id);
    const showcaseNow = (id: number) => showcaseRef.current[id] ?? showcaseAt(id);
    const siblingsNow = (id: number) => siblingsRef.current[id] ?? productsAt(id);
    const toProduct = (data: typeof initialData) =>
      puckToProduct(data, product, chosen(data) === category?.id ? tabsBefore : []);
    const snapshot = (data: typeof initialData) => {
      const id = chosen(data);
      return JSON.stringify([
        toProduct(data),
        id && puckToCategoryShowcase(data, showcaseAt(id)),
        id && puckToSiblings(data, product, productsAt(id)),
      ]);
    };
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
        tabRowsFor: (id) => tabRowsOf(product, (showcaseNow(id).tabs ?? []) as TabRow[], siblingsNow(id)),
        draftTabIds: allProducts
          .filter((p) => p._status === "draft" && p.showcaseTab)
          .map((p) => p.showcaseTab as string),
      }),
      metadata: {
        ctx: { locale, t: dictionary, data: siteData },
        fontClass,
        chrome,
        product,
        // The cards around this one: the products as they are now, drafts included.
        siblings: category?.products ?? [],
        everyProduct: allProducts,
      } satisfies ProductStudioMetadata,
      initialData,
      snapshot,
      initialSnapshot: snapshot(initialData),
      changes: toProduct,
      alsoSave: (data, publish) => {
        const id = chosen(data);
        if (!id) return [];
        const items: ReturnType<NonNullable<StudioDocument["alsoSave"]>> = [];
        const showcase = puckToCategoryShowcase(data, showcaseNow(id));
        if (showcase) {
          items.push({
            collection: "solution-categories",
            id,
            changes: showcase,
            saved: () => {
              showcaseRef.current[id] = showcase.showcase as NonNullable<SolutionCategory["showcase"]>;
            },
          });
        }
        // The other products changed in the tab list, and on Publish the ones waiting as drafts.
        for (const { id: siblingId, changes, publishable } of puckToSiblings(data, product, siblingsNow(id), publish)) {
          items.push({
            collection: "products",
            id: siblingId,
            changes,
            // Without its image a product can't be published: saved as a draft.
            publish: publishable,
            saved: () => {
              siblingsRef.current[id] = siblingsNow(id).map((p) =>
                p.id === siblingId
                  ? { ...p, ...changes, ...(publish && publishable ? { _status: "published" } : {}) }
                  : p,
              ) as SiblingProduct[];
            },
          });
        }
        return items;
      },
      otherDraftsPending: hasWaitingDrafts(category?.products ?? []),
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
  }, [
    product,
    uiLang,
    locale,
    cmsUrl,
    siteData,
    embedded,
    dictionary,
    fontClass,
    chrome,
    category,
    allProducts,
    allShowcases,
  ]);

  return <StudioShell document={document} locale={locale} uiLang={uiLang} embedded={embedded} cmsUrl={cmsUrl} />;
}
