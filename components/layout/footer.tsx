import type { ReactNode } from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const solutionLinks = [
  {
    label: "Advanced Education System Solution",
    href: "/solution/advanced-education-system",
  },
  {
    label: "Command Center Solution",
    href: "/solution/command-center",
  },
  {
    label: "Simulation Training Solution",
    href: "/solution/simulation-training",
  },
  {
    label: "Virtual Training Suites Solution",
    href: "/solution/virtual-training-suite",
  },
  {
    label: "Virtual Connect Suites Solution",
    href: "/solution/virtual-connect-suite",
  },
];

const companyLinks = [
  {
    label: "About Us",
    href: "/about",
  },
];

const socials = [
  { icon: "/home/social-1.svg", label: "Social 1", href: "#" },
  { icon: "/home/social-2.svg", label: "Social 2", href: "#", highlight: true },
  { icon: "/home/social-3.svg", label: "Social 3", href: "#" },
  { icon: "/home/social-4.svg", label: "Social 4", href: "#" },
  { icon: "/home/social-5.svg", label: "Social 5", href: "#" },
];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="mb-5 font-display text-base font-bold text-accent">
        {title}
      </h3>

      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#020713] px-6 py-12 lg:px-20 lg:py-16">
      <div className="mx-auto w-full max-w-[1269px]">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_0.8fr_1.2fr] md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <img
              src="/home/4f0e49a6e733d436853e5c48772d58ef1c454c51.webp"
              alt="Falah Inovasi Teknologi"
              className="h-10 w-fit"
            />

            <p className="max-w-[240px] text-sm leading-5 text-white/80">
              Immersive simulation and operational technology solutions for
              government, defense, education, and enterprise sectors.
            </p>
          </div>

          {/* Solution */}
          <FooterColumn title="Solution">
            {solutionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm leading-5 text-white/80 transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </FooterColumn>

          {/* Company */}
          <FooterColumn title="Company">
            {companyLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm leading-5 text-white/80 transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title="Contact">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-white" />

              <p className="text-sm leading-5 text-white/80">
                Jl. Mampang Prapatan XII, No.1,
                <br />
                Jakarta, 12790
              </p>
            </div>

            <a
              href="mailto:business@falahtech.co.id"
              className="flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-accent"
            >
              <Mail className="h-5 w-5 shrink-0" />
              business@falahtech.co.id
            </a>

            <a
              href="tel:02126961651"
              className="flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-accent"
            >
              <Phone className="h-5 w-5 shrink-0" />
              021 2696 1651
            </a>

            {/* Social */}
            <div className="mt-1 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-7 w-7 items-center justify-center"
                >
                  <img
                    src={social.icon}
                    alt=""
                    className="h-7 w-7 object-contain"
                  />
                </a>
              ))}
            </div>
          </FooterColumn>
        </div>

        {/* Blue Divider */}
        <div className="mt-10 h-[2px] w-full bg-blue-bright shadow-[0_0_10px_rgba(59,130,246,1)]" />

        {/* Copyright */}
        <div className="flex justify-center pt-5">
          <p className="text-xs text-white/80">
            © 2026 Falah Inovasi Teknologi | All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
