import Image from "next/image";
import { A, Head, OFFICE_ADDRESS } from "@/components/sections/contact/shared";

export function MapSection() {
  return (
    <section className="relative isolate flex flex-col items-center gap-8 overflow-hidden bg-[#0A0A0A] pt-[50px] md:bg-transparent md:p-[50px_80px]">
      <Image src={A.ctaBg} alt="" fill className="-z-30 hidden object-cover md:block" />
      <div className="absolute inset-0 -z-20 hidden bg-[linear-gradient(180deg,rgba(5,4,13,1)_0%,rgba(5,4,13,0.97)_0%,rgba(5,4,13,0)_32%)] md:block" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(0deg,rgba(5,4,13,1)_0%,rgba(5,4,13,0)_40%)] md:block" />
      <Head
        pill="Office & Operational Presence"
        title="Built From a Collaborative Technology Environment"
        desc="Falah operates from a collaborative operational-tech environment designed to support innovation & strategic technology initiatives."
      />
      <div className="relative h-[177px] w-full overflow-hidden md:h-[480px] md:w-[853px] md:rounded-lg md:border md:border-accent md:shadow-[0_0_4px_2px_rgba(147,197,253,1)]">
        <iframe
          title="Peta lokasi kantor Falah"
          src={`https://www.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS)}&z=16&output=embed`}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute left-[336px] top-[21px] hidden flex-col items-center backdrop-blur-[2.5px] md:flex">
          <div className="flex items-center rounded-lg bg-[#0F0F14]/50 p-3">
            <span className="w-[258px] text-xs font-medium leading-4 text-white">{OFFICE_ADDRESS}</span>
          </div>
          <img src={A.iconAddressArrow} alt="" className="h-[10px] w-[20px]" />
        </div>
      </div>
    </section>
  );
}
