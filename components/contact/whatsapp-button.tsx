import { Button } from "@/components/ui/button";

export function whatsappHref(number?: string | null, message?: string | null) {
  if (!number) return undefined;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
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
