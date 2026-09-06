import Image from "next/image";
import { Glow, Head } from "@/components/common/section-ui";
import { A, VM_CARDS } from "@/components/sections/about/data";

export function VisionSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 md:px-20">
      <Image src={A.vmBg1} alt="" fill className="-z-30 object-fill" />
      <Image src={A.vmBg2} alt="" fill className="-z-20 object-fill" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[666px]"
          pill="What Drives Us"
          title="Building Technology with Purpose & Precision"
          desc="Falah combines innovation, expertise, & integrity to deliver immersive technology solutions with long-term impact."
        />
        <div className="relative mx-auto flex w-full flex-col items-stretch justify-center rounded-lg backdrop-blur-[5px]">
          <Glow className="-top-[7px] left-1/2 h-[25px] w-[416px] -translate-x-1/2" />
          <div className="absolute top-0 left-1/2 h-[5px] w-[574px] -translate-x-1/2 bg-[#1866EF] shadow-[0_0_10px_rgba(59,130,246,1)]" />
          <div className="flex h-[110px] items-center justify-center gap-4 rounded-lg px-4 backdrop-blur-[5px]">
            <img src={A.iconQuotes} alt="" className="h-[34px] w-[34px]" />
            <p className="text-center font-display text-base font-bold leading-6 text-white md:text-xl">
              The Best Innovative Technology Company
            </p>
            <img src={A.iconQuotes} alt="" className="h-[34px] w-[34px]" />
          </div>
          <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-4">
            {VM_CARDS.map((card) => (
              <div
                key={card.title}
                className="flex flex-col justify-center gap-4 rounded-lg border border-accent/50 bg-surface-dark/5 p-8 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]"
              >
                <div className="flex h-[52px] items-center justify-center">
                  <img src={card.icon} alt="" className="h-[50px] w-[50px]" />
                </div>
                <div className="flex w-full flex-col text-left">
                  <h3 className="font-display text-lg font-bold leading-6 text-white md:text-xl">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-5 text-white">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
