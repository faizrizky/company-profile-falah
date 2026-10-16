"use server";

import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyStudioAuth } from "@/lib/studio/auth";
import {
  loadStudioDocument,
  type StudioDocumentCollection,
  type StudioDocumentLoad,
} from "@/lib/studio/load-documents";

/**
 * Loads the category / product editor with a session token handed over by the
 * embedding CMS (see lib/studio/token.ts). The token is verified by the CMS itself.
 */
export async function loadStudioDocumentWithToken(input: {
  collection: StudioDocumentCollection;
  id: number;
  locale: string;
  uiLang: "id" | "en";
  token: string;
}): Promise<StudioDocumentLoad> {
  if (typeof input.token !== "string" || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(input.token)) return { status: "login" };
  if (input.collection !== "solution-categories" && input.collection !== "products") return { status: "notFound" };
  const authorization = `JWT ${input.token}`;
  const user = await verifyStudioAuth(authorization);
  if (!user) return { status: "login" };
  return loadStudioDocument({
    collection: input.collection,
    id: Number(input.id),
    locale: isLocale(input.locale) ? input.locale : defaultLocale,
    uiLang: input.uiLang === "en" ? "en" : "id",
    embedded: true,
    authorization,
    user,
  });
}
