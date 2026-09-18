import type { Role } from "@/lib/validations/types";

/** Pages a signed-in visitor has no reason to see. */
export const AUTH_PAGES = ["/login", "/signup"] as const;

/** Everything under these prefixes requires a session. */
export const PROTECTED_PREFIXES = ["/dashboard"] as const;

/** Where each role lands after signing in, and where wrong-role visits go. */
export const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

/** Resolves to the role's own home; see `src/app/dashboard/page.tsx`. */
export const DEFAULT_HOME = "/dashboard";

/**
 * Dashboard areas only some roles may open; anything not listed (orders,
 * payments, reviews, profile) is shared and scoped per role by the backend.
 * Proxy uses this for a quick bounce; `requireDashboardRole(s)` on each page
 * is the real check.
 *
 * Providers can read categories because gear forms need the taxonomy; every
 * category mutation stays admin-only. Customers discover gear through the
 * public `/gear` catalog, so `/dashboard/gear` is provider inventory and admin
 * oversight only.
 */
const ROLE_RESTRICTED_PREFIXES: readonly { prefix: string; roles: readonly Role[] }[] = [
  { prefix: "/dashboard/customer", roles: ["CUSTOMER"] },
  { prefix: "/dashboard/provider", roles: ["PROVIDER"] },
  { prefix: "/dashboard/admin", roles: ["ADMIN"] },
  { prefix: "/dashboard/admins", roles: ["ADMIN"] },
  { prefix: "/dashboard/users", roles: ["ADMIN"] },
  { prefix: "/dashboard/categories", roles: ["ADMIN", "PROVIDER"] },
  { prefix: "/dashboard/gear", roles: ["ADMIN", "PROVIDER"] },
  // Placing a rental is a customer action; review moderation and per-listing
  // feedback are provider/admin views.
  { prefix: "/dashboard/orders/new", roles: ["CUSTOMER"] },
  { prefix: "/dashboard/reviews", roles: ["ADMIN", "PROVIDER"] },
];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Roles allowed on a dashboard path, or null when any signed-in role may view it. */
export function allowedRolesForPath(pathname: string): readonly Role[] | null {
  return (
    ROLE_RESTRICTED_PREFIXES.find(({ prefix }) => matchesPrefix(pathname, prefix))
      ?.roles ?? null
  );
}

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
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
