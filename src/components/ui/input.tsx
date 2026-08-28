import { cn } from "@/lib/utils";

/**
 * Square-cornered text input.
 *
 * The border is the control here — there is no fill change on focus, matching
 * the outline buttons — and `aria-invalid` drives the error styling so the
 * visual state cannot drift from what assistive tech is told.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex min-h-12 w-full rounded-none border border-input bg-card px-4 py-3 text-sm text-foreground",
        "transition-[color,border-color,box-shadow] duration-200 outline-none",
        "placeholder:text-foreground/40",
        "hover:border-foreground/45",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
