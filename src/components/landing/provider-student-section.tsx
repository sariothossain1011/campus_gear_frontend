import { ArrowRight, HandCoins, Search } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

const sides = [
  {
    id: "students",
    icon: Search,
    kicker: "Students",
    title: "Need something?",
    description:
      "Don't buy it if you only need it for a while. Find it on Campus Gear and rent it from your campus community.",
    cta: { label: "Browse Items", href: "/gear" },
    surface: "bg-card text-foreground",
    kickerClass: "text-signal",
    badge: "surface-accent bg-pine text-lime",
    buttonVariant: "primary" as const,
  },
  {
    id: "providers",
    icon: HandCoins,
    kicker: "Providers",
    title: "Have something useful?",
    description:
      "Your unused gear could be exactly what another student is looking for. List it on Campus Gear and earn from it.",
    cta: { label: "List Your Item", href: "/list-your-item" },
    surface: "surface-inverse bg-pine text-paper",
    // Orange on pine lands at ~4:1, under the 4.5:1 floor for text this small;
    // gear-sun keeps the warm provider association and clears it comfortably.
    kickerClass: "text-gear-sun",
    badge: "surface-accent bg-orange text-ink",
    buttonVariant: "primary" as const,
  },
];

export function ProviderStudentSection() {
  return (
    <section
      id="for-providers"
      aria-labelledby="two-sided-heading"
      className="scroll-mt-24 border-y border-border/50 bg-background py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <h2 id="two-sided-heading" className="sr-only">
          Renting and listing on Campus Gear
        </h2>

        {/* gap-px over a tinted track draws the dividing seam between the two
            halves without adding a border that would double up on mobile. */}
        <div className="grid gap-px bg-border/50 md:grid-cols-2">
          {sides.map((side, index) => (
            <Reveal
              key={side.id}
              delay={index * 120}
              className={`flex flex-col p-8 sm:p-12 ${side.surface}`}
            >
              <span
                aria-hidden="true"
                className={`grid size-12 place-items-center ${side.badge}`}
              >
                <side.icon className="size-5" strokeWidth={2} />
              </span>

              <p
                className={`mt-8 font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] ${side.kickerClass}`}
              >
                {side.kicker}
              </p>
              <h3 className="mt-4 font-display text-[clamp(2.1rem,4.6vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
                {side.title}
              </h3>
              <p className="mt-5 max-w-md text-sm leading-6 text-foreground/70 sm:text-base sm:leading-7">
                {side.description}
              </p>

              <Button
                asChild
                variant={side.buttonVariant}
                size="xl"
                className="mt-9 self-start"
              >
                <Link href={side.cta.href}>
                  {side.cta.label}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
