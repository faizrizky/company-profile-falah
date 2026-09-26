"use client";

import type { AnchorHTMLAttributes } from "react";

import { useI18n } from "@/components/i18n/locale-provider";
import { localizeHref } from "@/lib/i18n/config";

/** <a> that keeps the visitor in their language for internal links. */
export function LocaleLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { locale } = useI18n();
  return <a href={localizeHref(href, locale)} {...props} />;
}
