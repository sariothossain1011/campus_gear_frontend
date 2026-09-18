import { ArrowRight } from "lucide-react";
import Link from "next/link";

type LandingNoticeProps = {
  message: string;
  /** Where to go instead; defaults to the full catalog. */
  href?: string;
  action?: string;
};

/**
 * Stand-in for a landing section whose live data is missing — failed to load,
 * or genuinely empty. Says so plainly instead of rendering placeholder gear.
 */
export function LandingNotice({
  message,
  href = "/gear",
  action = "Browse the catalog",
}: LandingNoticeProps) {
  return (
    <div className="mt-12 flex flex-col items-start gap-4 border border-dashed border-border bg-card px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
      <p role="status" className="text-sm leading-6 text-foreground/70">
        {message}
      </p>
      <Link
        href={href}
        className="nav-underline inline-flex shrink-0 items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-signal"
      >
        {action}
        <ArrowRight aria-hidden="true" className="size-3.5" />
      </Link>
    </div>
  );
}
