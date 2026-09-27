"use client";

import { useSyncExternalStore } from "react";

/** Below Tailwind's `md` breakpoint. */
export const MOBILE_QUERY = "(max-width: 767px)";

const subscribeMobile = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * True on phone-width screens. `null` during the server render and hydration,
 * so nothing size-specific (e.g. a video file) is fetched before it is known.
 */
export function useIsMobile(): boolean | null {
  return useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE_QUERY).matches, () => null);
}

/** True when the visitor asked for less motion or less data. */
export function prefersStill() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || Boolean(connection?.saveData);
}

const noopSubscribe = () => () => {};

/** `prefersStill()` as a hook: false on the server, decided after hydration. */
export function usePrefersStill(): boolean {
  return useSyncExternalStore(noopSubscribe, prefersStill, () => false);
}
