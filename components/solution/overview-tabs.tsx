"use client";

import { useState } from "react";
import { ImageLinkCard } from "@/components/common/image-link-card";
import { useI18n } from "@/components/i18n/locale-provider";
import { TabButton } from "@/components/ui/tab-button";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn, slugify } from "@/lib/utils";
import type { Product, SolutionCategory } from "@/types/cms";

/**
 * A product in the Solution overview. When its category has a detail page,
 * the whole card links there and opens that product's tab (#anchor).
 */
function ProductCard({ product, href }: { product: Product; href?: string }) {
  const { wide, largeTitle } = product.layout ?? {};
  return (
    <ImageLinkCard
      title={product.title}
      image={mediaUrl(product.image)}
      imageMobile={mediaUrl(product.imageMobile)}
      alt={mediaAlt(product.image, product.title)}
      href={href}
      largeTitle={largeTitle}
      description={product.summary}
      tone="product"
      className={cn(wide && "md:col-span-2")}
    />
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
  const productHref = (p: Product) => {
    const category = categories.find((c) => c.id === categoryId(p));
    if (!category?.hasDetailPage) return undefined;
    // The tab chosen in the CMS, else the tab named like the product.
    const tab = category.showcase?.tabs?.find((t) => t.id === p.showcaseTab);
    return `/solution/${category.slug}#${slugify(tab?.name ?? p.title)}`;
  };

  return (
    <>
      <div
        role="tablist"
        className="flex w-full gap-4 overflow-x-auto [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((c) => {
          const active = c.id === activeId;
          return (
            <TabButton
              key={c.id}
              active={active}
              onClick={() => setActiveId(c.id)}
              className="md:w-auto md:min-w-0 md:flex-1"
            >
              {c.title}
            </TabButton>
          );
        })}
      </div>
      {/* Keyed by tab: the cards replay their enter animation on every switch. */}
      <div key={activeId} role="tabpanel" className="tab-panel-in grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} href={productHref(p)} />
        ))}
        {visible.length === 0 && (
          <p className="col-span-full py-16 text-center text-sm text-white/70">{t.solutions.comingSoon}</p>
        )}
      </div>
    </>
  );
}
