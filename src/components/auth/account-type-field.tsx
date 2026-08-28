import { accountTypes } from "@/lib/auth-schemas";

type AccountTypeFieldProps = {
  /** Spread `register("accountType")` here. */
  registration: React.ComponentProps<"input">;
  error?: string;
};

/**
 * The "why are you here" choice, as two picker cards.
 *
 * Built on native radio inputs rather than buttons: the browser gives arrow-key
 * navigation, a single tab stop, and the correct grouping announcement for
 * free. The inputs are visually hidden but still focusable, and the card is
 * styled from their state through `peer-*`, so the focus ring lands on the
 * card the keyboard is actually on.
 */
export function AccountTypeField({
  registration,
  error,
}: AccountTypeFieldProps) {
  const legendId = "account-type-legend";
  const errorId = "account-type-error";

  return (
    // `aria-invalid` and the error reference belong on the group, not on the
    // individual radios — a radio does not support them, and the message
    // describes the choice as a whole. The explicit `radiogroup` role replaces
    // the fieldset's default `group`, so the legend is named explicitly.
    <fieldset
      role="radiogroup"
      aria-labelledby={legendId}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      className="flex flex-col gap-3"
    >
      <legend
        id={legendId}
        className="mb-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-foreground/75"
      >
        What brings you here?
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {accountTypes.map((option) => (
          <label
            key={option.value}
            className="group/option relative flex cursor-pointer flex-col gap-1.5 border border-input bg-card p-4 transition-colors duration-200 hover:border-foreground/45 has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring/30"
          >
            <input
              {...registration}
              type="radio"
              value={option.value}
              className="peer sr-only"
            />
            <span className="font-display text-lg font-black uppercase leading-none tracking-[-0.02em]">
              {option.label}
            </span>
            <span className="text-xs leading-5 opacity-70">
              {option.description}
            </span>
          </label>
        ))}
      </div>

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
    </fieldset>
  );
}
