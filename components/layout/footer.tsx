import type { ReactNode } from "react";

import { GlowLine } from "@/components/common/glow-line";
import { Lines } from "@/components/common/section-ui";
import { SocialIcon } from "@/components/common/social-icon";
import { whatsappHref } from "@/components/contact/whatsapp-button";
import { LocaleLink } from "@/components/i18n/locale-link";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import type { Footer as FooterData, SiteSetting } from "@/types/cms";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 md:gap-0">
      <h3 className="flex h-[55px] items-center font-display text-xl font-bold leading-6 text-accent">{title}</h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function ContactItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex flex-col gap-1">
      <span className="text-sm font-bold leading-5 text-white">{label}</span>
      <span className="text-xs leading-6 text-white md:text-sm">{children}</span>
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
    <footer className="relative overflow-hidden bg-[#020713] px-6 pb-[25px] pt-[75px] lg:px-20 lg:py-16">
      <div className="mx-auto w-full max-w-[1269px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[274fr_296fr_296fr_313fr] md:gap-8">
          <div className="flex flex-col gap-1 md:gap-5">
            {logo && <img src={logo} alt={mediaAlt(settings.logo, settings.siteName)} className="my-[9.5px] h-9 w-fit md:my-0 md:h-10" />}
            {footer.description && <p className="text-sm leading-5 text-accent md:max-w-[270px] md:leading-6">{footer.description}</p>}
          </div>

          {footer.columns?.map((column) => (
            <FooterColumn key={column.id ?? column.title} title={column.title}>
              {column.links?.map((link) => (
                <LocaleLink
                  key={link.id ?? link.href}
                  href={link.href}
                  className="flex min-h-10 items-center text-xs leading-6 md:text-sm text-white transition-colors hover:text-accent"
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
              <div className="mt-5 flex flex-wrap md:mt-6 items-center justify-between gap-3 md:justify-start">
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
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/90 text-white transition-all duration-300 hover:border-transparent hover:bg-[linear-gradient(132deg,#1866ef_32%,#05040d_170%)] hover:shadow-[0_0_5px_#1866ef]"
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

        <GlowLine className="mt-8 md:mt-10" />

        {copyright && (
          <div className="flex flex-col items-center gap-2 pt-8 md:pt-5">
            <p className="text-center text-sm leading-5 text-white md:text-xs md:leading-normal md:text-white/80">{copyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
