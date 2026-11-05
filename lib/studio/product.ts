import type { Data } from "@puckeditor/core";

import type { Product, SolutionCategory } from "@/types/cms";

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
 *
 * The card also carries its category's Showcase tabs (one per product, see
 * the CMS's showcaseSync), edited here as on the category page and saved to
 * the category.
 */

type Props = Record<string, unknown>;
type Showcase = NonNullable<SolutionCategory["showcase"]>;
type TabRow = { id?: string | null; name?: string | null } & Record<string, unknown>;

/** A tab as the editor edits it (the Showcase tab list's fields); media stay as loaded. */
const tabProps = (tab: TabRow) => ({
  id: tab.id,
  name: text(tab.name),
  description: text(tab.description),
  tags: list(tab.tags),
  video: tab.video ?? null,
  videoMobile: tab.videoMobile ?? null,
  brochure: tab.brochure ?? null,
});

const text = (value: unknown) => (typeof value === "string" ? value : "");
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

export const productCategoryId = (product: Pick<Product, "category">): number | null => {
  const category = product.category as unknown;
  if (category && typeof category === "object") return (category as { id: number }).id;
  return typeof category === "number" ? category : null;
};

const tabRows = (value: unknown): TabRow[] => list(value) as TabRow[];

export function productToPuck(product: Product, tabs: TabRow[] = []): Data {
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
          tabs: tabs.map(tabProps),
        },
      },
    ],
  };
}

export const productProps = (data: Data): Props => (data.content[0]?.props ?? {}) as Props;

/**
 * The body of a save. `tabsBefore`: the category's tabs as loaded — renaming
 * this product's own tab in the list renames the product too (the server
 * would otherwise rename the tab back to the card's title).
 */
export function puckToProduct(data: Data, base: Product, tabsBefore: TabRow[] = []): Record<string, unknown> {
  const card = productProps(data);
  const category = typeof card.category === "number" ? card.category : productCategoryId(base);
  const ownTab = base.showcaseTab ? tabRows(card.tabs).find((tab) => tab.id === base.showcaseTab) : undefined;
  const ownBefore = tabsBefore.find((tab) => tab.id === base.showcaseTab);
  const tabName = text(ownTab?.name).trim();
  const renamedByTab = ownTab && ownBefore && tabName && tabName !== text(ownBefore.name).trim();
  return {
    title: renamedByTab ? tabName : text(card.title).trim() || base.title,
    summary: text(card.summary),
    tags: toReference(list(card.tags)),
    category,
    // Only when changed here: the server may have linked the tab meanwhile (a
    // tab saved with this card, see puckToCategoryShowcase), which an
    // unchanged value would undo.
    ...(text(card.showcaseTab) !== text(base.showcaseTab) && { showcaseTab: text(card.showcaseTab) || null }),
    image: toReference(card.image ?? null),
    imageMobile: toReference(card.imageMobile ?? null),
    layout: { wide: Boolean(card.wide), largeTitle: Boolean(card.largeTitle) },
  };
}

/**
 * The category's Showcase to save with the card's tabs, or null when they are
 * as loaded (compared field by field, media as ids).
 */
export function puckToCategoryShowcase(data: Data, showcase: Showcase): Record<string, unknown> | null {
  const saved = (rows: TabRow[]) => JSON.stringify(toReference(rows.map(tabProps)));
  const rows = tabRows(productProps(data).tabs);
  const before = (showcase.tabs ?? []) as TabRow[];
  if (saved(rows) === saved(before)) return null;
  return {
    showcase: toReference({
      ...showcase,
      tabs: rows.map((row) => {
        const base = before.find((tab) => tab.id === row.id);
        return { ...base, ...tabProps(row), name: text(row.name).trim() || text(base?.name) };
      }),
    }),
  };
}
