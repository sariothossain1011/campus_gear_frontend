import { Suspense } from "react";

import { CategorySection } from "@/components/landing/category-section";
import { CommunitySection } from "@/components/landing/community-section";
import { CTASection } from "@/components/landing/cta-section";
import { FeaturedItemsSection } from "@/components/landing/featured-items-section";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ProviderStudentSection } from "@/components/landing/provider-student-section";
import { SectionSkeleton } from "@/components/landing/section-skeleton";
import { WhyCampusGearSection } from "@/components/landing/why-campus-gear-section";
import { getSessionHint } from "@/lib/auth/session";

export default async function Page() {
  const session = await getSessionHint();

  return (
    <>
      <a
        href="#main-content"
        className="skip-link sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:font-mono focus-visible:text-xs focus-visible:font-bold focus-visible:uppercase focus-visible:tracking-[0.16em] focus-visible:text-paper"
      >
        Skip to content
      </a>

      <Header session={session} />

      <main id="main-content" tabIndex={-1}>
        {/* The hero's data (three cached reads) is awaited; the heavier
            sections stream in behind skeletons so they can't hold it up. */}
        <HeroSection />
        <Suspense
          fallback={
            <SectionSkeleton label="Loading categories" cardClassName="h-52" />
          }
        >
          <CategorySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton label="Loading listings" />}>
          <FeaturedItemsSection />
        </Suspense>
        <HowItWorksSection />
        <WhyCampusGearSection />
        <ProviderStudentSection />
        <Suspense
          fallback={
            <SectionSkeleton
              label="Loading community"
              cards={2}
              cardClassName="h-80"
            />
          }
        >
          <CommunitySection />
        </Suspense>
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
