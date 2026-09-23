import type { ReactNode } from "react";
import Image from "next/image";

import { mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { LayoutSectionBlock as Data } from "@/types/cms";

import { ElementView } from "./elements";
import type { BlockProps } from "./types";

const COLUMNS = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 md:grid-cols-2",
  "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
} as const;
const GAP = { sm: "gap-4", md: "gap-8", lg: "gap-12" };
const PADDING = { sm: "py-10", md: "py-12.5 md:py-20", lg: "py-20 md:py-28" };
const WIDTH = { narrow: "max-w-[800px]", default: "max-w-[1269px]", wide: "max-w-[1440px]" };
const BACKGROUND = {
  dark: "bg-surface-dark",
  darker: "bg-[#020713]",
  gradient: "bg-[radial-gradient(120%_120%_at_50%_0%,rgba(24,102,239,0.35)_0%,rgba(5,4,13,1)_60%)]",
  image: "bg-surface-dark",
};

export const COLUMN_KEYS = ["column1", "column2", "column3", "column4"] as const;

/** Layout shell shared by the site renderer and the visual editor (which passes drop zones as columns). */
export function LayoutSectionView({ block, columns }: { block: Data; columns: ReactNode[] }) {
  const count = Number(block.columns ?? "2");
  const bgImage = block.background === "image" ? mediaUrl(block.backgroundImage) : undefined;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden px-6 lg:px-20",
        BACKGROUND[block.background ?? "dark"],
        PADDING[block.padding ?? "md"],
      )}
    >
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-surface-dark/60" />
        </>
      )}
      <div
        className={cn(
          "relative mx-auto grid w-full",
          WIDTH[block.width ?? "default"],
          COLUMNS[block.columns ?? "2"],
          GAP[block.gap ?? "md"],
          block.verticalAlign === "start" ? "items-start" : "items-center",
        )}
      >
        {columns.slice(0, count).map((column, i) => (
          <div key={i} className="flex min-w-0 flex-col gap-4">
            {column}
          </div>
        ))}
      </div>
    </section>
  );
}

export function LayoutSectionBlock({ block }: BlockProps<Data>) {
  const columns = COLUMN_KEYS.map((key) =>
    (block[key] ?? []).map((element, i) => <ElementView key={element.id ?? i} element={element} />),
  );
  return <LayoutSectionView block={block} columns={columns} />;
}
