import { StudioEditor } from "@/components/studio/studio-editor";
import { StudioMessage, loginAction } from "@/components/studio/studio-message";
import { StudioTokenGate } from "@/components/studio/studio-token-gate";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { cmsPublicUrl, getStudioSession } from "@/lib/studio/auth";
import { loadStudio } from "@/lib/studio/load";
import { studioStrings, type StudioLang } from "@/lib/studio/strings";

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
  const embedded = query.embed === "1";
  const s = studioStrings[uiLang];
  const cmsUrl = cmsPublicUrl();
  const pageId = Number(id);

  const session = await getStudioSession();
  if (!session) {
    // Embedded in the CMS on another domain: the session comes by postMessage.
    if (embedded) return <StudioTokenGate pageId={pageId} locale={locale} uiLang={uiLang} cmsUrl={cmsUrl} />;
    return <StudioMessage title={s.loginTitle} body={s.loginBody} action={loginAction(cmsUrl, s)} cmsUrl={cmsUrl} />;
  }

  const result = await loadStudio({
    pageId,
    locale,
    uiLang,
    embedded,
    authorization: session.authorization,
    user: session.user,
  });
  if (result.status === "ok") return <StudioEditor key={`${locale}-${uiLang}`} {...result.props} />;
  if (result.status === "login")
    return <StudioMessage title={s.loginTitle} body={s.loginBody} action={loginAction(cmsUrl, s)} cmsUrl={cmsUrl} />;
  return <StudioMessage title={s.notFoundTitle} cmsUrl={cmsUrl} />;
}
