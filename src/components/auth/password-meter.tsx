"use client";

import { cn } from "@/lib/utils";

/**
 * The four rules the sign-up schema enforces, in the order they are checked.
 * Scoring off the same conditions keeps the meter honest: a full bar always
 * means the field will pass validation.
 */
const rules = [
  { label: "8+ characters", test: (value: string) => value.length >= 8 },
  { label: "A letter", test: (value: string) => /[a-zA-Z]/.test(value) },
  { label: "A number", test: (value: string) => /[0-9]/.test(value) },
  {
    label: "A symbol",
    test: (value: string) => /[^a-zA-Z0-9]/.test(value),
  },
] as const;

/** The last rule is a recommendation rather than a requirement. */
const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

const segmentTone = [
  "bg-foreground/15",
  "bg-destructive",
  "bg-orange",
  "bg-gear-sun",
  "bg-success",
] as const;

/**
 * Blocky four-segment strength read-out shown under the sign-up password.
 *
 * Purely advisory: it mirrors validation state rather than blocking anything,
 * so it is `aria-live="polite"` on the summary line only — announcing every
 * segment on every keystroke would be noise.
 */
export function PasswordMeter({ value }: { value: string }) {
  const passed = rules.filter((rule) => rule.test(value)).length;
  const score = value.length === 0 ? 0 : passed;

  return (
    <div className="mt-1">
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="flex flex-1 gap-1.5">
          {rules.map((rule, index) => (
            <span
              key={rule.label}
              className={cn(
                "h-1.5 flex-1 transition-colors duration-300",
                index < score ? segmentTone[score] : "bg-foreground/15",
              )}
            />
          ))}
        </div>
        <p
          aria-live="polite"
          className="min-w-18 text-right font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em] text-foreground/60"
        >
          {value.length > 0 ? strengthLabels[score] : ""}
        </p>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {rules.map((rule) => {
          const met = value.length > 0 && rule.test(value);
          return (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-1.5 text-[0.7rem] leading-5 transition-colors",
                met ? "text-success" : "text-foreground/50",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0",
                  met ? "bg-success" : "bg-foreground/25",
                )}
              />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
