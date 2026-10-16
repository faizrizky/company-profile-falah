"use client";

import { createUsePuck, type ComponentConfig, type Config } from "@puckeditor/core";
import type { ReactNode } from "react";

import { PageSettingsField } from "@/components/studio/fields";
import { ChallengesSection } from "@/components/solution-category/ChallengesSection";
import { CtaSection } from "@/components/solution-category/CtaSection";
import { HeroSection } from "@/components/solution-category/HeroSection";
import { ShowcaseSection } from "@/components/solution-category/ShowcaseSection";
import type { SolutionCategory } from "@/types/cms";

import { createFields, type StudioContext } from "./fields";
import { meta, type AnyProps, type StudioMetadata } from "./metadata";
import { renderStudioRoot } from "./root";

/** The canvas metadata of a category: the site's, plus the category as it was loaded. */
export type CategoryStudioMetadata = StudioMetadata & { category: SolutionCategory };

const usePuck = createUsePuck();

type Item = { props: AnyProps & { id: string } };

/** The plain props of one of the four sections, as the editor holds them now. */
function useSection(id: string): AnyProps {
  return usePuck((s) => ((s.appState.data.content as Item[]).find((i) => i.props.id === id)?.props ?? {}) as AnyProps);
}

/** The category title, as edited in the "Category" panel. */
function useCategoryTitle(fallback: string): string {
  return usePuck((s) => {
    const title = (s.appState.data.root as { props?: { title?: unknown } }).props?.title;
    return typeof title === "string" && title.trim() ? title : fallback;
  });
}

/** A section with nothing to show yet: a dashed box to click on, so it can still be filled in. */
function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto my-12 flex w-full max-w-[1280px] items-center justify-center rounded-lg border border-dashed border-white/30 px-6 py-16 text-center text-sm text-white/70">
      {children}
    </div>
  );
}

/**
 * The category as the live page reads it: what was loaded, with the title and
 * the three sections that aren't the one rendering replaced by what the editor
 * holds now (the rendering one gets its own props, which carry the inline editing).
 */
function useLiveCategory(base: SolutionCategory, own: "hero" | "challenges" | "showcase" | "cta") {
  const title = useCategoryTitle(base.title);
  const hero = useSection("hero");
  const challenges = useSection("challenges");
  const showcase = useSection("showcase");
  const cta = useSection("cta");
  return {
    title,
    category: {
      ...base,
      title,
      hero: own === "hero" ? undefined : { ...hero },
      challenges: own === "challenges" ? undefined : { ...challenges },
      showcase: own === "showcase" ? undefined : { ...showcase },
      cta: own === "cta" ? undefined : { ...cta },
    } as unknown as SolutionCategory,
  };
}

