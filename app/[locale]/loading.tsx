import { PageSkeleton } from "@/components/skeleton/page-skeleton";

/** Shown (inside the navbar/footer layout) while a page renders. */
export default function Loading() {
  return <PageSkeleton label="Loading…" />;
}
