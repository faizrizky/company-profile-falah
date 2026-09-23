import type { Data } from "@puckeditor/core";

import { COLUMN_KEYS } from "@/components/blocks/LayoutSection";
import type { Page } from "@/types/cms";

/**
 * The visual editor and the CMS form edit the same thing: `pages.layout`.
 * These two functions translate between Payload's block array and Puck's
 * data shape, losslessly (block ids are kept, so translations stay attached).
 *
 *   Payload: { id, blockType: "hero", title, … }
 *   Puck:    { type: "hero", props: { id, title, … } }
 *
 * Layout Section columns are Payload nested block arrays and Puck slots.
 */

type Block = Page["layout"][number];
type PuckItem = { type: string; props: Record<string, unknown> & { id: string } };

let counter = 0;
const newId = (type: string) => `${type}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

function toPuckItem(block: { blockType: string; id?: string | null; blockName?: string | null }): PuckItem {
  const { blockType, id, blockName: _blockName, ...fields } = block as Record<string, unknown> & {
    blockType: string;
    id?: string | null;
  };
  const props: PuckItem["props"] = { ...fields, id: id || newId(blockType) };

  if (blockType === "layoutSection") {
    for (const key of COLUMN_KEYS) {
      const column = (fields[key] as { blockType: string; id?: string }[] | null | undefined) ?? [];
      props[key] = column.map(toPuckItem);
    }
  }
  return { type: blockType, props };
}

export function layoutToPuck(layout: Page["layout"], title: string): Data {
  return { root: { props: { title } }, content: layout.map(toPuckItem) };
}

/** Upload / relationship values are sent back to the CMS as ids, not the populated documents. */
function toReference(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toReference);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    // Populated Payload documents have a numeric id and timestamps; block/array rows don't.
    if (typeof record.id === "number" && "createdAt" in record) return record.id;
    return Object.fromEntries(Object.entries(record).map(([k, v]) => [k, toReference(v)]));
  }
  return value;
}

function fromPuckItem(item: PuckItem): Record<string, unknown> {
  const { id, ...props } = item.props;
  const block: Record<string, unknown> = { id, blockType: item.type };

  for (const [key, value] of Object.entries(props)) {
    if (item.type === "layoutSection" && (COLUMN_KEYS as readonly string[]).includes(key)) {
      block[key] = ((value as PuckItem[] | undefined) ?? []).map(fromPuckItem);
    } else {
      block[key] = toReference(value);
    }
  }
  return block;
}

/** Page title edited in the "Page" panel (Puck root). */
export const puckTitle = (data: Data, fallback: string): string => {
  const title = (data.root as { props?: { title?: unknown } }).props?.title;
  return typeof title === "string" && title.trim() ? title.trim() : fallback;
};

/** Small building blocks (usable on the page and inside Layout Section columns). */
export const ELEMENT_TYPES = ["badge", "heading", "paragraph", "image", "button", "card", "spacer"];

export function puckToLayout(data: Data): Page["layout"] {
  return (data.content as PuckItem[]).map(fromPuckItem) as unknown as Block[];
}
