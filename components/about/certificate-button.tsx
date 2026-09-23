"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/locale-provider";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { useDelayedUnmount, useModalEffects } from "@/lib/use-animated";
import type { Certification } from "@/types/cms";

const certBg = "/about/b803afd761809dc0f0f44924cec0a407982bee62-70b324.webp";
const icon = "/about/icon-certificate.svg";

export function CertificateButton({ certifications }: { certifications: Certification[] }) {
  const { t } = useI18n();
  const items = certifications.filter((c) => mediaUrl(c.certificate));
  const [open, setOpen] = useState(false);
  const rendered = useDelayedUnmount(open, 250);
  useModalEffects(open, () => setOpen(false));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="gradient-brand inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-6 text-sm font-sans font-medium text-white shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-colors md:w-fit"
      >
        <img src={icon} alt="" className="h-5 w-5" />
        {t.certificates.show}
      </button>

      {rendered &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 md:p-8"
            role="dialog"
            aria-modal="true"
          >
            <div
              className={cn(
                "fixed inset-0 bg-surface-dark/80 backdrop-blur-md",
                open
                  ? "animate-fade-in"
                  : "pointer-events-none animate-fade-out",
              )}
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <div
              className={cn(
                "relative z-10 my-auto max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-white/10",
                open ? "animate-modal-in" : "animate-modal-out",
              )}
            >
              <Image
                src={certBg}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />

              <div className="absolute inset-0 bg-surface-dark/80 backdrop-blur-sm" />

              <div className="relative p-6 md:p-10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white bg-surface-dark/5 text-white backdrop-blur-[5px]"
                  aria-label={t.certificates.close}
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                  {items.map((c) => (
                    <div
                      key={c.id}
                      className="relative h-[280px] overflow-hidden rounded-lg md:h-[380px]"
                    >
                      <Image
                        src={mediaUrl(c.certificate)!}
                        alt={mediaAlt(c.certificate, c.title)}
                        fill
                        className="object-cover"
                        sizes="(min-width:768px) 33vw, 100vw"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(5,4,13,0)_0%,rgba(5,4,13,0.7)_100%)] p-4 backdrop-blur-[5px]">
                        <h3 className="font-display text-base font-bold leading-6 text-white">
                          {c.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
