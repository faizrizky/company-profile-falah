"use client";

import { usePathname } from "next/navigation";

import { useI18n } from "@/components/i18n/locale-provider";
import { locales, localeNames, switchLocalePath } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? "/";

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn("flex items-center rounded-full border border-white/30 p-0.5 text-xs", className)}
    >
      {locales.map((code) => (
        <a
          key={code}
          href={switchLocalePath(pathname, code)}
          hrefLang={code}
          lang={code}
          aria-current={code === locale ? "true" : undefined}
          title={localeNames[code]}
          className={cn(
            "rounded-full px-2.5 py-1 font-medium uppercase transition-colors",
            code === locale ? "bg-white text-surface-dark" : "text-white/80 hover:text-white",
          )}
        >
          {code}
        </a>
      ))}
    </div>
  );
}
