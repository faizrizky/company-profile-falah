import type { Metadata } from "next";

import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

/** canonical + hreflang alternates for a path that exists in every locale ("" = home). */
export function localeAlternates(path: string, locale: Locale): Metadata["alternates"] {
  const suffix = path ? `/${path}` : "";
  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${suffix}`])),
      "x-default": `/${defaultLocale}${suffix}`,
    },
  };
}
