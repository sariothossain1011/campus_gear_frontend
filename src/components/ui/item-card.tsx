import { Button } from "@/components/ui/button";
import { toneStyles, type RentalItem } from "@/lib/landing-data";
import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Listing card for the landing page. Shows the listing's own photo when it has
 * one from a trusted host, and otherwise the tinted, hatched icon panel — an
 * intentional illustration rather than a stand-in photo.
 */
export function ItemCard({ item }: { item: RentalItem }) {
  const {
    icon: Icon,
    name,
    category,
    price,
    providerName,
    available,
    availabilityNote,
    imageUrl,
    tone,
    href,
  } = item;

  return (
    <article className="edge-card group flex h-full flex-col border border-border/60 bg-card text-foreground hover:border-foreground">
      <div
        className={`relative grid h-44 place-items-center overflow-hidden border-b border-border/60 ${toneStyles[tone].panel}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <span
              aria-hidden="true"
              className="hatch absolute inset-0 opacity-70"
            />
            <Icon
              aria-hidden="true"
              className="relative size-16 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3"
              strokeWidth={1.5}
            />
          </>
        )}
        <span className="surface-accent gear-tag absolute left-0 top-0 bg-ink py-1.5 pl-3 pr-9 font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em] text-paper">
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-black uppercase leading-[0.95] tracking-[-0.02em]">
          <Link href={href} className="hover:text-signal">
            {name}
          </Link>
        </h3>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-foreground/60">
          <UserRound aria-hidden="true" className="size-3.5 shrink-0" />
          Listed by {providerName}
        </p>

        <p className="mt-2 flex items-center gap-2 text-xs">
          <span
            aria-hidden="true"
            className={`size-2 shrink-0 rounded-full ${available ? "bg-success" : "bg-signal"}`}
          />
          <span
            className={
              available
                ? "font-semibold text-success"
                : "font-semibold text-signal"
            }
          >
            {availabilityNote}
          </span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border/50 pt-5">
          <p className="font-display text-3xl font-black leading-none tracking-[-0.03em]">
            {price}
            <span className="ml-1 font-sans text-xs font-semibold tracking-normal text-foreground/55">
              / day
            </span>
          </p>
          <Button asChild variant="primary" size="sm">
            <Link href={href}>
              Rent now
              <span className="sr-only"> — {name}</span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
