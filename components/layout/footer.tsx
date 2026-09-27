import type { ReactNode } from "react";

import { Lines } from "@/components/common/section-ui";
import { SocialIcon } from "@/components/common/social-icon";
import { whatsappHref } from "@/components/contact/whatsapp-button";
import { LocaleLink } from "@/components/i18n/locale-link";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import type { Footer as FooterData, SiteSetting } from "@/types/cms";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <h3 className="flex h-[55px] items-center font-display text-xl font-bold leading-6 text-accent">{title}</h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function ContactItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex flex-col gap-1">
      <span className="text-sm font-bold leading-5 text-white">{label}</span>
      <span className="text-sm leading-6 text-white">{children}</span>
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
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[274fr_296fr_296fr_313fr] md:gap-8">
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
                  className="flex min-h-10 items-center text-sm leading-6 text-white transition-colors hover:text-accent"
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
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 md:justify-start">
                {settings.socials.map((social) => {
                  const custom = social.platform === "other" ? mediaUrl(social.icon) : undefined;
                  // WhatsApp without its own link opens a chat with the CMS WhatsApp number.
                  const href =
                    social.platform === "whatsapp" && (!social.url || social.url === "#")
                      ? (whatsappHref(contact.whatsappNumber, contact.whatsappMessage) ?? social.url)
                      : social.url;
                  return (
                    <a
                      key={social.id ?? social.label}
                      href={href}
                      aria-label={social.label}
                      title={social.label}
                      {...(href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

        {/* Glowing line: thickest in the middle, tapering to a point at both ends. */}
        <div aria-hidden className="mt-10 w-full drop-shadow-[0_0_6px_rgba(24,102,239,0.9)]">
          <div className="h-[4px] w-full bg-[linear-gradient(90deg,#1c4fd8,#2f6bff_50%,#1c4fd8)] [clip-path:polygon(0_50%,6%_25%,50%_0,94%_25%,100%_50%,94%_75%,50%_100%,6%_75%)]" />
        </div>

        {copyright && (
          <div className="flex justify-center pt-5">
            <p className="text-center text-xs text-white/80">{copyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
