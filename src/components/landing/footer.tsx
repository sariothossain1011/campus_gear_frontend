import { BrandMark } from "@/components/shared/barnd-mark";
import { footerColumns } from "@/lib/landing-data";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="surface-inverse relative overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="route-grid absolute inset-0 opacity-20"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr] lg:gap-16">
          <div>
            <BrandMark inverse />
            <p className="mt-6 max-w-xs text-sm leading-6 text-paper/65">
              The campus marketplace for renting the things you need.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-lime">
                  {column.title}
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-paper/70 transition-colors hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-paper/50">
            © 2026 Campus Gear. All rights reserved.
          </p>
          <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-paper/50">
            Made on campus, in Dhaka
          </p>
        </div>
      </div>
    </footer>
  );
}
