import { describe, expect, it } from "vitest";

import type { Page } from "@/types/cms";

import { layoutToPuck, puckTitle, puckToLayout } from "./convert";

const media = { id: 42, url: "/media/a.webp", alt: "A", createdAt: "2026-01-01", updatedAt: "2026-01-01" };

const layout = [
  { id: "hero-1", blockType: "hero", blockName: "Top", title: "Hello", background: media, buttons: [{ id: "b1", label: "Go", href: "/contact" }] },
  {
    id: "sec-1",
    blockType: "layoutSection",
    columns: "2",
    column1: [{ id: "h1", blockType: "heading", text: "Left" }],
    column2: [{ id: "img1", blockType: "image", image: media }],
  },
] as unknown as Page["layout"];

describe("CMS layout ↔ visual editor", () => {
  it("turns blocks into Puck items, keeping ids and nesting columns", () => {
    const data = layoutToPuck(layout, "Home");
    expect(data.root).toEqual({ props: { title: "Home" } });
    const [hero, section] = data.content as { type: string; props: Record<string, unknown> }[];
    expect(hero).toMatchObject({ type: "hero", props: { id: "hero-1", title: "Hello" } });
    expect(hero!.props).not.toHaveProperty("blockName");
    expect((section!.props.column1 as { type: string }[])[0]).toMatchObject({ type: "heading", props: { id: "h1", text: "Left" } });
  });

  it("round-trips without losing content; media go back as ids", () => {
    const back = puckToLayout(layoutToPuck(layout, "Home")) as unknown as Record<string, unknown>[];
    expect(back[0]).toEqual({
      id: "hero-1",
      blockType: "hero",
      title: "Hello",
      background: 42,
      buttons: [{ id: "b1", label: "Go", href: "/contact" }],
    });
    expect(back[1]).toMatchObject({
      id: "sec-1",
      blockType: "layoutSection",
      column1: [{ id: "h1", blockType: "heading", text: "Left" }],
      column2: [{ id: "img1", blockType: "image", image: 42 }],
    });
  });

  it("gives new blocks an id", () => {
    const data = layoutToPuck([{ blockType: "faq" }] as unknown as Page["layout"], "x");
    expect((data.content[0]!.props as { id: string }).id).toMatch(/^faq-/);
  });

  it("reads the page title from the Page panel, falling back when empty", () => {
    expect(puckTitle({ root: { props: { title: "  About  " } }, content: [] }, "x")).toBe("About");
    expect(puckTitle({ root: { props: { title: " " } }, content: [] }, "Fallback")).toBe("Fallback");
  });
});
