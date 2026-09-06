import Image from "next/image";
import { A, Section, SectionHeader } from "@/components/sections/home/shared";

export function DemoSection() {
  return (
    <Section bg={A.demoBg} className="py-25">
      <SectionHeader
        eyebrow="See Immersive Training in Action"
        title="Immersive Simulation Systems Built for Safer & Smarter Training"
        desc="Falah delivers realistic simulation that improve competency, reduce operational risk, and strengthen workforce readiness."
      />
      <div className="w-full max-w-[942px] rounded-2xl border border-accent p-10 shadow-[0_0_10px_rgba(147,197,253,1)]">
        <div className="relative aspect-video overflow-hidden">
          <Image src={A.demo} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,13,0)_50%,rgba(5,4,13,1)_100%)]" />
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-1 p-10">
            <h3 className="font-display text-xl font-bold leading-6 text-white">
              Operational Training
            </h3>
            <p className="text-sm leading-5 text-white">
              Advanced fixed-wing simulators for pilot readiness and mission
              training.
            </p>
          </div>
          <img
            src={A.play}
            alt="Play"
            className="absolute left-1/2 top-1/2 h-[119px] w-[119px] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </Section>
  );
}
