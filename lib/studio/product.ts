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
 * the CMS's showcaseSync) as a list: each row is a tab's name and what the
 * tab's product shows on its card in the Solution overview (short description,
 * chips, images). Names and order are saved to the category, the rest to each
 * product.
 */

type Props = Record<string, unknown>;
type Showcase = NonNullable<SolutionCategory["showcase"]>;
export type TabRow = { id?: string | null; name?: string | null } & Record<string, unknown>;
/** A product of the category, as far as the tab list needs it. */
export type SiblingProduct = Pick<
  Product,
  "id" | "showcaseTab" | "image" | "imageMobile" | "summary" | "tags" | "_status"
>;

/** What a tab's row holds of its product's card. */
export const ROW_FIELDS = ["summary", "tags", "image", "imageMobile"] as const;
type RowField = (typeof ROW_FIELDS)[number];

const mediaId = (media: unknown): number | null =>
  media && typeof media === "object"
    ? ((media as { id?: number }).id ?? null)
    : typeof media === "number"
      ? media
      : null;

const text = (value: unknown) => (typeof value === "string" ? value : "");
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

/** One value of a card or row, comparable: media by id, text as text, chips as a list. */
const plain = (key: RowField, value: unknown): string =>
  key === "image" || key === "imageMobile"
    ? String(mediaId(value))
    : key === "tags"
      ? JSON.stringify(list(value))
      : text(value);

export const productCategoryId = (product: Pick<Product, "category">): number | null => {
  const category = product.category as unknown;
  if (category && typeof category === "object") return (category as { id: number }).id;
  return typeof category === "number" ? category : null;
};

const tabRows = (value: unknown): TabRow[] => list(value) as TabRow[];

/** The tab list as the editor holds it: name, and the card of the tab's product. */
export function tabRowsOf(product: Product, tabs: TabRow[], siblings: SiblingProduct[]) {
  return tabs.map((tab) => {
    const owner = tab.id && tab.id === product.showcaseTab ? product : siblings.find((p) => p.showcaseTab === tab.id);
    return {
      id: tab.id,
      name: text(tab.name),
      summary: text(owner?.summary),
      tags: list(owner?.tags),
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
 * A value of the card itself (short description, chips, image, mobile image):
 * its own field, or its row in the tab list when only that was changed (both
 * show the same thing). If both were changed, the card's own field wins.
 */
export function ownField(data: Data, base: Product, key: RowField): unknown {
  const card = productProps(data);
  const row = base.showcaseTab ? tabRows(card.tabs).find((tab) => tab.id === base.showcaseTab) : undefined;
  const fieldChanged = plain(key, card[key]) !== plain(key, base[key]);
  return !fieldChanged && row && plain(key, row[key]) !== plain(key, base[key]) ? row[key] : card[key];
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
    summary: text(ownField(data, base, "summary")),
    tags: toReference(list(ownField(data, base, "tags"))),
    category,
    // Only when changed here: the server may have linked the tab meanwhile (a
    // tab saved with this card, see puckToCategoryShowcase), which an
    // unchanged value would undo.
    ...(text(card.showcaseTab) !== text(base.showcaseTab) && { showcaseTab: text(card.showcaseTab) || null }),
    image: toReference(ownField(data, base, "image") ?? null),
    imageMobile: toReference(ownField(data, base, "imageMobile") ?? null),
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
 * The other products of the category to save with the card: { id, changes } for
 * each, `publishable` when it can be published (a product needs its image).
 *
 * - Those whose card (short description, chips, images) was changed in the tab
 *   list.
 * - On Publish, also those still waiting as drafts (changes saved earlier with
 *   "Save draft" from here), which would otherwise stay drafts for good.
 *
 * (This product's own row goes through puckToProduct.)
 */
export function puckToSiblings(
  data: Data,
  base: Product,
  siblings: SiblingProduct[],
  publish = false,
): { id: number; changes: Record<string, unknown>; publishable: boolean }[] {
  const rows = tabRows(productProps(data).tabs);
  const out: { id: number; changes: Record<string, unknown>; publishable: boolean }[] = [];
  for (const sibling of siblings) {
    const row = rows.find((tab) => tab.id && tab.id === sibling.showcaseTab && tab.id !== base.showcaseTab);
    const changes: Record<string, unknown> = {};
    if (row) {
      for (const key of ROW_FIELDS) {
        if (plain(key, row[key]) === plain(key, sibling[key])) continue;
        changes[key] = key === "summary" ? text(row[key]) : toReference(row[key] ?? (key === "tags" ? [] : null));
      }
    }
    const publishable = mediaId("image" in changes ? changes.image : sibling.image) !== null;
    const waiting = publish && sibling._status === "draft" && publishable;
    if (Object.keys(changes).length || waiting) out.push({ id: sibling.id, changes, publishable });
  }
  return out;
}

/** Whether some other product of the category is a complete draft, waiting to be published. */
export const hasWaitingDrafts = (siblings: SiblingProduct[]): boolean =>
  siblings.some((p) => p._status === "draft" && mediaId(p.image) !== null);
