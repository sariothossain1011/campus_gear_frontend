import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";
import type { Role } from "@/lib/validations/types";

const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: "Renter",
  PROVIDER: "Provider",
  ADMIN: "Admin",
};

const ROLE_LEAD: Record<Role, string> = {
  CUSTOMER:
    "Find gear, send rental requests, and pay once a provider confirms.",
  PROVIDER:
    "List what you own, confirm requests, and hand gear over on campus.",
  ADMIN: "Oversee people, categories, listings, and every rental on the platform.",
};

const memberSince = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

export default async function DashboardPage() {
  // Deduplicated with the layout's call — this is not a second request.
  const user = await requireUser("/dashboard");

  const details = [
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Account type", value: ROLE_LABEL[user.role] },
    { label: "Member since", value: memberSince.format(new Date(user.createdAt)) },
  ];

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="topo-lines absolute inset-0 opacity-20" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="flex items-center gap-3 font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-signal">
          <span aria-hidden="true" className="h-px w-6 bg-signal/50" />
          {ROLE_LABEL[user.role]} dashboard
        </p>

        <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-balance">
          Hey, {user.name.split(" ")[0]}.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-ink/65 sm:text-base">
          {ROLE_LEAD[user.role]}
        </p>

        <dl className="mt-12 grid border-t border-l border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="border-r border-b border-ink/15 bg-card px-5 py-6"
            >
              <dt className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ink/55">
                {detail.label}
              </dt>
              <dd className="mt-2 break-words text-sm font-semibold">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>

        <form action={logoutAction} className="mt-10">
          <Button type="submit" variant="outline" size="lg">
            <LogOut aria-hidden="true" />
            Log out
          </Button>
        </form>
      </div>
    </section>
  );
}
