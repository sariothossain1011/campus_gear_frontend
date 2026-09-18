import "server-only";

import { cache } from "react";

import type {
  AuthTokens,
  CurrentUser,
  LoginInput,
  RefreshedAccessToken,
  RegisterInput,
} from "@/lib/validations/types";
import { campusGearFetch } from "./server-client";

export function loginRequest(input: LoginInput) {
  return campusGearFetch<AuthTokens>("/auth/login", {
    method: "POST",
    json: input,
    cache: "no-store",
    fallbackMessage: "We couldn't reach the sign-in desk. Try again shortly.",
  });
}

export function registerRequest(input: RegisterInput) {
  return campusGearFetch<AuthTokens>("/auth/register", {
    method: "POST",
    json: input,
    cache: "no-store",
    fallbackMessage:
      "We couldn't set up your account just now. Try again shortly.",
  });
}

export function logoutRequest() {
  return campusGearFetch<null>("/auth/logout", {
    method: "POST",
    cache: "no-store",
  });
}

export function refreshAccessTokenRequest(refreshToken: string) {
  return campusGearFetch<RefreshedAccessToken>("/auth/refresh-token", {
    method: "POST",
    json: { refreshToken },
    cache: "no-store",
    fallbackMessage: "Your session has expired. Please sign in again.",
  });
}

/** Verifies a token that is not in the cookie jar yet, e.g. one just refreshed. */
export function getCurrentUserWithAccessToken(accessToken: string) {
  return campusGearFetch<CurrentUser>("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    fallbackMessage:
      "We couldn't verify your Campus Gear session. Please sign in again.",
  });
}

/**
 * The signed-in user, per the backend. Deduplicated per request so a layout
 * and its page can both ask without a second round trip.
 */
export const getCurrentUser = cache(function getCurrentUserRequest() {
  return campusGearFetch<CurrentUser>("/auth/me", {
    auth: true,
    cache: "no-store",
    fallbackMessage:
      "We couldn't verify your Campus Gear session. Try again shortly.",
  });
});

/** Self-service profile edit for the signed-in user; name and phone only. */
export function updateCurrentUser(input: { name?: string; phone?: string }) {
  return campusGearFetch<CurrentUser>("/auth/me", {
    method: "PATCH",
    auth: true,
    cache: "no-store",
    json: input,
    fallbackMessage: "Your profile couldn't be updated. Try again shortly.",
  });
}
