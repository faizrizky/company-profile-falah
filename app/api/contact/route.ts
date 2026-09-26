import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { MIN_FILL_TIME_MS, antiSpamSchema, contactSchema } from "@/lib/contact-schema";
import { env } from "@/lib/env";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const MAX_BODY_BYTES = 10_000;

/**
 * Contact form → CMS inbox. The browser never talks to the CMS: this route
 * validates, rate-limits and filters spam, then forwards server-to-server
 * with a secret key.
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = clientIp(request.headers);
  const { ok, retryAfterSeconds } = limiter(ip);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "retry-after": String(retryAfterSeconds) } },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ error: "Payload too large." }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const spam = antiSpamSchema.safeParse(body);
  const tooFast = spam.success && Date.now() - spam.data.startedAt < MIN_FILL_TIME_MS;
  if (!spam.success || tooFast) {
    // Pretend success so bots don't learn what tripped the filter.
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", fields: Object.keys(z.flattenError(parsed.error).fieldErrors) },
      { status: 400 },
    );
  }

  if (!env.CMS_URL || !env.CMS_CONTACT_API_KEY) {
    console.error("Contact form is not configured (CMS_URL / CMS_CONTACT_API_KEY).");
    return NextResponse.json({ error: "Service unavailable. Please try again later." }, { status: 503 });
  }

  try {
    const res = await fetch(new URL("/api/contact-submissions/submit", env.CMS_URL), {
      method: "POST",
      headers: { "content-type": "application/json", "x-contact-key": env.CMS_CONTACT_API_KEY },
      body: JSON.stringify({
        submission: parsed.data,
        client: { ip, userAgent: (request.headers.get("user-agent") ?? "unknown").slice(0, 300) },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);
  } catch (error) {
    console.error("Failed to forward contact submission", error);
    return NextResponse.json({ error: "Could not send your message. Please try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
