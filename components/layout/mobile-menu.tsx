"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, ChevronLeft } from "lucide-react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LocaleLink } from "@/components/i18n/locale-link";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import type { MegaMenuCategory } from "@/lib/cms/mega-menu";
import { cn } from "@/lib/utils";
import type { Navigation } from "@/types/cms";

/** Links inside the menu (Figma Small Button_No Fill_b): 14/24, 40px tall. */
const ITEM = "flex min-h-10 items-center text-left text-sm leading-6 text-white transition-colors hover:text-accent";

/** Figma Menu - expand - detail: a category's products, the first one featured. */
function CategoryDetail({
  category,
  onBack,
  onNavigate,
}: {
  category: MegaMenuCategory;
  onBack: () => void;
  onNavigate: () => void;
}) {
  const { t } = useI18n();
  const [featured, ...rest] = category.products;
  const Wrap = ({ className, children }: { className: string; children: React.ReactNode }) =>
    category.href ? (
      <LocaleLink href={category.href} onClick={onNavigate} className={className}>
        {children}
      </LocaleLink>
    ) : (
      <div className={className}>{children}</div>
    );

  return (
    <div className="flex min-h-0 flex-col gap-4 pb-3 pt-[25px]">
      <button type="button" onClick={onBack} className={cn(ITEM, "gap-2 px-6")}>
        <ChevronLeft className="h-[18px] w-[18px]" />
        {t.nav.back}
      </button>
      {featured && (
        <Wrap className="group relative flex h-[290px] shrink-0 flex-col justify-end gap-4 overflow-hidden p-5">
          {featured.image && (
            <Image src={featured.image} alt={featured.alt} fill sizes="100vw" className="-z-10 object-cover" />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-surface-dark/80 via-surface-dark/20 to-transparent" />
          {category.href && (
            <span
              aria-hidden
              className="flex h-10 w-fit items-center justify-center rounded-lg border border-white bg-surface-dark/5 px-2 text-white backdrop-blur-[5px] transition-colors duration-300 group-hover:border-transparent group-hover:bg-blue-bright"
            >
              <ArrowUpRight className="h-6 w-6" strokeWidth={1.5} />
            </span>
          )}
          <span className="flex flex-col gap-1 text-white">
            <span className="font-display text-base font-bold leading-[18px]">{featured.title}</span>
            {featured.summary && <span className="text-xs leading-4">{featured.summary}</span>}
          </span>
        </Wrap>
      )}
      {/* Figma Mobile - Scroll_b: the rest scroll, with a blue 4px scrollbar. */}
      <div className="mr-1 min-h-0 flex-1 overflow-y-auto [scrollbar-color:#1866ef_#05040d] [scrollbar-width:thin]">
        {rest.map((product) => (
          <Wrap key={product.id} className="flex h-24 items-center gap-3 rounded-lg py-3 pl-6">
            <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-white/5">
              {product.image && (
                <Image src={product.image} alt={product.alt} fill sizes="72px" className="object-cover" />
              )}
            </span>
            <span className="font-display text-base font-bold leading-7 text-white">{product.title}</span>
          </Wrap>
        ))}
      </div>
    </div>
  );
}

/** Figma Menu - expand: drops down under the navbar on phones and tablets. */
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
  /** Tapping outside the menu. */
  onClose: () => void;
  /** A link was followed. */
  onNavigate: () => void;
}) {
  const [solsOpen, setSolsOpen] = useState(true);
  const [category, setCategory] = useState<MegaMenuCategory | null>(null);
  // Figma: the first link (About) sits above "Our Solutions", the rest below.
  const [first, ...others] = navLinks;
  const link = (l: (typeof navLinks)[number]) => (
    <LocaleLink key={l.id ?? l.label} href={l.href} onClick={onNavigate} className={ITEM}>
      {l.label}
    </LocaleLink>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 top-[50px] z-[60] flex flex-col bg-surface-dark/50 backdrop-blur-[5px] lg:hidden">
      <div className="flex max-h-full min-h-0 flex-col overflow-y-auto border-b border-blue-bright bg-surface-dark/50 backdrop-blur-[14.7px]">
        {category ? (
          <CategoryDetail category={category} onBack={() => setCategory(null)} onNavigate={onNavigate} />
        ) : (
          <div className="flex flex-col gap-4 px-6 py-6">
            {first && link(first)}
            <div className="flex flex-col gap-4">
              <button
                type="button"
                aria-expanded={solsOpen}
                onClick={() => setSolsOpen((v) => !v)}
                className={cn(ITEM, "justify-between")}
              >
                {solutionsLabel}
                <ChevronDown
                  className={cn("h-[18px] w-[18px] transition-transform duration-300", solsOpen && "rotate-180")}
                />
              </button>
              {solsOpen && (
                <div className="flex flex-col gap-1 pl-2">
                  {solutions.map((c) => (
                    <button key={c.id} type="button" onClick={() => setCategory(c)} className={ITEM}>
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {others.map(link)}
            <LanguageSwitcher className="w-fit" />
            {cta?.href && (
              <Button href={cta.href} variant="fill" size="md" className="w-full px-4">
                {cta.label}
              </Button>
            )}
          </div>
        )}
      </div>
      <button type="button" aria-hidden tabIndex={-1} className="min-h-0 flex-1" onClick={onClose} />
    </div>
  );
}
