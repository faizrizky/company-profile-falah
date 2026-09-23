import { StudioEditor } from "@/components/studio/studio-editor";
import { StudioMessage, loginAction } from "@/components/studio/studio-message";
import { getFooter, getNavigation, getSiteData } from "@/lib/cms/queries";
import { env } from "@/lib/env";
import { fontVariables } from "@/lib/fonts";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cmsPublicUrl, getStudioSession } from "@/lib/studio/auth";
import { studioStrings, type StudioLang } from "@/lib/studio/strings";
import type { Page } from "@/types/cms";

// Per-user and always fresh: never cached.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string; ui?: string; embed?: string }>;
};

export default async function StudioPage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = isLocale(query.locale) ? query.locale : defaultLocale;
  const uiLang: StudioLang = query.ui === "en" ? "en" : "id";
  const s = studioStrings[uiLang];
  const cmsUrl = cmsPublicUrl();

  const session = await getStudioSession();
  if (!session) return <StudioMessage title={s.loginTitle} body={s.loginBody} action={loginAction(cmsUrl, s)} />;

  const pageId = Number(id);
  if (!Number.isInteger(pageId) || pageId <= 0 || !env.CMS_URL) return <StudioMessage title={s.notFoundTitle} />;

  // Latest draft, fetched with the editor's own session so CMS access rules apply.
  const url = new URL(`/api/pages/${pageId}`, env.CMS_URL);
  url.search = new URLSearchParams({ draft: "true", depth: "2", locale, "fallback-locale": defaultLocale }).toString();
  const res = await fetch(url, { headers: { authorization: session.authorization }, cache: "no-store" });
  if (!res.ok) return <StudioMessage title={s.notFoundTitle} />;
  const page = (await res.json()) as Page;

  const [siteData, navigation, footer] = await Promise.all([getSiteData(locale), getNavigation(locale), getFooter(locale)]);

  return (
    <StudioEditor
      key={`${locale}-${uiLang}`}
      page={{ id: page.id, title: page.title, slug: page.slug, layout: page.layout, _status: page._status }}
      locale={locale}
      uiLang={uiLang}
      embedded={query.embed === "1"}
      user={{ email: session.user.email, name: session.user.name }}
      cmsUrl={cmsUrl}
      siteData={siteData}
      chrome={{ navigation, footer }}
      dictionary={getDictionary(locale)}
      fontClass={fontVariables}
    />
  );
}
