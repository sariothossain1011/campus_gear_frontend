import { TriangleAlert } from "lucide-react";

/**
 * Form-level error banner — for failures that describe the whole submission
 * (rejected credentials, an email already registered) rather than one field.
 *
 * `role="alert"` so it is announced the moment it renders: it typically
 * appears after a submit, when focus is still on the button and the user has
 * no reason to look back up the form.
 */
export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-3 border border-destructive/40 bg-destructive/8 px-4 py-3.5 text-sm leading-6 text-destructive"
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-4.5 shrink-0" />
      {children}
    </p>
  );
}
