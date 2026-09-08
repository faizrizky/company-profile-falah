import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/category";

export const A = {
  heroBg: "/home/97a64a5c4d3dc933755b867e9e23776073c427e5.webp",
  swipe: "/home/swipe.svg",
  ctaBg: "/solution/8ccf2a3a61e7241ef0a8fb2961008038f4a63929-3fbf2b.webp",
  iconArrow: "/about/icon-arrow.svg",
  iconUser: "/contact/icon-user.svg",
  iconOrganization: "/contact/icon-organization.svg",
  iconEmail: "/contact/icon-email.svg",
  iconPhone: "/contact/icon-phone.svg",
  iconDropdown: "/contact/icon-dropdown.svg",
  iconWhatsapp: "/contact/icon-whatsapp.svg",
  iconAddressArrow: "/contact/icon-address-arrow.svg",
};

export const OFFICE_ADDRESS =
  "Jl. Mampang Prapatan XII Kel No.1, RT.8/RW.1, Tegal Parang, Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790";

export const INTEREST_OPTIONS = [
  "Immersive Simulation",
  ...categories.map((c) => c.title),
];

// ponytail: Figma ships all 6 rows as "Payment" + identical lorem; swap real copy when provided
export const FLOWS = [
  { n: "01", title: "Payment", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { n: "02", title: "Payment", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { n: "03", title: "Payment", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { n: "04", title: "Payment", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { n: "05", title: "Payment", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { n: "06", title: "Payment", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
];

export const WHATSAPP_TEXT = "Need immediate assistance?\nChat with our team via Whatsapp";

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <div className="flex h-[21px] items-center gap-1">
      <span className="text-sm font-medium leading-4 text-white">{children}</span>
      {required && (
        <span className="text-sm leading-4 text-white [-webkit-text-stroke:0.67px_#3B82F6] [text-shadow:0_0_4px_rgba(59,130,246,1)]">
          *
        </span>
      )}
    </div>
  );
}

export function Field({
  icon,
  label,
  placeholder,
  required,
  type = "text",
  name,
}: {
  icon: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  name?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label required={required}>{label}</Label>
      <div className="flex h-11 items-center gap-3 rounded-lg border border-white bg-surface-dark/50 px-5 backdrop-blur-[14.7px]">
        <img src={icon} alt="" className="h-4 w-4" />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          aria-label={label}
          className="h-full w-full bg-transparent text-sm leading-4 text-white outline-none placeholder:text-white/50"
        />
      </div>
    </div>
  );
}

export function Fields() {
  return (
    <div className="flex w-full flex-col gap-4 px-6 md:gap-3 md:px-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field icon={A.iconUser} label="Full name" placeholder="Enter your name" required name="full-name" />
        <Field
          icon={A.iconOrganization}
          label="Organization/Institution"
          placeholder="Enter your organization / institution name ..."
          required
          name="organization"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field icon={A.iconEmail} label="Email" placeholder="Enter your email" required name="email" type="email" />
        <Field icon={A.iconPhone} label="Phone number" placeholder="Enter your phone number" required name="phone" type="tel" />
      </div>
      <div className="flex h-[73px] items-center gap-8">
        <div className="flex w-1/2 flex-col gap-2">
          <Label>Consultation Interest</Label>
          <div className="relative">
            <select
              name="consultation-interest"
              defaultValue="Immersive Simulation"
              aria-label="Consultation Interest"
              className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-white bg-surface-dark/50 pl-5 pr-10 text-sm leading-4 text-white outline-none backdrop-blur-[14.7px]"
            >
              {INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-surface-dark text-white">
                  {opt}
                </option>
              ))}
            </select>
            <img
              src={A.iconDropdown}
              alt=""
              className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="flex w-1/2 flex-col gap-2">
          <Label>Consultation Detail</Label>
          <textarea
            name="consultation-detail"
            aria-label="Consultation Detail"
            placeholder="Tell us about your needs, project goals, or challenges ..."
            className="h-[66px] w-full resize-none rounded-lg border border-white bg-surface-dark/50 p-5 text-sm leading-4 text-white outline-none backdrop-blur-[14.7px] placeholder:text-white/50"
          />
        </div>
      </div>
    </div>
  );
}

export function WhatsAppButton() {
  return (
    <Button
      variant="stroke"
      size="lg"
      className="border-[#34C759] bg-surface-dark/5 text-[#34C759] backdrop-blur-[5px]"
    >
      <img src={A.iconWhatsapp} alt="" className="h-6 w-6" />
      Chat via Whatsapp
    </Button>
  );
}

export function Head({ pill, title, desc }: { pill: string; title: string; desc: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 px-6 md:w-[772px] md:px-0">
      <span className="hidden w-fit items-center rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-sm font-medium leading-6 text-white backdrop-blur-[5px] md:inline-flex">
        {pill}
      </span>
      <div className="flex flex-col gap-4 md:gap-1 md:text-center">
        <h2 className="font-display text-[20px] font-bold leading-6 text-accent md:text-[30px] md:leading-9">
          {title}
        </h2>
        <p className="text-sm leading-5 text-white md:text-base md:leading-6">{desc}</p>
      </div>
    </div>
  );
}
