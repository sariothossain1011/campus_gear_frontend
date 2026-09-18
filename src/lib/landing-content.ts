import "server-only";

import {
  formatGearPrice,
  gearIconFor,
  getTrustedGearImageUrl,
} from "@/lib/gear-display";
import {
  toneCycle,
  type CategoryTile,
  type RentalItem,
} from "@/lib/landing-data";
import type { Review } from "@/lib/validations/types";
import { listCategories } from "@/services/categories";
import { getGearPriceRange, listGear } from "@/services/gear";
import { listReviews } from "@/services/reviews";

/**
 * Live data for the landing page, shaped for its sections. Every public read
 * is cached briefly by the services (`revalidate: 60`), and identical fetches
 * made by several sections in one render are deduplicated by Next.js.
 *
 * Failures come back as `null` / `{ ok: false }` so each section can say the
 * data is unavailable — never fall back to made-up listings or numbers.
 */

export type LandingResult<T> =
  { ok: true; data: T } | { ok: false; message: string };

const FEATURED_LIMIT = 6;
const CATEGORY_LIMIT = 6;

export type LandingStats = {
  listings: number | null;
  categories: number | null;
  /** Cheapest daily price in the catalog, formatted. */
  fromPrice: string | null;
};

export async function getLandingStats(): Promise<LandingStats> {
  const [gear, categories, priceRange] = await Promise.all([
    listGear({ limit: 1 }),
    listCategories(),
    getGearPriceRange(),
  ]);

  const minPrice = priceRange.ok ? priceRange.data.minPrice : null;

  return {
    listings: gear.ok ? (gear.meta?.total ?? null) : null,
    categories: categories.ok ? categories.data.length : null,
    fromPrice: minPrice === null ? null : formatGearPrice(minPrice),
  };
}

/** Newest listings that can be rented right now. */
export async function getFeaturedItems(): Promise<LandingResult<RentalItem[]>> {
  const result = await listGear({
    isAvailable: true,
    inStock: true,
    limit: FEATURED_LIMIT,
  });

  if (!result.ok) return { ok: false, message: result.error.message };

  return {
    ok: true,
    data: result.data.map((gear, index) => ({
      name: gear.name,
      category: gear.category.name,
      price: formatGearPrice(gear.pricePerDay),
      providerName: gear.provider.name,
      available: gear.isAvailable && gear.stock > 0,
      availabilityNote:
        gear.stock === 1 ? "Last one in stock" : `${gear.stock} in stock`,
      imageUrl: getTrustedGearImageUrl(gear.imageUrls[0] ?? gear.imageUrl),
      icon: gearIconFor(`${gear.category.name} ${gear.name}`),
      tone: toneCycle[index % toneCycle.length],
      href: `/gear/${gear.id}`,
    })),
  };
}

/** Short blurbs for the categories the backend is known to carry. */
const CATEGORY_BLURBS: readonly [RegExp, string][] = [
  [/camp|tent/, "Tents, sleeping bags, stoves and everything for a night out."],
  [/hik|trek/, "Packs, poles and trail kit for day hikes and longer treks."],
  // Before the climbing rule, which would otherwise claim "Mountain Biking".
  [/mountain bik/, "Trail bikes and protective gear for rougher rides."],
  [
    /climb|mountain/,
    "Harnesses, ropes and protection for crag and mountain days.",
  ],
  [
    /cycl|bike/,
    "Bikes, helmets and accessories for getting around and beyond.",
  ],
  [/kayak|paddl/, "Kayaks, paddles and buoyancy aids for calm water trips."],
  [/surf/, "Boards, wetsuits and leashes for a session at the beach."],
  [/swim/, "Goggles, fins and training aids for pool and open water."],
  [/water/, "Kit for getting on, in and under the water."],
  [/winter|ski|snow/, "Skis, boards and layers for cold-weather trips."],
  [/run|athlet/, "Training and race-day gear for runners and athletes."],
  [
    /strength|fitness/,
    "Weights and training equipment for working out anywhere.",
  ],
  [/skate/, "Boards and pads for the skate park and campus paths."],
  [/backpack|travel/, "Bags and travel essentials for trips away."],
];

function categoryBlurb(name: string) {
  const text = name.toLowerCase();
  return (
    CATEGORY_BLURBS.find(([pattern]) => pattern.test(text))?.[1] ??
    `Browse ${name.toLowerCase()} gear listed by providers near you.`
  );
}

/**
 * The best-stocked categories. The API has no per-category count, so each is
 * the `meta.total` of a one-row, category-filtered list — cheap, and cached.
 */
export async function getCategoryTiles(): Promise<
  LandingResult<{ tiles: CategoryTile[]; totalCategories: number }>
> {
  const categories = await listCategories();
  if (!categories.ok) return { ok: false, message: categories.error.message };

  const counted = await Promise.all(
    categories.data.map(async (category) => {
      const listings = await listGear({ category: category.id, limit: 1 });
      return { category, count: listings.ok ? (listings.meta?.total ?? 0) : 0 };
    }),
  );

  const tiles = counted
    .filter(({ count }) => count > 0)
    .sort(
      (a, b) =>
        b.count - a.count || a.category.name.localeCompare(b.category.name),
    )
    .slice(0, CATEGORY_LIMIT)
    .map(({ category, count }, index) => ({
      name: category.name,
      description: categoryBlurb(category.name),
      itemCount: count,
      icon: gearIconFor(category.name),
      tone: toneCycle[index % toneCycle.length],
      href: `/gear?category=${encodeURIComponent(category.id)}`,
    }));

  return { ok: true, data: { tiles, totalCategories: categories.data.length } };
}

/** The most recent review that has something to say. */
export async function getLatestReview(): Promise<LandingResult<Review | null>> {
  const result = await listReviews({ limit: 10 });
  if (!result.ok) return { ok: false, message: result.error.message };

  return {
    ok: true,
    data:
      result.data.find((review) => review.comment?.trim()) ??
      result.data[0] ??
      null,
  };
}
