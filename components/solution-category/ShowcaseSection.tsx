"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";

import { SoundVideo } from "@/components/common/sound-video";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { TabButton } from "@/components/ui/tab-button";
import { mediaType, mediaUrl } from "@/lib/cms/media";
import { useIsMobile } from "@/lib/use-media";
import { slugify } from "@/lib/utils";
import type { SolutionCategory } from "@/types/cms";

export function ShowcaseSection({ category }: { category: SolutionCategory }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState(0);
  // Only one video element is mounted, for the current screen size.
  const isMobile = useIsMobile();
  const showcase = category.showcase ?? {};
  const tabs = useMemo(() => category.showcase?.tabs ?? [], [category.showcase?.tabs]);
  const tab = tabs[activeTab];
  const sectionRef = useRef<HTMLElement>(null);

  // Arriving from a product card (/solution/<category>#<product>): open that
  // product's tab and bring the showcase into view.
  useEffect(() => {
    const open = () => {
      const target = decodeURIComponent(window.location.hash.slice(1));
      if (!target) return;
      const index = tabs.findIndex((t) => slugify(t.name) === target);
      if (index === -1) return;
      setActiveTab(index);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [tabs]);
  if (!tab) return null;

  const background = mediaUrl(showcase.background);
  // A tab's own clip wins over the shared background video.
  const videoField = tab.video ?? showcase.backgroundVideo;
  const video = mediaUrl(videoField);
  const videoMobile = tab.video ? tab.videoMobile : undefined;
  const brochure = mediaUrl(showcase.brochure);
  const mobileVideo = mediaUrl(videoMobile);
  const brochureButton = (className?: string) => (
    <Button href={brochure ?? "/contact"} external={Boolean(brochure)} variant="fill" size="lg" className={className}>
      <Download className="h-6 w-6" />
      {t.solutions.downloadBrochure}
    </Button>
  );

  return (
    <section ref={sectionRef} className="w-full scroll-mt-16 bg-surface-dark">
      <div className="px-6 pb-8 pt-12.5 md:px-20 md:pb-12.5">
        <div
          role="tablist"
          className="mx-auto flex w-full max-w-[1279px] gap-4 overflow-x-auto pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((t, i) => {
            const active = i === activeTab;
            return (
              <TabButton key={t.id ?? t.name} active={active} onClick={() => setActiveTab(i)}>
                {t.name}
              </TabButton>
            );
          })}
        </div>
      </div>

      {/* Phones (Figma mobile): text and button first, then the video with a play button. */}
      <div role="tabpanel" className="md:hidden">
        <div key={activeTab} className="tab-panel-in flex flex-col gap-8 px-6">
          <div className="flex flex-col items-start gap-3">
            <Pill size="xs">{category.title}</Pill>
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-xl font-bold leading-6 text-accent">{tab.name}</h2>
              {tab.description && <p className="text-sm leading-5 text-white">{tab.description}</p>}
            </div>
          </div>
          {brochureButton("w-full")}
        </div>
        <div className="relative mt-8 h-[400px] w-full overflow-hidden">
          {background && <Image src={background} alt="" fill className="object-cover" sizes="100vw" />}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-surface-dark via-transparent to-transparent" />
          {isMobile && video && (
            <SoundVideo
              src={mobileVideo ?? video}
              type={mobileVideo ? mediaType(videoMobile) : mediaType(videoField)}
              poster={background}
              playLabel={t.video.play}
              soundOnLabel={t.video.soundOn}
              soundOffLabel={t.video.soundOff}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <div role="tabpanel" className="relative hidden min-h-[810px] w-full overflow-hidden md:block">
        {background && <Image src={background} alt="" fill className="object-cover" sizes="100vw" />}
        {isMobile === false && video && (
          <SoundVideo
            src={video}
            type={mediaType(videoField)}
            poster={background}
            autoPlay
            playLabel={t.video.play}
            soundOnLabel={t.video.soundOn}
            soundOffLabel={t.video.soundOff}
            className="absolute inset-0 h-full w-full animate-fade-in object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-transparent to-transparent" />
        {/* Keyed by tab: the text replays its enter animation on every switch. */}
        <div
          key={activeTab}
          className="tab-panel-in pointer-events-none relative z-10 mx-auto flex min-h-[810px] w-full max-w-[1440px] flex-col items-start justify-end gap-6 px-20 py-12.5"
        >
          <div className="flex max-w-[682px] flex-col items-start gap-4">
            <div className="flex flex-col items-start gap-3">
              <Pill size="md" className="font-normal leading-[30px]">
                {category.title}
              </Pill>
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-[30px] font-bold leading-9 text-accent">{tab.name}</h2>
                {tab.description && <p className="text-base leading-6 text-white">{tab.description}</p>}
              </div>
            </div>
            {tab.tags?.length ? (
              <div className="flex flex-wrap gap-1">
                {tab.tags.map((p) => (
                  <Pill key={p} tone="tag" size="xs">
                    {p}
                  </Pill>
                ))}
              </div>
            ) : null}
          </div>
          <div className="pointer-events-auto">{brochureButton()}</div>
        </div>
      </div>
    </section>
  );
}
