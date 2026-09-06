import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const A = {
  hero: "/home/868c1b8678b700d4c84b8c6d5a837d626c019e5d.webp",
  swipe: "/home/swipe.svg",
  play: "/home/play.svg",
  problemBg: "/home/f10e93358df011d7fbe05934f5f037f47ad15923.webp",
  problemImage: "/home/551e418bfd19a405d49ad61dcf057d03127ed7ec.webp",
  risk: ["/home/risk-1.svg", "/home/risk-2.svg", "/home/risk-3.svg"],
  demoBg: "/home/88bc9a9201a3404fc882594e5ce830b89b38ea39.webp",
  demo: "/home/10a5d1245f72bfd89f17f50606b7e7305e297729.webp",
  solutionBg: "/home/b9b70d4fc025e8a7a993bb8443a97e3de9688b6f.webp",
  solution1: "/home/11741bf42ede88699c0d4a8887fb08c6bc410913.webp",
  expertsBg: "/home/f317684d3b7a2149261ee251a36adcafe02d43ef.webp",
  expertImages: [
    "/home/7efd48d26bc3228d5cc49dce0859d27495360778.webp",
    "/home/2130c6305d92fa269b888e263381b3e1654ebce8.webp",
    "/home/ff2687bf9298ff3758774cd4688fda88e9e11151.webp",
  ],
  certBg: "/home/d90572902ab21cd6375c061e1d9f1ea77a5ab7aa.webp",
  kemhan: "/home/88a046b82458ea063910ce5d1d8298a6d317580e.webp",
  faqBg: "/home/8462b075f5d2d273d27811df43b5d96ef5ae81ea.webp",
  ctaBg: "/home/72d60c1716d38f195a043cdb8338d0f47aa472c0.webp",
  ctaVideo: "/home/5867d85722b9f8d86edcabe75587f140fb96fa57-3dfac4.webp",
};

// ponytail: hash-named partner logos have no names in Figma — generic alts
export const PARTNERS = [
  { src: "/home/partner-ilias.svg", alt: "ILIAS" },
  { src: "/home/partner-plath.svg", alt: "Plath" },
  { src: "/home/0a753080592dcd342c94d545a636dcdf4da59a21.webp", alt: "Bohemia" },
  { src: "/home/partner-tni-ad.svg", alt: "TNI AD" },
  { src: "/home/partner-trelix.svg", alt: "Trelix" },
  { src: "/home/partner-everbridge.svg", alt: "Everbridge" },
  { src: "/home/partner-strojirna.svg", alt: "Strojirna" },
  { src: "/home/partner-tni-al.svg", alt: "TNI AL" },
  {
    src: "/home/8174b2638eb0e466077f2ffb86c994fd812fa97a-a1ab07.webp",
    alt: "Bohemia",
  },
  {
    src: "/home/83f3ebf81d5491ee538a965e7e177167d72c9ec9-559a07.webp",
    alt: "Unity",
  },
  { src: "/home/88a046b82458ea063910ce5d1d8298a6d317580e.webp", alt: "KEMHAN" },
  {
    src: "/home/61b51db11d6cc6b101b8d66fabfcf795877e26e1-528ece.webp",
    alt: "Plath",
  },
];

export const PROBLEMS = [
  {
    icon: A.risk[0],
    title: "Real-World Training Comes with Real Risks",
    desc: "Operational training can be expensive, risky, and difficult to scale in real-world environments.",
  },
  { icon: A.risk[1], title: "Theory Alone Is Not Enough", desc: "" },
  {
    icon: A.risk[2],
    title: "Conventional Training Limits Readiness",
    desc: "",
  },
];

export const SOLUTION_SMALL = [
  {
    img: "/home/ad08db80f2a754576b36c904e844bb37fb2dffba.webp",
    title: "Training Simulator",
  },
  {
    img: "/home/de800df70f7738cb5bcc4f313676d23acdaab2a1.webp",
    title: "Command Center",
  },
  {
    img: "/home/58db185d52171011b7e5d439ed214da038ed6193.webp",
    title: "Advanced Education Systems",
  },
  {
    img: "/home/3ebc014598e8a2249d2813ba3224e7bcea7058d0.webp",
    title: "Virtual Connect Suite",
  },
];

export const STATS = [
  { value: "50+", label: "Strategic Projects" },
  { value: "10K+ Hour", label: "of Immersive Training" },
  { value: "99.4%", label: "Simulation Accuracy" },
  { value: "0", label: "Operational Accidents" },
];

export const EXPERTS = [
  {
    img: A.expertImages[0],
    icon: "/home/expert-1.svg",
    title: "Content Development",
    desc: "Developing immersive simulation systems for operational &.",
  },
  {
    img: A.expertImages[1],
    icon: "/home/expert-2.svg",
    title: "Software Development",
    desc: "Monitoring, communication, & control for complex environments.",
  },
  {
    img: A.expertImages[2],
    icon: "/home/expert-3.svg",
    title: "IT Infrastructure Development",
    desc: "Designing interactive learning experiences that improve competency.",
  },
];

export const CERTS = [
  {
    icon: "/home/cert-iso.svg",
    iconClass: "h-[74px] w-[74px]",
    title: "ISO 9001:2015 QMS",
    subtitle: "Quality Management System",
    desc: "Ensuring structured quality management and reliable implementation processes across operational technology projects.",
  },
  {
    icon: "/home/cert-tkdn.svg",
    iconClass: "w-[182px]",
    title: "TKDN Certification",
    subtitle: "Domestic Component Compliance",
    desc: "Supporting national industry growth through locally compliant technology and operational solutions.",
  },
  {
    icon: A.kemhan,
    iconClass: "w-[73px]",
    title: "National Defense Industry",
    subtitle: "Strategic Defense Technology Sector",
    desc: "Contributing to mission-critical training and operational technology initiatives within the national defense ecosystem.",
  },
];

export function Section({
  bg,
  className,
  children,
}: {
  bg: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden px-6 py-12.5 lg:px-20",
        className,
      )}
    >
      <Image src={bg} alt="" fill className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  className,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-3 text-center",
        className,
      )}
    >
      <span className="flex items-center gap-1 rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-sm text-white backdrop-blur-sm">
        {eyebrow}
      </span>
      <h2 className="max-w-[900px] font-display text-[30px] font-bold leading-9 text-accent">
        {title}
      </h2>
      <p className="max-w-[720px] text-base leading-6 text-white">{desc}</p>
    </div>
  );
}

export function PartnerMarquee({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="flex w-max items-center animate-marquee">
        {[...PARTNERS, ...PARTNERS].map((p, i) => (
          <img
            key={i}
            src={p.src}
            alt={p.alt}
            className="mr-[45px] h-8 w-auto opacity-70"
          />
        ))}
      </div>
    </div>
  );
}
