import Image from "next/image";
import { MoveRight } from "lucide-react";

import { ScrollHint } from "@/components/common/scroll-hint";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { mediaUrl } from "@/lib/cms/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SolutionCategory } from "@/types/cms";

export function HeroSection({ category, t }: { category: SolutionCategory; t: Dictionary }) {
  const hero = category.hero ?? {};
  const cta = category.cta ?? {};
  const image = mediaUrl(hero.image);
  return (
    <section className="relative flex min-h-[640px] w-full flex-col justify-center overflow-hidden md:min-h-[810px]">
      {image && <Image src={image} alt="" fill priority className="object-cover object-top" sizes="100vw" />}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/0 from-50% to-surface-dark" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-start gap-9 px-6 py-32 md:px-20 md:py-40">
        <div className="flex flex-col gap-4">
          <div className="flex max-w-[735px] flex-col">
            <h1 className="font-display text-[36px] font-bold leading-[44px] tracking-[-0.02em] text-[#fafafa] md:text-5xl md:leading-[60px]">
              {hero.title || category.title}
            </h1>
            {hero.description && <p className="text-base leading-6 text-white">{hero.description}</p>}
          </div>
          {hero.recommendedFor?.length ? (
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium leading-[30px] text-white">{t.solutions.recommendedFor}</span>
              {/* Figma: chips 4px apart. */}
              <div className="flex flex-wrap gap-1">
                {hero.recommendedFor.map((r) => (
                  <Pill key={r} tone="tag" size="xs">
                    {r}
                  </Pill>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <Button href={cta.buttonHref || "/contact"} variant="fill" size="lg">
          {cta.buttonLabel || t.solutions.requestConsultation}
          <MoveRight className="h-6 w-6" strokeWidth={1.5} />
        </Button>
      </div>
      <ScrollHint className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-70" />
    </section>
  );
}
