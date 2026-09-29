"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LocaleLink } from "@/components/i18n/locale-link";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import type { MegaMenuCategory } from "@/lib/cms/mega-menu";
import { mediaUrl } from "@/lib/cms/media";
import { useDelayedUnmount } from "@/lib/use-animated";
import { cn } from "@/lib/utils";
import type { Media, Navigation } from "@/types/cms";

import { LoadingBar } from "./loading-bar";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";

export function Navbar({
  navigation,
  solutions,
  logo,
}: {
  navigation: Navigation;
  solutions: MegaMenuCategory[];
  logo?: Media | null;
}) {
  const navLinks = navigation.links ?? [];
  const cta = navigation.cta;
  const solutionsLabel = navigation.solutionsLabel || "Our Solutions";
  const logoUrl = mediaUrl(logo);
  const { t } = useI18n();

  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const megaRendered = useDelayedUnmount(mega, 250);
  // Kept mounted a moment after closing, so it can slide away.
  const mobileRendered = useDelayedUnmount(mobile, 250);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMega(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  const closeAll = () => {
    setMega(false);
    setMobile(false);
  };

  return (
    <>
      <header
        className={cn(
          "absolute inset-x-0 top-0 z-50 backdrop-blur-sm transition-colors duration-300",
          mega ? "bg-[#1f1f24]/80" : "bg-surface-dark/50",
        )}
      >
        <div className="flex h-[50px] items-center justify-between px-6 lg:px-20">
          <LocaleLink href="/" aria-label={t.nav.home}>
            {logoUrl && <Image src={logoUrl} alt={logo?.alt || t.nav.home} width={128} height={30} priority />}
          </LocaleLink>

          <nav className="hidden items-center gap-6 lg:flex">
            <button
              type="button"
              aria-expanded={mega}
              aria-controls="mega-menu"
              onClick={() => setMega((v) => !v)}
              className={cn(
                "flex items-center gap-1 text-sm transition-colors hover:text-accent",
                mega ? "text-accent" : "text-white",
              )}
            >
              {solutionsLabel}
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", mega && "rotate-180")} />
            </button>
            {navLinks.map((link) => (
              <LocaleLink key={link.id ?? link.label} href={link.href} className="text-sm text-white hover:text-accent">
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
            {mobile ? <X className="h-[34px] w-[34px]" strokeWidth={1.5} /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <LoadingBar />
      </header>

      {/* Menus live outside the header: its backdrop-filter would otherwise
          stop their blur from reaching the page and trap them in its box. */}
      {mobileRendered && (
        <MobileMenu
          open={mobile}
          solutions={solutions}
          solutionsLabel={solutionsLabel}
          navLinks={navLinks}
          cta={cta}
          onClose={() => setMobile(false)}
          onNavigate={closeAll}
        />
      )}
      {megaRendered && <MegaMenu solutions={solutions} open={mega} onClose={() => setMega(false)} />}
    </>
  );
}
