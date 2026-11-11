import { describe, expect, it } from "vitest";

import type { Page } from "@/types/cms";

import { layoutToPuck, puckToLayout } from "./convert";
import { FEATURED_ID, highlightsFromProps, highlightsToProps } from "./highlights";

const media = (id: number) => ({ id, url: `/m/${id}.webp`, createdAt: "2026-01-01", updatedAt: "2026-01-01" });

const block = {
  id: "blk1",
  blockType: "solutionHighlights",
  header: { eyebrow: "Our Solutions", title: "T", description: "D" },
  background: media(1),
  featured: {
    image: media(2),
    title: "Virtual Training Suite",
    description: "Big description",
    tagsLabel: "Recommended For",
    tags: ["VR Training", "Mission Readiness"],
    button: { label: "Explore Our Solutions", href: "/solution" },
  },
  items: [
    {
      id: "i1",
      image: media(3),
      title: "Training Simulators",
      description: "Sim",
      tags: ["Army"],
      href: "/solution/sim",
    },
    { id: "i2", image: media(4), title: "Advanced Education", description: "", tags: [], href: "/solution/edu" },
  ],
} as unknown as Page["layout"][number];

const cardsOf = (props: Record<string, unknown>) => props.cards as { id: string; title: string }[];

describe("Solution highlights: featured and small cards as one list", () => {
  it("shows the featured card first, then the small ones, with the shared labels apart", () => {
    const props = highlightsToProps(block as unknown as Record<string, unknown>);
    expect(props.tagsLabel).toBe("Recommended For");
    expect(props.buttonLabel).toBe("Explore Our Solutions");
    expect(cardsOf(props).map((c) => [c.id, c.title])).toEqual([
      [FEATURED_ID, "Virtual Training Suite"],
      ["i1", "Training Simulators"],
      ["i2", "Advanced Education"],
    ]);
    expect(props).not.toHaveProperty("featured");
    expect(props).not.toHaveProperty("items");
    // The featured card's button link is its link.
    expect((props.cards as { href: string }[])[0].href).toBe("/solution");
  });

  it("round-trips through the editor and back unchanged, media as ids", () => {
    const back = puckToLayout(layoutToPuck([block] as Page["layout"], "Home"))[0] as unknown as Record<string, unknown>;
    expect(back.featured).toEqual({
      image: 2,
      title: "Virtual Training Suite",
      description: "Big description",
      tagsLabel: "Recommended For",
      tags: ["VR Training", "Mission Readiness"],
      button: { label: "Explore Our Solutions", href: "/solution" },
    });
    expect(back.items).toEqual([
      { id: "i1", image: 3, title: "Training Simulators", description: "Sim", tags: ["Army"], href: "/solution/sim" },
      { id: "i2", image: 4, title: "Advanced Education", description: "", tags: [], href: "/solution/edu" },
    ]);
    expect(back).not.toHaveProperty("cards");
  });

  it("keeps the featured card first however the list is dragged", () => {
    const props = highlightsToProps(block as unknown as Record<string, unknown>);
    const [featured, ...rest] = props.cards as Record<string, unknown>[];
    const saved = highlightsFromProps({ ...props, cards: [...rest.reverse(), featured] }) as {
      featured: { title: string };
      items: { id: string }[];
    };
    expect(saved.featured.title).toBe("Virtual Training Suite");
    expect(saved.items.map((i) => i.id)).toEqual(["i2", "i1"]);
  });

  it("a new card becomes a small card; deleting the featured one promotes the next", () => {
    const props = highlightsToProps(block as unknown as Record<string, unknown>);
    const cards = props.cards as Record<string, unknown>[];
    const added = highlightsFromProps({ ...props, cards: [...cards, { id: "new1", title: "New" }] }) as {
      items: { id: string; title: string }[];
    };
    expect(added.items.map((i) => i.id)).toEqual(["i1", "i2", "new1"]);

    const promoted = highlightsFromProps({ ...props, cards: cards.slice(1) }) as {
      featured: { title: string };
      items: { id: string }[];
    };
    expect(promoted.featured.title).toBe("Training Simulators");
    expect(promoted.items.map((i) => i.id)).toEqual(["i2"]);
  });

  it("a copy of the featured card gets a new row id instead of 'featured'", () => {
    const props = highlightsToProps(block as unknown as Record<string, unknown>);
    const cards = props.cards as Record<string, unknown>[];
    const saved = highlightsFromProps({ ...props, cards: [...cards, { ...cards[0] }] }) as { items: { id: string }[] };
    const ids = saved.items.map((i) => i.id);
    expect(ids).not.toContain(FEATURED_ID);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
