import {
  BadgeCheck,
  Boxes,
  Coins,
  Compass,
  HandCoins,
  Handshake,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * Any glyph the landing page can render: every lucide icon satisfies this, and
 * so do the hand-drawn glyphs in `components/shared/gear-glyphs`.
 */
export type GearIcon = ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

/**
 * Landing page content: the static marketing copy, plus the shapes and
 * palette the API-driven sections (hero, categories, featured, community)
 * render into. Live data comes from `src/lib/landing-content.ts`.
 */

/** Palette slots reused across tiles so illustrations stay on-brand. */
export type GearTone = "sage" | "sun" | "sky" | "lime" | "orange" | "mist";

/**
 * Panel + badge classes per tone.
 *
 * Two rules keep these readable in both themes:
 * - `gear-*` and `mist` have dark-theme variants, so they pair with the themed
 *   `foreground` and flip along with the rest of the page.
 * - `lime` and `orange` are identical in both themes, so anything sitting on
 *   them carries `surface-accent`, which pins `ink`/`paper`/`pine` back to the
 *   brand values regardless of theme (the same trick the brand mark uses).
 */
export const toneStyles: Record<GearTone, { panel: string; badge: string }> = {
  sage: {
    panel: "bg-gear-sage text-foreground",
    badge: "surface-accent bg-pine text-lime",
  },
  sun: {
    panel: "bg-gear-sun text-foreground",
    badge: "surface-accent bg-ink text-gear-sun",
  },
  sky: {
    panel: "bg-gear-sky text-foreground",
    badge: "surface-accent bg-ink text-gear-sky",
  },
  lime: {
    panel: "surface-accent bg-lime text-ink",
    badge: "surface-accent bg-ink text-lime",
  },
  orange: {
    panel: "surface-accent bg-orange text-ink",
    badge: "surface-accent bg-ink text-orange",
  },
  mist: {
    panel: "bg-mist text-foreground",
    badge: "surface-accent bg-pine text-paper",
  },
};

/** Category tile, built from `GET /categories` plus a per-category listing count. */
export type CategoryTile = {
  name: string;
  description: string;
  itemCount: number;
  icon: GearIcon;
  tone: GearTone;
  href: string;
};

/** Listing card, built from a `GET /gear` row. */
export type RentalItem = {
  name: string;
  category: string;
  /** Already formatted in the configured currency, e.g. "$12". */
  price: string;
  providerName: string;
  available: boolean;
  /** Short stock note, e.g. "3 in stock". */
  availabilityNote: string;
  /** Trusted image URL, or null to fall back to the drawn icon panel. */
  imageUrl: string | null;
  icon: GearIcon;
  tone: GearTone;
  href: string;
};

/** Tones cycled across API-driven tiles, so neighbours never share a colour. */
export const toneCycle: readonly GearTone[] = [
  "sky",
  "lime",
  "sage",
  "sun",
  "orange",
  "mist",
];

/**
 * Where "List your item" goes. Guests sign up and continue to the new-listing
 * form; a signed-in provider is sent straight there (Proxy honours returnTo).
 */
export const LIST_ITEM_HREF = "/signup?returnTo=%2Fdashboard%2Fgear%2Fnew";

export type Step = {
  step: number;
  title: string;
  description: string;
  icon: GearIcon;
};

export const studentSteps: Step[] = [
  {
    step: 1,
    title: "Find",
    description: "Search for the item you need.",
    icon: Search,
  },
  {
    step: 2,
    title: "Choose",
    description: "Compare available items and providers.",
    icon: SlidersHorizontal,
  },
  {
    step: 3,
    title: "Rent",
    description: "Request and rent the item.",
    icon: Handshake,
  },
];

export const providerSteps: Step[] = [
  {
    step: 1,
    title: "List",
    description: "Add your item to Campus Gear.",
    icon: Send,
  },
  {
    step: 2,
    title: "Connect",
    description: "Students discover your listing.",
    icon: Compass,
  },
  {
    step: 3,
    title: "Earn",
    description: "Earn from items you already own.",
    icon: Coins,
  },
];

export type Feature = {
  title: string;
  description: string;
  icon: GearIcon;
};

export const whyCampusGear: Feature[] = [
  {
    title: "Affordable",
    description:
      "Rent instead of buying expensive items you only need temporarily.",
    icon: Wallet,
  },
  {
    title: "Campus Community",
    description: "Connect with people within your campus community.",
    icon: UserRound,
  },
  {
    title: "Wide Variety",
    description:
      "From camping kit and bikes to boards, paddles and fitness gear.",
    icon: Boxes,
  },
  {
    title: "Easy & Convenient",
    description: "Find and rent useful items without leaving campus.",
    icon: Sparkles,
  },
  {
    title: "Earn From Your Gear",
    description:
      "Turn unused items into something valuable for another student.",
    icon: HandCoins,
  },
];

export const communityPillars: Feature[] = [
  {
    title: "Owner-confirmed requests",
    description:
      "A rental starts as a request. The provider confirms the dates before anyone pays.",
    icon: BadgeCheck,
  },
  {
    title: "Known providers",
    description:
      "Every listing shows who owns it, so you know who you're meeting for the handover.",
    icon: UserRound,
  },
  {
    title: "Reviews from real rentals",
    description:
      "Only a renter who returned the item can review it, so every rating comes from a real handover.",
    icon: Star,
  },
  {
    title: "Secure Stripe checkout",
    description:
      "Payment happens on Stripe once the rental is confirmed. Campus Gear never sees your card.",
    icon: Wallet,
  },
];

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Browse Items", href: "/gear" },
      { label: "Categories", href: "/#categories" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Become a Provider", href: LIST_ITEM_HREF },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Rental Policy", href: "/rental-policy" },
    ],
  },
];

export const primaryNav = [
  { label: "Browse Items", href: "/gear" },
  { label: "Categories", href: "/#categories" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Become a Provider", href: LIST_ITEM_HREF },
];
