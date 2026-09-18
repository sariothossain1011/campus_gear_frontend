"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  loginSchema,
  roleForAccountType,
  signupSchema,
  type LoginValues,
  type SignupValues,
} from "@/lib/auth-schemas";
import type {
  AuthActionResult,
  FieldErrors,
  Role,
} from "@/lib/validations/types";
import { loginRequest, logoutRequest, registerRequest } from "@/services/auth";

import { DEFAULT_HOME, ROLE_HOME, safeReturnTo } from "./routes";
import { clearSessionCookies, setSessionCookies } from "./session";
import { decodeSessionToken } from "./session-token";

const INVALID_INPUT_MESSAGE = "Check the highlighted fields and try again.";

/** Backend field name → form field name, where the two differ. */
const SIGNUP_FIELD_MAP: Record<string, keyof SignupValues> = {
  name: "fullName",
  role: "accountType",
};

function zodFieldErrors(error: z.ZodError): FieldErrors {
  const flattened = z.flattenError(error).fieldErrors as Record<
    string,
    string[] | undefined
  >;
  const fieldErrors: FieldErrors = {};

  for (const [field, messages] of Object.entries(flattened)) {
    if (messages?.length) fieldErrors[field] = messages;
  }

  return fieldErrors;
}

function renameFields(
  fieldErrors: FieldErrors | undefined,
  map: Record<string, string>,
): FieldErrors | undefined {
  if (!fieldErrors) return undefined;

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      map[field] ?? field,
      messages,
    ]),
  );
}

/**
 * The backend reports a duplicate email/phone as a 409 with a message rather
 * than a field path; attach it to the field so it shows next to the input.
 */
function conflictFieldErrors(
  status: number | null,
  message: string,
): FieldErrors | undefined {
  if (status !== 409) return undefined;
  if (/email/i.test(message)) return { email: [message] };
  if (/phone/i.test(message)) return { phone: [message] };
  return undefined;
}

function destinationFor(accessToken: string, returnTo: unknown) {
  const safe = safeReturnTo(returnTo);
  if (safe) return safe;

  const role: Role | undefined = decodeSessionToken(accessToken)?.role;
  return role ? ROLE_HOME[role] : DEFAULT_HOME;
}

export async function loginAction(
  values: LoginValues,
  returnTo: string | null,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: INVALID_INPUT_MESSAGE,
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { email, password, rememberMe } = parsed.data;
  const result = await loginRequest({ email, password });

  if (!result.ok) {
    return {
      ok: false,
      message: result.error.message,
      fieldErrors: result.error.fieldErrors,
    };
  }

  await setSessionCookies(result.data, { persistent: rememberMe });
  redirect(destinationFor(result.data.accessToken, returnTo));
}

export async function signupAction(
  values: SignupValues,
  returnTo: string | null,
): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: INVALID_INPUT_MESSAGE,
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { fullName, email, phone, password, accountType } = parsed.data;
  const result = await registerRequest({
    name: fullName,
    email,
    phone,
    password,
    role: roleForAccountType(accountType),
  });

  if (!result.ok) {
    const { status, message, fieldErrors } = result.error;
    return {
      ok: false,
      message,
      fieldErrors:
        renameFields(fieldErrors, SIGNUP_FIELD_MAP) ??
        conflictFieldErrors(status, message),
    };
  }

  // A new account is signed straight in; keep them signed in like "remember me".
  await setSessionCookies(result.data, { persistent: true });
  redirect(destinationFor(result.data.accessToken, returnTo));
}

export async function logoutAction() {
  // Best effort: the backend only clears its own cookies. What ends the
  // session here is deleting the frontend's, which happens regardless.
  await logoutRequest();
  await clearSessionCookies();
  redirect("/login");
}
