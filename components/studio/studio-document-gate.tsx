"use client";

import { useEffect, useState } from "react";

import { loadStudioDocumentWithToken } from "@/app/studio/actions";
import type { StudioDocumentCollection, StudioDocumentLoad } from "@/lib/studio/load-documents";
import { studioStrings, type StudioLang } from "@/lib/studio/strings";
import { requestStudioToken } from "@/lib/studio/token";

import { CategoryEditor } from "./category-editor";
import { ProductEditor } from "./product-editor";
import { StudioMessage, loginAction } from "./studio-message";
import { StudioSkeleton } from "./studio-skeleton";

/** The editor of a category or product, from what the server loaded. */
export function StudioDocumentEditor({
  result,
  uiLang,
  cmsUrl,
}: {
  result: StudioDocumentLoad;
  uiLang: StudioLang;
  cmsUrl: string;
}) {
  const s = studioStrings[uiLang];
  if (result.status === "ok") {
    return result.collection === "solution-categories" ? (
      <CategoryEditor key={`${result.props.locale}-${uiLang}`} {...result.props} />
    ) : (
      <ProductEditor key={`${result.props.locale}-${uiLang}`} {...result.props} />
    );
  }
  if (result.status === "login")
    return <StudioMessage title={s.loginTitle} body={s.loginBody} action={loginAction(cmsUrl, s)} cmsUrl={cmsUrl} />;
  return <StudioMessage title={s.notFoundTitle} cmsUrl={cmsUrl} />;
}

/**
 * Embedded editor without a shared session cookie: asks the CMS admin around
 * it for the session token, then loads the document with it.
 */
export function StudioDocumentTokenGate({
  collection,
  id,
  locale,
  uiLang,
  cmsUrl,
}: {
  collection: StudioDocumentCollection;
  id: number;
  locale: string;
  uiLang: StudioLang;
  cmsUrl: string;
}) {
  const [result, setResult] = useState<StudioDocumentLoad | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await requestStudioToken(cmsUrl);
      const next: StudioDocumentLoad = token
        ? await loadStudioDocumentWithToken({ collection, id, locale, uiLang, token }).catch(() => ({
            status: "notFound" as const,
          }))
        : { status: "login" };
      if (!cancelled) setResult(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [collection, id, locale, uiLang, cmsUrl]);

  if (!result) return <StudioSkeleton embedded />;
  return <StudioDocumentEditor result={result} uiLang={uiLang} cmsUrl={cmsUrl} />;
}
