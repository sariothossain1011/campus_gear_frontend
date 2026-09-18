import type { LucideIcon } from "lucide-react";
import {
  Backpack,
  Bike,
  Dumbbell,
  Footprints,
  Mountain,
  PackageOpen,
  Snowflake,
  TentTree,
  Waves,
} from "lucide-react";

import type { DecimalValue } from "@/lib/validations/types";

/**
 * Display helpers shared by the public catalog and the landing page, so a
 * listing looks and prices the same wherever it appears.
 */

/**
 * Prices are shown in `CAMPUS_GEAR_CURRENCY` — keep it equal to the backend's
 * `STRIPE_CURRENCY` (USD by default) so shown prices match what is charged.
 * Server-only env: in client components this falls back to USD.
 */
export function formatGearPrice(price: DecimalValue) {
  const numericPrice = Number(price);
  const configuredCurrency =
    process.env.CAMPUS_GEAR_CURRENCY?.trim().toUpperCase();
  const currency = configuredCurrency?.match(/^[A-Z]{3}$/)
    ? configuredCurrency
    : "USD";

  if (!Number.isFinite(numericPrice)) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: numericPrice % 1 === 0 ? 0 : 2,
  }).format(numericPrice);
}

const ICON_RULES: readonly [RegExp, LucideIcon][] = [
  [/cycl|bike/, Bike],
  [/camp|tent/, TentTree],
  [/hik|trek|backpack|travel/, Backpack],
  [/climb|mountain/, Mountain],
  [/water|kayak|paddl|surf|swim/, Waves],
  [/winter|ski|snow/, Snowflake],
  [/run|athlet/, Footprints],
  [/sport|fitness|strength|skate/, Dumbbell],
];

/** Icon for a listing or category, matched on its name — the API has no icons. */
export function gearIconFor(descriptor: string): LucideIcon {
  const text = descriptor.toLowerCase();
  return ICON_RULES.find(([pattern]) => pattern.test(text))?.[1] ?? PackageOpen;
}

/**
 * Hosts gear images may be rendered from; must match `images.remotePatterns`
 * in next.config.ts. Cloudinary serves uploads, Unsplash the seeded demo data.
 */
const TRUSTED_IMAGE_HOSTS = new Set([
  "res.cloudinary.com",
  "images.unsplash.com",
]);

export function getTrustedGearImageUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !TRUSTED_IMAGE_HOSTS.has(url.hostname)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
