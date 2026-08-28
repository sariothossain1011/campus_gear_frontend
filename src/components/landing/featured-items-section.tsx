import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/ui/item-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredItems } from "@/lib/landing-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturedItemsSection() {
  return (
    <section
      id="featured"
      aria-labelledby="featured-heading"
      className="scroll-mt-24 border-y border-border/50 bg-mist/45 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker="Featured listings"
            title={<span id="featured-heading">Popular near your campus</span>}
            lead="Requested most often this month by students at partner campuses."
          />
          <Button
            asChild
            variant="outline"
            size="lg"
            className="self-start md:self-end"
          >
            <Link href="/gear">
              Browse all items
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item, index) => (
            <Reveal
              as="li"
              key={item.name}
              delay={index * 70}
              className="h-full"
            >
              <ItemCard item={item} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
