import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/lib/landing-data";

export function CategorySection() {
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
            lead="Six shelves of campus gear, listed by students a short walk away."
          />
          <Button asChild variant="outline" size="lg" className="self-start md:self-end">
            <Link href="/gear">
              All categories
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal
              as="li"
              key={category.name}
              delay={index * 70}
              className="h-full"
            >
              <CategoryCard category={category} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
