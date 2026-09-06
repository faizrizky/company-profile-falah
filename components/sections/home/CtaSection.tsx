import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { A, SectionHeader } from "@/components/sections/home/shared";

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 lg:px-20">
      <Image src={A.ctaBg} alt="" fill className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/10" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">
        <div className="flex w-full max-w-[800px] flex-col items-center gap-8">
          <SectionHeader
            eyebrow="Let’s Build Future-Ready Operations"
            title="Ready to Build Smarter Training & Operations?"
            desc="Partner with Falah Inovasi Teknologi to develop immersive training systems, operational technologies, and digital solutions."
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" variant="fill" size="lg">
              Request Consultation <ArrowUpRight className="h-6 w-6" />
            </Button>
            <Button href="/solution" variant="stroke" size="lg">
              Explore Our Solutions
            </Button>
          </div>
        </div>
        <div className="w-full max-w-[862px] rounded-2xl border border-accent p-10 shadow-[0_0_10px_rgba(147,197,253,1)]">
          <div className="relative aspect-video overflow-hidden">
            <Image src={A.ctaVideo} alt="" fill className="object-cover" />
            <img
              src={A.play}
              alt="Play"
              className="absolute left-1/2 top-1/2 h-[119px] w-[119px] -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
