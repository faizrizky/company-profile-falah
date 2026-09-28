import { ResponsiveBackground, SectionTitle } from "@/components/common/section-ui";
import { mediaUrl } from "@/lib/cms/media";
import type { OfficeMapBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function OfficeMapBlock({ block, ctx }: BlockProps<Data>) {
  const contact = ctx.data.settings?.contact;
  const address = contact?.address;
  // The pin picked on the CMS map is exact; the address text is the fallback.
  const hasPin = typeof contact?.latitude === "number" && typeof contact?.longitude === "number";
  const query = hasPin ? `${contact!.latitude},${contact!.longitude}` : address;
  const bg = mediaUrl(block.background);

  return (
    <section className="relative isolate flex flex-col items-center gap-8 overflow-hidden bg-[#0A0A0A] pt-[50px] md:bg-transparent md:p-[50px_80px]">
      <ResponsiveBackground src={bg} className="-z-30 hidden object-cover md:block" />
      <div className="absolute inset-0 -z-20 hidden bg-[linear-gradient(180deg,rgba(5,4,13,1)_0%,rgba(5,4,13,0.97)_0%,rgba(5,4,13,0)_32%)] md:block" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(0deg,rgba(5,4,13,1)_0%,rgba(5,4,13,0)_40%)] md:block" />
      <SectionTitle
        variant="contact"
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
      />
      {address && (
        <div className="relative h-[177px] w-full overflow-hidden md:h-[480px] md:w-[853px] md:rounded-lg md:border md:border-accent md:shadow-[0_0_4px_2px_rgba(147,197,253,1)]">
          {/* Desktop (Figma 853×480): the map is framed so the office sits under the
              address card at (474, 184), zoomed out one step. */}
          <iframe
            title={ctx.t.map.title}
            src={`https://www.google.com/maps?q=${encodeURIComponent(query!)}&z=16&output=embed`}
            className="h-full w-full border-0 md:absolute md:left-0 md:top-[-124px] md:h-[600px] md:w-[948px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
          {/* Figma Icon_Locator_b: blue pin (drawn over Google's marker) with its shadow. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[451.5px] top-[150px] hidden h-[34px] w-[45px] flex-col items-center justify-end px-2 md:flex"
          >
            <img src="/contact/locator/shadow.svg" alt="" className="absolute inset-[74%_23.63%_-0.22%_23.63%]" />
            <div className="relative h-12 w-8 shrink-0">
              <img src="/contact/locator/pin.svg" alt="" className="absolute inset-[0_0_11.99%_0] h-auto w-full" />
              <img src="/contact/locator/pin-glow.svg" alt="" className="absolute inset-[0_0_11.96%_0] h-auto w-full" />
              <img src="/contact/locator/dot.svg" alt="" className="absolute inset-[19.97%_29.63%_52.56%_29.63%]" />
            </div>
          </div>
          <div className="absolute left-[calc(50%+50.5px)] top-5 hidden -translate-x-1/2 flex-col items-center backdrop-blur-[2.5px] md:flex">
            <div className="flex items-center rounded-lg bg-[#0F0F14]/50 p-3 transition-colors duration-300 hover:bg-[#0F0F14]/20">
              <span className="w-[258px] text-xs font-medium leading-normal text-white">{address}</span>
            </div>
            <img src="/contact/icon-address-arrow.svg" alt="" className="h-[10px] w-[20px]" />
          </div>
        </div>
      )}
    </section>
  );
}
