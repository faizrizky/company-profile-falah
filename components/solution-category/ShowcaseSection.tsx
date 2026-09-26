"use client";

import { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";

import { BackgroundVideo } from "@/components/common/background-video";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { mediaType, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
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
  // A tab's own clip wins over the shared background video.
  const videoField = tab.video ?? showcase.backgroundVideo;
  const video = mediaUrl(videoField);
  const videoMobile = tab.video ? tab.videoMobile : undefined;
  const brochure = mediaUrl(showcase.brochure);

  return (
    <section className="w-full bg-surface-dark">
      <div className="px-6 py-12.5 md:px-20">
        <div
          role="tablist"
          className="mx-auto flex w-full max-w-[1279px] gap-4 overflow-x-auto pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={cn(
                  "relative flex h-12 w-[243px] shrink-0 items-center justify-center rounded-lg border p-4 text-center text-sm font-bold leading-4 text-white backdrop-blur-[5px] transition-colors duration-300",
                  active ? "border-accent/50 bg-accent/5" : "border-[#3d3d3d]/50 bg-surface-dark/5 hover:border-accent/30",
                )}
              >
                {active && (
                  // Figma: a thin ellipse (pointed ends), not a pill, with a soft glow.
                  <span className="absolute left-1/2 top-[-3px] h-[5px] w-[170px] -translate-x-1/2 rounded-[50%] bg-blue-bright shadow-[0_0_10px_#3b82f6]" />
                )}
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" className="relative min-h-[560px] w-full overflow-hidden md:min-h-[810px]">
        {background && <Image src={background} alt="" fill className="object-cover" sizes="100vw" />}
        {video && (
          <BackgroundVideo
            src={video}
            type={mediaType(videoField)}
            mobileSrc={mediaUrl(videoMobile)}
            mobileType={mediaType(videoMobile)}
            poster={background}
            className="absolute inset-0 h-full w-full animate-fade-in object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-transparent to-transparent" />
        {/* Keyed by tab: the text replays its enter animation on every switch. */}
        <div
          key={activeTab}
          className="tab-panel-in relative z-10 mx-auto flex min-h-[560px] w-full max-w-[1440px] flex-col items-start justify-end gap-6 px-6 py-12.5 md:min-h-[810px] md:px-20"
        >
          <div className="flex max-w-[682px] flex-col items-start gap-4">
            <div className="flex flex-col items-start gap-3">
              <span className="rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-base leading-[30px] text-white backdrop-blur-[5px]">
                {category.title}
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-[30px] font-bold leading-9 text-accent">{tab.name}</h2>
                {tab.description && <p className="text-base leading-6 text-white">{tab.description}</p>}
              </div>
            </div>
            {tab.tags?.length ? (
              <div className="flex flex-wrap gap-1">
                {tab.tags.map((p) => (
                  <span key={p} className={pill}>
                    {p}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <Button href={brochure ?? "/contact"} external={Boolean(brochure)} variant="fill" size="lg">
            <Download className="h-6 w-6" />
            {t.solutions.downloadBrochure}
          </Button>
        </div>
      </div>
    </section>
  );
}
