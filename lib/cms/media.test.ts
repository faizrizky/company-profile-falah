import { describe, expect, it } from "vitest";

import type { Media, Product, SolutionCategory } from "@/types/cms";

import { mediaAlt, mediaType, mediaUrl, populated } from "./media";
import { buildMegaMenu } from "./mega-menu";

const image = { id: 1, url: "/media/x.webp", alt: "Logo", mimeType: "image/webp" } as Media;

describe("media helpers", () => {
  it("read populated media and ignore bare ids", () => {
    expect(mediaUrl(image)).toBe("/media/x.webp");
    expect(mediaType(image)).toBe("image/webp");
    expect(mediaUrl(5)).toBeUndefined();
    expect(mediaUrl(null)).toBeUndefined();
    expect(mediaAlt(5, "fallback")).toBe("fallback");
    expect(mediaAlt({ ...image, alt: "" }, "fallback")).toBe("fallback");
  });

  it("keeps only populated relations", () => {
    expect(populated([3, { id: 4 }, 5])).toEqual([{ id: 4 }]);
    expect(populated(null)).toEqual([]);
  });
});

describe("mega menu", () => {
  it("groups products under their category; links only categories with a detail page", () => {
    const categories = [
      { id: 1, title: "VTS", slug: "virtual-training-suite", hasDetailPage: true },
      { id: 2, title: "Cyber", slug: "cyber", hasDetailPage: false },
    ] as SolutionCategory[];
    const products = [
      { id: 10, title: "Ops", category: 1, image },
      { id: 11, title: "Lang", category: { id: 1 } },
      { id: 12, title: "Other", category: 2 },
    ] as unknown as Product[];
    const menu = buildMegaMenu(categories, products);
    expect(menu[0]).toMatchObject({
      href: "/solution/virtual-training-suite",
      products: [
        { id: 10, image: "/media/x.webp", alt: "Logo" },
        { id: 11, alt: "Lang" },
      ],
    });
    expect(menu[1]!.href).toBeUndefined();
    expect(menu[1]!.products.map((p) => p.id)).toEqual([12]);
  });
});
