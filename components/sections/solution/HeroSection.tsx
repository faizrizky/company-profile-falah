import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { A } from "@/components/sections/solution/assets";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[570px] flex-col overflow-hidden pb-[25px] md:min-h-0 md:pb-25">
      <Image
        src={A.heroMobile}
        alt=""
        fill
        priority
        className="-z-20 object-cover md:hidden"
      />
      <Image
        src={A.hero}
        alt=""
        fill
        priority
        className="-z-20 hidden object-cover md:block"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,4,13,0)_51%,rgba(5,4,13,1)_100%)]" />
      <div className="relative flex flex-1 flex-col px-6 pt-[50px] md:px-20 md:pt-40">
        <div className="flex flex-col items-start gap-8 md:gap-9">
          <div className="flex w-full max-w-[735px] flex-col gap-2 md:gap-4">
            <span className="flex w-fit items-center rounded-full border border-white bg-surface-dark/5 px-2 py-1 text-xs leading-[18px] text-white backdrop-blur-sm md:px-4 md:text-base md:leading-6">
              Our Solutions
            </span>
            <h1 className="font-display text-[20px] font-bold leading-6 text-white md:text-[48px] md:leading-[60px]">
              Integrated Technologies Built for Operational Excellence
            </h1>
            <p className="text-sm leading-5 text-white md:text-base md:leading-6">
              From immersive simulation to command center, Falah delivers
              integrated technologies that improve operational performance.
            </p>
          </div>
          <Button href="/contact" variant="fill" size="lg" className="w-full md:w-fit">
            Request Consultation <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-auto flex justify-center pt-[92px]">
          <img src={A.swipe} alt="" className="h-[58px] w-[58px] opacity-70" />
        </div>
      </div>
    </section>
  );
}
