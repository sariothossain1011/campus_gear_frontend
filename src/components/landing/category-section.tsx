import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategoryTiles } from "@/lib/landing-content";
import { LIST_ITEM_HREF } from "@/lib/landing-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { LandingNotice } from "./landing-notice";

export async function CategorySection() {
  const result = await getCategoryTiles();
  const tiles = result.ok ? result.data.tiles : [];

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="scroll-mt-24 border-t border-border/50 bg-background py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker="Browse by category"
            title={
              <span id="categories-heading">
                Everything you need, just around you
              </span>
            }
            lead={
              result.ok && result.data.totalCategories > 0
                ? `${result.data.totalCategories} shelves of gear, listed by people a short walk away. These are the best stocked right now.`
                : "Shelves of gear, listed by people a short walk away."
            }
          />
          <Button
            asChild
            variant="outline"
            size="lg"
            className="self-start md:self-end"
          >
            <Link href="/gear">
              All categories
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>

        {!result.ok ? (
          <LandingNotice
            message={`Categories couldn't be loaded right now. ${result.message}`}
          />
        ) : tiles.length === 0 ? (
          <LandingNotice
            message="No categories have listings yet. Be the first to list something."
            href={LIST_ITEM_HREF}
            action="List your item"
          />
        ) : (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((category, index) => (
              <Reveal
                as="li"
                key={category.href}
                delay={index * 70}
                className="h-full"
              >
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
