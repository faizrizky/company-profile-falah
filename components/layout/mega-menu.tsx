"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { LocaleLink } from "@/components/i18n/locale-link";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import type { MegaMenuCategory, MegaMenuProduct } from "@/lib/cms/mega-menu";
import { cn } from "@/lib/utils";

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
      className="group relative block h-full overflow-hidden rounded-lg bg-white/5"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {href && <ArrowBadge className="absolute right-4 top-4 h-10 w-10" />}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5">
        <span className="font-display text-base font-bold leading-6 text-white">{product.title}</span>
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
      className="group flex items-center gap-4 rounded-lg p-2 transition-colors duration-300 hover:bg-surface-dark/50"
    >
      <span className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-md bg-white/5">
        {product.image && (
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="78px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-display text-lg font-bold leading-6 tracking-wide text-white">{product.title}</span>
        {product.summary && <span className="line-clamp-2 text-sm leading-6 text-white/85">{product.summary}</span>}
      </span>
      {href && (
        <ArrowBadge className="h-10 w-10 self-start opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
      )}
    </MaybeLink>
  );
}

/** Desktop "Our Solutions" menu: categories with their products. */
export function MegaMenu({
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
          "fixed inset-0 z-40 hidden bg-black/20 backdrop-blur-[4px] lg:block",
          open ? "animate-fade-in" : "pointer-events-none animate-fade-out",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="mega-menu"
        className={cn(
          "fixed inset-x-0 top-[52px] z-50 hidden border-b border-blue-bright/60 bg-[#1f1f24]/80 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-[14px] lg:block",
          open ? "animate-mega-in" : "pointer-events-none animate-mega-out",
        )}
      >
        <div className="mx-auto grid h-[320px] max-w-[1600px] grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)] gap-8 px-10 py-10 box-content xl:h-[340px] xl:grid-cols-[250px_minmax(0,1fr)_minmax(0,1fr)] xl:px-12">
          <ul className="mega-scroll -mr-3 flex flex-col gap-2 overflow-y-auto pr-3">
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
                      "inline-flex items-center rounded-lg px-3 py-2 text-sm leading-6 transition-all duration-300",
                      // Figma Menu Button_b: regular → bold blue on hover → filled when selected.
                      selected
                        ? "bg-blue-bright font-bold text-white"
                        : "text-white hover:font-bold hover:text-blue-bright",
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
            <ul
              key={`list-${active.id}`}
              className="tab-panel-in mega-scroll mega-scroll--bold -mr-3 flex min-h-0 flex-col gap-3 overflow-y-auto pr-5"
            >
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
