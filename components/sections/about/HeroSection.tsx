import Image from "next/image";
import { CertificateButton } from "@/components/about/certificate-button";
import { A } from "@/components/sections/about/data";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[570px] flex-col overflow-hidden md:min-h-[810px]">
      <Image src={A.hero} alt="" fill priority className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,4,13,0)_51%,rgba(5,4,13,1)_100%)]" />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-9 px-6 py-12.5 md:px-20 md:py-40">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-base font-medium leading-6 text-white backdrop-blur-[5px]">
            The Experts Behind The Technology
          </span>
          <div className="flex flex-col items-center">
            <h1 className="max-w-[768px] font-display text-[32px] font-bold leading-[1.25] text-white md:text-[48px] md:leading-[60px]">
              Building Technology for Training, Operations, &amp; Readiness
            </h1>
            <p className="max-w-[735px] text-sm leading-5 text-white md:text-base md:leading-6">
              Falah develops simulation systems &amp; immersive technologies
              that improve operational coordination, &amp; learning
              effectiveness.
            </p>
          </div>
          <CertificateButton icon={A.iconCertificate} />
        </div>
      </div>
      <img src={A.swipe} alt="" className="absolute bottom-0 left-1/2 h-[58px] w-[58px] -translate-x-1/2 opacity-70" />
    </section>
  );
}
