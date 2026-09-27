"use client";

import type { ComponentConfig, Config } from "@puckeditor/core";

import { LocaleProvider } from "@/components/i18n/locale-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageSettingsField } from "@/components/studio/fields";
import { buildMegaMenu } from "@/lib/cms/mega-menu";
import { asMedia } from "@/lib/cms/media";
import { ELEMENT_TYPES } from "@/lib/studio/convert";

import { createFields, type StudioContext } from "./blocks/fields";
import { layoutComponents } from "./blocks/layout";
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
            <PageSettingsField lang={lang} locale={locale} cmsUrl={cmsUrl} pageId={pageId} embedded={embedded} s={s} />
          ),
        },
      },
      render: ({ children, puck }: { children: React.ReactNode; puck: { metadata: unknown } }) => {
        const { ctx, fontClass, chrome } = meta(puck);
        return (
          <div className={`${fontClass} min-h-screen bg-surface-dark font-sans antialiased`}>
            <LocaleProvider locale={ctx.locale} t={ctx.t}>
              {chrome.navigation && (
                <Navbar
                  navigation={chrome.navigation}
                  solutions={buildMegaMenu(ctx.data.categories, ctx.data.products)}
                  logo={asMedia(ctx.data.settings?.logo)}
                />
              )}
              <main>{children}</main>
              {chrome.footer && ctx.data.settings && (
                <Footer footer={chrome.footer} settings={ctx.data.settings} labels={ctx.t.footer} />
              )}
            </LocaleProvider>
          </div>
        );
      },
    },
  };
}

