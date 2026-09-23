export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

/** Matches the CMS default locale; untranslated copy falls back to it. */
export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

/** Prefixes internal paths with the locale ("/contact" → "/id/contact"); leaves anchors and external URLs alone. */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [first] = href.split(/[/?#]/).filter(Boolean);
  if (isLocale(first)) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/** Same path in another language: "/en/about" → "/id/about". */
export function switchLocalePath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) segments[1] = locale;
  else segments.splice(1, 0, locale);
  return segments.join("/") || `/${locale}`;
}
