import { Button } from "@/components/ui/button";

/** Direct chat link (wa.me) for the CMS WhatsApp number, with an optional prefilled message. */
export function whatsappHref(number?: string | null, message?: string | null) {
  const digits = number?.replace(/\D/g, "");
  if (!digits) return undefined;
  const international = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${international}${text}`;
}

export function WhatsAppButton({ href, label }: { href?: string; label: string }) {
  return (
    <Button
      href={href}
      external={Boolean(href)}
      variant="stroke"
      size="lg"
      className="border-[#34C759] bg-surface-dark/5 text-[#34C759] backdrop-blur-[5px]"
    >
      <img src="/contact/icon-whatsapp.svg" alt="" className="h-6 w-6" />
      {label}
    </Button>
  );
}
