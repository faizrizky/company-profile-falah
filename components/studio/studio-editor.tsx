"use client";

import { useMemo } from "react";

import type { SiteData } from "@/components/blocks/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createStudioConfig, type StudioMetadata } from "@/lib/studio/config";
import { layoutToPuck, puckTitle, puckToLayout } from "@/lib/studio/convert";
import type { LinkGroup } from "@/lib/studio/load";
import type { StudioLang } from "@/lib/studio/strings";
import type { Footer, Navigation, Page, User } from "@/types/cms";

import { StudioShell, useHydrated, type StudioDocument } from "./studio-shell";
import { StudioSkeleton } from "./studio-skeleton";

export type StudioEditorProps = {
  page: Pick<Page, "id" | "title" | "slug" | "layout" | "_status">;
  locale: Locale;
  uiLang: StudioLang;
  embedded: boolean;
  user: Pick<User, "email" | "name">;
  cmsUrl: string;
  siteData: SiteData;
  chrome: { navigation: Navigation | null; footer: Footer | null };
  dictionary: Dictionary;
  fontClass: string;
  linkGroups: LinkGroup[];
};

/** The Pages visual editor: the page's blocks, freely arranged. */
export function StudioEditor(props: StudioEditorProps) {
  const hydrated = useHydrated();
  if (!hydrated) return <StudioSkeleton embedded={props.embedded} />;
  return <PageEditor {...props} />;
}

function PageEditor(props: StudioEditorProps) {
  const { page, locale, uiLang, embedded, cmsUrl, siteData, chrome, dictionary, fontClass, linkGroups } = props;

  const document = useMemo<StudioDocument>(
    () => ({
      collection: "pages",
      id: page.id,
      title: page.title,
      status: page._status,
      config: createStudioConfig({
        lang: uiLang,
        locale,
        cmsUrl,
        data: siteData,
        pageId: page.id,
        embedded,
        linkGroups,
      }),
      metadata: { ctx: { locale, t: dictionary, data: siteData }, fontClass, chrome } satisfies StudioMetadata,
      initialData: layoutToPuck(page.layout, page.title),
      snapshot: (data) => JSON.stringify([puckTitle(data, page.title), puckToLayout(data)]),
      initialSnapshot: JSON.stringify([page.title, page.layout]),
      changes: (data) => ({ title: puckTitle(data, page.title), layout: puckToLayout(data) }),
      livePath: (code) => `/${code}${page.slug === "home" ? "" : `/${page.slug}`}`,
    }),
    [page, uiLang, locale, cmsUrl, siteData, embedded, linkGroups, dictionary, fontClass, chrome],
  );

  return <StudioShell document={document} locale={locale} uiLang={uiLang} embedded={embedded} cmsUrl={cmsUrl} />;
}
