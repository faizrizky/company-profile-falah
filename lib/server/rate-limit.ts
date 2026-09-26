import "server-only";

/**
 * In-memory sliding-window limiter for a single Node process. Use a shared
 * store (Redis / Upstash) once the site runs on more than one instance.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return (key: string): { ok: boolean; retryAfterSeconds: number } => {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => t > now - windowMs);

    if (recent.length >= limit) {
      hits.set(key, recent);
      return { ok: false, retryAfterSeconds: Math.ceil((recent[0] + windowMs - now) / 1000) };
    }

    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (v.every((t) => t <= now - windowMs)) hits.delete(k);
    }
    return { ok: true, retryAfterSeconds: 0 };
  };
}

/** Client IP as set by the reverse proxy / CDN in front of the app. */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
