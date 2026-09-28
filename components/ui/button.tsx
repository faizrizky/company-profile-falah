import { cva, type VariantProps } from "class-variance-authority";

import { LocaleLink } from "@/components/i18n/locale-link";
import { cn } from "@/lib/utils";

/**
 * Hover (Figma "Variant2"): a solid colour sweeps in from the left behind the
 * label. `--btn-fill` sets that colour (default: the brand blue).
 */
const FILL_SWEEP =
  "relative isolate overflow-hidden before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-[var(--btn-fill,var(--color-blue-bright))] before:transition-transform before:duration-300 before:ease-out before:content-[''] hover:before:scale-x-100 focus-visible:before:scale-x-100";

const buttonVariants = cva(
  "group/btn inline-flex items-center justify-center gap-2 rounded-lg font-sans font-medium transition-colors duration-300",
  {
    variants: {
      variant: {
        fill: cn(FILL_SWEEP, "gradient-brand text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]"),
        stroke: cn(
          FILL_SWEEP,
          "border border-white bg-surface-dark/5 text-white backdrop-blur-sm hover:border-[var(--btn-fill,var(--color-blue-bright))]",
        ),
        ghost: "text-white hover:text-accent",
      },
      size: {
        lg: "h-12 px-6 text-sm",
        md: "h-10 px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "fill",
      size: "md",
    },
  },
);

type ButtonProps = {
  href?: string;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Opens the link in a new tab (external URLs, files). */
  external?: boolean;
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants>;

export function Button({
  href,
  className,
  ariaLabel,
  type = "button",
  disabled,
  external,
  children,
  variant,
  size,
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href?.startsWith("/")) {
    return (
      <LocaleLink href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </LocaleLink>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(classes, "disabled:pointer-events-none disabled:opacity-60")}
    >
      {children}
    </button>
  );
}
