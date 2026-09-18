import type { Metadata } from "next";

import { formatDate } from "@/lib/format";
import { requireUser } from "@/lib/auth/session";

import { ROLE_LABEL } from "../_config/navigation";
import { PageHeader } from "../_components/page-header";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  // Deduplicated with the layout's call — not a second request.
  const user = await requireUser("/dashboard/account");

  const details = [
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Account type", value: ROLE_LABEL[user.role] },
    { label: "Status", value: user.status.charAt(0) + user.status.slice(1).toLowerCase() },
    { label: "Member since", value: formatDate(user.createdAt) },
  ];

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <PageHeader
        eyebrow="Your account"
        title="Account details"
        description="How Campus Gear knows you. Your email is your sign-in and can only be changed by an admin."
      />

      <dl className="mt-10 grid border-t border-l border-ink/15 sm:grid-cols-2 xl:grid-cols-3">
        {details.map((detail) => (
          <div key={detail.label} className="border-r border-b border-ink/15 bg-card px-5 py-6">
            <dt className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ink/55">
              {detail.label}
            </dt>
            <dd className="mt-2 break-words text-sm font-semibold">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
