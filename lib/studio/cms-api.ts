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

/** Real stages of a save, as reported by the CMS (its /api/falah-save endpoint). */
export type SaveStage = "sending" | "received" | "preparing" | "writing" | "saved" | "revalidating";

/** Where each stage puts the progress bar; sending is measured in bytes (0–20%). */
const STAGE_PCT: Record<Exclude<SaveStage, "sending">, number> = {
  received: 25,
  preparing: 35,
  writing: 50,
  saved: 80,
  revalidating: 90,
};

type SaveDone = { status: number; body: unknown };

function saveRequest(
  cmsUrl: string,
  query: string,
  payload: string,
  token: string | null,
  onProgress: (stage: SaveStage, pct: number) => void,
): Promise<SaveDone> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", new URL(`/api/falah-save?${query}`, cmsUrl).href);
    xhr.setRequestHeader("content-type", "application/json");
    if (token) xhr.setRequestHeader("authorization", `JWT ${token}`);
    else xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress("sending", (e.loaded / e.total) * 20);
    };

    let read = 0;
    let done: SaveDone | null = null;
    const consume = () => {
      const text = xhr.responseText;
      let newline: number;
      while ((newline = text.indexOf("\n", read)) !== -1) {
        const line = text.slice(read, newline).trim();
        read = newline + 1;
        if (!line) continue;
        const event = JSON.parse(line) as
          | { type: "stage"; stage: Exclude<SaveStage, "sending"> }
          | { type: "done"; status: number; body: unknown };
        if (event.type === "stage") onProgress(event.stage, STAGE_PCT[event.stage]);
        else done = { status: event.status, body: event.body };
      }
    };
    xhr.onprogress = consume;
    xhr.onload = () => {
      // Not a stream (e.g. session expired): a plain JSON answer.
      if (!xhr.getResponseHeader("content-type")?.includes("ndjson")) {
        let body: unknown = {};
        try {
          body = JSON.parse(xhr.responseText);
        } catch {
          // Empty or not JSON.
        }
        resolve({ status: xhr.status, body });
        return;
      }
      consume();
      if (done) resolve(done);
      else reject(new StudioApiError("The save was interrupted.", 0));
    };
    xhr.onerror = () => reject(new StudioApiError("Network error", 0));
    xhr.send(payload);
  });
}

/**
 * Saves the page (published, or as a draft) with real progress: bytes sent, then
 * each stage as the CMS reaches it (preparing, checking and saving, website refresh).
 */
export async function savePageWithProgress(
  cmsUrl: string,
  id: number,
  changes: Pick<Page, "title" | "layout">,
  { locale, publish }: { locale: string; publish: boolean },
  onProgress: (stage: SaveStage, pct: number) => void,
): Promise<{ doc: Page; handedOver: boolean }> {
  const params = new URLSearchParams({ locale, depth: "0" });
  if (!publish) params.set("draft", "true");
  const payload = JSON.stringify({
    target: "collection",
    slug: "pages",
    id,
    data: publish ? { ...changes, _status: "published" } : changes,
  });

  // Inside the CMS, the CMS page runs the save and shows its progress, so it
  // survives switching tabs; standalone (or an older CMS), save from here.
  const handedOver = await handOverSave(cmsUrl, params.toString(), payload, publish);
  let result = handedOver ?? (await saveRequest(cmsUrl, params.toString(), payload, studioToken(), onProgress));
  // An expired handed-over token: ask the CMS for a fresh one and retry once.
  if (!handedOver && result.status === 401 && studioToken()) {
    const fresh = await requestStudioToken(cmsUrl);
    if (fresh) result = await saveRequest(cmsUrl, params.toString(), payload, fresh, onProgress);
  }
  const body = result.body as {
    doc?: Page;
    errors?: { message?: string; data?: { errors?: { message?: string; path?: string }[] } }[];
  };
  if (result.status >= 400 || result.status === 0) {
    const first = body.errors?.[0];
    const detail = first?.data?.errors?.map((e) => (e.path ? `${e.path}: ${e.message}` : e.message)).join(" · ");
    throw new StudioApiError(detail || first?.message || `HTTP ${result.status}`, result.status);
  }
  return { doc: body.doc as Page, handedOver: Boolean(handedOver) };
}

/**
 * Asks the embedding CMS page to run the save. Resolves with its result, or
 * null when there is no CMS around to take it (not embedded, or it doesn't
 * answer within a moment).
 */
function handOverSave(cmsUrl: string, search: string, body: string, publish: boolean): Promise<SaveDone | null> {
  if (window.parent === window) return Promise.resolve(null);
  let origin: string;
  try {
    origin = new URL(cmsUrl).origin;
  } catch {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const requestId = crypto.randomUUID();
    let accepted = false;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== window.parent || event.data?.requestId !== requestId) return;
      if (event.data.type === "falah-studio:save-accepted") accepted = true;
      if (event.data.type === "falah-studio:save-done") {
        window.removeEventListener("message", onMessage);
        resolve({ status: event.data.status, body: event.data.body });
      }
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "falah-studio:save", requestId, search, body, publish }, origin);
    window.setTimeout(() => {
      if (accepted) return;
      window.removeEventListener("message", onMessage);
      resolve(null);
    }, 1500);
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
  if (search) {
    params.set("where[or][0][alt][like]", search);
    params.set("where[or][1][filename][like]", search);
  }
  return request<{ docs: Media[]; hasNextPage: boolean; page: number }>(cmsUrl, `/api/media?${params}`);
}

export function uploadMedia(cmsUrl: string, file: File, alt: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("_payload", JSON.stringify({ alt }));
  return request<{ doc: Media }>(cmsUrl, "/api/media", { method: "POST", body: form });
}
