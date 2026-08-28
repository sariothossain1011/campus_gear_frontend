import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Field label in the small mono caps the rest of the site uses for kickers, so
 * a form reads as part of the same catalogue system as the listing cards.
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-foreground/75 select-none",
        "group-has-disabled/field:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
