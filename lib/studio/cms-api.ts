"use client";

import type { Media, Page } from "@/types/cms";

/**
 * Browser → CMS calls made by the visual editor. They carry the editor's CMS
 * session cookie; every permission check happens in the CMS.
 */
export class StudioApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(cmsUrl: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(new URL(path, cmsUrl), { ...init, credentials: "include" });
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
  layout: Page["layout"],
  { locale, publish }: { locale: string; publish: boolean },
) {
  const params = new URLSearchParams({ locale, depth: "0" });
  if (!publish) params.set("draft", "true");
  return request<{ doc: Page }>(cmsUrl, `/api/pages/${id}?${params}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(publish ? { layout, _status: "published" } : { layout }),
  });
}

export function listImages(cmsUrl: string, { page = 1, search = "" }: { page?: number; search?: string }) {
  const params = new URLSearchParams({
    limit: "24",
    page: String(page),
    sort: "-createdAt",
    depth: "0",
    "where[mimeType][like]": "image",
  });
  if (search) params.set("where[or][0][alt][like]", search), params.set("where[or][1][filename][like]", search);
  return request<{ docs: Media[]; hasNextPage: boolean; page: number }>(cmsUrl, `/api/media?${params}`);
}

export function uploadImage(cmsUrl: string, file: File, alt: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("_payload", JSON.stringify({ alt }));
  return request<{ doc: Media }>(cmsUrl, "/api/media", { method: "POST", body: form });
}
