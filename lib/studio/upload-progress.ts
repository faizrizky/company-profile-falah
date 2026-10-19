"use client";

import { useSyncExternalStore } from "react";

/**
 * The upload in flight, shared between the media picker (which starts it) and
 * the editor's toast (which shows it). Null when nothing is uploading.
 */
export type UploadState = { name: string; pct: number } | null;

let state: UploadState = null;
const listeners = new Set<() => void>();

export function setUploadState(next: UploadState) {
  state = next;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};

export const useUploadState = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => null,
  );
