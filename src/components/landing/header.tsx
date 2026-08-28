"use client";

import { BrandMark } from "@/components/shared/barnd-mark";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/landing-data";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The panel is a scroll-locking overlay on small screens; Escape closes it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/85 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "border-ink/15" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:min-h-20 sm:px-8">
        <BrandMark compact />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-underline py-1 text-sm font-semibold text-ink/75 transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="nav-underline py-1 text-sm font-semibold text-ink/75 transition-colors hover:text-ink"
          >
            Login
          </Link>
          <Button asChild variant="primary" size="compact">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </Button>
      </div>

      {/* Kept mounted so the panel is always addressable by aria-controls. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink/15 bg-paper lg:hidden"
      >
        <nav aria-label="Mobile" className="px-5 py-5 sm:px-8">
          <ul className="flex flex-col divide-y divide-ink/10">
            {[...primaryNav, { label: "Login", href: "/login" }].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center font-display text-2xl font-black uppercase tracking-[-0.02em] text-ink hover:text-signal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild variant="primary" size="lg" className="mt-6 w-full">
            <Link href="/signup" onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
