"use client";

import type { ComponentConfig, Config } from "@puckeditor/core";

import { PageSettingsField } from "@/components/studio/fields";
import { ELEMENT_TYPES } from "@/lib/studio/convert";

import { createFields, type StudioContext } from "./blocks/fields";
import { layoutComponents } from "./blocks/layout";
import { renderStudioRoot } from "./blocks/root";
import { meta, type AnyProps } from "./blocks/metadata";
import { sectionComponents } from "./blocks/sections";

export type { StudioMetadata } from "./blocks/metadata";

export function createStudioConfig(context: StudioContext): Config {
  const { lang, locale, cmsUrl, pageId, embedded } = context;
  const f = createFields(context);
  const { s, L, plain } = f;

  const components: Record<string, ComponentConfig<AnyProps>> = {
    ...sectionComponents(f),
    ...layoutComponents(f),
  };

  const sectionTypes = Object.keys(components).filter((k) => k !== "layoutSection" && !ELEMENT_TYPES.includes(k));

  // Same grouping as the Puck demo: building blocks first, ready-made sections last.
  return {
    categories: {
      layout: { title: s.catLayout, components: ["layoutSection", "spacer"] },
      typography: { title: s.catTypography, components: ["badge", "heading", "paragraph"] },
      actions: { title: s.catActions, components: ["button"] },
      media: { title: s.catMedia, components: ["image", "card"] },
      sections: { title: s.catSections, components: sectionTypes },
    },
    components,
    root: {
      fields: {
        title: plain("Page title", "Judul halaman"),
        settings: {
          type: "custom",
          label: L("Editor", "Editor"),
          render: () => (
            <PageSettingsField
              lang={lang}
              locale={locale}
              cmsUrl={cmsUrl}
              backPath={`/admin/collections/pages/${pageId}/form`}
              embedded={embedded}
              s={s}
            />
          ),
        },
      },
      render: renderStudioRoot,
    },
  };
}
