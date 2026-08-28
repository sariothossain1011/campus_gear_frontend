import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export default function Page() {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:font-mono focus-visible:text-xs focus-visible:font-bold focus-visible:uppercase focus-visible:tracking-[0.16em] focus-visible:text-paper"
      >
        Skip to content
      </a>

      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* <HeroSection />
        <CategorySection />
        <FeaturedItemsSection />
        <HowItWorksSection />
        <WhyCampusGearSection />
        <ProviderStudentSection />
        <CommunitySection />
        <CTASection /> */}
      </main>

      <Footer />
    </>
  );
}
