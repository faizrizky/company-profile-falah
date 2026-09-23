import type { Media } from "@/types/cms";

export type MediaField = number | Media | null | undefined;

/** A populated media document, or null when it's missing / not populated. */
export function asMedia(field: MediaField): Media | null {
  return field && typeof field === "object" && field.url ? field : null;
}

export function mediaUrl(field: MediaField): string | undefined {
  return asMedia(field)?.url ?? undefined;
}

export function mediaAlt(field: MediaField, fallback = ""): string {
  return asMedia(field)?.alt || fallback;
}

/** Keep only related docs Payload populated (drops bare IDs of deleted/unpublished docs). */
export function populated<T extends { id: number }>(items: (number | T)[] | null | undefined): T[] {
  return (items ?? []).filter((item): item is T => typeof item === "object" && item !== null);
}
