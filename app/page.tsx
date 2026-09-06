import { Reveal } from "@/components/ui/reveal";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { ProblemSection } from "@/components/sections/home/ProblemSection";
import { DemoSection } from "@/components/sections/home/DemoSection";
import { SolutionSection } from "@/components/sections/home/SolutionSection";
import { ExpertsSection } from "@/components/sections/home/ExpertsSection";
import { CertSection } from "@/components/sections/home/CertSection";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { CtaSection } from "@/components/sections/home/CtaSection";

export default function Home() {
  return (
    <>
      <Reveal>
        <HeroSection />
      </Reveal>
      <Reveal>
        <ProblemSection />
      </Reveal>
      <Reveal>
        <DemoSection />
      </Reveal>
      <Reveal>
        <SolutionSection />
      </Reveal>
      <Reveal>
        <ExpertsSection />
      </Reveal>
      <Reveal>
        <CertSection />
      </Reveal>
      <Reveal>
        <FaqSection />
      </Reveal>
      <Reveal>
        <CtaSection />
      </Reveal>
    </>
  );
}
