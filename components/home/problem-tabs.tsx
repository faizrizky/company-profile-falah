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
          return (
            <button
              key={p.key}
              type="button"
              aria-expanded={open}
              onClick={() => setActive(i)}
              className={cn(
                "group relative flex cursor-pointer flex-col justify-center overflow-clip rounded-lg border border-accent/50 p-7 text-left backdrop-blur-[5px] transition-colors duration-300 lg:flex-1",
                // Figma Problem_b: Default → Variant3 on hover → Variant2 when open.
                open ? "bg-accent/15" : "bg-surface-dark/5 hover:bg-accent/5",
              )}
            >
              <Glow
                className={cn(
                  // Figma glow per state: Default 15px / Variant3 27px / Variant2 25px.
                  "z-10 w-[416px] transition-[height,top,background-color]",
                  open
                    ? "-top-[13px] h-[25px] bg-accent/80"
                    : "-top-[8px] h-[15px] group-hover:-top-[14px] group-hover:h-[27px]",
                )}
              />
              <div className="flex items-center gap-[31px]">
                {/* Figma icons carry their own glow, drawn around a 28px glyph. */}
                {p.icon && <img src={p.icon} alt="" className="-m-1 h-[37px] w-9 shrink-0 object-contain" />}
                <div className="flex flex-col">
                  <h3 className="font-display text-xl font-bold leading-6 text-white">{p.title}</h3>
                  {p.description && (
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <p className="min-h-0 overflow-hidden pt-2.5 text-base font-medium leading-5 text-white">
                        {p.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Card surface="none" className="h-full min-h-[300px] lg:min-h-0">
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
