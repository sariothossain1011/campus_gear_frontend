import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { communityPillars } from "@/lib/landing-data";
import { Star } from "lucide-react";

/** Sample of the provider detail a listing page surfaces. Illustrative only. */
const sampleProvider = {
  name: "Nusrat R.",
  department: "CSE, Southeast University",
  listings: 6,
  rating: 4.9,
  reviews: 23,
  quote:
    "Picked up the calculator between classes. Handed it back the same week — easiest exam prep I've had.",
  reviewer: "Tanvir H.",
};

export function CommunitySection() {
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
            lead="Campus Gear works because the person on the other side of a rental is someone from your campus. Listings, profiles and reviews are all organised around that."
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

        {/* Illustrative preview of a provider profile — labelled as a sample so
            it is not read as a live listing or a testimonial we can't back. */}
        <Reveal delay={140}>
          <figure className="border border-border/60 bg-card p-7 sm:p-9">
            <figcaption className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-foreground/45">
              Sample provider profile
            </figcaption>

            <div className="mt-6 flex items-center gap-4 border-b border-border/50 pb-6">
              <span
                aria-hidden="true"
                className="surface-accent grid size-14 shrink-0 place-items-center bg-lime font-display text-2xl font-black text-ink"
              >
                NR
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-black uppercase leading-none tracking-[-0.02em]">
                  {sampleProvider.name}
                </p>
                <p className="mt-1.5 truncate text-xs text-foreground/60">
                  {sampleProvider.department}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <dt className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em] text-foreground/50">
                  Active listings
                </dt>
                <dd className="mt-2 font-display text-3xl font-black leading-none tracking-[-0.03em]">
                  {sampleProvider.listings}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em] text-foreground/50">
                  Rating
                </dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black leading-none tracking-[-0.03em]">
                    {sampleProvider.rating}
                  </span>
                  <span className="text-xs text-foreground/55">
                    ({sampleProvider.reviews} reviews)
                  </span>
                </dd>
              </div>
            </dl>

            <blockquote className="mt-7 border-t border-border/50 pt-6">
              <p aria-hidden="true" className="flex gap-1 text-orange">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-3.5 fill-current" />
                ))}
              </p>
              <p className="mt-4 text-sm leading-6 text-foreground/75">
                “{sampleProvider.quote}”
              </p>
              <footer className="mt-4 font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-foreground/50">
                {sampleProvider.reviewer} — renter
              </footer>
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
