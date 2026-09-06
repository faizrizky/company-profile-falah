import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  A,
  Fields,
  WhatsAppButton,
  WHATSAPP_TEXT,
} from "@/components/sections/contact/shared";

export function FormSection() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-dark md:flex md:items-center md:gap-8 md:px-20 md:py-[100px]">
      <Image src={A.heroBg} alt="" fill className="-z-20 hidden object-cover md:block" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(180deg,rgba(5,4,13,0)_51%,rgba(5,4,13,1)_100%)] md:block" />

      <div className="flex flex-col gap-8 bg-[#0A0A0A]/50 pt-[50px] md:hidden">
        <div className="flex flex-col gap-2 px-6">
          <span className="inline-flex w-fit items-center rounded-full border border-white bg-surface-dark/5 px-2 py-1 text-xs leading-[18px] text-white backdrop-blur-[5px]">
            Contact Us
          </span>
          <h1 className="font-display text-[20px] font-bold leading-6 text-white">
            Let’s Discuss Your Training Needs
          </h1>
          <p className="text-sm leading-5 text-white">
            Share your project requirements, operational challenges, or technology initiatives
            with the Falah team.
          </p>
          <p className="text-sm leading-5 text-white">Response within 1–2 business days.</p>
        </div>
        <Fields />
        <div className="flex flex-col gap-8 px-6">
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full">
              Request Consultation
              <img src={A.iconArrow} alt="" className="h-6 w-6" />
            </Button>
            <p className="w-full text-center text-xs leading-6 text-white">
              Response within 1–2 business days.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-surface-dark/50 p-4">
            <p className="whitespace-pre-line text-sm leading-6 text-white">{WHATSAPP_TEXT}</p>
            <WhatsAppButton />
          </div>
        </div>
      </div>

      <div className="hidden w-[574px] shrink-0 flex-col md:flex">
        <span className="inline-flex w-fit items-center rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-base font-medium leading-6 text-white backdrop-blur-[5px]">
          Contact Us
        </span>
        <div className="flex flex-col">
          <h1 className="font-display text-5xl font-bold leading-[60px] text-white">
            Let’s Build Future-Ready Operations Together
          </h1>
          <p className="text-base leading-6 text-white">
            Discuss your operational challenges, training initiatives, or technology needs with
            the Falah team.
          </p>
        </div>
      </div>

      <div className="relative hidden flex-1 flex-col gap-5 overflow-hidden rounded-lg border border-accent/50 bg-surface-dark/5 p-8 backdrop-blur-[5px] md:flex">
        <div className="absolute -top-0.5 left-0 h-[15px] w-full bg-accent blur-[50px]" />
        <Fields />
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full">
            Request Consultation
            <img src={A.iconArrow} alt="" className="h-6 w-6" />
          </Button>
          <p className="w-[620px] text-xs leading-6 text-white">Response within 1–2 business days.</p>
          <div className="flex h-5 items-center gap-2">
            <span className="h-px flex-1 bg-accent" />
            <span className="text-sm leading-5 text-accent">Or</span>
            <span className="h-px flex-1 bg-accent" />
          </div>
          <div className="flex h-20 items-center gap-4 rounded-lg bg-surface-dark/50 p-4">
            <p className="flex-1 whitespace-pre-line text-sm leading-6 text-white">{WHATSAPP_TEXT}</p>
            <WhatsAppButton />
          </div>
        </div>
      </div>

      <img src={A.swipe} alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-70" />
    </section>
  );
}