export function createCategoryConfig(context: StudioContext & { backPath: string }): Config {
  const { lang, locale, cmsUrl, embedded, backPath } = context;
  const f = createFields(context);
  const { s, L, text, textarea, plain, link, select, image, video, tags, list } = f;

  const Hero = ({ puck, ...props }: AnyProps & { puck: { metadata: unknown } }) => {
    const { ctx, category: base } = meta(puck) as CategoryStudioMetadata;
    const { category } = useLiveCategory(base, "hero");
    return (
      <HeroSection
        t={ctx.t}
        category={{
          ...category,
          hero: {
            title: props.title as string,
            description: props.description as string,
            image: props.image as never,
            recommendedFor: props.recommendedFor as string[],
          },
        }}
      />
    );
  };

  const Challenges = ({ puck, ...props }: AnyProps & { puck: { metadata: unknown } }) => {
    const { category: base } = meta(puck) as CategoryStudioMetadata;
    const { category } = useLiveCategory(base, "challenges");
    const items = (props.items as unknown[]) ?? [];
    if (!items.length)
      return (
        <Empty>{L("Add challenges in the panel on the right.", "Tambahkan tantangan di panel sebelah kanan.")}</Empty>
      );
    return (
      <ChallengesSection
        category={{
          ...category,
          challenges: {
            eyebrow: props.eyebrow as string,
            title: props.title as string,
            description: props.description as string,
            items: items as never,
          },
        }}
      />
    );
  };

  const Showcase = ({ puck, ...props }: AnyProps & { puck: { metadata: unknown } }) => {
    const { category: base } = meta(puck) as CategoryStudioMetadata;
    const { category } = useLiveCategory(base, "showcase");
    const tabs = (props.tabs as unknown[]) ?? [];
    if (!tabs.length)
      return (
        <Empty>
          {L("Add showcase tabs in the panel on the right.", "Tambahkan tab showcase di panel sebelah kanan.")}
        </Empty>
      );
    return (
      <ShowcaseSection
        category={{
          ...category,
          showcase: {
            background: props.background as never,
            backgroundVideo: props.backgroundVideo as never,
            brochure: base.showcase?.brochure,
            tabs: tabs as never,
          },
        }}
      />
    );
  };

  const Cta = ({ puck, ...props }: AnyProps & { puck: { metadata: unknown } }) => {
    const { ctx, category: base } = meta(puck) as CategoryStudioMetadata;
    const { category } = useLiveCategory(base, "cta");
    if (!props.title)
      return <Empty>{L("Fill in the title in the panel on the right.", "Isi judul di panel sebelah kanan.")}</Empty>;
    return (
      <CtaSection
        t={ctx.t}
        category={{
          ...category,
          cta: {
            eyebrow: props.eyebrow as string,
            title: props.title as string,
            description: props.description as string,
            background: props.background as never,
            buttonLabel: props.buttonLabel as string,
            buttonHref: props.buttonHref as string,
          },
        }}
      />
    );
  };

  const note = (en: string, id: string) => ({
    type: "custom" as const,
    label: " ",
    render: () => <p className="studio-note">{L(en, id)}</p>,
  });

  const components: Record<string, ComponentConfig<AnyProps>> = {
    categoryHero: {
      label: L("Hero", "Hero"),
      fields: {
        title: textarea("Title", "Judul"),
        description: textarea("Description", "Deskripsi"),
        image: image("Background image", "Gambar latar"),
        recommendedFor: tags("Recommended for (chips)", "Direkomendasikan untuk (chip)"),
        buttonNote: note(
          "The button below the title is the one of the last section (Call to action).",
          "Tombol di bawah judul adalah tombol section terakhir (Ajakan / CTA).",
        ),
      },
      render: Hero as never,
    },
    categoryChallenges: {
      label: L("Challenges", "Tantangan"),
      fields: {
        eyebrow: text("Label (pill)", "Label kecil (pill)"),
        title: textarea("Title", "Judul"),
        description: textarea("Description", "Deskripsi"),
        items: list(
          "Challenges",
          "Tantangan",
          {
            icon: select("Icon", "Ikon", [
              ["downtime", "Clock (downtime)", "Jam (downtime)"],
              ["cost", "Coins (cost)", "Koin (biaya)"],
              ["error", "User X (human error)", "Pengguna X (kesalahan manusia)"],
              ["inconsistent", "Shuffle (inconsistent)", "Acak (tidak konsisten)"],
            ]),
            title: text("Title", "Judul"),
            description: textarea("Description", "Deskripsi"),
          },
          "title",
          { icon: "downtime", title: L("New challenge", "Tantangan baru"), description: "" },
          8,
        ),
      },
      render: Challenges as never,
    },
    categoryShowcase: {
      label: L("Showcase", "Showcase"),
      fields: {
        background: image("Background image (and video poster)", "Gambar latar (dan poster video)"),
        backgroundVideo: video("Background video (shared)", "Video latar (umum)"),
        brochureNote: note(
          "The brochure (PDF) is changed in the Form tab, under Showcase.",
          "Brosur (PDF) diubah di tab Form, bagian Showcase.",
        ),
        tabs: list(
          "Tabs (one per product)",
          "Tab (satu per produk)",
          {
            name: text("Name", "Nama"),
            description: textarea("Description", "Deskripsi"),
            tags: tags("Recommended for (chips)", "Direkomendasikan untuk (chip)"),
            video: video("Video (desktop)", "Video (desktop)"),
            videoMobile: video("Video (phone)", "Video (HP)"),
          },
          "name",
          { name: L("New tab", "Tab baru"), description: "", tags: [], video: null, videoMobile: null },
          10,
        ),
      },
      render: Showcase as never,
    },
    categoryCta: {
      label: L("Call to action", "Ajakan (CTA)"),
      fields: {
        eyebrow: text("Label (pill)", "Label kecil (pill)"),
        title: text("Title", "Judul"),
        description: textarea("Description", "Deskripsi"),
        background: image("Background image", "Gambar latar"),
        buttonLabel: plain("Button label", "Teks tombol"),
        buttonHref: link("Button link", "Link tombol"),
      },
      render: Cta as never,
    },
  };

  return {
    components,
    root: {
      fields: {
        title: plain("Category title", "Judul kategori"),
        settings: {
          type: "custom",
          label: L("Editor", "Editor"),
          render: () => (
            <>
              <PageSettingsField
                lang={lang}
                locale={locale}
                cmsUrl={cmsUrl}
                backPath={backPath}
                embedded={embedded}
                s={s}
              />
              <p className="studio-note">
                {L(
                  "Address (slug), menu visibility, detail page and SEO are in the Form tab.",
                  "Alamat (slug), tampil di menu, halaman detail, dan SEO ada di tab Form.",
                )}
              </p>
            </>
          ),
        },
      },
      render: renderStudioRoot,
    },
  };
}
