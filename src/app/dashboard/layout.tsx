import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/session";

import { DashboardShell } from "./_components/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Campus Gear rentals, listings, and account.",
  robots: { index: false },
};

/**
 * Every route under /dashboard is private. Proxy has already bounced visitors
 * with no session cookie; this is the authoritative check — the backend has to
 * accept the access token (`GET /auth/me`) before anything renders. Pages that
 * belong to one role add `requireRole` on top.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <DashboardShell user={{ name: user.name, email: user.email, role: user.role }}>
      {children}
    </DashboardShell>
  );
}
