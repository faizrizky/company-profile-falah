import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  const accept = request.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const lang = part.split(";")[0]?.trim().toLowerCase().slice(0, 2);
    if (isLocale(lang)) return lang;
  }
  return defaultLocale;
}

/**
 * Every public page lives under /en or /id. Unprefixed URLs redirect to the
 * visitor's language (saved choice → browser language → English), and the
 * chosen language is remembered in a cookie.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    }
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, the visual editor, Next internals and any file with an extension.
  matcher: ["/((?!api|studio|_next|.*\\..*).*)"],
};
