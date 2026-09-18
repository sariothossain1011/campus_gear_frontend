"use client";

import { LogOut, Menu, MoveLeft, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/shared/barnd-mark";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/validations/types";

import { DASHBOARD_NAV, ROLE_LABEL } from "../_config/navigation";

type DashboardShellProps = {
  user: { name: string; email: string; role: Role };
  children: React.ReactNode;
};

function isActive(pathname: string, href: string, exact?: boolean) {
  if (href.includes("#")) return false;
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CG"
  );
}

function NavLinks({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={`${ROLE_LABEL[role]} dashboard`}>
      <ul className="flex flex-col gap-1">
        {DASHBOARD_NAV[role].map((item, index) => {
          const active = isActive(pathname, item.href, item.exact);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center gap-3 border-l-2 px-4 text-sm font-bold transition-colors",
                  active
                    ? "border-lime bg-paper/10 text-lime"
                    : "border-transparent text-paper/65 hover:border-orange hover:bg-paper/5 hover:text-paper",
                )}
              >
                <span aria-hidden="true" className="w-5 font-mono text-[0.6rem] opacity-55">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <item.icon aria-hidden="true" className="size-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function UserCard({ user }: { user: DashboardShellProps["user"] }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="surface-accent grid size-10 shrink-0 place-items-center bg-orange font-mono text-xs font-bold text-ink"
      >
        {initialsOf(user.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-paper">{user.name}</p>
        <p className="truncate text-xs text-paper/55">{user.email}</p>
      </div>
    </div>
  );
}

function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction} className={className}>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-paper/70 transition-colors hover:text-lime"
      >
        <LogOut aria-hidden="true" className="size-4" />
        Log out
      </button>
    </form>
  );
}

/**
 * Frame for every /dashboard page: a dark rail with role-specific navigation
 * on desktop, collapsing to a disclosure panel under `lg`.
 */
export function DashboardShell({ user, children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="min-h-dvh bg-paper text-ink lg:grid lg:grid-cols-[18rem_1fr]">
      <a
        href="#main-content"
        className="skip-link sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:font-mono focus-visible:text-xs focus-visible:font-bold focus-visible:uppercase focus-visible:tracking-[0.16em] focus-visible:text-paper"
      >
        Skip to content
      </a>

      {/* Desktop rail */}
      <aside className="surface-inverse sticky top-0 hidden h-dvh flex-col border-r border-paper/12 bg-background text-foreground lg:flex">
        <div className="border-b border-paper/12 px-6 py-6">
          <BrandMark inverse compact />
          <p className="mt-6 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-orange">
            {ROLE_LABEL[user.role]} dashboard
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <NavLinks role={user.role} />
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/12 p-5">
          <UserCard user={user} />
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-paper/70 transition-colors hover:text-lime"
            >
              <MoveLeft aria-hidden="true" className="size-3.5" />
              Site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile bar */}
      <header className="surface-inverse sticky top-0 z-50 border-b border-paper/12 bg-background text-foreground lg:hidden">
        <div className="flex min-h-16 items-center justify-between gap-4 px-5 sm:px-8">
          <BrandMark inverse compact />
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-expanded={open}
            aria-controls="dashboard-mobile-nav"
            aria-label={open ? "Close dashboard menu" : "Open dashboard menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </Button>
        </div>

        <div
          id="dashboard-mobile-nav"
          hidden={!open}
          className="border-t border-paper/12 px-2 pb-5 pt-3"
        >
          <p className="px-4 pb-3 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-orange">
            {ROLE_LABEL[user.role]} dashboard
          </p>
          <NavLinks role={user.role} onNavigate={() => setOpen(false)} />
          <div className="mt-4 flex flex-col gap-3 border-t border-paper/12 px-4 pt-5">
            <UserCard user={user} />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="min-w-0">
        {children}
      </main>
    </div>
  );
}
