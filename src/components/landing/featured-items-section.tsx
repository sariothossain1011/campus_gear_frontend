import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/ui/item-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedItems } from "@/lib/landing-content";
import { LIST_ITEM_HREF } from "@/lib/landing-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { LandingNotice } from "./landing-notice";

export async function FeaturedItemsSection() {
  const result = await getFeaturedItems();

  return (
    <section
      id="featured"
      aria-labelledby="featured-heading"
      className="scroll-mt-24 border-y border-border/50 bg-mist/45 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker="Just listed"
            title={<span id="featured-heading">Fresh on the shelf</span>}
            lead="The newest gear in the catalog, in stock and ready to request today."
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

        {!result.ok ? (
          <LandingNotice
            message={`Listings couldn't be loaded right now. ${result.message}`}
          />
        ) : result.data.length === 0 ? (
          <LandingNotice
            message="Nothing is available to rent right now. Check back soon, or list something of your own."
            href={LIST_ITEM_HREF}
            action="List your item"
          />
        ) : (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((item, index) => (
              <Reveal
                as="li"
                key={item.href}
                delay={index * 70}
                className="h-full"
              >
                <ItemCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
