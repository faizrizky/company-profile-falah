"use client";

import type { ComponentConfig, Config, Fields } from "@puckeditor/core";

import { PageSettingsField } from "@/components/studio/fields";
import { ProductCard } from "@/components/solution/overview-tabs";
import { TabButton } from "@/components/ui/tab-button";
import type { Product } from "@/types/cms";

import { createFields, type StudioContext } from "./fields";
import { meta, type AnyProps, type StudioMetadata } from "./metadata";
import { renderStudioRoot } from "./root";
import { productCategoryId } from "../product";

/** The canvas metadata of a product: the site's, plus the product as it was loaded. */
export type ProductStudioMetadata = StudioMetadata & { product: Product };

/** What the product's category tab shows next to it: published products in their dragged order. */
const byOrder = (a: Product, b: Product) => (a._order ?? "").localeCompare(b._order ?? "");

export function createProductConfig(context: StudioContext & { backPath: string }): Config {
  const { lang, locale, cmsUrl, embedded, backPath, data } = context;
  const f = createFields(context);
  const { s, L, text, image, tags, toggle } = f;

  const Card = ({ puck, ...props }: AnyProps & { puck: { metadata: unknown } }) => {
    const { product: base, ctx } = meta(puck) as ProductStudioMetadata;
    const { categories, products } = ctx.data;
    const categoryId = typeof props.category === "number" ? props.category : productCategoryId(base);

    const self = {
      ...base,
      title: props.title as string,
      summary: props.summary as string,
      tags: props.tags as string[],
      category: categoryId ?? base.category,
      image: props.image as never,
      imageMobile: props.imageMobile as never,
      layout: { wide: Boolean(props.wide), largeTitle: Boolean(props.largeTitle) },
    } as Product;

    // The category's tab as the live Solution overview shows it, the product among its neighbours.
    const neighbours = products.filter((p) => p.id !== base.id && productCategoryId(p) === categoryId);
    const cards = [...neighbours, self].sort(byOrder);

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
            {cards.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  /** The card's form; the tab choices follow the chosen category. */
  const cardFields = (categoryId: number): Fields<AnyProps> => {
    const tabs = data.categories.find((c) => c.id === categoryId)?.showcase?.tabs ?? [];
    return {
      title: text("Title", "Judul"),
      summary: { type: "textarea", label: L("Short description (on hover)", "Deskripsi singkat (saat di-hover)") },
      tags: tags("Recommended for (chips, on hover)", "Direkomendasikan untuk (chip, saat di-hover)"),
      image: image("Image", "Gambar"),
      imageMobile: image("Image (mobile)", "Gambar (HP)"),
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
          ...tabs.filter((t) => t.id).map((t) => ({ label: t.name, value: t.id as string })),
        ],
      },
      wide: toggle("Wide (2 columns on desktop)", "Lebar (2 kolom di desktop)"),
      largeTitle: toggle("Large title", "Judul besar"),
    };
  };

  const components: Record<string, ComponentConfig<AnyProps>> = {
    productCard: {
      label: L("Product card", "Kartu produk"),
      fields: cardFields(Number.NaN),
      resolveFields: (item) => cardFields(Number(item.props.category)),
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
                  "The card as it appears in Solution overview and the menu. The order is set by dragging in the list.",
                  "Kartu seperti di Solution overview dan menu. Urutan diatur dengan menggeser di daftar.",
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
