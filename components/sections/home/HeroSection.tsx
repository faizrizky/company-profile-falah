import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { A, PartnerMarquee } from "@/components/sections/home/shared";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src={A.hero} alt="" fill priority className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,4,13,0)_51%,rgba(5,4,13,1)_100%)]" />
      <div className="relative px-6 pt-40 lg:px-20">
        <div className="flex min-h-[451px] flex-col items-start justify-center gap-8">
          <h1 className="max-w-[735px] font-display text-[32px] font-bold leading-[1.25] text-white md:text-[48px] md:leading-[60px]">
            Train Smarter with Immersive Simulation Technology
          </h1>
          <p className="max-w-[684px] text-base leading-6 text-white">
            Immersive simulation systems designed to improve training
            effectiveness, workforce readiness, and operational performance.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" variant="fill" size="lg">
              Request Consultation <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/solution" variant="stroke" size="lg">
              Explore Our Solutions
            </Button>
          </div>
        </div>
      </div>
      <PartnerMarquee className="mt-[74px]" />
      <div className="mt-[92px] flex justify-center">
        <img src={A.swipe} alt="" className="h-[58px] w-[58px] opacity-70" />
      </div>
    </section>
  );
}
