import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLatestReview } from "@/lib/landing-content";
import { communityPillars } from "@/lib/landing-data";
import type { Review } from "@/lib/validations/types";
import { Star } from "lucide-react";
import Link from "next/link";

const reviewDate = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CG"
  );
}

/** The newest real review, as proof that the loop above actually happens. */
function LatestReview({ review }: { review: Review }) {
  const rating = Number(review.rating);
  const filled = Number.isFinite(rating) ? Math.round(rating) : 0;

  return (
    <figure className="border border-border/60 bg-card p-7 sm:p-9">
      <figcaption className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-foreground/45">
        Latest review
      </figcaption>

      <div className="mt-6 flex items-center gap-4 border-b border-border/50 pb-6">
        <span
          aria-hidden="true"
          className="surface-accent grid size-14 shrink-0 place-items-center bg-lime font-display text-2xl font-black text-ink"
        >
          {initialsOf(review.customer.name)}
        </span>
        <div className="min-w-0">
          <p className="font-display text-2xl font-black uppercase leading-none tracking-[-0.02em]">
            <Link
              href={`/gear/${review.gearItem.id}`}
              className="hover:text-signal"
            >
              {review.gearItem.name}
            </Link>
          </p>
          <p className="mt-1.5 truncate text-xs text-foreground/60">
            Reviewed {reviewDate.format(new Date(review.createdAt))}
          </p>
        </div>
      </div>

      <blockquote className="mt-7">
        <p className="flex items-center gap-3">
          <span aria-hidden="true" className="flex gap-1 text-orange">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`size-3.5 ${index < filled ? "fill-current" : "opacity-30"}`}
              />
            ))}
          </span>
          <span className="font-mono text-xs font-bold">
            {Number.isFinite(rating) ? rating.toFixed(1) : "—"}
            <span className="sr-only"> out of 5</span>
          </span>
        </p>
        <p className="mt-4 text-sm leading-6 text-foreground/75">
          {review.comment?.trim()
            ? `“${review.comment.trim()}”`
            : "Rated without a written comment."}
        </p>
        <footer className="mt-4 font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-foreground/50">
          {review.customer.name} — renter
        </footer>
      </blockquote>
    </figure>
  );
}

function ReviewPlaceholder({ message }: { message: string }) {
  return (
    <figure className="border border-dashed border-border bg-card p-7 sm:p-9">
      <figcaption className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-foreground/45">
        Latest review
      </figcaption>
      <p role="status" className="mt-6 text-sm leading-6 text-foreground/70">
        {message}
      </p>
    </figure>
  );
}

export async function CommunitySection() {
  const latest = await getLatestReview();

  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className="relative scroll-mt-24 overflow-hidden bg-background py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="topo-lines absolute inset-0 opacity-25"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
        <Reveal>
          <SectionHeading
            kicker="Trust, locally"
            title={
              <span id="community-heading">Built for campus communities</span>
            }
            lead="Campus Gear works because the person on the other side of a rental is someone nearby. Confirmation, payment and reviews are all built around that."
          />

          <ul className="mt-11 grid gap-8 sm:grid-cols-2">
            {communityPillars.map((pillar, index) => (
              <Reveal as="li" key={pillar.title} delay={index * 70}>
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center bg-pine text-lime"
                >
                  <pillar.icon className="size-4" strokeWidth={2} />
                </span>
                <h3 className="mt-4 font-display text-xl font-black uppercase leading-none tracking-[-0.02em]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-foreground/65">
                  {pillar.description}
                </p>
              </Reveal>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140}>
          {!latest.ok ? (
            <ReviewPlaceholder
              message={`Reviews couldn't be loaded right now. ${latest.message}`}
            />
          ) : latest.data ? (
            <LatestReview review={latest.data} />
          ) : (
            <ReviewPlaceholder message="No reviews yet. The first one appears here once a rental has been returned and rated." />
          )}
        </Reveal>
      </div>
    </section>
  );
}
