"use client";

import { useEffect, useState } from "react";

import { loadStudioWithToken } from "@/app/studio/pages/[id]/actions";
import type { StudioLoadResult } from "@/lib/studio/load";
import { studioStrings, type StudioLang } from "@/lib/studio/strings";
import { requestStudioToken } from "@/lib/studio/token";

import { StudioEditor } from "./studio-editor";
import { StudioMessage, loginAction } from "./studio-message";
import { StudioSkeleton } from "./studio-skeleton";

/**
 * Embedded editor without a shared session cookie: asks the CMS admin around
 * it for the session token, then loads the page with it.
 */
export function StudioTokenGate({
  pageId,
  locale,
  uiLang,
  cmsUrl,
}: {
  pageId: number;
  locale: string;
  uiLang: StudioLang;
  cmsUrl: string;
}) {
  const [result, setResult] = useState<StudioLoadResult | null>(null);
  const s = studioStrings[uiLang];

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await requestStudioToken(cmsUrl);
      const next: StudioLoadResult = token
        ? await loadStudioWithToken({ pageId, locale, uiLang, token }).catch(() => ({ status: "notFound" as const }))
        : { status: "login" };
      if (!cancelled) setResult(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [pageId, locale, uiLang, cmsUrl]);

  if (!result) return <StudioSkeleton embedded />;
  if (result.status === "ok") return <StudioEditor key={`${result.props.locale}-${uiLang}`} {...result.props} />;
  if (result.status === "login")
    return <StudioMessage title={s.loginTitle} body={s.loginBody} action={loginAction(cmsUrl, s)} cmsUrl={cmsUrl} />;
  return <StudioMessage title={s.notFoundTitle} cmsUrl={cmsUrl} />;
}
