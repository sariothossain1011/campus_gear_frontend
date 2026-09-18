import type { Role } from "@/lib/validations/types";

/** Pages a signed-in visitor has no reason to see. */
export const AUTH_PAGES = ["/login", "/signup"] as const;

/** Everything under these prefixes requires a session. */
export const PROTECTED_PREFIXES = ["/dashboard"] as const;

/**
 * Where each role lands after signing in. One shared dashboard for now; point
 * a role at its own overview here once it exists.
 */
export const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: "/dashboard",
  PROVIDER: "/dashboard",
  ADMIN: "/dashboard",
};

export const DEFAULT_HOME = "/dashboard";

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Accepts only same-origin paths, so a crafted `?returnTo=` cannot bounce the
 * visitor to another site, and never an auth page, which would loop.
 */
export function safeReturnTo(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  try {
    // Resolving against a dummy origin normalizes tricks like `/\evil.com`.
    const url = new URL(value, "http://campus-gear.local");
    if (url.origin !== "http://campus-gear.local") return null;

    const isAuthPath =
      AUTH_PAGES.some((page) => url.pathname === page) ||
      url.pathname.startsWith("/auth/");
    if (isAuthPath) return null;

    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

/** Builds `/login?returnTo=…` (or `/signup?…`), dropping an unsafe target. */
export function authPageHref(
  page: (typeof AUTH_PAGES)[number],
  returnTo: string | null,
) {
  return returnTo ? `${page}?returnTo=${encodeURIComponent(returnTo)}` : page;
}
