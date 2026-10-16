"use client";

import { useMemo } from "react";

import type { SiteData } from "@/components/blocks/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createCategoryConfig, type CategoryStudioMetadata } from "@/lib/studio/blocks/category";
import { categoryTitle, categoryToPuck, puckToCategory } from "@/lib/studio/category";
import type { LinkGroup } from "@/lib/studio/load";
import type { StudioLang } from "@/lib/studio/strings";
import type { Footer, Navigation, SolutionCategory, User } from "@/types/cms";

import { StudioShell, useHydrated, type StudioDocument } from "./studio-shell";
import { StudioSkeleton } from "./studio-skeleton";

export type CategoryEditorProps = {
  category: SolutionCategory;
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

/** The visual editor of a solution category: its four sections, edited on the page itself. */
export function CategoryEditor(props: CategoryEditorProps) {
  const hydrated = useHydrated();
  if (!hydrated) return <StudioSkeleton embedded={props.embedded} />;
  return <CategoryEditorClient {...props} />;
}

function CategoryEditorClient(props: CategoryEditorProps) {
  const { category, locale, uiLang, embedded, cmsUrl, siteData, chrome, dictionary, fontClass, linkGroups } = props;

  const document = useMemo<StudioDocument>(() => {
    const initialData = categoryToPuck(category);
    const snapshot = (data: typeof initialData) => JSON.stringify(puckToCategory(data, category));
    return {
      collection: "solution-categories",
      id: category.id,
      title: categoryTitle(initialData, category.title),
      status: category._status,
      config: createCategoryConfig({
        lang: uiLang,
        locale,
        cmsUrl,
        data: siteData,
        pageId: category.id,
        embedded,
        linkGroups,
        backPath: `/admin/collections/solution-categories/${category.id}/form`,
      }),
      metadata: {
        ctx: { locale, t: dictionary, data: siteData },
        fontClass,
        chrome,
        category,
      } satisfies CategoryStudioMetadata,
      initialData,
      snapshot,
      initialSnapshot: snapshot(initialData),
      changes: (data) => puckToCategory(data, category),
      livePath: (code) => (category.hasDetailPage ? `/${code}/solution/${category.slug}` : null),
      // Four fixed sections: nothing to add, move or remove.
      permissions: { insert: false, drag: false, delete: false, duplicate: false },
      leftPanel: false,
    };
  }, [category, uiLang, locale, cmsUrl, siteData, embedded, linkGroups, dictionary, fontClass, chrome]);

  return <StudioShell document={document} locale={locale} uiLang={uiLang} embedded={embedded} cmsUrl={cmsUrl} />;
}
