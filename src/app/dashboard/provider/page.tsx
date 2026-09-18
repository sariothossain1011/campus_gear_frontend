import { Boxes, CalendarClock, CircleDollarSign, PackageCheck } from "lucide-react";
import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";
import { listGear } from "@/services/gear";
import { listOrders } from "@/services/orders";
import { listPayments } from "@/services/payments";

import { ApiProblems } from "../_components/api-problems";
import { MetricCard } from "../_components/metric-card";
import { PageHeader } from "../_components/page-header";
import { RecentOrders, SectionTitle } from "../_components/recent-orders";
import { problemsOf, sumTotals, totalOf } from "../_utils/results";

export const metadata: Metadata = { title: "Provider dashboard" };

export default async function ProviderDashboardPage() {
  const user = await requireRole(["PROVIDER"], "/dashboard/provider");

  // Orders and payments are scoped to this provider's gear by the backend;
  // listings come from the public catalog filtered to their own id.
  const [listings, recent, placed, paid, pickedUp, payouts] = await Promise.all([
    listGear({ providerId: user.id, limit: 1 }),
    listOrders({ limit: 5 }),
    listOrders({ status: "PLACED", limit: 1 }),
    listOrders({ status: "PAID", limit: 1 }),
    listOrders({ status: "PICKED_UP", limit: 1 }),
    listPayments({ status: "COMPLETED", limit: 1 }),
  ]);

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <PageHeader
        eyebrow={`Provider · ${user.name}`}
        title="Your listings"
        description="Confirm requests while the dates still work, then hand gear over once it's paid. New requests need your answer first."
      />

      <ApiProblems problems={problemsOf(listings, recent, placed, paid, pickedUp, payouts)} />

      <section aria-label="Your provider counts" className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Listings" value={totalOf(listings)} detail="Gear you've put up for rent." icon={Boxes} />
        <MetricCard label="New requests" value={totalOf(placed)} detail="Waiting for you to confirm or decline." icon={CalendarClock} tone="sun" />
        <MetricCard label="Out on rent" value={sumTotals(totalOf(paid), totalOf(pickedUp))} detail="Paid, or already handed over." icon={PackageCheck} tone="lime" />
        <MetricCard label="Paid rentals" value={totalOf(payouts)} detail="Payments completed through Stripe." icon={CircleDollarSign} tone="pine" />
      </section>

      <section aria-labelledby="recent-orders" className="mt-14">
        <SectionTitle id="recent-orders" kicker="Newest first" title="Latest requests" />
        {recent.ok ? (
          <RecentOrders
            orders={recent.data}
            viewer="PROVIDER"
            emptyMessage="No requests yet. They'll show up here as soon as someone wants your gear."
          />
        ) : null}
      </section>
    </div>
  );
}
