import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

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
  iconLocator: "/contact/icon-locator.svg",
  iconAddressArrow: "/contact/icon-address-arrow.svg",
  map: "/contact/map.webp",
};

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
}: {
  icon: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label required={required}>{label}</Label>
      <div className="flex h-11 items-center gap-3 rounded-lg border border-white bg-surface-dark/50 px-5 backdrop-blur-[14.7px]">
        <img src={icon} alt="" className="h-4 w-4" />
        <span className="text-sm leading-4 text-white/50">{placeholder}</span>
      </div>
    </div>
  );
}

export function Fields() {
  return (
    <div className="flex w-full flex-col gap-4 px-6 md:gap-3 md:px-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field icon={A.iconUser} label="Full name" placeholder="Enter your name" required />
        <Field
          icon={A.iconOrganization}
          label="Organization/Institution"
          placeholder="Enter your organization / institution name ..."
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field icon={A.iconEmail} label="Email" placeholder="Enter your email" required />
        <Field icon={A.iconPhone} label="Phone number" placeholder="Enter your phone number" required />
      </div>
      <div className="flex h-[73px] items-center gap-8">
        <div className="flex w-1/2 flex-col gap-2">
          <Label>Consultation Interest</Label>
          <div className="flex h-11 items-center justify-between rounded-lg border border-white bg-surface-dark/50 px-5 backdrop-blur-[14.7px]">
            <span className="text-sm leading-4 text-white">Immersive Simulation</span>
            <img src={A.iconDropdown} alt="" className="h-4 w-4" />
          </div>
        </div>
        <div className="flex w-1/2 flex-col gap-2">
          <Label>Consultation Detail</Label>
          <div className="flex h-[66px] items-start rounded-lg border border-white bg-surface-dark/50 p-5 backdrop-blur-[14.7px]">
            <span className="text-sm leading-4 text-white/50">
              Tell us about your needs, project goals, or challenges ...
            </span>
          </div>
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
