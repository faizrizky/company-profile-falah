import Image from "next/image";
import { Glow, Head } from "@/components/common/section-ui";
import { A, EXPERTS } from "@/components/sections/about/data";

export function ExpertsSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 md:px-20">
      <Image src={A.expertsBg} alt="" fill className="-z-20 object-fill" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[682px]"
          pill="Our Experts"
          title={
            <>
              A Multidisciplinary Team Behind
              <br />
              Every Operational Solution
            </>
          }
          desc="Falah combines immersive technologies & integrated systems to deliver scalable solutions for modern operations."
        />
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {EXPERTS.map((expert) => (
            <div key={expert.title} className="relative">
              <Glow className="-top-[14px] left-1/2 h-[25px] w-[356px] -translate-x-1/2" />
              <div className="flex h-full flex-col items-center gap-5 p-10">
                <h3 className="text-center font-display text-lg font-bold leading-6 text-white md:text-2xl md:leading-[30px]">
                  {expert.title}
                </h3>
                <div className="flex h-[34px] flex-col justify-center">
                  <span className="font-display text-[48px] font-bold leading-6 text-[#1866EF]">
                    {expert.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
