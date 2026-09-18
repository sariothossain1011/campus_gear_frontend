import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_HOME, safeReturnTo } from "@/lib/auth/routes";
import { sessionCookieOptions } from "@/lib/auth/session";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/session-token";
import {
  getCurrentUserWithAccessToken,
  refreshAccessTokenRequest,
} from "@/services/auth";

function endSession(request: NextRequest, returnTo: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("returnTo", returnTo);
  loginUrl.searchParams.set("reason", "session-expired");

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}

/**
 * Renews the access token, then resumes the page that needed it.
 *
 * Server Components cannot write cookies, so `requireUser` redirects here when
 * the backend rejects the access token. Every failure clears both cookies and
 * ends at the login page, which is what stops a redirect loop.
 */
export async function GET(request: NextRequest) {
  const returnTo =
    safeReturnTo(request.nextUrl.searchParams.get("returnTo")) ?? DEFAULT_HOME;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) return endSession(request, returnTo);

  const refreshed = await refreshAccessTokenRequest(refreshToken);
  if (!refreshed.ok) return endSession(request, returnTo);

  // Confirm the new token actually works before sending the visitor back —
  // this also catches an account suspended since it signed in.
  const { accessToken } = refreshed.data;
  const user = await getCurrentUserWithAccessToken(accessToken);
  if (!user.ok) return endSession(request, returnTo);

  // A request doesn't reveal whether the refresh cookie was persistent, so the
  // renewed access cookie is a browser-session one. That never outlives a
  // "don't remember me" login; a remembered one just renews again next visit.
  const response = NextResponse.redirect(new URL(returnTo, request.url));
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    sessionCookieOptions(accessToken, false),
  );
  return response;
}
