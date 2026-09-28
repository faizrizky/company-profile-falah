import { ScrollHint } from "@/components/common/scroll-hint";
import { Glow, ResponsiveBackground } from "@/components/common/section-ui";
import { ContactForm } from "@/components/contact/contact-form";
import { WhatsAppButton, whatsappHref } from "@/components/contact/whatsapp-button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { mediaUrl } from "@/lib/cms/media";
import type { ContactFormBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function ContactFormBlock({ block, ctx }: BlockProps<Data>) {
  const { settings, categories } = ctx.data;
  const interestOptions = block.interestOptions?.length ? block.interestOptions : categories.map((c) => c.title);
  const waHref = whatsappHref(settings?.contact.whatsappNumber, settings?.contact.whatsappMessage);
  const bg = mediaUrl(block.background);

  const formProps = {
    interestOptions,
    submitLabel: block.submitLabel || ctx.t.solutions.requestConsultation,
    responseNote: block.responseNote,
    successMessage: block.successMessage || ctx.t.contact.successFallback,
  };

  return (
    <section className="relative isolate overflow-hidden bg-surface-dark md:flex md:items-center md:gap-8 md:px-20 md:py-[100px]">
      <ResponsiveBackground src={bg} className="-z-20 hidden object-cover md:block" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(180deg,rgba(5,4,13,0)_51%,rgba(5,4,13,1)_100%)] md:block" />

      {/* Mobile */}
      <div className="flex flex-col gap-8 bg-[#0A0A0A]/50 pt-[120px] md:hidden">
        <div className="flex flex-col gap-2 px-6">
          {block.eyebrow && (
            <Pill size="xs" className="px-2">
              {block.eyebrow}
            </Pill>
          )}
          <h1 className="font-display text-[20px] font-bold leading-6 text-white">
            {block.titleMobile || block.title}
          </h1>
          {(block.descriptionMobile || block.description) && (
            <p className="text-sm leading-5 text-white">{block.descriptionMobile || block.description}</p>
          )}
          {block.responseNote && <p className="text-sm leading-5 text-white">{block.responseNote}</p>}
        </div>
        <ContactForm
          {...formProps}
          layout="mobile"
          footer={
            block.whatsappText ? (
              <div className="flex flex-col items-center gap-4 rounded-lg bg-surface-dark/50 p-4">
                <p className="whitespace-pre-line text-sm leading-6 text-white">{block.whatsappText}</p>
                <WhatsAppButton href={waHref} label={ctx.t.contact.whatsapp} />
              </div>
            ) : null
          }
        />
      </div>

      {/* Desktop */}
      <div className="hidden w-[574px] shrink-0 flex-col gap-4 md:flex">
        {block.eyebrow && <Pill size="md">{block.eyebrow}</Pill>}
        <div className="flex flex-col">
          <h1 className="font-display text-5xl font-bold leading-[60px] text-white">{block.title}</h1>
          {block.description && <p className="text-base leading-6 text-white">{block.description}</p>}
        </div>
      </div>

      {/* Figma Isi: one thin glow (15px, 3px above the edge); no hover tint. */}
      <Card glow={false} className="hidden flex-1 flex-col gap-5 p-8 hover:bg-surface-dark/5 md:flex">
        <Glow className="-top-[3px] h-[15px] group-hover:translate-y-0 group-hover:bg-accent/75" />
        <ContactForm
          {...formProps}
          layout="desktop"
          footer={
            block.whatsappText ? (
              <>
                <div className="flex h-5 items-center gap-2">
                  <span className="h-px flex-1 bg-gradient-to-r from-accent/0 via-accent/70 to-accent/70" />
                  <span className="text-sm leading-5 text-accent">{ctx.t.contact.or}</span>
                  <span className="h-px flex-1 bg-gradient-to-l from-accent/0 via-accent/70 to-accent/70" />
                </div>
                <div className="flex h-20 items-center gap-4 rounded-lg bg-surface-dark/50 p-4">
                  <p className="flex-1 whitespace-pre-line text-sm leading-[18px] text-white">{block.whatsappText}</p>
                  <WhatsAppButton href={waHref} label={ctx.t.contact.whatsapp} />
                </div>
              </>
            ) : null
          }
        />
      </Card>

      <ScrollHint className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 opacity-70 md:block" />
    </section>
  );
}
