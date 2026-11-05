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
 * the CMS's showcaseSync) as a list: each row is a tab's name and the images
 * of that tab's product (its card, as the Solution overview shows it). Names
 * and order are saved to the category, the images to each product.
 */

type Props = Record<string, unknown>;
type Showcase = NonNullable<SolutionCategory["showcase"]>;
type TabRow = { id?: string | null; name?: string | null } & Record<string, unknown>;
/** A product of the category, as far as the tab list needs it. */
export type SiblingProduct = Pick<Product, "id" | "showcaseTab" | "image" | "imageMobile">;

const mediaId = (media: unknown): number | null =>
  media && typeof media === "object"
    ? ((media as { id?: number }).id ?? null)
    : typeof media === "number"
      ? media
      : null;

const text = (value: unknown) => (typeof value === "string" ? value : "");
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

export const productCategoryId = (product: Pick<Product, "category">): number | null => {
  const category = product.category as unknown;
  if (category && typeof category === "object") return (category as { id: number }).id;
  return typeof category === "number" ? category : null;
};

const tabRows = (value: unknown): TabRow[] => list(value) as TabRow[];

/** The tab list as the editor holds it: name and the images of the tab's product. */
function tabRowsOf(product: Product, tabs: TabRow[], siblings: SiblingProduct[]) {
  return tabs.map((tab) => {
    const owner = tab.id && tab.id === product.showcaseTab ? product : siblings.find((p) => p.showcaseTab === tab.id);
    return {
      id: tab.id,
      name: text(tab.name),
      image: owner?.image ?? null,
      imageMobile: owner?.imageMobile ?? null,
    };
  });
}

export function productToPuck(product: Product, tabs: TabRow[] = [], siblings: SiblingProduct[] = []): Data {
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
          tabs: tabRowsOf(product, tabs, siblings),
        },
      },
    ],
  };
}

export const productProps = (data: Data): Props => (data.content[0]?.props ?? {}) as Props;

/**
 * The card's own image or mobile image: its own field, or its row in the tab
 * list when only that was changed (both show the same picture).
 */
export function ownMedia(data: Data, base: Product, key: "image" | "imageMobile"): unknown {
  const card = productProps(data);
  const row = base.showcaseTab ? tabRows(card.tabs).find((tab) => tab.id === base.showcaseTab) : undefined;
  const fieldChanged = mediaId(card[key]) !== mediaId(base[key]);
  return !fieldChanged && row && mediaId(row[key]) !== mediaId(base[key]) ? row[key] : (card[key] ?? null);
}

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
    image: toReference(ownMedia(data, base, "image")),
    imageMobile: toReference(ownMedia(data, base, "imageMobile")),
    layout: { wide: Boolean(card.wide), largeTitle: Boolean(card.largeTitle) },
  };
}

/**
 * The category's Showcase to save with the card's tab list, or null when the
 * names and order are as loaded. Everything else of a tab (text, chips, videos,
 * brochure) is kept as it was.
 */
export function puckToCategoryShowcase(data: Data, showcase: Showcase): Record<string, unknown> | null {
  const rows = tabRows(productProps(data).tabs);
  const before = (showcase.tabs ?? []) as TabRow[];
  const key = (tabs: TabRow[]) => JSON.stringify(tabs.map((tab) => [tab.id, text(tab.name)]));
  if (key(rows) === key(before)) return null;
  return {
    showcase: toReference({
      ...showcase,
      tabs: rows.map((row) => {
        const base = before.find((tab) => tab.id === row.id);
        return { ...base, id: row.id, name: text(row.name).trim() || text(base?.name) };
      }),
    }),
  };
}

/**
 * The other products of the category whose images were changed in the tab
 * list: { id, changes } for each, to save with the card. (This product's own
 * row goes through puckToProduct.)
 */
export function puckToSiblingImages(
  data: Data,
  base: Product,
  siblings: SiblingProduct[],
): { id: number; changes: Record<string, unknown> }[] {
  const rows = tabRows(productProps(data).tabs);
  const changed: { id: number; changes: Record<string, unknown> }[] = [];
  for (const sibling of siblings) {
    const row = rows.find((tab) => tab.id && tab.id === sibling.showcaseTab && tab.id !== base.showcaseTab);
    if (!row) continue;
    const changes: Record<string, unknown> = {};
    for (const key of ["image", "imageMobile"] as const)
      if (mediaId(row[key]) !== mediaId(sibling[key])) changes[key] = toReference(row[key] ?? null);
    if (Object.keys(changes).length) changed.push({ id: sibling.id, changes });
  }
  return changed;
}
