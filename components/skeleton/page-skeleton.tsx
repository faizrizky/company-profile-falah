/**
 * Placeholder for a site page while it loads: a hero (eyebrow, heading,
 * intro, buttons, partner strip) and one section of cards. Uses the same
 * container widths as the real blocks so nothing jumps when content arrives.
 */
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const Block = ({ className }: { className: string }) => <span className={`site-sk block ${className}`} aria-hidden />;

export function PageSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="min-h-screen">
      <span className="sr-only">{label}</span>

      <section className="relative px-6 pt-40 lg:px-page">
        <div className="flex min-h-[451px] flex-col items-start justify-center gap-6">
          <Block className="h-8 w-48 rounded-full" />
          <div className="flex w-full flex-col gap-3">
            <Block className="h-10 w-full max-w-[735px] rounded-xl md:h-14" />
            <Block className="h-10 w-4/5 max-w-[560px] rounded-xl md:h-14" />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Block className="h-4 w-full max-w-[684px] rounded-md" />
            <Block className="h-4 w-3/4 max-w-[520px] rounded-md" />
          </div>
          <div className="mt-2 flex gap-4">
            <Block className="h-12 w-48 rounded-lg" />
            <Block className="h-12 w-44 rounded-lg" />
          </div>
        </div>
        <div className="mt-[74px] flex gap-10 overflow-hidden">
          {range(7).map((i) => (
            <Block key={i} className="h-8 w-28 shrink-0 rounded-md" />
          ))}
        </div>
      </section>

      <section className="px-6 py-24 md:px-page">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6">
          <Block className="h-7 w-44 rounded-full" />
          <Block className="h-9 w-full max-w-[560px] rounded-xl" />
          <Block className="h-4 w-full max-w-[640px] rounded-md" />
          <div className="mt-6 grid w-full gap-6 md:grid-cols-3">
            {range(3).map((i) => (
              <Block key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
