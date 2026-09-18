import "server-only";

import { cookies } from "next/headers";

import type { AuthTokens, SessionHint } from "@/lib/validations/types";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  decodeSessionToken,
  isUnexpired,
} from "./session-token";

type SessionCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge?: number;
};

/**
 * Frontend-domain cookie settings for a backend JWT. Lifetime follows the
 * token's own `exp`, so the cookie never outlives the credential inside it;
 * `persistent: false` makes it a browser-session cookie instead.
 */
export function sessionCookieOptions(
  token: string,
  persistent: boolean,
): SessionCookieOptions {
  const options: SessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  const exp = decodeSessionToken(token)?.exp;
  if (persistent && exp) {
    options.maxAge = Math.max(exp - Math.floor(Date.now() / 1000), 0);
  }

  return options;
}

export async function setSessionCookies(
  tokens: AuthTokens,
  { persistent }: { persistent: boolean },
) {
  const cookieStore = await cookies();

  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    sessionCookieOptions(tokens.accessToken, persistent),
  );
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    sessionCookieOptions(tokens.refreshToken, persistent),
  );
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Who appears to be signed in, from the cookies alone — no backend call. For
 * page chrome only (e.g. showing "Dashboard" instead of "Login"). A refresh
 * token counts, since the next protected request will renew the access token.
 */
export async function getSessionHint(): Promise<SessionHint | null> {
  const cookieStore = await cookies();

  for (const name of [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE]) {
    const claims = decodeSessionToken(cookieStore.get(name)?.value);
    if (isUnexpired(claims)) {
      return { name: claims.name ?? null, role: claims.role ?? null };
    }
  }

  return null;
}
