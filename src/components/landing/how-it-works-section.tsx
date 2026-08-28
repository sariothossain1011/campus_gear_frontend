import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { StepCard } from "../ui/step-card";
import { providerSteps, studentSteps } from "@/lib/landing-data";

const tracks = [
  {
    id: "students",
    label: "For Students",
    summary: "Get the thing you need for as long as you need it.",
    steps: studentSteps,
    variant: "student" as const,
    accent: "text-lime",
    cta: { label: "Browse Items", href: "/gear" },
  },
  {
    id: "providers",
    label: "For Providers",
    summary: "Put the gear sitting in your room to work.",
    steps: providerSteps,
    variant: "provider" as const,
    accent: "text-orange",
    cta: { label: "List Your Item", href: "/list-your-item" },
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="surface-inverse relative scroll-mt-24 overflow-hidden bg-background py-20 text-foreground sm:py-28"
    >
      <div aria-hidden="true" className="route-grid absolute inset-0 opacity-25" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            tone="inverse"
            kicker="How it works"
            title={
              <span id="how-it-works-heading">A marketplace with two sides</span>
            }
            lead="One community, two directions. Students find what they need; providers earn from what they already own."
          />
        </Reveal>

        <div className="mt-14 grid gap-px bg-border/40 lg:grid-cols-2">
          {tracks.map((track, index) => (
            <Reveal
              key={track.id}
              delay={index * 120}
              className="flex flex-col bg-background p-7 sm:p-10"
            >
              <p
                className={`font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] ${track.accent}`}
              >
                {track.label}
              </p>
              <h3 className="mt-4 font-display text-3xl font-black uppercase leading-none tracking-[-0.03em] sm:text-4xl">
                {track.summary}
              </h3>

              <ol className="mt-9 flex flex-col gap-7">
                {track.steps.map((step) => (
                  <StepCard key={step.title} item={step} variant={track.variant} />
                ))}
              </ol>

              <Button
                asChild
                variant={track.variant === "provider" ? "outline-accent" : "primary"}
                size="lg"
                className="mt-10 self-start"
              >
                <Link href={track.cta.href}>
                  {track.cta.label}
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