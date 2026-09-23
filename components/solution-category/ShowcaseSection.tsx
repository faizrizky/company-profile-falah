"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Play } from "lucide-react";

import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/cms/media";
import type { SolutionCategory } from "@/types/cms";

import { pill } from "./pill";

export function ShowcaseSection({ category }: { category: SolutionCategory }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState(0);
  const showcase = category.showcase ?? {};
  const tabs = showcase.tabs ?? [];
  const tab = tabs[activeTab];
  if (!tab) return null;

  const background = mediaUrl(showcase.background);
  const brochure = mediaUrl(showcase.brochure);

  return (
    <section className="w-full bg-surface-dark">
      <div className="mx-auto w-full max-w-[1279px] px-6 pt-12 md:px-20">
        <div
          role="tablist"
          className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-nowrap md:gap-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((t, i) => {
            const active = i === activeTab;
            return (
              <button
                key={t.id ?? t.name}
                type="button"
                role="tab"
                aria-selected={active}
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

      <div role="tabpanel" className="relative mt-8 min-h-[560px] w-full overflow-hidden md:mt-0 md:min-h-[810px]">
        {background && <Image src={background} alt="" fill className="object-cover" sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-surface-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/80 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 md:hidden">
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full border border-text-accent/40 bg-text-accent/20 backdrop-blur-md"
          >
            <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
          </span>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-[1440px] flex-col items-start justify-end gap-4 px-6 pb-10 pt-28 md:min-h-[810px] md:px-20 md:pb-12">
          <span className={pill}>{category.title}</span>
          <h2 className="font-display text-[28px] font-bold leading-tight text-text-accent md:text-[30px]">{tab.name}</h2>
          {tab.description && (
            <p className="max-w-[560px] text-[15px] leading-relaxed text-white md:text-base">{tab.description}</p>
          )}
          {tab.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {tab.tags.map((p) => (
                <span key={p} className={pill}>
                  {p}
                </span>
              ))}
            </div>
          ) : null}
          <Button href={brochure ?? "/contact"} external={Boolean(brochure)} variant="fill" size="lg" className="mt-4">
            <Download className="h-5 w-5" />
            {t.solutions.downloadBrochure}
          </Button>
        </div>
      </div>
    </section>
  );
}
