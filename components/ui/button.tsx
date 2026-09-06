import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-medium transition-all duration-300 hover:scale-105",
  {
    variants: {
      variant: {
        fill: "gradient-brand text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]",
        stroke: "border border-white bg-surface-dark/5 text-white backdrop-blur-sm",
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
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants>;

export function Button({
  href,
  className,
  ariaLabel,
  children,
  variant,
  size,
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel} className={classes}>
      {children}
    </button>
  );
}
