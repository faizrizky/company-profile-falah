import { Lines } from "@/components/common/section-ui";
import { Pill } from "@/components/ui/pill";

export function ContactHead({ pill, title, desc }: { pill?: string | null; title: string; desc?: string | null }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 px-6 md:w-[772px] md:px-0">
      {pill && (
        <Pill className="hidden font-medium md:inline-flex">
          {pill}
        </Pill>
      )}
      <div className="flex flex-col gap-4 md:gap-1 md:text-center">
        <h2 className="font-display text-[20px] font-bold leading-6 text-accent md:text-[30px] md:leading-9">
          <Lines text={title} />
        </h2>
        {desc && <p className="text-sm leading-5 text-white md:text-base md:leading-6">{desc}</p>}
      </div>
    </div>
  );
}
