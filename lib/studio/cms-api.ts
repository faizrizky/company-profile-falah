"use client";

import type { Media, Page } from "@/types/cms";

import { requestStudioToken, studioToken } from "./token";

/**
 * Browser → CMS calls made by the visual editor. They carry the editor's CMS
 * session — the handed-over token when embedded across domains, else the
 * shared session cookie; every permission check happens in the CMS.
 */
export class StudioApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function send(cmsUrl: string, path: string, init: RequestInit, token: string | null) {
  const headers = new Headers(init.headers);
  if (token) headers.set("authorization", `JWT ${token}`);
  return fetch(new URL(path, cmsUrl), { ...init, headers, credentials: token ? "omit" : "include" });
}

async function request<T>(cmsUrl: string, path: string, init: RequestInit = {}): Promise<T> {
  let res = await send(cmsUrl, path, init, studioToken());
  // An expired handed-over token: ask the CMS for a fresh one and retry once.
  if (res.status === 401 && studioToken()) {
    const fresh = await requestStudioToken(cmsUrl);
    if (fresh) res = await send(cmsUrl, path, init, fresh);
  }
  const body = (await res.json().catch(() => ({}))) as {
    errors?: { message?: string; data?: { errors?: { message?: string; path?: string }[] } }[];
  };
  if (!res.ok) {
    const first = body.errors?.[0];
    const detail = first?.data?.errors?.map((e) => (e.path ? `${e.path}: ${e.message}` : e.message)).join(" · ");
    throw new StudioApiError(detail || first?.message || `HTTP ${res.status}`, res.status);
  }
  return body as T;
}

export function savePage(
  cmsUrl: string,
  id: number,
  changes: Pick<Page, "title" | "layout">,
  { locale, publish }: { locale: string; publish: boolean },
) {
  const params = new URLSearchParams({ locale, depth: "0" });
  if (!publish) params.set("draft", "true");
  return request<{ doc: Page }>(cmsUrl, `/api/pages/${id}?${params}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(publish ? { ...changes, _status: "published" } : changes),
  });
}

export type MediaKind = "image" | "video";

/** What the upload picker accepts for each kind (the CMS re-checks the real type). */
export const MEDIA_ACCEPT: Record<MediaKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml",
  video: "video/mp4,video/webm",
};

export function listMedia(
  cmsUrl: string,
  { page = 1, search = "", kind = "image" }: { page?: number; search?: string; kind?: MediaKind },
) {
  const params = new URLSearchParams({
    limit: "24",
    page: String(page),
    sort: "-createdAt",
    depth: "0",
    "where[mimeType][like]": kind,
  });
  if (search) params.set("where[or][0][alt][like]", search), params.set("where[or][1][filename][like]", search);
  return request<{ docs: Media[]; hasNextPage: boolean; page: number }>(cmsUrl, `/api/media?${params}`);
}

export function uploadMedia(cmsUrl: string, file: File, alt: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("_payload", JSON.stringify({ alt }));
  return request<{ doc: Media }>(cmsUrl, "/api/media", { method: "POST", body: form });
}
