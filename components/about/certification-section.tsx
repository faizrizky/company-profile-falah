"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { HoverReveal } from "@/components/common/hover-reveal";
import { Glow, ResponsiveBackground, SectionTitle } from "@/components/common/section-ui";
import { useI18n } from "@/components/i18n/locale-provider";
import { Pill } from "@/components/ui/pill";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { format } from "@/lib/i18n/dictionaries";
import { useDelayedUnmount, useModalEffects } from "@/lib/use-animated";
import { cn } from "@/lib/utils";
import type { Certification, CertificationsBlock } from "@/types/cms";

const ICON_MAXIMIZE = "/about/icon-maximize.svg";

export function CertificationGallery({
  header,
  background,
  items,
}: {
  header: CertificationsBlock["header"];
  background?: string;
  items: Certification[];
}) {
  const { t } = useI18n();
  const [cert, setCert] = useState<Certification | null>(null);
  const [open, setOpen] = useState(false);
  const rendered = useDelayedUnmount(open, 250);
  const close = () => setOpen(false);
  useModalEffects(open, close);

  return (
    <section id="certificate" className="scroll-mt-16 relative isolate overflow-hidden px-6 py-12.5 md:px-20">
      <ResponsiveBackground src={background} className="-z-20 object-fill" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          className="max-w-[630px]"
          eyebrow={header.eyebrow}
          title={header.title}
          desc={header.description}
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items
            .filter((card) => mediaUrl(card.certificate))
            .map((card) => {
              const image = mediaUrl(card.certificate);
              return (
                <div key={card.id} className="group relative">
                  <Glow className="z-10 -top-[9px] left-0 h-[25px] w-full" />
                  <button
                    type="button"
                    onClick={() => {
                      setCert(card);
                      setOpen(true);
                    }}
                    aria-label={format(t.certificates.view, { title: card.title })}
                    className="relative block h-[400px] w-full cursor-pointer overflow-hidden rounded-lg border border-accent/50 transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {image && (
                      <Image
                        src={image}
                        alt={mediaAlt(card.certificate, card.title)}
                        fill
                        className={cn("object-cover", card.certificateFocus === "top" && "object-top")}
                      />
                    )}
                    <div className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-lg border border-white bg-surface-dark/50 backdrop-blur-[5px]">
                      <img src={ICON_MAXIMIZE} alt="" className="h-5 w-5" />
                    </div>
                    {/* Figma Certificate Card_b: hover raises the caption and reveals its details. */}
                    <div className="absolute inset-x-0 bottom-0 flex min-h-[160px] flex-col justify-end gap-2 bg-[linear-gradient(180deg,rgba(5,4,13,0)_0%,rgba(5,4,13,0.5)_86%)] p-6 text-left backdrop-blur-[1px] transition-[backdrop-filter] duration-300 group-hover:bg-[linear-gradient(180deg,rgba(5,4,13,0)_0%,rgba(5,4,13,0.5)_43%)]">
                      <h3 className="font-display text-xl font-bold leading-6 text-white">{card.title}</h3>
                      {(card.subtitle || card.description) && (
                        <HoverReveal>
                          <div className="flex flex-col items-start gap-2 pt-1">
                            {card.subtitle && <Pill size="xs">{card.subtitle}</Pill>}
                            {card.description && <p className="text-sm leading-6 text-white">{card.description}</p>}
                          </div>
                        </HoverReveal>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {rendered &&
        cert &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={cert.title}
          >
            <div
              className={cn(
                "absolute inset-0 bg-surface-dark/80 backdrop-blur-md",
                open ? "animate-fade-in" : "pointer-events-none animate-fade-out",
              )}
              onClick={close}
              aria-hidden
            />
            <div
              className={cn(
                "relative z-10 flex max-h-[calc(100vh-32px)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-white/10 bg-surface-dark",
                open ? "animate-modal-in" : "animate-modal-out",
              )}
            >
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto">
                <img
                  src={mediaUrl(cert.certificate)}
                  alt={mediaAlt(cert.certificate, cert.title)}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
                <h3 className="font-display text-base font-bold leading-6 text-white md:text-lg">{cert.title}</h3>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.certificates.close}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white bg-surface-dark/5 text-white transition-colors hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
