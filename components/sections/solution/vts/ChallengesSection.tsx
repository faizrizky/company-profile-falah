import { Clock, Coins, Shuffle, UserX } from "lucide-react";
import { pill } from "@/components/sections/solution/vts/pill";
import { getCategoryDetailBySlug } from "@/lib/category";
import type { CategoryChallengeIcon } from "@/types/category";

const ICONS: Record<CategoryChallengeIcon, typeof Clock> = {
  downtime: Clock,
  cost: Coins,
  error: UserX,
  inconsistent: Shuffle,
};

export function ChallengesSection({ categorySlug }: { categorySlug: string }) {
  const detail = getCategoryDetailBySlug(categorySlug);
  if (!detail) return null;
  const challenges = detail.challenges;
  return (
    <section className="w-full bg-surface-dark px-6 pb-14 pt-20 md:px-20 md:pt-24">
      <div className="mx-auto flex w-full max-w-[1279px] flex-col gap-8">
        <span className={pill}>The Challenges</span>
        <h2 className="max-w-[1279px] font-display text-[26px] font-bold leading-tight text-text-accent md:text-[30px]">
          Common challenges that impact readiness &amp; mission effectiveness
        </h2>
        <p className="max-w-[788px] text-[15px] leading-relaxed text-white md:text-base">
          Modern operational environment demand more than traditional training methods. These
          challenges can limit performance, increase cost, &amp; introduce unnecessary risk.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {challenges.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <div
                key={c.title}
                className="rounded-lg border border-text-accent/30 bg-surface-dark/5 p-8 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]"
              >
                <Icon className="h-[50px] w-[50px] text-text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-xl font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/80">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
