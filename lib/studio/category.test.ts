import { describe, expect, it } from "vitest";

import { categoryTitle, categoryToPuck, puckToCategory } from "./category";
import type { SolutionCategory } from "@/types/cms";

const media = { id: 7, createdAt: "2026-01-01", url: "/x.jpg" } as never;

const category = {
  id: 3,
  title: "Virtual Training Suite",
  slug: "virtual-training-suite",
  hero: { title: "", description: "Train safely", image: media, recommendedFor: ["Army", "Navy"] },
  challenges: {
    eyebrow: "The Challenges",
    title: "Why",
    description: "Because",
    items: [{ id: "a1", icon: "cost", title: "Cost", description: "Too much" }],
  },
  showcase: {
    background: media,
    brochure: { id: 9, createdAt: "2026-01-01" } as never,
    tabs: [{ id: "t1", name: "Tab", description: "d", tags: ["x"], video: null }],
  },
  cta: { eyebrow: "Go", title: "Talk", description: "to us", buttonLabel: "Request", buttonHref: "/contact" },
} as unknown as SolutionCategory;

describe("category ↔ visual editor", () => {
  it("shows the four sections, with the category title for an empty hero title", () => {
    const data = categoryToPuck(category);
    expect(data.content.map((c) => c.type)).toEqual([
      "categoryHero",
      "categoryChallenges",
      "categoryShowcase",
      "categoryCta",
    ]);
    expect((data.content[0].props as { title: string }).title).toBe("Virtual Training Suite");
  });

  it("round-trips unchanged: media as ids, empty hero title stays empty, the brochure is kept", () => {
    const saved = puckToCategory(categoryToPuck(category), category) as Record<string, Record<string, unknown>>;
    expect(saved.title).toBe("Virtual Training Suite");
    expect(saved.hero).toEqual({ title: "", description: "Train safely", image: 7, recommendedFor: ["Army", "Navy"] });
    expect(saved.challenges.items).toEqual([{ id: "a1", icon: "cost", title: "Cost", description: "Too much" }]);
    expect(saved.showcase.background).toBe(7);
    expect(saved.showcase.brochure).toBe(9);
    expect(saved.cta.buttonHref).toBe("/contact");
  });

  it("an untouched hero title is saved as it was stored, even if it equals the category title", () => {
    const explicit = { ...category, hero: { ...category.hero, title: "Virtual Training Suite" } } as SolutionCategory;
    const saved = puckToCategory(categoryToPuck(explicit), explicit) as Record<string, Record<string, unknown>>;
    expect(saved.hero.title).toBe("Virtual Training Suite");
  });

  it("a hero title of its own is kept, and follows nothing", () => {
    const data = categoryToPuck(category);
    (data.content[0].props as Record<string, unknown>).title = "A bolder headline";
    const saved = puckToCategory(data, category) as Record<string, Record<string, unknown>>;
    expect(saved.hero.title).toBe("A bolder headline");
  });

  it("renaming the category keeps the hero following it", () => {
    const data = categoryToPuck(category);
    (data.root as { props: Record<string, unknown> }).props.title = "New name";
    const saved = puckToCategory(data, category) as Record<string, Record<string, unknown>>;
    // The hero still shows the old title, which was the category's: it follows the new one.
    expect(saved.title).toBe("New name");
    expect(saved.hero.title).toBe("");
  });

  it("an empty title falls back", () => {
    const data = categoryToPuck(category);
    (data.root as { props: Record<string, unknown> }).props.title = "  ";
    expect(categoryTitle(data, "Fallback")).toBe("Fallback");
  });

  it("removed media is sent as null", () => {
    const data = categoryToPuck(category);
    (data.content[0].props as Record<string, unknown>).image = null;
    const saved = puckToCategory(data, category) as Record<string, Record<string, unknown>>;
    expect(saved.hero.image).toBeNull();
  });
});
