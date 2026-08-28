"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/** Square check box — no rounding, filled with the accent when selected. */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer grid size-5 shrink-0 place-items-center rounded-none border border-input bg-card text-accent-foreground",
        "transition-[color,background-color,border-color,box-shadow] duration-200 outline-none",
        "hover:border-foreground/45",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-items-center text-current"
      >
        <Check aria-hidden="true" className="size-3.5" strokeWidth={3.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
