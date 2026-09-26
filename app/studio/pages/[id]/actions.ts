"use server";

import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { loadStudio, verifyStudioAuth, type StudioLoadResult } from "@/lib/studio/load";

/**
 * Loads the editor with a session token handed over by the embedding CMS
 * (see lib/studio/token.ts). The token is verified by the CMS itself.
 */
export async function loadStudioWithToken(input: {
  pageId: number;
  locale: string;
  uiLang: "id" | "en";
  token: string;
}): Promise<StudioLoadResult> {
  if (typeof input.token !== "string" || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(input.token)) return { status: "login" };
  const authorization = `JWT ${input.token}`;
  const user = await verifyStudioAuth(authorization);
  if (!user) return { status: "login" };
  return loadStudio({
    pageId: Number(input.pageId),
    locale: isLocale(input.locale) ? input.locale : defaultLocale,
    uiLang: input.uiLang === "en" ? "en" : "id",
    embedded: true,
    authorization,
    user,
  });
}
