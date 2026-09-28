"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";

import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactField } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const ICONS = {
  user: "/contact/icon-user.svg",
  organization: "/contact/icon-organization.svg",
  email: "/contact/icon-email.svg",
  phone: "/contact/icon-phone.svg",
  dropdown: "/contact/icon-dropdown.svg",
  arrow: "/about/icon-arrow.svg",
};

type Status = { state: "idle" | "submitting" } | { state: "success" } | { state: "error"; message: string };
type FieldErrors = Partial<Record<ContactField, true>>;

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="flex h-[21px] items-center gap-1">
      <span className="text-sm font-medium leading-4 text-white">{children}</span>
      {required && (
        <span className="text-sm leading-4 text-white [-webkit-text-stroke:0.67px_#3B82F6] [text-shadow:0_0_4px_rgba(59,130,246,1)]">
          *
        </span>
      )}
    </label>
  );
}

/**
 * Figma Input_b: blue outline and tint on hover, white outline and tint while
 * typing (Click). Shared by every input, select and textarea in the form.
 */
const FIELD_STATES =
  "transition-colors duration-300 not-focus-within:hover:border-accent not-focus-within:hover:bg-accent/5 focus-within:bg-accent/5";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs leading-4 text-red-300">
      {message}
    </p>
  );
}

function Field({
  id,
  icon,
  label,
  placeholder,
  name,
  type = "text",
  autoComplete,
  error,
}: {
  id: string;
  icon: string;
  label: string;
  placeholder: string;
  name: ContactField;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  const inputId = `${id}-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId} required>
        {label}
      </Label>
      <div
        className={cn(
          "flex h-11 items-center gap-3 rounded-lg border bg-surface-dark/50 px-5 backdrop-blur-[14.7px]",
          error ? "border-red-400" : cn("border-white", FIELD_STATES),
        )}
      >
        <img src={icon} alt="" className="h-4 w-4" />
        <input
          id={inputId}
          type={type}
          name={name}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="h-full w-full bg-transparent text-sm leading-4 text-white outline-none placeholder:text-white/50"
        />
      </div>
      <FieldError id={`${inputId}-error`} message={error} />
    </div>
  );
}

export type ContactFormProps = {
  interestOptions: string[];
  submitLabel: string;
  responseNote?: string | null;
  successMessage: string;
  layout: "mobile" | "desktop";
  /** Extra content rendered below the submit area (e.g. the WhatsApp box). */
  footer?: ReactNode;
};

export function ContactForm({
  interestOptions,
  submitLabel,
  responseNote,
  successMessage,
  layout,
  footer,
}: ContactFormProps) {
  const { t } = useI18n();
  const messages = t.contact.errors;
  const id = useId();
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const errorFor = (field: ContactField) =>
    errors[field] ? (messages[field as keyof typeof messages] ?? messages.invalid) : undefined;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], true])));
      return;
    }

    setErrors({});
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: data.website ?? "", startedAt }),
      });
      if (res.ok) {
        form.reset();
        setStatus({ state: "success" });
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { fields?: ContactField[] };
      if (body.fields) setErrors(Object.fromEntries(body.fields.map((f) => [f, true])));
      setStatus({
        state: "error",
        message: res.status === 429 ? messages.tooMany : res.status === 400 ? messages.invalid : messages.generic,
      });
    } catch {
      setStatus({ state: "error", message: messages.network });
    }
  }

  const submitting = status.state === "submitting";
  const isMobile = layout === "mobile";

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex w-full flex-col", isMobile ? "gap-8" : "gap-5")}>
      <div className="flex w-full flex-col gap-4 px-6 md:gap-3 md:px-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            id={id}
            icon={ICONS.user}
            label={t.contact.fullName}
            placeholder={t.contact.fullNamePlaceholder}
            name="fullName"
            autoComplete="name"
            error={errorFor("fullName")}
          />
          <Field
            id={id}
            icon={ICONS.organization}
            label={t.contact.organization}
            placeholder={t.contact.organizationPlaceholder}
            name="organization"
            autoComplete="organization"
            error={errorFor("organization")}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            id={id}
            icon={ICONS.email}
            label={t.contact.email}
            placeholder={t.contact.emailPlaceholder}
            name="email"
            type="email"
            autoComplete="email"
            error={errorFor("email")}
          />
          <Field
            id={id}
            icon={ICONS.phone}
            label={t.contact.phone}
            placeholder={t.contact.phonePlaceholder}
            name="phone"
            type="tel"
            autoComplete="tel"
            error={errorFor("phone")}
          />
        </div>
        {/* Figma: interest and detail each take a full row. */}
        <div className="flex flex-col gap-4 md:gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-interest`}>{t.contact.interest}</Label>
            <div className="relative">
              <select
                id={`${id}-interest`}
                name="interest"
                defaultValue={interestOptions[0]}
                // Figma: the preset choice reads as a placeholder (50% white) until the visitor picks one.
                onChange={(e) => e.currentTarget.classList.replace("text-white/50", "text-white")}
                className={cn(
                  "h-11 w-full cursor-pointer appearance-none rounded-lg border border-white bg-surface-dark/50 pl-5 pr-10 text-sm leading-4 text-white/50 outline-none backdrop-blur-[14.7px]",
                  FIELD_STATES,
                )}
              >
                {interestOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-surface-dark text-white">
                    {opt}
                  </option>
                ))}
              </select>
              <img
                src={ICONS.dropdown}
                alt=""
                className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-message`}>{t.contact.message}</Label>
            <textarea
              id={`${id}-message`}
              name="message"
              maxLength={2000}
              placeholder={t.contact.messagePlaceholder}
              aria-invalid={Boolean(errors.message)}
              className={cn(
                "h-[88px] w-full resize-none rounded-lg border border-white bg-surface-dark/50 p-5 text-sm leading-4 text-white outline-none backdrop-blur-[14.7px] placeholder:text-white/50",
                FIELD_STATES,
              )}
            />
            <FieldError id={`${id}-message-error`} message={errorFor("message")} />
          </div>
        </div>
        {/* Honeypot — visually hidden, skipped by keyboard and screen readers. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className={cn("flex flex-col", isMobile ? "gap-8 px-6" : "gap-3")}>
        <div className={cn("flex flex-col", isMobile ? "gap-2" : "gap-3")}>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? t.contact.sending : submitLabel}
            {!submitting && <img src={ICONS.arrow} alt="" className="h-6 w-6" />}
          </Button>
          {status.state === "success" && (
            <p role="status" className="text-sm leading-5 text-green-300">
              {successMessage}
            </p>
          )}
          {status.state === "error" && (
            <p role="alert" className="text-sm leading-5 text-red-300">
              {status.message}
            </p>
          )}
          {responseNote && (
            <p className={cn("text-xs leading-6 text-white", isMobile && "w-full text-center")}>{responseNote}</p>
          )}
        </div>
        {footer}
      </div>
    </form>
  );
}
