import "server-only";

import { cookies } from "next/headers";

import { env } from "@/lib/env";
import type { User } from "@/types/cms";

/** Payload's session cookie (set by the CMS on login). */
export const CMS_SESSION_COOKIE = "payload-token";

/**
 * The visual editor has no login of its own: it reuses the CMS session.
 * The cookie is verified by the CMS on every call; this check only decides
 * whether to render the editor or the "please log in" screen.
 */
export async function getStudioSession(): Promise<{ user: User; authorization: string } | null> {
  if (!env.CMS_URL) return null;
  const token = (await cookies()).get(CMS_SESSION_COOKIE)?.value;
  if (!token) return null;

  // Server-to-server: pass the session as a header. Payload only honours the
  // cookie together with an allowed Origin (CSRF protection), which is right
  // for browsers but not for this call.
  const authorization = `JWT ${token}`;
  const res = await fetch(new URL("/api/users/me", env.CMS_URL), {
    headers: { authorization },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return null;
  const { user } = (await res.json()) as { user: User | null };
  return user ? { user, authorization } : null;
}

export const cmsPublicUrl = () => env.CMS_PUBLIC_URL ?? env.CMS_URL ?? "";
