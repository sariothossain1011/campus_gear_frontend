import type { Metadata } from "next";

import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join Campus Gear to rent what you need and list what you already own.",
};

export default function SignupPage() {
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
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
