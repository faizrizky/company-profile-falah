import Image from "next/image";

import { ContactHead } from "@/components/contact/contact-head";
import { mediaUrl } from "@/lib/cms/media";
import type { OfficeMapBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function OfficeMapBlock({ block, ctx }: BlockProps<Data>) {
  const address = ctx.data.settings?.contact.address;
  const bg = mediaUrl(block.background);

  return (
    <section className="relative isolate flex flex-col items-center gap-8 overflow-hidden bg-[#0A0A0A] pt-[50px] md:bg-transparent md:p-[50px_80px]">
      {bg && <Image src={bg} alt="" fill className="-z-30 hidden object-cover md:block" />}
      <div className="absolute inset-0 -z-20 hidden bg-[linear-gradient(180deg,rgba(5,4,13,1)_0%,rgba(5,4,13,0.97)_0%,rgba(5,4,13,0)_32%)] md:block" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(0deg,rgba(5,4,13,1)_0%,rgba(5,4,13,0)_40%)] md:block" />
      <ContactHead pill={block.header.eyebrow} title={block.header.title} desc={block.header.description} />
      {address && (
        <div className="relative h-[177px] w-full overflow-hidden md:h-[480px] md:w-[853px] md:rounded-lg md:border md:border-accent md:shadow-[0_0_4px_2px_rgba(147,197,253,1)]">
          <iframe
            title={ctx.t.map.title}
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
          <div className="absolute left-[336px] top-[21px] hidden flex-col items-center backdrop-blur-[2.5px] md:flex">
            <div className="flex items-center rounded-lg bg-[#0F0F14]/50 p-3">
              <span className="w-[258px] text-xs font-medium leading-4 text-white">{address}</span>
            </div>
            <img src="/contact/icon-address-arrow.svg" alt="" className="h-[10px] w-[20px]" />
          </div>
        </div>
      )}
    </section>
  );
}
