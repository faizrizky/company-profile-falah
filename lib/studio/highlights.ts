import type { Page } from "@/types/cms";

import { randomId } from "./random-id";

/**
 * "Solution highlights" has a featured card (a group) and up to 7 small cards
 * (an array) in the CMS. The visual editor shows them as one list, `cards`:
 * the first is the big card, the rest are the small ones.
 *
 *   CMS:  { featured: { image, title, description, tagsLabel, tags, button: { label, href } },
 *           items: [{ id, image, title, description, tags, href }] }
 *   Puck: { tagsLabel, buttonLabel, cards: [{ id, image, title, description, tags, href }] }
 *
 * The featured card is stored apart from the items (its texts per language
 * live in the block, the items' in their own rows), so a card can't move
 * between the two without its other-language texts staying behind. The
 * featured card therefore keeps the first place however the list is dragged.
 */

type Highlights = Extract<Page["layout"][number], { blockType: "solutionHighlights" }>;
type Card = {
  id?: string | null;
  image?: unknown;
  title?: unknown;
  description?: unknown;
  tags?: unknown;
  href?: unknown;
};
type Props = Record<string, unknown>;

/** Row id of the featured card in the editor's list. */
export const FEATURED_ID = "featured";

const list = (value: unknown): Card[] => (Array.isArray(value) ? (value as Card[]) : []);

/** CMS block fields → the editor's props. */
export function highlightsToProps(fields: Record<string, unknown>): Props {
  const { featured, items, ...rest } = fields as Pick<Highlights, "featured" | "items"> & Props;
  const big = (featured ?? {}) as NonNullable<Highlights["featured"]>;
  const first: Card = {
    id: FEATURED_ID,
    image: big.image ?? null,
    title: big.title ?? "",
    description: big.description ?? "",
    tags: big.tags ?? [],
    href: big.button?.href ?? "",
  };
  return {
    ...rest,
    tagsLabel: big.tagsLabel ?? "",
    buttonLabel: big.button?.label ?? "",
    cards: [first, ...list(items)],
  };
}

/** The editor's props → CMS block fields (`featured` first, the rest as `items`). */
export function highlightsFromProps(props: Props): Props {
  const { cards, tagsLabel, buttonLabel, ...rest } = props;
  const all = list(cards);
  // The featured card stays first; with none (it was deleted) the first card takes its place.
  const first = all.find((card) => card.id === FEATURED_ID) ?? all[0];
  const others = all.filter((card) => card !== first);
  return {
    ...rest,
    featured: {
      image: first?.image ?? null,
      title: first?.title ?? "",
      description: first?.description ?? "",
      tagsLabel: tagsLabel ?? "",
      tags: first?.tags ?? [],
      button: { label: buttonLabel ?? "", href: first?.href ?? "" },
    },
    items: others.map((card) => ({
      // A copy of the featured card still has its id: the CMS gets a new one.
      id: card.id === FEATURED_ID ? randomId().replace(/-/g, "").slice(0, 24) : card.id,
      image: card.image ?? null,
      title: card.title ?? "",
      description: card.description ?? "",
      tags: card.tags ?? [],
      href: card.href ?? "",
    })),
  };
}
