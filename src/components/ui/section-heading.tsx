import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small mono label above the heading, matching the 404 page's kicker. */
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Heading level, so each section keeps a correct document outline. */
  as?: "h2" | "h3";
  align?: "start" | "center";
  /**
   * The default rust kicker has too little contrast on the dark surfaces, so
   * those sections switch to lime — the pairing error.tsx already uses.
   */
  tone?: "default" | "inverse";
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  lead,
  as: Tag = "h2",
  align = "start",
  tone = "default",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "max-w-2xl",
        centered && "mx-auto text-center",
        className,
      )}
    >
      <p
        className={cn(
          "flex items-center gap-3 font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em]",
          tone === "inverse" ? "text-lime" : "text-signal",
          centered && "justify-center",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "h-px w-6",
            tone === "inverse" ? "bg-lime/50" : "bg-signal/50",
          )}
        />
        {kicker}
      </p>
      <Tag className="mt-4 font-display text-[clamp(2.1rem,5.2vw,3.75rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-balance">
        {title}
      </Tag>
      {lead ? (
        <p
          className={cn(
            "mt-5 text-sm leading-6 text-foreground/65 sm:text-base sm:leading-7",
            centered && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
