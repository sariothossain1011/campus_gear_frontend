import {
  CricketBatGlyph,
  TennisRacketGlyph,
} from "@/components/shared/gear-glyphs";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import {
  formatTaka,
  toneStyles,
  type GearIcon,
  type GearTone,
} from "@/lib/landing-data";
import {
  Calculator,
  Headphones,
  Laptop,
  MapPin,
  Volleyball,
} from "lucide-react";
import Link from "next/link";

type HeroTile = {
  label: string;
  price: number;
  icon: GearIcon;
  tone: GearTone;
  /** The slight off-axis tilt the brand mark uses, alternated per tile. */
  tilt: string;
};

const heroTiles: HeroTile[] = [
  { label: "Laptop", price: 500, icon: Laptop, tone: "sky", tilt: "-rotate-1" },
  {
    label: "Cricket Bat",
    price: 100,
    icon: CricketBatGlyph,
    tone: "lime",
    tilt: "rotate-1",
  },
  {
    label: "Headphones",
    price: 220,
    icon: Headphones,
    tone: "mist",
    tilt: "-rotate-2",
  },
  {
    label: "Calculator",
    price: 40,
    icon: Calculator,
    tone: "sage",
    tilt: "rotate-2",
  },
  {
    label: "Football",
    price: 60,
    icon: Volleyball,
    tone: "orange",
    tilt: "-rotate-1",
  },
  {
    label: "Tennis Racket",
    price: 80,
    icon: TennisRacketGlyph,
    tone: "sun",
    tilt: "rotate-1",
  },
];

/** Split into two columns so the second can be offset for a staggered feel. */
const heroColumns = [heroTiles.slice(0, 3), heroTiles.slice(3)];

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden="true"
        className="topo-lines absolute inset-0 opacity-30"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-signal">
            <span aria-hidden="true" className="size-2 bg-orange" />
            Peer-to-peer campus rentals
          </p>

          <h1
            id="hero-heading"
            className="mt-6 font-display text-[clamp(2.55rem,8.4vw,5.6rem)] font-black uppercase leading-[0.86] tracking-[-0.05em] text-balance"
          >
            Rent what you need.
            <span className="mt-1 block text-signal">
              Campus life made easier.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-ink/70">
            Find, rent, and share the things you need around campus — from
            calculators and laptops to cricket bats and footballs.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="primary" size="xl">
              <Link href="/gear">Browse Items</Link>
            </Button>
            <Button asChild variant="outline-accent" size="xl">
              <Link href="/list-your-item">List Your Item</Link>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/15 pt-7">
            {[
              { value: "430+", label: "Items listed" },
              { value: "12", label: "Campuses" },
              { value: "৳40", label: "Rentals from" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-black leading-none tracking-[-0.03em] sm:text-4xl">
                    {stat.value}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-2 block font-mono text-[0.6rem] font-bold uppercase leading-4 tracking-[0.16em] text-ink/55"
                  >
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Decorative catalogue collage: it restates the item examples already
            written in the copy above, so it carries no unique information. */}
        <Reveal delay={120} className="relative">
          <div aria-hidden="true" className="grid grid-cols-2 gap-4 sm:gap-5">
            {heroColumns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className={`flex flex-col gap-4 sm:gap-5 ${columnIndex === 1 ? "mt-6 sm:mt-10" : ""}`}
              >
                {column.map((tile) => (
                  <div
                    key={tile.label}
                    className={`edge-card flex min-h-28 flex-col justify-between border border-ink/20 p-4 transition-transform duration-500 hover:rotate-0 sm:min-h-36 sm:p-5 ${toneStyles[tile.tone].panel} ${tile.tilt}`}
                  >
                    <tile.icon
                      className="size-9 sm:size-11"
                      strokeWidth={1.5}
                    />
                    <div className="mt-5">
                      <p className="font-display text-base font-black uppercase leading-none tracking-[-0.02em] sm:text-lg">
                        {tile.label}
                      </p>
                      <p className="mt-1.5 font-mono text-[0.6rem] font-bold tracking-[0.1em]">
                        {formatTaka(tile.price)} / day
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p
            aria-hidden="true"
            className="surface-accent gear-tag mt-5 inline-flex items-center gap-2 bg-ink py-2.5 pl-4 pr-11 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-lime"
          >
            <MapPin className="size-3.5" />
            Southeast University
          </p>
        </Reveal>
      </div>
    </section>
  );
}
