import type { Data } from "@puckeditor/core";

import type { Product } from "@/types/cms";

import { toReference } from "./convert";

/**
 * A product is one card (Solution overview, mega menu), so the editor's data
 * is a single item, the card:
 *
 *   CMS:  { title, summary, tags, category, showcaseTab, image, imageMobile, layout: { wide, largeTitle } }
 *   Puck: [ productCard ]
 *
 * The slug and the order stay as they are (the slug is made from the title
 * when the product is created; the order is set by dragging in the list).
 */

type Props = Record<string, unknown>;

const text = (value: unknown) => (typeof value === "string" ? value : "");
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

export const productCategoryId = (product: Pick<Product, "category">): number | null => {
  const category = product.category as unknown;
  if (category && typeof category === "object") return (category as { id: number }).id;
  return typeof category === "number" ? category : null;
};

export function productToPuck(product: Product): Data {
  return {
    root: { props: {} },
    content: [
      {
        type: "productCard",
        props: {
          id: "card",
          title: text(product.title),
          summary: text(product.summary),
          tags: list(product.tags),
          category: productCategoryId(product),
          // Empty: the tab named like the product.
          showcaseTab: text(product.showcaseTab),
          image: product.image ?? null,
          imageMobile: product.imageMobile ?? null,
          wide: Boolean(product.layout?.wide),
          largeTitle: Boolean(product.layout?.largeTitle),
        },
      },
    ],
  };
}

export const productProps = (data: Data): Props => (data.content[0]?.props ?? {}) as Props;

/** The body of a save. */
export function puckToProduct(data: Data, base: Product): Record<string, unknown> {
  const card = productProps(data);
  const category = typeof card.category === "number" ? card.category : productCategoryId(base);
  return {
    title: text(card.title).trim() || base.title,
    summary: text(card.summary),
    tags: toReference(list(card.tags)),
    category,
    showcaseTab: text(card.showcaseTab) || null,
    image: toReference(card.image ?? null),
    imageMobile: toReference(card.imageMobile ?? null),
    layout: { wide: Boolean(card.wide), largeTitle: Boolean(card.largeTitle) },
  };
}
