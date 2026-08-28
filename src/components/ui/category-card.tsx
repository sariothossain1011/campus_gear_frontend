import { toneStyles, type Category } from "@/lib/landing-data";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Category tile. The whole card is one link target — the arrow is decorative,
 * so there is a single tab stop and a single accessible name per card.
 */
export function CategoryCard({ category }: { category: Category }) {
  const { icon: Icon, name, description, itemCount, tone, href } = category;

  return (
    <Link
      href={href}
      className="edge-card group flex h-full flex-col border border-border/60 bg-card p-6 text-foreground hover:border-foreground sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className={`grid size-12 shrink-0 place-items-center transition-transform duration-300 group-hover:-rotate-6 ${toneStyles[tone].badge}`}
        >
          <Icon className="size-5" strokeWidth={2} />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 shrink-0 text-foreground/35 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
        />
      </div>

      <h3 className="mt-6 font-display text-2xl font-black uppercase leading-none tracking-[-0.02em]">
        {name}
      </h3>
      <p className="mt-3 text-sm leading-6 text-foreground/65">{description}</p>

      <p className="mt-auto pt-6 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-foreground/50">
        {itemCount} listings
      </p>
    </Link>
  );
}
