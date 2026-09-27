import "server-only";

import type { CmsTag } from "@/lib/cms/tags";
import { env } from "@/lib/env";

export class CmsError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CmsError";
  }
}

type Query = Record<string, string | number | boolean | undefined>;

type FetchOptions = {
  query?: Query;
  /** Every tag this response depends on — any of them changing purges it. */
  tags: CmsTag[];
};

export const cmsConfigured = Boolean(env.CMS_URL);

/**
 * Read-only, server-side access to the CMS REST API.
 *
 * Responses are cached indefinitely and purged on demand by the CMS via
 * /api/revalidate, so the site is served from cache and keeps working (with
 * the last good content) even if the CMS is briefly unavailable.
 */
export async function cmsFetch<T>(path: string, { query, tags }: FetchOptions): Promise<T> {
  if (!env.CMS_URL) throw new CmsError("CMS_URL is not configured");

  const url = new URL(path, env.CMS_URL);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: { accept: "application/json" },
    cache: "force-cache",
    next: { tags },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new CmsError(`CMS ${res.status} for ${url.pathname}`, res.status);
  return (await res.json()) as T;
}

export type PaginatedDocs<T> = { docs: T[]; totalDocs: number };
