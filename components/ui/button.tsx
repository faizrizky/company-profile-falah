import { cva, type VariantProps } from "class-variance-authority";

import { LocaleLink } from "@/components/i18n/locale-link";
import { cn } from "@/lib/utils";

/**
 * Hover (Figma prototype, smart animate): the button cross-fades to a flat
 * solid fill behind the label. `--btn-fill` sets that colour (default: the
 * brand blue #1866EF).
 */
const FILL_FADE =
  "relative isolate overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-[var(--btn-fill,var(--color-blue-bright))] before:opacity-0 before:transition-opacity before:duration-500 before:ease-out before:content-[''] hover:before:opacity-100 focus-visible:before:opacity-100";

const buttonVariants = cva(
  "group/btn inline-flex items-center justify-center gap-2 rounded-lg font-sans font-medium transition-colors duration-300",
  {
    variants: {
      variant: {
        // Figma Small/Big Button_Fill_b default gradient.
        fill: cn(FILL_FADE, "bg-[linear-gradient(169deg,#1866ef_32.5%,#05040d_170%)] text-white"),
        stroke: cn(
          FILL_FADE,
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

  // Files (external) are not pages: no language prefix.
  if (href?.startsWith("/") && !external) {
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

/** Button look for elements that need their own click handling. */
export { buttonVariants };
