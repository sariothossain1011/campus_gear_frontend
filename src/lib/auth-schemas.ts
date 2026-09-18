import { z } from "zod";

import type { RegistrableRole } from "@/lib/validations/types";

/**
 * Validation schemas for the sign-up and login forms.
 *
 * Kept out of the components so the auth Server Actions re-run the same rules
 * on the server — a client-side check alone is a convenience. The backend's
 * own validation stays the final authority on what it accepts.
 *
 * Messages are written as full sentences: they render directly beneath the
 * field and are announced to screen readers, so "Enter your campus email"
 * reads better than a bare "Required".
 */

/**
 * Trim before validating, so a trailing space pasted along with an address is
 * not reported as an invalid email. `.pipe()` sequences the two — chaining
 * `.trim()` onto `z.email()` would run the format check on the raw value first.
 */
const email = z
  .string()
  .trim()
  .min(1, "Enter your campus email.")
  .pipe(z.email("That does not look like a valid email address."));

/** Same pattern the backend enforces on registration (`auth.validation.ts`). */
const phone = z
  .string()
  .trim()
  .min(1, "Enter a phone number renters can reach you on.")
  .regex(
    /^\+?[0-9\s-]{7,20}$/,
    "Use 7–20 digits; spaces, dashes and a leading + are fine.",
  );

const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Passwords cannot be longer than 72 characters.")
  .regex(/[a-zA-Z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

/**
 * What the new account is for. The backend ties this to the account's role:
 * only customers can place rental orders and only providers can list gear.
 */
export const accountTypes = [
  {
    value: "renter",
    label: "I need gear",
    description: "Browse and rent items from people on your campus.",
    role: "CUSTOMER",
  },
  {
    value: "provider",
    label: "I have gear",
    description: "List what you own and earn from it between uses.",
    role: "PROVIDER",
  },
] as const satisfies readonly {
  value: string;
  label: string;
  description: string;
  role: RegistrableRole;
}[];

export type AccountType = (typeof accountTypes)[number]["value"];

/** The backend role each account type registers as. */
export function roleForAccountType(accountType: AccountType): RegistrableRole {
  return accountTypes.find((option) => option.value === accountType)!.role;
}

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name.")
      .max(60, "That name is too long."),
    email,
    phone,
    accountType: z.enum(
      accountTypes.map((option) => option.value),
      "Choose how you plan to use Campus Gear.",
    ),
    password,
    confirmPassword: z.string().min(1, "Re-enter your password."),
    // A refined boolean rather than `z.literal(true)`: literal narrows the
    // field's type to `true`, which the unchecked `false` default could not
    // satisfy. The rule is identical, the form types stay honest.
    acceptTerms: z
      .boolean()
      .refine((accepted) => accepted, {
        message: "Accept the terms to create an account.",
      }),
  })
  // Reported on the confirmation field rather than the form root, so the
  // message appears next to the input the reader has to correct.
  .refine((values) => values.password === values.confirmPassword, {
    message: "Both passwords must match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  // Length rules belong on sign-up only: an existing password that predates a
  // rule change should still be accepted and rejected by the server, not by a
  // client-side check that locks the user out of their own account.
  password: z.string().min(1, "Enter your password."),
  rememberMe: z.boolean(),
});

export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
