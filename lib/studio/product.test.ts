import { describe, expect, it } from "vitest";

import {
  hasWaitingDrafts,
  productCategoryId,
  productToPuck,
  puckToCategoryShowcase,
  puckToProduct,
  puckToSiblings,
} from "./product";
import type { Product } from "@/types/cms";

const media = { id: 12, createdAt: "2026-01-01" } as never;

const product = {
  id: 5,
  title: "Virtual Operational Training",
  summary: "Train safely",
  tags: ["Army"],
  category: { id: 2, title: "Suite" },
  showcaseTab: "t1",
  slug: "virtual-operational-training",
  image: media,
  imageMobile: null,
  layout: { wide: true, largeTitle: false },
} as unknown as Product;

describe("product ↔ visual editor", () => {
  it("is one card; the populated category becomes its id", () => {
    const data = productToPuck(product);
    expect(data.content).toHaveLength(1);
    expect(data.content[0].type).toBe("productCard");
    expect((data.content[0].props as { category: number }).category).toBe(2);
    expect(productCategoryId({ category: 9 })).toBe(9);
  });

  it("round-trips unchanged, media as ids (an untouched tab link isn't sent)", () => {
    expect(puckToProduct(productToPuck(product), product)).toEqual({
      title: "Virtual Operational Training",
      summary: "Train safely",
      tags: ["Army"],
      category: 2,
      image: 12,
      imageMobile: null,
      layout: { wide: true, largeTitle: false },
    });
  });

  it("moving to another category and clearing the tab is saved as such", () => {
    const data = productToPuck(product);
    Object.assign(data.content[0].props, { category: 4, showcaseTab: "" });
    const saved = puckToProduct(data, product);
    expect(saved.category).toBe(4);
    expect(saved.showcaseTab).toBeNull();
  });

  it("an emptied title keeps the old one", () => {
    const data = productToPuck(product);
    (data.content[0].props as Record<string, unknown>).title = "   ";
    expect(puckToProduct(data, product).title).toBe("Virtual Operational Training");
  });

  describe("the category's tabs on the card", () => {
    const showcase = {
      background: 7,
      tabs: [
        { id: "t1", name: "Virtual Operational Training", description: "Ops", brochure: 40, video: 61 },
        { id: "t2", name: "Virtual Maintenance Training", description: "Fix" },
      ],
    } as never;
    const tabs = (showcase as { tabs: { id: string; name: string }[] }).tabs;
    // t1 is this product's; t2 is another product's, with its own card.
    const sibling = {
      id: 9,
      showcaseTab: "t2",
      summary: "Keeps jets flying",
      tags: ["Army"],
      image: { id: 21 },
      imageMobile: null,
    };
    const siblings = [sibling] as never[];
    const rowsOf = (data: ReturnType<typeof productToPuck>) =>
      (data.content[0].props as { tabs: Record<string, unknown>[] }).tabs;

    it("lists each tab with the card of its product", () => {
      const rows = rowsOf(productToPuck(product, tabs, siblings));
      expect(rows).toEqual([
        {
          id: "t1",
          name: "Virtual Operational Training",
          summary: "Train safely",
          tags: ["Army"],
          image: media,
          imageMobile: null,
        },
        {
          id: "t2",
          name: "Virtual Maintenance Training",
          summary: "Keeps jets flying",
          tags: ["Army"],
          image: { id: 21 },
          imageMobile: null,
        },
      ]);
    });

    it("saves nothing else when the names, order and cards are as loaded", () => {
      const data = productToPuck(product, tabs, siblings);
      expect(puckToCategoryShowcase(data, showcase)).toBeNull();
      expect(puckToSiblings(data, product, siblings)).toEqual([]);
    });

    it("renames and reorders tabs, keeping everything else each tab had", () => {
      const data = productToPuck(product, tabs, siblings);
      const [own, other] = rowsOf(data);
      (data.content[0].props as { tabs: unknown }).tabs = [
        { ...other, name: "Maintenance" },
        own,
        { id: "t3", name: "Medical", summary: "", tags: [], image: null, imageMobile: null },
      ];
      const changes = puckToCategoryShowcase(data, showcase) as {
        showcase: { background: number; tabs: Record<string, unknown>[] };
      };
      expect(changes.showcase.background).toBe(7);
      expect(changes.showcase.tabs).toEqual([
        { id: "t2", name: "Maintenance", description: "Fix" },
        { id: "t1", name: "Virtual Operational Training", description: "Ops", brochure: 40, video: 61 },
        { id: "t3", name: "Medical" },
      ]);
    });

    it("saves another product's changed description, chips and images to that product", () => {
      const data = productToPuck(product, tabs, siblings);
      Object.assign(rowsOf(data)[1], {
        summary: "Keeps jets and trucks flying",
        tags: ["Army", "Navy"],
        image: { id: 33, createdAt: "2026-01-01" },
        imageMobile: { id: 34, createdAt: "2026-01-01" },
      });
      expect(puckToSiblings(data, product, siblings)).toEqual([
        {
          id: 9,
          changes: { summary: "Keeps jets and trucks flying", tags: ["Army", "Navy"], image: 33, imageMobile: 34 },
          publishable: true,
        },
      ]);
      // Its own row goes with the product's own save, not as a sibling.
      expect(puckToProduct(data, product, tabs).image).toBe(12);
    });

    it("saves only what changed of another product", () => {
      const data = productToPuck(product, tabs, siblings);
      rowsOf(data)[1].tags = ["Army", "Navy"];
      expect(puckToSiblings(data, product, siblings)).toEqual([
        { id: 9, changes: { tags: ["Army", "Navy"] }, publishable: true },
      ]);
    });

    it("the product's own description, chips and image changed in its row are saved like its own fields", () => {
      const data = productToPuck(product, tabs, siblings);
      Object.assign(rowsOf(data)[0], {
        summary: "Train very safely",
        tags: ["Army", "Air"],
        image: { id: 40, createdAt: "2026-01-01" },
      });
      const saved = puckToProduct(data, product, tabs);
      expect(saved.summary).toBe("Train very safely");
      expect(saved.tags).toEqual(["Army", "Air"]);
      expect(saved.image).toBe(40);
      // Both changed: the card's own field wins.
      Object.assign(data.content[0].props, { summary: "Card wins", image: { id: 41, createdAt: "2026-01-01" } });
      const both = puckToProduct(data, product, tabs);
      expect(both.summary).toBe("Card wins");
      expect(both.image).toBe(41);
    });

    it("on Publish, a complete draft saved earlier is published too, even with nothing new to save", () => {
      const waiting = [{ ...sibling, _status: "draft" }] as never[];
      const data = productToPuck(product, tabs, waiting);
      // Save draft: nothing changed since, so nothing is sent.
      expect(puckToSiblings(data, product, waiting, false)).toEqual([]);
      // Publish: it goes along.
      expect(puckToSiblings(data, product, waiting, true)).toEqual([{ id: 9, changes: {}, publishable: true }]);
      // Already published: not touched.
      expect(puckToSiblings(productToPuck(product, tabs, siblings), product, siblings, true)).toEqual([]);
    });

    it("a draft without its image can't be published: only saved if changed", () => {
      const noImage = [{ ...sibling, _status: "draft", image: null }] as never[];
      const data = productToPuck(product, tabs, noImage);
      expect(puckToSiblings(data, product, noImage, true)).toEqual([]);
      rowsOf(data)[1].summary = "Edited";
      expect(puckToSiblings(data, product, noImage, true)).toEqual([
        { id: 9, changes: { summary: "Edited" }, publishable: false },
      ]);
      // Choosing its image in the row makes it publishable.
      rowsOf(data)[1].image = { id: 50, createdAt: "2026-01-01" };
      expect(puckToSiblings(data, product, noImage, true)[0].publishable).toBe(true);
    });

    it("tells when complete drafts are waiting (Publish then has something to do)", () => {
      expect(hasWaitingDrafts(siblings)).toBe(false);
      expect(hasWaitingDrafts([{ ...sibling, _status: "draft" }] as never[])).toBe(true);
      expect(hasWaitingDrafts([{ ...sibling, _status: "draft", image: null }] as never[])).toBe(false);
    });

    it("renaming the product's own tab renames the product", () => {
      const data = productToPuck(product, tabs, siblings);
      rowsOf(data)[0].name = "Operations Trainer";
      expect(puckToProduct(data, product, tabs).title).toBe("Operations Trainer");
      // Another product's tab: the card keeps its own title.
      const other = productToPuck(product, tabs, siblings);
      rowsOf(other)[1].name = "Maintenance";
      expect(puckToProduct(other, product, tabs).title).toBe("Virtual Operational Training");
    });
  });
});
