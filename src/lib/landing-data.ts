import { CricketBatGlyph } from "@/components/shared/gear-glyphs";
import {
  BadgeCheck,
  Boxes,
  Calculator,
  Camera,
  Coins,
  Compass,
  Gamepad2,
  HandCoins,
  Handshake,
  Headphones,
  Laptop,
  MapPin,
  MessageSquare,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tent,
  UserRound,
  Volleyball,
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
 * Static marketing content for the landing page. Kept in one module so every
 * section renders from a typed array instead of duplicating markup, and so the
 * copy can be swapped for real API data later without touching layout code.
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

export type Category = {
  name: string;
  description: string;
  itemCount: number;
  icon: GearIcon;
  tone: GearTone;
  href: string;
};

export const categories: Category[] = [
  {
    name: "Electronics",
    description: "Laptops, headphones, projectors, power banks & more",
    itemCount: 128,
    icon: Laptop,
    tone: "sky",
    href: "/gear/electronics",
  },
  {
    name: "Study & Academic",
    description: "Calculators, reference books, lab kits & drafting tools",
    itemCount: 94,
    icon: Calculator,
    tone: "sage",
    href: "/gear/study-academic",
  },
  {
    name: "Sports",
    description: "Cricket bats, footballs, tennis rackets & more",
    itemCount: 76,
    icon: Volleyball,
    tone: "lime",
    href: "/gear/sports",
  },
  {
    name: "Entertainment",
    description: "Carrom boards, board games, controllers & speakers",
    itemCount: 41,
    icon: Gamepad2,
    tone: "sun",
    href: "/gear/entertainment",
  },
  {
    name: "Photography",
    description: "DSLRs, tripods, gimbals & lighting for club shoots",
    itemCount: 33,
    icon: Camera,
    tone: "orange",
    href: "/gear/photography",
  },
  {
    name: "Campus Essentials",
    description: "Trolley bags, tents, ironing boards & dorm extras",
    itemCount: 58,
    icon: Tent,
    tone: "mist",
    href: "/gear/campus-essentials",
  },
];

export type RentalItem = {
  name: string;
  category: string;
  pricePerDay: number;
  /** Shown next to the price, e.g. "day" renders as "৳500 / day". */
  period: string;
  rating: number;
  reviewCount: number;
  campus: string;
  available: boolean;
  /** Free-text availability note, e.g. next free date when booked out. */
  availabilityNote: string;
  icon: GearIcon;
  tone: GearTone;
  href: string;
};

/** Bengali taka, formatted the way listings read on campus: ৳500 / day. */
export function formatTaka(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export const featuredItems: RentalItem[] = [
  {
    name: "MacBook Air M1",
    category: "Electronics",
    pricePerDay: 500,
    period: "day",
    rating: 4.9,
    reviewCount: 32,
    campus: "Southeast University",
    available: true,
    availabilityNote: "Available today",
    icon: Laptop,
    tone: "sky",
    href: "/gear/macbook-air-m1",
  },
  {
    name: "Cricket Bat — English Willow",
    category: "Sports",
    pricePerDay: 100,
    period: "day",
    rating: 4.8,
    reviewCount: 47,
    campus: "Southeast University",
    available: true,
    availabilityNote: "Available today",
    icon: CricketBatGlyph,
    tone: "lime",
    href: "/gear/cricket-bat-english-willow",
  },
  {
    name: "Scientific Calculator",
    category: "Study & Academic",
    pricePerDay: 40,
    period: "day",
    rating: 4.9,
    reviewCount: 61,
    campus: "Southeast University",
    available: true,
    availabilityNote: "Available today",
    icon: Calculator,
    tone: "sage",
    href: "/gear/scientific-calculator",
  },
  {
    name: "Canon EOS 200D DSLR",
    category: "Photography",
    pricePerDay: 750,
    period: "day",
    rating: 4.7,
    reviewCount: 18,
    campus: "North South University",
    available: false,
    availabilityNote: "Next free Thu",
    icon: Camera,
    tone: "orange",
    href: "/gear/canon-eos-200d",
  },
  {
    name: "Sony WH-1000XM4",
    category: "Electronics",
    pricePerDay: 220,
    period: "day",
    rating: 4.8,
    reviewCount: 26,
    campus: "BRAC University",
    available: true,
    availabilityNote: "Available today",
    icon: Headphones,
    tone: "mist",
    href: "/gear/sony-wh-1000xm4",
  },
  {
    name: "Carrom Board (Full Size)",
    category: "Entertainment",
    pricePerDay: 150,
    period: "day",
    rating: 4.6,
    reviewCount: 22,
    campus: "Southeast University",
    available: true,
    availabilityNote: "2 left this week",
    icon: Gamepad2,
    tone: "sun",
    href: "/gear/carrom-board",
  },
];

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
    description: "Find everything from academic tools to sports equipment.",
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
    title: "Campus-based listings",
    description:
      "Every listing is tied to a campus, so browsing starts with the gear closest to you.",
    icon: MapPin,
  },
  {
    title: "Provider profiles",
    description:
      "See who owns the item, what else they list, and how long they have been renting.",
    icon: BadgeCheck,
  },
  {
    title: "Ratings and reviews",
    description:
      "Renters rate the item and the handover, so the next student knows what to expect.",
    icon: Star,
  },
  {
    title: "Direct messaging",
    description:
      "Agree on pickup time and place with the provider before you confirm a request.",
    icon: MessageSquare,
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
      { label: "Become a Provider", href: "/list-your-item" },
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
  { label: "Become a Provider", href: "/list-your-item" },
];
