import { cn } from "@/lib/utils";
import type { Step } from "@/lib/landing-data";

type StepCardProps = {
  item: Step;
  /** Inverted cards sit on the dark provider column. */
  variant?: "student" | "provider";
};

export function StepCard({ item, variant = "student" }: StepCardProps) {
  const { icon: Icon, step, title, description } = item;
  const isProvider = variant === "provider";

  return (
    <li className="flex gap-4 sm:gap-5">
      <span
        aria-hidden="true"
        className={cn(
          "surface-accent grid size-12 shrink-0 place-items-center font-display text-xl font-black",
          isProvider ? "bg-orange text-ink" : "bg-lime text-ink",
        )}
      >
        {step}
      </span>

      <div className="min-w-0">
        <h4 className="flex items-center gap-2 font-display text-xl font-black uppercase leading-none tracking-[-0.02em]">
          <Icon aria-hidden="true" className="size-4 shrink-0 opacity-70" />
          {title}
        </h4>
        <p className="mt-2 text-sm leading-6 text-foreground/65">{description}</p>
      </div>
    </li>
  );
}