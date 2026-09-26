"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-surface-dark px-6 pt-[50px] text-center">
      <span className="rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-sm text-white">404</span>
      <h1 className="font-display text-[32px] font-bold leading-tight text-white md:text-[48px]">{t.notFound.title}</h1>
      <p className="max-w-[480px] text-base leading-6 text-white/80">{t.notFound.body}</p>
      <Button href="/" variant="fill" size="lg">
        {t.notFound.back}
      </Button>
    </section>
  );
}
