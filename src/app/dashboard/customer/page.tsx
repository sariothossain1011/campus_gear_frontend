import { CalendarClock, ClipboardList, CreditCard, PackageCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { listOrders } from "@/services/orders";

import { ApiProblems } from "../_components/api-problems";
import { MetricCard } from "../_components/metric-card";
import { PageHeader } from "../_components/page-header";
import { RecentOrders, SectionTitle } from "../_components/recent-orders";
import { problemsOf, sumTotals, totalOf } from "../_utils/results";

export const metadata: Metadata = { title: "Renter dashboard" };

export default async function CustomerDashboardPage() {
  const user = await requireRole(["CUSTOMER"], "/dashboard/customer");

  // The API filters one status at a time, so each count is its own small
  // `limit=1` request read from `meta.total`, all in parallel.
  const [recent, placed, confirmed, paid, pickedUp] = await Promise.all([
    listOrders({ limit: 5 }),
    listOrders({ status: "PLACED", limit: 1 }),
    listOrders({ status: "CONFIRMED", limit: 1 }),
    listOrders({ status: "PAID", limit: 1 }),
    listOrders({ status: "PICKED_UP", limit: 1 }),
  ]);

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <PageHeader
        eyebrow={`Renter · ${user.name}`}
        title="Your rentals"
        description="Send a request, wait for the provider to confirm, pay, then pick it up on campus. Everything you've asked for is tracked here."
        actions={
          <Button asChild variant="primary" size="lg">
            <Link href="/#featured">Find gear</Link>
          </Button>
        }
      />

      <ApiProblems problems={problemsOf(recent, placed, confirmed, paid, pickedUp)} />

      <section aria-label="Your rental counts" className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="All requests" value={totalOf(recent)} detail="Every rental request on your account." icon={ClipboardList} />
        <MetricCard label="Awaiting provider" value={totalOf(placed)} detail="Sent, waiting for the owner to confirm." icon={CalendarClock} tone="sun" />
        <MetricCard label="Ready to pay" value={totalOf(confirmed)} detail="Confirmed — pay to lock in the dates." icon={CreditCard} tone="sky" />
        <MetricCard label="Active rentals" value={sumTotals(totalOf(paid), totalOf(pickedUp))} detail="Paid or in your hands right now." icon={PackageCheck} tone="lime" />
      </section>

      <section aria-labelledby="recent-orders" className="mt-14">
        <SectionTitle id="recent-orders" kicker="Newest first" title="Recent requests" />
        {recent.ok ? (
          <RecentOrders
            orders={recent.data}
            viewer="CUSTOMER"
            emptyMessage="No requests yet. Find something to borrow and send your first request."
          />
        ) : null}
      </section>
    </div>
  );
}
