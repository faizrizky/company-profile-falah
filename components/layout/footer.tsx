import type { ReactNode } from "react";

import { Lines } from "@/components/common/section-ui";
import { SocialIcon } from "@/components/common/social-icon";
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

function ContactItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold leading-5 text-white">{label}</span>
      <span className="text-sm leading-5 text-white/90">{children}</span>
    </div>
  );
}

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export function Footer({
  footer,
  settings,
  labels,
}: {
  footer: FooterData;
  settings: SiteSetting;
  labels: { contact: string; address: string; email: string; questions: string };
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
              <p className="max-w-[270px] text-sm leading-6 text-accent">{footer.description}</p>
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

          <FooterColumn title={labels.contact}>
            <ContactItem label={labels.address}>
              <Lines text={contact.shortAddress || contact.address} />
            </ContactItem>
            <ContactItem label={labels.email}>
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-accent">
                {contact.email}
              </a>
            </ContactItem>
            <ContactItem label={labels.questions}>
              <a href={telHref(contact.phone)} className="transition-colors hover:text-accent">
                {contact.phone}
              </a>
            </ContactItem>

            {settings.socials?.length ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {settings.socials.map((social) => {
                  const custom = social.platform === "other" ? mediaUrl(social.icon) : undefined;
                  return (
                    <a
                      key={social.id ?? social.label}
                      href={social.url}
                      aria-label={social.label}
                      title={social.label}
                      {...(social.url.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/90 text-white transition-all duration-300 hover:border-blue-bright hover:bg-blue-bright hover:shadow-[0_0_12px_rgba(24,102,239,0.9)]"
                    >
                      {custom ? (
                        <img src={custom} alt="" className="h-4 w-4 object-contain" />
                      ) : (
                        <SocialIcon platform={social.platform ?? "other"} className="h-4 w-4" />
                      )}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </FooterColumn>
        </div>

        {/* Thin line that fades out at both ends, with a soft glow under its middle. */}
        <div aria-hidden className="relative mt-10 h-px w-full">
          <div className="absolute inset-x-[10%] -top-2 h-4 rounded-full bg-blue-bright/60 blur-[10px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,#1866ef_12%,#4f8dff_50%,#1866ef_88%,transparent)]" />
        </div>

        {copyright && (
          <div className="flex justify-center pt-5">
            <p className="text-xs text-white/80">{copyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
