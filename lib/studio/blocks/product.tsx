"use client";

import type { ComponentConfig, Config, Data, Fields } from "@puckeditor/core";

import { PageSettingsField } from "@/components/studio/fields";
import { ProductCard } from "@/components/solution/overview-tabs";
import { TabButton } from "@/components/ui/tab-button";
import type { Product } from "@/types/cms";

import { showcaseTabsField } from "./category";
import { createFields, type StudioContext } from "./fields";
import { meta, type AnyProps, type StudioMetadata } from "./metadata";
import { renderStudioRoot } from "./root";
import { ownField, productCategoryId } from "../product";

/** The canvas metadata of a product: the site's, plus the product as it was loaded. */
export type ProductStudioMetadata = StudioMetadata & {
  product: Product;
  /** The other products of the loaded category, latest drafts included. */
  siblings: Product[];
  /** Every product as it is now: the cards of another category the product is moved to. */
  everyProduct: Product[];
};

/** What the product's category tab shows next to it: published products in their dragged order. */
const byOrder = (a: Product, b: Product) => (a._order ?? "").localeCompare(b._order ?? "");

export function createProductConfig(
  context: StudioContext & {
    backPath: string;
    /** The category whose Showcase tabs the card carries (see lib/studio/product.ts). */
    tabsCategoryId: number | null;
    /** The tab of this product: its images are edited in that row, not above it. */
    ownTabId: string | null;
    /** A category's tab list as the editor shows it: a row per tab, the card of its product in it. */
    tabRowsFor: (categoryId: number) => Record<string, unknown>[];
    /** Tabs whose product is still a draft (marked in the list). */
    draftTabIds: string[];
  },
): Config {
  const { lang, locale, cmsUrl, embedded, backPath, data, tabsCategoryId, ownTabId, draftTabIds, tabRowsFor } = context;
  const f = createFields(context);
  const { s, L, text, image, tags, toggle } = f;

  const Card = ({ puck, ...props }: AnyProps & { puck: { metadata: unknown } }) => {
    const { product: base, ctx, everyProduct } = meta(puck) as ProductStudioMetadata;
    const { categories } = ctx.data;
    const categoryId = typeof props.category === "number" ? props.category : productCategoryId(base);

    // The card as the editor holds it (its description, chips and images are edited in the tab list too).
    const cardData = { root: { props: {} }, content: [{ type: "productCard", props }] } as unknown as Data;
    const rows = (Array.isArray(props.tabs) ? props.tabs : []) as {
      id?: string;
      name?: string;
      summary?: string;
      tags?: string[];
      image?: unknown;
      imageMobile?: unknown;
    }[];

    const self = {
      ...base,
      title: props.title as string,
      summary: ownField(cardData, base, "summary") as string,
      tags: ownField(cardData, base, "tags") as string[],
      category: categoryId ?? base.category,
      image: ownField(cardData, base, "image") as never,
      imageMobile: ownField(cardData, base, "imageMobile") as never,
      layout: { wide: Boolean(props.wide), largeTitle: Boolean(props.largeTitle) },
    } as Product;

    // The category's tab as the live Solution overview shows it, the product among its neighbours.
    // Its products as they are now, drafts too (a tab saved a moment ago has a
    // draft product, not yet published): in the loaded category and in another one.
    const around = everyProduct;
    const neighbours = around
      .filter((p) => p.id !== base.id && productCategoryId(p) === categoryId)
      // Their card as the tab list holds it now.
      .map((p) => {
        const row = rows.find((tab) => tab.id && tab.id === p.showcaseTab);
        if (!row) return p;
        return {
          ...p,
          summary: row.summary ?? "",
          tags: row.tags ?? [],
          image: row.image ?? null,
          imageMobile: row.imageMobile ?? null,
        } as Product;
      });
    // A tab just added in the list has no product until the category is saved: its card shows already, last.
    const known = new Set([...around.map((p) => p.showcaseTab), base.showcaseTab]);
    const added = categoryId
      ? rows
          .filter((row) => row.id && !known.has(row.id) && row.name?.trim())
          .map(
            (row) =>
              ({
                id: -1 - rows.indexOf(row),
                title: row.name,
                summary: row.summary ?? "",
                tags: row.tags ?? [],
                image: row.image ?? null,
                imageMobile: row.imageMobile ?? null,
                category: categoryId,
                _order: "\uffff",
              }) as unknown as Product,
          )
      : [];
    const cards = [...neighbours, ...added, self].sort(byOrder);

    return (
      <section className="bg-surface-dark px-6 pb-12.5 pt-12.5 lg:px-page">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4">
          <div role="tablist" className="flex w-full gap-4 overflow-x-auto [scrollbar-width:none]">
            {categories.map((c) => (
              <TabButton
                key={c.id}
                active={c.id === categoryId}
                onClick={() => {}}
                className="md:w-auto md:min-w-0 md:flex-1"
              >
                {c.title}
              </TabButton>
            ))}
          </div>
          <div role="tabpanel" className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {cards.map((p, index) => (
              <ProductCard key={p.id} product={p} first={index === 0} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  /**
   * The card's form; the tab choices follow the chosen category. For the
   * loaded category they are the tab list below, as edited (one tab per
   * product, saved to the category with the card).
   */
  const tabsOf = (liveTabs: unknown, categoryId: number) =>
    (liveTabs ?? data.categories.find((c) => c.id === categoryId)?.showcase?.tabs ?? []) as {
      id?: string | null;
      name?: string | null;
    }[];

  const cardFields = (categoryId: number, liveTabs?: unknown): Fields<AnyProps> => {
    // The tab list is the chosen category's: its cards, as products, in this category's order.
    const own = Number.isFinite(categoryId);
    // This product's own tab exists in its category only.
    const ownRow =
      categoryId === tabsCategoryId && Boolean(ownTabId) && tabsOf(liveTabs, categoryId).some((t) => t.id === ownTabId);
    const tabs = tabsOf(liveTabs, categoryId);
    return {
      title: text("Title", "Judul"),
      // With its tab in the list, its description, chips and images are edited in that row (not twice).
      ...(ownRow
        ? {}
        : {
            summary: {
              type: "textarea",
              label: L("Short description (on hover)", "Deskripsi singkat (saat di-hover)"),
            },
            tags: tags("Recommended for (chips, on hover)", "Direkomendasikan untuk (chip, saat di-hover)"),
            image: image("Image", "Gambar"),
            imageMobile: image("Image (mobile)", "Gambar (HP)"),
          }),
      category: {
        type: "select",
        label: L("Category", "Kategori"),
        options: data.categories.map((c) => ({ label: c.title, value: c.id })),
      },
      showcaseTab: {
        type: "select",
        label: L("Card opens tab", "Kartu membuka tab"),
        options: [
          { label: L("Automatic (the tab named like the product)", "Otomatis (tab yang bernama sama)"), value: "" },
          ...tabs.filter((t) => t.id).map((t) => ({ label: t.name || "…", value: t.id as string })),
        ],
      },
      ...(own
        ? {
            tabs: showcaseTabsField(f, true, ownTabId, draftTabIds),
          }
        : {}),
      wide: toggle("Wide (2 columns on desktop)", "Lebar (2 kolom di desktop)"),
      largeTitle: toggle("Large title", "Judul besar"),
    };
  };

  const components: Record<string, ComponentConfig<AnyProps>> = {
    productCard: {
      label: L("Product card", "Kartu produk"),
      fields: cardFields(Number.NaN),
      resolveFields: (item) => cardFields(Number(item.props.category), item.props.tabs),
      // Another category chosen: the list shows that category's cards.
      resolveData: ({ props }, { lastData }) =>
        lastData && Number(lastData.props.category) !== Number(props.category)
          ? { props: { ...props, showcaseTab: "", tabs: tabRowsFor(Number(props.category)) } }
          : { props },
      render: Card as never,
    },
  };

  return {
    components,
    root: {
      fields: {
        settings: {
          type: "custom",
          label: L("Editor", "Editor"),
          render: () => (
            <>
              <PageSettingsField
                lang={lang}
                locale={locale}
                cmsUrl={cmsUrl}
                backPath={backPath}
                embedded={embedded}
                s={s}
              />
              <p className="studio-note">
                {L(
                  "The card as it appears in Solution overview and the menu. The order is set by dragging in the list. The first card of a category is always the big one (2 columns, large title).",
                  "Kartu seperti di Solution overview dan menu. Urutan diatur dengan menggeser di daftar. Kartu pertama tiap kategori selalu yang besar (2 kolom, judul besar).",
                )}
              </p>
            </>
          ),
        },
      },
      render: renderStudioRoot,
    },
  };
}
