"use client";

import { useEffect } from "react";

/** Message the CMS waits for before removing its editor skeleton. */
const STUDIO_READY_MESSAGE = "falah-studio:ready";

/** Tell the embedding CMS (if any) that the studio has something to show. */
export function signalStudioReady(cmsUrl: string) {
  if (window.parent === window) return;
  try {
    window.parent.postMessage({ type: STUDIO_READY_MESSAGE }, new URL(cmsUrl).origin);
  } catch {
    // Invalid CMS URL: the CMS falls back to its own timeout.
  }
}

/** Signals readiness on mount — for static states (login / not found). */
export function StudioReadySignal({ cmsUrl }: { cmsUrl: string }) {
  useEffect(() => signalStudioReady(cmsUrl), [cmsUrl]);
  return null;
}
