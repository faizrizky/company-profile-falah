import { CircleDollarSign, ClipboardList, Clock, UserX } from "lucide-react";

import { Glow, SectionTitle } from "@/components/common/section-ui";
import type { SolutionCategory } from "@/types/cms";

type ChallengeIcon = NonNullable<NonNullable<SolutionCategory["challenges"]>["items"]>[number]["icon"];

const ICONS: Record<ChallengeIcon, typeof Clock> = {
  downtime: Clock,
  cost: CircleDollarSign,
  error: UserX,
  inconsistent: ClipboardList,
};

export function ChallengesSection({ category }: { category: SolutionCategory }) {
  const challenges = category.challenges ?? {};
  if (!challenges.items?.length) return null;

  return (
    <section className="w-full bg-surface-dark px-6 pb-12.5 pt-25 md:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          eyebrow={challenges.eyebrow}
          title={challenges.title ?? ""}
          desc={challenges.description}
          className="max-w-[632px]"
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {challenges.items.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <div
                key={c.id ?? c.title}
                className="relative flex flex-col items-center justify-center gap-6 overflow-clip rounded-lg border border-accent/50 bg-surface-dark/5 p-10 text-center text-white backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]"
              >
                <Glow className="-top-2 left-1/2 h-[25px] w-[416px] -translate-x-1/2" />
                <Icon className="h-[50px] w-[50px] text-blue-bright" strokeWidth={1.75} />
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold leading-[30px]">{c.title}</h3>
                  {c.description && <p className="text-base leading-6">{c.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
