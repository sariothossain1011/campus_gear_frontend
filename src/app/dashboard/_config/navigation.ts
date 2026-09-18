import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Search, UserRound } from "lucide-react";

import { ROLE_HOME } from "@/lib/auth/routes";
import type { Role } from "@/lib/validations/types";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Active only on this exact path, not on nested ones. */
  exact?: boolean;
};

export const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: "Renter",
  PROVIDER: "Provider",
  ADMIN: "Admin",
};

const ACCOUNT: DashboardNavItem = {
  label: "Account",
  href: "/dashboard/account",
  icon: UserRound,
};

function overview(role: Role): DashboardNavItem {
  return { label: "Overview", href: ROLE_HOME[role], icon: LayoutDashboard, exact: true };
}

/**
 * Sidebar entries per role. Add a register here (orders, payments, inventory,
 * users…) once its page exists — never link to a route that isn't built.
 */
export const DASHBOARD_NAV: Record<Role, DashboardNavItem[]> = {
  CUSTOMER: [
    overview("CUSTOMER"),
    { label: "Find gear", href: "/#featured", icon: Search },
    ACCOUNT,
  ],
  PROVIDER: [overview("PROVIDER"), ACCOUNT],
  ADMIN: [overview("ADMIN"), ACCOUNT],
};
