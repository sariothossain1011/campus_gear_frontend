import { useId } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Props the field hands back to whatever control it wraps. Spreading these is
 * what wires the label, the hint, and the error message to the input for
 * assistive technology — a control that ignores them is still visually
 * labelled but silent to a screen reader.
 */
export type FieldControlProps = {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
};

type FieldProps = {
  label: React.ReactNode;
  /** Validation message for the control, when it has failed. */
  error?: string;
  /** Static helper text, shown whether or not the field is in error. */
  hint?: React.ReactNode;
  /** Rendered at the end of the label row — "Forgot password?", for example. */
  action?: React.ReactNode;
  className?: string;
  children: (props: FieldControlProps) => React.ReactNode;
};

/**
 * Label + control + message group.
 *
 * Ids are generated rather than passed in so no caller can accidentally
 * duplicate one across the two forms, and the error is marked `role="alert"`
 * so it is announced when it appears rather than only when the field is next
 * focused.
 */
export function Field({
  label,
  error,
  hint,
  action,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Only reference the descriptions that are actually on the page: pointing
  // aria-describedby at a missing id makes the whole attribute unreliable.
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("group/field flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>

      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}

      {hint ? (
        <p id={hintId} className="text-xs leading-5 text-foreground/55">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-2 font-mono text-[0.68rem] font-bold leading-5 text-destructive"
        >
          <span
            aria-hidden="true"
            className="mt-1.5 size-1.5 shrink-0 bg-destructive"
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}
