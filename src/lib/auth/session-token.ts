import type { Role } from "@/lib/validations/types";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

/** Claims the backend signs into both JWTs: `{ id, name, email, role }` + iat/exp. */
export type SessionTokenClaims = {
  id?: string;
  name?: string;
  email?: string;
  role?: Role;
  exp?: number;
};

const ROLES: readonly Role[] = ["CUSTOMER", "PROVIDER", "ADMIN"];

// Runs in Proxy as well as on the server, so it sticks to `atob`/`TextDecoder`
// rather than Node's `Buffer`.
function decodeBase64Url(segment: string): string | null {
  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/**
 * Reads a JWT's payload WITHOUT verifying its signature — the frontend does
 * not hold the backend's signing secret. Use the result for routing and for
 * choosing which links to show; authorization happens at the backend.
 */
export function decodeSessionToken(
  token: string | undefined | null,
): SessionTokenClaims | null {
  const payloadSegment = token?.split(".")[1];
  if (!payloadSegment) return null;

  const json = decodeBase64Url(payloadSegment);
  if (!json) return null;

  try {
    const payload = JSON.parse(json) as Record<string, unknown>;
    const role = ROLES.find((candidate) => candidate === payload.role);

    return {
      id: typeof payload.id === "string" ? payload.id : undefined,
      name: typeof payload.name === "string" ? payload.name : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      role,
      exp: typeof payload.exp === "number" ? payload.exp : undefined,
    };
  } catch {
    return null;
  }
}

/** A token with no future `exp` is not treated as a session at all. */
export function isUnexpired(
  claims: SessionTokenClaims | null,
  nowSeconds = Math.floor(Date.now() / 1000),
): claims is SessionTokenClaims & { exp: number } {
  return typeof claims?.exp === "number" && claims.exp > nowSeconds;
}
