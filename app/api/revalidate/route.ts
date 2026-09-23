import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { isCmsTag } from "@/lib/cms/tags";
import { env } from "@/lib/env";
import { safeEqual } from "@/lib/server/timing-safe";

const bodySchema = z.object({ tags: z.array(z.string()).min(1).max(20) });

/** Called by the CMS after content changes (CMS `hooks/revalidateFrontend.ts`). */
export async function POST(request: NextRequest) {
  const secret = env.REVALIDATE_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || !safeEqual(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const tags = parsed.data.tags.filter(isCmsTag);
  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({ revalidated: tags });
}
