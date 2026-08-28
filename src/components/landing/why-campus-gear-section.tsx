import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyCampusGear } from "@/lib/landing-data";

export function WhyCampusGearSection() {
  const [lead, ...rest] = whyCampusGear;
  const LeadIcon = lead.icon;

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="scroll-mt-24 bg-background py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            kicker="The case for renting"
            title={<span id="why-heading">Why Campus Gear?</span>}
            lead="Buying is expensive and slow. Borrowing from someone on your campus is neither."
          />
        </Reveal>

        {/* The first benefit gets a full-height feature panel; the rest sit in
            a matched grid so the section reads as one system, not five tiles. */}
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal as="li" className="lg:row-span-2">
            <article className="surface-accent edge-card flex h-full flex-col justify-between border border-border/60 bg-pine p-7 text-paper sm:p-9">
              <span
                aria-hidden="true"
                className="dot-field grid size-16 place-items-center bg-lime text-ink"
              >
                <LeadIcon className="size-7" strokeWidth={1.75} />
              </span>
              <div className="mt-20 sm:mt-0">
                <h3 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-5xl">
                  {lead.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-6 text-paper/70 sm:text-base sm:leading-7">
                  {lead.description}
                </p>
                <p className="mt-8 border-t border-paper/20 pt-5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-lime">
                  A ৳40 calculator beats a ৳2,400 one
                </p>
              </div>
            </article>
          </Reveal>

          {rest.map((feature, index) => (
            <Reveal as="li" key={feature.title} delay={(index + 1) * 70}>
              <article className="edge-card flex h-full flex-col border border-border/60 bg-card p-6 sm:p-7">
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center bg-pine text-lime"
                >
                  <feature.icon className="size-5" strokeWidth={2} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-black uppercase leading-none tracking-[-0.02em]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-foreground/65">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}