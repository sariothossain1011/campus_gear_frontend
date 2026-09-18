import {
  CricketBatGlyph,
  TennisRacketGlyph,
} from "@/components/shared/gear-glyphs";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { getFeaturedItems, getLandingStats } from "@/lib/landing-content";
import {
  LIST_ITEM_HREF,
  toneStyles,
  type GearIcon,
  type GearTone,
} from "@/lib/landing-data";
import { Bike, Compass, TentTree, Waves } from "lucide-react";
import Link from "next/link";

type HeroTile = {
  key: string;
  label: string;
  /** Formatted daily price; omitted on the fallback tiles. */
  price?: string;
  icon: GearIcon;
  tone: GearTone;
};

/** The slight off-axis tilt the brand mark uses, alternated per tile. */
const TILTS = [
  "-rotate-1",
  "rotate-1",
  "-rotate-2",
  "rotate-2",
  "-rotate-1",
  "rotate-1",
];

/**
 * Shown only when the catalog can't be reached: icons with no names or prices,
 * so the collage never advertises listings that don't exist.
 */
const FALLBACK_TILES: HeroTile[] = [
  { key: "tent", label: "Camping", icon: TentTree, tone: "sky" },
  { key: "bat", label: "Sport", icon: CricketBatGlyph, tone: "lime" },
  { key: "bike", label: "Cycling", icon: Bike, tone: "mist" },
  { key: "waves", label: "Water", icon: Waves, tone: "sage" },
  { key: "racket", label: "Court", icon: TennisRacketGlyph, tone: "orange" },
  { key: "compass", label: "Outdoors", icon: Compass, tone: "sun" },
];

export async function HeroSection() {
  const [stats, featured] = await Promise.all([
    getLandingStats(),
    getFeaturedItems(),
  ]);

  const liveTiles: HeroTile[] = featured.ok
    ? featured.data.map((item) => ({
        key: item.href,
        label: item.name,
        price: item.price,
        icon: item.icon,
        tone: item.tone,
      }))
    : [];
  const isLive = liveTiles.length >= 2;
  const tiles = isLive ? liveTiles : FALLBACK_TILES;
  // Two columns, the second offset for a staggered feel.
  const half = Math.ceil(tiles.length / 2);
  const columns = [tiles.slice(0, half), tiles.slice(half)];

  // Only real figures are shown; one that failed to load is left out.
  const heroStats = [
    stats.listings !== null && {
      value: stats.listings.toLocaleString("en"),
      label: "Items listed",
    },
    stats.categories !== null && {
      value: stats.categories.toLocaleString("en"),
      label: "Categories",
    },
    stats.fromPrice !== null && {
      value: stats.fromPrice,
      label: "Rentals from / day",
    },
  ].filter((stat) => stat !== false);

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
            Find, rent, and share the gear you need around campus — from tents
            and bikes to boards, paddles and fitness kit.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="primary" size="xl">
              <Link href="/gear">Browse Items</Link>
            </Button>
            <Button asChild variant="outline-accent" size="xl">
              <Link href={LIST_ITEM_HREF}>List Your Item</Link>
            </Button>
          </div>

          {heroStats.length > 0 ? (
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/15 pt-7">
              {heroStats.map((stat) => (
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
          ) : null}
        </Reveal>

        {/* Collage of the newest rentable listings. Decorative: the featured
            section below lists the same items as real, labelled links. */}
        <Reveal delay={120} className="relative">
          <div aria-hidden="true" className="grid grid-cols-2 gap-4 sm:gap-5">
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className={`flex flex-col gap-4 sm:gap-5 ${columnIndex === 1 ? "mt-6 sm:mt-10" : ""}`}
              >
                {column.map((tile, tileIndex) => (
                  <div
                    key={tile.key}
                    className={`edge-card flex min-h-28 flex-col justify-between border border-ink/20 p-4 transition-transform duration-500 hover:rotate-0 sm:min-h-36 sm:p-5 ${toneStyles[tile.tone].panel} ${TILTS[(columnIndex * half + tileIndex) % TILTS.length]}`}
                  >
                    <tile.icon
                      className="size-9 sm:size-11"
                      strokeWidth={1.5}
                    />
                    <div className="mt-5">
                      <p className="line-clamp-2 font-display text-base font-black uppercase leading-none tracking-[-0.02em] sm:text-lg">
                        {tile.label}
                      </p>
                      {tile.price ? (
                        <p className="mt-1.5 font-mono text-[0.6rem] font-bold tracking-[0.1em]">
                          {tile.price} / day
                        </p>
                      ) : null}
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
            <span className="size-2 bg-lime" />
            {isLive ? "Fresh from the catalog" : "Campus gear, by the day"}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
