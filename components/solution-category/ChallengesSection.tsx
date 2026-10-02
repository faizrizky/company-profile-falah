import { SectionTitle } from "@/components/common/section-ui";
import { Card } from "@/components/ui/card";
import type { SolutionCategory } from "@/types/cms";

type ChallengeIcon = NonNullable<NonNullable<SolutionCategory["challenges"]>["items"]>[number]["icon"];

/** Figma "The Challenges_b" icons (public/solution/challenges). */
const ICONS: Record<ChallengeIcon, string> = {
  downtime: "/solution/challenges/downtime.svg",
  cost: "/solution/challenges/cost.svg",
  error: "/solution/challenges/error.svg",
  inconsistent: "/solution/challenges/inconsistent.svg",
};

export function ChallengesSection({ category }: { category: SolutionCategory }) {
  const challenges = category.challenges ?? {};
  if (!challenges.items?.length) return null;

  return (
    <section className="w-full bg-surface-dark px-6 pb-12.5 pt-25 md:px-page">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          eyebrow={challenges.eyebrow}
          title={challenges.title ?? ""}
          desc={challenges.description}
          className="max-w-[632px]"
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {challenges.items.map((c) => {
            return (
              <Card
                key={c.id ?? c.title}
                // Figma Card_b: no lift; hover only tints the card.
                className="flex flex-col items-center justify-center gap-6 overflow-clip p-10 text-center text-white"
              >
                <div className="flex h-[52px] items-center justify-center">
                  <img src={ICONS[c.icon]} alt="" className="h-[50px] w-[50px]" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold leading-[30px]">{c.title}</h3>
                  {c.description && <p className="text-base leading-6">{c.description}</p>}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
