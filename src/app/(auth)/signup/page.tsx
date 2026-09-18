import type { Metadata } from "next";

import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { authPageHref, safeReturnTo } from "@/lib/auth/routes";
import { getLandingStats } from "@/lib/landing-content";

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
  const stats = await getLandingStats();

  // Live figures when the catalog answers; otherwise claims that need no number.
  const highlights = [
    stats.listings !== null && stats.categories !== null
      ? `${stats.listings.toLocaleString("en")} items listed across ${stats.categories} categories.`
      : "Gear listed by people a short walk away.",
    stats.fromPrice !== null
      ? `Rentals start from ${stats.fromPrice} a day.`
      : "Rent by the day, only for as long as you need it.",
    "Providers confirm availability before any money moves.",
  ];

  return (
    <AuthShell
      kicker="Join the campus"
      title={
        <>
          Own the weekend,
          <span className="block text-lime">not the gear.</span>
        </>
      }
      lead="Rent what you need for a day, or list what you own between uses. Pick the account that fits below."
      highlights={highlights}
      formTitle="Create account"
      formLead="It takes about a minute. No card needed to browse."
      footer={
        <>
          Already have an account?{" "}
          <AuthLink href={authPageHref("/login", returnTo)}>Sign in</AuthLink>
        </>
      }
    >
      <SignupForm returnTo={returnTo} />
    </AuthShell>
  );
}
