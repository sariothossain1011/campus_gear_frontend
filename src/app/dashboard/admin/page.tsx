import { Boxes, CalendarClock, ClipboardList, Users } from "lucide-react";
import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";
import { listGear } from "@/services/gear";
import { listOrders } from "@/services/orders";
import { listUsers } from "@/services/users";

import { ApiProblems } from "../_components/api-problems";
import { MetricCard } from "../_components/metric-card";
import { PageHeader } from "../_components/page-header";
import { RecentOrders, SectionTitle } from "../_components/recent-orders";
import { problemsOf, totalOf } from "../_utils/results";

export const metadata: Metadata = { title: "Admin dashboard" };

export default async function AdminDashboardPage() {
  const user = await requireRole(["ADMIN"], "/dashboard/admin");

  // No stats endpoint exists; every figure is `meta.total` of a `limit=1` list.
  const [users, providers, customers, gear, recent, placed] = await Promise.all([
    listUsers({ limit: 1 }),
    listUsers({ role: "PROVIDER", limit: 1 }),
    listUsers({ role: "CUSTOMER", limit: 1 }),
    listGear({ limit: 1 }),
    listOrders({ limit: 5 }),
    listOrders({ status: "PLACED", limit: 1 }),
  ]);

  const providerCount = totalOf(providers);
  const customerCount = totalOf(customers);
  const userBreakdown =
    providerCount === null || customerCount === null
      ? "Everyone with an account."
      : `${customerCount.toLocaleString("en")} renters · ${providerCount.toLocaleString("en")} providers.`;

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <PageHeader
        eyebrow={`Admin · ${user.name}`}
        title="Platform overview"
        description="The whole marketplace at a glance: who's here, what's listed, and what's moving through the rental pipeline."
      />

      <ApiProblems problems={problemsOf(users, providers, customers, gear, recent, placed)} />

      <section aria-label="Platform counts" className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Users" value={totalOf(users)} detail={userBreakdown} icon={Users} />
        <MetricCard label="Listings" value={totalOf(gear)} detail="Gear items across every provider." icon={Boxes} tone="sky" />
        <MetricCard label="Orders" value={totalOf(recent)} detail="Rental requests ever placed." icon={ClipboardList} tone="lime" />
        <MetricCard label="Awaiting providers" value={totalOf(placed)} detail="Requests nobody has confirmed yet." icon={CalendarClock} tone="sun" />
      </section>

      <section aria-labelledby="recent-orders" className="mt-14">
        <SectionTitle id="recent-orders" kicker="Across the platform" title="Latest orders" />
        {recent.ok ? (
          <RecentOrders
            orders={recent.data}
            viewer="ADMIN"
            emptyMessage="No rental orders on the platform yet."
          />
        ) : null}
      </section>
    </div>
  );
}
