import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { Lines } from "@/components/common/section-ui";
import { LocaleLink } from "@/components/i18n/locale-link";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import type { Footer as FooterData, SiteSetting } from "@/types/cms";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <h3 className="mb-5 font-display text-base font-bold text-accent">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export function Footer({
  footer,
  settings,
  contactLabel,
}: {
  footer: FooterData;
  settings: SiteSetting;
  contactLabel: string;
}) {
  const { contact } = settings;
  const logo = mediaUrl(settings.logo);
  const copyright = footer.copyright?.replace("{year}", String(new Date().getFullYear()));

  return (
    <footer className="relative overflow-hidden bg-[#020713] px-6 py-12 lg:px-20 lg:py-16">
      <div className="mx-auto w-full max-w-[1269px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_0.8fr_1.2fr] md:gap-8">
          <div className="flex flex-col gap-5">
            {logo && <img src={logo} alt={mediaAlt(settings.logo, settings.siteName)} className="h-10 w-fit" />}
            {footer.description && (
              <p className="max-w-[240px] text-sm leading-5 text-white/80">{footer.description}</p>
            )}
          </div>

          {footer.columns?.map((column) => (
            <FooterColumn key={column.id ?? column.title} title={column.title}>
              {column.links?.map((link) => (
                <LocaleLink
                  key={link.id ?? link.href}
                  href={link.href}
                  className="text-sm leading-5 text-white/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </LocaleLink>
              ))}
            </FooterColumn>
          ))}

          <FooterColumn title={contactLabel}>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              <p className="text-sm leading-5 text-white/80">
                <Lines text={contact.shortAddress || contact.address} />
              </p>
            </div>

            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-accent"
            >
              <Mail className="h-5 w-5 shrink-0" />
              {contact.email}
            </a>

            <a
              href={telHref(contact.phone)}
              className="flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-accent"
            >
              <Phone className="h-5 w-5 shrink-0" />
              {contact.phone}
            </a>

            {settings.socials?.length ? (
              <div className="mt-1 flex items-center gap-2">
                {settings.socials.map((social) => (
                  <a
                    key={social.id ?? social.label}
                    href={social.url}
                    aria-label={social.label}
                    {...(social.url.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex h-7 w-7 items-center justify-center"
                  >
                    <img src={mediaUrl(social.icon)} alt="" className="h-7 w-7 object-contain" />
                  </a>
                ))}
              </div>
            ) : null}
          </FooterColumn>
        </div>

        <div className="mt-10 h-[2px] w-full bg-blue-bright shadow-[0_0_10px_rgba(59,130,246,1)]" />

        {copyright && (
          <div className="flex justify-center pt-5">
            <p className="text-xs text-white/80">{copyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
