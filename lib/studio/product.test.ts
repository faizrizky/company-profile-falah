import { describe, expect, it } from "vitest";

import { productCategoryId, productToPuck, puckToProduct } from "./product";
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

  it("round-trips unchanged, media as ids", () => {
    expect(puckToProduct(productToPuck(product), product)).toEqual({
      title: "Virtual Operational Training",
      summary: "Train safely",
      tags: ["Army"],
      category: 2,
      showcaseTab: "t1",
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
});
