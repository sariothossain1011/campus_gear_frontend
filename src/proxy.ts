import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_PAGES,
  DEFAULT_HOME,
  ROLE_HOME,
  allowedRolesForPath,
  isProtectedPath,
  safeReturnTo,
} from "@/lib/auth/routes";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  decodeSessionToken,
  isUnexpired,
} from "@/lib/auth/session-token";

/**
 * Optimistic route guard. It only looks at the session cookies — it never
 * calls the backend, refreshes tokens, or verifies a signature (the frontend
 * has no signing secret). The real checks are `requireUser` in protected
 * layouts and the backend's own role guards.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const access = decodeSessionToken(
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
  );
  const refresh = decodeSessionToken(
    request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
  );
  const hasAccess = isUnexpired(access);
  const hasRefresh = isUnexpired(refresh);

  if (isProtectedPath(pathname)) {
    // No usable token at all: straight to login, remembering where they were
    // going. An expired access token with a live refresh token passes through;
    // the page guard renews it via /auth/refresh.
    if (!hasAccess && !hasRefresh) {
      const loginUrl = new URL("/login", request.url);
      const returnTo = safeReturnTo(`${pathname}${search}`);
      if (returnTo) loginUrl.searchParams.set("returnTo", returnTo);
      return NextResponse.redirect(loginUrl);
    }

    // Obviously wrong role (per the unverified token): send them to their own
    // dashboard instead of rendering a page the guard would reject anyway.
    const role = (hasAccess ? access : refresh)?.role;

    // `/dashboard` itself is only a doorway to the role's own overview. Its
    // page redirects too, but that happens mid-stream; doing it here is a
    // plain 307.
    if (role && pathname === DEFAULT_HOME) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
    }

    const allowedRoles = allowedRolesForPath(pathname);
    if (role && allowedRoles && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
    }

    return NextResponse.next();
  }

  if ((AUTH_PAGES as readonly string[]).includes(pathname)) {
    const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));

    // Already signed in: skip the form.
    if (hasAccess) {
      const home = access.role ? ROLE_HOME[access.role] : DEFAULT_HOME;
      return NextResponse.redirect(new URL(returnTo ?? home, request.url));
    }

    // Only a refresh token left: let the backend decide whether it is still
    // good. On failure /auth/refresh clears both cookies and comes back here,
    // so this cannot loop.
    if (hasRefresh) {
      const refreshUrl = new URL("/auth/refresh", request.url);
      refreshUrl.searchParams.set("returnTo", returnTo ?? DEFAULT_HOME);
      return NextResponse.redirect(refreshUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
