"use client";

import { useState } from "react";
import Image from "next/image";

import { Glow } from "@/components/common/section-ui";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ProblemItem = {
  key: string;
  icon?: string;
  title: string;
  description?: string | null;
  image?: string;
  alt: string;
};

/**
 * Figma Problem_b / Card Problem_b: hovering an item brightens its glow;
 * clicking opens it — its description slides in, the previously open one
 * closes and the picture on the right cross-fades to the item's image.
 */
export function ProblemTabs({
  items,
  fallbackImage,
  fallbackAlt,
}: {
  items: ProblemItem[];
  fallbackImage?: string;
  fallbackAlt: string;
}) {
  const [active, setActive] = useState(0);
  const images = items.map((p) => ({ src: p.image ?? fallbackImage, alt: p.image ? p.alt : fallbackAlt }));

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:h-[530px] lg:grid-cols-[600px_1fr]">
      <div className="flex flex-col gap-4">
        {items.map((p, i) => {
          const open = i === active;
          const img = images[i];
          return (
            <div key={p.key} className="flex flex-col gap-2 lg:flex-1">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative flex cursor-pointer flex-col justify-center overflow-clip rounded-lg border border-accent/50 p-5 text-left backdrop-blur-[5px] transition-colors duration-300 lg:flex-1 lg:p-7",
                  // Figma Problem_b: Default → Variant3 on hover → Variant2 when open
                  // (mobile Card Problem: 5% blue open, 15% dark closed).
                  open ? "bg-accent/5 lg:bg-accent/15" : "bg-surface-dark/15 hover:bg-accent/5 lg:bg-surface-dark/5",
                )}
              >
                <Glow
                  className={cn(
                    // Figma glow per state: Default 15px / Variant3 27px / Variant2 25px.
                    "z-10 w-[262px] transition-[height,top,background-color] lg:w-[416px]",
                    open
                      ? "-top-[13px] h-[25px] bg-accent/80"
                      : "-top-[8px] h-[15px] group-hover:-top-[14px] group-hover:h-[27px]",
                  )}
                />
                <div className="flex items-center gap-3 lg:gap-[31px]">
                  {/* Figma icons carry their own glow, drawn around a 28px glyph. */}
                  {p.icon && <img src={p.icon} alt="" className="-m-1 h-[37px] w-9 shrink-0 object-contain" />}
                  <div className="flex flex-col">
                    <h3 className="font-display text-base font-bold leading-[18px] text-white lg:text-xl lg:leading-6">
                      {p.title}
                    </h3>
                  </div>
                </div>
                {/* Mobile: full width under the icon row; desktop: under the title. */}
                {p.description && (
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:pl-[67px]",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <p className="min-h-0 overflow-hidden pt-2 text-xs leading-5 text-white lg:pt-2.5 lg:text-base lg:font-medium">
                      {p.description}
                    </p>
                  </div>
                )}
              </button>
              {/* Mobile (Figma): the open item's picture sits right under it. */}
              {open && img.src && (
                <div className="relative h-[150px] overflow-hidden rounded-lg border border-accent/50 lg:hidden">
                  <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-cover" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Card surface="none" className="hidden h-full lg:block">
        {/* Every item's picture is stacked; the active one fades in. */}
        {images.map(
          (img, i) =>
            img.src && (
              <Image
                key={items[i].key}
                src={img.src}
                alt={img.alt}
                fill
                className={cn(
                  "object-cover transition-opacity duration-500",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ),
        )}
      </Card>
    </div>
  );
}
