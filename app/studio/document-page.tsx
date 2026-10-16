import { StudioDocumentEditor, StudioDocumentTokenGate } from "@/components/studio/studio-document-gate";
import { StudioMessage, loginAction } from "@/components/studio/studio-message";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { cmsPublicUrl, getStudioSession } from "@/lib/studio/auth";
import { loadStudioDocument, type StudioDocumentCollection } from "@/lib/studio/load-documents";
import { studioStrings, type StudioLang } from "@/lib/studio/strings";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string; ui?: string; embed?: string }>;
};

/** The page of /studio/<collection>/<id> (a solution category or a product); see app/studio/pages for Pages. */
export async function studioDocumentPage(collection: StudioDocumentCollection, { params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = isLocale(query.locale) ? query.locale : defaultLocale;
  const uiLang: StudioLang = query.ui === "en" ? "en" : "id";
  const embedded = query.embed === "1";
  const s = studioStrings[uiLang];
  const cmsUrl = cmsPublicUrl();
  const docId = Number(id);

  const session = await getStudioSession();
  if (!session) {
    // Embedded in the CMS on another domain: the session comes by postMessage.
    if (embedded)
      return (
        <StudioDocumentTokenGate collection={collection} id={docId} locale={locale} uiLang={uiLang} cmsUrl={cmsUrl} />
      );
    return <StudioMessage title={s.loginTitle} body={s.loginBody} action={loginAction(cmsUrl, s)} cmsUrl={cmsUrl} />;
  }

  const result = await loadStudioDocument({
    collection,
    id: docId,
    locale,
    uiLang,
    embedded,
    authorization: session.authorization,
    user: session.user,
  });
  return <StudioDocumentEditor result={result} uiLang={uiLang} cmsUrl={cmsUrl} />;
}
