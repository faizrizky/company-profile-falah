import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Glow } from "@/components/common/section-ui";
import {
  A,
  SOLUTION_SMALL,
  Section,
  SectionHeader,
} from "@/components/sections/home/shared";

export function SolutionSection() {
  return (
    <Section bg={A.solutionBg}>
      <SectionHeader
        className="max-w-[574px]"
        eyebrow="Integrated Technologies for Modern Operations"
        title="Integrated Solutions for Modern Training & Operations"
        desc="From immersive simulation to command center, Falah delivers integrated technologies that improve operational performance."
      />
      <div className="grid w-full grid-cols-1 gap-4 md:h-[677px] md:grid-cols-3">
        <div className="relative h-[480px] rounded-lg border border-accent/50 bg-surface-dark/5 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03] md:col-span-2 md:h-full">
          <Glow className="-top-[9px] left-0 h-[25px] w-[416px]" />
          <div className="relative h-full overflow-hidden rounded-lg">
            <Image src={A.solution1} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-accent/25" />
            <div className="relative flex h-full flex-col items-start justify-end gap-4 p-5">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-xl font-bold leading-5 text-white">
                  Virtual Training Suite
                </h3>
                <p className="text-xs leading-4 text-white">
                  Technology-enhanced learning environments for modern
                  educational institutions.
                </p>
              </div>
              <div className="flex flex-col gap-1 self-start">
                <span className="text-xs font-medium leading-4 text-white">
                  Recommended For
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    "VR Training",
                    "Mission Readiness",
                    "Operational Simulation",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white bg-surface-dark/5 px-2 py-1 text-xs leading-4 text-white backdrop-blur-sm"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                href="/solution"
                variant="stroke"
                size="md"
                className="w-fit"
              >
                Explore Our Solutions <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {SOLUTION_SMALL.map((c) => (
          <div
            key={c.title}
            className="relative h-[330px] rounded-lg border border-accent/50 bg-accent/5 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03] md:h-full"
          >
            <Glow className="-top-[9px] left-0 h-[25px] w-[416px]" />
            <div className="relative h-full overflow-hidden rounded-lg">
              <Image src={c.img} alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative flex h-full flex-col items-end justify-between p-5">
                <Button
                  href="/solution"
                  variant="stroke"
                  size="md"
                  ariaLabel={c.title}
                  className="w-10 px-0"
                >
                  <ArrowUpRight className="h-6 w-6" />
                </Button>
                <h3 className="text-xl font-bold leading-[30px] text-white">
                  {c.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
