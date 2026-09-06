"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pill } from "@/components/sections/solution/vts/pill";
import { getCategoryDetailBySlug } from "@/lib/category";

export function ShowcaseSection({ categorySlug }: { categorySlug: string }) {
  const [activeTab, setActiveTab] = useState(0);
  const detail = getCategoryDetailBySlug(categorySlug);
  if (!detail) return null;
  const tabs = detail.tabs;
  const tab = tabs[activeTab];
  return (
    <section className="w-full bg-surface-dark">
      <div className="mx-auto w-full max-w-[1279px] px-6 pt-12 md:px-20">
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-nowrap md:gap-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {tabs.map((t, i) => {
            const active = i === activeTab;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`relative flex h-[52px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg border px-5 text-sm font-bold transition-all duration-300 hover:scale-[1.03] md:flex-1 md:px-2 ${
                  active
                    ? "border-text-accent/50 bg-text-accent/5 text-white backdrop-blur-[5px]"
                    : "border-[#3d3d3d]/50 bg-surface-dark/5 text-white/80 backdrop-blur-[5px] hover:border-text-accent/30"
                }`}
              >
                {active && (
                  <span className="absolute left-1/2 top-0 h-0.5 w-24 -translate-x-1/2 rounded-full bg-text-accent/70 shadow-[0_0_12px_2px_rgba(24,102,239,0.6)]" />
                )}
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-8 min-h-[560px] w-full overflow-hidden md:mt-0 md:min-h-[810px]">
        <Image
          src="/solution/virtual-training-suite/video-bg.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-surface-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/80 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 md:hidden">
          <button
            type="button"
            aria-label="Play video"
            className="flex h-16 w-16 items-center justify-center rounded-full border border-text-accent/40 bg-text-accent/20 backdrop-blur-md transition-transform duration-300 hover:scale-105"
          >
            <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
          </button>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-[1440px] flex-col items-start justify-end gap-4 px-6 pb-10 pt-28 md:min-h-[810px] md:px-20 md:pb-12">
          <span className={pill}>Virtual Training Suite</span>
          <h2 className="font-display text-[28px] font-bold leading-tight text-text-accent md:text-[30px]">
            {tab.name}
          </h2>
          <p className="max-w-[560px] text-[15px] leading-relaxed text-white md:text-base">
            {tab.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {tab.pills.map((p) => (
              <span key={p} className={pill}>
                {p}
              </span>
            ))}
          </div>
          <Button href="/contact" variant="fill" size="lg" className="mt-4">
            <Download className="h-5 w-5" />
            Download Brochure
          </Button>
        </div>
      </div>
    </section>
  );
}
