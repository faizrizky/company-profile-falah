import type { Data } from "@puckeditor/core";

import type { SolutionCategory } from "@/types/cms";

import { toReference } from "./convert";

/**
 * The visual editor of a solution category and the CMS form edit the same
 * document. A category page is four fixed sections, so the editor's data is
 * four fixed items (one per CMS group) plus the category title:
 *
 *   CMS:  { title, hero: {…}, challenges: {…}, showcase: {…}, cta: {…} }
 *   Puck: root { title } + [ categoryHero, categoryChallenges, categoryShowcase, categoryCta ]
 *
 * What the editor doesn't show (the brochure, SEO, slug…) is left as it is.
 */

export const CATEGORY_SECTION_IDS = ["hero", "challenges", "showcase", "cta"] as const;
export type CategorySectionId = (typeof CATEGORY_SECTION_IDS)[number];

type Props = Record<string, unknown>;
type PuckItem = { type: string; props: Props & { id: string } };

const text = (value: unknown) => (typeof value === "string" ? value : "");
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

export function categoryToPuck(category: SolutionCategory): Data {
  const hero = category.hero ?? {};
  const challenges = category.challenges ?? {};
  const showcase = category.showcase ?? {};
  const cta = category.cta ?? { buttonHref: "/contact" };
  return {
    root: { props: { title: category.title } },
    content: [
      {
        type: "categoryHero",
        props: {
          id: "hero",
          // Empty in the CMS means "the category title": shown (and editable) as such.
          title: hero.title || category.title,
          description: text(hero.description),
          image: hero.image ?? null,
          recommendedFor: list(hero.recommendedFor),
        },
      },
      {
        type: "categoryChallenges",
        props: {
          id: "challenges",
          eyebrow: text(challenges.eyebrow),
          title: text(challenges.title),
          description: text(challenges.description),
          items: list(challenges.items),
        },
      },
      {
        type: "categoryShowcase",
        props: {
          id: "showcase",
          background: showcase.background ?? null,
          backgroundVideo: showcase.backgroundVideo ?? null,
          tabs: list(showcase.tabs),
        },
      },
      {
        type: "categoryCta",
        props: {
          id: "cta",
          eyebrow: text(cta.eyebrow),
          title: text(cta.title),
          description: text(cta.description),
          background: cta.background ?? null,
          buttonLabel: text(cta.buttonLabel),
          buttonHref: text(cta.buttonHref) || "/contact",
        },
      },
    ],
  };
}

const section = (data: Data, id: CategorySectionId): Props =>
  ((data.content as PuckItem[]).find((item) => item.props.id === id)?.props ?? {}) as Props;

/** The category title edited in the "Category" panel (Puck root). */
export function categoryTitle(data: Data, fallback: string): string {
  const title = (data.root as { props?: { title?: unknown } }).props?.title;
  return typeof title === "string" && title.trim() ? title.trim() : fallback;
}

/** The body of a save: every group the editor shows, complete (the rest of the document is untouched). */
export function puckToCategory(data: Data, base: SolutionCategory): Record<string, unknown> {
  const title = categoryTitle(data, base.title);
  const hero = section(data, "hero");
  const challenges = section(data, "challenges");
  const showcase = section(data, "showcase");
  const cta = section(data, "cta");

  // What the hero showed when the editor opened: its own title, or the category's when empty.
  const shownAtStart = base.hero?.title || base.title;
  const heroTitle = text(hero.title).trim();
  const heroValue =
    // Untouched: whatever was stored (empty or not) stays as it is.
    heroTitle === shownAtStart
      ? (base.hero?.title ?? "")
      : // The same as the category title = "follow the category title" (saved empty).
        heroTitle === title
        ? ""
        : heroTitle;
  return {
    title,
    hero: {
      title: heroValue,
      description: text(hero.description),
      image: toReference(hero.image ?? null),
      recommendedFor: toReference(list(hero.recommendedFor)),
    },
    challenges: {
      eyebrow: text(challenges.eyebrow),
      title: text(challenges.title),
      description: text(challenges.description),
      items: toReference(list(challenges.items)),
    },
    showcase: {
      background: toReference(showcase.background ?? null),
      backgroundVideo: toReference(showcase.backgroundVideo ?? null),
      // Not in the editor (a PDF): kept as it is.
      brochure: toReference(base.showcase?.brochure ?? null),
      tabs: toReference(list(showcase.tabs)),
    },
    cta: {
      eyebrow: text(cta.eyebrow),
      title: text(cta.title),
      description: text(cta.description),
      background: toReference(cta.background ?? null),
      buttonLabel: text(cta.buttonLabel),
      buttonHref: text(cta.buttonHref) || "/contact",
    },
  };
}
