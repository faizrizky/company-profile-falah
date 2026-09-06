import type { CategoryDetail } from "../../types/category";

// ponytail: 4 of 5 tabs carry derived copy — Figma only shows "Operational
// Training" content. Swap in real desc/pills when provided.
export const categoryDetails: CategoryDetail[] = [
  {
    slug: "virtual-training-suite",
    hero: {
      title: "Virtual Training Suite",
      description:
        "Technology-enhanced learning environments for modern educational institutions.",
      image: "/solution/virtual-training-suite/hero.png",
      recommendedFor: ["VR Training", "Mission Readiness", "Operational Simulation"],
    },
    tabs: [
      {
        name: "Operational Training",
        desc: "Advanced fixed-wing simulators for pilot readiness and mission training.",
        pills: ["Defence", "Pilot Training", "Emergency Response", "Operational Exercise"],
      },
      {
        name: "Language Training",
        desc: "Immersive scenarios that build mission-language fluency and communication confidence under pressure.",
        pills: ["Mission Language", "Communication", "Cross-Cultural", "Real-time Practice"],
      },
      {
        name: "Maintenance Training",
        desc: "Guide technicians through complex maintenance tasks in a safe, repeatable simulated environment.",
        pills: ["Equipment", "Repair", "Diagnostics", "Readiness"],
      },
      {
        name: "VTS Editor",
        desc: "A no-code editor to design, customize, and deploy virtual training scenarios for your organization.",
        pills: ["Scenario Builder", "Custom Content", "Deployment", "Analytics"],
      },
      {
        name: "Medical Training",
        desc: "High-fidelity medical simulation for emergency response and clinical procedure training.",
        pills: ["Emergency Care", "Clinical", "Team Response", "Debrief"],
      },
    ],
    challenges: [
      {
        icon: "downtime",
        title: "High Equipment Downtime",
        desc: "Long maintenance time leads to operational disruptions and productivity loss",
      },
      {
        icon: "cost",
        title: "Expensive Practical Training",
        desc: "Using real equipment for training increases cost and resources consumption",
      },
      {
        icon: "error",
        title: "Human Error & incorrect Procedures",
        desc: "Technicians may skip steps or make mistakes that can cause equipment failure",
      },
      {
        icon: "inconsistent",
        title: "Inconsistent Procedures",
        desc: "Different technicians follow different methods and standard",
      },
    ],
  },
];
