"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDelayedUnmount } from "@/lib/use-animated";

type SolutionLink = { label: string; href: string; highlight?: boolean };

const solutionLinks: SolutionLink[] = [
  { label: "Simulation Training Solution", href: "/solution" },
  {
    label: "Advanced Education System Solution",
    href: "/solution",
    highlight: true,
  },
  { label: "Command Center Solution", href: "/solution" },
  {
    label: "Virtual Training Suites Solution",
    href: "/solution/virtual-training-suite",
  },
  { label: "Virtual Connect Suites Solution", href: "/solution" },
];

const featuredCard = {
  title: "Smart Campus Enterprise",
  desc: "Digital learning infrastructure for modern educational institutions",
  href: "/solution",
  img: "/solution/megamenu/featured-2dd562.png",
};

const solutionCards = [
  {
    title: "Education & Training",
    desc: "Immersive simulation for classrooms and institutional learning",
    href: "/solution",
    img: "/solution/megamenu/education-5c3cd6.png",
  },
  {
    title: "Enterprise Command Center",
    desc: "Unified operations for mission-critical command environments",
    href: "/solution",
    img: "/solution/megamenu/classroom-376645.png",
  },
];

const navLinks = [
  { label: "About", href: "/about" },
  // ponytail: "Press Release" placeholder — Figma instance has empty text
  { label: "Press Release", href: "#" },
];

export function Navbar() {
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [solsOpen, setSolsOpen] = useState(false);
  const megaRendered = useDelayedUnmount(mega, 250);

  const closeAll = () => {
    setMega(false);
    setMobile(false);
    setSolsOpen(false);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-surface-dark/50 backdrop-blur-sm">
      <div className="flex h-[50px] items-center justify-between px-6 lg:px-20">
        <Link href="/">
          <Image
            src="/home/4f0e49a6e733d436853e5c48772d58ef1c454c51.png"
            alt="Falah Inovasi Teknologi"
            width={128}
            height={30}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <button
            type="button"
            aria-expanded={mega}
            onClick={() => setMega((v) => !v)}
            className="flex items-center gap-1 text-sm text-white hover:text-accent"
          >
            Our Solutions
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", mega && "rotate-180")} />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white hover:text-accent"
            >
              {link.label}
            </a>
          ))}
          <Button href="/contact" variant="fill" size="md">
            Contact Us
          </Button>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="text-white lg:hidden"
          onClick={() => setMobile((v) => !v)}
        >
          {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {megaRendered && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 top-[50px] z-40 hidden bg-black/10 backdrop-blur-[6px] lg:block",
            mega ? "animate-fade-in" : "pointer-events-none animate-fade-out",
          )}
          onClick={() => setMega(false)}
          aria-hidden="true"
        />
      )}

      {megaRendered && (
        <div
          className={cn(
            "absolute inset-x-0 top-[50px] z-50 hidden bg-black/50 p-10 px-20 backdrop-blur-[14px] lg:block",
            mega ? "animate-mega-in" : "pointer-events-none animate-mega-out",
          )}
        >
          <div className="flex items-start gap-8">
            <div className="flex w-[280px] flex-col gap-1">
              {solutionLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMega(false)}
                  className={
                    l.highlight
                      ? "gradient-brand flex h-[60px] items-center rounded-lg px-5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
                      : "flex h-[60px] items-center rounded-lg px-5 text-sm font-medium text-[#D4D4D4] transition-transform duration-300 hover:scale-[1.03] hover:bg-white/5 hover:text-white"
                  }
                >
                  {l.label}
                </a>
              ))}
            </div>

            <a
              href={featuredCard.href}
              onClick={() => setMega(false)}
              className="group relative h-[400px] w-[458px] overflow-hidden rounded-lg"
            >
              <img
                src={featuredCard.img}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-black/40 p-8 backdrop-blur-sm">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold leading-6 text-white">
                      {featuredCard.title}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm leading-6 text-white/70">
                    {featuredCard.desc}
                  </span>
                </div>
              </div>
            </a>

            <div className="flex w-[458px] flex-col gap-4">
              {solutionCards.map((c, i) => (
                <a
                  key={c.title}
                  href={c.href}
                  onClick={() => setMega(false)}
                  className={
                    "group flex h-[192px] items-center gap-4 rounded-lg p-2 " +
                    (i === 0 ? "bg-[#404040]" : "bg-transparent")
                  }
                >
                  <img
                    src={c.img}
                    alt=""
                    className="h-[100px] w-[100px] shrink-0 rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-bold leading-6 text-white">
                        {c.title}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm leading-6 text-white/70">
                      {c.desc}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobile && (
        <div className="fixed inset-0 z-[60] flex flex-col border-b-2 border-blue-bright bg-surface-dark/50 p-6 backdrop-blur-lg lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute right-6 top-6 text-white"
            onClick={() => setMobile(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex flex-col gap-5">
            <a
              href="/about"
              onClick={closeAll}
              className="text-lg font-medium text-white"
            >
              About
            </a>
            <button
              type="button"
              aria-expanded={solsOpen}
              onClick={() => setSolsOpen((v) => !v)}
              className="flex items-center justify-between text-lg font-medium text-white"
            >
              Our Solutions
              <ChevronDown
                className={solsOpen ? "h-5 w-5 rotate-180" : "h-5 w-5"}
              />
            </button>
            {solsOpen && (
              <div className="flex flex-col gap-3">
                {solutionLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={closeAll}
                    className="text-base text-white/80"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeAll}
                className="text-lg font-medium text-white"
              >
                {link.label}
              </a>
            ))}
            <Button href="/contact" variant="fill" size="lg" className="w-full">
              Contact Us
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
