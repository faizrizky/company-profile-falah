"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LocaleLink } from "@/components/i18n/locale-link";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import type { MegaMenuCategory, MegaMenuProduct } from "@/lib/cms/mega-menu";
import { mediaUrl } from "@/lib/cms/media";
import { useDelayedUnmount } from "@/lib/use-animated";
import { cn } from "@/lib/utils";
import type { Media, Navigation } from "@/types/cms";

/** Square arrow button in the corner of a mega menu card. */
function ArrowBadge({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/70 bg-black/20 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-white group-hover:bg-blue-bright",
        className,
      )}
    >
      <ArrowUpRight className="h-5 w-5" />
    </span>
  );
}

/** A link when there is somewhere to go, a plain block otherwise. */
function MaybeLink({
  href,
  onNavigate,
  className,
  children,
}: {
  href?: string;
  onNavigate: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return href ? (
    <LocaleLink href={href} onClick={onNavigate} className={className}>
      {children}
    </LocaleLink>
  ) : (
    <div className={className}>{children}</div>
  );
}

function FeaturedProduct({
  product,
  href,
  onNavigate,
}: {
  product: MegaMenuProduct;
  href?: string;
  onNavigate: () => void;
}) {
  return (
    <MaybeLink
      href={href}
      onNavigate={onNavigate}
      className="group relative block h-full overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10"
    >
      {product.image && (
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1280px) 40vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      {href && <ArrowBadge className="absolute right-5 top-5" />}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6">
        <span className="font-display text-xl font-bold leading-7 text-white">{product.title}</span>
        {product.summary && (
          <span className="line-clamp-2 max-w-[520px] text-sm leading-6 text-white/75">{product.summary}</span>
        )}
      </div>
    </MaybeLink>
  );
}

function ProductItem({
  product,
  href,
  onNavigate,
}: {
  product: MegaMenuProduct;
  href?: string;
  onNavigate: () => void;
}) {
  return (
    <MaybeLink
      href={href}
      onNavigate={onNavigate}
      className="group flex items-center gap-5 rounded-xl p-3 transition-colors duration-300 hover:bg-white/[0.07]"
    >
      <span className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-lg bg-white/5 xl:h-[112px] xl:w-[112px]">
        {product.image && (
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-display text-lg font-bold leading-6 text-white">{product.title}</span>
        {product.summary && (
          <span className="line-clamp-2 text-sm leading-6 text-white/70">{product.summary}</span>
        )}
      </span>
      {href && <ArrowBadge className="self-start opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />}
    </MaybeLink>
  );
}

function MegaMenu({
  solutions,
  open,
  onClose,
}: {
  solutions: MegaMenuCategory[];
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState(solutions[0]?.id);
  const active = solutions.find((c) => c.id === activeId) ?? solutions[0];
  if (!active) return null;
  const [featured, ...rest] = active.products;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 hidden bg-black/40 backdrop-blur-[6px] lg:block",
          open ? "animate-fade-in" : "pointer-events-none animate-fade-out",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="mega-menu"
        className={cn(
          "absolute inset-x-0 top-[50px] z-50 hidden border-y border-blue-bright/60 bg-[#060a1c]/90 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:block",
          "bg-[radial-gradient(ellipse_60%_80%_at_85%_0%,rgba(24,102,239,0.22),transparent),radial-gradient(ellipse_50%_70%_at_0%_100%,rgba(24,102,239,0.14),transparent)]",
          open ? "animate-mega-in" : "pointer-events-none animate-mega-out",
        )}
      >
        <div className="mx-auto grid h-[380px] max-w-[1600px] grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)] gap-8 px-10 py-10 box-content xl:h-[420px] xl:grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)] xl:px-20">
          <ul className="mega-scroll -mr-3 flex flex-col gap-1 overflow-y-auto pr-3">
            {solutions.map((category) => {
              const selected = category.id === active.id;
              return (
                // Pointing at (or tabbing to) a category previews its products.
                <li
                  key={category.id}
                  onMouseEnter={() => setActiveId(category.id)}
                  onFocus={() => setActiveId(category.id)}
                  onClick={() => setActiveId(category.id)}
                >
                  <MaybeLink
                    href={category.href}
                    onNavigate={onClose}
                    className={cn(
                      "flex min-h-12 w-full items-center rounded-lg px-4 py-2.5 text-[15px] leading-6 transition-all duration-300",
                      selected
                        ? "bg-blue-bright font-semibold text-white shadow-[0_6px_20px_rgba(24,102,239,0.45)]"
                        : "text-white/80 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {category.title}
                  </MaybeLink>
                </li>
              );
            })}
          </ul>

          {/* Keyed by category: its products replay the enter animation. */}
          {featured ? (
            <div key={active.id} className={cn("tab-panel-in min-h-0", rest.length === 0 && "col-span-2")}>
              <FeaturedProduct product={featured} href={active.href} onNavigate={onClose} />
            </div>
          ) : (
            <div
              key={active.id}
              className="tab-panel-in col-span-2 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-center"
            >
              <p className="font-display text-xl font-bold text-white">{active.title}</p>
              <p className="max-w-sm text-sm text-white/60">{t.solutions.comingSoon}</p>
              {active.href && (
                <Button href={active.href} variant="stroke" size="md">
                  <span className="flex items-center gap-2">
                    {active.title}
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Button>
              )}
            </div>
          )}

          {featured && rest.length > 0 && (
            <ul key={`list-${active.id}`} className="tab-panel-in mega-scroll -mr-3 flex min-h-0 flex-col gap-2 overflow-y-auto pr-3">
              {rest.map((product) => (
                <li key={product.id}>
                  <ProductItem product={product} href={active.href} onNavigate={onClose} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

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
  const [solsOpen, setSolsOpen] = useState(false);
  const megaRendered = useDelayedUnmount(mega, 250);

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
    setSolsOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "absolute inset-x-0 top-0 z-50 backdrop-blur-sm transition-colors duration-300",
          mega ? "bg-[#060a1c]/95" : "bg-surface-dark/50",
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

      </header>

      {/* Menus live outside the header: its backdrop-filter would otherwise
          stop their blur from reaching the page and trap them in its box. */}
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
                      onClick={closeAll}
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
      {megaRendered && <MegaMenu solutions={solutions} open={mega} onClose={() => setMega(false)} />}
    </>
  );
}
