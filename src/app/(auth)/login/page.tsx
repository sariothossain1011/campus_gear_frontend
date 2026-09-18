import type { Metadata } from "next";

import { Clock } from "lucide-react";

import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { authPageHref, safeReturnTo } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Campus Gear to manage your rentals, listings, and requests.",
};

type SearchParamValue = string | string[] | undefined;

const first = (value: SearchParamValue) =>
  Array.isArray(value) ? value[0] : value;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: SearchParamValue; reason?: SearchParamValue }>;
}) {
  const { returnTo: rawReturnTo, reason } = await searchParams;
  const returnTo = safeReturnTo(first(rawReturnTo));
  const sessionExpired = first(reason) === "session-expired";

  return (
    <AuthShell
      kicker="Welcome back"
      title={
        <>
          Your gear is
          <span className="block text-lime">right where you left it.</span>
        </>
      }
      lead="Pick up pending requests, confirm handovers, and keep your listings moving — all from one place."
      highlights={[
        "Track every rental request in one queue.",
        "Message renters and providers without leaving the app.",
        "Payments stay handled by Stripe, start to finish.",
      ]}
      formTitle="Sign in"
      formLead="Enter your details to get back to your rentals."
      footer={
        <>
          New to Campus Gear?{" "}
          <AuthLink href={authPageHref("/signup", returnTo)}>
            Create an account
          </AuthLink>
        </>
      }
    >
      {sessionExpired ? (
        <p
          role="status"
          className="mb-6 flex items-start gap-3 border border-ink/15 bg-mist/55 px-4 py-3.5 text-sm leading-6 text-ink/80"
        >
          <Clock aria-hidden="true" className="mt-0.5 size-4.5 shrink-0" />
          Your session ended. Sign in again to pick up where you left off.
        </p>
      ) : null}
      <LoginForm returnTo={returnTo} />
    </AuthShell>
  );
}
