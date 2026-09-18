import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_PAGES,
  DEFAULT_HOME,
  ROLE_HOME,
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
