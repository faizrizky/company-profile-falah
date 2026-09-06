import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Head } from "@/components/common/section-ui";
import { cn } from "@/lib/utils";
import { A } from "@/components/sections/solution/assets";
import { categories } from "@/lib/category";
import { products } from "@/lib/product";
import type { Product } from "@/types/product";

function Card({ title, img, imgMobile, span, big }: Product) {
  return (
    <div
      className={cn(
        "relative h-[200px] overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.03] md:h-[397px]",
        span && "md:col-span-2",
      )}
    >
      {imgMobile ? (
        <>
          <Image src={imgMobile} alt="" fill className="object-cover md:hidden" />
          <Image src={img} alt="" fill className="hidden object-cover md:block" />
        </>
      ) : (
        <Image src={img} alt="" fill className="object-cover" />
      )}
      <div className="absolute inset-0 bg-surface-dark/50 md:bg-surface-dark/25" />
      <div className="relative flex h-full flex-col items-end justify-between p-5">
        <Button variant="stroke" size="md" ariaLabel={title} className="px-2">
          <ArrowUpRight className="h-4 w-4" />
        </Button>
        <h3
          className={cn(
            "font-display font-bold text-white md:text-right",
            big ? "text-xl leading-5" : "text-base leading-5",
          )}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}

export function OverviewSection() {
  // ponytail: tabs switch active style only — Figma shows one grid state; wire filtering when card data splits per tab
  const [active, setActive] = useState(0);
  return (
    <section className="relative isolate overflow-hidden px-6 pb-12.5 pt-25 lg:px-20">
      <Image src={A.overviewBg} alt="" fill className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          pill="Solution Overview"
          title="Integrated Solutions for Modern Operations"
          desc="Explore operational ecosystems designed to support simulation, training, collaboration, and infrastructure management."
          className="max-w-[564px]"
        />
        <div className="flex w-full gap-4 overflow-x-auto md:justify-center">
          {categories.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={cn(
                "relative flex h-12 w-[243px] shrink-0 items-center justify-center rounded-lg border px-4 text-sm font-bold leading-7 text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.03]",
                active === i
                  ? "border-accent/50 bg-accent/5"
                  : "border-[#3d3d3d]/50 bg-surface-dark/5",
              )}
            >
              {c.title}
              {active === i && (
                <span className="absolute -top-0.5 left-1/2 h-[5px] w-[170px] -translate-x-1/2 rounded-full bg-blue-bright shadow-[0_0_10px_rgba(59,130,246,1)]" />
              )}
            </button>
          ))}
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {products.map((c) => (
            <Card key={c.slug} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
