import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="surface-warm relative overflow-hidden bg-background text-foreground"
    >
      <div
        aria-hidden="true"
        className="dot-field absolute inset-0 text-ink opacity-40"
      />

      <Reveal className="relative mx-auto w-full max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ink/70">
          Campus Gear
        </p>

        <h2
          id="cta-heading"
          className="mt-6 font-display text-[clamp(2.3rem,7vw,5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-balance"
        >
          Got gear? Need gear?
          <span className="block">Campus Gear has you covered.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-ink/75">
          Rent what you need. Share what you have. Make campus life easier.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="primary" size="xl">
            <Link href="/gear">
              Browse Items
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href="/list-your-item">Start Listing</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
