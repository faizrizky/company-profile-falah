import { CertificateButton } from "@/components/about/certificate-button";
import { PartnerMarquee } from "@/components/common/partner-marquee";
import { ScrollHint } from "@/components/common/scroll-hint";
import { ResponsiveBackground } from "@/components/common/section-ui";
import { CmsButtons } from "@/components/ui/cms-buttons";
import { Pill } from "@/components/ui/pill";
import { mediaUrl } from "@/lib/cms/media";
import type { HeroBlock as HeroBlockData } from "@/types/cms";

import type { BlockContext, BlockProps } from "./types";

function Background({ block }: { block: HeroBlockData }) {
  return (
    <>
      <ResponsiveBackground src={mediaUrl(block.background)} mobileSrc={mediaUrl(block.backgroundMobile)} priority />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,4,13,0)_51%,rgba(5,4,13,1)_100%)]" />
    </>
  );
}

function HomeHero({ block, ctx }: { block: HeroBlockData; ctx: BlockContext }) {
  const partners = block.showPartners ? ctx.data.partners.filter((p) => p.showInHero) : [];
  return (
    <section className="relative isolate overflow-hidden">
      <Background block={block} />
      <div className="relative px-6 pt-40 lg:px-20">
        <div className="flex min-h-[451px] flex-col items-start justify-center gap-8">
          <h1 className="max-w-[735px] font-display text-[32px] font-bold leading-[1.25] text-white md:text-[48px] md:leading-[60px]">
            {block.title}
          </h1>
          {block.description && <p className="max-w-[684px] text-base leading-6 text-white">{block.description}</p>}
          <CmsButtons buttons={block.buttons} />
        </div>
      </div>
      <PartnerMarquee partners={partners} className="mt-[74px]" />
      {block.showScrollHint && (
        <div className="mt-[92px] flex justify-center">
          <ScrollHint className="opacity-70" />
        </div>
      )}
    </section>
  );
}

function CenteredHero({ block, ctx }: { block: HeroBlockData; ctx: BlockContext }) {
  const certifications = block.showCertificates ? ctx.data.certifications : [];
  return (
    <section className="relative isolate flex min-h-[570px] flex-col overflow-hidden md:min-h-[810px]">
      <Background block={block} />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-9 px-6 py-12.5 md:px-20 md:py-40">
        <div className="flex flex-col items-center gap-4">
          {block.eyebrow && <Pill size="md">{block.eyebrow}</Pill>}
          <div className="flex flex-col items-center">
            <h1 className="max-w-[768px] font-display text-[32px] font-bold leading-[1.25] text-white md:text-[48px] md:leading-[60px]">
              {block.title}
            </h1>
            {block.description && (
              <p className="max-w-[735px] text-sm leading-5 text-white md:text-base md:leading-6">
                {block.description}
              </p>
            )}
          </div>
          <CmsButtons buttons={block.buttons} />
          {certifications.length > 0 && <CertificateButton certifications={certifications} />}
        </div>
      </div>
      {block.showScrollHint && <ScrollHint className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-70" />}
    </section>
  );
}

function PageHero({ block, ctx }: { block: HeroBlockData; ctx: BlockContext }) {
  const certifications = block.showCertificates ? ctx.data.certifications : [];
  return (
    <section className="relative isolate flex min-h-[570px] flex-col overflow-hidden pb-[25px] md:min-h-0 md:pb-25">
      <Background block={block} />
      <div className="relative flex flex-1 flex-col px-6 pt-[120px] md:px-20 md:pt-40">
        <div className="flex flex-col items-start gap-8 md:gap-9">
          <div className="flex w-full max-w-[768px] flex-col gap-2 md:gap-4">
            {block.eyebrow && (
              <Pill size="xs" className="px-2 md:px-4 md:text-base md:leading-6">
                {block.eyebrow}
              </Pill>
            )}
            <h1 className="font-display text-[20px] font-bold leading-6 text-white md:text-[48px] md:leading-[60px]">
              {block.title}
            </h1>
            {block.description && (
              <p className="text-sm leading-5 text-white md:text-base md:leading-6">{block.description}</p>
            )}
          </div>
          <CmsButtons
            buttons={block.buttons}
            className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap"
            buttonClassName="w-full md:w-fit"
          />
          {certifications.length > 0 && <CertificateButton certifications={certifications} />}
        </div>
        {block.showScrollHint && (
          <div className="mt-auto flex justify-center pt-[92px]">
            <ScrollHint className="opacity-70" />
          </div>
        )}
      </div>
    </section>
  );
}

export function HeroBlock({ block, ctx }: BlockProps<HeroBlockData>) {
  switch (block.variant) {
    case "centered":
      return <CenteredHero block={block} ctx={ctx} />;
    case "page":
      return <PageHero block={block} ctx={ctx} />;
    default:
      return <HomeHero block={block} ctx={ctx} />;
  }
}
