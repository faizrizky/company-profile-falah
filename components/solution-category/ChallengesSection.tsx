import { Clock, Coins, Shuffle, UserX } from "lucide-react";

import { Lines } from "@/components/common/section-ui";
import type { SolutionCategory } from "@/types/cms";

import { pill } from "./pill";

type ChallengeIcon = NonNullable<NonNullable<SolutionCategory["challenges"]>["items"]>[number]["icon"];

const ICONS: Record<ChallengeIcon, typeof Clock> = {
  downtime: Clock,
  cost: Coins,
  error: UserX,
  inconsistent: Shuffle,
};

export function ChallengesSection({ category }: { category: SolutionCategory }) {
  const challenges = category.challenges ?? {};
  if (!challenges.items?.length) return null;

  return (
    <section className="w-full bg-surface-dark px-6 pb-14 pt-20 md:px-20 md:pt-24">
      <div className="mx-auto flex w-full max-w-[1279px] flex-col gap-8">
        {challenges.eyebrow && <span className={pill}>{challenges.eyebrow}</span>}
        {challenges.title && (
          <h2 className="max-w-[1279px] font-display text-[26px] font-bold leading-tight text-text-accent md:text-[30px]">
            <Lines text={challenges.title} />
          </h2>
        )}
        {challenges.description && (
          <p className="max-w-[788px] text-[15px] leading-relaxed text-white md:text-base">{challenges.description}</p>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {challenges.items.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <div
                key={c.id ?? c.title}
                className="rounded-lg border border-text-accent/30 bg-surface-dark/5 p-8 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]"
              >
                <Icon className="h-[50px] w-[50px] text-text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-xl font-bold text-white">{c.title}</h3>
                {c.description && <p className="mt-2 text-[15px] leading-relaxed text-white/80">{c.description}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
