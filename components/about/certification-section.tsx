"use client";
import { createPortal } from "react-dom";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glow, Head } from "@/components/common/section-ui";
import { useDelayedUnmount, useModalEffects } from "@/lib/use-animated";

const A = {
  certBg: "/about/b803afd761809dc0f0f44924cec0a407982bee62-70b324.png",
  iconMaximize: "/about/icon-maximize.svg",
};

const ISO_CARDS = [
  {
    img: "/about/6344c5f997c3d40fc8b7c786d728dedb59c8a904.webp",
    title: "ISO 9001:2015 QMS",
    top: true,
  },
  {
    img: "/about/c9c4d051832f17cdfd69f36233a943e5aca0b3d6.webp",
    title: "TKDN Certification",
    top: true,
  },
  {
    img: "/about/c9cab7691bbe1d2ccce3b99a21eb2804f5057079.webp",
    title: "National Defense Industry",
    top: false,
  },
];

export function Certification() {
  const [cert, setCert] = useState<(typeof ISO_CARDS)[number] | null>(null);
  const [open, setOpen] = useState(false);
  const rendered = useDelayedUnmount(open, 250);
  const close = () => setOpen(false);
  useModalEffects(open, close);

  return (
    <section
      id="certificate"
      className="relative isolate overflow-hidden px-6 py-12.5 md:px-20"
    >
      <Image src={A.certBg} alt="" fill className="-z-20 object-fill" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[630px]"
          pill="Meeting Recognized Industry Standards"
          title="Certified Standards for Strategic Technology Delivery"
          desc="Falah maintains recognized standards & compliance frameworks for reliable technology delivery across operational environments."
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {ISO_CARDS.map((card) => (
            <div key={card.title} className="relative">
              <Glow className="-top-[9px] left-0 h-[25px] w-full" />
              <button
                type="button"
                onClick={() => {
                  setCert(card);
                  setOpen(true);
                }}
                aria-label={`View ${card.title}`}
                className="relative block h-[400px] w-full cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-accent"
              >
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className={cn("object-cover", card.top && "object-top")}
                />
                <div className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-lg border border-white bg-surface-dark/5 backdrop-blur-[5px]">
                  <img src={A.iconMaximize} alt="" className="h-5 w-5" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-[160px] flex-col justify-end gap-2 bg-[linear-gradient(180deg,rgba(5,4,13,0)_0%,rgba(5,4,13,0.5)_100%)] p-6 backdrop-blur-[5px]">
                  <h3 className="font-display text-xl font-bold leading-6 text-white">
                    {card.title}
                  </h3>
                </div>
              </button>
            </div>
          ))}
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
                open
                  ? "animate-fade-in"
                  : "pointer-events-none animate-fade-out",
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
                  src={cert.img}
                  alt={cert.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
                <h3 className="font-display text-base font-bold leading-6 text-white md:text-lg">
                  {cert.title}
                </h3>

                <button
                  type="button"
                  onClick={close}
                  aria-label="Close certificate modal"
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
