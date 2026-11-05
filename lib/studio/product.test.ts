import { describe, expect, it } from "vitest";

import {
  productCategoryId,
  productToPuck,
  puckToCategoryShowcase,
  puckToProduct,
  puckToSiblingImages,
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
    // t1 is this product's; t2 is another product's, with its own images.
    const sibling = { id: 9, showcaseTab: "t2", image: { id: 21 }, imageMobile: null } as never;
    const siblings = [sibling] as never[];
    const rowsOf = (data: ReturnType<typeof productToPuck>) =>
      (data.content[0].props as { tabs: Record<string, unknown>[] }).tabs;

    it("lists each tab with the images of its product", () => {
      const rows = rowsOf(productToPuck(product, tabs, siblings));
      expect(rows).toEqual([
        { id: "t1", name: "Virtual Operational Training", image: media, imageMobile: null },
        { id: "t2", name: "Virtual Maintenance Training", image: { id: 21 }, imageMobile: null },
      ]);
    });

    it("saves nothing else when the names, order and images are as loaded", () => {
      const data = productToPuck(product, tabs, siblings);
      expect(puckToCategoryShowcase(data, showcase)).toBeNull();
      expect(puckToSiblingImages(data, product, siblings)).toEqual([]);
    });

    it("renames and reorders tabs, keeping everything else each tab had", () => {
      const data = productToPuck(product, tabs, siblings);
      const [own, other] = rowsOf(data);
      (data.content[0].props as { tabs: unknown }).tabs = [
        { ...other, name: "Maintenance" },
        own,
        { id: "t3", name: "Medical", image: null, imageMobile: null },
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

    it("saves another product's changed image to that product, as an id", () => {
      const data = productToPuck(product, tabs, siblings);
      rowsOf(data)[1].image = { id: 33, createdAt: "2026-01-01" };
      rowsOf(data)[1].imageMobile = { id: 34, createdAt: "2026-01-01" };
      expect(puckToSiblingImages(data, product, siblings)).toEqual([
        { id: 9, changes: { image: 33, imageMobile: 34 } },
      ]);
      // Its own row goes with the product's own save, not as a sibling.
      expect(puckToProduct(data, product, tabs).image).toBe(12);
    });

    it("the product's own image changed in its row is saved like the card's own field", () => {
      const data = productToPuck(product, tabs, siblings);
      rowsOf(data)[0].image = { id: 40, createdAt: "2026-01-01" };
      expect(puckToProduct(data, product, tabs).image).toBe(40);
      // Both changed: the card's own field wins.
      (data.content[0].props as { image: unknown }).image = { id: 41, createdAt: "2026-01-01" };
      expect(puckToProduct(data, product, tabs).image).toBe(41);
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
