import "server-only";

import type { StudioEditorProps } from "@/components/studio/studio-editor";
import { getFooter, getNavigation, getSiteData } from "@/lib/cms/queries";
import { env } from "@/lib/env";
import { fontVariables } from "@/lib/fonts";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPublicUrl } from "@/lib/studio/auth";
import type { StudioLang } from "@/lib/studio/strings";
import type { Navigation, Page, User } from "@/types/cms";

/** Grouped link choices for the editor's link fields. */
export type LinkGroup = { label: string; options: { label: string; href: string }[] };

async function buildLinkGroups(
  authorization: string,
  locale: Locale,
  uiLang: StudioLang,
  categories: { title: string; slug: string; hasDetailPage?: boolean | null }[],
  navigation: Navigation | null,
): Promise<LinkGroup[]> {
  const url = new URL("/api/pages", env.CMS_URL);
  url.search = new URLSearchParams({
    limit: "100",
    depth: "0",
    draft: "true",
    sort: "title",
    locale,
    "fallback-locale": defaultLocale,
    "select[title]": "true",
    "select[slug]": "true",
  }).toString();
  const res = await fetch(url, { headers: { authorization }, cache: "no-store" }).catch(() => null);
  const pages = res?.ok ? ((await res.json()) as { docs: Pick<Page, "title" | "slug">[] }).docs : [];
  const L = (en: string, id: string) => (uiLang === "id" ? id : en);
  const groups: LinkGroup[] = [
    {
      label: L("Pages", "Halaman"),
      options: pages.map((p) => ({ label: p.title, href: p.slug === "home" ? "/" : `/${p.slug}` })),
    },
    {
      label: L("Solutions", "Solusi"),
      options: categories.filter((c) => c.hasDetailPage).map((c) => ({ label: c.title, href: `/solution/${c.slug}` })),
    },
    // "Links per page" from the CMS (Settings → Navigation).
    ...(navigation?.linkLibrary ?? []).map((g) => ({
      label: g.group,
      options: (g.links ?? []).map((l) => ({ label: l.label, href: l.target })),
    })),
  ];
  return groups.filter((g) => g.options.length);
}

export type StudioLoadResult =
  | { status: "ok"; props: StudioEditorProps }
  | { status: "login" }
  | { status: "notFound" };

/** The CMS user behind an `Authorization: JWT …` value, or null. */
export async function verifyStudioAuth(authorization: string): Promise<User | null> {
  if (!env.CMS_URL) return null;
  const res = await fetch(new URL("/api/users/me", env.CMS_URL), {
    headers: { authorization },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return null;
  const { user } = (await res.json()) as { user: User | null };
  return user ?? null;
}

/** Everything the editor needs for one page, fetched with the editor's own session. */
export async function loadStudio({
  pageId,
  locale,
  uiLang,
  embedded,
  authorization,
  user,
}: {
  pageId: number;
  locale: Locale;
  uiLang: StudioLang;
  embedded: boolean;
  authorization: string;
  user: User;
}): Promise<StudioLoadResult> {
  if (!Number.isInteger(pageId) || pageId <= 0 || !env.CMS_URL) return { status: "notFound" };

  // Latest draft, fetched with the editor's own session so CMS access rules apply.
  const url = new URL(`/api/pages/${pageId}`, env.CMS_URL);
  url.search = new URLSearchParams({ draft: "true", depth: "2", locale, "fallback-locale": defaultLocale }).toString();
  const res = await fetch(url, { headers: { authorization }, cache: "no-store" });
  if (res.status === 401 || res.status === 403) return { status: "login" };
  if (!res.ok) return { status: "notFound" };
  const page = (await res.json()) as Page;

  const [siteData, navigation, footer] = await Promise.all([getSiteData(locale), getNavigation(locale), getFooter(locale)]);
  const linkGroups = await buildLinkGroups(authorization, locale, uiLang, siteData.categories, navigation);

  return {
    status: "ok",
    props: {
      page: { id: page.id, title: page.title, slug: page.slug, layout: page.layout, _status: page._status },
      locale,
      uiLang,
      embedded,
      user: { email: user.email, name: user.name },
      cmsUrl: cmsPublicUrl(),
      siteData,
      chrome: { navigation, footer },
      dictionary: getDictionary(locale),
      fontClass: fontVariables,
      linkGroups,
    },
  };
}
