import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Glow, Lines } from "@/components/common/section-ui";
import { LocaleLink } from "@/components/i18n/locale-link";
import { Button } from "@/components/ui/button";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { LayoutSectionBlock } from "@/types/cms";

export type Element = NonNullable<LayoutSectionBlock["column1"]>[number];
type Of<T extends Element["blockType"]> = Extract<Element, { blockType: T }>;

// Design tokens → Tailwind classes. Editors pick tokens, never raw CSS, so
// everything built in the visual editor stays on-brand at every screen size.
const ALIGN = { left: "text-left items-start", center: "text-center items-center", right: "text-right items-end" };
const JUSTIFY = { left: "justify-start", center: "justify-center", right: "justify-end" };
const HEADING_SIZE = {
  sm: "text-lg leading-6 md:text-xl",
  md: "text-[22px] leading-7 md:text-2xl",
  lg: "text-[24px] leading-8 md:text-[30px] md:leading-9",
  xl: "text-[32px] leading-[1.2] md:text-[48px] md:leading-[60px]",
};
const TEXT_SIZE = { sm: "text-sm leading-5", base: "text-sm leading-5 md:text-base md:leading-6", lg: "text-base leading-7 md:text-lg" };
const ASPECT = { video: "aspect-video", landscape: "aspect-[4/3]", square: "aspect-square", portrait: "aspect-[3/4]" };
const SPACER = { sm: "h-4", md: "h-8", lg: "h-14", xl: "h-24" };

export function BadgeView({ el }: { el: Of<"badge"> }) {
  return (
    <div className={cn("flex w-full", JUSTIFY[el.align ?? "left"])}>
      <span className="inline-flex w-fit items-center rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-sm text-white backdrop-blur-sm">
        {el.text}
      </span>
    </div>
  );
}

export function HeadingView({ el }: { el: Of<"heading"> }) {
  const Tag = el.level ?? "h2";
  return (
    <Tag
      className={cn(
        "w-full font-display font-bold",
        HEADING_SIZE[el.size ?? "lg"],
        el.color === "white" ? "text-white" : "text-accent",
        ALIGN[el.align ?? "left"],
      )}
    >
      <Lines text={el.text} />
    </Tag>
  );
}

export function ParagraphView({ el }: { el: Of<"paragraph"> }) {
  return (
    <p
      className={cn(
        "w-full whitespace-pre-line",
        TEXT_SIZE[el.size ?? "base"],
        el.tone === "muted" ? "text-white/70" : "text-white",
        ALIGN[el.align ?? "left"],
      )}
    >
      {el.text}
    </p>
  );
}

export function ImageView({ el }: { el: Of<"image"> }) {
  const src = mediaUrl(el.image);
  return (
    <figure className="flex w-full flex-col gap-2">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg",
          ASPECT[el.aspect ?? "video"],
          el.framed && "border border-accent/50 shadow-[0_0_10px_rgba(147,197,253,0.6)]",
        )}
      >
        {src ? (
          <Image src={src} alt={mediaAlt(el.image)} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        ) : (
          <div className="absolute inset-0 bg-white/5" />
        )}
      </div>
      {el.caption && <figcaption className="text-xs leading-5 text-white/70">{el.caption}</figcaption>}
    </figure>
  );
}

export function ButtonView({ el }: { el: Of<"button"> }) {
  return (
    <div className={cn("flex w-full", JUSTIFY[el.align ?? "left"])}>
      <Button href={el.href} variant={el.style ?? "fill"} size="lg">
        {el.label}
        {(el.style ?? "fill") === "fill" && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export function CardView({ el }: { el: Of<"card"> }) {
  const icon = mediaUrl(el.icon);
  const body = (
    <div className="relative flex h-full flex-col gap-4 rounded-lg border border-accent/50 bg-surface-dark/5 p-8 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]">
      <Glow className="-top-[7px] left-0 h-[25px] w-full" />
      {icon && <img src={icon} alt="" className="h-[50px] w-[50px]" />}
      <h3 className="font-display text-lg font-bold leading-6 text-white md:text-xl">{el.title}</h3>
      {el.description && <p className="text-sm leading-5 text-white">{el.description}</p>}
    </div>
  );
  if (!el.href) return body;
  return el.href.startsWith("/") ? (
    <LocaleLink href={el.href} className="block h-full">
      {body}
    </LocaleLink>
  ) : (
    <a href={el.href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {body}
    </a>
  );
}

export function SpacerView({ el }: { el: Of<"spacer"> }) {
  return <div aria-hidden className={SPACER[el.size ?? "md"]} />;
}

export function ElementView({ element }: { element: Element }) {
  switch (element.blockType) {
    case "badge":
      return <BadgeView el={element} />;
    case "heading":
      return <HeadingView el={element} />;
    case "paragraph":
      return <ParagraphView el={element} />;
    case "image":
      return <ImageView el={element} />;
    case "button":
      return <ButtonView el={element} />;
    case "card":
      return <CardView el={element} />;
    case "spacer":
      return <SpacerView el={element} />;
    default:
      return null;
  }
}
