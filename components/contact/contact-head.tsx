import { Lines } from "@/components/common/section-ui";

export function ContactHead({ pill, title, desc }: { pill?: string | null; title: string; desc?: string | null }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 px-6 md:w-[772px] md:px-0">
      {pill && (
        <span className="hidden w-fit items-center rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-sm font-medium leading-6 text-white backdrop-blur-[5px] md:inline-flex">
          {pill}
        </span>
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
