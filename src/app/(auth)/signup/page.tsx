import type { Metadata } from "next";

import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { authPageHref, safeReturnTo } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join Campus Gear to rent what you need and list what you already own.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const { returnTo: rawReturnTo } = await searchParams;
  const returnTo = safeReturnTo(
    Array.isArray(rawReturnTo) ? rawReturnTo[0] : rawReturnTo,
  );

  return (
    <AuthShell
      kicker="Join the campus"
      title={
        <>
          Own the weekend,
          <span className="block text-lime">not the gear.</span>
        </>
      }
      lead="Rent what you need for a day. List what you own between uses. One account covers both."
      highlights={[
        "430+ items already listed across 12 campuses.",
        "Rentals start from ৳40 a day.",
        "Providers confirm availability before any money moves.",
      ]}
      formTitle="Create account"
      formLead="It takes about a minute. No card needed to browse."
      footer={
        <>
          Already have an account? <AuthLink href={authPageHref("/login", returnTo)}>Sign in</AuthLink>
        </>
      }
    >
      <SignupForm returnTo={returnTo} />
    </AuthShell>
  );
}
