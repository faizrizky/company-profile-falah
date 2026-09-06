import { Reveal } from "@/components/ui/reveal";
import { Certification } from "@/components/about/certification-section";
import { HeroSection } from "@/components/sections/about/HeroSection";
import { ProblemSection } from "@/components/sections/about/ProblemSection";
import { VisionSection } from "@/components/sections/about/VisionSection";
import { LeadershipSection } from "@/components/sections/about/LeadershipSection";
import { ExpertsSection } from "@/components/sections/about/ExpertsSection";
import { TrustSection } from "@/components/sections/about/TrustSection";
import { CtaSection } from "@/components/sections/about/CtaSection";

export default function AboutPage() {
  return (
    <>
      <Reveal>
        <HeroSection />
      </Reveal>
      <Reveal>
        <ProblemSection />
      </Reveal>
      <Reveal>
        <VisionSection />
      </Reveal>
      <Reveal>
        <LeadershipSection />
      </Reveal>
      <Reveal>
        <ExpertsSection />
      </Reveal>
      <Reveal>
        <TrustSection />
      </Reveal>
      <Reveal>
        <Certification />
      </Reveal>
      <Reveal>
        <CtaSection />
      </Reveal>
    </>
  );
}
