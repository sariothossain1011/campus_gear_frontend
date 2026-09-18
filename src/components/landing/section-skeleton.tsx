type SectionSkeletonProps = {
  label: string;
  /** Number of placeholder cards in the grid. */
  cards?: number;
  cardClassName?: string;
};

/** Holds a data-driven landing section's space while its data streams in. */
export function SectionSkeleton({
  label,
  cards = 6,
  cardClassName = "h-72",
}: SectionSkeletonProps) {
  return (
    <section
      aria-busy="true"
      aria-label={label}
      className="border-t border-border/50 bg-background py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl animate-pulse px-5 sm:px-8">
        <div className="h-3 w-40 bg-foreground/10" />
        <div className="mt-5 h-12 w-full max-w-lg bg-foreground/10" />
        <div className="mt-4 h-4 w-full max-w-md bg-foreground/10" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }, (_, index) => (
            <div
              key={index}
              className={`border border-border/40 bg-foreground/5 ${cardClassName}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
