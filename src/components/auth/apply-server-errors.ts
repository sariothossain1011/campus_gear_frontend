import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import type { AuthActionResult } from "@/lib/validations/types";

/**
 * Puts a failed auth action's messages on the form: each field error beside
 * the input it names, and the overall message on `root`. Returns true when at
 * least one field error landed, so the caller can decide whether the banner is
 * still needed.
 */
export function applyServerErrors<TValues extends FieldValues>(
  result: AuthActionResult,
  fields: readonly Path<TValues>[],
  setError: UseFormSetError<TValues>,
) {
  let placedOnField = false;

  for (const field of fields) {
    const message = result.fieldErrors?.[field]?.[0];
    if (!message) continue;

    setError(field, { type: "server", message }, { shouldFocus: !placedOnField });
    placedOnField = true;
  }

  setError("root", { type: "server", message: result.message });
  return placedOnField;
}
