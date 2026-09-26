import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/common/section-ui";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/cms/media";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SolutionCategory } from "@/types/cms";

export function CtaSection({ category, t }: { category: SolutionCategory; t: Dictionary }) {
  const cta = category.cta ?? {};
  if (!cta.title) return null;
  const background = mediaUrl(cta.background);

  return (
    <section className="relative w-full overflow-hidden px-6 py-12.5 md:px-20">
      {background && <Image src={background} alt="" fill className="object-cover" sizes="100vw" />}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-dark to-surface-dark/0 to-50%" />
      <div className="relative z-10 mx-auto flex w-full max-w-[800px] flex-col items-center gap-8">
        <SectionHeader eyebrow={cta.eyebrow} title={cta.title} desc={cta.description} />
        <Button href={cta.buttonHref || "/contact"} variant="fill" size="lg">
          {cta.buttonLabel || t.solutions.requestConsultation}
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
}
