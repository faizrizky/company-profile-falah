import type { ReactNode } from "react";
import { MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/** A button as editors set it in the CMS. */
export type CmsButtonData = {
  id?: string | null;
  label: string;
  href: string;
  style?: "fill" | "stroke" | null;
};

const defaultArrow = <MoveRight className="h-6 w-6" strokeWidth={1.5} />;

/** One CMS button; filled buttons get a trailing arrow. */
export function CmsButton({
  button,
  className,
  arrow = defaultArrow,
}: {
  button: CmsButtonData;
  className?: string;
  /** Icon after the label of filled buttons. */
  arrow?: ReactNode;
}) {
  const style = button.style ?? "fill";
  return (
    <Button href={button.href} variant={style} size="lg" className={className}>
      {button.label}
      {style === "fill" && arrow}
    </Button>
  );
}

/** A row of CMS buttons (stacked on phones). Renders nothing when empty. */
export function CmsButtons({
  buttons,
  className = "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
  buttonClassName,
  arrow,
}: {
  buttons?: CmsButtonData[] | null;
  className?: string;
  buttonClassName?: string;
  arrow?: ReactNode;
}) {
  if (!buttons?.length) return null;
  return (
    <div className={className}>
      {buttons.map((b) => (
        <CmsButton key={b.id ?? b.href} button={b} className={buttonClassName} arrow={arrow} />
      ))}
    </div>
  );
}
