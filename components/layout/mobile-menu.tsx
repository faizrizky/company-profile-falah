"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LocaleLink } from "@/components/i18n/locale-link";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import type { MegaMenuCategory } from "@/lib/cms/mega-menu";
import type { Navigation } from "@/types/cms";

/** Full-screen menu on phones and tablets. */
export function MobileMenu({
  solutions,
  solutionsLabel,
  navLinks,
  cta,
  onClose,
  onNavigate,
}: {
  solutions: MegaMenuCategory[];
  solutionsLabel: string;
  navLinks: NonNullable<Navigation["links"]>;
  cta: Navigation["cta"];
  /** The close (X) button. */
  onClose: () => void;
  /** A link was followed. */
  onNavigate: () => void;
}) {
  const { t } = useI18n();
  const [solsOpen, setSolsOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col border-b-2 border-blue-bright bg-surface-dark/50 p-6 backdrop-blur-lg lg:hidden">
      <button
        type="button"
        aria-label={t.nav.closeMenu}
        className="absolute right-6 top-6 text-white"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      <div className="flex flex-col gap-5">
        <button
          type="button"
          aria-expanded={solsOpen}
          onClick={() => setSolsOpen((v) => !v)}
          className="flex items-center justify-between text-lg font-medium text-white"
        >
          {solutionsLabel}
          <ChevronDown className={solsOpen ? "h-5 w-5 rotate-180" : "h-5 w-5"} />
        </button>
        {solsOpen && (
          <div className="flex flex-col gap-3">
            {solutions.map((category) =>
              category.href ? (
                <LocaleLink
                  key={category.id}
                  href={category.href}
                  onClick={onNavigate}
                  className="text-base text-white/80"
                >
                  {category.title}
                </LocaleLink>
              ) : (
                <span key={category.id} className="text-base text-white/40">
                  {category.title}
                </span>
              ),
            )}
          </div>
        )}
        {navLinks.map((link) => (
          <LocaleLink
            key={link.id ?? link.label}
            href={link.href}
            onClick={onNavigate}
            className="text-lg font-medium text-white"
          >
            {link.label}
          </LocaleLink>
        ))}
        <LanguageSwitcher className="w-fit" />
        {cta?.href && (
          <Button href={cta.href} variant="fill" size="lg" className="w-full">
            {cta.label}
          </Button>
        )}
      </div>
    </div>
  );
}
