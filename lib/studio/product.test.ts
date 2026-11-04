import { describe, expect, it } from "vitest";

import { productCategoryId, productToPuck, puckToCategoryShowcase, puckToProduct } from "./product";
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
        { id: "t1", name: "Virtual Operational Training", description: "Ops", brochure: 40 },
        { id: "t2", name: "Virtual Maintenance Training", description: "Fix" },
      ],
    } as never;
    const tabs = (showcase as { tabs: { id: string; name: string }[] }).tabs;
    const withTabs = (rows: { id: string; name: string }[]) => {
      const data = productToPuck(product, tabs);
      (data.content[0].props as { tabs: unknown }).tabs = rows;
      return data;
    };

    it("saves nothing to the category when the tabs are as loaded", () => {
      expect(puckToCategoryShowcase(productToPuck(product, tabs), showcase)).toBeNull();
    });

    it("renames, reorders and adds tabs, keeping what else each tab had", () => {
      const changes = puckToCategoryShowcase(
        withTabs([
          { id: "t2", name: "Maintenance" },
          { id: "t1", name: "Virtual Operational Training" },
          { id: "t3", name: "Medical" },
        ]),
        showcase,
      ) as { showcase: { background: number; tabs: Record<string, unknown>[] } };
      expect(changes.showcase.background).toBe(7);
      expect(changes.showcase.tabs).toEqual([
        { id: "t2", name: "Maintenance", description: "Fix" },
        { id: "t1", name: "Virtual Operational Training", description: "Ops", brochure: 40 },
        { id: "t3", name: "Medical" },
      ]);
    });

    it("renaming the product's own tab renames the product", () => {
      const data = withTabs([
        { id: "t1", name: "Operations Trainer" },
        { id: "t2", name: "Virtual Maintenance Training" },
      ]);
      expect(puckToProduct(data, product, tabs).title).toBe("Operations Trainer");
      // Another product's tab: the card keeps its own title.
      const other = withTabs([
        { id: "t1", name: "Virtual Operational Training" },
        { id: "t2", name: "Maintenance" },
      ]);
      expect(puckToProduct(other, product, tabs).title).toBe("Virtual Operational Training");
    });
  });
});
