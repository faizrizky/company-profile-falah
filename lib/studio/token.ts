"use client";

/**
 * Session handoff for the embedded editor.
 *
 * When the website and the CMS live on unrelated domains (e.g. two
 * *.vercel.app hosts) the CMS session cookie can't reach the editor, so the
 * CMS admin — which embeds the editor in an iframe — hands over its session
 * token with postMessage instead:
 *
 *   editor → CMS:  { type: "falah-studio:token-request" }
 *   CMS → editor:  { type: "falah-studio:token", token }
 *
 * Messages are only sent to, and only accepted from, the CMS origin. The
 * token lives in memory only and goes to the CMS as an Authorization header.
 */
const TOKEN_REQUEST = "falah-studio:token-request";
const TOKEN_RESPONSE = "falah-studio:token";

const TIMEOUT_MS = 10_000;

let current: string | null = null;
let pending: Promise<string | null> | null = null;

export const studioToken = () => current;

/** Asks the embedding CMS for a (fresh) session token. Null when there is none. */
export function requestStudioToken(cmsUrl: string): Promise<string | null> {
  if (pending) return pending;
  if (typeof window === "undefined" || window.parent === window) return Promise.resolve(null);

  let cmsOrigin: string;
  try {
    cmsOrigin = new URL(cmsUrl).origin;
  } catch {
    return Promise.resolve(null);
  }

  pending = new Promise<string | null>((resolve) => {
    const finish = (token: string | null) => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
      current = token;
      pending = null;
      resolve(token);
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== cmsOrigin || event.data?.type !== TOKEN_RESPONSE) return;
      finish(typeof event.data.token === "string" && event.data.token ? event.data.token : null);
    };
    const timer = window.setTimeout(() => finish(null), TIMEOUT_MS);
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: TOKEN_REQUEST }, cmsOrigin);
  });
  return pending;
}
