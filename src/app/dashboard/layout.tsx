import type { Metadata } from "next";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Campus Gear rentals, listings, and account.",
  robots: { index: false },
};

/**
 * Every route under /dashboard is private. Proxy has already bounced visitors
 * with no session cookie; this is the authoritative check — the backend has to
 * accept the access token (`GET /auth/me`) before anything renders.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <>
      <Header session={{ name: user.name, role: user.role }} />
      <main id="main-content" tabIndex={-1} className="bg-paper text-ink">
        {children}
      </main>
      <Footer />
    </>
  );
}
