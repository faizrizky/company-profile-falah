import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/cms/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SolutionCategory } from "@/types/cms";

import { pill } from "./pill";

export function HeroSection({ category, t }: { category: SolutionCategory; t: Dictionary }) {
  const hero = category.hero ?? {};
  const cta = category.cta ?? {};
  const image = mediaUrl(hero.image);
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        {image && <Image src={image} alt="" fill priority className="object-cover" sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/70 to-surface-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[75vh] w-full max-w-[1440px] flex-col items-start justify-center gap-6 px-6 py-24 md:px-20">
        <h1 className="max-w-[900px] font-display text-4xl font-bold leading-tight text-white md:text-5xl">
          {hero.title || category.title}
        </h1>
        {hero.description && (
          <p className="max-w-[620px] text-base leading-relaxed text-white/90">{hero.description}</p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          {hero.recommendedFor?.length ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-white/80">{t.solutions.recommendedFor}</span>
              {hero.recommendedFor.map((r) => (
                <span key={r} className={pill}>
                  {r}
                </span>
              ))}
            </div>
          ) : null}
          <Button href={cta.buttonHref || "/contact"} variant="fill" size="lg">
            {cta.buttonLabel || t.solutions.requestConsultation}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
