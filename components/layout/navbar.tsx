"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LocaleLink } from "@/components/i18n/locale-link";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/cms/media";
import { useDelayedUnmount } from "@/lib/use-animated";
import { cn } from "@/lib/utils";
import type { Media, Navigation } from "@/types/cms";

export function Navbar({ navigation, logo }: { navigation: Navigation; logo?: Media | null }) {
  const solutionLinks = navigation.solutionLinks ?? [];
  const featuredCard = navigation.featured;
  const solutionCards = navigation.cards ?? [];
  const navLinks = navigation.links ?? [];
  const cta = navigation.cta;
  const logoUrl = mediaUrl(logo);
  const { t } = useI18n();

  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [solsOpen, setSolsOpen] = useState(false);
  const megaRendered = useDelayedUnmount(mega, 250);

  const closeAll = () => {
    setMega(false);
    setMobile(false);
    setSolsOpen(false);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-surface-dark/50 backdrop-blur-sm">
      <div className="flex h-[50px] items-center justify-between px-6 lg:px-20">
        <LocaleLink href="/" aria-label={t.nav.home}>
          {logoUrl && <Image src={logoUrl} alt={logo?.alt || t.nav.home} width={128} height={30} priority />}
        </LocaleLink>

        <nav className="hidden items-center gap-6 lg:flex">
          <button
            type="button"
            aria-expanded={mega}
            onClick={() => setMega((v) => !v)}
            className="flex items-center gap-1 text-sm text-white hover:text-accent"
          >
            {navigation.solutionsLabel || "Our Solutions"}
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", mega && "rotate-180")} />
          </button>
          {navLinks.map((link) => (
            <LocaleLink
              key={link.id ?? link.label}
              href={link.href}
              className="text-sm text-white hover:text-accent"
            >
              {link.label}
            </LocaleLink>
          ))}
          <LanguageSwitcher />
          {cta?.href && (
            <Button href={cta.href} variant="fill" size="md">
              {cta.label}
            </Button>
          )}
        </nav>

        <button
          type="button"
          aria-label={t.nav.toggleMenu}
          className="text-white lg:hidden"
          onClick={() => setMobile((v) => !v)}
        >
          {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {megaRendered && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 top-[50px] z-40 hidden bg-black/10 backdrop-blur-[6px] lg:block",
            mega ? "animate-fade-in" : "pointer-events-none animate-fade-out",
          )}
          onClick={() => setMega(false)}
          aria-hidden="true"
        />
      )}

      {megaRendered && (
        <div
          className={cn(
            "absolute inset-x-0 top-[50px] z-50 hidden bg-black/50 p-10 px-20 backdrop-blur-[14px] lg:block",
            mega ? "animate-mega-in" : "pointer-events-none animate-mega-out",
          )}
        >
          <div className="flex items-start gap-8">
            <div className="flex w-[280px] flex-col gap-1">
              {solutionLinks.map((l) => (
                <LocaleLink
                  key={l.id ?? l.label}
                  href={l.href}
                  onClick={() => setMega(false)}
                  className={
                    l.highlight
                      ? "gradient-brand flex h-[60px] items-center rounded-lg px-5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
                      : "flex h-[60px] items-center rounded-lg px-5 text-sm font-medium text-[#D4D4D4] transition-transform duration-300 hover:scale-[1.03] hover:bg-white/5 hover:text-white"
                  }
                >
                  {l.label}
                </LocaleLink>
              ))}
            </div>

            <LocaleLink
              href={featuredCard.href}
              onClick={() => setMega(false)}
              className="group relative h-[400px] w-[458px] overflow-hidden rounded-lg"
            >
              <img
                src={mediaUrl(featuredCard.image)}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-black/40 p-8 backdrop-blur-sm">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold leading-6 text-white">
                      {featuredCard.title}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm leading-6 text-white/70">
                    {featuredCard.description}
                  </span>
                </div>
              </div>
            </LocaleLink>

            <div className="flex w-[458px] flex-col gap-4">
              {solutionCards.map((c, i) => (
                <LocaleLink
                  key={c.id ?? c.title}
                  href={c.href}
                  onClick={() => setMega(false)}
                  className={
                    "group flex h-[192px] items-center gap-4 rounded-lg p-2 " +
                    (i === 0 ? "bg-[#404040]" : "bg-transparent")
                  }
                >
                  <img
                    src={mediaUrl(c.image)}
                    alt=""
                    className="h-[100px] w-[100px] shrink-0 rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-bold leading-6 text-white">
                        {c.title}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm leading-6 text-white/70">
                      {c.description}
                    </span>
                  </div>
                </LocaleLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobile && (
        <div className="fixed inset-0 z-[60] flex flex-col border-b-2 border-blue-bright bg-surface-dark/50 p-6 backdrop-blur-lg lg:hidden">
          <button
            type="button"
            aria-label={t.nav.closeMenu}
            className="absolute right-6 top-6 text-white"
            onClick={() => setMobile(false)}
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
              {navigation.solutionsLabel || "Our Solutions"}
              <ChevronDown
                className={solsOpen ? "h-5 w-5 rotate-180" : "h-5 w-5"}
              />
            </button>
            {solsOpen && (
              <div className="flex flex-col gap-3">
                {solutionLinks.map((l) => (
                  <LocaleLink
                    key={l.id ?? l.label}
                    href={l.href}
                    onClick={closeAll}
                    className="text-base text-white/80"
                  >
                    {l.label}
                  </LocaleLink>
                ))}
              </div>
            )}
            {navLinks.map((link) => (
              <LocaleLink
                key={link.id ?? link.label}
                href={link.href}
                onClick={closeAll}
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
      )}
    </header>
  );
}
