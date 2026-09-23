import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/cms/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SolutionCategory } from "@/types/cms";

import { pill } from "./pill";

export function CtaSection({ category, t }: { category: SolutionCategory; t: Dictionary }) {
  const cta = category.cta ?? {};
  if (!cta.title) return null;
  const background = mediaUrl(cta.background);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        {background && <Image src={background} alt="" fill className="object-cover" sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/70 to-surface-dark/90" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[800px] flex-col items-center gap-8 px-6 py-24 text-center md:py-28">
        {cta.eyebrow && <span className={pill}>{cta.eyebrow}</span>}
        <h2 className="font-display text-[28px] font-bold leading-tight text-text-accent md:text-[30px]">{cta.title}</h2>
        {cta.description && (
          <p className="max-w-[640px] text-[15px] leading-relaxed text-white md:text-base">{cta.description}</p>
        )}
        <Button href={cta.buttonHref || "/contact"} variant="fill" size="lg">
          {cta.buttonLabel || t.solutions.requestConsultation}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
