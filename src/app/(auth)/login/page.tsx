import type { Metadata } from "next";

import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Campus Gear to manage your rentals, listings, and requests.",
};

export default function LoginPage() {
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
          New to Campus Gear? <AuthLink href="/signup">Create an account</AuthLink>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
