"use client";

import { Reveal } from "@/components/ui/reveal";
import { HeroSection } from "@/components/sections/solution/HeroSection";
import { OverviewSection } from "@/components/sections/solution/OverviewSection";
import { CtaSection } from "@/components/sections/solution/CtaSection";

export default function Solution() {
  return (
    <>
      <Reveal>
        <HeroSection />
      </Reveal>
      <Reveal>
        <OverviewSection />
      </Reveal>
      <Reveal>
        <CtaSection />
      </Reveal>
    </>
  );
}
