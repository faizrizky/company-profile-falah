import { Reveal } from "@/components/ui/reveal";
import { HeroSection } from "@/components/sections/solution/vts/HeroSection";
import { ChallengesSection } from "@/components/sections/solution/vts/ChallengesSection";
import { ShowcaseSection } from "@/components/sections/solution/vts/ShowcaseSection";
import { CtaSection } from "@/components/sections/solution/vts/CtaSection";

const CATEGORY_SLUG = "virtual-training-suite";

export default function VirtualTrainingSuiteDetail() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-dark">
      <Reveal>
        <HeroSection categorySlug={CATEGORY_SLUG} />
      </Reveal>
      <Reveal>
        <ChallengesSection categorySlug={CATEGORY_SLUG} />
      </Reveal>
      <Reveal>
        <ShowcaseSection categorySlug={CATEGORY_SLUG} />
      </Reveal>
      <Reveal>
        <CtaSection />
      </Reveal>
    </div>
  );
}
