"use client";

import { useState } from "react";

// ponytail: Figma shows no expand/collapse icon on FAQ items
// ponytail: only the Q2 answer exists in the Figma dump (others are Lorem
// placeholders) — Q1/Q3–Q6 answers are plausible copy
const faqs = [
  {
    q: "What industries does Falah support?",
    a: "Falah supports government, defense, education, and enterprise sectors with simulation training, operational technology, and digital transformation solutions.",
  },
  {
    q: "Can Falah develop customized simulation systems?",
    a: "Yes. Falah develops customized simulation environments tailored to specific operational, training, and organizational requirements.",
  },
  {
    q: "Are Falah’s solutions suitable for government and defense environments?",
    a: "Yes. Falah’s solutions are built for secure, mission-critical environments and follow recognized quality and compliance standards.",
  },
  {
    q: "Does Falah provide implementation and operational support?",
    a: "Yes. Falah provides end-to-end implementation, integration, and ongoing operational support for its simulation and technology solutions.",
  },
  {
    q: "What types of simulation solutions does Falah provide?",
    a: "Falah provides immersive training simulators, command center solutions, advanced education systems, and virtual connectivity suites.",
  },
  {
    q: "Can Falah integrate solutions with existing infrastructure?",
    a: "Yes. Falah’s solutions are designed to integrate with existing infrastructure, systems, and operational workflows.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {faqs.map((item, i) => (
        <div
          key={item.q}
          className="relative flex h-full flex-col gap-2 rounded-lg border border-accent/50 bg-surface-dark/5 p-4 px-5 backdrop-blur-sm"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-[46px] top-[-8px] h-[14px] w-[540px] rounded-full bg-accent/50 blur-[50px]"
          />
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center text-left font-display text-sm font-bold leading-4 text-accent"
          >
            {item.q}
          </button>
          {openIndex === i && (
            <p className="text-sm leading-6 text-white">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
