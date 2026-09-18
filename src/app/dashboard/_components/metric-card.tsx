import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TONES = {
  paper: "bg-card text-ink",
  sun: "bg-gear-sun text-foreground",
  sky: "bg-gear-sky text-foreground",
  lime: "surface-accent bg-lime text-ink",
  pine: "surface-inverse bg-background text-foreground",
} as const;

type MetricCardProps = {
  label: string;
  /** Null when the count could not be loaded — shown as a dash, not a zero. */
  value: number | null;
  detail: string;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
};

export function MetricCard({ label, value, detail, icon: Icon, tone = "paper" }: MetricCardProps) {
  return (
    <div className={cn("flex min-h-44 flex-col justify-between gap-6 border border-ink/15 p-6", TONES[tone])}>
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] opacity-75">
          {label}
        </p>
        <Icon aria-hidden="true" className="size-5 shrink-0 opacity-70" />
      </div>
      <div>
        <p className="font-display text-6xl font-black leading-none tracking-[-0.04em]">
          {value === null ? (
            <>
              <span aria-hidden="true">—</span>
              <span className="sr-only">Unavailable</span>
            </>
          ) : (
            value.toLocaleString("en")
          )}
        </p>
        <p className="mt-3 text-xs leading-5 opacity-70">{detail}</p>
      </div>
    </div>
  );
}
