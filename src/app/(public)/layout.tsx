import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import type { AuthSessionSnapshot } from "@/lib/validations/types";
import { getCurrentUser } from "@/services/auth";

/**
 * Shell for the public catalog (`/gear`, `/gear/[id]`). The session is
 * resolved through the backend rather than the cookie hint because the rental
 * card needs the real role to decide whether its visitor can place an order.
 * Guests cost nothing: without an access cookie the lookup returns before any
 * network call.
 */
export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const currentUser = await getCurrentUser();
  const initialSession: AuthSessionSnapshot = currentUser.ok
    ? { status: "authenticated", user: currentUser.data }
    : currentUser.error.status === 401 || currentUser.error.status === 403
      ? { status: "anonymous", user: null }
      : { status: "unavailable", user: null, message: currentUser.error.message };

  return (
    <AuthSessionProvider initialSession={initialSession}>
      <a
        href="#main-content"
        className="skip-link sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:font-mono focus-visible:text-xs focus-visible:font-bold focus-visible:uppercase focus-visible:tracking-[0.16em] focus-visible:text-paper"
      >
        Skip to content
      </a>
      <Header
        session={
          initialSession.user
            ? { name: initialSession.user.name, role: initialSession.user.role }
            : null
        }
      />
      {children}
      <Footer />
    </AuthSessionProvider>
  );
}
