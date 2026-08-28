import Link from "next/link";
import { MoveLeft } from "lucide-react";

import { BrandMark } from "@/components/shared/barnd-mark";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  /** Small mono label above the rail heading. */
  kicker: string;
  /** Display heading for the dark rail, not the form. */
  title: React.ReactNode;
  lead: string;
  /** Short proof points listed down the rail, numbered like a checklist. */
  highlights: readonly string[];
  /** Heading and supporting copy for the form column. */
  formTitle: string;
  formLead: React.ReactNode;
  children: React.ReactNode;
  /** Sign-in / sign-up cross-link rendered under the form. */
  footer: React.ReactNode;
};

/**
 * Two-column frame shared by the login and sign-up routes.
 *
 * The left rail is the inverse surface the error page uses — dark pine with
 * the route grid over it — and carries the brand voice, so the form column
 * stays plain paper and uninterrupted. Below `lg` the rail is dropped rather
 * than stacked: on a phone it would push the first input a full screen down,
 * and its content is decorative reassurance, not instruction.
 */
export function AuthShell({
  kicker,
  title,
  lead,
  highlights,
  formTitle,
  formLead,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <aside className="surface-inverse relative hidden overflow-hidden bg-background px-10 py-14 text-foreground lg:flex lg:flex-col xl:px-16">
        <div
          aria-hidden="true"
          className="route-grid absolute inset-0 opacity-25"
        />

        <div className="relative flex h-full flex-col">
          <BrandMark inverse />

          {/* Centred rather than bottom-anchored: the sign-up form is taller
              than the viewport, and a bottom-anchored rail would push this
              message below the fold on exactly the page that needs it. */}
          <div className="my-auto py-16">
            <p className="flex items-center gap-3 font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-lime">
              <span aria-hidden="true" className="h-px w-6 bg-lime/50" />
              {kicker}
            </p>

            <p className="mt-5 font-display text-[clamp(2.6rem,4.6vw,4.2rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-balance">
              {title}
            </p>

            <p className="mt-6 max-w-md text-sm leading-7 text-paper/65">
              {lead}
            </p>

            <ul className="mt-12 flex flex-col gap-px border-t border-paper/20">
              {highlights.map((highlight, index) => (
                <li
                  key={highlight}
                  className="flex items-center gap-4 border-b border-paper/20 py-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-orange"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-6 text-paper/80">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main
        id="main-content"
        tabIndex={-1}
        className="relative flex flex-col overflow-hidden bg-paper px-5 py-10 text-ink sm:px-8 sm:py-14 lg:px-14 lg:py-16"
      >
        <div
          aria-hidden="true"
          className="topo-lines absolute inset-0 opacity-25 lg:hidden"
        />

        <div className="relative flex items-center justify-between gap-4">
          <span className="lg:hidden">
            <BrandMark compact />
          </span>
          <Link
            href="/"
            className="nav-underline ml-auto inline-flex min-h-11 items-center gap-2 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-ink"
          >
            <MoveLeft aria-hidden="true" className="size-3.5" />
            Back to site
          </Link>
        </div>

        <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-[clamp(2.4rem,6vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-balance">
            {formTitle}
          </h1>
          <p className="mt-4 text-sm leading-6 text-ink/65">{formLead}</p>

          <div className="mt-10">{children}</div>

          <p className="mt-8 border-t border-ink/15 pt-6 text-sm text-ink/65">
            {footer}
          </p>
        </div>
      </main>
    </div>
  );
}

/** Inline text link styled for the shell's footer row. */
export function AuthLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-bold text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal",
        className,
      )}
    >
      {children}
    </Link>
  );
}
