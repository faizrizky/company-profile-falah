import Image from "next/image";
import { Glow } from "@/components/common/section-ui";
import {
  A,
  EXPERTS,
  STATS,
  Section,
  SectionHeader,
} from "@/components/sections/home/shared";

export function ExpertsSection() {
  return (
    <Section bg={A.expertsBg}>
      <SectionHeader
        eyebrow="Built on Experience & Operational Trust"
        title="Trusted Expertise for Critical Training & Operations"
        desc="Falah combines certified standards, industry expertise, & strategic experience to deliver reliable solutions for complex environments."
      />

      {/* Stats */}
      <div className="relative w-full">
        <Glow className="-top-3 left-0 h-[25px] w-full" />

        <div className="grid min-h-[100px] w-full grid-cols-2 items-center rounded-lg border border-accent/50 bg-surface-dark/20 px-6 py-5 backdrop-blur-sm md:grid-cols-4 md:px-10">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center gap-2 text-center"
            >
              <span className="font-display text-3xl font-bold leading-none text-accent">
                {s.value}
              </span>

              <span className="text-sm font-semibold leading-5 text-white">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Cards */}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {EXPERTS.map((e) => (
          <div
            key={e.title}
            className="relative overflow-hidden rounded-lg border border-accent/50 bg-surface-dark/20 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03]"
          >
            {/* Image */}
            <div className="relative h-[160px]">
              {/* Image wrapper */}
              <div className="absolute inset-0 overflow-hidden">
                <Image src={e.img} alt="" fill className="object-cover" />

                <div className="absolute inset-0 bg-surface-dark/20" />
              </div>

              {/* Logo - DI DEPAN IMAGE */}
              <div className="absolute bottom-[-28px] left-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-blue-bright p-3 shadow-[0_0_12px_rgba(37,99,235,0.6)]">
                <img src={e.icon} alt="" className="h-8 w-8" />
              </div>
            </div>

            {/* Content */}
            <div className="relative min-h-[140px] bg-[linear-gradient(180deg,rgba(15,42,100,0.95)_0%,rgba(5,15,40,0.95)_100%)] px-4 pb-6 pt-7">
              <h3 className="font-display text-base font-bold leading-6 text-accent">
                {e.title}
              </h3>

              <p className="mt-5 text-sm leading-5 text-white">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
