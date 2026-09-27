"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { Product, SolutionCategory } from "@/types/cms";
import { GlowLine } from "@/components/common/glow-line";

function ProductCard({ product }: { product: Product }) {
  const image = mediaUrl(product.image);
  const imageMobile = mediaUrl(product.imageMobile);
  const alt = mediaAlt(product.image, product.title);
  const { wide, largeTitle } = product.layout ?? {};

  return (
    <div
      className={cn(
        "relative h-[200px] overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.03] md:h-[397px]",
        wide && "md:col-span-2",
      )}
    >
      {image &&
        (imageMobile ? (
          <>
            <Image src={imageMobile} alt={alt} fill className="object-cover md:hidden" />
            <Image src={image} alt={alt} fill className="hidden object-cover md:block" />
          </>
        ) : (
          <Image src={image} alt={alt} fill className="object-cover" />
        ))}
      <div className="absolute inset-0 bg-surface-dark/50 md:bg-surface-dark/25" />
      <div className="relative flex h-full flex-col items-end justify-between p-5">
        <Button variant="stroke" size="md" ariaLabel={product.title} className="px-2">
          <ArrowUpRight className="h-4 w-4" />
        </Button>
        <h3
          className={cn(
            "w-full font-display font-bold text-white",
            largeTitle ? "text-xl leading-5" : "text-base leading-5",
          )}
        >
          {product.title}
        </h3>
      </div>
    </div>
  );
}

const categoryId = (p: Product) => (typeof p.category === "object" ? p.category.id : p.category);

export function SolutionOverviewTabs({
  categories,
  products,
}: {
  categories: SolutionCategory[];
  products: Product[];
}) {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const visible = products.filter((p) => categoryId(p) === activeId);

  return (
    <>
      <div role="tablist" className="flex w-full gap-4 overflow-x-auto md:justify-center">
        {categories.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveId(c.id)}
              className={cn(
                "relative flex h-12 w-[243px] shrink-0 items-center justify-center rounded-lg border px-4 text-sm font-bold leading-4 text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.03]",
                active ? "border-accent/50 bg-accent/5" : "border-[#3d3d3d]/50 bg-surface-dark/5",
              )}
            >
              {c.title}
              {active && (
                <GlowLine width={170} thickness={5} className="absolute -top-0.5 left-1/2 -translate-x-1/2" />
              )}
            </button>
          );
        })}
      </div>
      {/* Keyed by tab: the cards replay their enter animation on every switch. */}
      <div key={activeId} role="tabpanel" className="tab-panel-in grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {visible.length === 0 && (
          <p className="col-span-full py-16 text-center text-sm text-white/70">
            {t.solutions.comingSoon}
          </p>
        )}
      </div>
    </>
  );
}
